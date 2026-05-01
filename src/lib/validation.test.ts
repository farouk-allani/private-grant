import { describe, expect, it } from "vitest";
import { campaignSchema, payoutSchema } from "./validation";

describe("frontend validation", () => {
  it("accepts a valid campaign form", () => {
    const parsed = campaignSchema.safeParse({
      name: "Core contributors",
      description: "Monthly confidential contributor payouts",
      token: "0x0000000000000000000000000000000000000001",
      confidentialToken: "0x0000000000000000000000000000000000000002",
      category: "payroll",
      publicBudget: "25000",
      deadline: "",
      auditor: ""
    });

    expect(parsed.success).to.equal(true);
  });

  it("rejects invalid payout recipients", () => {
    const parsed = payoutSchema.safeParse({
      recipient: "not-an-address",
      amount: "100",
      memo: "milestone"
    });

    expect(parsed.success).to.equal(false);
  });
});
