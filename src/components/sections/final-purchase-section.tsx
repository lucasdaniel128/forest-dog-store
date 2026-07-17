import { useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { PRODUCT } from "@/constants";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function FinalPurchaseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const navigate = useNavigate();

  const handleCTAClick = useCallback(() => {
    navigate("/checkout");
  }, [navigate]);

  return (
    <section className="bg-forest-dark">
      <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36 lg:px-8 lg:py-48">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col items-center gap-10 text-center lg:gap-14"
        >
          <motion.div variants={fadeInUp} className="flex flex-col gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cta">
              Forest Dog
            </p>
            <h2 className="text-[2rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-[3rem]">
              Pronto para aproveitar sua
              <br />
              próxima aventura?
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-medium text-white/60">
                {PRODUCT.name}
              </span>
              <span className="text-[13px] text-white/35">
                Modelo anunciado para {PRODUCT.capacity}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-base font-medium text-white/40">R$</span>
                <span className="text-[3.5rem] font-extrabold leading-none tracking-tight text-white sm:text-[4rem]">
                  164,99
                </span>
              </div>
              <span className="text-[13px] text-white/35">{PRODUCT.installments}</span>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex w-full max-w-sm flex-col gap-3">
            <Button
              variant="cta"
              size="full"
              onClick={handleCTAClick}
            >
              {PRODUCT.ctaText}
            </Button>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex items-center gap-4 text-[11px] text-white/25">
            <span>Pagamento via Pix ou cartão</span>
            <span className="h-3 w-px bg-white/15" />
            <span>Compra finalizada no site</span>
            <span className="h-3 w-px bg-white/15" />
            <span>Rastreio por e-mail</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
