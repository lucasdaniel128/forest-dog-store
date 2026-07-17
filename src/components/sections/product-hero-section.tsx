import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PRODUCT } from "@/constants";
import { Button } from "@/components/ui/button";
import { ProductMediaGallery } from "@/components/product/product-media-gallery";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function ProductHeroSection() {
  const navigate = useNavigate();

  const handleCTAClick = useCallback(() => {
    navigate("/checkout");
  }, [navigate]);

  return (
    <section className="bg-background" id="hero">
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16 lg:px-8 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_380px] lg:gap-14 xl:grid-cols-[1fr_400px]">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp}>
              <ProductMediaGallery />
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8 lg:sticky lg:top-[88px]"
          >
            <motion.div variants={fadeInUp} className="flex flex-col gap-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cta">
                Praticidade para aproveitar mais cada aventura.
              </p>
              <h1 className="text-[1.75rem] font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-[2rem] lg:text-[2.375rem]">
                Praticidade para aproveitar
                <br />
                mais cada aventura.
              </h1>
              <p className="text-[15px] leading-relaxed text-muted">
                Uma barraca Joyfox com sistema de abertura prática, pensada para camping, viagens e momentos ao ar livre.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted">
                  Modelo anunciado para {PRODUCT.capacity}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-muted">R$</span>
                  <span className="text-[2.75rem] font-extrabold leading-none tracking-tight text-foreground">
                    164,99
                  </span>
                </div>
                <span className="text-[13px] text-muted">{PRODUCT.installments}</span>
              </div>

              <Button
                variant="cta"
                size="full"
                onClick={handleCTAClick}
              >
                {PRODUCT.ctaText}
              </Button>

              <div className="flex items-center gap-4 text-[11px] text-muted/70">
                <span>Pagamento via Pix</span>
                <span className="h-3 w-px bg-border" />
                <span>Compra finalizada no site</span>
                <span className="h-3 w-px bg-border" />
                <span>Rastreio por e-mail</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <div id="hero-cta-sentinel" aria-hidden="true" className="h-px" />
    </section>
  );
}
