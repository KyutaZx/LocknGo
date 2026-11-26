import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, staticFile, interpolate, useCurrentFrame } from "remotion";
import "@fontsource/plus-jakarta-sans/latin-400.css";
import "@fontsource/plus-jakarta-sans/latin-500.css";
import "@fontsource/plus-jakarta-sans/latin-600.css";
import "@fontsource/plus-jakarta-sans/latin-700.css";
import "@fontsource/plus-jakarta-sans/latin-800.css";
import "@fontsource/space-mono/latin-400.css";
import "@fontsource/space-mono/latin-700.css";
import { BRAND, Caption, FPS, H, W } from "./theme";
import { Benefits, Hook, Intro, Outro, Places, Problem, Sizes } from "./scenes";
import { Demo } from "./Demo";
import { Episode1, EPISODE1_META } from "./episode1";

const XF = 10; // crossfade frames

// Voice-over: taruh file mp3 di public/vo/ sesuai nama di bawah, lalu ubah HAS_VO jadi true.
const HAS_VO = false;
const VO = [
  { file: "01.mp3", from: 6 },
  { file: "02.mp3", from: 171 },
  { file: "03.mp3", from: 441 },
  { file: "04.mp3", from: 606 },
  { file: "05.mp3", from: 846 },
  { file: "06a.mp3", from: 1084 },
  { file: "06b.mp3", from: 1192 },
  { file: "06c.mp3", from: 1277 },
  { file: "06d.mp3", from: 1382 },
  { file: "07.mp3", from: 1506 },
  { file: "08.mp3", from: 1686 },
];
const SCENES: { start: number; len: number; el: React.ReactElement }[] = [
  { start: 0, len: 165, el: <Hook /> },
  { start: 165, len: 270, el: <Problem /> },
  { start: 435, len: 165, el: <Intro /> },
  { start: 600, len: 240, el: <Places /> },
  { start: 840, len: 240, el: <Sizes /> },
  { start: 1080, len: 420, el: <Demo /> },
  { start: 1500, len: 180, el: <Benefits /> },
  { start: 1680, len: 150, el: <Outro /> },
];
const TOTAL = 1830;

const CAPTIONS = [
  { from: 0, to: 80, text: "Setiap perjalanan punya tujuan." },
  { from: 80, to: 165, text: "Tapi barang bawaan sering jadi beban." },
  { from: 165, to: 300, text: "Ransel berat, tangan penuh belanjaan," },
  { from: 300, to: 435, text: "dan bingung harus titip barang di mana." },
  { from: 435, to: 600, text: `Kenalan dengan ${BRAND}, loker penitipan barang di titik ramai.` },
  { from: 600, to: 720, text: "Tersedia di mall, stasiun, dan stadion," },
  { from: 720, to: 840, text: "dengan jam operasional yang jelas." },
  { from: 840, to: 960, text: "Pilih ukuran M untuk kebutuhan harian," },
  { from: 960, to: 1080, text: "atau ukuran L untuk barang yang lebih besar." },
  { from: 1080, to: 1190, text: "Pilih lokasi dan cek stok yang tersedia," },
  { from: 1190, to: 1275, text: "pilih ukuran yang pas," },
  { from: 1275, to: 1380, text: "tentukan durasi," },
  { from: 1380, to: 1500, text: "dan lokermu siap dipakai." },
  { from: 1500, to: 1590, text: "Lebih praktis, lebih tenang," },
  { from: 1590, to: 1680, text: "dan lebih bebas bergerak." },
  { from: 1680, to: 1830, text: "Titip dulu, jalan lagi." },
];

const FadeOut: React.FC<{ dur: number; children?: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [dur - XF, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const LockNGoIntro: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SCENES.map((s, i) => {
      const last = i === SCENES.length - 1;
      const dur = s.len + (last ? 0 : XF);
      return (
        <Sequence key={i} from={s.start} durationInFrames={dur} style={{ zIndex: SCENES.length - i }}>
          {last ? <AbsoluteFill>{s.el}</AbsoluteFill> : <FadeOut dur={dur}>{s.el}</FadeOut>}
        </Sequence>
      );
    })}
    {HAS_VO && VO.map((v) => (
      <Sequence key={v.file} from={v.from}>
        <Audio src={staticFile("vo/" + v.file)} />
      </Sequence>
    ))}
    <Caption items={CAPTIONS} />
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id="LockNGoIntro" component={LockNGoIntro} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
    <Composition
      id="Episode1"
      component={Episode1}
      durationInFrames={EPISODE1_META.TOTAL}
      fps={EPISODE1_META.FPS}
      width={EPISODE1_META.W}
      height={EPISODE1_META.H}
    />
  </>
);
