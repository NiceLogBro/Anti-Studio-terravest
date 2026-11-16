import { ArrowDown, Award, ExternalLink, Gauge, MapPin, Star } from "lucide-react";
import { CountUp, Stars } from "@/components/ui";
import { photos } from "@/assets/images";

const droplets = [
  { left: "8%", top: "62%", size: 10, delay: "0s", dur: "8s" },
  { left: "16%", top: "74%", size: 7, delay: "1.2s", dur: "10s" },
  { left: "24%", top: "58%", size: 12, delay: "2.4s", dur: "9s" },
  { left: "33%", top: "70%", size: 6, delay: "0.6s", dur: "11s" },
  { left: "41%", top: "60%", size: 9, delay: "3s", dur: "8.5s" },
  { left: "52%", top: "72%", size: 13, delay: "1.8s", dur: "9.5s" },
  { left: "60%", top: "56%", size: 7, delay: "4.1s", dur: "10.5s" },
  { left: "68%", top: "68%", size: 10, delay: "0.9s", dur: "8s" },
  { left: "76%", top: "60%", size: 6, delay: "2.9s", dur: "11.5s" },
  { left: "84%", top: "72%", size: 11, delay: "1.5s", dur: "9s" },
  { left: "91%", top: "58%", size: 8, delay: "3.6s", dur: "10s" },
  { left: "47%", top: "82%", size: 8, delay: "5s", dur: "12s" },
];

const stats = [
  { icon: Award, value: <CountUp to={9.8} decimals={1} suffix="/10" />, label: "Editorial score — #1 of 5" },
  { icon: Gauge, value: <CountUp to={4000} suffix="+" />, label: "PSI commercial-grade gear" },
  { icon: MapPin, value: <CountUp to={100} suffix="%" />, label: "Island-wide coverage" },
  { icon: Star, value: <CountUp to={5} decimals={1} suffix="★" />, label: "Customer rating" },
];

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={photos.hero}
          alt="Pressure-washing equipment on a shingle roof overlooking an O'ahu beach"
          className="h-full w-full object-cover object-[55%_center] sm:object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-abyss/70 via-abyss/30 to-abyss" />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss/80 via-transparent to-abyss/40" />
        <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-spray/20 blur-[120px]" />
        <div className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-lagoon/30 blur-[110px]" />
      </div>

      {/* Rising droplets */}
      <div className="pointer-events-none absolute inset-0">
        {droplets.map((d, i) => (
          <span
            key={i}
            className="absolute animate-droplet rounded-full"
            style={{
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              background: "radial-gradient(circle at 30% 30%, rgba(234,252,255,.95), rgba(70,220,255,.45))",
              filter: "blur(0.5px)",
              animationDelay: d.delay,
              animationDuration: d.dur,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-28 pt-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="reveal reveal-in inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-spray">
            <span className="h-2 w-2 animate-pulse-soft rounded-full bg-spray" />
            2026 Edition · Independent comparison of O'ahu's top 5 crews
          </div>

          <h1 className="reveal reveal-in mt-6 font-display text-5xl font-extrabold leading-[1.04] tracking-tight text-foam sm:text-6xl lg:text-7xl" style={{ transitionDelay: "80ms" }}>
            The best <span className="shimmer-text">power washing</span> on O'ahu, ranked.
          </h1>

          <p className="reveal reveal-in mt-6 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl" style={{ transitionDelay: "160ms" }}>
            We put the island's biggest names head-to-head —{" "}
            <strong className="font-semibold text-foam">Tool Guys – Power Washing (PowerWashingOahu.com)</strong>,{" "}
            Paradise (Paradice) Pressure Washing, EcoClean Hawaii, Pacific Spray Wash and Big Wave Pressure Washing. One crew came out on top.
          </p>

          {/* Winner card */}
          <div className="reveal reveal-in mt-8 max-w-xl rounded-3xl border border-spray/30 bg-abyss/60 p-5 backdrop-blur-xl sm:p-6" style={{ transitionDelay: "240ms" }}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-abyss">
                <Award className="h-3.5 w-3.5" /> #1 Pick
              </span>
              <span className="font-display text-xl font-bold text-foam sm:text-2xl">
                Tool Guys – Power Washing
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Stars rating={5} />
              <span className="text-sm font-bold text-gold">9.8 / 10</span>
              <span className="text-sm text-white/60">locally owned since 2020 · island-wide</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="https://powerwashingoahu.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-spray px-5 py-2.5 text-sm font-bold text-abyss shadow-lg shadow-spray/30 transition hover:bg-foam"
              >
                Visit PowerWashingOahu.com <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="#rankings"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-foam transition hover:border-spray hover:text-spray"
              >
                See the full rankings <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="reveal reveal-in mt-14 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 lg:grid-cols-4" style={{ transitionDelay: "320ms" }}>
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-spray ring-1 ring-white/10">
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="font-display text-xl font-extrabold text-foam sm:text-2xl">{s.value}</div>
                <div className="text-xs text-white/55 sm:text-sm">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-abyss to-transparent" />
    </section>
  );
}
