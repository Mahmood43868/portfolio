import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { profile } from "@/content/profile";

export const runtime = "nodejs";

/** Escape user input before it goes anywhere near an HTML email body. */
function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: Request) {
  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." },
      { status: 400 },
    );
  }

  const { name, email, subject, message, website } = parsed.data;

  // Honeypot tripped — pretend it worked so the bot doesn't retune and retry.
  if (website) return Response.json({ ok: true });

  // Counted only for submissions that would actually send, so someone who
  // mistypes their email a few times doesn't lock themselves out.
  const limit = rateLimit("contact", clientIp(req), 5, 60 * 60 * 1000);
  if (!limit.ok) {
    return Response.json(
      { error: "Too many messages from this address. Please try again later." },
      { status: 429 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? profile.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  // No key configured yet: log it so the form is still demo-able in dev.
  if (!apiKey) {
    console.info("[contact] RESEND_API_KEY not set — message logged instead of sent:", {
      name,
      email,
      subject,
      message,
    });
    return Response.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.6;color:#16191c">
          <h2 style="margin:0 0 4px;font-size:18px">New message from your portfolio</h2>
          <p style="margin:0 0 20px;color:#5c6266;font-size:13px">${esc(subject)}</p>
          <table style="font-size:14px;border-collapse:collapse">
            <tr><td style="padding:4px 16px 4px 0;color:#5c6266">Name</td><td>${esc(name)}</td></tr>
            <tr><td style="padding:4px 16px 4px 0;color:#5c6266">Email</td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #ddd8cd;margin:20px 0" />
          <p style="white-space:pre-wrap;font-size:15px;margin:0">${esc(message)}</p>
        </div>
      `,
      text: `New message from your portfolio\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    });

    if (error) throw new Error(error.message);
    return Response.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] send failed:", err);
    return Response.json(
      { error: `Couldn't send that. Please email me directly at ${profile.email}.` },
      { status: 502 },
    );
  }
}
