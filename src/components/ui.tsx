import { useEffect, useRef, useState, type ReactNode } from "react";
import { Star } from "lucide-react";
import { cn } from "@/utils/cn";

export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.12);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", inView && "reveal-in", className)}
    >
      {children}
    </div>
  );
}

export function Stars({ rating, className }: { rating: number; className?: string }) {
  const star = (key: number) => (
    <Star key={key} className="h-4 w-4 shrink-0" fill="currentColor" strokeWidth={0} />
  );
  return (
    <div className={cn("relative inline-flex", className)} aria-label={`${rating} out of 5 stars`}>
      <div className="flex gap-0.5 text-white/20">{[0, 1, 2, 3, 4].map(star)}</div>
      <div
        className="absolute inset-0 flex gap-0.5 overflow-hidden text-gold"
        style={{ width: `${(rating / 5) * 100}%` }}
      >
        {[0, 1, 2, 3, 4].map(star)}
      </div>
    </div>
  );
}

export function CountUp({
  to,
  decimals = 0,
  suffix = "",
  duration = 1600,
  className,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.6);
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function ScoreRing({ score, size = 112 }: { score: number; size?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const r = 44;
  const c = 2 * Math.PI * r;
  const pct = inView ? score / 10 : 0;
  return (
    <div ref={ref} className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(.22,1,.36,1)" }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#46dcff" />
            <stop offset="100%" stopColor="#f2b33d" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-extrabold leading-none">
          {inView ? score.toFixed(1) : "0.0"}
        </span>
        <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/50">
          / 10
        </span>
      </div>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  desc,
  align = "center",
}: {
  eyebrow: string;
  title: ReactNode;
  desc?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-spray">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-foam sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {desc && <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">{desc}</p>}
    </Reveal>
  );
}
