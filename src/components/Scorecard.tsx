import { Crown, Scale } from "lucide-react";
import { breakdown, companies, verdicts, weightedScore } from "@/data/companies";
import { Reveal, SectionHeader } from "@/components/ui";
import { cn } from "@/utils/cn";

const short: Record<string, string> = {
  toolguys: "PowerWashingOahu.com",
  paradise: "Paradise",
  ecoclean: "EcoClean",
  pacific: "Pacific Spray",
  bigwave: "Big Wave",
};

function heat(v: number) {
  if (v >= 9.5) return "bg-spray/30 text-foam ring-1 ring-spray/50";
  if (v >= 9) return "bg-spray/15 text-foam";
  if (v >= 8.5) return "bg-lagoon/25 text-white/85";
  if (v >= 8) return "bg-white/[0.07] text-white/75";
  if (v >= 7.5) return "bg-gold/10 text-white/70";
  return "bg-gold/20 text-white/70";
}

export default function Scorecard() {
  const best = breakdown.map((r) => Math.max(...r.values));

  return (
    <section id="scorecard" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="absolute left-0 top-20 h-80 w-80 rounded-full bg-spray/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Full Evaluation"
          title={
            <>
              How we scored <span className="shimmer-text">every company</span>
            </>
          }
          desc="Each crew was rated 1–10 on six weighted criteria. The weighted total is the overall score — and PowerWashingOahu.com (Tool Guys – Power Washing) finishes #1."
        />

        <Reveal className="mt-12">
          <div className="table-scroll overflow-x-auto rounded-3xl border border-white/10 bg-abyss/60">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/40 sm:p-5">
                    <span className="flex items-center gap-2"><Scale className="h-4 w-4" /> Criteria</span>
                  </th>
                  <th className="p-4 text-center text-xs font-bold uppercase tracking-widest text-white/40">Weight</th>
                  {companies.map((c) => (
                    <th
                      key={c.id}
                      className={cn("p-4 text-center", c.rank === 1 && "bg-spray/[0.08]")}
                    >
                      <span
                        className={cn(
                          "mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-full font-display text-xs font-extrabold",
                          c.rank === 1 ? "bg-gold text-abyss" : "bg-white/10 text-white/70",
                        )}
                      >
                        #{c.rank}
                      </span>
                      <span className={cn("block font-display text-sm font-bold", c.rank === 1 ? "text-spray" : "text-foam")}>
                        {short[c.id]}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {breakdown.map((row, ri) => (
                  <tr key={row.label} className="border-b border-white/5">
                    <td className="p-4 sm:p-5">
                      <p className="font-semibold text-foam">{row.label}</p>
                      <p className="mt-0.5 text-xs text-white/45">{row.note}</p>
                    </td>
                    <td className="p-4 text-center font-display text-sm font-bold text-gold">{row.weight}%</td>
                    {companies.map((c, ci) => {
                      const v = row.values[ci];
                      return (
                        <td key={c.id} className={cn("p-3 text-center", c.rank === 1 && "bg-spray/[0.05]")}>
                          <span
                            className={cn(
                              "relative inline-flex min-w-14 items-center justify-center rounded-lg px-3 py-2 font-display text-sm font-bold",
                              heat(v),
                            )}
                          >
                            {v.toFixed(1)}
                            {v === best[ri] && (
                              <Crown className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 text-gold" fill="currentColor" />
                            )}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="border-t-2 border-spray/30 bg-white/[0.03]">
                  <td className="p-4 sm:p-5">
                    <p className="font-display font-extrabold text-foam">Weighted total</p>
                    <p className="text-xs text-white/45">Σ (score × weight)</p>
                  </td>
                  <td className="p-4 text-center font-display text-sm font-bold text-white/50">100%</td>
                  {companies.map((c, ci) => (
                    <td key={c.id} className={cn("p-4 text-center", c.rank === 1 && "bg-spray/[0.1]")}>
                      <span className={cn("font-display text-2xl font-extrabold", c.rank === 1 ? "shimmer-text" : "text-foam")}>
                        {weightedScore(ci).toFixed(2)}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="bg-white/[0.03]">
                  <td className="p-4 font-display font-extrabold text-foam sm:p-5">Final rank</td>
                  <td />
                  {companies.map((c) => (
                    <td key={c.id} className={cn("p-4 text-center", c.rank === 1 && "bg-spray/[0.1]")}>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider",
                          c.rank === 1 ? "bg-gold text-abyss" : "bg-white/10 text-white/70",
                        )}
                      >
                        {c.rank === 1 ? "#1 Winner" : `#${c.rank}`}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-center text-xs text-white/40">
            <Crown className="mr-1 inline h-3 w-3 text-gold" fill="currentColor" /> = category leader. Scores are editorial
            estimates based on public info and community feedback (2026).
          </p>
        </Reveal>

        {/* Verdicts */}
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {companies.map((c, i) => (
            <Reveal key={c.id} delay={i * 80} className={cn(c.rank === 1 && "md:col-span-2 lg:col-span-1")}>
              <div
                className={cn(
                  "h-full rounded-2xl border p-5",
                  c.rank === 1 ? "border-spray/50 bg-spray/[0.08]" : "border-white/10 bg-white/[0.03]",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-extrabold",
                      c.rank === 1 ? "bg-gold text-abyss" : "bg-white/10 text-white/70",
                    )}
                  >
                    #{c.rank}
                  </span>
                  <span className="font-display text-lg font-extrabold text-foam">{c.score.toFixed(1)}</span>
                </div>
                <p className={cn("mt-3 font-display text-sm font-bold", c.rank === 1 ? "text-spray" : "text-foam")}>
                  {c.rank === 1 ? "PowerWashingOahu.com" : c.name}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-white/60">{verdicts[c.id]}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
