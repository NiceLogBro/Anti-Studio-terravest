import { MapPin } from "lucide-react";
import { neighborhoods } from "@/data/companies";

function Row({ reverse = false }: { reverse?: boolean }) {
  const items = [...neighborhoods, ...neighborhoods];
  return (
    <div className="mask-fade-x overflow-hidden py-2">
      <div className={`flex w-max gap-3 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
        {items.map((n, i) => (
          <span
            key={`${n}-${i}`}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/70"
          >
            <MapPin className="h-3.5 w-3.5 text-spray" /> {n}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Neighborhoods() {
  return (
    <section className="relative border-y border-white/10 bg-abyss py-12">
      <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.3em] text-spray">
        One crew · Every neighborhood on O'ahu
      </p>
      <Row />
      <Row reverse />
    </section>
  );
}
