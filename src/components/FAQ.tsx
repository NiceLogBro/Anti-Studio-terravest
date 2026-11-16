import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/companies";
import { Reveal, SectionHeader } from "@/components/ui";
import { cn } from "@/utils/cn";

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="FAQ"
          title={
            <>
              Questions, <span className="shimmer-text">answered</span>
            </>
          }
          desc="Everything you need to know before picking up the phone."
        />

        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 60}>
                <div
                  className={cn(
                    "overflow-hidden rounded-2xl border transition-colors",
                    isOpen ? "border-spray/40 bg-white/[0.05]" : "border-white/10 bg-white/[0.02] hover:border-white/25",
                  )}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-base font-bold text-foam sm:text-lg">{f.q}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-spray transition-transform duration-300",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-out",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-white/65 sm:px-6 sm:text-base">
                        {f.a}
                      </p>
                    </div>
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
