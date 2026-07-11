import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductLightbox } from "./product-lightbox";
import heroVideo from "@/assets/videos/Barraca Pop Up Joyfox 5-6 Pessoas Varanda 280240150cm Família Im.mp4";
import posterImage from "@/assets/images/D_NQ_NP_2X_981066-MLA113602445263_062026-F.webp";
import img981066 from "@/assets/images/D_NQ_NP_2X_981066-MLA113602445263_062026-F.webp";
import img922496 from "@/assets/images/D_NQ_NP_2X_922496-MLA113975741391_062026-F.webp";
import img753543 from "@/assets/images/D_NQ_NP_2X_753543-MLA113602445287_062026-F.webp";
import img980271 from "@/assets/images/D_NQ_NP_2X_980271-MLA112438593888_062026-F.webp";
import img736749 from "@/assets/images/D_NQ_NP_2X_736749-MLA113602768169_062026-F.webp";
import img884669 from "@/assets/images/D_NQ_NP_2X_884669-MLA112438799594_062026-F.webp";
import img613303 from "@/assets/images/D_NQ_NP_2X_613303-MLA113602768109_062026-F.webp";

interface MediaItem {
  src: string;
  alt: string;
  type: "image" | "video";
  fit?: "cover" | "contain";
}

const MEDIA_ITEMS: MediaItem[] = [
  { src: img981066, alt: "Barraca Automática Joyfox — montagem rápida", type: "image", fit: "cover" },
  { src: img922496, alt: "Barraca Automática Joyfox — produto isolado", type: "image", fit: "cover" },
  { src: heroVideo, alt: "Vídeo demonstrativo da Barraca Automática Joyfox", type: "video" },
  { src: img753543, alt: "Barraca Automática Joyfox — contexto de uso", type: "image", fit: "cover" },
  { src: img980271, alt: "Barraca Automática Joyfox — detalhes internos", type: "image", fit: "cover" },
  { src: img736749, alt: "Barraca Automática Joyfox — sistema automático", type: "image", fit: "cover" },
  { src: img884669, alt: "Barraca Automática Joyfox — produto e transporte", type: "image", fit: "cover" },
  { src: img613303, alt: "Barraca Automática Joyfox — comparativo técnico do produto", type: "image", fit: "contain" },
];

const IMAGE_ITEMS = MEDIA_ITEMS.filter((m) => m.type === "image");

export function ProductMediaGallery() {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const thumbTrackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const isDragging = useRef(false);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % MEDIA_ITEMS.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + MEDIA_ITEMS.length) % MEDIA_ITEMS.length);
  }, []);

  const openLightbox = useCallback(() => {
    setLightboxIndex(current);
    setLightboxOpen(true);
  }, [current]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const threshold = 50;
    if (touchDeltaX.current < -threshold) {
      goNext();
    } else if (touchDeltaX.current > threshold) {
      goPrev();
    }
  }, [goNext, goPrev]);

  useEffect(() => {
    if (lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, lightboxOpen]);

  useEffect(() => {
    const track = thumbTrackRef.current;
    if (!track) return;
    const activeThumb = track.children[current] as HTMLElement | undefined;
    if (!activeThumb) return;
    const trackRect = track.getBoundingClientRect();
    const thumbRect = activeThumb.getBoundingClientRect();
    const scrollLeft =
      thumbRect.left - trackRect.left - trackRect.width / 2 + thumbRect.width / 2;
    track.scrollBy({ left: scrollLeft, behavior: "smooth" });
  }, [current]);

  const currentItem = MEDIA_ITEMS[current];
  const currentFit = "fit" in currentItem ? currentItem.fit : "cover";

  return (
    <div className="flex flex-col gap-5">
      <div
        className="relative w-full cursor-pointer overflow-hidden rounded-xl bg-sand"
        style={{ aspectRatio: "1/1" }}
        onClick={openLightbox}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="group"
        aria-label="Galeria de imagens do produto"
      >
        <AnimatePresence mode="wait">
          {currentItem.type === "video" ? (
            <motion.div
              key="video"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onClick={(e) => { e.stopPropagation(); openLightbox(); }}
            >
              <video
                className="h-full w-full object-cover"
                muted
                loop
                playsInline
                preload="metadata"
                poster={posterImage}
                aria-label={currentItem.alt}
              >
                <source src={heroVideo} type="video/mp4" />
                <img
                  src={posterImage}
                  alt={currentItem.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </video>
            </motion.div>
          ) : (
            <motion.img
              key={`img-${current}`}
              src={currentItem.src}
              alt={currentItem.alt}
              className={`absolute inset-0 h-full w-full ${
                currentFit === "contain" ? "object-contain p-6" : "object-cover"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              loading={current === 0 ? "eager" : "lazy"}
              draggable={false}
            />
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          aria-label="Imagem anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          aria-label="Próxima imagem"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2" aria-live="polite">
          <span className="rounded-full bg-foreground/60 px-3.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {current + 1} / {MEDIA_ITEMS.length}
          </span>
        </div>
      </div>

      <div
        ref={thumbTrackRef}
        className="flex justify-center gap-3 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none", scrollBehavior: "smooth" }}
      >
        {MEDIA_ITEMS.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className={`relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-xl transition-all duration-300 sm:h-16 sm:w-16 ${
              i === current
                ? "opacity-100 ring-2 ring-foreground/80"
                : "opacity-35 hover:opacity-70"
            }`}
            aria-label={item.type === "video" ? `Ver vídeo ${i + 1}` : `Ver imagem ${i + 1}`}
            aria-current={i === current ? "true" : undefined}
          >
            <img
              src={item.type === "video" ? posterImage : item.src}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              draggable={false}
            />
          </button>
        ))}
      </div>

      <ProductLightbox
        isOpen={lightboxOpen}
        items={IMAGE_ITEMS}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
