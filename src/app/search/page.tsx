import type { Metadata } from "next";
import { RinkAtmosphere } from "@/components/RinkAtmosphere";
import { SearchExperience } from "@/components/SearchExperience";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Scout Desk — Search GitHub players",
  description:
    "Search any public GitHub username and generate an IceOVR scouting card with live autocomplete.",
  alternates: { canonical: "/search" },
};

export default function SearchPage() {
  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
      <RinkAtmosphere />
      <SiteHeader sticky />
      <SearchExperience />
    </main>
  );
}
