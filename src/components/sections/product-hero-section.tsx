import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Users, Package } from "lucide-react";
import { PRODUCT } from "@/constants";
import { Button } from "@/components/ui/button";
import { ProductMediaGallery } from "@/components/product/product-media-gallery";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const HIGHLIGHTS = [
  { icon: Zap, text: "Abertura prática" },
  { icon: Users, text: "Para 5–6 pessoas" },
  { icon: Package, text: "Fácil de transportar" },
] as const;

export function ProductHeroSection() {
  const navigate = useNavigate();

  const handleCTAClick = useCallback(() => {
    navigate("/checkout");
  }, [navigate]);

  return (
    <section className="bg-background" id="hero">
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16 lg:px-8 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_420px] lg:gap-14 xl:grid-cols-[1fr_480px]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full"
          >
            <ProductMediaGallery />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            <motion.div variants={fadeInUp} className="flex flex-col gap-3">
              <h1 className="text-[1.75rem] font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-[2rem] lg:text-[2.375rem]">
                Barraca Automática Joyfox
              </h1>
              <p className="text-[15px] leading-relaxed text-muted">
                Mais praticidade para montar, aproveitar e guardar.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
              {HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                return (
                  <span
                    key={item.text}
                    className="flex items-center gap-2 rounded-full border border-border/60 bg-white px-3.5 py-2 text-[13px] font-medium text-foreground"
                  >
                    <Icon className="h-3.5 w-3.5 text-forest" aria-hidden="true" />
                    {item.text}
                  </span>
                );
              })}
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-muted">R$</span>
                  <span className="text-[2.75rem] font-extrabold leading-none tracking-tight text-foreground">
                    164,99
                  </span>
                </div>
                <span className="text-[13px] text-muted">{PRODUCT.installments}</span>
              </div>

              <div className="flex flex-col gap-3 sm:max-w-[320px]">
                <Button variant="cta" size="full" onClick={handleCTAClick}>
                  {PRODUCT.ctaText}
                </Button>
                <span className="text-center text-[12px] text-muted">
                  Pix, cartão de crédito ou boleto
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <div id="hero-cta-sentinel" aria-hidden="true" className="h-px" />
    </section>
  );
}
