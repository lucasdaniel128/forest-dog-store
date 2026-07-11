import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Section } from "@/components/layout/section";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import heroVideo from "@/assets/videos/Barraca Pop Up Joyfox 5-6 Pessoas Varanda 280240150cm Família Im.mp4";
import posterImage from "@/assets/images/D_NQ_NP_2X_981066-MLA113602445263_062026-F.webp";

export function MemorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
  }, []);

  return (
    <Section className="bg-background py-24 sm:py-32 lg:py-40">
      <motion.div
        ref={sectionRef}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex flex-col items-center gap-10 lg:gap-14"
      >
        <motion.div
          variants={fadeInUp}
          className="flex flex-col items-center gap-4 text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cta">
            Mais tempo aproveitando
          </p>
          <h2 className="text-[1.75rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Menos tempo montando.
            <br />
            Mais tempo vivendo.
          </h2>
          <p className="max-w-lg text-[15px] leading-relaxed text-muted-custom sm:text-base">
            Uma barraca prática para aproveitar camping, viagens e momentos ao
            ar livre sem complicação.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="w-full">
          <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-black/5 ring-1 ring-black/5">
            <div
              className="relative w-full sm:hidden"
              style={{ aspectRatio: "4/5" }}
            >
              {prefersReducedMotion ? (
                <img
                  src={posterImage}
                  alt="Barraca Joyfox em uso ao ar livre"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                />
              ) : (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={posterImage}
                  aria-label="Vídeo da Barraca Joyfox em uso ao ar livre"
                >
                  <source src={heroVideo} type="video/mp4" />
                  <img
                    src={posterImage}
                    alt="Barraca Joyfox em uso ao ar livre"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </video>
              )}
            </div>
            <div
              className="relative hidden w-full sm:block"
              style={{ aspectRatio: "16/10" }}
            >
              {prefersReducedMotion ? (
                <img
                  src={posterImage}
                  alt="Barraca Joyfox em uso ao ar livre"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                />
              ) : (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={posterImage}
                  aria-label="Vídeo da Barraca Joyfox em uso ao ar livre"
                >
                  <source src={heroVideo} type="video/mp4" />
                  <img
                    src={posterImage}
                    alt="Barraca Joyfox em uso ao ar livre"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </video>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
}
