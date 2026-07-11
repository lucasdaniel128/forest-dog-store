import { useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { PRODUCT, CONTACT } from "@/constants";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function ClosingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const handleCTAClick = useCallback(() => {
    const section = document.getElementById(PRODUCT.purchaseSectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const whatsappConfigured = CONTACT.whatsapp.length > 0;

  return (
    <Section className="bg-background py-24 sm:py-32 lg:py-40">
      <motion.div
        ref={sectionRef}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex flex-col items-center gap-10 text-center lg:gap-14"
      >
        <motion.div
          variants={fadeInUp}
          className="flex flex-col items-center gap-4"
        >
          <h2 className="text-[1.75rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Pronto para sua próxima aventura?
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed text-muted-custom sm:text-base">
            Leve a Barraca Automática Joyfox para seus momentos ao ar livre.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="flex w-full max-w-lg flex-col items-center gap-6 rounded-3xl border border-border bg-surface p-8 shadow-sm sm:p-10"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-foreground">
              {PRODUCT.name}
            </span>
            <span className="text-xs text-muted-custom">
              Modelo anunciado para {PRODUCT.capacity}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-semibold text-muted-custom">
                R$
              </span>
              <span className="text-[2.75rem] font-extrabold leading-none tracking-tight text-foreground">
                164,99
              </span>
            </div>
            <span className="text-sm text-muted-custom">
              {PRODUCT.installments}
            </span>
          </div>

          <div className="flex w-full flex-col gap-3">
            <Button
              variant="cta"
              size="full"
              onClick={handleCTAClick}
            >
              {PRODUCT.ctaText}
            </Button>

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
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
}
