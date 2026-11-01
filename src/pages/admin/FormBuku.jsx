import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import dummyData from '../../data/dummyData.json';

const { bookCategories } = dummyData;

const categoryOptions = bookCategories.filter((c) => c !== 'Semua Kategori');

export default function FormBuku({ books = [], onSaveBook }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const defaultForm = {
    kode: '',
    judul: '',
    penulis: '',
    tahun: new Date().getFullYear(),
    kategori: categoryOptions[0] || 'Sastra & Novel',
    rak: 'Rak A-01',
    bahasa: 'Indonesia',
    stok_total: 4,
    stok_tersedia: 4,
    cover_color: 'bg-[#135C4C]',
    halaman: 300,
    rating: 4.5,
    sinopsis: ''
  };

  const [formData, setFormData] = useState(defaultForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const existing = books.find(
        (b) => String(b.id) === String(id)
      );
      if (existing) {
        setFormData({
          ...defaultForm,
          ...existing,
          stok_total: Number(existing.stok_total),
          stok_tersedia: Number(existing.stok_tersedia),
          tahun: Number(existing.tahun),
          halaman: Number(existing.halaman || 300)
        });
      } else {
        setError('Buku yang ingin diedit tidak ditemukan.');
      }
    } else {
      const nextNum = String(books.length + 1).padStart(2, '0');
      setFormData((prev) => ({ ...prev, kode: `BK-${nextNum}` }));
    }
  }, [id, isEditMode]);

  function handleChange(e) {
    const { name, value } = e.target;
    const numericFields = ['tahun', 'stok_total', 'stok_tersedia', 'halaman', 'rating'];
    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!formData.judul.trim() || !formData.penulis.trim()) {
      setError('Judul buku dan penulis wajib diisi.');
      return;
    }
    if (formData.stok_tersedia > formData.stok_total) {
      setError('Stok tersedia tidak boleh melebihi stok total.');
      return;
    }

    const savedBook = {
      ...formData,
      id: isEditMode
        ? (isNaN(Number(id)) ? id : Number(id))   
        : books.length + 1,
      status: formData.stok_tersedia > 0 ? 'Tersedia' : 'Habis'
    };

    if (onSaveBook) {
      onSaveBook(savedBook, isEditMode);
    }
    navigate('/admin/buku');
  }

  const coverOptions = [
    { label: 'Forest Green', value: 'bg-[#135C4C]' },
    { label: 'Dark Teal', value: 'bg-[#1c5544]' },
    { label: 'Slate Gray', value: 'bg-[#354256]' },
    { label: 'Warm Brown', value: 'bg-[#983818]' },
    { label: 'Dark Navy', value: 'bg-[#495468]' },
    { label: 'Deep Sea', value: 'bg-[#146654]' }
  ];

  return (
    <main className="p-8 lg:p-10 max-w-3xl w-full">
      <div className="mb-6">
        <Link
          to="/admin/buku"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#1c5544] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Kelola Buku</span>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {isEditMode ? 'Edit Data Buku' : 'Formulir Data Buku'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {isEditMode
            ? 'Perbarui informasi buku yang sudah tersimpan.'
            : 'Masukkan informasi detail buku untuk dimasukkan ke dalam basis data perpustakaan.'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
          <h2 className="text-sm font-bold text-slate-800">Informasi Utama</h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="judul">
              Judul Buku <span className="text-rose-500">*</span>
            </label>
            <input
              id="judul"
              name="judul"
              type="text"
              required
              value={formData.judul}
              onChange={handleChange}
              placeholder="Contoh: Bumi dan Bintang"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1c5544] focus:ring-1 focus:ring-[#1c5544] focus:bg-white outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="penulis">
              Penulis <span className="text-rose-500">*</span>
            </label>
            <input
              id="penulis"
              name="penulis"
              type="text"
              required
              value={formData.penulis}
              onChange={handleChange}
              placeholder="Contoh: Raka Pratama"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1c5544] focus:ring-1 focus:ring-[#1c5544] focus:bg-white outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="stok_total">
                Jumlah Stok <span className="text-rose-500">*</span>
              </label>
              <input
                id="stok_total"
                name="stok_total"
                type="number"
                min={1}
                required
                value={formData.stok_total}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-[#1c5544] focus:ring-1 focus:ring-[#1c5544] focus:bg-white outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="tahun">
                Tahun Terbit <span className="text-rose-500">*</span>
              </label>
              <input
                id="tahun"
                name="tahun"
                type="number"
                min={1900}
                max={2099}
                required
                value={formData.tahun}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-[#1c5544] focus:ring-1 focus:ring-[#1c5544] focus:bg-white outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
          <h2 className="text-sm font-bold text-slate-800">Klasifikasi & Lokasi</h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="kategori">
              Kategori Buku <span className="text-rose-500">*</span>
            </label>
            <select
              id="kategori"
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-[#1c5544] focus:ring-1 focus:ring-[#1c5544] focus:bg-white outline-none transition appearance-none"
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="rak">
              Lokasi Rak Fisik <span className="text-rose-500">*</span>
            </label>
            <input
              id="rak"
              name="rak"
              type="text"
              required
              value={formData.rak}
              onChange={handleChange}
              placeholder="Contoh: Rak A-04"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1c5544] focus:ring-1 focus:ring-[#1c5544] focus:bg-white outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="bahasa">
              Bahasa <span className="text-rose-500">*</span>
            </label>
            <input
              id="bahasa"
              name="bahasa"
              type="text"
              required
              value={formData.bahasa}
              onChange={handleChange}
              placeholder="Contoh: Bahasa Indonesia"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1c5544] focus:ring-1 focus:ring-[#1c5544] focus:bg-white outline-none transition"
            />
          </div>

          <details className="group">
            <summary className="text-xs text-slate-500 cursor-pointer select-none hover:text-slate-700 font-medium">
              + Pengaturan Lanjutan (Warna Cover, Stok Tersedia, Jumlah Halaman)
            </summary>
            <div className="pt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="cover_color">
                  Warna Sampul
                </label>
                <select
                  id="cover_color"
                  name="cover_color"
                  value={formData.cover_color}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-[#1c5544] focus:ring-1 focus:ring-[#1c5544] outline-none"
                >
                  {coverOptions.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="stok_tersedia">
                    Stok Tersedia Saat Ini
                  </label>
                  <input
                    id="stok_tersedia"
                    name="stok_tersedia"
                    type="number"
                    min={0}
                    value={formData.stok_tersedia}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-[#1c5544] focus:ring-1 focus:ring-[#1c5544] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="halaman">
                    Jumlah Halaman
                  </label>
                  <input
                    id="halaman"
                    name="halaman"
                    type="number"
                    min={1}
                    value={formData.halaman}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-[#1c5544] focus:ring-1 focus:ring-[#1c5544] outline-none"
                  />
                </div>
              </div>
            </div>
          </details>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Sinopsis / Deskripsi</h2>
          <textarea
            id="sinopsis"
            name="sinopsis"
            rows={5}
            value={formData.sinopsis}
            onChange={handleChange}
            placeholder="Tuliskan ringkasan sinopsis singkat buku ini..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1c5544] focus:ring-1 focus:ring-[#1c5544] focus:bg-white outline-none transition resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/buku"
            className="flex-1 py-3 border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors text-center"
          >
            Batal / Kembali
          </Link>
          <button
            type="submit"
            className="flex-1 py-3 bg-[#1c5544] hover:bg-[#154336] text-white text-sm font-semibold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isEditMode ? 'Simpan Perubahan' : 'Simpan Buku'}</span>
          </button>
        </div>
      </form>
    </main>
  );
}
