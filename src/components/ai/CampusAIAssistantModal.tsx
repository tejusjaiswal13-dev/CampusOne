import { useState } from "react";
import { X, Send, ArrowUpRight, Compass } from "lucide-react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";
import {
  askCampus,
  type AIAnswer,
  type AISource,
} from "../../services/aiService";
interface Message {
  id: string;
  text: string;
  sender: "user" | "guide";
  result?: AIAnswer;
}
export const CampusAIAssistantModal = () => {
  const {
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    notices,
    events,
    exams,
    career,
    facilities,
    setCurrentTab,
    setSelectedNotice,
    setSelectedEvent,
  } = useApp();
  const { currentUser, mode } = useAuth();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [language, setLanguage] = useState<"auto" | "en" | "hi">("auto");
  const [lastQuestion, setLastQuestion] = useState("");
  if (!isAIAssistantOpen) return null;
  async function send(text: string) {
    if (!text.trim() || busy) return;
    setBusy(true);
    setLastQuestion(text);
    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), text, sender: "user" },
    ]);
    setQuery("");
    try {
      const result = await askCampus(text, language, mode, {
        user: currentUser,
        notices,
        events,
        exams,
        career,
        facilities,
      });
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          text: result.answer,
          sender: "guide",
          result,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }
  function openSource(source: AISource) {
    if (source.type === "notice") {
      setSelectedNotice(notices.find((n) => n.id === source.id) || null);
      setCurrentTab("notices");
    } else if (source.type === "event") {
      setSelectedEvent(events.find((e) => e.id === source.id) || null);
      setCurrentTab("events");
    } else setCurrentTab(source.type === "exam" ? "exams" : "career");
    setIsAIAssistantOpen(false);
  }
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        className="co-guide"
      >
        <header>
          <Compass size={23} />
          <div>
            <h2 id="guide-title">Campus Assistant</h2>
            <p>
              {mode === "demo"
                ? "Basic mode · offline keyword guide"
                : "Answers from your permitted campus records"}
            </p>
          </div>
          <button
            aria-label="Close campus guide"
            onClick={() => setIsAIAssistantOpen(false)}
          >
            <X size={20} />
          </button>
        </header>
        <div className="co-guide-messages" aria-live="polite">
          <p className="co-guide-intro">
            Questions and relevant campus text are sent to the configured AI
            provider. Do not enter personal or sensitive information. Verify
            important dates with your department.
          </p>
          <label>
            Answer language{" "}
            <select
              aria-label="Answer language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as typeof language)}
            >
              <option value="auto">Automatic</option>
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </label>
          <div className="co-guide-topics">
            {[
              "Notices",
              "Exam schedule",
              "Workshop registration",
              "इंटर्नशिप की अंतिम तिथि",
            ].map((topic) => (
              <button key={topic} disabled={busy} onClick={() => send(topic)}>
                {topic}
              </button>
            ))}
          </div>
          {messages.map((m) => (
            <div key={m.id} className={`co-guide-message ${m.sender}`}>
              <p>{m.text}</p>
              {m.result && (
                <small>
                  {m.result.mode === "basic"
                    ? "Basic mode · keyword lookup"
                    : m.result.mode === "ai"
                      ? "AI answer · check sources"
                      : "No supported answer found"}
                </small>
              )}
              {m.result?.sources.map((s) => (
                <button key={`${s.type}:${s.id}`} onClick={() => openSource(s)}>
                  {s.title}
                  <ArrowUpRight size={14} />
                </button>
              ))}
              {m.result?.tab && (
                <button
                  onClick={() => {
                    setCurrentTab(m.result!.tab!);
                    setIsAIAssistantOpen(false);
                  }}
                >
                  Browse records
                </button>
              )}
              {m.result?.error && (
                <div role="alert">
                  <p>{m.result.error}</p>
                  <button disabled={busy} onClick={() => send(lastQuestion)}>
                    Retry AI
                  </button>
                </div>
              )}
            </div>
          ))}
          {busy && <p role="status">Looking through campus records…</p>}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(query);
          }}
        >
          <input
            aria-label="Ask the campus guide"
            maxLength={1500}
            placeholder="Ask about your campus…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button aria-label="Send question" disabled={busy || !query.trim()}>
            <Send size={18} />
          </button>
        </form>
      </section>
    </div>
  );
};
