import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import dummyData from '../../data/dummyData.json';
const { availableGenres } = dummyData;

export default function Onboarding({ currentUser, onUpdatePreferences }) {
  const [selectedGenres, setSelectedGenres] = useState(
    currentUser?.genres && currentUser.genres.length > 0
      ? currentUser.genres
      : ['fiksi-sastra', 'teknologi-it', 'sejarah-budaya']
  );

  const navigate = useNavigate();

  function toggleGenre(genreId) {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter((id) => id !== genreId));
    } else {
      setSelectedGenres([...selectedGenres, genreId]);
    }
  }

  function handleSave() {
    if (onUpdatePreferences && currentUser) {
      onUpdatePreferences(selectedGenres);
    }
    navigate('/');
  }

  function handleSkip() {
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-[#eff6f5] font-sans antialiased text-slate-800 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-10">
        <header className="text-center max-w-xl mb-10 px-4">
          <h1 className="text-3xl md:text-[34px] font-bold text-[#114D43] tracking-tight mb-3">
            Pilih Preferensi Bukumu
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Pilih minimal 3 genre favorit untuk mendapatkan rekomendasi buku terpersonalisasi di berandamu.
          </p>
        </header>

        <section className="w-full max-w-[860px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {availableGenres.map((genre) => {
            const isSelected = selectedGenres.includes(genre.id) || selectedGenres.includes(genre.nama);
            return (
              <div
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                className={`relative flex flex-col justify-between p-5 rounded-2xl cursor-pointer transition-all duration-200 select-none ${
                  isSelected
                    ? 'bg-[#114D43] text-white shadow-sm ring-1 ring-[#114D43]'
                    : 'bg-white text-slate-800 shadow-sm border border-slate-100 hover:border-slate-200'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mb-6 transition-colors ${
                    isSelected
                      ? 'border border-white/40 bg-white/10'
                      : 'border border-slate-300 bg-transparent'
                  }`}
                >
                  <Check
                    className={`w-3.5 h-3.5 ${
                      isSelected ? 'text-white stroke-[2.5]' : 'text-transparent'
                    }`}
                  />
                </div>

                <div>
                  <h2
                    className={`font-bold text-[15px] leading-snug mb-1 ${
                      isSelected ? 'text-white' : 'text-[#114D43]'
                    }`}
                  >
                    {genre.nama}
                  </h2>
                  <p
                    className={`text-xs font-normal ${
                      isSelected ? 'text-white/70' : 'text-slate-500'
                    }`}
                  >
                    {genre.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        <nav aria-label="Aksi Onboarding" className="flex items-center gap-6">
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors py-2.5 px-3"
          >
            Lewati Sementara
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 bg-[#114D43] hover:bg-[#0c3831] text-white text-sm font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-sm shadow-[#114D43]/20"
          >
            <span>Simpan & Lanjutkan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </nav>
      </main>
    </div>
  );
}

