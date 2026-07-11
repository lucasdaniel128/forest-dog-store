import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import storyImage from "@/assets/images/D_NQ_NP_2X_981066-MLA113602445263_062026-F.webp";

export function StorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-sand">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col items-center gap-12 lg:gap-16"
        >
          <motion.div variants={fadeInUp} className="max-w-xl text-center">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-cta">
              A EXPERIÊNCIA
            </p>
            <h2 className="text-[2rem] font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
              Menos tempo preparando.
              <br />
              Mais tempo aproveitando.
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="w-full">
            <img
              src={storyImage}
              alt="Barraca Automática Joyfox em uso ao ar livre"
              className="h-full w-full object-cover rounded-xl"
              style={{ aspectRatio: "16/10" }}
              loading="lazy"
            />
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="max-w-md text-center text-[15px] leading-relaxed text-muted"
          >
            Uma opção prática para camping, viagens e momentos ao ar livre.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
