import { useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { PRODUCT } from "@/constants";
import { Button } from "@/components/ui/button";
import { VideoMedia } from "@/components/media/video-media";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import heroVideo from "@/assets/videos/Barraca Pop Up Joyfox 5-6 Pessoas Varanda 280240150cm Família Im.mp4";
import posterImage from "@/assets/images/D_NQ_NP_2X_981066-MLA113602445263_062026-F.webp";

export function OpeningDemoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const handleCTAClick = useCallback(() => {
    const section = document.getElementById(PRODUCT.purchaseSectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <section className="bg-forest-dark">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col items-center gap-10 lg:gap-14"
        >
          <motion.div variants={fadeInUp} className="max-w-xl text-center">
            <h2 className="text-[1.75rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-3xl lg:text-4xl">
              Veja como funciona o sistema de abertura.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/50">
              O vídeo mostra a preparação da barraca e sua abertura prática.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="w-full max-w-3xl">
            <VideoMedia
              src={heroVideo}
              poster={posterImage}
              alt="Demonstração da montagem automática da Barraca Joyfox"
              aspectRatio="16/9"
              autoPlay
              loop
            />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Button
              variant="cta"
              size="full-sm"
              onClick={handleCTAClick}
            >
              VER PREÇO E COMPRAR
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
