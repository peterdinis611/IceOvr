import { RinkAtmosphere } from "@/components/RinkAtmosphere";
import { SiteHeader } from "@/components/SiteHeader";
import { TeamBuilder } from "@/components/TeamBuilder";

export default function TeamPage() {
  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
      <RinkAtmosphere subtle />
      <SiteHeader />
      <TeamBuilder />
    </main>
  );
}
