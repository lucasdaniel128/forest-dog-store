import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import comparisonImage from "@/assets/images/D_NQ_NP_2X_613303-MLA113602768109_062026-F.webp";

const CRITERIA = [
  { label: "Montagem", traditional: "Montagem manual com peças separadas", joyfox: "Sistema de abertura prática" },
  { label: "Uso", traditional: "Mais etapas para começar a aproveitar", joyfox: "Rápida preparação para uso" },
  { label: "Transporte", traditional: "Volume maior e mais difícil de carregar", joyfox: "Compacta e fácil de transportar" },
  { label: "Preparação", traditional: "Mais tempo dedicado à montagem", joyfox: "Mais tempo aproveitando o local" },
] as const;

export function ComparisonSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-forest-dark">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col items-center gap-14 lg:gap-20"
        >
          <motion.div variants={fadeInUp} className="max-w-xl text-center">
            <h2 className="text-[1.75rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-3xl lg:text-4xl">
              Mais praticidade na preparação do acampamento.
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2"
          >
            {CRITERIA.map((row) => (
              <motion.div
                key={row.label}
                variants={staggerItem}
                className="flex flex-col gap-4 rounded-2xl bg-white/[0.04] p-6"
              >
                <span className="text-sm font-bold uppercase tracking-wider text-white/50">
                  {row.label}
                </span>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/20" />
                    <span className="text-[14px] leading-snug text-white/35">
                      {row.traditional}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cta" />
                    <span className="text-[14px] font-medium leading-snug text-white">
                      {row.joyfox}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="w-full max-w-2xl">
            <img
              src={comparisonImage}
              alt="Diagrama comparativo informativo da Barraca Automática Joyfox"
              className="h-full w-full object-contain rounded-xl"
              style={{ aspectRatio: "16/10" }}
              loading="lazy"
            />
            <p className="mt-4 text-center text-[11px] text-white/25">
              Imagem informativa do produto.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
