import { AppShell } from "@/components/AppShell";
import { CreateCampaignForm } from "@/components/CreateCampaignForm";

export default function CreatePage() {
  return (
    <AppShell
      title="Create campaign"
      description="Publish public campaign metadata, connect an ERC-20 funding token, and route later payouts through a Nox confidential ERC-7984 wrapper."
    >
      <CreateCampaignForm />
    </AppShell>
  );
}
