import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let raf = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
    };

    const attachListeners = () => {
      const els = document.querySelectorAll<HTMLElement>(
        "a, button, [data-cursor-hover]"
      );
      els.forEach((el) => {
        if (el.dataset.cursorAttached) return;
        el.dataset.cursorAttached = "true";
        el.addEventListener("mouseenter", () =>
          document.body.classList.add("cursor-hovering")
        );
        el.addEventListener("mouseleave", () =>
          document.body.classList.remove("cursor-hovering")
        );
      });
    };

    const observer = new MutationObserver(() => attachListeners());
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("mousemove", onMouseMove);
    attachListeners();
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} />
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }} />
    </>
  );
}
