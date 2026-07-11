import { useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Section } from "@/components/layout/section";
import { fadeInUp } from "@/lib/animations";

const FAQ_ITEMS = [
  {
    question: "Como funciona a montagem da barraca?",
    answer:
      "A Barraca Automática Joyfox possui sistema automático de montagem. Em poucos segundos a barraca se monta sozinha, sem necessidade de montar hastes ou peças separadas.",
  },
  {
    question: "Quantas pessoas cabem na barraca?",
    answer:
      "O modelo é anunciado pelo fabricante para até 5–6 pessoas, oferecendo amplo espaço interno para camping e lazer.",
  },
  {
    question: "Como é o transporte da barraca?",
    answer:
      "A barraca acompanha formato compacto na bolsa de transporte, sendo leve e prática para levar em viagens e acampamentos.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "O pagamento é feito via Pix, com confirmação direta no processo de compra.",
  },
  {
    question: "Como receive o atendimento após a compra?",
    answer:
      "O atendimento é realizado pelo WhatsApp, onde você pode tirar dúvidas e acompanhar as informações do seu pedido.",
  },
  {
    question: "A barraca serve para qual tipo de uso?",
    answer:
      "A Joyfox é indicada para camping, viagens e momentos ao ar livre. Seu sistema automático facilita a preparação em qualquer ambiente.",
  },
] as const;

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-foreground">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-muted-custom"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[13px] leading-relaxed text-muted-custom">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <Section className="bg-background py-24 sm:py-32 lg:py-40">
      <motion.div
        ref={sectionRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="mx-auto flex max-w-2xl flex-col items-center gap-10 lg:gap-14"
      >
        <motion.div variants={fadeInUp} className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-[1.75rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Dúvidas frequentes.
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed text-muted-custom sm:text-base">
            Respostas diretas para as perguntas mais comuns.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="w-full">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === i}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </motion.div>
      </motion.div>
    </Section>
  );
}
