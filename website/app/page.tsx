import { MarketingNavbar } from "@/components/MarketingNavbar";
import { HeroSection } from "@/components/HeroSection";
import { AppShowcase } from "@/components/AppShowcase";
import { BuiltToKeepYouGoing } from "@/components/BuiltToKeepYouGoing";
import { PersonaShowcase } from "@/components/PersonaShowcase";
import { ProductFeatures } from "@/components/ProductFeatures";
import { InteractiveShowcase } from "@/components/InteractiveShowcase";
import { EcosystemSection } from "@/components/EcosystemSection";
import { PricingSection } from "@/components/PricingSection";
import { FAQSection } from "@/components/FAQSection";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function MarketingHomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbfcfa]">
      <MarketingNavbar />
      <main className="flex-1">
        <HeroSection />
        <AppShowcase />
        <BuiltToKeepYouGoing />
        <PersonaShowcase />
        <ProductFeatures />
        <InteractiveShowcase />
        <EcosystemSection />
        <PricingSection />
        <FAQSection />
      </main>
      <MarketingFooter />
    </div>
  );
}
