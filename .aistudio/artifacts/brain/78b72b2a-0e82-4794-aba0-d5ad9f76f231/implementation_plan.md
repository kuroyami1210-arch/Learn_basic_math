# Perombakan Desain: Matematika Kilat — Swiss Grid Minimalis (Putih, Biru, Merah)

Rombak total antarmuka game perkalian cepat dan matematika dasar menuju estetika **Swiss Grid Minimalis murni**: latar belakang putih bersih, elemen struktural biru tua dan merah tegas, garis-garis pembatas presisi (hairline grid), serta **tanpa penggunaan ikon grafis sama sekali** (anti AI-slop).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Keputusan Desain Terkonfirmasi:**
> - **Palet Warna Utama**: Latar belakang putih bersih (`#FFFFFF` / `#F8FAFC`), tombol dan elemen struktural berbasis Biru Kobalt/Navy (`#1E3A8A`, `#2563EB`) dan Merah Kontras (`#DC2626`, `#991B1B`), dengan tipografi teks hitam/slate pekat (`#0F172A`).
> - **Gaya Visual**: Tipografi Swiss Grid internasional — garis hairline tegas (`border-slate-300`, `border-slate-900`), sudut presisi tajam/subtle (`rounded-none` atau `rounded-sm`), tanpa shadow berlebih, tanpa efek glow/neon, dan tanpa tumpukan badge kapsul (*zero-pill discipline*).
> - **Eliminasi Ikon (100% No Icons)**: Menghapus seluruh ikon SVG Lucide (`Zap`, `Flame`, `Trophy`, `Clock`, `Heart`, `Sparkles`, dll.). Seluruh status, navigasi, dan kontrol digantikan dengan tipografi lugas, simbol matematika formal (`×`, `+`, `−`, `÷`, `=`), dan indikator tekstual presisi (`[LATIHAN]`, `[TANTANGAN]`, `NYAWA: 3/3`, `KEMBALI`, `HAPUS`, `ENTER ↵`).

---

## 1. Overview & Core Concept

- **Tujuan Utama**: Memberikan arena latihan perkalian cepat yang bersih, fokus, dan bebas distraksi visual (*zero distraction*).
- **Esensi Mode**:
  - **Mode Latihan (Stopwatch)**: Waktu berjalan maju tanpa batas waktu mundur, penekanan warna biru struktural yang tenang, dengan teks petunjuk trik matematika tersembunyi/dapat dibuka.
  - **Mode Tantangan (Timer)**: Hitung mundur dengan aksen merah presisi, penghitung kesalahan berbasis teks (`KESALAHAN: 0/3`), dan input jawaban langsung.
- **Nilai Tambah**: Pengguna dapat membaca angka dan simbol secara instan tanpa terganggu elemen dekoratif yang tidak relevan dengan esensi berhitung cepat.

---

## 2. User Experience & Visual Design (Swiss Grid)

### A. Palet Warna (Putih, Biru, Merah)
- **60% Latar Kanvas**: Putih murni (`bg-white`) dengan area latar seimbang (`bg-slate-50`).
- **30% Struktur & Aksen Biru**:
  - Biru Navy / Kobalt (`bg-blue-700`, `hover:bg-blue-800`, `text-blue-900`, `border-blue-900`): Digunakan untuk tombol utama, tab navigasi aktif, dan kartu Latihan.
  - Border Hairline (`border-slate-200`, `border-slate-900`): Garis pembatas grid presisi 1px.
- **10% Aksen Merah**:
  - Merah Tegas (`bg-red-600`, `text-red-700`, `border-red-600`): Digunakan untuk indikator waktu genting, status Tantangan, feedback jawaban salah, dan tombol hapus/reset.

### B. Tipografi & Grid
- **Font Utama**: Sans-serif tegas berkarakter Swiss (`Inter` / `Plus Jakarta Sans` / clean system sans) dengan *tracking* rapi, huruf kapital terukur untuk label navigasi, serta angka monospasial tebal (`font-mono tabular-nums`).
- **Display Soal**: Teks soal matematika hitam pekat di atas kanvas putih berbingkai garis 2px solid (`border-2 border-slate-900`), angka raksasa (`text-6xl sm:text-7xl font-mono font-bold`).
- **Numpad Taktil Minimalis**: Grid 3×3 + baris aksi dengan tombol berbingkai garis tegas, kontras tinggi saat ditekan (`active:bg-slate-900 active:text-white`), label teks murni (`HAPUS`, `0`, `BERSIH`, `KIRIM JAWABAN`).

### C. Penggantian Ikon Menjadi Tipografi & Simbol
| Komponen Lama (AI-Slop) | Desain Baru (Swiss Minimalis) |
| :--- | :--- |
| Ikon Lucide Flame 🔥 x3 | Teks monospasial tegas: `KOMBO: 3X` dalam kotak border biru |
| Ikon Heart ❤️❤️❤️ | Indikator teks: `NYAWA: [■ ■ ■]` atau `3 KESALAHAN TERSISA` |
| Ikon Clock / Timer | Teks indikator: `STOPWATCH: 00:14.2` / `TIMER: 04.5s` |
| Ikon Trophy / Zap / Lightbulb | Teks tombol: `[PANDUAN TRIK]`, `[RIWAYAT SKOR]`, `[SUARA: AKTIF]` |
| Ikon Check / Cross | Indikator teks status: `[BENAR]` (Biru/Hitam) / `[SALAH]` (Merah) |
| Tombol Back / Arrow | Teks presisi: `← KEMBALI` atau `[MENU UTAMA]` |

---

## 3. Komponen yang Direstrukturisasi

```
┌─────────────────────────────────────────────────────────────────┐
│ [APP.TSX] STATE MANAGEMENT & THEME ORCHESTRATION               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────┐         ┌─────────────────────────┐  │
│  │ TOP HEADER (3-ZONE)   │         │ MODAL OVERLAYS (NO ICON)│  │
│  │ Brand · Nav · Actions │         │ · Trik Hitung Cepat     │  │
│  │ (Minimalist Swiss)    │         │ · Riwayat & Skor        │  │
│  └──────────┬────────────┘         └────────────▲────────────┘  │
│             │                                   │               │
│             ▼                                   │               │
│  ┌──────────────────────────────────────────────┴────────────┐  │
│  │ VIEW SWITCHER                                             │  │
│  │                                                           │  │
│  │  1. HOME SCREEN:                                          │  │
│  │     - Hero Headline: "MATEMATIKA KILAT"                   │  │
│  │     - Grid 2 Kolom: [MODE LATIHAN] vs [MODE TANTANGAN]    │  │
│  │     - Daftar Preset Grid Minimalis                        │  │
│  │                                                           │  │
│  │  2. SETUP SCREEN:                                         │  │
│  │     - Pilihan Operasi: [ × ] [ + ] [ − ] [ ÷ ]            │  │
│  │     - Skala Digit: Satuan, Belasan, Puluhan, Ratusan      │  │
│  │     - Timer & Jumlah Soal Selector                        │  │
│  │                                                           │  │
│  │  3. GAMEPLAY SCREEN:                                      │  │
│  │     - HUD Atas: SOAL 3/10 · TIMER / STOPWATCH · NYAWA     │  │
│  │     - Kotak Soal Utama (Presisi Border Hitam/Putih)       │  │
│  │     - Display Input Angka + Numpad Taktil Minimalis       │  │
│  │                                                           │  │
│  │  4. RESULT SCREEN:                                        │  │
│  │     - Matrix Metrik: Akurasi %, Waktu Rata-rata, Rekor    │  │
│  │     - Evaluasi List Soal (Jawaban Benar vs Input)         │  │
│  │     - Aksi: [MAIN LAGI] · [PENGATURAN] · [MENU]           │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Rincian Eksekusi Teknis

1. **Pembersihan Dependensi Ikon**:
   - Menghapus ketergantungan render ikon pada komponen `HomeScreen`, `SetupScreen`, `GameScreen`, `ResultScreen`, `MentalMathTipsModal`, dan `HistoryModal`.
   - Mengganti seluruh ikon dengan tipografi fungsional, simbol ASCII/Unicode standar (`←`, `→`, `↵`, `×`, `÷`, `−`, `+`), dan sistem kotak state.
2. **Transformasi CSS & Tema Global (`src/index.css`)**:
   - Mengubah palet dasar menjadi latar putih bersih (`#FFFFFF`), teks gelap kontras (`#0F172A`), aksen biru kobalt (`#1D4ED8`), dan merah crimson (`#DC2626`).
   - Mengganti styling animasi gelombang/neon dengan transisi tajam (sharp micro-interactions).
3. **Penyempurnaan Form & Numpad (`src/components/GameScreen.tsx`)**:
   - Desain kotak input yang bersih dengan latar putih, border solid 2px hitam, angka besar monospasial.
   - Numpad grid bergaris presisi dengan warna tombol putih berbingkai biru/hitam, tombol kirim merah/biru kontras.
4. **Verifikasi & Build**:
   - Memastikan `npm run lint` dan `compile_applet` bebas error tanpa regresi fungsional (semua kustomisasi digit, operasi hitung, mode latihan/tantangan, stopwatch, dan timer tetap bekerja 100%).
