import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Section } from "@/components/layout/section";
import { fadeInUp } from "@/lib/animations";
import comparisonImage from "@/assets/images/D_NQ_NP_2X_613303-MLA113602768109_062026-F.webp";

export function ComparisonImageSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <Section className="bg-background py-24 sm:py-32 lg:py-40">
      <motion.div
        ref={sectionRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex flex-col items-center gap-10 lg:gap-14"
      >
        <motion.div
          variants={fadeInUp}
          className="flex flex-col items-center gap-4 text-center"
        >
          <h2 className="text-[1.75rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Comparação detalhada.
          </h2>
          <p className="max-w-lg text-[15px] leading-relaxed text-muted-custom sm:text-base">
            Veja as especificações lado a lado.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="w-full"
        >
          <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-black/5 ring-1 ring-black/5">
            <img
              src={comparisonImage}
              alt="Comparação detalhada entre barraca tradicional e Joyfox"
              className="h-full w-full object-cover"
              style={{ aspectRatio: "16/10" }}
              loading="lazy"
            />
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
}
