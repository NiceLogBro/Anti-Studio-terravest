import { Droplets } from "lucide-react";
import { photoGalleryUrl } from "@/assets/images";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-abyss px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-spray to-lagoon">
                <Droplets className="h-5 w-5 text-abyss" strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-extrabold text-foam">
                Wash Report <span className="text-spray">O'ahu</span>
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/50">
              An independent editorial comparison of O'ahu's leading power washing companies. Rankings reflect
              editorial opinion based on publicly available information, service descriptions and community
              feedback current as of 2026. We are not affiliated with, endorsed by, or compensated by any company
              listed. “Paradice Pressure Washing” refers to Paradise Pressure Washing LLC. Always verify
              licensing, insurance, pricing and scope directly with any contractor before hiring.
            </p>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-white/40">
              Project photography from{" "}
              <a href={photoGalleryUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-spray">
                Tool Guys – Power Washing's public gallery
              </a>
              . Photos illustrate their published work, not independent verification of results.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Rankings</p>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li>
                <span className="font-bold text-gold">#1</span>{" "}
                <a href="https://powerwashingoahu.com" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-spray hover:underline">
                  Tool Guys – Power Washing
                </a>
              </li>
              <li>
                <span className="font-bold text-white/70">#2</span> Paradise Pressure Washing LLC
              </li>
              <li>
                <span className="font-bold text-white/70">#3</span> EcoClean Hawaii
              </li>
              <li>
                <span className="font-bold text-white/70">#4</span> Pacific Spray Wash
              </li>
              <li>
                <span className="font-bold text-white/70">#5</span> Big Wave Pressure Washing
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">On this page</p>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              {[
                ["#rankings", "Rankings"],
                ["#head-to-head", "Head-to-Head"],
                ["#why", "Why #1"],
                ["#results", "Project Photos"],
                ["#reviews", "Reviews"],
                ["#faq", "FAQ"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="transition hover:text-spray">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© 2026 The O'ahu Wash Report. All rights reserved.</p>
          <p>Built with aloha on O'ahu 🤙</p>
        </div>
      </div>
    </footer>
  );
}
