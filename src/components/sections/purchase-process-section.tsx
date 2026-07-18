import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

const STEPS = [
  {
    step: "1",
    title: "Escolha sua barraca",
    text: "Clique em Comprar Agora e informe seus dados.",
  },
  {
    step: "2",
    title: "Escolha o pagamento",
    text: "Pague via Pix, cartão de crédito ou boleto.",
  },
  {
    step: "3",
    title: "Acompanhe o pedido",
    text: "Use o número do pedido para consultar as atualizações.",
  },
] as const;

export function PurchaseProcessSection() {
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
              Como funciona a compra
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid w-full max-w-2xl grid-cols-1 gap-8 sm:grid-cols-3"
          >
            {STEPS.map((step) => {
              return (
                <motion.div
                  key={step.title}
                  variants={staggerItem}
                  className="flex flex-col items-center gap-3 text-center"
                >
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-forest text-xs font-bold text-white">
                    {step.step}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="max-w-[200px] text-[13px] leading-relaxed text-muted">
                      {step.text}
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
