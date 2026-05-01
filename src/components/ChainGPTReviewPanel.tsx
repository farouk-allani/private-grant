"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BrainCircuit, Loader2, ScanText } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { aiReviewSchema, type AIReviewFormValues } from "@/lib/validation";

export function ChainGPTReviewPanel() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [answer, setAnswer] = useState<string>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<AIReviewFormValues>({
    resolver: zodResolver(aiReviewSchema),
    defaultValues: {
      submission: "",
      campaignContext: ""
    }
  });

  useEffect(() => {
    fetch("/api/chaingpt/review")
      .then((response) => response.json())
      .then((data) => setEnabled(Boolean(data.enabled)))
      .catch(() => setEnabled(false));
  }, []);

  async function onSubmit(values: AIReviewFormValues) {
    setIsLoading(true);
    setError(undefined);
    setAnswer(undefined);
    try {
      const response = await fetch("/api/chaingpt/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "ChainGPT review failed");
      setAnswer(data.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ChainGPT review failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary">ChainGPT</Badge>
          <BrainCircuit className="h-6 w-6 text-primary-deep" />
        </div>
        <CardTitle className="text-3xl">ChainGPT AI review assistant</CardTitle>
        <CardDescription>
          Paste submission text to generate a summary, risk notes, payout memo, and judge-facing explanation.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {enabled === false ? (
          <div className="rounded-2xl border border-primary-deep/30 bg-primary-pale p-4 text-sm font-semibold text-primary-deep">
            ChainGPT is disabled until CHAINGPT_API_KEY is configured. No fake AI output is shown.
          </div>
        ) : null}
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <Field label="Campaign context" description="Optional judging rubric, campaign goals, payout policy, or milestone context." error={form.formState.errors.campaignContext?.message}>
            <Textarea
              placeholder="Optional: campaign goals, judging rubric, payout policy"
              {...form.register("campaignContext")}
            />
          </Field>
          <Field label="Builder submission" description="Paste real evaluator notes. The app will not synthesize fake campaign state." error={form.formState.errors.submission?.message}>
            <Textarea
              className="min-h-44"
              placeholder="Paste builder submission, milestones, links, or evaluator notes"
              {...form.register("submission")}
            />
          </Field>
          <Button type="submit" disabled={!enabled || isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
            Generate ChainGPT review
          </Button>
        </form>
        {answer ? (
          <div className="rounded-[28px] border border-muted-dark bg-ink p-5 text-[#FFFDF3]">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <ScanText className="h-4 w-4" />
              <p className="technical-label">Review output</p>
            </div>
            <div className="whitespace-pre-wrap text-sm leading-6 text-dark-muted">{answer}</div>
          </div>
        ) : null}
        {error ? <p className="text-sm text-danger">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
