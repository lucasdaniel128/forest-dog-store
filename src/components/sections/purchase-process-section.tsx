import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShoppingCart, CreditCard, Mail } from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

const STEPS = [
  {
    number: "1",
    icon: ShoppingCart,
    title: "Escolha sua barraca",
    text: "Clique em Comprar Agora e preencha os dados do pedido.",
  },
  {
    number: "2",
    icon: CreditCard,
    title: "Pague via Pix",
    text: "Finalize o pagamento no próprio site.",
  },
  {
    number: "3",
    icon: Mail,
    title: "Receba o rastreio",
    text: "Após a postagem, o código de rastreio será enviado por e-mail.",
  },
] as const;

export function PurchaseProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-surface scroll-mt-[64px]" id="purchase">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col items-center gap-14 lg:gap-16"
        >
          <motion.div variants={fadeInUp} className="text-center">
            <h2 className="text-[1.75rem] font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Seu pedido em 3 passos simples.
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid w-full max-w-2xl grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8"
          >
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={staggerItem}
                  className="flex flex-col items-center gap-4 text-center"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest text-sm font-bold text-white">
                    {step.number}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-center gap-2">
                      <Icon className="h-4 w-4 text-forest" aria-hidden="true" />
                      <h3 className="text-sm font-bold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="max-w-[220px] text-[13px] leading-relaxed text-muted">
                      {step.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
      <div id="purchase-process-end" aria-hidden="true" className="h-px" />
    </section>
  );
}
