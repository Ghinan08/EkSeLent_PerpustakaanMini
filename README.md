Perpustakaan Mini Umum

Aplikasi web frontend untuk layanan perpustakaan komunitas. Anggota dapat mencari dan meminjam buku, memantau peminjaman, memberi ulasan, dan mengikuti event. Admin mengelola buku, peminjaman, event, dan pengguna.

Dibangun dengan React 18, Vite, React Router, dan Tailwind CSS. Data masih memakai JSON lokal sehingga belum membutuhkan backend.


1. Setup Frontend

Prasyarat:

- Node.js versi 18 atau lebih baru


Perintah yang tersedia:

- npm install: Memasang semua library yang tercantum di package.json
- npm run dev: Menjalankan server pengembangan dengan hot reload
- npm run build: Membuat versi produksi ke folder dist/
- npm run preview: Menjalankan hasil build secara lokal untuk dicoba

Akun untuk uji coba:

- User: budi@gmail.com / sandi password123
- User: rina@gmail.com / sandi password123
- User: aditia@gmail.com / sandi password123
- Admin: admin@gmail.com / sandi admin123

Data disimpan di memori browser. Pendaftaran akun baru, peminjaman, dan perubahan lain akan kembali ke data awal ketika halaman di-refresh.

Teknologi:

- React 18.3: Antarmuka berbasis komponen
- Vite 5.4: Dev server dan build tool
- React Router DOM 6.26: Perpindahan halaman dan pembatasan akses per peran
- Tailwind CSS 3.4: Styling dengan class utilitas (plugin forms dan container-queries)
- lucide-react 0.441: Kumpulan ikon


2. Hierarki Folder


fe_perpustakaan/
├─ src/
│  ├─ components/
│  │  ├─ book/
│  │  │  ├─ BookCard.jsx
│  │  │  └─ ReviewCard.jsx
│  │  ├─ layout/
│  │  │  ├─ Footer.jsx
│  │  │  ├─ Navbar.jsx
│  │  │  └─ Sidebar.jsx
│  │  └─ ui/
│  │     ├─ Button.jsx
│  │     ├─ Input.jsx
│  │     └─ Modal.jsx
│  ├─ data/
│  │  └─ dummyData.json
│  ├─ pages/
│  │  ├─ admin/
│  │  │  ├─ AdminLayout.jsx
│  │  │  ├─ Dashboard.jsx
│  │  │  ├─ FormBuku.jsx
│  │  │  ├─ KelolaBuku.jsx
│  │  │  ├─ KelolaEvent.jsx
│  │  │  ├─ KelolaPinjam.jsx
│  │  │  └─ KelolaUser.jsx
│  │  ├─ auth/
│  │  │  ├─ Login.jsx
│  │  │  └─ Register.jsx
│  │  └─ user/
│  │     ├─ Beranda.jsx
│  │     ├─ DetailBuku.jsx
│  │     ├─ Event.jsx
│  │     ├─ GantiPreferensi.jsx
│  │     ├─ Katalog.jsx
│  │     ├─ Onboarding.jsx
│  │     ├─ Peminjaman.jsx
│  │     ├─ Riwayat.jsx
│  │     └─ UserLayout.jsx
│  ├─ App.jsx
│  ├─ index.css
│  └─ main.jsx
├─ .gitignore
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ README.md
├─ tailwind.config.js
└─ vite.config.js


3. Modul

- Routing dan state
  - File: App.jsx, main.jsx
  - Fungsi: Menyimpan data bersama (user, buku, pinjaman, ulasan, event), menyediakan fungsi pengubah data, dan mengatur akses halaman per peran
- Autentikasi
  - File: Login.jsx, Register.jsx
  - Fungsi: Masuk dan mendaftar akun, termasuk validasi form
- Onboarding dan preferensi
  - File: Onboarding.jsx, GantiPreferensi.jsx
  - Fungsi: Memilih dan mengubah genre favorit
- Katalog dan buku
  - File: Beranda.jsx, Katalog.jsx, DetailBuku.jsx, BookCard.jsx, ReviewCard.jsx
  - Fungsi: Menampilkan, mencari, dan melihat detail buku serta ulasan
- Peminjaman (user)
  - File: Peminjaman.jsx, Riwayat.jsx
  - Fungsi: Memantau pinjaman, perpanjang, ajukan pengembalian, dan memberi ulasan
- Event (user)
  - File: Event.jsx
  - Fungsi: Melihat dan mendaftar event
- Admin: ringkasan dan buku
  - File: Dashboard.jsx, KelolaBuku.jsx, FormBuku.jsx
  - Fungsi: Statistik, daftar buku, dan formulir tambah atau ubah buku
- Admin: peminjaman
  - File: KelolaPinjam.jsx
  - Fungsi: Menyetujui atau menolak pinjaman, konfirmasi pengembalian, pembayaran denda
- Admin: event dan pengguna
  - File: KelolaEvent.jsx, KelolaUser.jsx
  - Fungsi: Mengelola event dan peran pengguna
- Layout
  - File: UserLayout.jsx, AdminLayout.jsx, Navbar.jsx, Sidebar.jsx, Footer.jsx
  - Fungsi: Kerangka halaman user (navbar dan footer) dan admin (sidebar)
- Komponen UI
  - File: Button.jsx, Input.jsx, Modal.jsx
  - Fungsi: Tombol, kolom isian, dan jendela pop-up yang dipakai ulang
- Data
  - File: dummyData.json
  - Fungsi: Sumber data contoh lokal
- Styling
  - File: tailwind.config.js, postcss.config.js, index.css
  - Fungsi: Tema warna, font, dan gaya global

Peta route

- /login, /register
  - Halaman: Login, Register
  - Akses: Belum login
- /onboarding
  - Halaman: Onboarding
  - Akses: User
- /, /katalog, /buku/:id, /peminjaman, /riwayat, /event, /preferensi
  - Halaman: Halaman anggota
  - Akses: User
- /admin/dashboard, /admin/buku, /admin/buku/tambah, /admin/buku/edit/:id, /admin/peminjaman, /admin/event, /admin/pengguna
  - Halaman: Halaman admin
  - Akses: Admin


4. JSON Lokal dan Strukturnya

Lokasi file: src/data/dummyData.json

File ini dibaca di App.jsx sebagai data awal (initial state). Kunci availableGenres, bookCategories, dan eventCategories juga dibaca langsung oleh halaman yang membutuhkannya.

Ringkasan kunci:

- initialUsers
  - Dipakai oleh: Login, Register, Dashboard, KelolaUser, KelolaPinjam, KelolaEvent, DetailBuku
- initialBooks
  - Dipakai oleh: Beranda, Katalog, DetailBuku, Peminjaman, Riwayat, Dashboard, KelolaBuku, FormBuku, KelolaPinjam
- initialLoans 
  - Dipakai oleh: Beranda, DetailBuku, Peminjaman, Riwayat, Dashboard, KelolaPinjam
- initialReviews
  - Dipakai oleh: DetailBuku, Riwayat
- initialEvents
  - Dipakai oleh: Beranda, Event, KelolaEvent
- availableGenres 
  - Dipakai oleh: Onboarding, GantiPreferensi, Beranda
- bookCategories
  - Dipakai oleh: FormBuku
- eventCategories
  - Dipakai oleh: KelolaEvent

initialUsers (akun pengguna):

- id (string), contoh: "U1"
  - ID unik pengguna (admin: "A1")
- nama (string), contoh: "Budi Santoso"
  - Nama lengkap
- email (string), contoh: "budi@gmail.com"
  - Email untuk login
- password (string), contoh: "password123"
  - Kata sandi (hanya untuk data contoh)
- role (string), contoh: "user"
  - "user" atau "admin"
- avatarInitials (string), contoh: "BS"
  - Inisial untuk avatar
- genres (array of string), contoh: ["Sastra & Novel"]
  - Genre favorit (nama genre)

initialBooks (buku):

- id (number), contoh: 1
  - ID unik buku
- kode (string), contoh: "SN-01"
  - Kode buku
- judul (string), contoh: "Bumi dan Bintang"
  - Judul buku
- penulis (string), contoh: "Raka Pratama"
  - Nama penulis
- tahun (number), contoh: 2024
  - Tahun terbit
- kategori (string), contoh: "Sastra & Novel"
  - Kategori buku
- rak (string), contoh: "Rak A-04"
  - Lokasi rak
- stok_total (number), contoh: 4
  - Jumlah seluruh eksemplar
- stok_tersedia (number), contoh: 3
  - Eksemplar yang bisa dipinjam
- cover_color (string), contoh: "bg-[135C4C]"
  - Class Tailwind warna sampul
- halaman (number), contoh: 384
  - Jumlah halaman
- bahasa (string), contoh: "Indonesia"
  - Bahasa buku
- rating (number), contoh: 4.9
  - Rating rata-rata
- status (string), contoh: "Tersedia"
  - "Tersedia" atau "Habis"
- sinopsis (string), contoh: "Kisah ini mengikuti..."
  - Ringkasan isi buku

initialLoans (peminjaman):

- id (string), contoh: "PJ-1001"
  - Kode peminjaman
- user_id (string), contoh: "U1"
  - Relasi ke initialUsers.id
- book_id (number), contoh: 1
  - Relasi ke initialBooks.id
- tgl_pinjam (string), contoh: "21 Okt 2026"
  - Tanggal pinjam (teks)
- batas_kembali (string), contoh: "28 Okt 2026"
  - Batas pengembalian (teks)
- tgl_kembali (string), contoh: ""
  - Tanggal kembali, kosong jika belum dikembalikan
- status (string), contoh: "Sedang Dipinjam"
  - Menunggu Persetujuan, Sedang Dipinjam, Terlambat, Menunggu Pengembalian, Selesai, Ditolak
- denda (number), contoh: 4000
  - Denda dalam rupiah (0 jika tidak ada)
- sudahDiperpanjang (boolean), contoh: false
  - true jika sudah pernah diperpanjang

initialReviews (ulasan):

- id (number), contoh: 1
  - ID ulasan
- user_id (string), contoh: "U3"
  - Relasi ke initialUsers.id
- book_id (number), contoh: 3
  - Relasi ke initialBooks.id
- peminjaman_id (string), contoh: "PJ-1005"
  - Relasi ke initialLoans.id
- rating (number), contoh: 5
  - Nilai 1 sampai 5
- komentar (string), contoh: "Alur ceritanya..."
  - Isi ulasan
- tanggal (string), contoh: "2 hari yang lalu"
  - Waktu ulasan (teks)

initialEvents (event):

- id (number), contoh: 1
  - ID event
- kode (string), contoh: "EV-2026-04"
  - Kode event
- judul (string), contoh: "Baca & Temui Penulis..."
  - Judul event
- pembicara (string), contoh: "Raka Pratama"
  - Nama pembicara
- tanggal (string), contoh: "Sabtu, 7 November 2026"
  - Tanggal pelaksanaan (teks)
- waktu (string), contoh: "14.00 - 16.30 WIB"
  - Jam pelaksanaan
- lokasi (string), contoh: "Ruang Baca Utama Lantai 2"
  - Tempat
- kategori (string), contoh: "Temu Penulis"
  - Salah satu dari eventCategories
- kuota (number), contoh: 50
  - Kapasitas peserta
- terdaftar (number), contoh: 2
  - Jumlah peserta terdaftar
- peserta (array of string), contoh: ["U1", "U2"]
  - ID pengguna yang mendaftar
- status (string), contoh: "Akan Datang"
  - "Akan Datang" atau "Selesai"
- deskripsi (string), contoh: "Diskusi langsung..."
  - Deskripsi lengkap
- deskripsiSingkat (string), contoh: "Diskusi santai..."
  - Deskripsi pendek untuk kartu
- cover_color (string), contoh: "bg-[145347]"
  - Class Tailwind warna sampul

availableGenres, bookCategories, dan eventCategories

- availableGenres[].id (string), contoh: "sastra-novel"
  - ID genre
- availableGenres[].nama (string), contoh: "Sastra & Novel"
  - Nama genre yang tampil
- availableGenres[].sub (string), contoh: "Novel, cerpen, antologi"
  - Keterangan singkat genre
- bookCategories[] (string), contoh: "Teknologi & IT"
  - Kategori buku; "Semua Kategori" dipakai sebagai filter
- eventCategories[] (string), contoh: "Workshop Literasi"
  - Kategori event

Contoh potongan JSON:

{
  "initialUsers": [
    {
      "id": "U1",
      "nama": "Budi Santoso",
      "email": "budi@gmail.com",
      "password": "password123",
      "role": "user",
      "avatarInitials": "BS",
      "genres": ["Sastra & Novel", "Teknologi & IT"]
    }
  ],
  "initialLoans": [
    {
      "id": "PJ-1001",
      "user_id": "U1",
      "book_id": 1,
      "tgl_pinjam": "21 Okt 2026",
      "batas_kembali": "28 Okt 2026",
      "tgl_kembali": "",
      "status": "Sedang Dipinjam",
      "denda": 0,
      "sudahDiperpanjang": false
    }
  ]
}


Relasi antar data:

text
initialLoans.user_id         ->  initialUsers.id
initialLoans.book_id         ->  initialBooks.id
initialReviews.user_id       ->  initialUsers.id
initialReviews.book_id       ->  initialBooks.id
initialReviews.peminjaman_id ->  initialLoans.id
initialEvents.peserta[]      ->  initialUsers.id

