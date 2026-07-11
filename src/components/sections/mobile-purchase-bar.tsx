import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCT } from "@/constants";
import { useMediaQuery } from "@/hooks";
import { Button } from "@/components/ui/button";

export function MobilePurchaseBar() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isVisible, setIsVisible] = useState(false);
  const [hideBar, setHideBar] = useState(false);

  const handleCTAClick = useCallback(() => {
    const section = document.getElementById(PRODUCT.purchaseSectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsVisible(false);
      return;
    }

    const heroSentinel = document.getElementById("hero-cta-sentinel");
    const finalSection = document.getElementById("purchase-process-end");

    if (!heroSentinel || !finalSection) {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const isNearEnd = scrollTop + windowHeight >= docHeight - 200;
        setIsVisible(scrollTop > windowHeight * 0.8 && !isNearEnd);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }

    const observers: IntersectionObserver[] = [];

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold: 0 }
    );
    heroObserver.observe(heroSentinel);
    observers.push(heroObserver);

    const sentinelAfterHero = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0 }
    );
    sentinelAfterHero.observe(heroSentinel);
    observers.push(sentinelAfterHero);

    const finalObserver = new IntersectionObserver(
      ([entry]) => {
        setHideBar(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    finalObserver.observe(finalSection);
    observers.push(finalObserver);

    return () => {
      observers.forEach((o) => o.disconnect());
    };
  }, [isMobile]);

  useEffect(() => {
    if (hideBar) setIsVisible(false);
  }, [hideBar]);

  return (
    <>
      <AnimatePresence>
        {isMobile && isVisible && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-border/40 bg-surface/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]"
          >
            <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between gap-4 px-5">
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-foreground">
                  {PRODUCT.price}
                </span>
                <span className="text-[10px] leading-tight text-muted">
                  {PRODUCT.installments}
                </span>
              </div>

              <Button
                variant="compact"
                size="compact"
                onClick={handleCTAClick}
              >
                Comprar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
