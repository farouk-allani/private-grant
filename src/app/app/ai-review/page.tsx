import { AppShell } from "@/components/AppShell";
import { ChainGPTReviewPanel } from "@/components/ChainGPTReviewPanel";

export default function AIReviewPage() {
  return (
    <AppShell
      title="ChainGPT review"
      description="Summarize builder submissions, identify risk notes, and draft payout memos without making AI required for settlement."
    >
      <ChainGPTReviewPanel />
    </AppShell>
  );
}
