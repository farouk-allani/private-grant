import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const originalChainGptKey = process.env.CHAINGPT_API_KEY;

function reviewRequest(body: unknown) {
  return new Request("http://localhost:3000/api/chaingpt/review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

const validReviewBody = {
  campaignContext: "Judge milestones based on shipped features, tests, and demo quality.",
  submission:
    "The builder shipped the confidential payout form, added validation, recorded a demo, and included deployment notes for evaluators."
};

describe("/api/chaingpt/review", () => {
  afterEach(() => {
    if (originalChainGptKey === undefined) {
      delete process.env.CHAINGPT_API_KEY;
    } else {
      process.env.CHAINGPT_API_KEY = originalChainGptKey;
    }

    vi.unstubAllGlobals();
  });

  it("returns a buffered ChainGPT answer", async () => {
    process.env.CHAINGPT_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            status: true,
            message: "Chat response generated successfully.",
            data: { bot: "Submission summary\n\nThe work is ready for review." }
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      )
    );

    const response = await POST(reviewRequest(validReviewBody));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      enabled: true,
      answer: "Submission summary\n\nThe work is ready for review."
    });
  });

  it("returns a JSON error when ChainGPT returns an empty body", async () => {
    process.env.CHAINGPT_API_KEY = "test-key";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 200 })));

    const response = await POST(reviewRequest(validReviewBody));
    const data = await response.json();

    expect(response.status).toBe(502);
    expect(data.message).toBe("ChainGPT returned an empty response. Please try again.");
  });

  it("normalizes non-JSON ChainGPT errors into JSON", async () => {
    process.env.CHAINGPT_API_KEY = "test-key";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("Bad gateway", { status: 502 })));

    const response = await POST(reviewRequest(validReviewBody));
    const data = await response.json();

    expect(response.status).toBe(502);
    expect(data.message).toBe("ChainGPT request failed: 502 Bad gateway");
  });
});
