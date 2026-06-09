"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "model";
  parts: string;
}

const QUICK_ACTIONS = [
  { label: "Draft newsletter", prompt: "Draft a newsletter email for our subscribers highlighting the best new opportunities this week" },
  { label: "WhatsApp post", prompt: "Write a short WhatsApp post (under 500 chars) to share the best opportunities from this week" },
  { label: "Find scholarships", prompt: "Show me all current scholarship opportunities sorted by deadline" },
  { label: "Content ideas", prompt: "Suggest 5 new opportunities we should add to the platform based on current trends" },
  { label: "SEO review", prompt: "Review our most recent 3 opportunities and suggest SEO improvements for their titles and descriptions" },
];

export function AdminChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", parts: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to get response");
      }

      const data = await res.json();
      setMessages([...newMessages, { role: "model", parts: data.reply }]);
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand dark:bg-accent/10 dark:text-accent">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
          </svg>
        </div>
        <div>
          <h2 className="font-display text-base font-bold text-ink dark:text-white">Link-Up Assistant</h2>
          <p className="text-xs text-ink-mute dark:text-slate-400">AI-powered admin helper</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Online
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 && !loading && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 dark:bg-accent/10">
              <svg className="h-8 w-8 text-brand dark:text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-bold text-ink dark:text-white">How can I help?</h3>
            <p className="mt-1 max-w-sm text-sm text-ink-mute dark:text-slate-400">
              I can draft newsletters, write WhatsApp posts, find opportunities, suggest content ideas, and more.
            </p>
            <div className="mt-6 grid max-w-lg gap-2 sm:grid-cols-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-ink transition hover:border-brand/30 hover:bg-brand/5 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:border-accent/30 dark:hover:bg-accent/5"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-brand text-white dark:bg-accent dark:text-slate-900"
                : "bg-slate-100 text-ink dark:bg-slate-800 dark:text-slate-200"
            }`}>
              <div className="whitespace-pre-wrap break-words">{msg.parts}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="mb-4 flex justify-start">
            <div className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-slate-200 px-5 py-4 dark:border-slate-700">
        <div className="flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask me anything about the platform..."
            rows={1}
            className="input min-h-[44px] max-h-32 flex-1 resize-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary h-11 w-11 shrink-0 items-center justify-center disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-[11px] text-ink-mute dark:text-slate-500">
          Press Enter to send · Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}
