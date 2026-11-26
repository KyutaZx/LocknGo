import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const BRAND = "Lock&Go";
export const W = 1280;
export const H = 720;
export const FPS = 30;
export const C = {
  wine: "#780115",
  wineDark: "#4A000D",
  sun: "#F7B638",
  cream: "#FFF8EA",
  ink: "#2B1A1D",
  mute: "#5A4448",
  tint: "#FFF0CC",
  line: "#EFDFD0",
};
export const FONT = "'Plus Jakarta Sans', sans-serif";
export const MONO = "'Space Mono', monospace";
export const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const useIn = (delay = 0, dur = 20) => {
  const f = useCurrentFrame();
  return interpolate(f - delay, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
};
export const usePop = (delay = 0) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping: 14, stiffness: 120 } });
};

export const Reveal: React.FC<{ delay?: number; y?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  delay = 0, y = 24, style, children,
}) => {
  const t = useIn(delay);
  return (
    <div style={{ opacity: t, transform: `translateY(${(1 - t) * y}px)`, ...style }}>{children}</div>
  );
};

const P: Record<string, React.ReactNode> = {
  bag: <><path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
  train: <><rect x="6" y="3" width="12" height="14" rx="3" /><path d="M6 11h12M9 21l2-4M15 21l-2-4" /></>,
  flag: <path d="M6 21V4M6 5h11l-2 4 2 4H6" />,
  pin: <><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  check: <path d="M5 12l5 5 9-10" />,
  box: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M4 12h16M8 7.5h3M8 16.5h3" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  bolt: <path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z" />,
  steps: <><circle cx="6" cy="6" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="18" cy="18" r="2" /><path d="M8 7l3 3M14 13l3 3" /></>,
  moon: <path d="M20 14A8 8 0 1 1 10 4a6.5 6.5 0 0 0 10 10z" />,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
};
export const Icon: React.FC<{ name: string; size?: number; color?: string; sw?: number }> = ({
  name, size = 24, color = C.wine, sw = 2,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {P[name]}
  </svg>
);

export const Logo: React.FC<{ size?: number; bg?: string; fg?: string; accent?: string }> = ({
  size = 80, bg = C.wine, fg = C.cream, accent = C.sun,
}) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect width="64" height="64" rx="16" fill={bg} />
    <rect x="14" y="14" width="16" height="36" rx="3" fill="none" stroke={fg} strokeWidth="3.5" />
    <rect x="34" y="14" width="16" height="16" rx="3" fill={accent} />
    <rect x="34" y="34" width="16" height="16" rx="3" fill="none" stroke={fg} strokeWidth="3.5" />
    <circle cx="24" cy="32" r="2.5" fill={accent} />
  </svg>
);

export const Hl: React.FC<{ children?: React.ReactNode; color?: string }> = ({ children, color = C.sun }) => (
  <span style={{ color }}>{children}</span>
);

export const Dots: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(247,182,56,.22) 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }} />
);

export const Caption: React.FC<{ items: { from: number; to: number; text: string }[] }> = ({ items }) => {
  const f = useCurrentFrame();
  const cur = items.find((c) => f >= c.from && f < c.to);
  if (!cur) return null;
  const o = interpolate(f, [cur.from, cur.from + 6, cur.to - 6, cur.to], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "absolute", zIndex: 100, left: 0, right: 0, bottom: 34, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ background: "rgba(43,26,29,.92)", color: C.cream, fontFamily: FONT, fontWeight: 500, fontSize: 24, padding: "10px 22px", borderRadius: 10 }}>
        {cur.text}
      </div>
    </div>
  );
};
