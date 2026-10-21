# Sharing Vision Frontend - Article Dashboard & Blog

Aplikasi frontend modern untuk manajemen artikel dan blog publik sesuai spesifikasi teknis **Tes Frontend Sharing Vision 2023**. Dibangun menggunakan **React 18**, **Vite**, **Lucide Icons**, dan **Axios**.

---

## 🌟 Fitur Utama & Kepatuhan Soal

### 1. Halaman "All Posts" (Bobot 40%)
- **Sistem Tab Dinamis**:
  - Tab **Published**: Menampilkan artikel yang sudah dipublikasikan ke publik.
  - Tab **Drafts**: Menampilkan artikel yang disimpan sebagai rancangan (draft).
  - Tab **Trashed**: Menampilkan artikel yang telah dipindahkan ke tempat sampah.
- **Tabel Responsif**:
  - Kolom: `Title` (beserta excerpt ringkas), `Category`, dan `Action`.
- **Aksi Artikel**:
  - **Icon Edit**: Mengarahkan ke form edit artikel dengan data yang terisi otomatis.
  - **Icon Thrash**: Memindahkan artikel langsung ke tab Trashed (memperbarui status menjadi `"thrash"`).
  - **Fitur Tambahan (Tab Trashed)**: Opsi untuk memulihkan (*restore*) artikel kembali ke status *Publish* atau menghapusnya secara permanen dari database.
- **Pencarian Real-time**: Memfilter artikel berdasarkan judul, kategori, atau isi konten secara instan.

### 2. Halaman "Add New" (Bobot 20%)
- Form input terstruktur:
  - **Title**: Dilengkapi live validator (Wajib diisi, minimal 20 karakter).
  - **Category**: Live validator (Wajib diisi, minimal 3 karakter).
  - **Content**: Live validator (Wajib diisi, minimal 200 karakter).
- Tombol Aksi:
  - **Tombol "Publish"**: Menyimpan artikel dengan status `"publish"`.
  - **Tombol "Draft"**: Menyimpan artikel dengan status `"draft"`.

### 3. Halaman "Edit Article" (Bobot 20%)
- Form mengimpor detail artikel berdasarkan ID.
- Memungkinkan perubahan Title, Category, dan Content.
- Menyediakan tombol **"Publish"** dan **"Draft"** untuk memperbarui status dan isi artikel.

### 4. Halaman "Preview" (Bobot 20%)
- Menampilkan seluruh artikel dengan status **"Publish"** dalam tata letak kartu blog (*grid layout*) yang elegan.
- Dilengkapi **Pagination** (Sebelumnya / Selanjutnya) yang terintegrasi langsung dengan parameter limit & offset backend.
- Dilengkapi modal interaktif (*Article Reader*) saat kartu diklik untuk membaca isi artikel secara penuh.

---

## 🛠️ Prasyarat Sistem

- **Node.js**: Versi 18+ atau 20+
- **NPM**: Versi 9+
- **Backend Golang**: Berjalan pada `http://localhost:8080`

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Masuk ke Direktori Frontend
```bash
cd frontend
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment (`.env`)
Salin file `.env.example` ke `.env`:
```bash
cp .env.example .env
```
Isi konfigurasi (arahkan ke URL backend Anda):
```env
VITE_API_BASE_URL=http://localhost:8080
```

### 4. Menjalankan Server Development
```bash
npm run dev
```
Buka browser Anda di: **`http://localhost:5173`**

### 5. Build untuk Produksi
```bash
npm run build
```
Hasil build siap deploy akan berada di dalam folder `dist/`.

---

## 🌐 Panduan Deploy ke Hosting Gratis (Vercel)

1. Buat repository baru di GitHub untuk frontend, lalu push kode:
   ```bash
   git remote add origin https://github.com/<username>/<frontend-repo>.git
   git push -u origin master
   ```
2. Buka [Vercel](https://vercel.com/) dan login menggunakan akun GitHub Anda.
3. Klik **Add New Project** $\rightarrow$ Pilih repository frontend Anda.
4. Pada bagian **Environment Variables**, tambahkan:
   - `VITE_API_BASE_URL`: URL Backend Golang yang telah di-deploy (misalnya dari Render/Railway).
5. Klik **Deploy**. Website frontend Anda akan langsung aktif dengan domain `.vercel.app`.
