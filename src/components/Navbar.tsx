'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, QrCode, Headphones } from 'lucide-react';
import {
  loadBookingSession,
  hasActiveLockerSession,
} from '@/lib/sessionStorage';

const NAV_LINKS = [
  { label: 'Kegunaan', href: '#kegunaan' },
  { label: 'Cara pakai', href: '#cara-kerja' },
  { label: 'Ukuran', href: '#ukuran' },
  { label: 'Lokasi', href: '#lokasi' },
  { label: 'Keamanan', href: '#keamanan' },
  { label: 'FAQ', href: '#faq' },
];

const WA_SUPPORT_URL =
  'https://wa.me/6281234567890?text=Halo%20LocknGo%20saya%20butuh%20bantuan';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLocker, setActiveLocker] = useState<string | null>(null);

  useEffect(() => {
    const syncSession = () => {
      const session = loadBookingSession();
      if (hasActiveLockerSession(session) && session) {
        setActiveLocker(session.allocatedLocker);
      } else {
        setActiveLocker(null);
      }
    };
    syncSession();
    window.addEventListener('storage', syncSession);
    window.addEventListener('focus', syncSession);
    return () => {
      window.removeEventListener('storage', syncSession);
      window.removeEventListener('focus', syncSession);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-ink-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 py-3 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0" aria-label="LocknGo Beranda">
            <Image
              src="/assets/logo.png"
              alt="LocknGo"
              width={160}
              height={48}
              className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-ink-muted">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-bloodwine transition-colors py-1 relative hover:after:w-full after:transition-all after:duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-sunflare whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Utility Actions & Mobile Menu Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bantuan CS (Desktop Only) */}
            <a
              href={WA_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-bloodwine px-3 py-2 rounded-xl hover:bg-cream transition-colors whitespace-nowrap"
            >
              <Headphones className="w-4 h-4 text-bloodwine/80" />
              <span>Bantuan</span>
            </a>

            {/* Cek Pesanan / Loker Aktif (Desktop Only - Mobile uses Drawer) */}
            <Link
              href="/pesan"
              className={`hidden lg:inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-all duration-150 active:scale-[0.98] whitespace-nowrap border ${
                activeLocker
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                  : 'text-bloodwine bg-cream hover:bg-bloodwine hover:text-white border-ink-line hover:border-bloodwine'
              }`}
            >
              {activeLocker ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Loker Aktif · {activeLocker}</span>
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  <span>Cek Pesanan</span>
                </>
              )}
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-bloodwine bg-bloodwine-tint hover:bg-bloodwine-tintHover transition-colors"
              aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-72 max-w-[85vw] bg-white z-50 lg:hidden shadow-2xl flex flex-col p-6 transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Menu navigasi mobile"
      >
        <div className="flex items-center justify-between pb-6 border-b border-ink-line">
          <Image src="/assets/logo.png" alt="LocknGo" width={110} height={34} className="h-8 w-auto" />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-xl text-bloodwine bg-bloodwine-tint hover:bg-bloodwine-tintHover"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-2 py-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl font-bold text-bloodwine hover:bg-sunflare-light transition-colors text-base"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-ink-line space-y-2.5">
          <Link
            href="/pesan"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full flex items-center justify-center gap-2 font-bold px-5 py-3 rounded-xl text-center shadow-sm text-sm transition-colors ${
              activeLocker
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'text-white bg-bloodwine hover:bg-bloodwine-hover'
            }`}
          >
            {activeLocker ? (
              <>
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>Pantau Loker ({activeLocker})</span>
              </>
            ) : (
              <>
                <QrCode className="w-4 h-4" />
                <span>Cek Pesanan / QR</span>
              </>
            )}
          </Link>
          <a
            href={WA_SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 font-semibold text-bloodwine bg-cream hover:bg-sunflare-light border border-ink-line px-5 py-2.5 rounded-xl text-center text-sm transition-colors"
          >
            <Headphones className="w-4 h-4" />
            <span>Bantuan CS</span>
          </a>
        </div>
      </aside>
    </>
  );
}
