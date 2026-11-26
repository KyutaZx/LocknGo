import { LockerSize, LockerSizeConfig, LocationConfig } from '@/types/locker';

export const CFG = {
  brand: 'LocknGo',
  tagline: 'Titip barang, jalan terus.',

  sizes: {
    M: {
      code: 'M' as LockerSize,
      name: 'Medium',
      dims: '55 × 50 × 45 cm',
      litre: 124,
      fits: '1 ransel sampai 50 cm, helm, atau 2–3 paper bag sedang.',
      short: 'Ransel, paper bag',
    },
    L: {
      code: 'L' as LockerSize,
      name: 'Large',
      dims: '55 × 50 × 90 cm',
      litre: 248,
      fits: '1 koper sampai 32 inci berdiri, stroller lipat, atau 4–6 shopping bag.',
      short: 'Koper, banyak belanjaan, stroller',
    },
  } as Record<LockerSize, LockerSizeConfig>,

  durations: [1, 3, 6, 12, 24] as const,

  price: {
    M: { 1: 15000, 3: 35000, 6: 55000, 12: 80000, 24: 120000 },
    L: { 1: 25000, 3: 50000, 6: 75000, 12: 110000, 24: 150000 },
  } as Record<LockerSize, Record<number, number>>,

  extend: {
    1: { M: 7500, L: 13500 },
    3: { M: 20500, L: 37500 },
  } as Record<number, Record<LockerSize, number>>,

  keepLateHours: 3,

  late: {
    perBlock: 5000,
    blockMinutes: 5,
    maxPerDay: 1440000,
    capHours: 24,
    lockSeconds: 300,
    storeDays: 7,
  },

  rules: {
    doorOpenSeconds: 180,
    reOpenGraceSeconds: 300,
    correctionSeconds: 600,
    pickupQrMinutes: 10,
    guardLockSeconds: 10,
    guardMaxTries: 3,
    reserveUnits: 1,
  },

  locations: [
    // 1. MALL
    {
      id: 'tp1',
      name: 'Tunjungan Plaza 1',
      category: 'mall',
      categoryLabel: 'Mall',
      area: 'Lantai Ground, dekat eskalator utama',
      units: { M: 5, L: 4 },
      openAt: 600,
      closesAt: 1320,
      alwaysOpen: false,
      open: '10.00 – 22.00',
    },
    {
      id: 'glx',
      name: 'Galaxy Mall 3',
      category: 'mall',
      categoryLabel: 'Mall',
      area: 'Lantai 1, dekat pintu masuk timur',
      units: { M: 4, L: 3 },
      openAt: 600,
      closesAt: 1320,
      alwaysOpen: false,
      open: '10.00 – 22.00',
    },
    {
      id: 'pvr',
      name: 'Pakuwon Mall',
      category: 'mall',
      categoryLabel: 'Mall',
      area: 'Lantai UG, dekat food court',
      units: { M: 5, L: 4 },
      openAt: 600,
      closesAt: 1320,
      alwaysOpen: false,
      open: '10.00 – 22.00',
    },

    // 2. STASIUN
    {
      id: 'gub',
      name: 'Stasiun Gubeng',
      category: 'stasiun',
      categoryLabel: 'Stasiun',
      area: 'Hall utama, akses 24 jam',
      units: { M: 4, L: 4 },
      openAt: 0,
      closesAt: 1440,
      alwaysOpen: true,
      open: '24 jam',
    },
    {
      id: 'pst',
      name: 'Stasiun Pasar Turi',
      category: 'stasiun',
      categoryLabel: 'Stasiun',
      area: 'Pintu Timur, dekat loket tiket',
      units: { M: 4, L: 3 },
      openAt: 0,
      closesAt: 1440,
      alwaysOpen: true,
      open: '24 jam',
    },

    // 3. STADION
    {
      id: 'gbt',
      name: 'Stadion Gelora Bung Tomo',
      category: 'stadion',
      categoryLabel: 'Stadion',
      area: 'Concourse Barat, samping Gate 7',
      units: { M: 6, L: 4 },
      openAt: 420,
      closesAt: 1380,
      alwaysOpen: false,
      open: '07.00 – 23.00',
    },
    {
      id: 'g10',
      name: 'Stadion Gelora 10 November',
      category: 'stadion',
      categoryLabel: 'Stadion',
      area: 'Lobi Barat Tambaksari, dekat ticket box',
      units: { M: 4, L: 3 },
      openAt: 480,
      closesAt: 1320,
      alwaysOpen: false,
      open: '08.00 – 22.00',
    },
  ] as LocationConfig[],

  prohibited: [
    'Barang berbahaya: senjata, bahan peledak, bahan mudah terbakar, gas.',
    'Barang terlarang hukum: narkotika, obat terlarang, minuman beralkohol.',
    'Hewan hidup dan tanaman.',
    'Makanan dan minuman yang mudah basi atau berbau.',
    'Barang cair dalam jumlah besar yang berpotensi bocor.',
    'Barang berharga di atas Rp5.000.000: perhiasan, logam mulia, dokumen penting.',
    'Uang tunai dalam jumlah berapa pun.',
  ],

  insurance: {
    maxCoverage: 5000000,
    claimWindowDays: 3,
    provider: 'Asuransi Mitra LocknGo',
    included: true,
  },
};
