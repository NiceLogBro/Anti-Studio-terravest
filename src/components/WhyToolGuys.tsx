import { Building2, Droplets, Gauge, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal, SectionHeader } from "@/components/ui";
import { photos } from "@/assets/images";

const features = [
  {
    icon: Gauge,
    title: "Serious PSI, pro attachments",
    desc: "Commercial 4,000+ PSI machines with surface cleaners, extenders and ride-on scrubbers — not a homeowner-grade wand from a hardware store.",
  },
  {
    icon: Droplets,
    title: "Free water reclaim on every job",
    desc: "Driveway, lot and garage cleans include a complimentary water-waste containment system — or a pump re-route — so runoff never hits the storm drain. HOA boards love this.",
  },
  {
    icon: MapPin,
    title: "The whole island, one crew",
    desc: "Home camp in Waikele & Wahiawa, working daily from Hale'iwa and the North Shore to Hawai'i Kai, Kailua and Kaneohe. If it's on O'ahu, they'll get there.",
  },
  {
    icon: Building2,
    title: "HOA, condo & commercial ready",
    desc: "Regular contracts for WOA condo associations, property managers, parking garages and vehicle fleets. They speak association, not just residential.",
  },
  {
    icon: Sparkles,
    title: "Red dirt & oil-stain specialists",
    desc: "O'ahu's iron-rich red dirt, oil, grease and hydraulic fluid stains are their everyday calls — with the right chemicals to lift them without etching concrete.",
  },
  {
    icon: ShieldCheck,
    title: "Local, licensed & insured",
    desc: "Locally owned and operated since 2020, licensed and insured, with fast quotes by phone, text or email and straightforward per-surface pricing.",
  },
];

export default function WhyToolGuys() {
  return (
    <section id="why" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-spray/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          {/* Sticky intro */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeader
              align="left"
              eyebrow="Why #1"
              title={
                <>
                  Why <span className="shimmer-text">Tool Guys – Power Washing</span> wins on O'ahu
                </>
              }
              desc="Paradise and Pacific Spray Wash own roofs, EcoClean owns restoration emergencies and Big Wave wins on budget — but for the everyday jobs that actually make your property look new again (driveways, siding, lots, stains), Tool Guys – Power Washing of PowerWashingOahu.com is the crew the island keeps recommending."
            />
            <Reveal delay={150} className="mt-8">
              <div className="relative overflow-hidden rounded-3xl border border-white/10">
                <img
                  src={photos.crew}
                  alt="Tool Guys crew member with a surface-cleaning machine outside an O'ahu building"
                  className="h-56 w-full object-cover object-[50%_20%] sm:h-64"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-abyss/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl glass px-4 py-3">
                  <p className="text-sm font-semibold text-foam">“Call us for literally any power washing situation.”</p>
                  <span className="shrink-0 rounded-full bg-spray px-3 py-1 text-xs font-extrabold text-abyss">
                    808-927-6202
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Feature grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 2) * 100 + Math.floor(i / 2) * 60}>
                <div className="group h-full rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:border-spray/40 hover:bg-white/[0.06]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-spray/25 to-lagoon/25 text-spray ring-1 ring-spray/30 transition group-hover:scale-110">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-foam">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
