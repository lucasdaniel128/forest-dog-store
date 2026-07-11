import { SEO } from "@/components/seo";
import { SiteHeader } from "@/components/layout/site-header";
import { HeroSection } from "@/components/sections/hero-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { MemorySection } from "@/components/sections/memory-section";
import { WhyChooseJoyfoxSection } from "@/components/sections/why-choose-joyfox-section";
import { DurabilitySection } from "@/components/sections/durability-section";
import { ComparisonImageSection } from "@/components/sections/comparison-image-section";
import { SocialProofSection } from "@/components/sections/social-proof-section";
import { PurchaseConfidenceSection } from "@/components/sections/purchase-confidence-section";
import { FaqSection } from "@/components/sections/faq-section";
import { ClosingSection } from "@/components/sections/closing-section";
import { MobilePurchaseBar } from "@/components/sections/mobile-purchase-bar";

export function LandingPage() {
  return (
    <>
      <SEO
        title="Barraca Automática Joyfox 5-6 Pessoas"
        description="Barraca Automática Joyfox com montagem prática, amplo espaço interno e proteção para seus momentos ao ar livre."
      />
      <SiteHeader />
      <HeroSection />
      <GallerySection />
      <MemorySection />
      <WhyChooseJoyfoxSection />
      <DurabilitySection />
      <ComparisonImageSection />
      <SocialProofSection />
      <PurchaseConfidenceSection />
      <FaqSection />
      <ClosingSection />
      <MobilePurchaseBar />
    </>
  );
}
