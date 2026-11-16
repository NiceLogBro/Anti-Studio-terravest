import { ArrowUpRight } from "lucide-react";
import { photoGalleryUrl, photos } from "@/assets/images";
import { Reveal, SectionHeader } from "@/components/ui";

const projectPhotos = [
  {
    label: "On the job",
    src: photos.work,
    alt: "A rotary surface cleaner washing a brick-paver driveway on O'ahu",
    detail: "Surface cleaning in progress",
    position: "50% 60%",
  },
  {
    label: "A cleaner finish",
    src: photos.finish,
    alt: "Freshly washed concrete driveway outside a Kāne'ohe Bay home with white garage doors and a flowering plumeria tree",
    detail: "A refreshed driveway",
    position: "50% 50%",
  },
];

export default function ProjectResults() {
  return (
    <section id="results" className="relative scroll-mt-24 bg-deep/60 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="From the Field"
          title={
            <>
              Real work. <span className="shimmer-text">Real O'ahu places.</span>
            </>
          }
          desc="A closer look at the work itself and the clean surfaces Tool Guys leaves behind, using photos from their own project gallery."
        />

        <Reveal className="mt-12">
          <figure>
            <div className="grid gap-5 md:grid-cols-2">
              {projectPhotos.map((photo) => (
                <div key={photo.label}>
                  <div className="mb-3 flex items-baseline justify-between gap-3">
                    <span className="font-display text-lg font-bold text-foam">{photo.label}</span>
                    <span className="text-xs text-white/45">{photo.detail}</span>
                  </div>
                  <div className="overflow-hidden rounded-2xl bg-white/5">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="h-[330px] w-full object-cover sm:h-[440px] lg:h-[500px]"
                      style={{ objectPosition: photo.position }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              ))}
            </div>
            <figcaption className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
              <span>Actual Tool Guys project photos from different jobs, not a before-and-after of one property.</span>
              <a
                href={photoGalleryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-spray/85 transition hover:text-foam"
              >
                Explore the project gallery <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}