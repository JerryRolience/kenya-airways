import { Features } from "@/components/home-page/features";
import { FlightExperience } from "@/components/home-page/flight-experience";
import { Footer } from "@/components/home-page/footer";
import { HelpCta } from "@/components/home-page/help-cta";
import { Hero } from "@/components/home-page/hero";
import { HowItWorks } from "@/components/home-page/how-it-works";
import { Navbar } from "@/components/home-page/nav-bar";
import { Stats } from "@/components/home-page/stats";
import { TopDestinations } from "@/components/home-page/top-destination";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <TopDestinations />
        <Features />
        <FlightExperience />
        <Stats />
        <HowItWorks />
        <HelpCta />
        <Footer />
      </main>
    </div>
  );
}
