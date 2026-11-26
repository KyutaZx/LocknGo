import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, MONO, Icon } from "./theme";

const FX = 110, FY = 70, FW = 1060, FH = 560;
const CTA = { x: 894, y: 512 };
const PTS: [number, number, number][] = [
  [0, 980, 300], [45, 520, 184], [58, 520, 184], [95, CTA.x, CTA.y], [106, CTA.x, CTA.y],
  [128, 277, 330], [148, 277, 330], [178, CTA.x, CTA.y], [189, CTA.x, CTA.y],
  [212, 660, 300], [242, 660, 300], [280, CTA.x, CTA.y], [294, CTA.x, CTA.y], [330, 900, 570],
];
const CLICKS = [55, 102, 145, 186, 222, 238, 290];
const LOCS = [
  { icon: "bag", name: "Tunjungan Plaza 1", tag: "Mall", info: "10.00 – 22.00", m: 4, l: 3 },
  { icon: "bag", name: "Galaxy Mall 3", tag: "Mall", info: "10.00 – 22.00", m: 3, l: 2 },
  { icon: "bag", name: "Pakuwon Mall", tag: "Mall", info: "10.00 – 22.00", m: 4, l: 3 },
];

const Tile: React.FC<{ l: string; n: number | string }> = ({ l, n }) => (
  <div style={{ width: 64, background: C.tint, borderRadius: 14, padding: "6px 0", textAlign: "center", color: C.wine, lineHeight: 1.1 }}>
    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 11 }}>{l}</div>
    <div style={{ fontWeight: 800, fontSize: 24 }}>{n}</div>
    <div style={{ fontFamily: MONO, fontSize: 9 }}>tersedia</div>
  </div>
);

export const Demo: React.FC = () => {
  const f = useCurrentFrame();
  const step = f < 108 ? 1 : f < 192 ? 2 : f < 296 ? 3 : 4;
  const hasLoc = f >= 55, hasSize = f >= 145;
  const hours = 1 + (f >= 222 ? 1 : 0) + (f >= 238 ? 1 : 0);
  const cx = interpolate(f, PTS.map((p) => p[0]), PTS.map((p) => p[1]), { extrapolateRight: "clamp" });
  const cy = interpolate(f, PTS.map((p) => p[0]), PTS.map((p) => p[2]), { extrapolateRight: "clamp" });
  const cursorO = interpolate(f, [0, 10, 300, 322], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stepIn = (s: number) => interpolate(f, [s, s + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const entry = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const stepStart = step === 1 ? 0 : step === 2 ? 108 : step === 3 ? 192 : 296;
  const t = stepIn(stepStart);
  const ctaOn = (step === 1 && hasLoc) || (step === 2 && hasSize) || step === 3;
  const ctaLabel = step === 1 ? "Lanjut pilih ukuran" : step === 2 ? "Lanjut pilih durasi" : "Pesan loker";
  const st = (n: number, label: string) => {
    const cur = step === n, done = step > n;
    return (
      <div key={n} style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, color: cur || done ? C.wine : "#8A7468" }}>
        <div style={{ width: 28, height: 28, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 13, background: cur ? C.wine : done ? C.sun : "transparent", color: cur ? C.sun : done ? C.wine : "#8A7468", border: `1.5px solid ${cur ? C.wine : done ? C.sun : "#C9B3A6"}` }}>{n}</div>
        {label}
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ background: C.ink, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: FX, top: FY + (1 - entry) * 30, width: FW, height: FH, opacity: entry, background: C.cream, borderRadius: 20, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.5)" }}>
        {/* browser bar */}
        <div style={{ height: 40, background: "#F1E3CF", display: "flex", alignItems: "center", gap: 8, padding: "0 16px" }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: 10, height: 10, borderRadius: 5, background: "#C9B3A6" }} />)}
          <div style={{ marginLeft: 16, width: 340, height: 22, borderRadius: 11, background: "#fff", fontSize: 12, color: C.mute, display: "flex", alignItems: "center", padding: "0 12px" }}>lockngo · concept prototype</div>
          <div style={{ marginLeft: "auto", background: C.sun, color: C.wine, fontWeight: 700, fontSize: 12, padding: "3px 10px", borderRadius: 999 }}>Prototype</div>
        </div>
        {/* header */}
        <div style={{ position: "absolute", top: 54, left: 36, right: 36, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.wine }}>{step === 4 ? "Selesai" : "Pilih loker"}</div>
          <div style={{ display: "flex", gap: 20 }}>{st(1, "Lokasi")}{st(2, "Ukuran")}{st(3, "Durasi")}</div>
        </div>

        {step === 1 && LOCS.map((l, i) => {
          const sel = i === 0 && hasLoc;
          return (
            <div key={l.name} style={{ position: "absolute", left: 36, top: 140 + i * 100, width: 988, height: 88, boxSizing: "border-box", background: "#fff", borderRadius: 22, border: `${sel ? 2 : 1.5}px solid ${sel ? C.wine : C.line}`, boxShadow: sel ? "0 10px 26px rgba(120,1,21,.16)" : "none", display: "flex", alignItems: "center", gap: 16, padding: "0 22px", opacity: t, transform: `translateY(${(1 - t) * 14}px)` }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: C.wine, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={l.icon} size={24} color={C.sun} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}><div style={{ fontSize: 20, fontWeight: 800, color: C.wine }}>{l.name}</div><div style={{ background: C.tint, color: C.wine, fontWeight: 700, fontSize: 12, padding: "3px 9px", borderRadius: 999 }}>{l.tag}</div></div>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 13, color: C.ink, marginTop: 6 }}>{l.info}</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}><Tile l="M" n={l.m} /><Tile l="L" n={l.l} /></div>
              <div style={{ width: 28, height: 28, borderRadius: 14, border: `2px solid ${sel ? C.sun : "#C9B3A6"}`, background: sel ? C.sun : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>{sel && <Icon name="check" size={16} sw={3} />}</div>
            </div>
          );
        })}

        {step === 2 && [{ id: "M", h: 38, sub: "Buat kebutuhan harian", dim: "38 × 53 × 53 cm", stock: 4 }, { id: "L", h: 53, sub: "Buat barang lebih besar", dim: "53 × 53 × 53 cm", stock: 3 }].map((z, i) => {
          const sel = z.id === "M" && hasSize;
          return (
            <div key={z.id} style={{ position: "absolute", left: 36 + i * 506, top: 140, width: 482, height: 330, boxSizing: "border-box", background: "#fff", borderRadius: 24, border: `${sel ? 2 : 1.5}px solid ${sel ? C.wine : C.line}`, boxShadow: sel ? "0 12px 30px rgba(120,1,21,.16)" : "none", padding: 24, opacity: t, transform: `translateY(${(1 - t) * 14}px)`, display: "flex", gap: 24, alignItems: "center" }}>
              <div style={{ width: 106, height: z.h * 2, background: C.wine, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: C.sun, fontWeight: 800, fontSize: 28, flex: "none" }}>{z.id}</div>
              <div style={{ paddingBottom: 4 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: C.wine }}>Ukuran {z.id}</div>
                <div style={{ fontSize: 16, color: C.mute, margin: "4px 0 14px" }}>{z.sub}</div>
                <div style={{ display: "inline-block", background: C.tint, border: "1px solid #F3D48C", color: C.wine, fontFamily: MONO, fontWeight: 700, fontSize: 14, padding: "5px 12px", borderRadius: 999 }}>{z.dim}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.wine, marginTop: 14 }}>{z.stock} tersedia</div>
              </div>
            </div>
          );
        })}

        {step === 3 && (
          <div style={{ position: "absolute", left: 36, top: 140, width: 988, height: 330, boxSizing: "border-box", background: "#fff", borderRadius: 24, border: `1.5px solid ${C.line}`, opacity: t }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 36, textAlign: "center", fontSize: 18, color: C.mute }}>Berapa lama barangmu dititipkan?</div>
            {[{ x: 364, s: "−" }, { x: 624, s: "+" }].map((b) => (
              <div key={b.s} style={{ position: "absolute", left: b.x, top: 132, width: 56, height: 56, borderRadius: 28, border: `2px solid ${C.wine}`, color: C.wine, fontWeight: 800, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>{b.s}</div>
            ))}
            <div style={{ position: "absolute", left: 0, right: 0, top: 104, textAlign: "center", fontSize: 76, fontWeight: 800, color: C.wine, lineHeight: 1 }}>{hours}</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 16, color: C.mute }}>jam</div>
          </div>
        )}

        {step === 4 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", opacity: t, transform: `translateY(${(1 - t) * 16}px)` }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: C.sun, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={34} sw={3} /></div>
            <div style={{ fontSize: 32, fontWeight: 800, color: C.wine }}>Loker berhasil dipesan</div>
            <div style={{ margin: "22px auto 0", width: 520, background: "#fff", border: `2px solid ${C.wine}`, borderRadius: 22, padding: "10px 26px", textAlign: "left" }}>
              {[["Lokasi", "Tunjungan Plaza 1"], ["Ukuran", "M · 38 × 53 × 53 cm"], ["Durasi", `${hours} jam`]].map(([k, v], i) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: i < 2 ? "1px dashed #E3CDB8" : "none", fontSize: 17, color: C.mute }}>
                  <span>{k}</span><b style={{ color: C.wine }}>{v}</b>
                </div>
              ))}
            </div>
          </div>
        )}

        {step < 4 && (
          <div style={{ position: "absolute", left: CTA.x - 130, top: CTA.y - 24, width: 260, height: 48, borderRadius: 24, background: ctaOn ? C.sun : "#E9D7C3", color: ctaOn ? C.wine : "#8A7468", fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>{ctaLabel}<Icon name="arrow" size={16} color={ctaOn ? C.wine : "#8A7468"} sw={2.4} /></div>
        )}

        {/* cursor */}
        <div style={{ position: "absolute", left: cx, top: cy, opacity: cursorO }}>
          {CLICKS.map((c) => {
            const p = interpolate(f - c, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return p > 0 && p < 1 ? <div key={c} style={{ position: "absolute", left: -22, top: -22, width: 44, height: 44, borderRadius: 22, border: `3px solid ${C.wine}`, transform: `scale(${0.4 + p})`, opacity: 1 - p }} /> : null;
          })}
          <svg width="30" height="30" viewBox="0 0 24 24" style={{ position: "absolute", left: -4, top: -3 }}><path d="M5 3l14 8-6 1.5L10 19 5 3z" fill={C.ink} stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
