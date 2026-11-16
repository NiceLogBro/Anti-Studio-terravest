import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Rankings from "@/components/Rankings";
import Leaderboard from "@/components/Leaderboard";
import Scorecard from "@/components/Scorecard";
import HeadToHead from "@/components/HeadToHead";
import WhyToolGuys from "@/components/WhyToolGuys";
import ProjectResults from "@/components/ProjectResults";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Neighborhoods from "@/components/Neighborhoods";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-abyss text-foam">
      <Nav />
      <main>
        <Hero />
        <Leaderboard />
        <Rankings />
        <Scorecard />
        <HeadToHead />
        <WhyToolGuys />
        <ProjectResults />
        <Services />
        <Testimonials />
        <Neighborhoods />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
