import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface VideoMediaProps {
  src: string;
  poster: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  loading?: "lazy" | "eager";
  preload?: "none" | "metadata" | "auto";
}

export function VideoMedia({
  src,
  poster,
  alt,
  className,
  aspectRatio = "16/9",
  autoPlay = false,
  loop = true,
  controls = false,
  loading = "lazy",
  preload = "metadata",
}: VideoMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
  }, []);

  const showVideo = autoPlay && !prefersReducedMotion;

  return (
    <div className={cn("relative w-full overflow-hidden", className)} style={{ aspectRatio }}>
      {showVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop={loop}
          playsInline
          preload={preload}
          poster={poster}
          aria-label={alt}
        >
          <source src={src} type="video/mp4" />
          <img
            src={poster}
            alt={alt}
            className="h-full w-full object-cover"
            loading={loading}
          />
        </video>
      ) : (
        <img
          src={poster}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading={loading}
          fetchPriority={loading === "eager" ? "high" : undefined}
        />
      )}

      {controls && showVideo && (
        <button
          type="button"
          onClick={() => {
            if (videoRef.current) {
              if (videoRef.current.paused) {
                videoRef.current.play();
              } else {
                videoRef.current.pause();
              }
            }
          }}
          className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60"
          aria-label="Play/pause"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}
    </div>
  );
}
