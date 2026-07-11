import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, TreePine, Package } from "lucide-react";
import { PRODUCT } from "@/constants";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import heroVideo from "@/assets/videos/Barraca Pop Up Joyfox 5-6 Pessoas Varanda 280240150cm Família Im.mp4";
import posterImage from "@/assets/images/D_NQ_NP_2X_981066-MLA113602445263_062026-F.webp";

const TRUST_LINE = [
  { icon: TreePine, text: "Pagamento via Pix" },
  { icon: MessageCircle, text: "Atendimento pelo WhatsApp" },
  { icon: Package, text: "Pedido com acompanhamento" },
] as const;

export function HeroSection() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
  }, []);

  const handleCTAClick = useCallback(() => {
    const section = document.getElementById(PRODUCT.purchaseSectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <Section className="pt-10 pb-24 sm:pt-14 sm:pb-32 lg:pb-40" id="hero">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-10 lg:gap-14"
      >
        <motion.div
          variants={fadeInUp}
          className="flex flex-col items-center gap-4 text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cta">
            Oferta Especial de Férias
          </p>
          <h1 className="max-w-lg text-[2rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-[2.625rem]">
            Sua próxima aventura começa em segundos.
          </h1>
          <p className="max-w-md text-[15px] leading-relaxed text-muted-custom sm:text-base">
            Barraca Automática Joyfox com montagem prática, amplo espaço interno
            e proteção para seus momentos ao ar livre.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="relative w-full overflow-hidden rounded-3xl shadow-xl shadow-black/5 ring-1 ring-black/5"
        >
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            {prefersReducedMotion ? (
              <img
                src={posterImage}
                alt="Barraca Automática Joyfox aberta em ambiente externo"
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={posterImage}
                aria-label="Vídeo demonstrativo da Barraca Automática Joyfox"
              >
                <source src={heroVideo} type="video/mp4" />
                <img
                  src={posterImage}
                  alt="Barraca Automática Joyfox aberta em ambiente externo"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </video>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="flex w-full max-w-lg flex-col items-center gap-6"
        >
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-sm font-medium text-foreground">
              {PRODUCT.name}
            </span>
            <span className="text-xs text-muted-custom">
              Modelo anunciado para {PRODUCT.capacity}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-semibold text-muted-custom">
                R$
              </span>
              <span className="text-[2.75rem] font-extrabold leading-none tracking-tight text-foreground">
                164,99
              </span>
            </div>
            <span className="text-sm text-muted-custom">
              {PRODUCT.installments}
            </span>
          </div>

          <Button
            variant="cta"
            size="full"
            onClick={handleCTAClick}
          >
            {PRODUCT.ctaText}
          </Button>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {TRUST_LINE.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.text}
                  className="flex items-center gap-1.5 text-xs text-muted-custom"
                >
                  <Icon className="h-[14px] w-[14px] text-forest" aria-hidden="true" />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
}
