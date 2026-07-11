import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import { Section } from "@/components/layout/section";
import { fadeInUp } from "@/lib/animations";

export function SocialProofSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <Section className="bg-surface py-24 sm:py-32 lg:py-40">
      <motion.div
        ref={sectionRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex flex-col items-center gap-10 text-center lg:gap-14"
      >
        <motion.div
          variants={fadeInUp}
          className="flex flex-col items-center gap-4"
        >
          <h2 className="text-[1.75rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            O que dizem nossos clientes.
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed text-muted-custom sm:text-base">
            Avaliações de compradores reais aparecerão aqui.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="flex w-full max-w-2xl flex-col items-center gap-6"
        >
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className="h-6 w-6 text-border"
                aria-hidden="true"
              />
            ))}
          </div>

          <div className="flex w-full flex-col gap-4 sm:flex-row sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-1 flex-col gap-3 rounded-2xl border border-border bg-background p-5"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="h-3.5 w-3.5 text-border"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div className="h-3 w-3/4 rounded-full bg-border/60" />
                <div className="h-3 w-full rounded-full bg-border/40" />
                <div className="h-3 w-2/3 rounded-full bg-border/40" />
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-border/60" />
                  <div className="flex flex-col gap-1">
                    <div className="h-2.5 w-20 rounded-full bg-border/50" />
                    <div className="h-2 w-14 rounded-full bg-border/30" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
}
