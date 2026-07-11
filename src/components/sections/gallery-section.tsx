import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { fadeInUp } from "@/lib/animations";
import img922496 from "@/assets/images/D_NQ_NP_2X_922496-MLA113975741391_062026-F.webp";
import img981066 from "@/assets/images/D_NQ_NP_2X_981066-MLA113602445263_062026-F.webp";
import img753543 from "@/assets/images/D_NQ_NP_2X_753543-MLA113602445287_062026-F.webp";
import img736749 from "@/assets/images/D_NQ_NP_2X_736749-MLA113602768169_062026-F.webp";
import img980271 from "@/assets/images/D_NQ_NP_2X_980271-MLA112438593888_062026-F.webp";
import img884669 from "@/assets/images/D_NQ_NP_2X_884669-MLA112438799594_062026-F.webp";
import img613303 from "@/assets/images/D_NQ_NP_2X_613303-MLA113602768109_062026-F.webp";

const IMAGES = [
  { src: img922496, alt: "Barraca Automática Joyfox — vista completa" },
  { src: img981066, alt: "Barraca Automática Joyfox — uso externo" },
  { src: img753543, alt: "Barraca Automática Joyfox — detalhe lateral" },
  { src: img736749, alt: "Barraca Automática Joyfox — montagem" },
  { src: img980271, alt: "Barraca Automática Joyfox — espaço interno" },
  { src: img884669, alt: "Barraca Automática Joyfox — transporte" },
  { src: img613303, alt: "Barraca Automática Joyfox — comparação" },
] as const;

export function GallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [current, setCurrent] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setIsZoomed(false);
  }, []);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % IMAGES.length);
    setIsZoomed(false);
  }, []);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
    setIsZoomed(false);
  }, []);

  const toggleZoom = useCallback(() => {
    setIsZoomed((prev) => !prev);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const threshold = 50;
    if (touchDeltaX.current < -threshold) {
      goNext();
    } else if (touchDeltaX.current > threshold) {
      goPrev();
    }
  }, [goNext, goPrev]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") setIsZoomed(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  return (
    <Section className="bg-background pb-24 sm:pb-32 lg:pb-40">
      <motion.div
        ref={sectionRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex flex-col gap-6 lg:gap-8"
      >
        <motion.div variants={fadeInUp} className="flex flex-col items-center gap-3 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cta">
            Galeria
          </p>
          <h2 className="text-[1.75rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Joyfox em detalhes.
          </h2>
        </motion.div>

        <motion.div variants={fadeInUp} className="relative">
          <div
            className="relative w-full cursor-zoom-in overflow-hidden rounded-3xl bg-background ring-1 ring-black/5"
            style={{ aspectRatio: "16/10" }}
            onClick={toggleZoom}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            role="group"
            aria-label="Galeria de imagens do produto"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={IMAGES[current].src}
                alt={IMAGES[current].alt}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                loading={current === 0 ? "eager" : "lazy"}
                draggable={false}
              />
            </AnimatePresence>

            {isZoomed && (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/80"
                onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
              >
                <motion.img
                  src={IMAGES[current].src}
                  alt={IMAGES[current].alt}
                  className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  draggable={false}
                />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg transition-all hover:bg-white"
                  aria-label="Fechar zoom"
                >
                  <ZoomOut className="h-5 w-5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-white"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-white"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
              <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {current + 1} / {IMAGES.length}
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggleZoom(); }}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white shadow-sm backdrop-blur-sm transition-all hover:bg-black/60"
              aria-label={isZoomed ? "Fechar zoom" : "Ampliar imagem"}
            >
              {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {IMAGES.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => goTo(i)}
                className={`relative shrink-0 overflow-hidden rounded-xl ring-2 transition-all duration-200 ${
                  i === current
                    ? "ring-cta shadow-md shadow-cta/20"
                    : "ring-transparent opacity-60 hover:opacity-100"
                }`}
                style={{ width: 72, height: 54 }}
                aria-label={`Ver imagem ${i + 1}`}
                aria-current={i === current ? "true" : undefined}
              >
                <img
                  src={img.src}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
}
