import { z } from "zod";
export interface ModelRequest {
  system: string;
  input: string;
}
export interface AIProvider {
  generate(request: ModelRequest): Promise<string>;
}
const text = z.string().min(1).max(30000);
export function createProvider(
  env: NodeJS.ProcessEnv = process.env,
): AIProvider | null {
  const provider = env.AI_PROVIDER,
    key = env.AI_API_KEY,
    model = env.AI_MODEL;
  if (!provider || !key || !model) return null;
  if (!["openai", "gemini", "claude"].includes(provider))
    throw new Error("Unsupported AI_PROVIDER");
  if (!/^[a-zA-Z0-9_.:-]+$/.test(model)) throw new Error("Invalid AI_MODEL");
  return {
    async generate({ system, input }) {
      let url: string,
        headers: Record<string, string> = {
          "Content-Type": "application/json",
        },
        body: unknown;
      if (provider === "openai") {
        url = "https://api.openai.com/v1/chat/completions";
        headers.Authorization = `Bearer ${key}`;
        body = {
          model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: input },
          ],
          response_format: { type: "json_object" },
          max_completion_tokens: 1200,
          store: false,
        };
      } else if (provider === "gemini") {
        url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        headers["x-goog-api-key"] = key;
        body = {
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: input }] }],
          generationConfig: {
            responseMimeType: "application/json",
            maxOutputTokens: 1200,
          },
        };
      } else {
        url = "https://api.anthropic.com/v1/messages";
        headers["x-api-key"] = key;
        headers["anthropic-version"] = "2023-06-01";
        body = {
          model,
          system,
          messages: [{ role: "user", content: input }],
          max_tokens: 1200,
        };
      }
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error("AI provider request failed"); // Never propagate provider bodies or credentials.
      const data: unknown = await response.json();
      if (provider === "openai")
        return z
          .object({
            choices: z
              .array(z.object({ message: z.object({ content: text }) }))
              .min(1),
          })
          .parse(data).choices[0].message.content;
      if (provider === "gemini")
        return z
          .object({
            candidates: z
              .array(
                z.object({
                  content: z.object({
                    parts: z.array(z.object({ text })).min(1),
                  }),
                }),
              )
              .min(1),
          })
          .parse(data)
          .candidates[0].content.parts.map((p) => p.text)
          .join("");
      return z
        .object({
          content: z.array(
            z.object({ type: z.string(), text: text.optional() }),
          ),
        })
        .parse(data)
        .content.filter((p) => p.type === "text")
        .map((p) => p.text)
        .join("");
    },
  };
}
