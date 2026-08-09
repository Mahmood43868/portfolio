"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, Loader2, MessageSquare, X } from "lucide-react";
import { profile } from "@/content/profile";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What's his strongest stack?",
  "Has he used PostgreSQL in a real project?",
  "Walk me through his best project.",
  "Is he available right now?",
];

const firstName = profile.name.split(" ")[0];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  // Keep the transcript pinned to the newest token.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else launcherRef.current?.focus();
  }, [open]);

  // Escape closes; Tab cycles inside the panel.
  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;

      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;

    setError("");
    setInput("");
    setBusy(true);

    const history: Msg[] = [...messages, { role: "user", content: question }];
    // Render the user turn plus an empty assistant turn we stream into.
    setMessages([...history, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "The assistant is unavailable right now.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: acc }]);
      }

      if (!acc.trim()) throw new Error("Empty response — please try again.");
    } catch (err) {
      // Drop the empty assistant bubble and surface the reason instead.
      setMessages(history);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div data-noprint>
      {/* Launcher */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ask a question about my resume"
        className={`fixed right-5 bottom-5 z-40 inline-flex items-center gap-2.5 rounded-2xl border border-line-strong bg-raised py-3 pr-4 pl-3.5 shadow-card transition-all duration-300 hover:-translate-y-0.5 sm:right-8 sm:bottom-8 ${
          open ? "pointer-events-none translate-y-2 opacity-0" : "opacity-100"
        }`}
      >
        <span className="relative grid size-7 place-items-center rounded-lg bg-accent text-accent-fg">
          <MessageSquare className="size-4" strokeWidth={2} />
        </span>
        <span className="text-sm font-medium">Ask about me</span>
      </button>

      {/* Panel */}
      {open ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-none"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Ask about ${profile.name}`}
            className="animate-rise fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col overflow-hidden rounded-t-3xl border border-line bg-bg shadow-card sm:inset-x-auto sm:right-8 sm:bottom-8 sm:h-[min(34rem,80dvh)] sm:w-[26rem] sm:rounded-3xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
              <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-fg">
                <Bot className="size-4" strokeWidth={2} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold tracking-tight">Ask about {firstName}</p>
                <p className="font-mono text-[0.6875rem] text-subtle">
                  Answers grounded in the resume
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-raised hover:text-fg"
              >
                <X className="size-4" strokeWidth={1.75} />
              </button>
            </div>

            {/* Transcript */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
              {messages.length === 0 ? (
                <div>
                  <p className="text-sm leading-relaxed text-muted">
                    Hi — I can answer questions about {firstName}&apos;s background, projects and
                    skills. Ask me anything, or start here:
                  </p>
                  <ul className="mt-4 space-y-2">
                    {SUGGESTIONS.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onClick={() => send(s)}
                          className="w-full rounded-xl border border-line bg-raised px-3.5 py-2.5 text-left text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div aria-live="polite" className="space-y-4">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                        m.role === "user"
                          ? "rounded-br-md bg-fg text-bg"
                          : "rounded-bl-md border border-line bg-raised"
                      }`}
                    >
                      {m.content || (
                        <Loader2 className="size-4 animate-spin text-subtle" strokeWidth={2} />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {error ? (
                <p role="alert" className="rounded-xl bg-sunken px-3.5 py-2.5 text-sm text-signal">
                  {error}
                </p>
              ) : null}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="border-t border-line p-3"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-line bg-raised p-2 focus-within:border-accent">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send(input);
                    }
                  }}
                  rows={1}
                  maxLength={500}
                  placeholder={`Ask about ${firstName}'s experience…`}
                  aria-label="Your question"
                  className="max-h-28 min-h-[1.75rem] flex-1 resize-none bg-transparent px-1.5 py-1 text-sm outline-none placeholder:text-subtle"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label="Send question"
                  className="grid size-8 shrink-0 place-items-center rounded-xl bg-accent text-accent-fg transition-opacity disabled:opacity-35"
                >
                  {busy ? (
                    <Loader2 className="size-4 animate-spin" strokeWidth={2} />
                  ) : (
                    <ArrowUp className="size-4" strokeWidth={2.5} />
                  )}
                </button>
              </div>
              <p className="mt-2 px-1 font-mono text-[0.625rem] text-subtle">
                AI-generated · verify anything important with {firstName} directly
              </p>
            </form>
          </div>
        </>
      ) : null}
    </div>
  );
}
