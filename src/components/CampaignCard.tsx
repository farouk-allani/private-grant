import Link from "next/link";
import { ArrowUpRight, CalendarClock, Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatTokenAmount, shortenAddress } from "@/lib/format";
import type { Campaign } from "@/lib/types";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <Link href={`/app/campaign/${campaign.id.toString()}`}>
      <Card className="h-full transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-violet">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>{campaign.name}</CardTitle>
              <CardDescription>{campaign.description}</CardDescription>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={campaign.isActive ? "primary" : "default"}>
              {campaign.isActive ? "Active" : "Closed"}
            </Badge>
            <Badge variant="secondary">{campaign.category}</Badge>
            <Badge>Public campaign</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-primary" />
            Public budget: {formatTokenAmount(campaign.publicBudget, 6)}
          </div>
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-secondary" />
            Deadline: {formatDate(campaign.deadline)}
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
            <p>Sponsor {shortenAddress(campaign.sponsor)}</p>
            <p className="mt-1">Confidential token {shortenAddress(campaign.confidentialToken)}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
