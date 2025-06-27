import { HeroSection } from "./HomePage/components/HeroSection";
import { LogosSection } from "./HomePage/components/LogosSection";
import { MethodsSection } from "./HomePage/components/MethodsSection";
import { HowItWorksSection } from "./HomePage/components/HowItWorksSection";
import { BenefitsSection } from "./HomePage/components/BenefitsSection";
import { CTASection } from "./HomePage/components/CTASection";
import { MarqueeSection } from "./HomePage/components/MarqueeSection";
import { FooterSection } from "./HomePage/components/FooterSection";
import { ParticleBackground }from "../components/ui/ParticleBackground";

const ParticleBackground = lazy(() => 
  import("../components/ui/ParticleBackground").then(module => ({ default: module.ParticleBackground }))
);

export const HomePage = () => {
  return (
    <main className="pt-24 relative"> 
      <ParticleBackground />     
      <div className="w-full px-10 2xl:px-44 relative z-10">
        <HeroSection />
        <LogosSection />
        <MethodsSection />
        <MarqueeSection />
        <HowItWorksSection />
        <BenefitsSection />
      </div>

      <CTASection />
      <div className="px-10 relative z-10">
        <FooterSection />
      </div>
    </main>
  );
};