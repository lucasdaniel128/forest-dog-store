import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Users, Package } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";

const BENEFITS = [
  { icon: Zap, text: "Montagem prática" },
  { icon: Users, text: "Modelo anunciado para 5–6 pessoas" },
  { icon: Package, text: "Fácil de guardar e transportar" },
] as const;

export function BenefitStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section className="bg-forest">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-8 sm:flex-row sm:justify-center sm:gap-16 sm:px-6 sm:py-5 lg:px-8"
      >
        {BENEFITS.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <motion.div
              key={benefit.text}
              variants={staggerItem}
              className="flex items-center gap-3 text-[13px] font-medium tracking-wide text-white/80"
            >
              <Icon className="h-4 w-4 text-cta" aria-hidden="true" />
              <span>{benefit.text}</span>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
