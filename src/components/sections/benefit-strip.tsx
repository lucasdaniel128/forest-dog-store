import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Wrench, Users, Truck, Tent } from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

const BENEFITS = [
  {
    icon: Wrench,
    title: "Montagem prática",
    text: "Sistema de abertura automática que elimina a necessidade de montar peça por peça.",
  },
  {
    icon: Users,
    title: "Espaço para 5–6 pessoas",
    text: "Ample espaço interno projetado para conforto em família ou com amigos.",
  },
  {
    icon: Truck,
    title: "Transporte facilitado",
    text: "Compacta e leve, ideal para levar em viagens, praia ou acampamento.",
  },
  {
    icon: Tent,
    title: "Camping e lazer",
    text: "Proteção e praticidade para momentos ao ar livre em qualquer estação.",
  },
] as const;

export function BenefitStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="bg-surface">
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
              Por que escolher a Joyfox
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  variants={staggerItem}
                  className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-white p-5 text-center"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest/8">
                    <Icon className="h-5 w-5 text-forest" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <h3 className="text-sm font-bold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-muted">
                    {benefit.text}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
