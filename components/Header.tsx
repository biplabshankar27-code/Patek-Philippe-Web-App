import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const EXPERIENCES = [
  "Calatrava 5226G",
  "Nautilus 5712/1A",
  "Grand Complication 5204G",
  "Aquanaut 5168G",
  "Golden Ellipse 3738/100G",
];

const NAV_LINKS = [
  { label: "Collection", href: "#catalog" },
  { label: "Story", href: "#story" },
];

function IFSeal({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
      }}
    >
      <svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        style={{ display: "block" }}
      >
        <circle
          cx="20"
          cy="20"
          r="18.5"
          stroke="#F2D28B"
          strokeWidth="0.7"
          strokeOpacity="0.65"
          fill="none"
        />
        <polygon
          points="20,2 21.4,4.2 20,6.4 18.6,4.2"
          fill="#F2D28B"
          fillOpacity="0.65"
        />
        <polygon
          points="20,33.6 21.4,35.8 20,38 18.6,35.8"
          fill="#F2D28B"
          fillOpacity="0.65"
        />
        <line
          x1="1.5"
          y1="20"
          x2="4"
          y2="20"
          stroke="#F2D28B"
          strokeWidth="0.7"
          strokeOpacity="0.4"
        />
        <line
          x1="36"
          y1="20"
          x2="38.5"
          y2="20"
          stroke="#F2D28B"
          strokeWidth="0.7"
          strokeOpacity="0.4"
        />
        <text
          x="20"
          y="24"
          textAnchor="middle"
          fill="#F2D28B"
          fontFamily='"Cormorant Garamond", serif'
          fontSize="15"
          fontWeight="400"
        >
          PP
        </text>
      </svg>
      <span
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: -8,
          whiteSpace: "nowrap",
          fontFamily: '"Inter", sans-serif',
          fontSize: 6.5,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "rgba(242,210,139,0.55)",
        }}
      >
        Genève
      </span>
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 18,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <nav
        id="pp-nav"
        data-pp-header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "8px 20px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          background: scrolled ? "rgba(5,5,9,0.8)" : "rgba(5,5,9,0.45)",
          transition: "background 0.5s ease",
          pointerEvents: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <IFSeal />
          <div
            style={{
              width: 1,
              height: 22,
              background: "rgba(242,210,139,0.25)",
            }}
          />
        </div>

        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          style={{ position: "relative" }}
        >
          <a
            href="#hero"
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#F6F3F0",
              textDecoration: "none",
              opacity: 0.85,
            }}
          >
            Experience ▾
          </a>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: "absolute",
                  top: "calc(100% + 14px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  minWidth: 240,
                  padding: 10,
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(5,5,9,0.9)",
                  backdropFilter: "blur(24px)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                }}
              >
                {EXPERIENCES.map((label, i) => (
                  <motion.a
                    key={label}
                    href="#catalog"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    style={
                      {
                        display: "block",
                        padding: "10px 14px",
                        borderRadius: 10,
                        fontFamily: '"Cormorant Garamond", serif',
                        fontSize: 14,
                        color: "rgba(246,243,240,0.75)",
                        textDecoration: "none",
                        transition: "background 0.2s, color 0.2s",
                        ":hover": { background: "rgba(242,210,139,0.07)" },
                      } as React.CSSProperties
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(242,210,139,0.07)";
                      e.currentTarget.style.color = "#F6F3F0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color =
                        "rgba(246,243,240,0.75)";
                    }}
                  >
                    {label}
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {NAV_LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#F6F3F0",
              textDecoration: "none",
              opacity: 0.85,
            }}
          >
            {l.label}
          </a>
        ))}

        <div
          style={{
            width: 1,
            height: 22,
            background: "rgba(242,210,139,0.25)",
          }}
        />

        <a
          href="#catalog"
          className="btn-outline"
          style={{ padding: "7px 18px", fontSize: 10 }}
        >
          Shop Now
        </a>
      </nav>
    </div>
  );
}

export { IFSeal };
