import { useRef, useCallback, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Check, X } from "lucide-react";
import { PRODUCT } from "@/constants";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import heroVideo from "@/assets/videos/Barraca Pop Up Joyfox 5-6 Pessoas Varanda 280240150cm Família Im.mp4";
import posterImage from "@/assets/images/D_NQ_NP_2X_981066-MLA113602445263_062026-F.webp";

const COMPARISON = [
  {
    label: "Tempo de montagem",
    traditional: "10–20 min",
    joyfox: "Segundos",
  },
  {
    label: "Facilidade",
    traditional: "Complexa",
    joyfox: "Automática",
  },
  {
    label: "Transporte",
    traditional: "Pesada e difícil",
    joyfox: "Leve e compacta",
  },
  {
    label: "Praticidade",
    traditional: "Muitas peças",
    joyfox: "Tudo integrado",
  },
] as const;

export function WhyChooseJoyfoxSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
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
    <Section
      className="bg-forest-dark py-24 sm:py-32 lg:py-40"
      id="why-joyfox"
    >
      <motion.div
        ref={sectionRef}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex flex-col items-center gap-12 lg:gap-16"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <motion.h2
            variants={fadeInUp}
            className="text-[1.75rem] font-extrabold leading-[1.1] tracking-tight text-white sm:text-3xl lg:text-4xl"
          >
            Esqueça as barracas tradicionais.
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="max-w-lg text-[15px] leading-relaxed text-white/60 sm:text-base"
          >
            Monte sua barraca em poucos segundos e aproveite mais tempo com sua
            família e amigos.
          </motion.p>
        </div>

        <motion.div
          variants={fadeInUp}
          className="mx-auto w-full max-w-2xl"
        >
          <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
            <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-wider">
              <span className="text-white/40" />
              <span className="text-center text-white/40">Tradicional</span>
              <span className="text-center text-cta">Joyfox</span>
            </div>

            {COMPARISON.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-[1fr_1fr_1fr] items-center px-4 py-3.5 text-sm ${
                  i < COMPARISON.length - 1 ? "border-b border-white/5" : ""
                }`}
              >
                <span className="font-medium text-white">{row.label}</span>
                <span className="flex items-center justify-center gap-1.5 text-white/40">
                  <X className="h-[14px] w-[14px] text-white/25" aria-hidden="true" />
                  {row.traditional}
                </span>
                <span className="flex items-center justify-center gap-1.5 font-medium text-white">
                  <Check className="h-[14px] w-[14px] text-cta" aria-hidden="true" />
                  {row.joyfox}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="mx-auto w-full max-w-2xl">
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/10">
            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
              {prefersReducedMotion ? (
                <img
                  src={posterImage}
                  alt="Demonstração da Barraca Automática Joyfox"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={posterImage}
                  aria-label="Vídeo de demonstração da Barraca Automática Joyfox"
                >
                  <source src={heroVideo} type="video/mp4" />
                  <img
                    src={posterImage}
                    alt="Demonstração da Barraca Automática Joyfox"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </video>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="flex justify-center">
          <Button
            variant="cta"
            size="full-sm"
            onClick={handleCTAClick}
          >
            Quero Minha Barraca
          </Button>
        </motion.div>
      </motion.div>
    </Section>
  );
}
