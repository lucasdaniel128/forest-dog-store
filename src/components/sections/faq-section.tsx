import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

const QUESTIONS = [
  {
    q: "Como funciona o pagamento?",
    a: "O pagamento pode ser feito por Pix, cartão de crédito ou boleto. As opções estarão disponíveis durante o checkout.",
  },
  {
    q: "Qual o prazo de entrega?",
    a: "O prazo de entrega é calculado pelo CEP informado no checkout, podendo variar conforme a região.",
  },
  {
    q: "A barraca acompanha manual de instruções?",
    a: "Sim, a barraca acompanha instruções para uso. O sistema de abertura é automático, o que facilita a montagem.",
  },
  {
    q: "Qual a capacidade da barraca?",
    a: "O modelo Joyfox é anunciado para acomodar de 5 a 6 pessoas, com espaço interno projetado para conforto.",
  },
  {
    q: "Como faço para acompanhar meu pedido?",
    a: "Após a postagem, o código de rastreio ficará disponível para acompanhamento. Você também pode usar o número do pedido na página de rastreio do site.",
  },
  {
    q: "Posso devolver o produto?",
    a: "Consulte nossa política de trocas e devoluções para mais informações sobre prazos e condições.",
  },
] as const;

export function FaqSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

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
              Perguntas frequentes
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="w-full max-w-2xl"
          >
            {QUESTIONS.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div
                  key={item.q}
                  variants={staggerItem}
                  className="border-b border-border/60"
                >
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-[15px] font-semibold text-foreground"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 text-[14px] leading-relaxed text-muted">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
