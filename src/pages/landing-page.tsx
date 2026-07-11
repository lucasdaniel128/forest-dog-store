import { SEO } from "@/components/seo";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProductHeroSection } from "@/components/sections/product-hero-section";
import { BenefitStrip } from "@/components/sections/benefit-strip";
import { StorySection } from "@/components/sections/story-section";
import { OpeningDemoSection } from "@/components/sections/opening-demo-section";
import { ProductDetailsSection } from "@/components/sections/product-details-section";
import { ComparisonSection } from "@/components/sections/comparison-section";
import { PurchaseProcessSection } from "@/components/sections/purchase-process-section";
import { DeliverySection } from "@/components/sections/delivery-section";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalPurchaseSection } from "@/components/sections/final-purchase-section";
import { MobilePurchaseBar } from "@/components/sections/mobile-purchase-bar";

export function LandingPage() {
  return (
    <>
      <SEO
        title="Barraca Automática Joyfox 5-6 Pessoas"
        description="Barraca Automática Joyfox com montagem prática, amplo espaço interno e proteção para seus momentos ao ar livre."
      />
      <SiteHeader />
      <ProductHeroSection />
      <BenefitStrip />
      <StorySection />
      <OpeningDemoSection />
      <ProductDetailsSection />
      <ComparisonSection />
      <PurchaseProcessSection />
      <DeliverySection />
      <FaqSection />
      <FinalPurchaseSection />
      <SiteFooter />
      <MobilePurchaseBar />
    </>
  );
}
