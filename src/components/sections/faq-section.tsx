import { useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

const FAQ_ITEMS = [
  {
    question: "Como é feito o pagamento?",
    answer:
      "O pagamento é realizado via Pix diretamente no site. Após a confirmação do pagamento, o pedido seguirá para preparação.",
  },
  {
    question: "Quando meu pedido será postado?",
    answer:
      "A postagem é realizada em até 2 dias úteis após a confirmação do pagamento.",
  },
  {
    question: "Como acompanho a entrega?",
    answer:
      "Após a postagem, o código de rastreio será enviado para o e-mail informado no pedido.",
  },
  {
    question: "Qual é o prazo de entrega?",
    answer:
      "O prazo de entrega será calculado conforme o CEP informado no checkout. Após a postagem, o acompanhamento será feito pelo código enviado por e-mail.",
  },
  {
    question: "Posso desistir da compra?",
    answer:
      "Sim. Você pode solicitar a devolução em até 7 dias corridos após o recebimento do produto, conforme o Código de Defesa do Consumidor. A solicitação deverá ser realizada pelo canal de atendimento informado no site.",
  },
  {
    question: "Como entro em contato com a Forest Dog?",
    answer:
      "Os dados do canal de atendimento serão disponibilizados nas páginas institucionais da loja.",
  },
] as const;

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  id,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  id: string;
}) {
  return (
    <div className="border-b border-border/60">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${id}`}
      >
        <span className="text-[15px] font-semibold text-foreground">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-muted"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
            role="region"
          >
            <p className="pb-6 text-[14px] leading-relaxed text-muted">
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
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mx-auto flex max-w-2xl flex-col items-center gap-12"
        >
          <motion.div variants={fadeInUp} className="text-center">
            <h2 className="text-[1.75rem] font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Dúvidas frequentes.
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="w-full">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={item.question}
                id={String(i)}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === i}
                onToggle={() => handleToggle(i)}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
