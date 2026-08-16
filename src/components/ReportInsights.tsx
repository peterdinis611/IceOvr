"use client";

import type { ScoutCard } from "@/lib/types";
import { ContributionHeatmap } from "@/components/ContributionHeatmap";

const LANGUAGE_COLORS = [
  "#38bdf8",
  "#a78bfa",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#fb923c",
];

export function ScoutingInsights({ card }: { card: ScoutCard }) {
  return (
    <div className="mt-5 grid gap-5">
      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <ReportPanel eyebrow="Strengths & focus" title="Scouting notes">
          <StrengthsAndFocus card={card} />
        </ReportPanel>
        <ReportPanel eyebrow="Collaboration radar" title="Community profile">
          <CollaborationRadar card={card} />
        </ReportPanel>
      </div>
      <ReportPanel eyebrow="Contribution trend" title="Season form">
        <ContributionTrend card={card} />
      </ReportPanel>
    </div>
  );
}

export function ActivityReport({ card }: { card: ScoutCard }) {
  const languages = card.raw.languages?.slice(0, 5) ?? [];
  const repositories = card.raw.repositories?.slice(0, 3) ?? [];
  const activity = card.raw.recentActivity?.slice(0, 3) ?? [];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(12,30,47,.96),rgba(6,17,30,.94))] p-5 shadow-[0_20px_60px_rgba(0,0,0,.2)] sm:p-6">
      <div className="absolute inset-x-0 top-0 h-px broadcast-stripe" />
      <div className="relative border-b border-white/10 pb-5">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#7dd3fc]">
          GitHub activity room
        </p>
        <h2 className="mt-1 font-display text-3xl tracking-[.08em] text-white">
          SEASON ACTIVITY
        </h2>
        <p className="mt-2 text-sm text-[#94a3b8]">
          Live public GitHub signals, project impact, and recent momentum.
        </p>
      </div>
      <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-3 sm:p-4">
        <ContributionHeatmap
          weeks={card.contributionWeeks}
          total={card.raw.contributionsLifetime}
        />
      </div>
      <div className="mt-5 grid gap-5">
        <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
          <ReportPanel eyebrow="Language breakdown" title="Code mix">
            {languages.length ? (
              <LanguageBreakdown languages={languages} />
            ) : (
              <EmptyState text="No repository language data is available yet." />
            )}
          </ReportPanel>
          <ReportPanel eyebrow="Repository spotlight" title="Top projects">
            {repositories.length ? (
              <RepositorySpotlight repositories={repositories} />
            ) : (
              <EmptyState text="No public repositories found for spotlighting." />
            )}
          </ReportPanel>
        </div>
        <div className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
          <ReportPanel eyebrow="Recent activity" title="Latest signals">
            {activity.length ? (
              <RecentActivity activity={activity} />
            ) : (
              <EmptyState text="No recent public activity was returned by GitHub." />
            )}
          </ReportPanel>
          <ReportPanel eyebrow="Profile ledger" title="Public footprint">
            <div className="grid grid-cols-2 gap-2">
              <Footprint label="Followers" value={card.raw.followers} />
              <Footprint label="Repositories" value={card.raw.publicRepos} />
              <Footprint label="Languages" value={card.raw.languageCount} />
              <Footprint label="Account years" value={card.raw.accountYears} />
            </div>
          </ReportPanel>
        </div>
      </div>
    </section>
  );
}

function ReportPanel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3.5 sm:p-4">
      <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#7dd3fc]">
        {eyebrow}
      </p>
      <h3 className="mt-0.5 font-display text-xl tracking-[0.08em] text-white">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function LanguageBreakdown({
  languages,
}: {
  languages: NonNullable<ScoutCard["raw"]["languages"]>;
}) {
  const total = languages.reduce((sum, language) => sum + language.count, 0);
  return (
    <div className="space-y-2.5">
      {languages.map((language, index) => {
        const percent = Math.round((language.count / total) * 100);
        return (
          <div key={language.name}>
            <div className="mb-1 flex items-center justify-between gap-3 text-xs">
              <span className="flex min-w-0 items-center gap-2 font-semibold text-[#e2e8f0]">
                <i
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    background: LANGUAGE_COLORS[index % LANGUAGE_COLORS.length],
                  }}
                />
                <span className="truncate">{language.name}</span>
                <span className="rounded bg-white/8 px-1.5 py-0.5 text-[9px] font-bold text-[#94a3b8]">
                  {language.count} repos
                </span>
              </span>
              <span className="font-mono font-bold text-white">{percent}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${percent}%`,
                  background: LANGUAGE_COLORS[index % LANGUAGE_COLORS.length],
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RepositorySpotlight({
  repositories,
}: {
  repositories: NonNullable<ScoutCard["raw"]["repositories"]>;
}) {
  return (
    <div className="space-y-2">
      {repositories.map((repo) => (
        <a
          key={repo.url}
          href={repo.url}
          target="_blank"
          rel="noreferrer"
          className="group block rounded-lg border border-white/8 bg-white/[.025] px-3 py-2.5 transition hover:border-[#7dd3fc]/35 hover:bg-[#7dd3fc]/5"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm font-bold text-white group-hover:text-[#7dd3fc]">
              {repo.name}
            </p>
            <span className="shrink-0 text-[10px] font-bold text-[#fde68a]">
              ★ {repo.stars.toLocaleString()}
            </span>
          </div>
          <p className="mt-1 line-clamp-1 text-[11px] text-[#94a3b8]">
            {repo.description || "Public GitHub repository"}
          </p>
          <div className="mt-1.5 flex gap-3 text-[9px] font-bold uppercase tracking-wide text-[#64748b]">
            <span>{repo.language || "Code"}</span>
            <span>⑂ {repo.forks.toLocaleString()} forks</span>
          </div>
        </a>
      ))}
    </div>
  );
}

function RecentActivity({
  activity,
}: {
  activity: NonNullable<ScoutCard["raw"]["recentActivity"]>;
}) {
  return (
    <ol className="space-y-3">
      {activity.map((item, index) => (
        <li
          key={`${item.label}-${item.occurredAt}`}
          className="relative flex gap-3"
        >
          {index < activity.length - 1 && (
            <span className="absolute left-[5px] top-3 h-[calc(100%+8px)] w-px bg-white/10" />
          )}
          <span className="relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-[#0b1e30] bg-[#38bdf8]" />
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-[#e2e8f0]">
              {item.label}
            </p>
            <p className="mt-0.5 text-[10px] text-[#94a3b8]">
              {item.detail} · {relativeDate(item.occurredAt)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function ContributionTrend({ card }: { card: ScoutCard }) {
  const buckets = monthlyContributions(card);
  const max = Math.max(...buckets.map((bucket) => bucket.count), 1);
  const points = buckets
    .map(
      (bucket, index) =>
        `${(index / Math.max(1, buckets.length - 1)) * 100},${92 - (bucket.count / max) * 76}`,
    )
    .join(" ");
  return (
    <div>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-32 w-full overflow-visible"
        role="img"
        aria-label="Monthly contribution trend"
      >
        <defs>
          <linearGradient id="trend-fill" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#38bdf8" stopOpacity=".35" />
            <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[20, 45, 70, 95].map((y) => (
          <line
            key={y}
            x1="0"
            x2="100"
            y1={y}
            y2={y}
            stroke="rgba(148,163,184,.16)"
            strokeWidth=".5"
          />
        ))}
        <polygon points={`0,95 ${points} 100,95`} fill="url(#trend-fill)" />
        <polyline
          points={points}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {buckets.map((bucket, index) => (
          <circle
            key={bucket.label}
            cx={(index / Math.max(1, buckets.length - 1)) * 100}
            cy={92 - (bucket.count / max) * 76}
            r="2"
            fill="#e0f2fe"
          >
            <title>
              {bucket.label}: {bucket.count} contributions
            </title>
          </circle>
        ))}
      </svg>
      <div className="mt-1 grid grid-cols-6 text-[9px] font-bold uppercase tracking-wide text-[#64748b]">
        {buckets
          .filter((_, index) => index % 2 === 0)
          .map((bucket) => (
            <span key={bucket.label}>{bucket.label}</span>
          ))}
      </div>
    </div>
  );
}

function CollaborationRadar({ card }: { card: ScoutCard }) {
  const values = [
    normalise(card.raw.pullRequests, 100),
    normalise(card.raw.reviews, 100),
    normalise(card.raw.issues, 100),
    normalise(card.raw.followers, 500),
  ];
  const labels = ["PRs", "Reviews", "Issues", "Followers"];
  const points = values
    .map((value, index) => polarPoint(index, value))
    .join(" ");
  return (
    <div className="flex items-center gap-3">
      <svg
        viewBox="0 0 160 160"
        className="h-40 w-40 shrink-0"
        role="img"
        aria-label="Collaboration radar"
      >
        {[25, 50, 75, 100].map((value) => (
          <polygon
            key={value}
            points={[0, 1, 2, 3]
              .map((index) => polarPoint(index, value))
              .join(" ")}
            fill="none"
            stroke="rgba(148,163,184,.2)"
          />
        ))}
        {[0, 1, 2, 3].map((index) => {
          const [x, y] = polarPoint(index, 100).split(",");
          return (
            <line
              key={index}
              x1="80"
              y1="80"
              x2={x}
              y2={y}
              stroke="rgba(148,163,184,.15)"
            />
          );
        })}
        <polygon
          points={points}
          fill="rgba(56,189,248,.22)"
          stroke="#7dd3fc"
          strokeWidth="2"
        />
      </svg>
      <div className="grid min-w-0 flex-1 grid-cols-2 gap-2">
        {labels.map((label, index) => (
          <div key={label} className="rounded-md bg-white/[.04] p-2">
            <p className="text-[9px] uppercase tracking-wide text-[#64748b]">
              {label}
            </p>
            <p className="mt-0.5 text-sm font-bold text-white">
              {[
                card.raw.pullRequests,
                card.raw.reviews,
                card.raw.issues,
                card.raw.followers,
              ][index].toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StrengthsAndFocus({ card }: { card: ScoutCard }) {
  const strengths = [
    card.raw.stars >= 250 && "Strong open-source impact",
    card.raw.commitsLastYear >= 250 && "High delivery rhythm",
    card.raw.followers >= 100 && "Established community reach",
    card.raw.languageCount >= 4 && "Versatile technical range",
  ].filter(Boolean);
  const focus = [
    card.raw.pullRequests < 50 &&
      "More pull-request collaboration would raise the profile",
    card.raw.reviews < 30 && "Public review activity is a growth opportunity",
    card.raw.stars < 50 && "Publishing and sharing projects could grow impact",
  ].filter(Boolean);
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <InsightList
        label="Strengths"
        tone="text-[#86efac]"
        items={
          strengths.length
            ? strengths
            : ["Building a foundation through public activity"]
        }
      />
      <InsightList
        label="Focus area"
        tone="text-[#fde68a]"
        items={focus.slice(0, 2)}
      />
    </div>
  );
}

function InsightList({
  label,
  tone,
  items,
}: {
  label: string;
  tone: string;
  items: unknown[];
}) {
  return (
    <div className="rounded-lg bg-white/[.03] p-3">
      <p className={`text-[9px] font-black uppercase tracking-[.18em] ${tone}`}>
        {label}
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li
            key={String(item)}
            className="text-[11px] leading-snug text-[#cbd5e1]"
          >
            • {String(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-lg border border-dashed border-white/10 px-3 py-5 text-center text-xs text-[#64748b]">
      {text}
    </p>
  );
}
function Footprint({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white/[.04] px-3 py-2.5">
      <p className="text-[9px] uppercase tracking-wide text-[#64748b]">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-white">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
function normalise(value: number, cap: number) {
  return Math.min(100, Math.round((value / cap) * 100));
}
function polarPoint(index: number, value: number) {
  const angle = (-90 + index * 90) * (Math.PI / 180);
  const radius = value * 0.62;
  return `${80 + Math.cos(angle) * radius},${80 + Math.sin(angle) * radius}`;
}
function relativeDate(value: string) {
  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000),
  );
  return days === 0 ? "today" : days === 1 ? "yesterday" : `${days}d ago`;
}
function monthlyContributions(card: ScoutCard) {
  const months = new Map<string, number>();
  for (const day of card.contributionWeeks.flat()) {
    const key = day.date.slice(0, 7);
    months.set(key, (months.get(key) ?? 0) + day.count);
  }
  return [...months.entries()]
    .slice(-12)
    .map(([key, count]) => ({
      label: new Intl.DateTimeFormat("en", { month: "short" }).format(
        new Date(`${key}-01T00:00:00`),
      ),
      count,
    }));
}
