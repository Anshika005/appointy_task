// server/services/claude.js
import fetch from "node-fetch";

const CLAUDE_URL = process.env.CLAUDE_API_URL;
const CLAUDE_KEY = process.env.CLAUDE_API_KEY;

export async function askClaude(prompt, opts = {}) {
  if (!CLAUDE_KEY || !CLAUDE_URL) {
    throw new Error("CLAUDE_API_KEY or CLAUDE_API_URL is not set in env");
  }

  // This function assumes an Anthropic/Claude-like HTTP interface.
  // If your Claude deployment API differs, replace the body shape below.
  const body = {
    model: opts.model || "claude-v1",
    prompt: prompt,
    max_tokens_to_sample: opts.max_tokens || 300,
    // temperature etc can be added
  };

  const res = await fetch(CLAUDE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${CLAUDE_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Claude API error: ${res.status} ${txt}`);
  }
  const data = await res.json();
  // adapt depending on Claude response shape
  // many Claude endpoints return `completion` or `output` fields. We'll attempt to be flexible:
  return data;
}
