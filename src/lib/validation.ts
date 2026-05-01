import { z } from "zod";
import { isAddress } from "viem";

const addressSchema = z
  .string()
  .trim()
  .refine((value) => Boolean(isAddress(value)), "Enter a valid EVM address");

const optionalAddressSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || Boolean(isAddress(value)), "Enter a valid EVM address");

export const campaignSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  description: z.string().trim().min(12, "Description must be at least 12 characters"),
  token: addressSchema,
  confidentialToken: optionalAddressSchema,
  category: z.enum(["grant", "bounty", "payroll", "hackathon reward"]),
  publicBudget: z.string().trim().regex(/^\d+(\.\d+)?$/, "Enter a numeric budget"),
  deadline: z.string().optional(),
  auditor: optionalAddressSchema
});

export const shieldSchema = z.object({
  amount: z.string().trim().regex(/^\d+(\.\d+)?$/, "Enter a token amount greater than 0")
});

export const payoutSchema = z.object({
  recipient: addressSchema,
  amount: z.string().trim().regex(/^\d+(\.\d+)?$/, "Enter a token amount greater than 0"),
  memo: z.string().trim().max(120, "Memo must be 120 characters or less").optional()
});

export const aiReviewSchema = z.object({
  submission: z.string().trim().min(40, "Paste at least 40 characters of submission context"),
  campaignContext: z.string().trim().max(800).optional()
});

export type CampaignFormValues = z.infer<typeof campaignSchema>;
export type ShieldFormValues = z.infer<typeof shieldSchema>;
export type PayoutFormValues = z.infer<typeof payoutSchema>;
export type AIReviewFormValues = z.infer<typeof aiReviewSchema>;
