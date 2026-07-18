import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PRODUCT } from "@/constants";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function FinalPurchaseSection() {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const handleCTAClick = useCallback(() => {
    navigate("/checkout");
  }, [navigate]);

  return (
    <section className="bg-background" id="purchase">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col items-center gap-6 text-center"
        >
          <motion.div variants={fadeInUp} className="flex flex-col items-center gap-3">
            <h2 className="text-[1.5rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-2xl lg:text-[1.75rem]">
              Garanta a sua Joyfox agora
            </h2>
            <p className="max-w-md text-[15px] leading-relaxed text-muted">
              Barraca Automática Joyfox por {PRODUCT.price}. Pagamento via Pix, cartão de crédito ou boleto.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col items-center gap-3 sm:max-w-[320px]">
            <Button variant="cta" size="full" onClick={handleCTAClick}>
              {PRODUCT.ctaText}
            </Button>
            <span className="text-[12px] text-muted">
              {PRODUCT.installments}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
