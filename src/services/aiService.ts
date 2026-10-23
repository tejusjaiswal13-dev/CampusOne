import { api } from "./api";
import { answerCampusQuery, type GuideData } from "./campusGuide";
export interface AISource {
  type: "notice" | "event" | "exam" | "career";
  id: string;
  title: string;
}
export interface AIAnswer {
  answer: string;
  sources: AISource[];
  mode: "ai" | "grounded" | "basic";
  error?: string;
  tab?: string;
}
export async function askCampus(
  question: string,
  language: "auto" | "en" | "hi",
  mode: "online" | "demo",
  data: GuideData,
): Promise<AIAnswer> {
  if (mode === "online") {
    try {
      return await api<AIAnswer>("/ai/ask", "POST", { question, language });
    } catch (error) {
      const fallback = answerCampusQuery(question, data);
      return {
        answer: fallback.text,
        sources: [],
        mode: "basic",
        error: error instanceof Error ? error.message : "AI unavailable",
        tab: fallback.tab,
      };
    }
  }
  const fallback = answerCampusQuery(question, data);
  return {
    answer: fallback.text,
    sources: [],
    mode: "basic",
    tab: fallback.tab,
  };
}
