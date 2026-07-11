import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Truck, Calendar, Mail } from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

const ITEMS = [
  {
    icon: Truck,
    title: "Postagem",
    text: "Até 2 dias úteis após a confirmação do pagamento.",
  },
  {
    icon: Calendar,
    title: "Prazo de entrega",
    text: "Calculado conforme o CEP informado no checkout.",
  },
  {
    icon: Mail,
    title: "Rastreamento",
    text: "Enviado por e-mail após a postagem.",
  },
] as const;

export function DeliverySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col items-center gap-10"
        >
          <motion.div variants={fadeInUp} className="text-center">
            <h2 className="text-[1.5rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-2xl lg:text-[1.75rem]">
              Entrega e acompanhamento.
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid w-full max-w-2xl grid-cols-1 gap-8 sm:grid-cols-3"
          >
            {ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={staggerItem}
                  className="flex flex-col items-center gap-3 text-center"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest/10">
                    <Icon className="h-4 w-4 text-forest" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="max-w-[200px] text-[13px] leading-relaxed text-muted">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
