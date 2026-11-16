import { Award, BadgeCheck, Check, ExternalLink, Mail, MapPin, Minus, Phone, Trophy, CalendarDays } from "lucide-react";
import { companies } from "@/data/companies";
import { Reveal, ScoreRing, SectionHeader, Stars } from "@/components/ui";
import { cn } from "@/utils/cn";

function CompanyCard({ company, featured }: { company: (typeof companies)[number]; featured: boolean }) {
  return (
    <Reveal delay={((company.rank - 1) % 3) * 120} className={cn("h-full lg:col-span-2", featured && "lg:-mt-4 lg:mb-4", company.rank === 4 && "lg:col-start-2")}>
      <article
        className={cn(
          "relative flex h-full flex-col rounded-3xl p-[1.5px] transition-transform duration-500",
          featured
            ? "bg-gradient-to-b from-spray via-gold/70 to-spray/10 shadow-[0_0_60px_-12px_rgba(70,220,255,0.45)] lg:scale-[1.03]"
            : "bg-white/10 hover:bg-white/20",
        )}
      >
        {featured && (
          <div className="absolute -top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-gold px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-abyss shadow-lg shadow-gold/40">
            <Trophy className="h-4 w-4" /> Our #1 pick
          </div>
        )}
        <div
          className={cn(
            "flex h-full flex-col rounded-[calc(1.5rem-1.5px)] bg-deep p-6 sm:p-7",
            featured && "bg-gradient-to-b from-ocean/80 to-deep",
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl font-display text-lg font-extrabold",
                  featured ? "bg-spray text-abyss" : "bg-white/10 text-foam",
                )}
              >
                #{company.rank}
              </span>
              <div>
                <h3 className="font-display text-lg font-bold leading-tight text-foam sm:text-xl">
                  {company.name}
                </h3>
                {company.aka && <p className="mt-0.5 text-xs text-white/45">{company.aka}</p>}
              </div>
            </div>
            <ScoreRing score={company.score} />
          </div>

          {company.badge && (
            <span
              className={cn(
                "mt-4 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
                featured ? "bg-spray/15 text-spray ring-1 ring-spray/40" : "bg-white/5 text-white/60 ring-1 ring-white/10",
              )}
            >
              <Award className="h-3 w-3" /> {company.badge}
            </span>
          )}

          <div className="mt-3 flex items-center gap-3">
            <Stars rating={company.rating} />
            <span className="text-sm font-semibold text-foam">{company.rating.toFixed(1)}</span>
            <span className="text-xs text-white/45">({company.reviewCount}+ reviews)</span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-white/70">{company.tagline}</p>

          {/* Quick facts */}
          <div className="mt-5 space-y-2 text-sm">
            <p className="flex items-center gap-2 text-white/60">
              <MapPin className="h-4 w-4 shrink-0 text-spray/80" /> {company.location}
            </p>
            <p className="flex items-center gap-2 text-white/60">
              <CalendarDays className="h-4 w-4 shrink-0 text-spray/80" /> On the island since {company.since}
            </p>
            {company.phone && (
              <p className="flex items-center gap-2 text-white/60">
                <Phone className="h-4 w-4 shrink-0 text-spray/80" /> {company.phone}
              </p>
            )}
            {company.email && (
              <p className="flex items-center gap-2 break-all text-white/60">
                <Mail className="h-4 w-4 shrink-0 text-spray/80" /> {company.email}
              </p>
            )}
          </div>

          {/* Pros / cons */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-spray">Strengths</p>
              <ul className="mt-2 space-y-1.5">
                {company.pros.map((p) => (
                  <li key={p} className="flex items-start gap-1.5 text-xs leading-relaxed text-white/75">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-spray" /> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">Watch-outs</p>
              <ul className="mt-2 space-y-1.5">
                {company.cons.map((c) => (
                  <li key={c} className="flex items-start gap-1.5 text-xs leading-relaxed text-white/50">
                    <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/80" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">Best for</p>
            <p className="mt-1 text-xs leading-relaxed text-white/75">{company.bestFor}</p>
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap gap-2.5 pt-1">
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition",
                featured
                  ? "bg-spray text-abyss shadow-lg shadow-spray/30 hover:bg-foam"
                  : "bg-white/10 text-foam ring-1 ring-white/15 hover:bg-white/20",
              )}
            >
              {company.websiteLabel} <ExternalLink className="h-4 w-4" />
            </a>
            {company.phoneHref && (
              <a
                href={company.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-foam transition hover:border-spray hover:text-spray"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
            )}
            {featured && (
              <span className="inline-flex items-center gap-1.5 self-center text-xs font-semibold text-spray">
                <BadgeCheck className="h-4 w-4" /> Licensed & insured
              </span>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function Rankings() {
  return (
    <section id="rankings" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-ocean/25 blur-[130px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="The Rankings · 2026"
          title={
            <>
              Top 5 power washing companies <span className="shimmer-text">on O'ahu</span>
            </>
          }
          desc="Scored across cleaning power, eco practices & water reclamation, island-wide coverage, response speed and reputation — based on public info and community feedback."
        />

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-6">
          {companies.map((c) => (
            <CompanyCard key={c.id} company={c} featured={c.rank === 1} />
          ))}
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/45">
          <span className="font-semibold uppercase tracking-widest text-white/35">How we scored</span>
          {[
            ["Cleaning power", "25%"],
            ["Value", "20%"],
            ["Eco / reclaim", "20%"],
            ["Coverage", "15%"],
            ["Response", "10%"],
            ["Reputation", "10%"],
          ].map(([k, v]) => (
            <span key={k}>
              {k} <span className="font-bold text-spray">{v}</span>
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
