import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

const ROWS = [
  { label: "Montagem", traditional: "Mais etapas na montagem", joyfox: "Sistema de abertura prática" },
  { label: " Estrutura", traditional: "Mais peças separadas", joyfox: "Estrutura integrada" },
  { label: "Preparação", traditional: "Preparação mais demorada", joyfox: "Preparação simplificada" },
] as const;

export function ComparisonSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col items-center gap-10"
        >
          <motion.div variants={fadeInUp} className="text-center">
            <h2 className="text-[1.5rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-2xl lg:text-[1.75rem]">
              Mais praticidade na preparação do camping
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="w-full max-w-2xl overflow-hidden rounded-xl border border-border/60"
          >
            <div className="grid grid-cols-[1fr_1fr_1.2fr] bg-forest px-5 py-3 text-[12px] font-bold uppercase tracking-wider text-white/70">
              <span></span>
              <span className="text-center">Tradicional</span>
              <span className="text-center text-white">Joyfox</span>
            </div>
            {ROWS.map((row, i) => (
              <motion.div
                key={row.label}
                variants={staggerItem}
                className={`grid grid-cols-[1fr_1fr_1.2fr] px-5 py-4 text-[13px] ${
                  i % 2 === 0 ? "bg-white" : "bg-surface"
                }`}
              >
                <span className="font-semibold text-foreground">{row.label}</span>
                <span className="text-center text-muted">{row.traditional}</span>
                <span className="text-center font-medium text-foreground">{row.joyfox}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
