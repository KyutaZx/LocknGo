import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BRAND, C, FONT, MONO, Dots, Hl, Icon, Logo, Reveal, ease, useIn, usePop } from "./theme";

const wrap: React.CSSProperties = { fontFamily: FONT, alignItems: "center", justifyContent: "center" };

/* 1 — HOOK */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 14, 70, 84], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const b = interpolate(f, [84, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const icons = [
    { n: "bag", x: 150, y: 120 }, { n: "train", x: 1060, y: 150 },
    { n: "flag", x: 200, y: 520 }, { n: "clock", x: 1040, y: 500 },
  ];
  return (
    <AbsoluteFill style={{ background: C.wineDark, ...wrap }}>
      <Dots />
      {icons.map((ic, i) => {
        const t = usePop(6 + i * 6);
        const bob = Math.sin((f + i * 20) / 18) * 8;
        return (
          <div key={i} style={{ position: "absolute", left: ic.x, top: ic.y + bob, width: 76, height: 76, borderRadius: 38, border: `2px solid ${C.sun}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${t})`, opacity: 0.9 }}>
            <Icon name={ic.n} size={32} color={C.sun} />
          </div>
        );
      })}
      <div style={{ position: "absolute", fontSize: 64, fontWeight: 800, color: C.cream, opacity: a, transform: `translateY(${(1 - a) * 20}px)`, letterSpacing: -1 }}>
        Setiap perjalanan punya <Hl>tujuan.</Hl>
      </div>
      <div style={{ position: "absolute", fontSize: 64, fontWeight: 800, color: C.cream, opacity: b, transform: `translateY(${(1 - b) * 20}px)`, letterSpacing: -1, textAlign: "center", lineHeight: 1.15 }}>
        Barang bawaan jangan <br />jadi <Hl>beban.</Hl>
      </div>
    </AbsoluteFill>
  );
};

/* 2 — MASALAH */
const Col: React.FC<{ icon: string; title: string; items: string[]; active: number; delay: number; itemDelay: number }> = ({ icon, title, items, active, delay, itemDelay }) => (
  <div style={{ width: 460, opacity: active }}>
    <Reveal delay={delay} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: C.wine, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={28} color={C.sun} />
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color: C.wine }}>{title}</div>
    </Reveal>
    {items.map((t, i) => (
      <Reveal key={t} delay={itemDelay + i * 12} style={{ background: "#fff", border: `1.5px solid ${C.line}`, borderRadius: 16, padding: "18px 22px", marginBottom: 16, display: "flex", gap: 14, alignItems: "center", boxShadow: "0 6px 18px rgba(120,1,21,.08)" }}>
        <div style={{ width: 12, height: 12, background: C.sun, transform: "rotate(45deg)", border: `2px solid ${C.wine}`, flex: "none" }} />
        <div style={{ fontSize: 23, fontWeight: 600, color: C.ink }}>{t}</div>
      </Reveal>
    ))}
  </div>
);
export const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const left = interpolate(f, [120, 140], [1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const right = interpolate(f, [120, 140], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: C.cream, ...wrap, flexDirection: "row", gap: 64, paddingBottom: 40 }}>
      <Col icon="train" title="Traveler & komuter" items={["Ransel berat dibawa seharian", "Tangan penuh belanjaan", "Bingung mau titip di mana"]} active={Math.min(left, interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" }))} delay={4} itemDelay={18} />
      <div style={{ width: 2, height: 360, background: C.line }} />
      <Col icon="bag" title="Pengunjung mall & stadion" items={["Barang bawaan mengganggu", "Butuh tempat penitipan yang jelas"]} active={Math.min(right, interpolate(f, [8, 28], [0, 1], { extrapolateRight: "clamp" }))} delay={8} itemDelay={126} />
    </AbsoluteFill>
  );
};

/* 3 — KENALAN */
export const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const logo = usePop(14);
  return (
    <AbsoluteFill style={{ background: C.wine, ...wrap, flexDirection: "column" }}>
      {[0, 1, 2].map((i) => {
        const x = interpolate(f, [0, 40], [0, 1400], { extrapolateRight: "clamp", easing: ease }) + i * 140;
        return <div key={i} style={{ position: "absolute", top: -40, left: 80 + i * 240 - x * 0.6, width: 120, height: 820, background: i === 1 ? C.sun : C.wineDark, transform: "skewX(-22deg)", opacity: interpolate(f, [0, 30], [1, 0], { extrapolateRight: "clamp" }) }} />;
      })}
      <div style={{ transform: `scale(${logo})` }}><Logo size={132} bg={C.cream} fg={C.wine} accent={C.sun} /></div>
      <Reveal delay={28} style={{ fontSize: 64, fontWeight: 800, color: C.cream, marginTop: 28, letterSpacing: -1 }}>Kenalan dengan {BRAND}</Reveal>
      <Reveal delay={42} style={{ fontSize: 30, fontWeight: 500, color: C.cream, marginTop: 10 }}>Loker penitipan barang di <Hl>titik ramai</Hl></Reveal>
    </AbsoluteFill>
  );
};

/* 4 — LOKASI */
const PLACES = [
  { n: "01", icon: "bag", tag: "MALL", name: "Tunjungan Plaza 1", info: "10.00 – 22.00" },
  { n: "02", icon: "train", tag: "STASIUN", name: "Stasiun Gubeng", info: "24 jam" },
  { n: "03", icon: "flag", tag: "STADION", name: "Stadion Gelora Bung Tomo", info: "07.00 – 23.00" },
];
export const Places: React.FC = () => {
  const line = useIn(10, 150);
  return (
    <AbsoluteFill style={{ background: C.cream, fontFamily: FONT }}>
      <Reveal style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", fontSize: 50, fontWeight: 800, color: C.wine }}>Ada di <Hl color={C.wine}>titik ramai</Hl> kotamu</Reveal>
      <div style={{ position: "absolute", top: 190, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 28 }}>
        {PLACES.map((p, i) => (
          <Reveal key={p.n} delay={20 + i * 22} y={40} style={{ width: 330, background: "#fff", border: `1.5px solid ${C.line}`, borderRadius: 26, padding: 28, boxShadow: "0 14px 34px rgba(120,1,21,.12)", borderBottom: `8px solid ${C.sun}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 16, color: C.wine, background: C.tint, padding: "4px 10px", borderRadius: 8 }}>{p.n}</div>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: C.wine, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={p.icon} size={26} color={C.sun} /></div>
            </div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 13, letterSpacing: 2, color: C.mute, marginTop: 34 }}>{p.tag}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.wine, lineHeight: 1.2, marginTop: 6, minHeight: 68 }}>{p.name}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", fontFamily: MONO, fontWeight: 700, fontSize: 16, color: C.ink, marginTop: 14 }}><Icon name="clock" size={18} />{p.info}</div>
          </Reveal>
        ))}
      </div>
      <div style={{ position: "absolute", left: 250, right: 250, top: 560, height: 4, background: C.line, borderRadius: 2 }}>
        <div style={{ width: `${line * 100}%`, height: 4, background: C.sun, borderRadius: 2 }} />
        {[0, 0.5, 1].map((x, i) => (
          <div key={i} style={{ position: "absolute", left: `${x * 100}%`, top: -8, width: 20, height: 20, marginLeft: -10, borderRadius: 10, background: line >= x ? C.wine : "#fff", border: `3px solid ${C.wine}` }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* 5 — UKURAN */
const Box: React.FC<{ id: string; h: number; delay: number; sub: string; dim: string }> = ({ id, h, delay, sub, dim }) => {
  const t = usePop(delay);
  const S = 4;
  const bh = h * S * t;
  return (
    <div style={{ position: "relative", width: 330, height: 420 }}>
      <div style={{ position: "absolute", left: 40, bottom: 130, width: 53 * S, height: bh, background: C.wine, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 12, border: `3px dashed ${C.sun}`, borderRadius: 8 }} />
        <div style={{ fontSize: 56, fontWeight: 800, color: C.sun }}>{id}</div>
      </div>
      <div style={{ position: "absolute", left: 40 + 53 * S + 18, bottom: 130, width: 3, height: bh, background: C.wine }} />
      <div style={{ position: "absolute", left: 40 + 53 * S + 30, bottom: 130 + bh / 2 - 12, fontFamily: MONO, fontWeight: 700, fontSize: 20, color: C.wine, opacity: t, whiteSpace: "nowrap" }}>{h} cm</div>
      <div style={{ position: "absolute", left: 40, bottom: 100, width: 53 * S, height: 3, background: C.wine }} />
      <div style={{ position: "absolute", left: 40, bottom: 68, width: 53 * S, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 18, color: C.wine }}>53 cm</div>
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 300, textAlign: "center", fontSize: 22, fontWeight: 700, color: C.ink, opacity: t }}>{sub}</div>
    </div>
  );
};
export const Sizes: React.FC = () => (
  <AbsoluteFill style={{ background: C.cream, fontFamily: FONT }}>
    <Reveal style={{ position: "absolute", top: 70, left: 90, fontSize: 52, fontWeight: 800, color: C.wine, lineHeight: 1.1 }}>Selalu ada<br />ukuran yang pas</Reveal>
    <Reveal delay={16} style={{ position: "absolute", top: 220, left: 90, width: 360, fontSize: 24, lineHeight: 1.5, color: C.mute }}>
      Cukup ukur tinggi barangmu. Lebar dan kedalaman loker sama-sama 53 cm.
    </Reveal>
    <Reveal delay={40} style={{ position: "absolute", top: 340, left: 90, background: C.tint, border: "1px solid #F3D48C", color: C.wine, fontFamily: MONO, fontWeight: 700, fontSize: 20, padding: "10px 18px", borderRadius: 999 }}>
      M · 38 × 53 × 53 cm
    </Reveal>
    <Reveal delay={52} style={{ position: "absolute", top: 400, left: 90, background: C.tint, border: "1px solid #F3D48C", color: C.wine, fontFamily: MONO, fontWeight: 700, fontSize: 20, padding: "10px 18px", borderRadius: 999 }}>
      L · 53 × 53 × 53 cm
    </Reveal>
    <div style={{ position: "absolute", top: 90, right: 70, display: "flex", gap: 40 }}>
      <Box id="M" h={38} delay={20} sub="Buat kebutuhan harian" dim="" />
      <Box id="L" h={53} delay={44} sub="Buat barang lebih besar" dim="" />
    </div>
  </AbsoluteFill>
);

/* 7 — MANFAAT */
export const Benefits: React.FC = () => {
  const items = [
    { icon: "grid", t: "Cek stok M & L langsung", x: 90, y: 230 },
    { icon: "steps", t: "Pesan dalam 3 langkah", x: 800, y: 230 },
    { icon: "moon", t: "Akses 24 jam di stasiun", x: 90, y: 440 },
    { icon: "pin", t: "Mall, stasiun, dan stadion", x: 800, y: 440 },
  ];
  const c = usePop(10);
  return (
    <AbsoluteFill style={{ background: C.cream, fontFamily: FONT }}>
      <Reveal style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", fontSize: 50, fontWeight: 800, color: C.wine }}>
        Lebih dari sekadar <span style={{ background: `linear-gradient(transparent 62%, ${C.sun} 62%)` }}>penitipan</span> barang
      </Reveal>
      <div style={{ position: "absolute", left: 520, top: 290, transform: `scale(${c})` }}>
        <Logo size={240} />
      </div>
      {items.map((it, i) => (
        <Reveal key={it.t} delay={30 + i * 14} style={{ position: "absolute", left: it.x, top: it.y, width: 390, background: "#fff", border: `1.5px solid ${C.line}`, borderRadius: 20, padding: "20px 24px", display: "flex", gap: 16, alignItems: "center", boxShadow: "0 10px 28px rgba(120,1,21,.10)" }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: C.wine, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon name={it.icon} size={26} color={C.sun} /></div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{it.t}</div>
        </Reveal>
      ))}
    </AbsoluteFill>
  );
};

/* 8 — PENUTUP */
export const Outro: React.FC = () => {
  const logo = usePop(6);
  return (
    <AbsoluteFill style={{ background: C.wine, ...wrap, flexDirection: "column" }}>
      <Dots />
      <div style={{ display: "flex", alignItems: "center", gap: 28, transform: `scale(${logo})` }}>
        <Logo size={150} bg={C.cream} fg={C.wine} accent={C.sun} />
        <div style={{ fontSize: 120, fontWeight: 800, color: C.cream, letterSpacing: -3 }}>{BRAND}</div>
      </div>
      <Reveal delay={24} style={{ fontSize: 30, fontWeight: 500, color: C.cream, marginTop: 22 }}>Loker penitipan barang di titik ramai.</Reveal>
      <Reveal delay={40} style={{ fontSize: 46, fontWeight: 800, color: C.cream, marginTop: 14 }}>
        <span style={{ color: C.wineDark, background: C.sun, padding: "0 16px", borderRadius: 10 }}>Titip dulu, jalan lagi.</span>
      </Reveal>
    </AbsoluteFill>
  );
};
