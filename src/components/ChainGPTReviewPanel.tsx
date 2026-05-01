"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BrainCircuit, Loader2, ScanText } from "lucide-react";
import { Fragment, useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { aiReviewSchema, type AIReviewFormValues } from "@/lib/validation";

type ReviewApiResponse = {
  enabled?: boolean;
  answer?: string;
  message?: string;
};

type MarkdownBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "code"; text: string };

async function readReviewApiResponse(response: Response): Promise<ReviewApiResponse> {
  const text = await response.text();
  if (!text.trim()) return {};

  try {
    return JSON.parse(text) as ReviewApiResponse;
  } catch {
    return { message: text };
  }
}

function parseReviewMarkdown(markdown: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let paragraphLines: string[] = [];
  let listItems: string[] = [];
  let listType: "unordered-list" | "ordered-list" | undefined;
  let codeLines: string[] = [];
  let isCodeBlock = false;

  function flushParagraph() {
    if (!paragraphLines.length) return;
    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
    paragraphLines = [];
  }

  function flushList() {
    if (!listType || !listItems.length) return;
    blocks.push({ type: listType, items: listItems });
    listType = undefined;
    listItems = [];
  }

  function flushCode() {
    blocks.push({ type: "code", text: codeLines.join("\n") });
    codeLines = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (isCodeBlock) {
        flushCode();
      } else {
        flushParagraph();
        flushList();
      }
      isCodeBlock = !isCodeBlock;
      continue;
    }

    if (isCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(trimmed);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({
        type: "heading",
        level: heading[1].length as 1 | 2 | 3,
        text: heading[2].trim()
      });
      continue;
    }

    const unorderedItem = /^[-*]\s+(.+)$/.exec(trimmed);
    const orderedItem = /^\d+[.)]\s+(.+)$/.exec(trimmed);
    if (unorderedItem || orderedItem) {
      flushParagraph();
      const nextListType = unorderedItem ? "unordered-list" : "ordered-list";
      if (listType && listType !== nextListType) flushList();
      listType = nextListType;
      listItems.push((unorderedItem?.[1] || orderedItem?.[1] || "").trim());
      continue;
    }

    flushList();
    paragraphLines.push(trimmed);
  }

  if (isCodeBlock) flushCode();
  flushParagraph();
  flushList();

  return blocks;
}

function renderInlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const inlinePattern = /(`([^`]+)`)|\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let currentIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlinePattern.exec(text))) {
    if (match.index > currentIndex) {
      nodes.push(text.slice(currentIndex, match.index));
    }

    if (match[2]) {
      nodes.push(
        <code key={`${keyPrefix}-code-${match.index}`} className="rounded bg-white/10 px-1 py-0.5 text-[#FFFDF3]">
          {match[2]}
        </code>
      );
    } else if (match[3]) {
      nodes.push(
        <strong key={`${keyPrefix}-strong-${match.index}`} className="font-bold text-[#FFFDF3]">
          {match[3]}
        </strong>
      );
    } else if (match[4] && match[5]) {
      nodes.push(
        <a
          key={`${keyPrefix}-link-${match.index}`}
          className="font-semibold text-primary underline underline-offset-4"
          href={match[5]}
          rel="noreferrer"
          target="_blank"
        >
          {match[4]}
        </a>
      );
    }

    currentIndex = inlinePattern.lastIndex;
  }

  if (currentIndex < text.length) {
    nodes.push(text.slice(currentIndex));
  }

  return nodes;
}

function ReviewMarkdown({ markdown }: { markdown: string }) {
  const blocks = parseReviewMarkdown(markdown);

  return (
    <div className="space-y-4 text-sm leading-6 text-dark-muted">
      {blocks.map((block, blockIndex) => {
        const key = `${block.type}-${blockIndex}`;

        if (block.type === "heading") {
          const className =
            block.level === 1
              ? "text-lg font-bold leading-tight text-[#FFFDF3]"
              : "text-base font-bold leading-tight text-[#FFFDF3]";

          return (
            <h3 key={key} className={className}>
              {renderInlineMarkdown(block.text, key)}
            </h3>
          );
        }

        if (block.type === "unordered-list") {
          return (
            <ul key={key} className="ml-5 list-disc space-y-2">
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{renderInlineMarkdown(item, `${key}-${itemIndex}`)}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "ordered-list") {
          return (
            <ol key={key} className="ml-5 list-decimal space-y-2">
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{renderInlineMarkdown(item, `${key}-${itemIndex}`)}</li>
              ))}
            </ol>
          );
        }

        if (block.type === "code") {
          return (
            <pre key={key} className="overflow-x-auto rounded-xl border border-muted-dark bg-black/25 p-3 text-xs leading-5 text-[#FFFDF3]">
              <code>{block.text}</code>
            </pre>
          );
        }

        return (
          <p key={key}>
            {renderInlineMarkdown(block.text, key).map((node, nodeIndex) => (
              <Fragment key={`${key}-fragment-${nodeIndex}`}>{node}</Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

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
      .then(readReviewApiResponse)
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
      const data = await readReviewApiResponse(response);
      if (!response.ok) throw new Error(data.message || "ChainGPT review failed");
      if (!data.answer) throw new Error("ChainGPT returned an empty review.");
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
            <ReviewMarkdown markdown={answer} />
          </div>
        ) : null}
        {error ? <p className="text-sm text-danger">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
