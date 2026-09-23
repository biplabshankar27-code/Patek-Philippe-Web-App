import Link from "next/link";
import { IFSeal } from "@/components/Header";

const COLUMNS: { title: string; links: string[] }[] = [
  {
    title: "Experience",
    links: [
      "Calatrava 5226G",
      "Nautilus 5712/1A",
      "Grand Complication 5204G",
      "Aquanaut 5168G",
      "Golden Ellipse 3738/100G",
    ],
  },
  {
    title: "Navigate",
    links: ["Collection", "Story", "Contact"],
  },
  {
    title: "House",
    links: ["Philosophy", "Craft", "Sourcing"],
  },
];

export default function Footer() {
  return (
    <footer
      style={{ background: "#050509", padding: "5rem 2rem 3rem" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "4rem",
          }}
        >
          <IFSeal size={48} />
          <h4
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: "1.4rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#F6F3F0",
              margin: "24px 0 6px",
              marginTop: 40,
            }}
          >
            Patek Philippe
          </h4>
          <p
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#9E9EAE",
            }}
          >
            Watchmakers to a select few since 1839
          </p>
        </div>

        <div
          style={{
            height: 1,
            background:
              "linear-gradient(to right, transparent, rgba(242,210,139,0.35), transparent)",
            marginBottom: "3.5rem",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 32,
            marginBottom: "3.5rem",
          }}
        >
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p
                className="label-small"
                style={{ color: "#F2D28B", marginBottom: 18 }}
              >
                {col.title}
              </p>
              <ul style={{ listStyle: "none" }}>
                {col.links.map((l) => (
                  <li key={l} style={{ marginBottom: 10 }}>
                    <Link
                      href="#"
                      style={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: 12,
                        fontWeight: 300,
                        color: "rgba(246,243,240,0.55)",
                        textDecoration: "none",
                        transition: "color 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#F6F3F0")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color =
                          "rgba(246,243,240,0.55)")
                      }
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(242,210,139,0.1)",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: "0.65rem",
              color: "#9E9EAE",
            }}
          >
            © 2026 Patek Philippe. All rights reserved.
          </span>
          <span
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: "0.65rem",
              color: "#9E9EAE",
            }}
          >
            Crafted with intention.
          </span>
        </div>
      </div>
    </footer>
  );
}
