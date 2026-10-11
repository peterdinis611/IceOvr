import type { Metadata } from "next";
import { FranchiseExperience } from "@/components/FranchiseExperience";
import { RinkAtmosphere } from "@/components/RinkAtmosphere";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Franchise Draft — GitHub org as a team",
  description:
    "Draft a GitHub organization's public members into an IceOVR lineup and export a roster card.",
  alternates: { canonical: "/franchise" },
};

export default function FranchisePage() {
  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
      <RinkAtmosphere subtle />
      <SiteHeader showScout />
      <FranchiseExperience />
    </main>
  );
}
