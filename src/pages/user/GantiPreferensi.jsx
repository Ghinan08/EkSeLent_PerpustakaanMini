import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, BookmarkCheck } from 'lucide-react';
import dummyData from '../../data/dummyData.json';

const { availableGenres } = dummyData;

export default function GantiPreferensi({ currentUser, onUpdatePreferences }) {
  const navigate = useNavigate();

  const [selectedGenres, setSelectedGenres] = useState(
    currentUser?.genres && currentUser.genres.length > 0
      ? currentUser.genres
      : []
  );

  function toggleGenre(genre) {
    const isSelected =
      selectedGenres.includes(genre.nama) || selectedGenres.includes(genre.id);

    if (isSelected) {
      setSelectedGenres(
        selectedGenres.filter((g) => g !== genre.nama && g !== genre.id)
      );
    } else {
      setSelectedGenres([...selectedGenres, genre.nama]);
    }
  }

  function handleSave() {
    if (onUpdatePreferences && currentUser) {
      onUpdatePreferences(selectedGenres);
    }
    alert('Preferensi minat baca Anda berhasil disimpan!');
    navigate('/');
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Ganti Preferensi Minat Baca
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pilih genre buku yang Anda minati. Sistem akan menyesuaikan buku rekomendasi di beranda Anda sesuai dengan preferensi yang dipilih.
          </p>
        </div>

      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {availableGenres.map((genre) => {
          const isSelected =
            selectedGenres.includes(genre.id) || selectedGenres.includes(genre.nama);

          return (
            <div
              key={genre.id}
              onClick={() => toggleGenre(genre)}
              className={`relative flex flex-col justify-between p-5 rounded-2xl cursor-pointer transition-all duration-200 select-none ${isSelected
                  ? 'bg-[#114D43] text-white shadow-sm ring-1 ring-[#114D43]'
                  : 'bg-white text-slate-800 shadow-sm border border-slate-100 hover:border-slate-300'
                }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center mb-6 transition-colors ${isSelected
                    ? 'border border-white/40 bg-white/10'
                    : 'border border-slate-300 bg-transparent'
                  }`}
              >
                <Check
                  className={`w-3.5 h-3.5 ${isSelected ? 'text-white stroke-[2.5]' : 'text-transparent'
                    }`}
                />
              </div>

              <div>
                <h2
                  className={`font-bold text-[15px] leading-snug mb-1 ${isSelected ? 'text-white' : 'text-[#114D43]'
                    }`}
                >
                  {genre.nama}
                </h2>
                <p
                  className={`text-xs font-normal ${isSelected ? 'text-white/70' : 'text-slate-500'
                    }`}
                >
                  {genre.sub}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-colors"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-[#114D43] hover:bg-[#0c3831] text-white text-sm font-semibold transition-colors shadow-xs"
        >
          Simpan Preferensi
        </button>
      </div>
    </div>
  );
}

