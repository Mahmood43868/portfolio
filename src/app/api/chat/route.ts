import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { buildResumeContext, profile } from "@/content/profile";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Swap to "claude-haiku-4-5" if you'd rather run this cheaply on a public
 * site — the prompt below works unchanged on either model.
 */
const MODEL = "claude-opus-5";

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(40),
});

const firstName = profile.name.split(" ")[0];

const SYSTEM = `You are the assistant on ${profile.name}'s portfolio site. Visitors are usually recruiters, hiring managers, or engineers evaluating ${firstName} for a software role.

Answer questions about ${firstName} using ONLY the resume below. Rules:

- Everything you say must be traceable to the RESUME section. Never invent an employer, job title, date, technology, metric, or project. If a detail isn't in the resume, say so plainly — "that isn't covered in his resume" — and suggest emailing ${profile.email}.
- Speak about ${firstName} in the third person. You are his assistant, not him.
- Keep answers to two or three sentences unless asked to go deeper. Recruiters skim.
- When a project or skill is relevant, name it specifically and cite the concrete number from the resume rather than describing it vaguely.
- Be straightforward about experience level. He is a recent graduate; don't oversell him as senior, and don't apologise for it either.
- Decline politely and briefly if asked anything unrelated to ${firstName}'s professional background — salary expectations, personal life, or general coding help. Redirect to the resume or his email.
- Plain prose only. No markdown, headings, or bullet lists — this renders in a small chat bubble.

RESUME
------
${buildResumeContext()}`;

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "The assistant isn't configured yet. Please use the contact form instead." },
      { status: 503 },
    );
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Counted after validation so a malformed request can't burn a real
  // visitor's question budget.
  const limit = rateLimit("chat", clientIp(req), 12, 60 * 60 * 1000);
  if (!limit.ok) {
    return Response.json(
      { error: "That's a lot of questions! Try again later, or just email me." },
      { status: 429 },
    );
  }

  // Keep the tail of the conversation; the widget is not a long-form chat.
  const messages = parsed.data.messages.slice(-10);

  const client = new Anthropic({ apiKey });

  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 1024,
    // Cached: the system prompt is identical on every request, so after the
    // first call this whole prefix bills at cache-read rates.
    system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
    messages,
    // Opus 5 thinks by default; low effort keeps a chat widget fast and cheap.
    thinking: { type: "adaptive" },
    output_config: { effort: "low" },
    // If a safety classifier declines, retry server-side instead of dead-ending.
    // Remove these two lines if your account isn't enrolled in the beta.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
  });

  const encoder = new TextEncoder();

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        console.error("[chat] stream failed:", err);
        controller.enqueue(
          encoder.encode(
            "\n\nSorry — something went wrong on my end. Please email me instead.",
          ),
        );
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
