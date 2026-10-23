import { useState } from "react";
import { api } from "../../services/api";
export function NoticeDraft({
  apply,
}: {
  apply: (title: string, description: string) => void;
}) {
  const [points, setPoints] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function draft() {
    setBusy(true);
    setError("");
    try {
      const result = await api<{ title: string; description: string }>(
        "/ai/draft",
        "POST",
        { points, language: "en" },
      );
      apply(result.title, result.description);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Draft failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="p-3 bg-slate-50 rounded-xl space-y-2">
      <label className="block">
        Rough points for AI draft
        <textarea
          aria-label="Rough points for AI draft"
          className="w-full border rounded-xl p-2"
          value={points}
          maxLength={4000}
          onChange={(e) => setPoints(e.target.value)}
          placeholder="Event, date, audience and instructions…"
        />
      </label>
      <small>
        Points go to the configured provider. Review all generated wording;
        nothing is published automatically.
      </small>
      <button
        type="button"
        disabled={busy || points.trim().length < 10}
        onClick={draft}
        className="p-2 font-semibold"
      >
        {busy ? "Drafting…" : "Draft with AI"}
      </button>
      {error && (
        <p role="alert">
          {error} You can enter the circular manually or retry.
        </p>
      )}
    </section>
  );
}
