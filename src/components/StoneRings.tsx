import { useEffect, useRef, useState } from "react";
import artwork from "../../assets/plates/stone-rings.png";
import emberArtwork from "../../assets/plates/ember-coals.png";

// Original artwork coordinates, including the delicate outer pigment marks.
const rings = [
  { x: 810, y: 108, width: 322, height: 308, driftX: 8, driftY: 10.5 },
  { x: 1190, y: 182, width: 248, height: 237, driftX: 7, driftY: 9 },
  { x: 1000, y: 420, width: 217, height: 200, driftX: 7.5, driftY: 10 },
  { x: 1212, y: 464, width: 341, height: 365, driftX: 9, driftY: 11 },
  { x: 843, y: 646, width: 231, height: 224, driftX: 7, driftY: 9 },
];

const backgroundEmbers = [
  { source: 1, left: 2, top: 4, size: 18, blur: 8, opacity: 0.3 },
  { source: 2, left: 36, top: -1, size: 15, blur: 11, opacity: 0.22 },
  { source: 4, left: 67, top: 7, size: 20, blur: 7, opacity: 0.28 },
  { source: 1, left: 12, top: 31, size: 14, blur: 12, opacity: 0.2 },
  { source: 3, left: 43, top: 27, size: 23, blur: 9, opacity: 0.25 },
  { source: 0, left: 76, top: 34, size: 18, blur: 13, opacity: 0.19 },
  { source: 2, left: -2, top: 57, size: 17, blur: 9, opacity: 0.27 },
  { source: 4, left: 30, top: 62, size: 19, blur: 13, opacity: 0.2 },
  { source: 1, left: 59, top: 65, size: 14, blur: 8, opacity: 0.3 },
  { source: 0, left: 79, top: 75, size: 21, blur: 12, opacity: 0.2 },
];

export function StoneRings() {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState([false, false]);

  useEffect(() => {
    let disposed = false;
    const images = [artwork, emberArtwork].map((source, imageIndex) => {
      const image = new Image();
      image.onload = () => {
        if (disposed) return;
        try {
          const canvases = root.current!.querySelectorAll<HTMLCanvasElement>(
            `[data-artwork="${imageIndex}"]`,
          );
          const renderCrop = (
            canvas: HTMLCanvasElement,
            ring: (typeof rings)[number],
          ) => {
          canvas.width = ring.width;
          canvas.height = ring.height;
          const context = canvas.getContext("2d");
          if (!context) throw new Error("Canvas unavailable");
          context.drawImage(
            image,
            ring.x,
            ring.y,
            ring.width,
            ring.height,
            0,
            0,
            ring.width,
            ring.height,
          );
          const pixels = context.getImageData(0, 0, ring.width, ring.height);
          // Remove only the scanned cream paper. Coverage follows the real pigment,
          // retaining the irregular contours rather than masking them into circles.
          const paper = [247, 236, 218];
          for (let p = 0; p < pixels.data.length; p += 4) {
            const shade = Math.min(
              ...paper.map(
                (value, channel) => pixels.data[p + channel] / value,
              ),
            );
            const t = Math.max(0, Math.min(1, (0.91 - shade) / 0.18));
            const alpha = t * t * (3 - 2 * t);
            for (let channel = 0; channel < 3; channel++) {
              pixels.data[p + channel] =
                alpha > 0.001
                  ? Math.max(
                      0,
                      Math.min(
                        255,
                        (pixels.data[p + channel] -
                          (1 - alpha) * paper[channel]) /
                          alpha,
                      ),
                    )
                  : 0;
            }
            pixels.data[p + 3] = Math.round(alpha * 255);
          }
          context.putImageData(pixels, 0, 0);
          };
          rings.forEach((ring, index) => renderCrop(canvases[index], ring));
          if (imageIndex === 1) {
            root.current!
              .querySelectorAll<HTMLCanvasElement>("[data-ember-source]")
              .forEach((canvas) =>
                renderCrop(canvas, rings[Number(canvas.dataset.emberSource)]),
              );
          }
          setReady((current) =>
            current.map((value, index) =>
              index === imageIndex ? true : value,
            ),
          );
        } catch {
          // Cropped originals remain visible if pixel extraction is unavailable.
        }
      };
      image.src = source;
      return image;
    });
    return () => {
      disposed = true;
      images.forEach((image) => (image.onload = null));
    };
  }, []);

  useEffect(() => {
    const element = root.current!;
    const layers = [...element.querySelectorAll<HTMLElement>(".stone-ring")];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      previous = 0,
      elapsed = 0,
      visible = false;
    let pointer: { x: number; y: number } | null = null;
    const offsets = rings.map(() => ({ x: 0, y: 0 }));
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      pointer = null;
    };
    const draw = (now: number) => {
      frame = 0;
      if (reduced.matches || !visible || document.hidden) {
        sync();
        return;
      }
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      previous = now;
      elapsed += dt;
      const bounds = element.getBoundingClientRect();
      layers.forEach((layer, index) => {
        const ring = rings[index];
        const centerX =
          bounds.left + ((ring.x + ring.width / 2 - 720) / 866) * bounds.width;
        const centerY =
          bounds.top + ((ring.y + ring.height / 2 - 35) / 922) * bounds.height;
        const dx = pointer ? centerX - pointer.x : 0;
        const dy = pointer ? centerY - pointer.y : 0;
        const distance = Math.hypot(dx, dy);
        const proximity = pointer
          ? Math.pow(Math.max(0, 1 - distance / 220), 2)
          : 0;
        layer.style.setProperty("--pointer-heat", proximity.toFixed(3));
        const targetX = (dx / Math.max(distance, 1)) * proximity * 10;
        const targetY = (dy / Math.max(distance, 1)) * proximity * 10;
        const ease = 1 - Math.exp(-dt * 2.5);
        offsets[index].x += (targetX - offsets[index].x) * ease;
        offsets[index].y += (targetY - offsets[index].y) * ease;
        const phase = index * 1.9;
        const pace = 1 + index * 0.035;
        const x =
          Math.sin(elapsed * 0.125 * pace + phase) * ring.driftX +
          offsets[index].x;
        const y =
          Math.cos(elapsed * 0.1 * pace + phase) * ring.driftY +
          offsets[index].y;
        layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
      frame = requestAnimationFrame(draw);
    };
    const sync = () => {
      stop();
      if (reduced.matches)
        layers.forEach((layer) => {
          layer.style.transform = "none";
        });
      else if (visible && !document.hidden) frame = requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "touch" && !reduced.matches)
        pointer = { x: event.clientX, y: event.clientY };
    };
    const leave = () => {
      pointer = null;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div ref={root} className="stone-rings" aria-hidden="true">
      <div className="ember-field">
        {backgroundEmbers.map((ember, index) => (
          <canvas
            className="background-ember"
            data-ember-source={ember.source}
            key={index}
            style={{
              left: `${ember.left}%`,
              top: `${ember.top}%`,
              width: `${ember.size}%`,
              filter: `blur(${ember.blur}px)`,
              opacity: ember.opacity,
            }}
          />
        ))}
      </div>
      {rings.map((ring, index) => (
        <div
          key={index}
          className="stone-ring"
          style={{
            left: `${((ring.x - 720) / 866) * 100}%`,
            top: `${((ring.y - 35) / 922) * 100}%`,
            width: `${(ring.width / 866) * 100}%`,
            height: `${(ring.height / 922) * 100}%`,
          }}
        >
          {[artwork, emberArtwork].map((source, artworkIndex) => (
            <div
              className={`stone-art-layer ${artworkIndex ? "ember-art" : "day-art"}`}
              key={source}
            >
              <canvas
                data-artwork={artworkIndex}
                style={{ opacity: ready[artworkIndex] ? 1 : 0 }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
