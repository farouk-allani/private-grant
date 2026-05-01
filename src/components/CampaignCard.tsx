import Link from "next/link";
import { ArrowUpRight, CalendarClock, Coins, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatTokenAmount, shortenAddress } from "@/lib/format";
import type { Campaign } from "@/lib/types";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <Link href={`/app/campaign/${campaign.id.toString()}`}>
      <Card className="group h-full overflow-hidden hover:-translate-y-1 hover:border-primary hover:shadow-warm">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="technical-label text-primary-deep">Campaign #{campaign.id.toString()}</p>
              <CardTitle className="mt-3 leading-tight">{campaign.name}</CardTitle>
              <CardDescription className="mt-3 line-clamp-3">{campaign.description}</CardDescription>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-primary-pale text-primary-deep transition group-hover:border-primary group-hover:bg-primary">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={campaign.isActive ? "primary" : "default"}>
              {campaign.isActive ? "Active" : "Closed"}
            </Badge>
            <Badge>{campaign.category}</Badge>
            <Badge variant="secondary">Public campaign</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-3">
              <Coins className="h-4 w-4 text-primary-deep" />
              <p className="mt-3 technical-label text-muted">Public budget</p>
              <p className="mt-1 font-black text-ink">{formatTokenAmount(campaign.publicBudget, 6)}</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-3">
              <CalendarClock className="h-4 w-4 text-primary-deep" />
              <p className="mt-3 technical-label text-muted">Deadline</p>
              <p className="mt-1 font-black text-ink">{formatDate(campaign.deadline)}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-muted-dark bg-ink p-4 text-dark-muted">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="h-4 w-4" />
              <p className="technical-label">Nox confidential route</p>
            </div>
            <p className="mt-3">Sponsor {shortenAddress(campaign.sponsor)}</p>
            <p className="mt-1">Token {shortenAddress(campaign.confidentialToken)}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
