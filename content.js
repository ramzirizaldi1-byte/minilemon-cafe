/**
 * CONTENT DATA — MiniLemon Cafe
 * ------------------------------------------------------------
 * Semua teks/harga/kontak di sini adalah PLACEHOLDER kecuali
 * yang ditandai [VERIFIED]. Ganti nilai di bawah ini dengan
 * data asli MiniLemon Cafe sebelum go-live.
 * ------------------------------------------------------------
 */

// [VERIFIED] alamat diberikan langsung oleh pemberi tugas
// [VERIFIED] mapsUrl adalah link Google Maps resmi lokasi MiniLemon (diberikan langsung oleh pemberi tugas)
export const LOCATION = {
  address: 'Jl. Dukuh Kupang Bar. XVI No.21, Dukuh Kupang, Kec. Dukuhpakis, Surabaya, Jawa Timur',
  mapsUrl:
    'https://www.google.com/maps/dir//Minilemon+Ice+Cream+%26+Tea,+Jl.+Dukuh+Kupang+Bar.+XVI+No.21,+Dukuh+Kupang,+Kec.+Dukuhpakis,+Surabaya,+Jawa+Timur+60225/@-7.2743138,112.7109475,13.1z/data=!4m8!4m7!1m0!1m5!1m1!1s0x2dd7fd458a2e49ff:0x2f6520a7e8f26e2e!2m2!1d112.7094781!2d-7.2813908',
  // [VERIFIED] jam operasional diberikan langsung oleh pemberi tugas (Senin–Minggu sama)
  hours: 'Setiap hari, 10.00–21.00',
}

export const CONTACT = {
  instagram: '[@minilemon_ice]',
  whatsapp: '[@+62 856-5571-0053]',
  email: '[EMAIL]',
}

// [VERIFIED] kategori & menu diambil dari data resmi (screenshot menu web & GoFood MiniLemon)
export const MENU_CATEGORIES = ['Gurih & Seru', 'Manis & Nyaman', 'Segar & Dingin']

// [VERIFIED] menu & kategori diambil dari website resmi minilemoncafe.com/menu
// [VERIFIED] harga untuk Ice Cream Cone, Chocolate Sundae, Milk Tea, Fresh Lemonade diberikan langsung oleh pemberi tugas; item lain masih menunggu harga resmi
export const MENU_ITEMS = [
  // Gurih & Seru
  { id: 'gs1', category: 'Gurih & Seru', image: '/images/menu/croffle-ice-cream.webp', name: 'Croffle Ice Cream', desc: 'Croffle hangat berpadu es krim lembut.', price: 'Rp8.000' },
  { id: 'gs2', category: 'Gurih & Seru', image: '/images/menu/gore-campur.webp', name: 'Gore Campur', desc: 'Topping gurih pedas dengan rasa ramai.', price: 'Rp25.000' },

  // Manis & Nyaman
  { id: 'mn1', category: 'Manis & Nyaman', image: '/images/menu/ice-cream-cone.webp', name: 'Ice Cream Cone', desc: 'Es krim vanilla lembut dalam cone.', price: 'Rp7.000' },
  { id: 'mn2', category: 'Manis & Nyaman', image: '/images/menu/chocolate-sundae.webp', name: 'Chocolate Sundae', desc: 'Dessert cokelat creamy untuk hari yang fun.', price: 'Rp15.000' },

  // Segar & Dingin
  { id: 'sd1', category: 'Segar & Dingin', image: '/images/menu/fresh-lemonade.webp', name: 'Fresh Lemonade', desc: 'Lemon segar yang ringan dan menyegarkan.', price: 'M: Rp6.000 / L: Rp8.000' },
  { id: 'sd2', category: 'Segar & Dingin', image: '/images/menu/milk-tea.webp', name: 'Milk Tea', desc: 'Perpaduan teh dan susu yang lembut.', price: 'M: Rp14.000 / L: Rp18.000' },
]

export const STORY_TIMELINE = [
  { year: '[TAHUN]', title: 'Awal MiniLemon', text: '[Cerita awal mula MiniLemon — isi dengan kisah asli.]' },
  { year: '[TAHUN]', title: 'Perkembangan', text: '[Cerita perkembangan awal usaha.]' },
  { year: '[TAHUN]', title: 'Konsep Cafe', text: '[Bagaimana konsep cafe terbentuk.]' },
  { year: '[TAHUN]', title: 'MiniLemon Cafe', text: '[Peresmian / pembukaan cafe.]' },
  { year: 'Today', title: 'Hari Ini', text: '[Kondisi MiniLemon Cafe saat ini.]' },
]

export const PARTNERSHIP = {
  heading: 'Grow Together With MiniLemon',
  points: [
    { title: 'Peluang Kemitraan', text: '[Jelaskan skema kemitraan yang ditawarkan.]' },
    { title: 'Keunggulan', text: '[Jelaskan keunggulan bermitra dengan MiniLemon.]' },
    { title: 'Proses Singkat', text: '[Jelaskan alur/proses pengajuan kemitraan.]' },
  ],
}
