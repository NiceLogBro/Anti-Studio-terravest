import { Crown, ExternalLink, Medal } from "lucide-react";
import { companies } from "@/data/companies";
import { Reveal, SectionHeader, Stars, useInView } from "@/components/ui";
import { cn } from "@/utils/cn";

const medal: Record<number, string> = {
  1: "bg-gold text-abyss shadow-lg shadow-gold/40",
  2: "bg-slate-300 text-abyss",
  3: "bg-amber-700 text-foam",
};

export default function Leaderboard() {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  return (
    <section id="leaderboard" className="relative scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Official 2026 Rankings"
          title={
            <>
              O'ahu power washing <span className="shimmer-text">leaderboard</span>
            </>
          }
          desc="Every company we reviewed, ranked #1 through #5 by weighted overall score — see the full scorecard below."
        />

        <div ref={ref} className="mt-12 space-y-3">
          {companies.map((c, i) => {
            const top = c.rank === 1;
            return (
              <Reveal key={c.id} delay={i * 90}>
                <div
                  className={cn(
                    "relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5",
                    top
                      ? "border-spray/50 bg-gradient-to-r from-spray/15 via-ocean/40 to-deep shadow-[0_0_40px_-12px_rgba(70,220,255,0.5)]"
                      : "border-white/10 bg-white/[0.03]",
                  )}
                >
                  <div className="flex items-center gap-4 sm:w-[44%]">
                    <span
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-lg font-extrabold",
                        medal[c.rank] ?? "bg-white/10 text-foam",
                      )}
                    >
                      {c.rank}
                    </span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-display text-base font-bold text-foam sm:text-lg">
                        {top ? "PowerWashingOahu.com" : c.name}
                        {top && <Crown className="h-4 w-4 shrink-0 text-gold" />}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-white/50">
                        {c.rank <= 3 && <Medal className="h-3.5 w-3.5 text-white/40" />}
                        {top ? `Tool Guys – Power Washing · ${c.badge}` : c.badge}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-1 items-center gap-3">
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={cn("h-full rounded-full", top ? "bg-gradient-to-r from-spray to-gold" : c.barClass)}
                        style={{
                          width: inView ? `${c.score * 10}%` : "0%",
                          transition: `width 1.2s cubic-bezier(.22,1,.36,1) ${i * 120}ms`,
                        }}
                      />
                    </div>
                    <span className={cn("w-14 text-right font-display text-lg font-extrabold", top ? "text-spray" : "text-foam")}>
                      {c.score.toFixed(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:w-44 sm:justify-end">
                    <Stars rating={c.rating} />
                    <a
                      href={c.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${c.name}`}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full transition",
                        top ? "bg-spray text-abyss hover:bg-foam" : "bg-white/10 text-foam hover:bg-white/20",
                      )}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
