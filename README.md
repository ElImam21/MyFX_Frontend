# MyFX Trading Journal Dashboard

> Aplikasi pribadi untuk mencatat dan menganalisis log trading Forex secara terstruktur dengan visualisasi data real-time.

🌐 **Live:** [myfx-frontend.vercel.app](https://myfx-frontend.vercel.app)

---

## Tentang Proyek

MyFX adalah trading journal dashboard yang dibangun untuk kebutuhan pribadi dalam mencatat, mengelola, dan menganalisis riwayat transaksi trading Forex. Aplikasi ini dilengkapi dengan sistem autentikasi penuh, penyimpanan data berbasis MongoDB, dan visualisasi performa trading menggunakan chart interaktif.

---

## Fitur Utama

- **Autentikasi Aman** — Login/Register dengan hashing password (bcrypt) dan JWT token
- **Log Trading** — Catat setiap entry/exit posisi trading dengan detail lengkap
- **Visualisasi Data** — Chart interaktif (Recharts) untuk analisis performa dan equity curve
- **Dashboard Pribadi** — Tampilan ringkasan statistik trading secara real-time
- **Sesi Persisten** — Fitur "Ingat Saya" untuk kemudahan akses

---

## Tech Stack

| Teknologi | Versi | Fungsi |
|---|---|---|
| [Next.js](https://nextjs.org) | 15.5.9 | Framework fullstack |
| [React](https://react.dev) | 19.1.0 | UI library |
| [MongoDB](https://mongodb.com) | ^6.20.0 | Database |
| [JWT](https://jwt.io) | ^9.0.2 | Autentikasi token |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | ^3.0.2 | Hashing password |
| [Recharts](https://recharts.org) | ^3.3.0 | Chart & visualisasi |
| [Tailwind CSS](https://tailwindcss.com) | ^4 | Styling |
| [TypeScript](https://www.typescriptlang.org) | ^5 | Type safety |
| [Turbopack](https://turbo.build/pack) | (via Next.js) | Build tool |

---

## Struktur Proyek

```
myfx-frontend/
├── src/
│   └── app/
│       ├── api/         # API Routes (autentikasi, CRUD log trading)
│       └── (pages)/     # Halaman dashboard, login, dll
├── public/              # Aset statis
├── next.config.ts
├── tailwind.config
└── package.json
```

---

## Arsitektur

Proyek ini adalah **fullstack application** dalam satu repo:

- **Frontend** — Next.js App Router dengan Tailwind CSS dan Recharts untuk tampilan dashboard
- **Backend** — Next.js API Routes sebagai REST API
- **Database** — MongoDB untuk penyimpanan data trading dan akun pengguna
- **Auth** — JWT untuk session management, bcrypt untuk keamanan password

---

## Environment Variables

Untuk menjalankan proyek ini secara lokal, buat file `.env.local`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

## Memulai (Development)

### Prasyarat

- Node.js >= 18
- npm
- Akun MongoDB Atlas (atau MongoDB lokal)

### Instalasi

```bash
# Clone repository
git clone https://github.com/ElImam21/MyFX_Frontend.git
cd MyFX_Frontend

# Install dependencies
npm install

# Buat file .env.local dan isi variabel yang dibutuhkan
```

### Menjalankan Dev Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## Scripts

| Script | Fungsi |
|---|---|
| `npm run dev` | Dev server dengan Turbopack |
| `npm run build` | Build production dengan Turbopack |
| `npm run start` | Menjalankan production server |
| `npm run lint` | Menjalankan ESLint |

---

## Deploy

Di-deploy menggunakan **[Vercel](https://vercel.com)**. Pastikan environment variables (`MONGODB_URI`, `JWT_SECRET`) sudah dikonfigurasi di dashboard Vercel sebelum deploy.

---

## Catatan

Proyek ini dibuat untuk kebutuhan **pribadi** — sebagai alat bantu analisis dan evaluasi performa trading Forex. Tidak ditujukan untuk penggunaan publik.

---

## Lisensi

Private — Hak cipta © 2026 Hakimi Junior. Semua hak dilindungi.
