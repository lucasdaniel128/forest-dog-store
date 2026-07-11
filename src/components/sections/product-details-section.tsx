import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import img980271 from "@/assets/images/D_NQ_NP_2X_980271-MLA112438593888_062026-F.webp";
import img884669 from "@/assets/images/D_NQ_NP_2X_884669-MLA112438799594_062026-F.webp";
import img736749 from "@/assets/images/D_NQ_NP_2X_736749-MLA113602768169_062026-F.webp";

const DETAILS = [
  {
    image: img980271,
    alt: "Barraca Joyfox — espaço interno para 5 a 6 pessoas",
    title: "Espaço interno",
    text: "Modelo anunciado para acomodar de 5 a 6 pessoas.",
  },
  {
    image: img884669,
    alt: "Barraca Joyfox — compacta para transporte e armazenamento",
    title: "Fácil de transportar",
    text: "Formato pensado para facilitar o transporte e o armazenamento.",
  },
  {
    image: img736749,
    alt: "Barraca Joyfox — praticidade para camping e viagens",
    title: "Praticidade para o lazer",
    text: "Uma opção para camping, viagens e momentos ao ar livre.",
  },
] as const;

export function ProductDetailsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col gap-20 lg:gap-28"
        >
          <motion.div variants={fadeInUp} className="text-center">
            <h2 className="text-[1.75rem] font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Como a Joyfox transforma seu camping.
            </h2>
          </motion.div>

          {DETAILS.map((detail, i) => {
            const isReversed = i % 2 === 1;
            return (
              <motion.div
                key={detail.title}
                variants={fadeInUp}
                className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16 ${
                  isReversed ? "lg:grid-cols-[1fr_1.2fr]" : ""
                }`}
              >
                <div className={isReversed ? "lg:order-2" : ""}>
                  <img
                    src={detail.image}
                    alt={detail.alt}
                    className="h-full w-full object-cover rounded-xl"
                    style={{ aspectRatio: "4/3" }}
                    loading="lazy"
                  />
                </div>

                <div
                  className={`flex flex-col gap-4 ${
                    isReversed ? "lg:order-1 lg:text-right lg:items-end" : ""
                  }`}
                >
                  <h3 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    {detail.title}
                  </h3>
                  <p className="max-w-sm text-[15px] leading-relaxed text-muted">
                    {detail.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
