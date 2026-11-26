import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const W = 540;
const H = 960;
const FPS = 30;
const C = {
  wine: "#780115",
  wineDark: "#4A000D",
  sun: "#F7B638",
  cream: "#FFF8EA",
  ink: "#2B1A1D",
  mute: "#5A4448",
  tint: "#FFF0CC",
  line: "#EFDFD0",
};
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const img = (n: string) => staticFile("img/" + n);
const vo = (n: number) => staticFile("vo/" + n + ".mp3");

const useIn = (delay: number, dur = 14) => {
  const f = useCurrentFrame();
  return interpolate(f - delay, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
};

const Reveal: React.FC<{
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ delay = 0, y = 26, style, children }) => {
  const t = useIn(delay);
  return <div style={{ opacity: t, transform: `translateY(${(1 - t) * y}px)`, ...style }}>{children}</div>;
};

const Pop: React.FC<{
  delay?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ delay = 0, style, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 13, stiffness: 130 } });
  return <div style={{ transform: `scale(${s})`, ...style }}>{children}</div>;
};

const P: Record<string, React.ReactNode> = {
  bag: <><path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8a3 3 0 016 0" /></>,
  train: <><rect x="6" y="3" width="12" height="14" rx="3" /><path d="M6 11h12M9 21l2-4M15 21l-2-4" /></>,
  flag: <path d="M6 21V4M6 5h13l-2 4 2 4H6" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  check: <path d="M5 12l5 5 9-10" />,
  pin: <><path d="M12 21s7-6 7-11a7 7 0 00-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  steps: <><circle cx="6" cy="6" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="18" cy="18" r="2" /><path d="M8 7l3 3M14 13l3 3" /></>,
};
const Icon: React.FC<{ name: string; size?: number; color?: string; sw?: number }> = ({
  name, size = 24, color = C.sun, sw = 2,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" stroke-linejoin="round">
    {P[name]}
  </svg>
);

/* Garis zigzag bergerak khas video referensi */
const Decor: React.FC = () => {
  const f = useCurrentFrame();
  const shift = interpolate(f, [0, 300], [0, -120], { extrapolateRight: "clamp" });
  const lines = [
    { d: "M-40 90 L60 40 L160 90 L260 40", x: 0, y: 0 },
    { d: "M280 830 L380 780 L480 830 L580 780", x: 0, y: 0 },
    { d: "M-20 500 L60 460 L140 500", x: 0, y: 40 },
  ];
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.7 }}>
      <AbsoluteFill style={{
        backgroundImage: "radial-gradient(rgba(247,182,56,.22) 1.5px, transparent 1.5px)",
        backgroundSize: "28px 28px",
      }} />
      {lines.map((l, i) => (
        <svg key={i} width="620" height="960" style={{ position: "absolute", left: l.x + shift * (i + 1) * 0.4, top: l.y }}>
          <path d={l.d} fill="none" stroke={C.sun} strokeWidth="2" opacity={0.35 + i * 0.12} />
        </svg>
      ))}
    </AbsoluteFill>
  );
};

const Photo: React.FC<{ src: string; strength?: number }> = ({ src, strength = 0.6 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 300], [1, 1.1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})` }} />
      <AbsoluteFill style={{ background: `rgba(120,1,21,${strength})` }} />
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ text: string; len: number }> = ({ text, len }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 12, len - 12, len], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 52, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{
        background: "rgba(43,26,29,.94)", color: C.cream, fontFamily: "'Plus Jakarta Sans',sans-serif",
        fontWeight: 700, fontSize: 22, lineHeight: 1.4, padding: "16px 22px", borderRadius: 999,
        maxWidth: 484, textAlign: "center",
      }}>{text}</div>
    </div>
  );
};

const base: React.CSSProperties = {
  fontFamily: "'Plus Jakarta Sans',sans-serif",
  alignItems: "center", justifyContent: "center", textAlign: "center", paddingBottom: 120,
};

const Badge: React.FC<{ text?: string }> = ({ text = "LOCKNGO · EPISODE 1" }) => (
  <div style={{
    position: "absolute", top: 34, left: 28, zIndex: 150,
    background: C.sun, color: C.wine, borderRadius: 999,
    padding: "8px 16px", fontFamily: "'Space Mono',monospace",
    fontSize: 13, fontWeight: 700, letterSpacing: 1,
  }}>{text}</div>
);

const Mascot: React.FC = () => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 12) * 10;
  return (
    <div style={{
      position: "absolute", right: 26, bottom: 150, zIndex: 140,
      width: 56, height: 56, borderRadius: 16, background: C.cream,
      display: "grid", placeItems: "center", transform: `translateY(${bob}px) rotate(${Math.sin(f / 20) * 5}deg)`,
      boxShadow: "0 8px 24px rgba(0,0,0,.3)",
    }}>
      <Img src={img("logo.png")} style={{ width: 48, height: 48, objectFit: "contain" }} />
    </div>
  );
};

/* 1 — HOOK (dark, garis bergerak) */
const Hook: React.FC = () => (
  <AbsoluteFill style={{ ...base, background: C.wineDark }}>
    <Photo src={img("hero-loker.webp")} strength={0.62} />
    <Decor />
    <Badge />
    <Mascot />
    <div style={{ position: "absolute", top: 104, left: 28, right: 28, display: "flex", flexDirection: "column", gap: 8, textAlign: "left" }}>
      {[["Ransel berat", C.cream, 6], ["bikin jalan-jalanmu", C.sun, 20], ["gak enak?", C.cream, 34]].map(([t, col, d]) => (
        <Reveal key={String(t)} delay={d as number} y={30}>
          <div style={{ fontSize: 46, fontWeight: 800, color: col as string, lineHeight: 1.12, letterSpacing: -1.5 }}>{t}</div>
        </Reveal>
      ))}
    </div>
    <Caption text="Ransel berat, tangan penuh? Tenang." len={145} />
  </AbsoluteFill>
);

/* 2 — MASALAH (light, kartu putih) */
const Problem: React.FC = () => {
  const groups = [
    { icon: "train", title: "Traveler & komuter", items: ["Ransel berat dibawa seharian", "Tangan penuh belanjaan"] },
    { icon: "bag", title: "Pengunjung mall & event", items: ["Barang bawaan mengganggu", "Butuh titipan yang jelas"] },
  ];
  return (
    <AbsoluteFill style={{ ...base, background: C.cream, paddingBottom: 150 }}>
      <Badge />
      <Reveal style={{ position: "absolute", top: 104, left: 28, right: 28, fontSize: 42, fontWeight: 800, color: C.wine, textAlign: "left" }}>
        Jalan-jalan<br /><span style={{ color: C.sun }}>jadi ribet?</span>
      </Reveal>
      <div style={{ position: "relative", width: "100%", padding: "0 34px", marginTop: 130 }}>
        {groups.map((g, i) => (
          <Reveal key={g.title} delay={16 + i * 24} y={34}>
            <div style={{
              background: "#fff", border: `1.5px solid ${C.line}`, borderRadius: 20,
              padding: "20px 22px", marginBottom: 16, textAlign: "left",
              boxShadow: "0 10px 26px rgba(120,1,21,.08)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: C.wine, display: "grid", placeItems: "center" }}>
                  <Icon name={g.icon} size={22} />
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.wine }}>{g.title}</div>
              </div>
              {g.items.map((it, j) => (
                <div key={it} style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8, opacity: 0.9 }}>
                  <div style={{ width: 9, height: 9, background: C.sun, transform: "rotate(45deg)", border: `1.5px solid ${C.wine}`, flex: "none" }} />
                  <div style={{ fontSize: 17, color: C.ink }}>{it}</div>
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
      <Caption text="Bawa tas ke mana-mana itu capek, ya." len={120} />
    </AbsoluteFill>
  );
};

/* 3 — KENALAN (dark) */
const Intro: React.FC = () => (
  <AbsoluteFill style={{ ...base, background: C.wine }}>
    <Photo src={img("kegunaan-titip.webp")} strength={0.62} />
    <Decor />
    <Badge />
    <Mascot />
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Pop delay={6}>
        <div style={{ width: 138, height: 138, borderRadius: 24, background: C.cream, display: "grid", placeItems: "center", boxShadow: "0 18px 50px rgba(0,0,0,.3)" }}>
          <Img src={img("logo.png")} style={{ width: 122, height: 122, objectFit: "contain" }} />
        </div>
      </Pop>
      <Reveal delay={24}><div style={{ marginTop: 24, fontSize: 46, fontWeight: 800, color: C.sun, letterSpacing: -1 }}>Lock and Go</div></Reveal>
      <Reveal delay={38} y={18}>
        <div style={{ marginTop: 12, fontSize: 23, color: C.cream, lineHeight: 1.5 }}>
          Loker titipan di <span style={{ color: C.sun, fontWeight: 800 }}>titik ramai</span>
        </div>
      </Reveal>
      <div style={{ display: "flex", gap: 10, marginTop: 26 }}>
        {["Mall", "Stasiun", "Stadion"].map((t, i) => (
          <Pop key={t} delay={56 + i * 9}>
            <div style={{ background: "rgba(255,248,234,.16)", border: `1px solid ${C.sun}`, borderRadius: 14, padding: "10px 14px", color: C.cream, fontSize: 16, fontWeight: 700 }}>{t}</div>
          </Pop>
        ))}
      </div>
    </div>
    <Caption text="Kenalan sama Lock and Go. Loker titipan di mall, stasiun, stadion." len={215} />
  </AbsoluteFill>
);

/* 4 — DEMO UI DENGAN KURSOR (khas referensi) */
const BrowserDemo: React.FC = () => {
  const f = useCurrentFrame();
  const step = f < 62 ? 1 : f < 126 ? 2 : f < 186 ? 3 : 4;
  const hasLoc = f >= 42, hasSize = f >= 106, hasDur = f >= 166;
  const pts: [number, number, number][] = [
    [0, 150, 400], [34, 150, 400], [48, 150, 400], [62, 150, 400],
    [80, 400, 470], [98, 400, 470], [112, 400, 470], [126, 400, 470],
    [144, 270, 610], [162, 270, 610], [176, 270, 610], [190, 270, 610],
  ];
  const cx = interpolate(f, pts.map((p) => p[0]), pts.map((p) => p[1]), { extrapolateRight: "clamp" });
  const cy = interpolate(f, pts.map((p) => p[0]), pts.map((p) => p[2]), { extrapolateRight: "clamp" });
  const ctaLabel = step === 1 ? "Lanjut pilih ukuran" : step === 2 ? "Lanjut pilih durasi" : step === 3 ? "Pesan loker" : "";
  const sel = (n: number) => (step === n || step > n);
  const stepper = (n: number, label: string) => (
    <div key={n} style={{ display: "flex", alignItems: "center", gap: 6, color: sel(n) ? C.wine : "#A89084" }}>
      <div style={{ width: 24, height: 24, borderRadius: 12, background: step === n ? C.wine : step > n ? C.sun : "transparent", color: step === n ? C.sun : C.wine, display: "grid", placeItems: "center", fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700, border: `1.5px solid ${sel(n) ? C.wine : "#C9B3A6"}` }}>{step > n ? "✓" : n}</div>
      <span style={{ fontSize: 12, fontWeight: 700 }}>{label}</span>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: C.ink, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <Badge />
      <Reveal style={{ position: "absolute", top: 100, left: 24, right: 24, fontSize: 32, fontWeight: 800, color: C.cream }}>
        Cara pakai <span style={{ color: C.sun }}>3 langkah</span>
      </Reveal>
      <div style={{
        position: "absolute", left: 30, top: 180, width: 480, height: 600,
        background: C.cream, borderRadius: 18, overflow: "hidden",
        border: `2px solid ${C.sun}`, boxShadow: "0 30px 80px rgba(0,0,0,.5)",
      }}>
        <div style={{ height: 34, background: "#F1E3CF", display: "flex", alignItems: "center", gap: 7, padding: "0 14px" }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: 9, height: 9, borderRadius: 5, background: "#C9B3A6" }} />)}
          <div style={{ marginLeft: 12, fontSize: 11, color: C.mute }}>lockngo · pesan loker</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 0" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.wine }}>{step === 4 ? "Selesai" : "Pilih loker"}</div>
          <div style={{ display: "flex", gap: 12 }}>{stepper(1, "Lokasi")}{stepper(2, "Ukuran")}{stepper(3, "Durasi")}</div>
        </div>
        {step === 1 && [
          { n: "Tunjungan Plaza 1", tag: "Mall", info: "10.00 – 22.00", m: 4, l: 3 },
          { n: "Stasiun Gubeng", tag: "Stasiun", info: "24 jam", m: 3, l: 4 },
        ].map((p, i) => (
          <div key={p.n} style={{
            margin: "18px 20px 0", background: "#fff", borderRadius: 16,
            border: `${hasLoc && i === 0 ? 2 : 1.5}px solid ${hasLoc && i === 0 ? C.wine : C.line}`,
            padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: C.wine, display: "grid", placeItems: "center" }}><Icon name={i === 0 ? "bag" : "train"} size={20} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.wine }}>{p.n}</div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: C.ink, marginTop: 4 }}>{p.info}</div>
            </div>
            <span style={{ background: C.tint, color: C.wine, fontSize: 10, fontWeight: 700, padding: "4px 8px", borderRadius: 999 }}>{p.tag}</span>
          </div>
        ))}
        {step === 2 && ["M", "L"].map((z, i) => (
          <div key={z} style={{
            margin: "18px " + (i === 0 ? "20px 0 0 20px" : "0 20px 0 0"), width: 210,
            display: "inline-block", verticalAlign: "top", background: "#fff", borderRadius: 16, border: `${hasSize && z === "M" ? 2 : 1.5}px solid ${hasSize && z === "M" ? C.wine : C.line}`, padding: 16,
          }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.sun, background: C.wine, borderRadius: 10, width: 46, height: 50, display: "grid", placeItems: "center" }}>{z}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.wine, marginTop: 12 }}>Ukuran {z}</div>
            <div style={{ fontSize: 11, color: C.mute, marginTop: 4 }}>{z === "M" ? "Buat kebutuhan harian" : "Buat barang lebih besar"}</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: C.wine, marginTop: 10 }}>{z === "M" ? "38 × 53 × 53 cm" : "53 × 53 × 53 cm"}</div>
          </div>
        ))}
        {step === 3 && (
          <div style={{ margin: "22px 20px 0", background: "#fff", borderRadius: 16, border: `1.5px solid ${C.line}`, padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 14, color: C.mute }}>Berapa lama barangmu dititipkan?</div>
            <div style={{ fontSize: 68, fontWeight: 800, color: C.wine, lineHeight: 1.2 }}>3</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, color: C.mute }}>jam</div>
          </div>
        )}
        {step === 4 && (
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <div style={{ width: 62, height: 62, borderRadius: 31, background: C.sun, display: "grid", placeItems: "center", margin: "0 auto 16px" }}><Icon name="check" size={32} color={C.wine} sw={3} /></div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.wine }}>Loker berhasil dipesan</div>
          </div>
        )}
        {step < 4 && (
          <div style={{
            position: "absolute", left: 150, bottom: 54, width: 240, height: 44, borderRadius: 22,
            background: (step === 1 && hasLoc) || (step === 2 && hasSize) || (step === 3 && hasDur) ? C.sun : "#E9D7C3",
            color: C.wine, fontWeight: 800, fontSize: 14, display: "grid", placeItems: "center",
          }}>{ctaLabel}</div>
        )}
      </div>
      {[0, 1, 2].map((c) => {
        const p = interpolate(f - c, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return p > 0 && p < 1 ? (
          <div key={c} style={{ position: "absolute", left: cx, top: cy, width: 44, height: 44, marginLeft: -22, marginTop: -22, borderRadius: 22, border: `3px solid ${C.sun}`, transform: `scale(${0.4 + p})`, opacity: 1 - p }} />
        ) : null;
      })}
      <div style={{ position: "absolute", left: cx, top: cy }}>
        <svg width="30" height="30" viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.5L10 19 5 3z" fill={C.cream} stroke={C.ink} strokeWidth="1.6" strokeLinejoin="round" /></svg>
      </div>
      <Caption
        text={step === 1 ? "Pilih lokasi dan cek stok loker." : step === 2 ? "Pilih ukuran yang pas." : step === 3 ? "Tentukan durasi sewa." : "Lokermu siap dipakai."}
        len={205}
      />
    </AbsoluteFill>
  );
};

/* 5 — STOK (light, kartu) */
const Stock: React.FC = () => (
  <AbsoluteFill style={{ ...base, background: C.cream, paddingBottom: 150 }}>
    <Badge />
    <Reveal style={{ position: "absolute", top: 104, left: 28, right: 28, fontSize: 42, fontWeight: 800, color: C.wine, textAlign: "left" }}>
      Stok kelihatan<br /><span style={{ color: C.sun }}>langsung</span>
    </Reveal>
    <div style={{ position: "relative", width: "100%", padding: "0 34px", marginTop: 130 }}>
      <Pop delay={12}>
        <div style={{ background: "#fff", border: `1.5px solid ${C.line}`, borderRadius: 22, padding: 26, textAlign: "left", boxShadow: "0 12px 30px rgba(120,1,21,.1)" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.wine, marginBottom: 18 }}>Tunjungan Plaza 1</div>
          <div style={{ display: "flex", gap: 12 }}>
            {[["M", 4], ["L", 3]].map(([l, n], i) => (
              <Pop key={l as string} delay={34 + i * 12}>
                <div style={{ background: C.tint, border: `1px solid ${C.sun}`, borderRadius: 16, width: 130, padding: "14px 0", textAlign: "center", color: C.wine }}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12 }}>{l}</div>
                  <div style={{ fontSize: 30, fontWeight: 800 }}>{n}</div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10 }}>tersedia</div>
                </div>
              </Pop>
            ))}
          </div>
        </div>
      </Pop>
    </div>
    <Caption text="Stok M dan L kelihatan. Ikuti seri lengkapnya, ya." len={185} />
  </AbsoluteFill>
);

/* 6 — OUTRO (dark, garis + logo) */
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const glow = interpolate(f, [0, 60, 105], [0.2, 0.45, 0.25], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ ...base, background: C.wineDark }}>
      <Photo src={img("hero-loker.webp")} strength={0.72} />
      <Decor />
      <Badge />
      <Mascot />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, rgba(247,182,56,${glow}), transparent 60%)` }} />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Pop delay={6}>
          <div style={{ width: 150, height: 150, borderRadius: 26, background: C.cream, display: "grid", placeItems: "center", boxShadow: "0 18px 50px rgba(0,0,0,.35)" }}>
            <Img src={img("logo.png")} style={{ width: 134, height: 134, objectFit: "contain" }} />
          </div>
        </Pop>
        <Reveal delay={26}>
          <div style={{ marginTop: 26, fontSize: 54, fontWeight: 800, color: C.cream, lineHeight: 1.14, letterSpacing: -1 }}>
            Titip dulu,<br /><span style={{ color: C.sun }}>jalan lagi.</span>
          </div>
        </Reveal>
        <Reveal delay={46} y={14}>
          <div style={{ marginTop: 24, background: C.sun, color: C.wine, borderRadius: 999, padding: "10px 22px", fontWeight: 800, fontSize: 18 }}>Lock and Go</div>
        </Reveal>
      </div>
      <Caption text="Titip dulu, jalan lagi." len={105} />
    </AbsoluteFill>
  );
};

const SCENES = [
  { len: 145, el: <Hook /> },
  { len: 120, el: <Problem /> },
  { len: 215, el: <Intro /> },
  { len: 205, el: <BrowserDemo /> },
  { len: 185, el: <Stock /> },
  { len: 105, el: <Outro /> },
];
const VO_START = [0, 145, 265, 480, 685, 870];
const TOTAL = SCENES.reduce((a, s) => a + s.len, 0);

export const Episode1: React.FC = () => {
  const f = useCurrentFrame();
  const progress = interpolate(f, [0, TOTAL], [0, 1], { extrapolateRight: "clamp" });
  let acc = 0;
  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      {SCENES.map((s, i) => {
        const from = acc;
        acc += s.len;
        const o = interpolate(f, [from, from + 8, from + s.len - 8, from + s.len], [0, 1, 1, 0], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        return (
          <Sequence key={i} from={from} durationInFrames={s.len}>
            <AbsoluteFill style={{ opacity: o }}>{s.el}</AbsoluteFill>
          </Sequence>
        );
      })}
      {VO_START.map((start, i) => (
        <Sequence key={i} from={start}><Audio src={vo(i + 1)} /></Sequence>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 5, background: "rgba(255,248,234,.25)", zIndex: 200 }}>
        <div style={{ width: `${progress * 100}%`, height: 5, background: C.sun }} />
      </div>
    </AbsoluteFill>
  );
};

export const EPISODE1_META = { W, H, FPS, TOTAL };
