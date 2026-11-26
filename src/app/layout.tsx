import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LocknGo — Titip barang, jalan terus.',
  description:
    'Loker digital otomatis. Pesan loker dari HP, bayar QRIS, buka pakai QR. Tanpa antre dan tanpa instal aplikasi.',
  icons: {
    icon: [
      { url: '/favicon.ico?v=3' },
      { url: '/assets/favicon.png?v=3', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=3',
    apple: '/assets/favicon.png?v=3',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico?v=3" sizes="any" />
        <link rel="icon" type="image/png" href="/assets/favicon.png?v=3" />
        <link rel="apple-touch-icon" href="/assets/favicon.png?v=3" />
      </head>
      <body className="min-h-screen bg-cream text-ink font-sans selection:bg-sunflare/30 selection:text-bloodwine">
        {children}
      </body>
    </html>
  );
}
