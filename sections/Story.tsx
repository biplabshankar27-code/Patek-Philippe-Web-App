import { useEffect, useRef } from "react";
import LiquidGlassCard from "@/components/ui/liquid-weather-glass";

const PANELS = [
  {
    label: "The Philosophy",
    title: "You never actually own\na Patek Philippe.",
    body: "You merely look after it for the next generation. Since 1839 the house has remained family-owned, deliberately limited to around sixty thousand watches a year — fewer than almost every other luxury producer on earth.",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&auto=format&fit=crop&q=80",
    accent: "#F2D28B",
    imageRight: true,
    caption: "Atelier — Rue du Rhône, Genève",
  },
  {
    label: "The Craft",
    title: "Hand-finished by\none master watchmaker",
    body: "Every movement is assembled and regulated by a single watchmaker from start to finish. The ref. 5204G alone contains 556 individual components. The result is an object that behaves economically as well as mechanically — scarcity, held to a standard.",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&auto=format&fit=crop&q=80",
    accent: "#d4a0a8",
    imageRight: false,
    caption: "Geneva Seal — certifying every calibre",
  },
];

export default function Story() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let killed = false;
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const g = await import("gsap");
      await import("gsap/ScrollTrigger");
      if (killed) return;
      const gsapi = g.gsap;
      const panels = sectionRef.current?.querySelectorAll(".pp-story-panel");
      if (!panels) return;
      ctx = gsapi.context(() => {
        panels.forEach((panel, i) => {
          const img = panel.querySelector(".pp-story-image");
          const txt = panel.querySelector(".pp-story-text");
          const from = i % 2 === 0 ? { x: -32 } : { x: 32 };
          if (img) {
            gsapi.fromTo(
              img,
              { opacity: 0, ...from, scale: 1.04 },
              {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 1.1,
                ease: "power3.out",
                scrollTrigger: { trigger: img, start: "top 80%" },
              }
            );
          }
          if (txt) {
            gsapi.fromTo(
              txt,
              { opacity: 0, ...(i % 2 === 0 ? { x: 24 } : { x: -24 }) },
              {
                opacity: 1,
                x: 0,
                duration: 1.1,
                ease: "power3.out",
                scrollTrigger: { trigger: txt, start: "top 80%" },
              }
            );
          }
        });
      });
    };
    init();
    return () => {
      killed = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="story"
      ref={sectionRef}
      style={{ background: "#050509", padding: "8rem 2rem" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {PANELS.map((p, i) => (
          <div
            key={p.label}
            className="pp-story-panel"
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr" /* swapped via order below */,
              gap: "4rem",
              alignItems: "center",
              marginBottom: "7rem",
            }}
          >
            <div
              className="pp-story-text"
              style={{ order: p.imageRight ? 1 : 2 }}
            >
              <LiquidGlassCard
                borderRadius="6px"
                blurIntensity="sm"
                shadowIntensity="xs"
                glowIntensity="none"
                draggable={false}
                className="bg-black/20"
              >
                <div style={{ padding: "2.5rem" }}>
                  <p
                    className="label-small"
                    style={{ color: p.accent, marginBottom: 14 }}
                  >
                    {p.label}
                  </p>
                  <h3
                    className="display-heading"
                    style={{
                      fontSize: "clamp(28px,3.5vw,44px)",
                      whiteSpace: "pre-line",
                      marginBottom: 22,
                    }}
                  >
                    {p.title}
                  </h3>
                  <div
                    style={{
                      width: 32,
                      height: 1,
                      background: p.accent,
                      opacity: 0.6,
                      marginBottom: 22,
                    }}
                  />
                  <p className="body-copy">{p.body}</p>
                </div>
              </LiquidGlassCard>
            </div>
            <div
              className="pp-story-image"
              style={{ order: p.imageRight ? 2 : 1, position: "relative" }}
            >
              <img
                src={p.image}
                alt={p.label}
                style={{
                  width: "100%",
                  height: 420,
                  objectFit: "cover",
                  borderRadius: 4,
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(5,5,9,0.25)",
                  borderRadius: 4,
                  pointerEvents: "none",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: 14,
                  left: 16,
                  fontFamily: '"Inter", sans-serif',
                  fontSize: 9,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "rgba(246,243,240,0.6)",
                }}
              >
                {p.caption}
              </span>
            </div>
          </div>
        ))}

        <div
          style={{
            borderTop: "1px solid rgba(242,210,139,0.1)",
            borderBottom: "1px solid rgba(242,210,139,0.1)",
            padding: "3.5rem 0",
            textAlign: "center",
          }}
        >
          <p
            className="display-heading"
            style={{
              fontSize: "clamp(22px,2.6vw,34px)",
              fontStyle: "italic",
              maxWidth: 760,
              margin: "0 auto 1.5rem",
              color: "rgba(246,243,240,0.92)",
            }}
          >
            “Scent is memory’s language — time is its measure. We build for the
            century, not the season.”
          </p>
          <p className="label-small">— Patek Philippe, House Notes</p>
        </div>
      </div>
    </section>
  );
}
