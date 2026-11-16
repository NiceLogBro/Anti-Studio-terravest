import { ArrowUpRight } from "lucide-react";
import { services, type Service } from "@/data/companies";
import { Reveal, SectionHeader } from "@/components/ui";
import { photoGalleryUrl, photos } from "@/assets/images";

const imagePosition: Record<Service["img"], string> = {
  driveway: "50% 42%",
  siding: "50% 28%",
  roof: "50% 46%",
  garage: "50% 50%",
  community: "50% 60%",
  stain: "50% 45%",
};

export default function Services() {
  return (
    <section id="services" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-ocean/30 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="From the PowerWashingOahu.com gallery"
          title={
            <>
              Services that make your property <span className="shimmer-text">shine</span>
            </>
          }
          desc="Real work on real O'ahu properties, photographed by Tool Guys – Power Washing. No stock imagery or staged renders."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 100}>
              <article className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-deep transition duration-300 hover:border-spray/40">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={photos[s.img]}
                    alt={s.alt}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    style={{ objectPosition: imagePosition[s.img] }}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/20 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-abyss/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-spray ring-1 ring-spray/30 backdrop-blur">
                    {s.chip}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="flex items-center justify-between font-display text-lg font-bold text-foam">
                    {s.title}
                    <ArrowUpRight className="h-5 w-5 text-spray opacity-0 transition group-hover:opacity-100" />
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{s.desc}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-white/45">
          Project photography from{" "}
          <a href={photoGalleryUrl} target="_blank" rel="noopener noreferrer" className="text-spray/80 underline-offset-2 hover:underline">
            PowerWashingOahu.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}
