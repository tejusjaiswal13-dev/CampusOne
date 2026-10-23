// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
vi.mock("../src/services/api", () => ({
  api: vi.fn().mockRejectedValue(new Error("AI unavailable")),
}));
import { askCampus } from "../src/services/aiService";
it("API failure falls back to the labelled local keyword guide", async () => {
  const result = await askCampus("exams", "en", "online", {
    user: null,
    notices: [],
    events: [],
    exams: [],
    career: [],
    facilities: [],
  });
  expect(result.mode).toBe("basic");
  expect(result.answer).toContain("No upcoming exams");
  expect(result.error).toContain("AI unavailable");
});
