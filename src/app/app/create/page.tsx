import { AppShell } from "@/components/AppShell";
import { CreateCampaignForm } from "@/components/CreateCampaignForm";

export default function CreatePage() {
  return (
    <AppShell
      title="Create campaign"
      description="Publish campaign metadata and connect it to an ERC-20 plus a Nox confidential ERC-7984 wrapper."
    >
      <CreateCampaignForm />
    </AppShell>
  );
}
