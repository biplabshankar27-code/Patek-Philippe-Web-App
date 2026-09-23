import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { type CSSProperties, type ReactNode } from "react";

interface LiquidGlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  borderRadius?: string;
  blurIntensity?: "sm" | "md" | "lg" | "xl";
  shadowIntensity?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  glowIntensity?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  draggable?: boolean;
}

const blurMap: Record<NonNullable<LiquidGlassCardProps["blurIntensity"]>, string> = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
};

const shadowMap: Record<
  NonNullable<LiquidGlassCardProps["shadowIntensity"]>,
  string
> = {
  none: "none",
  xs: "0 4px 24px rgba(0,0,0,0.18)",
  sm: "0 8px 40px rgba(0,0,0,0.28)",
  md: "0 12px 60px rgba(0,0,0,0.38)",
  lg: "0 20px 90px rgba(0,0,0,0.45)",
  xl: "0 28px 130px rgba(0,0,0,0.6)",
};

const glowMap: Record<
  NonNullable<LiquidGlassCardProps["glowIntensity"]>,
  string
> = {
  none: "none",
  xs: "0 0 20px rgba(242,210,139,0.04)",
  sm: "0 0 40px rgba(242,210,139,0.06)",
  md: "0 0 70px rgba(242,210,139,0.08)",
  lg: "0 0 120px rgba(242,210,139,0.10)",
  xl: "0 0 190px rgba(242,210,139,0.14)",
};

export function LiquidGlassCard({
  children,
  className,
  style,
  borderRadius = "20px",
  blurIntensity = "lg",
  shadowIntensity = "sm",
  glowIntensity = "none",
  draggable = false,
}: LiquidGlassCardProps) {
  return (
    <>
      <svg
        aria-hidden
        style={{ position: "absolute", width: 0, height: 0 }}
      >
        <defs>
          <filter id="glass-blur">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.003 0.007"
              numOctaves={2}
              seed={2}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={200}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        drag={draggable}
        style={{
          position: "relative",
          borderRadius,
          boxShadow: `${glowMap[glowIntensity]}, ${shadowMap[shadowIntensity]}`,
          ...style,
        }}
        className={cn("overflow-visible", className)}
      >
        <div
          className={cn(
            blurMap[blurIntensity],
            "relative h-full w-full overflow-hidden",
            className
          )}
          style={{
            borderRadius,
            boxShadow:
              "inset 0 1px 1px rgba(255,255,255,0.10), inset 0 -1px 1px rgba(255,255,255,0.04), inset 1px 0 1px rgba(255,255,255,0.03)",
            ...style,
          }}
        >
          {children}
        </div>
      </motion.div>
    </>
  );
}

export default LiquidGlassCard;
