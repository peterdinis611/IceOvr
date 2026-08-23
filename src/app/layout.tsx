import type { Metadata } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "IceOVR — GitHub scouting cards and player reports",
    template: "%s | IceOVR",
  },
  description:
    "Transform public GitHub activity into a hockey-inspired player card, scouting report, live season form, and shareable head-to-head matchup.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  applicationName: "IceOVR",
  keywords: [
    "GitHub profile card",
    "GitHub stats",
    "GitHub scouting report",
    "developer portfolio",
    "GitHub comparison",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "IceOVR",
    title: "IceOVR — GitHub scouting cards and player reports",
    description:
      "Scout public GitHub activity, create a player card, and compare profiles head to head.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "IceOVR GitHub scouting cards",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IceOVR — GitHub scouting cards and player reports",
    description:
      "Turn public GitHub activity into a hockey-inspired player scouting report.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col rink-bg text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
