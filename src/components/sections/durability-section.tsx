import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Users, Package } from "lucide-react";
import { Section } from "@/components/layout/section";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import detailImage1 from "@/assets/images/D_NQ_NP_2X_736749-MLA113602768169_062026-F.webp";
import detailImage2 from "@/assets/images/D_NQ_NP_2X_980271-MLA112438593888_062026-F.webp";
import detailImage3 from "@/assets/images/D_NQ_NP_2X_884669-MLA112438799594_062026-F.webp";

const DETAILS = [
  {
    image: detailImage1,
    alt: "Barraca Joyfox — montagem e estrutura",
    icon: Zap,
    title: "Montagem prática",
    description: "Sistema pensado para simplificar a preparação do acampamento.",
  },
  {
    image: detailImage2,
    alt: "Barraca Joyfox — espaço interno",
    icon: Users,
    title: "Espaço interno",
    description: "Modelo anunciado pelo fabricante para 5–6 pessoas.",
  },
  {
    image: detailImage3,
    alt: "Barraca Joyfox — transporte e uso",
    icon: Package,
    title: "Transporte em bolsa",
    description: "Acompanha formato compacto para guardar e transportar.",
  },
] as const;

export function DurabilitySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <Section className="bg-surface py-24 sm:py-32 lg:py-40">
      <motion.div
        ref={sectionRef}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex flex-col items-center gap-12 lg:gap-16"
      >
        <motion.div variants={fadeInUp} className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-[1.75rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Pensada para facilitar seus momentos ao ar livre.
          </h2>
        </motion.div>

        <div className="flex flex-col gap-12 lg:gap-16">
          {DETAILS.map((detail, i) => {
            const Icon = detail.icon;
            const isReversed = i % 2 === 1;
            return (
              <motion.div
                key={detail.title}
                variants={fadeInUp}
                className={`grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10 lg:items-center ${
                  isReversed ? "lg:direction-rtl" : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden rounded-3xl shadow-lg shadow-black/5 ring-1 ring-black/5 ${
                    isReversed ? "lg:order-2" : ""
                  }`}
                >
                  <img
                    src={detail.image}
                    alt={detail.alt}
                    className="h-full w-full object-cover"
                    style={{ aspectRatio: "4/3" }}
                    loading="lazy"
                  />
                </div>

                <div
                  className={`flex flex-col gap-4 ${
                    isReversed ? "lg:order-1 lg:items-end lg:text-right" : ""
                  }`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10 text-forest">
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-sm font-semibold text-foreground">
                      {detail.title}
                    </h3>
                    <p className="max-w-sm text-[13px] leading-relaxed text-muted-custom">
                      {detail.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </Section>
  );
}
