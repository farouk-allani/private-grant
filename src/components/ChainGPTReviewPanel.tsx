"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BrainCircuit, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
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
    <Card>
      <CardHeader>
        <CardTitle>ChainGPT AI review assistant</CardTitle>
        <CardDescription>
          Paste submission text to generate a summary, risk notes, payout memo, and judge-facing explanation.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {enabled === false ? (
          <div className="rounded-md border border-warning/25 bg-warning/10 p-4 text-sm text-warning">
            ChainGPT is disabled until CHAINGPT_API_KEY is configured. No fake AI output is shown.
          </div>
        ) : null}
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <Field label="Campaign context" error={form.formState.errors.campaignContext?.message}>
            <Textarea
              placeholder="Optional: campaign goals, judging rubric, payout policy"
              {...form.register("campaignContext")}
            />
          </Field>
          <Field label="Builder submission" error={form.formState.errors.submission?.message}>
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
          <div className="whitespace-pre-wrap rounded-md border border-primary/20 bg-primary/8 p-4 text-sm leading-6 text-slate-100">
            {answer}
          </div>
        ) : null}
        {error ? <p className="text-sm text-danger">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
