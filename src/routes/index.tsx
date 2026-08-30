import { createFileRoute } from "@tanstack/react-router";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { FeaturesSection } from "@/sections/FeaturesSection";
import { HeroSection } from "@/sections/HeroSection";
import { StatsBar } from "@/sections/StatsBar";

const title = "Cyclone AI — Tropical Cyclone Intelligence Platform";
const description =
  "AI-powered tropical cyclone intelligence: detect, classify and forecast Bay of Bengal and Arabian Sea storms from multi-source satellite observations.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
