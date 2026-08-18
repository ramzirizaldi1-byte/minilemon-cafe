# MiniLemon Cafe — 3D Scroll Immersive Website

Website profil/promosi MiniLemon Cafe dengan pengalaman scrolling 3D immersive.
Dibangun dengan **Vite + vanilla JS + Three.js + GSAP ScrollTrigger** (tanpa Laravel/framework UI).

## Konsep

Scroll = perjalanan visual mengenal MiniLemon Cafe. Objek 3D "citrus" di Hero bereaksi
terhadap scroll (rotasi, posisi, scale, pergerakan kamera), dipadukan reveal teks bertahap,
parallax, dan timeline cerita yang terisi seiring scroll.

Objek 3D dibangun dari geometry Three.js (tidak butuh file `.glb` eksternal), jadi situs
tetap berjalan tanpa asset 3D tambahan. Jika nanti ada model `.glb` asli (mis. gelas/lemon
custom), tinggal di-load dan disubstitusi di `src/three/scene.js` fungsi `buildCitrus()`.

## Struktur folder

```
minilemon-cafe/
├── public/
│   ├── images/      ← taruh foto asli cafe/menu di sini
│   ├── models/       ← taruh file .glb/.gltf di sini jika ada
│   └── textures/
├── src/
│   ├── main.js        ← entry point, wiring GSAP ScrollTrigger & nav
│   ├── style.css       ← design system + semua styling, mobile-first
│   ├── data/
│   │   └── content.js  ← SEMUA teks/harga/kontak/jam — placeholder, edit di sini
│   ├── three/
│   │   └── scene.js    ← scene, camera, lighting, objek 3D hero, animasi scroll
│   └── sections/
│       ├── menu.js     ← render kartu menu + filter kategori
│       ├── story.js    ← render timeline "Cerita Kami"
│       └── misc.js     ← render Kemitraan, Lokasi, Kontak
├── index.html           ← markup semua section (Hero → Kontak)
├── package.json
└── README.md
```

## Cara install

Butuh Node.js 18+ dan npm.

```bash
cd minilemon-cafe
npm install
```

## Cara menjalankan (development)

```bash
npm run dev
```

Buka URL yang ditampilkan (default `http://localhost:5173`). Hot-reload aktif.

## Cara build production

```bash
npm run build
```

Hasil build ada di folder `dist/`. Untuk preview hasil build secara lokal sebelum deploy:

```bash
npm run preview
```

## Cara deploy / meng-online-kan

`dist/` adalah folder statis murni (HTML/CSS/JS) — bisa di-hosting di layanan static hosting mana pun:

**Opsi termudah — Netlify / Vercel**
1. Push project ke GitHub.
2. Import repo di Netlify/Vercel.
3. Build command: `npm run build`, Publish/Output directory: `dist`.
4. Deploy — selesai, dapat URL live otomatis.

**Opsi manual — hosting statis apa pun (mis. cPanel, Nginx)**
1. Jalankan `npm run build` di lokal.
2. Upload seluruh isi folder `dist/` ke `public_html` (atau document root server).
3. Pastikan server mengarahkan semua route ke `index.html` (situs ini single-page, tidak butuh rewrite rule khusus karena tidak ada client-side routing).

**GitHub Pages**
1. `npm run build`.
2. Deploy isi `dist/` ke branch `gh-pages` (bisa pakai package `gh-pages` atau GitHub Actions).

## Mengisi data asli (WAJIB sebelum go-live)

Semua data yang belum tersedia ditandai placeholder eksplisit. Edit **satu file ini** untuk mengganti semuanya:

`src/data/content.js`
- `MENU_ITEMS` → nama, deskripsi, harga tiap menu (kategori sudah sesuai brief: Coffee, Lemon Series, Non Coffee, Snack, Dessert)
- `STORY_TIMELINE` → cerita/tahun asli MiniLemon
- `PARTNERSHIP` → detail skema kemitraan
- `CONTACT` → Instagram, WhatsApp, Email asli
- `LOCATION.hours` → jam operasional asli (alamat sudah terisi sesuai data yang diberikan)

Untuk foto: taruh file di `public/images/`, lalu ganti div placeholder `[FOTO MENU]` di
`src/sections/menu.js` dan elemen visual di section About (`index.html`) dengan `<img>`
yang menunjuk ke `/images/nama-file.jpg`.

## Checklist fitur — SELESAI

- [x] Setup project Vite + Three.js + GSAP (npm install/dev/build semua berfungsi)
- [x] Hero: objek 3D citrus custom-geometry, reaktif terhadap scroll (rotate/posisi/scale/kamera), text animation entrance, scroll indicator, fallback jika WebGL tidak tersedia
- [x] Nav sticky + mobile menu toggle, otomatis berubah gaya di section gelap
- [x] Section Tentang: reveal animasi, parallax visual
- [x] Section Menu: 5 kategori sesuai brief, filter tab, card hover, scroll reveal per-card
- [x] Section Cerita Kami: timeline dengan garis yang "terisi" seiring scroll
- [x] Section Kemitraan: heading "Grow Together With MiniLemon", CTA
- [x] Section Lokasi: alamat asli, tombol Google Maps (auto-generate dari alamat), placeholder jam operasional
- [x] Section Kontak: Instagram/WhatsApp/Email/Maps dengan placeholder jelas
- [x] Responsive: mobile/tablet/desktop, kompleksitas 3D dikurangi otomatis di layar kecil
- [x] Performance: DPR dibatasi, dispose geometry/material/texture on unload, `prefers-reduced-motion` dihormati, tanpa asset eksternal wajib
- [x] `npm run build` sukses tanpa error

## Checklist fitur — MASIH PLACEHOLDER (isi data asli sebelum go-live)

- [ ] Nama, deskripsi, harga tiap item menu (`MENU_ITEMS`)
- [ ] Foto asli cafe & menu (masih kotak teks `[FOTO MENU]` / frame kosong)
- [ ] Cerita & tahun timeline asli (`STORY_TIMELINE`)
- [ ] Detail skema kemitraan (`PARTNERSHIP.points`)
- [ ] Jam operasional (`LOCATION.hours`)
- [ ] Akun Instagram, nomor WhatsApp, email resmi (`CONTACT`)
- [ ] Model 3D `.glb` asli (opsional — saat ini pakai geometry procedural, sudah berfungsi penuh tanpa ini)

## Catatan performa

Bundle production saat ini ~648 KB (~180 KB gzip), didominasi library Three.js — ini normal
untuk situs berbasis WebGL. Jika ingin dioptimalkan lebih lanjut nanti: code-splitting
Three.js dengan dynamic `import()`, atau kompres model `.glb` dengan Draco jika sudah ada
model custom.
