import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import FrameText from "@/components/FrameText";
import BuyCard from "@/components/BuyCard";
import {
  frames,
  getFrameForSegment,
  type Frame,
  type Segment,
  SEGMENTS,
  TOTAL_SCROLL_PX,
  TOTAL_VIDEO_DURATION,
  EXPERIENCE_VIDEO,
  NO_PANEL_FRAMES,
} from "@/config/frames";

const LERP_FACTOR = 0.08;
const SEEK_INTERVAL_MS = 1000 / 24;
const RESET_DELAY_MS = 1500;

type Mode = "IDLE" | "SCRUB" | "LOOP";

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const expVidRef = useRef<HTMLVideoElement | null>(null);

  const modeRef = useRef<Mode>("IDLE");
  const isResettingRef = useRef(false);
  const segmentRef = useRef<Segment>(SEGMENTS[0]);
  const lastProgressRef = useRef(0);
  const lastProgressMsRef = useRef(Date.now());
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const keyHandlerRef = useRef<((e: KeyboardEvent) => void) | null>(null);
  const lastSeekMsRef = useRef(0);
  const targetTimeRef = useRef(0);
  const smoothedTimeRef = useRef(0);

  const [mode, setMode] = useState<Mode>("IDLE");
  const [currentFrame, setCurrentFrame] = useState<Frame>(frames[0]);

  useEffect(() => {
    let st: typeof import("gsap/ScrollTrigger").ScrollTrigger | null = null;
    let gsapi: typeof import("gsap").gsap | null = null;
    let stInstance: { kill: () => void } | null = null;
    let cancelled = false;

    const init = async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      const scrollMod = await import("gsap/ScrollToPlugin");
      if (cancelled) return;
      gsapi = gsapMod.gsap;
      st = stMod.ScrollTrigger;
      gsapi.registerPlugin(st, scrollMod.ScrollToPlugin);

      const video = expVidRef.current;
      const triggerEl = heroRef.current;
      const stageEl = stageRef.current;
      if (!video || !triggerEl || !stageEl) return;

      const rafLoop = (ts: number) => {
      // Arrow-key scene navigation — lands inside the target scene's loop window
      const onKey = (e: KeyboardEvent) => {
        if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
        const keyTarget: HTMLElement | null = e.target as HTMLElement;
        if (keyTarget && ["INPUT", "TEXTAREA", "SELECT"].includes(keyTarget.tagName)) return;
        e.preventDefault();
        const tNow = lastProgressRef.current * TOTAL_VIDEO_DURATION;
        const idx = SEGMENTS.findIndex(
          (s) => tNow >= s.transitionStart && tNow < s.scrollResume + 0.0001
        );
        let targetIdx =
          e.key === "ArrowDown" ? idx + 1 : idx - 1;
        targetIdx = Math.max(0, Math.min(targetIdx, SEGMENTS.length - 1));
        const seg = SEGMENTS[targetIdx];
        const landT = seg.loopable
          ? Math.min(seg.loopStart + 0.35, seg.loopEnd - 0.1)
          : Math.min(seg.transitionEnd + 0.3, seg.scrollResume - 0.05);
        const y = Math.min(
          (landT / TOTAL_VIDEO_DURATION) * TOTAL_SCROLL_PX,
          TOTAL_SCROLL_PX - 2
        );
        const lenis = (
          window as unknown as {
            __lenis?: { scrollTo: (t: number, o?: object) => void };
          }
        ).__lenis;
        if (lenis) {
          lenis.scrollTo(y, { duration: 1.6 });
        } else {
          gsapi?.to(window, { scrollTo: y, duration: 1.6, ease: "power2.inOut" });
        }
      };
      window.addEventListener("keydown", onKey);
      keyHandlerRef.current = onKey;

      rafRef.current = requestAnimationFrame(rafLoop);
        const vid = expVidRef.current;
        if (!vid) return;

        // 0. IDLE ambient — gently loop the golden-hall opening (0.2s–2.8s)
        if (modeRef.current === "IDLE") {
          if (vid.paused && vid.readyState >= 2) {
            vid.play().catch(() => {});
          }
          if (
            vid.readyState >= 2 &&
            (vid.currentTime >= 2.8 || vid.currentTime < 0.15)
          ) {
            vid.currentTime = 0.2;
          }
        }

        // 1. lerp toward target (scrubbing only)
        if (modeRef.current === "SCRUB") {
          const delta = targetTimeRef.current - smoothedTimeRef.current;
          if (Math.abs(delta) > 0.0005) {
            smoothedTimeRef.current += delta * LERP_FACTOR;
          }
        }

        // 2. throttled seek at max 24fps (scrubbing only — playing modes seek nothing)
        if (
          modeRef.current === "SCRUB" &&
          ts - lastSeekMsRef.current >= SEEK_INTERVAL_MS &&
          vid.readyState >= 2 &&
          Math.abs(smoothedTimeRef.current - vid.currentTime) > 0.04
        ) {
          vid.currentTime = smoothedTimeRef.current;
          lastSeekMsRef.current = ts;
        }

        // 3. SCRUB -> LOOP after 550ms of no real scroll progress
        if (
          modeRef.current === "SCRUB" &&
          Date.now() - lastProgressMsRef.current > 550
        ) {
          const seg = segmentRef.current;
          if (
            seg.loopable &&
            vid.currentTime >= seg.loopStart &&
            vid.currentTime < seg.loopEnd
          ) {
            modeRef.current = "LOOP";
            setMode("LOOP");
            vid.play().catch(() => {});
          }
        }

        // 4. LOOP maintenance — hold within the loop window
        if (modeRef.current === "LOOP") {
          const seg = segmentRef.current;
          if (vid.paused) {
            vid.play().catch(() => {});
          }
          if (vid.currentTime >= seg.loopEnd || vid.currentTime < seg.loopStart) {
            vid.currentTime = seg.loopStart;
          }
        }
      };

      stInstance = st.create({
        trigger: triggerEl,
        start: "top top",
        end: `+=${TOTAL_SCROLL_PX}`,
        pin: stageEl,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: (self: { progress: number }) => {
          const p = self.progress;
          const vid = expVidRef.current;
          if (!vid) return;

          // IDLE boundary
          if (p < 0.004) {
            if (modeRef.current !== "IDLE") {
              modeRef.current = "IDLE";
              setMode("IDLE");
              vid.play().catch(() => {});
              targetTimeRef.current = 0.2;
              smoothedTimeRef.current = 0.2;
              vid.currentTime = 0.2;
              segmentRef.current = SEGMENTS[0];
              setCurrentFrame(frames[0]);
              lastProgressRef.current = p;
              lastProgressMsRef.current = Date.now();
            }
            return;
          }

          // Track REAL scroll stops, not Lenis inertia ticks
          const isRealScroll =
            Math.abs(p - lastProgressRef.current) > 0.0008;
          if (isRealScroll) {
            lastProgressRef.current = p;
            lastProgressMsRef.current = Date.now();
          }

          // IDLE -> SCRUB always; LOOP -> SCRUB only on real scroll
          if (modeRef.current === "IDLE") {
            modeRef.current = "SCRUB";
            setMode("SCRUB");
            vid.pause();
          } else if (modeRef.current === "LOOP" && isRealScroll) {
            modeRef.current = "SCRUB";
            setMode("SCRUB");
            vid.pause();
            const seg = segmentRef.current;
            if (vid.currentTime < seg.scrollResume - 0.05) {
              vid.currentTime = seg.scrollResume;
              smoothedTimeRef.current = seg.scrollResume;
              targetTimeRef.current = Math.max(
                p * TOTAL_VIDEO_DURATION,
                seg.scrollResume
              );
            }
          }

          // Map progress -> video time, clamped to the current segment window
          const next = p * TOTAL_VIDEO_DURATION;
          // Auto-reset at end of banner
          if (p > 0.98) {
            if (!isResettingRef.current) {
              isResettingRef.current = true;
              resetTimeoutRef.current = setTimeout(() => {
                resetTimeoutRef.current = null;
                gsapi?.to(window, { scrollTo: 0, duration: 2.5 });
                modeRef.current = "IDLE";
                isResettingRef.current = false;
                setMode("IDLE");
                setCurrentFrame(frames[0]);
                segmentRef.current = SEGMENTS[0];
                lastProgressRef.current = 0;
                targetTimeRef.current = 0;
                smoothedTimeRef.current = 0;
              }, RESET_DELAY_MS);
            }
            lastProgressRef.current = p;
            lastProgressMsRef.current = Date.now();
            return;
          }

          const seg =
            SEGMENTS.find(
              (s) => next >= s.transitionStart && next < s.scrollResume + 0.0001
            ) ?? SEGMENTS[SEGMENTS.length - 1];
          if (seg.id !== segmentRef.current.id) {
            segmentRef.current = seg;
            setCurrentFrame(getFrameForSegment(seg));
          }
          const clamped = Math.min(Math.max(next, seg.transitionStart), seg.scrollResume);
          targetTimeRef.current = clamped;
        },
      });

      rafRef.current = requestAnimationFrame(rafLoop);
    };

    init();
    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      if (keyHandlerRef.current) {
        window.removeEventListener("keydown", keyHandlerRef.current);
        keyHandlerRef.current = null;
      }
      stInstance?.kill();
    };
  }, []);

  const isIdle = mode === "IDLE";
  const showPanels = !isIdle && !NO_PANEL_FRAMES.has(currentFrame.id);
  const scrubbing = mode === "SCRUB" || mode === "LOOP";

  return (
    <section
      id="hero"
      ref={heroRef}
      style={{
        position: "relative",
        background: "#050509",
        minHeight: `calc(100vh + ${TOTAL_SCROLL_PX}px)`,
      }}
    >
      <div
        ref={stageRef}
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <video
          ref={expVidRef}
          muted
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 1,
            willChange: "transform",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            opacity: 1,
            transition: "opacity 0.9s ease",
          }}
        >
          <source src={EXPERIENCE_VIDEO} type="video/mp4" />
        </video>

        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(5,5,9,0.55) 100%)",
          }}
        />

        <AnimatePresence>
          {isIdle && (
            <motion.div
              key="idle-title"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 1.1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 5,
                textAlign: "center",
                pointerEvents: "none",
                width: "min(90vw, 720px)",
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 1,
                  background: "rgba(242,210,139,0.9)",
                  margin: "0 auto 20px",
                  boxShadow: "0 0 12px rgba(242,210,139,0.6)",
                }}
              />
              <p
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: 13,
                  letterSpacing: "0.42em",
                  textTransform: "uppercase",
                  color: "#F2D28B",
                  textShadow: "0 1px 18px rgba(5,5,9,0.95), 0 0 8px rgba(5,5,9,0.85)",
                  marginBottom: 22,
                  fontWeight: 500,
                }}
              >
                Genève · Since 1839
              </p>
              <h1
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontWeight: 400,
                  fontSize: "clamp(52px, 7.5vw, 110px)",
                  letterSpacing: "0.05em",
                  lineHeight: 1.02,
                  color: "#F6F3F0",
                  textShadow: "0 2px 30px rgba(5,5,9,0.9)",
                  margin: "0 0 26px",
                }}
              >
                Patek
                <br />
                Philippe
              </h1>
              <p
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: 13,
                  fontWeight: 300,
                  letterSpacing: "0.06em",
                  lineHeight: 1.85,
                  color: "rgba(246,243,240,0.62)",
                  maxWidth: 460,
                  margin: "0 auto 34px",
                }}
              >
                You never actually own a Patek Philippe. You merely look after
                it for the next generation.
              </p>
              <p
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: 9.5,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(246,243,240,0.42)",
                }}
              >
                Scroll to walk the hall — five references await
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isIdle && (
            <motion.div
              key="scroll-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                bottom: 36,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  width: 1,
                  height: 44,
                  background: "linear-gradient(to bottom, transparent, #F2D28B)",
                  animation: "scrollLine 2s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: 9,
                  letterSpacing: "0.32em",
                  color: "rgba(242,210,139,0.65)",
                  textTransform: "uppercase",
                }}
              >
                Scroll
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {showPanels && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 4,
              display: "grid",
              gridTemplateColumns: "minmax(280px,1fr) 2.4fr minmax(280px,1fr)",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "80px 20px 80px 44px",
                pointerEvents: "auto",
              }}
            >
              <FrameText frame={currentFrame} visible={true} />
            </div>
            <div />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: "80px 44px 80px 20px",
                pointerEvents: "auto",
              }}
            >
              <BuyCard frame={currentFrame} visible={true} />
            </div>
          </div>
        )}

        {!isIdle && (
          <div
            style={{
              position: "absolute",
              bottom: 28,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 6,
              display: "flex",
              gap: 8,
            }}
          >
            {SEGMENTS.filter((s) => s.id !== "scene-1-hall-opening").map(
              (seg) => {
                const frame = getFrameForSegment(seg);
                const active =
                  currentFrame.id === frame.id && NO_PANEL_FRAMES.has(frame.id) === false;
                return (
                  <div
                    key={seg.id}
                    title={seg.label}
                    style={{
                      width: active ? 24 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: active
                        ? "#F2D28B"
                        : "rgba(246,243,240,0.22)",
                      transition: "all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
                    }}
                  />
                );
              }
            )}
          </div>
        )}
      </div>
    </section>
  );
}
