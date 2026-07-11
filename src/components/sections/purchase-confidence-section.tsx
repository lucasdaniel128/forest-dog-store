import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { CONTACT, PRODUCT } from "@/constants";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const STEPS = [
  {
    number: "1",
    title: "Pagamento via Pix",
    text: "Pagamento confirmado diretamente no processo de compra.",
  },
  {
    number: "2",
    title: "Atendimento pelo WhatsApp",
    text: "Canal disponível para dúvidas e acompanhamento do pedido.",
  },
  {
    number: "3",
    title: "Pedido com acompanhamento",
    text: "As informações do pedido ficam organizadas durante o atendimento.",
  },
] as const;

export function PurchaseConfidenceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const whatsappConfigured = CONTACT.whatsapp.length > 0;

  return (
    <Section
      className="bg-surface py-24 sm:py-32 lg:py-40"
      id={PRODUCT.purchaseSectionId}
    >
      <motion.div
        ref={sectionRef}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex flex-col items-center gap-12 lg:gap-16"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <motion.h2
            variants={fadeInUp}
            className="text-[1.75rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            Como comprar na Forest Dog
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="max-w-lg text-[15px] leading-relaxed text-muted-custom sm:text-base"
          >
            Um processo simples, pensado para você.
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer}
          className="relative flex w-full max-w-2xl flex-col"
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              variants={fadeInUp}
              className="relative flex gap-6"
            >
              <div className="flex flex-col items-center">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-bold text-white">
                  {step.number}
                </span>
                {i < STEPS.length - 1 && (
                  <div className="w-px flex-1 bg-border" />
                )}
              </div>

              <div className="flex flex-col gap-1 pb-12">
                <h3 className="text-sm font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="max-w-sm text-[13px] leading-relaxed text-muted-custom">
                  {step.text}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeInUp} className="flex flex-col items-center gap-3">
          {whatsappConfigured ? (
            <ButtonLink
              variant="secondary"
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
              Falar no WhatsApp
            </ButtonLink>
          ) : (
            <Button variant="secondary-disabled" disabled title="Número de WhatsApp ainda não configurado">
              <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
              Falar no WhatsApp
            </Button>
          )}
        </motion.div>
      </motion.div>
    </Section>
  );
}
