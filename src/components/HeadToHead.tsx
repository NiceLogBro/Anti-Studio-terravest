import { AlertCircle, CheckCircle2, MinusCircle } from "lucide-react";
import { breakdown, companies, criteria, type Status } from "@/data/companies";
import { Reveal, SectionHeader, useInView } from "@/components/ui";
import { cn } from "@/utils/cn";

const statusIcon: Record<Status, { icon: typeof CheckCircle2; cls: string }> = {
  full: { icon: CheckCircle2, cls: "text-spray" },
  partial: { icon: AlertCircle, cls: "text-gold" },
  none: { icon: MinusCircle, cls: "text-white/30" },
};

function CellView({ status, text }: { status: Status; text: string }) {
  const { icon: Icon, cls } = statusIcon[status];
  return (
    <div className="flex items-start gap-2">
      <Icon className={cn("mt-0.5 h-4.5 w-4.5 shrink-0", cls)} />
      <span className="text-sm leading-snug text-white/70">{text}</span>
    </div>
  );
}

function ScoreBars() {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  return (
    <div ref={ref} className="mt-14 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">Score breakdown</p>
        {companies.map((c) => (
          <span key={c.id} className="flex items-center gap-2 text-sm text-white/70">
            <span className={cn("h-2.5 w-2.5 rounded-full", c.dotClass)} /> {({toolguys:"Tool Guys",paradise:"Paradise",ecoclean:"EcoClean",pacific:"Pacific Spray",bigwave:"Big Wave"} as Record<string,string>)[c.id]}
          </span>
        ))}
      </div>
      <div className="mt-6 space-y-5">
        {breakdown.map((row, i) => (
          <div key={row.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-semibold text-foam">{row.label}</span>
            </div>
            <div className="space-y-1.5">
              {companies.map((c, ci) => {
                const v = row.values[ci];
                return (
                  <div key={c.id} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 truncate text-xs text-white/50">
                      {({toolguys:"Tool Guys",paradise:"Paradise",ecoclean:"EcoClean",pacific:"Pacific Spray",bigwave:"Big Wave"} as Record<string,string>)[c.id]}
                    </span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
                      <div
                        className={cn("h-full rounded-full", c.barClass)}
                        style={{
                          width: inView ? `${v * 10}%` : "0%",
                          transition: `width 1.1s cubic-bezier(.22,1,.36,1) ${i * 90 + ci * 120}ms`,
                        }}
                      />
                    </div>
                    <span className="w-9 shrink-0 text-right text-xs font-bold text-white/70">
                      {inView ? v.toFixed(1) : "0.0"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HeadToHead() {
  return (
    <section id="head-to-head" className="relative scroll-mt-24 bg-deep/60 py-24 sm:py-32">
      <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-lagoon/20 blur-[110px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Head-to-Head"
          title={
            <>
              Tool Guys vs. <span className="text-white/50">the rest of O'ahu</span>
            </>
          }
          desc="Same island, very different strengths. Here's how all five crews stack up line by line — with Tool Guys – Power Washing leading where it matters most for most jobs."
        />

        <Reveal className="mt-14">
          <div className="table-scroll overflow-x-auto rounded-3xl border border-white/10 bg-abyss/60">
            <table className="w-full min-w-[1180px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-5 text-xs font-bold uppercase tracking-widest text-white/40 sm:p-6">
                    Criteria
                  </th>
                  {companies.map((c) => (
                    <th
                      key={c.id}
                      className={cn(
                        "p-5 sm:p-6",
                        c.rank === 1 && "bg-spray/[0.07] ring-1 ring-inset ring-spray/25",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-lg font-display text-xs font-extrabold",
                            c.rank === 1 ? "bg-spray text-abyss" : "bg-white/10 text-white/70",
                          )}
                        >
                          #{c.rank}
                        </span>
                        <div>
                          <p className={cn("font-display text-sm font-bold sm:text-base", c.rank === 1 ? "text-spray" : "text-foam")}>
                            {({toolguys:"Tool Guys",paradise:"Paradise",ecoclean:"EcoClean",pacific:"Pacific Spray",bigwave:"Big Wave"} as Record<string,string>)[c.id]}
                          </p>
                          <p className="text-xs text-white/45">{c.score.toFixed(1)} / 10</p>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {criteria.map((row, ri) => (
                  <tr
                    key={row.label}
                    className={cn("border-b border-white/5 transition hover:bg-white/[0.03]", ri % 2 === 1 && "bg-white/[0.015]")}
                  >
                    <td className="p-5 font-medium text-foam sm:p-6">{row.label}</td>
                    {companies.map((c) => (
                      <td
                        key={c.id}
                        className={cn("p-5 sm:p-6", c.rank === 1 && "bg-spray/[0.05] ring-1 ring-inset ring-spray/15")}
                      >
                        <CellView status={row.cells[c.id].status} text={row.cells[c.id].text} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal>
          <ScoreBars />
        </Reveal>
      </div>
    </section>
  );
}
