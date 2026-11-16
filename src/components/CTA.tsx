import { ExternalLink, Mail, Phone } from "lucide-react";
import { Reveal } from "@/components/ui";
import { photos } from "@/assets/images";

export default function CTA() {
  return (
    <section className="relative px-4 pb-24 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-spray/25">
          <img src={photos.cta} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-br from-abyss/95 via-ocean/85 to-lagoon/80" />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-spray/25 blur-[100px]" />
          <div className="relative px-6 py-16 text-center sm:px-12 sm:py-20">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-spray">Our #1 pick on O'ahu</p>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-extrabold leading-tight text-foam sm:text-5xl">
              Ready to blast the grime? Call <span className="shimmer-text">Tool Guys – Power Washing</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Free quotes, island-wide service, commercial-grade equipment and free water reclamation. The #1
              crew on PowerWashingOahu.com is one call away.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="tel:+18089276202"
                className="inline-flex items-center gap-2 rounded-full bg-spray px-6 py-3.5 text-sm font-extrabold text-abyss shadow-xl shadow-spray/30 transition hover:bg-foam"
              >
                <Phone className="h-4 w-4" /> (808) 927-6202
              </a>
              <a
                href="https://powerwashingoahu.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-foam px-6 py-3.5 text-sm font-extrabold text-abyss transition hover:bg-white"
              >
                PowerWashingOahu.com <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="mailto:powerwashingoahu@gmail.com"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-foam transition hover:border-spray hover:text-spray"
              >
                <Mail className="h-4 w-4" /> powerwashingoahu@gmail.com
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
