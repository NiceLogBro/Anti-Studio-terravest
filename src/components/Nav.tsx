import { useEffect, useRef, useState } from "react";
import { Droplets } from "lucide-react";
import { cn } from "@/utils/cn";

const links = [
  { href: "#leaderboard", label: "Rankings" },
  { href: "#scorecard", label: "Scorecard" },
  { href: "#head-to-head", label: "Head-to-Head" },
  { href: "#why", label: "Why #1" },
  { href: "#results", label: "Photos" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy: highlight the section currently in view.
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-38% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Keep the active pill visible in the mobile strip without moving the page.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !active) return;
    const el = strip.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!el) return;
    strip.scrollTo({
      left: el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-abyss/85 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-abyss/70 to-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          <a href="#top" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-spray to-lagoon shadow-lg shadow-spray/20">
              <Droplets className="h-5 w-5 text-abyss" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-foam">
              Wash Report <span className="text-spray">O'ahu</span>
            </span>
          </a>

          {/* Desktop links — no phone button, no menu toggle */}
          <nav aria-label="Sections" className="hidden items-center gap-6 lg:flex">
            {links.map((l) => {
              const isActive = active === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative py-1 text-sm font-medium transition-colors",
                    isActive ? "text-spray" : "text-white/70 hover:text-spray",
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-0.5 w-full origin-left rounded-full bg-spray transition-transform duration-300",
                      isActive ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </a>
              );
            })}
          </nav>
        </div>

        {/* Mobile: always-visible scrollable pills (replaces the old dropdown) */}
        <div
          ref={stripRef}
          className="nav-scroll -mx-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:hidden"
        >
          <nav aria-label="Sections" className="flex w-max items-center gap-2">
            {links.map((l) => {
              const isActive = active === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  data-id={l.href.slice(1)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold backdrop-blur transition-colors",
                    isActive
                      ? "border-spray/60 bg-spray/15 text-spray"
                      : "border-white/12 bg-abyss/50 text-white/75 hover:border-spray/40 hover:text-spray",
                  )}
                >
                  {l.label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
