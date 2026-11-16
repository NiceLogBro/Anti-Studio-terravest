import { Quote } from "lucide-react";
import { testimonials } from "@/data/companies";
import { Reveal, SectionHeader, Stars } from "@/components/ui";

export default function Testimonials() {
  return (
    <section id="reviews" className="relative scroll-mt-24 bg-deep/60 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Word on the street"
          title={
            <>
              What O'ahu says about the <span className="shimmer-text">#1 pick</span>
            </>
          }
          desc="Paraphrased from public reviews and community posts about Tool Guys – Power Washing."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <figure className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-gold/40 hover:bg-white/[0.05]">
                <Quote className="h-7 w-7 text-gold/70" fill="currentColor" strokeWidth={0} />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-white/75">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="font-display text-sm font-bold text-foam">{t.name}</p>
                    <p className="text-xs text-white/45">{t.place}</p>
                  </div>
                  <Stars rating={t.stars} />
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
