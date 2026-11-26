# LocknGo Agent Guidelines and Rules

Guidelines, architecture boundaries, and design principles for AI agents working in this repository.

## 1. Project Overview and Tech Stack

- **Domain**: LocknGo — automated smart locker service across 7 public hubs in Surabaya (Malls, 24h Stations, Stadiums).
- **Frontend / Fullstack**: Next.js 14 (App Router), React 18, TypeScript (strict mode), Tailwind CSS, Lucide icons.
- **Backend / Database**: Supabase (PostgreSQL, Row Level Security, Realtime, server/browser clients).
- **Core Business Logic**: Isolated in `src/lib/engine.ts` and `src/lib/data.ts`.

## 2. Design System and Visual Tokens

- **Brand Colors**:
  - Primary / Brand: Bloodwine (`#780115`, deep: `#5A0110`, tint: `#FCEEF1`)
  - Accent / Action: Sunflare (`#F7B638`, light: `#FFF4DC`, hover: `#E8A326`)
  - Background Canvas: Warm Cream (`#FFFCF7`)
  - Card Surfaces: Crisp White (`#FFFFFF`) with subtle border (`#EADFE2`)
  - Ink: `#2B1A1D` (body text), `#6E6268` (secondary text)
  - Ready Status: Emerald (`#10B981`)
- **Typography**:
  - Primary UI & Headings: `Plus Jakarta Sans`
  - Monospace Data (Units, Timer, OTP, Guard Code, Currency): `Space Mono`
- **Strict Visual Rule**:
  - Never use emojis or emoticons in UI components, markdown documentation, commit messages, or comments. Use clean SVG icons (Lucide) and explicit labels.

## 3. Workspace Skills

Satu skill ringkas di `.agents/skills/ui-ux-pro-max/SKILL.md`: checklist layout, state komponen, gerak, review visual, dan microcopy. Token warna, font, dan aturan emoji ada di bagian 2, tidak diduplikasi di skill. Skill taste, motion, dan copy sudah digabung ke dalamnya. GSAP tidak dipakai di proyek ini, jadi skillnya dihapus sampai ada kebutuhan animasi kompleks.

## 4. Engineering Standards

- **Type Safety**: Zero `any` unless explicitly wrapping untyped external APIs. All business rules must be strongly typed.
- **Verification**: Run `npx tsc --noEmit` and `npm run build` to verify every change before committing.
- **Business Rule Integrity**: Pricing, 5-minute late fee blocks (Rp5.000 capped at Rp1.440.000 / 24h; items secured by staff beyond 24h), and 1 reserve unit per size must always adhere to `docs/01-PRD.md` and `docs/03-DECISIONS.md`.
