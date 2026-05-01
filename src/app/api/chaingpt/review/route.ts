import { NextResponse } from "next/server";
import { aiReviewSchema } from "@/lib/validation";

const CHAINGPT_URL = "https://api.chaingpt.org/chat/stream";

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function nonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function parseJson(text: string): unknown | undefined {
  if (!text.trim()) return undefined;

  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function extractAnswer(payload: unknown): string | undefined {
  const object = asRecord(payload);
  if (!object) return nonEmptyString(payload);

  const data = asRecord(object.data);
  return (
    nonEmptyString(data?.bot) ||
    nonEmptyString(data?.answer) ||
    nonEmptyString(data?.response) ||
    nonEmptyString(data?.message) ||
    nonEmptyString(object.bot) ||
    nonEmptyString(object.answer) ||
    nonEmptyString(object.response) ||
    nonEmptyString(object.data)
  );
}

function extractStreamChunk(payload: unknown): string | undefined {
  const object = asRecord(payload);
  if (!object) return nonEmptyString(payload);

  const choices = Array.isArray(object.choices) ? object.choices : undefined;
  const firstChoice = choices?.[0];
  const firstChoiceObject = asRecord(firstChoice);
  const delta = asRecord(firstChoiceObject?.delta);

  return (
    nonEmptyString(object.token) ||
    nonEmptyString(object.text) ||
    nonEmptyString(object.content) ||
    nonEmptyString(delta?.content) ||
    extractAnswer(payload)
  );
}

function extractStreamAnswer(text: string): string | undefined {
  const chunks: string[] = [];
  let sawStructuredStream = false;

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const isServerSentEvent = trimmed.startsWith("data:");
    const chunkText = isServerSentEvent ? trimmed.slice(5).trim() : trimmed;
    if (!chunkText || chunkText === "[DONE]" || chunkText === "DONE") continue;

    const parsed = parseJson(chunkText);
    if (parsed !== undefined) {
      sawStructuredStream = true;
      const chunk = extractStreamChunk(parsed);
      if (chunk) chunks.push(chunk);
      continue;
    }

    if (isServerSentEvent) {
      sawStructuredStream = true;
      chunks.push(chunkText);
    }
  }

  if (chunks.length) return chunks.join("").trim();
  return sawStructuredStream ? undefined : nonEmptyString(text);
}

function extractErrorMessage(payload: unknown, fallback: string) {
  const object = asRecord(payload);
  const message =
    nonEmptyString(object?.message) ||
    nonEmptyString(object?.error) ||
    nonEmptyString(asRecord(object?.error)?.message) ||
    nonEmptyString(fallback);

  return message || "Unknown ChainGPT error";
}

export async function GET() {
  return NextResponse.json({
    enabled: Boolean(process.env.CHAINGPT_API_KEY)
  });
}

export async function POST(request: Request) {
  if (!process.env.CHAINGPT_API_KEY) {
    return NextResponse.json(
      {
        enabled: false,
        message: "ChainGPT is disabled because CHAINGPT_API_KEY is not configured."
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON request body." }, { status: 400 });
  }

  const parsed = aiReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues.map((issue) => issue.message).join(", ") },
      { status: 400 }
    );
  }

  const question = [
    "You are reviewing a Web3 grant or bounty submission for PrivateGrant Vault.",
    "Return concise markdown with these sections only:",
    "Submission summary, Risk notes, Suggested payout memo, Judge-facing explanation.",
    "Do not invent facts. Do not store or request secrets.",
    parsed.data.campaignContext ? `Campaign context: ${parsed.data.campaignContext}` : "",
    `Builder submission: ${parsed.data.submission}`
  ]
    .filter(Boolean)
    .join("\n\n");

  let response: Response;
  try {
    response = await fetch(CHAINGPT_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.CHAINGPT_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "general_assistant",
        question,
        chatHistory: "off"
      })
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? `ChainGPT request failed before a response was returned: ${error.message}`
            : "ChainGPT request failed before a response was returned."
      },
      { status: 502 }
    );
  }

  const responseText = await response.text();
  const responsePayload = parseJson(responseText);

  if (!response.ok) {
    const message = extractErrorMessage(responsePayload, responseText || response.statusText);
    return NextResponse.json(
      { message: `ChainGPT request failed: ${response.status} ${message}` },
      { status: response.status >= 500 ? 502 : response.status }
    );
  }

  const responseObject = asRecord(responsePayload);
  if (responseObject?.status === false) {
    return NextResponse.json(
      { message: `ChainGPT request failed: ${extractErrorMessage(responsePayload, responseText)}` },
      { status: 502 }
    );
  }

  const answer =
    extractAnswer(responsePayload) ||
    extractStreamAnswer(responseText) ||
    (responsePayload ? JSON.stringify(responsePayload) : undefined);

  if (!answer) {
    return NextResponse.json(
      { message: "ChainGPT returned an empty response. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ enabled: true, answer });
}
