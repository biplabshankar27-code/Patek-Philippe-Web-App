import { AnimatePresence, motion } from "motion/react";
import LiquidGlassCard from "@/components/ui/liquid-weather-glass";
import type { Frame } from "@/config/frames";

export default function BuyCard({
  frame,
  visible,
}: {
  frame: Frame;
  visible: boolean;
}) {
  if (!frame.price) return null;

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={frame.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 12 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <LiquidGlassCard
            borderRadius="20px"
            blurIntensity="lg"
            shadowIntensity="xs"
            glowIntensity="xs"
            draggable={false}
            className="bg-black/25 border border-white/10"
            style={{ maxWidth: 280 }}
          >
            <div style={{ padding: 28 }}>
              <p
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: 9,
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: "#F2D28B",
                  marginBottom: 12,
                }}
              >
                TIMEPIECE
              </p>
              <h3
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: 26,
                  fontWeight: 400,
                  color: "#F6F3F0",
                  letterSpacing: "0.04em",
                  marginBottom: 18,
                }}
              >
                {frame.title}
              </h3>

              <ul style={{ listStyle: "none", marginBottom: 18 }}>
                {frame.notes?.map((n) => (
                  <li
                    key={n}
                    style={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: 12,
                      fontWeight: 300,
                      color: "rgba(246,243,240,0.6)",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ color: "#F2D28B", fontSize: 8 }}>◆</span>
                    {n}
                  </li>
                ))}
              </ul>

              <div
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: 28,
                  color: "#F6F3F0",
                  letterSpacing: "0.04em",
                  marginBottom: 20,
                }}
              >
                {frame.price}
              </div>

              {frame.ctaPrimary && (
                <a
                  href="#catalog"
                  data-cursor-hover
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    padding: "12px 18px",
                    borderRadius: 999,
                    border: "1px solid #F2D28B",
                    color: "#F2D28B",
                    fontFamily: '"Inter", sans-serif',
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    transition: "background 0.3s ease",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(242,210,139,0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {frame.ctaPrimary}
                </a>
              )}

              {frame.ctaSecondary && (
                <a
                  href="#story"
                  data-cursor-hover
                  style={{
                    display: "block",
                    marginTop: 14,
                    textAlign: "center",
                    fontFamily: '"Inter", sans-serif',
                    fontSize: 11,
                    fontWeight: 300,
                    letterSpacing: "0.08em",
                    color: "rgba(246,243,240,0.5)",
                    textDecoration: "underline",
                    textUnderlineOffset: 4,
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#F6F3F0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color =
                      "rgba(246,243,240,0.5)")
                  }
                >
                  {frame.ctaSecondary}
                </a>
              )}
            </div>
          </LiquidGlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
