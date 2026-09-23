import { useEffect, useRef } from "react";
import { frames } from "@/config/frames";

export default function Catalog() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let gsapi: typeof import("gsap").gsap | null = null;
    let stMod: typeof import("gsap/ScrollTrigger") | null = null;
    let killed = false;
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const g = await import("gsap");
      const trigger = await import("gsap/ScrollTrigger");
      if (killed) return;
      gsapi = g.gsap;
      stMod = trigger;
      gsapi.registerPlugin(trigger.ScrollTrigger);
      const cards = sectionRef.current?.querySelectorAll(".pp-catalog-card");
      if (!cards) return;
      const g2 = gsapi;
      ctx = g2.context(() => {
        g2.fromTo(
          cards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
            },
          }
        );
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
      id="catalog"
      ref={sectionRef}
      style={{ background: "#050509", padding: "8rem 2rem" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p className="label-small" style={{ color: "#F2D28B", marginBottom: 14 }}>
          The Collection
        </p>
        <h2
          className="display-heading"
          style={{ fontSize: "clamp(38px,5vw,64px)", marginBottom: 18 }}
        >
          Five references.
          <br />
          One house.
        </h2>
        <div
          style={{
            width: 64,
            height: 1,
            background: "rgba(242,210,139,0.5)",
            marginBottom: "4rem",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {frames
            .filter((f) => f.price)
            .map((f) => (
              <a
                key={f.id}
                href="#hero"
                className="pp-catalog-card"
                data-cursor-hover
                style={{
                  display: "block",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 4,
                  padding: "2rem",
                  textDecoration: "none",
                  color: "inherit",
                  transition:
                    "border 0.3s ease, transform 0.3s ease, border-color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(242,210,139,0.2)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <p className="label-small" style={{ color: "#F2D28B" }}>
                  {f.chapter}
                </p>
                <h3
                  className="display-heading"
                  style={{ fontSize: "2rem", margin: "12px 0 16px" }}
                >
                  {f.title}
                </h3>
                <div
                  style={{
                    width: 40,
                    height: 1,
                    background: "rgba(242,210,139,0.35)",
                    marginBottom: 16,
                  }}
                />
                <ul style={{ listStyle: "none", marginBottom: 20 }}>
                  {f.notes?.slice(0, 3).map((n) => (
                    <li
                      key={n}
                      style={{
                        fontSize: 12,
                        fontWeight: 300,
                        color: "rgba(246,243,240,0.55)",
                        marginBottom: 5,
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "#F2D28B", fontSize: 7 }}>◆</span>
                      {n}
                    </li>
                  ))}
                </ul>
                <div
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: "1.6rem",
                    color: "#F6F3F0",
                    marginBottom: 16,
                  }}
                >
                  {f.price}
                </div>
                <span
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#F2D28B",
                    textDecoration: "none",
                  }}
                >
                  Discover →
                </span>
              </a>
            ))}
        </div>
      </div>
    </section>
  );
}
