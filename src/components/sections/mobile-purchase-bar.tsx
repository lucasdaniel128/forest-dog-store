import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCT } from "@/constants";
import { useMediaQuery } from "@/hooks";
import { Button } from "@/components/ui/button";

export function MobilePurchaseBar() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleCTAClick = useCallback(() => {
    const section = document.getElementById(PRODUCT.purchaseSectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const trigger = triggerRef.current;
    if (!trigger) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <>
      <div ref={triggerRef} aria-hidden="true" className="h-0" />

      <AnimatePresence>
        {isMobile && isVisible && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-surface/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
          >
            <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between gap-4 px-5">
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-foreground">
                  {PRODUCT.price}
                </span>
                <span className="text-[10px] leading-tight text-muted-custom">
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
