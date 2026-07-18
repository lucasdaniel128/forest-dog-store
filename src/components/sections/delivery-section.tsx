import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Package, Hash } from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

const ITEMS = [
  {
    icon: MapPin,
    title: "Prazo de entrega",
    text: "Calculado conforme o CEP informado no checkout.",
  },
  {
    icon: Package,
    title: "Acompanhamento",
    text: "Após a postagem, o rastreio ficará disponível para acompanhamento.",
  },
  {
    icon: Hash,
    title: "Consulte seu pedido",
    text: "O pedido poderá ser consultado usando o número informado após a compra.",
  },
] as const;

export function DeliverySection() {
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
              Entrega e acompanhamento
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
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest/8">
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
