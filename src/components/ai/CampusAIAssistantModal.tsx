import { useState, useEffect } from "react";
import { X, Send, ArrowUpRight, Compass } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { answerCampusQuery } from "../../services/campusGuide";
interface Message {
  text: string;
  sender: "user" | "guide";
  tab?: string;
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
  } = useApp();
  const { currentUser } = useAuth();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    setMessages([]);
    setQuery("");
  }, [currentUser?.id]);
  if (!isAIAssistantOpen) return null;
  function send(text: string) {
    if (!text.trim()) return;
    const answer = answerCampusQuery(text, {
      user: currentUser,
      notices,
      events,
      exams,
      career,
      facilities,
    });
    setMessages((previous) => [
      ...previous,
      { text: text.trim(), sender: "user" },
      { text: answer.text, tab: answer.tab, sender: "guide" },
    ]);
    setQuery("");
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
            <h2 id="guide-title">Your campus guide</h2>
            <p>Quick answers from the local demo data</p>
          </div>
          <button
            aria-label="Close campus guide"
            onClick={() => setIsAIAssistantOpen(false)}
          >
            <X size={20} />
          </button>
        </header>
        <div className="co-guide-messages">
          <p className="co-guide-intro">
            Choose a topic or type a question. This is a keyword guide, with no
            AI service connected.
          </p>
          <div className="co-guide-topics">
            {["Notices", "Events", "Exams", "Careers", "Library"].map(
              (topic) => (
                <button key={topic} onClick={() => send(topic)}>
                  {topic}
                </button>
              ),
            )}
          </div>
          {messages.map((m, i) => (
            <div key={i} className={`co-guide-message ${m.sender}`}>
              <p>{m.text}</p>
              {m.tab && (
                <button
                  onClick={() => {
                    setCurrentTab(m.tab!);
                    setIsAIAssistantOpen(false);
                  }}
                >
                  View details <ArrowUpRight size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(query);
          }}
        >
          <input
            aria-label="Ask the campus guide"
            placeholder="What are you looking for?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            aria-label="Send question"
            type="submit"
            disabled={!query.trim()}
          >
            <Send size={18} />
          </button>
        </form>
      </section>
    </div>
  );
};
