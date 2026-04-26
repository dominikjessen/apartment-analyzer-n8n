"use server";

import type { AnalyzeState } from "./analyze-state";

async function parseWebhookResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (text.length === 0) {
    return null;
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }
  return text;
}

export async function analyzeListing(
  _prevState: AnalyzeState,
  formData: FormData,
): Promise<AnalyzeState> {
  const contentRaw = formData.get("content");
  const content = typeof contentRaw === "string" ? contentRaw.trim() : "";

  if (content.length === 0) {
    return {
      status: "error",
      message: "Paste the listing text from the page (title, price, details).",
    };
  }

  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
  if (n8nWebhookUrl === undefined || n8nWebhookUrl.length === 0) {
    return {
      status: "error",
      message: "Set N8N_WEBHOOK_URL in your environment (e.g. .env.local).",
    };
  }

  const response = await fetch(n8nWebhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    return {
      status: "error",
      message: `n8n responded with HTTP ${response.status}.`,
    };
  }

  const data = await parseWebhookResponse(response);
  return { status: "success", data };
}
