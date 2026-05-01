import { NextResponse } from "next/server";
import { aiReviewSchema } from "@/lib/validation";

const CHAINGPT_URL = "https://api.chaingpt.org/chat/stream";

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

  const body = await request.json();
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

  const response = await fetch(CHAINGPT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CHAINGPT_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "general_assistant",
      question,
      chatHistory: "off"
    })
  });

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json(
      { message: `ChainGPT request failed: ${response.status} ${text}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  const answer = data?.data?.bot || data?.bot || data?.message || JSON.stringify(data);
  return NextResponse.json({ enabled: true, answer });
}
