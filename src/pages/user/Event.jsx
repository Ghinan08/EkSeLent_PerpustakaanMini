import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, User, CheckCircle, Ticket } from 'lucide-react';
import Modal from '../../components/ui/Modal';

export default function Event({ events = [], onRegisterEvent, currentUser }) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const featuredEvent = events[0];
  const otherEvents = events;

  const categories = ['Semua', 'Temu Penulis', 'Workshop Literasi', 'Klub Buku Senja', 'Pelatihan Menulis'];

  const filteredOtherEvents = otherEvents.filter((ev) => {
    if (selectedCategory === 'Semua') return true;
    return ev.kategori === selectedCategory;
  });

  function handleOpenRegister(eventItem) {
    if (!currentUser) {
      alert('Silakan masuk ke akun terlebih dahulu untuk mendaftar event.');
      return;
    }
    if (eventItem.peserta?.includes(currentUser.id)) {
      alert('Anda sudah terdaftar pada kegiatan ini.');
      return;
    }
    setSelectedEvent(eventItem);
    setRegisteredSuccess(false);
    setRegisterModalOpen(true);
  }

  function handleConfirmRegister() {
    if (onRegisterEvent && selectedEvent && currentUser) {
      onRegisterEvent(selectedEvent.id, currentUser.id);
      setRegisteredSuccess(true);
    }
  }

  const isFeaturedRegistered = Boolean(currentUser && featuredEvent?.peserta?.includes(currentUser.id));
  const isFeaturedFull = Boolean(featuredEvent && (featuredEvent.peserta?.length || featuredEvent.terdaftar || 0) >= featuredEvent.kuota);

  return (
    <div className="max-w-7xl w-full mx-auto px-6 lg:px-12 py-10">
      <section className="mb-8" data-purpose="page-title-section">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-[#145347] uppercase mb-2">
          <Calendar className="w-4 h-4" />
          <span>Agenda Komunitas</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2.5">
          Event & Kegiatan Perpustakaan
        </h1>
        <p className="text-slate-600 text-base">
          Ikuti diskusi buku, workshop literasi, dan sesi temu penulis di Perpustakaan Mini.
        </p>
      </section>

      {featuredEvent && (
        <section className="mb-14" data-purpose="featured-event">
          <div className="relative w-full rounded-2xl bg-[#145347] text-white p-8 lg:p-11 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3d7065] bg-opacity-70 text-amber-200 text-xs font-semibold tracking-wider uppercase mb-5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>Event Mendatang</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-white">
                  {featuredEvent.judul}
                </h2>
                <p className="text-emerald-50 text-[15px] leading-relaxed max-w-2xl opacity-90">
                  {featuredEvent.deskripsi}
                </p>
              </div>

              <div className="shrink-0 self-start lg:self-center">
                {isFeaturedRegistered ? (
                  <button
                    type="button"
                    disabled
                    className="inline-block bg-white/20 text-white/80 cursor-not-allowed font-semibold text-base px-8 py-3.5 rounded-xl border border-white/20 text-center"
                  >
                    Sudah Terdaftar
                  </button>
                ) : isFeaturedFull ? (
                  <button
                    type="button"
                    disabled
                    className="inline-block bg-white/20 text-white/80 cursor-not-allowed font-semibold text-base px-8 py-3.5 rounded-xl border border-white/20 text-center"
                  >
                    Kuota Penuh
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenRegister(featuredEvent)}
                    className="inline-block bg-[#f97316] hover:bg-[#ea580c] transition-colors text-white font-semibold text-base px-8 py-3.5 rounded-xl shadow-md text-center"
                  >
                    Daftar event
                  </button>
                )}
              </div>
            </div>

            <div className="mt-8 pt-2">
              <div className="inline-flex flex-wrap items-center gap-x-5 gap-y-2 bg-[#1b5d51] px-5 py-2.5 rounded-lg text-sm text-emerald-100 border border-emerald-700/50">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-200" />
                  <span>{featuredEvent.tanggal}</span>
                </div>
                <span className="text-emerald-400 hidden sm:inline">•</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-200" />
                  <span>{featuredEvent.waktu}</span>
                </div>
                <span className="text-emerald-400 hidden sm:inline">•</span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-200" />
                  <span>{featuredEvent.lokasi}</span>
                </div>
                <span className="text-emerald-400 hidden sm:inline">•</span>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-200" />
                  <span>{featuredEvent.peserta?.length || featuredEvent.terdaftar || 0} / {featuredEvent.kuota} Kursi Terisi</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section data-purpose="other-events-schedule">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Jadwal Acara Lainnya
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Temukan agenda literasi lain yang cocok untukmu
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#145347] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOtherEvents.map((ev) => {
            const isRegistered = Boolean(currentUser && ev.peserta?.includes(currentUser.id));
            const isFull = Boolean((ev.peserta?.length || ev.terdaftar || 0) >= ev.kuota);

            return (
              <article
                key={ev.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold tracking-wider text-slate-600 uppercase bg-slate-100 px-3 py-1 rounded">
                      {ev.kategori}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#145347]">
                      <span className="w-2 h-2 rounded-full bg-[#145347]"></span>
                      {isFull ? 'Penuh' : 'Tersedia'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-4 leading-snug">
                    {ev.judul}
                  </h3>

                  <ul className="space-y-2.5 text-sm text-slate-600 mb-6">
                    <li className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        Pembicara: <strong className="font-semibold text-slate-800">{ev.pembicara}</strong>
                      </span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{ev.tanggal} • {ev.waktu}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{ev.lokasi}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        Terdaftar: {ev.peserta?.length || ev.terdaftar || 0} / {ev.kuota} kursi
                      </span>
                    </li>
                  </ul>
                </div>

                {isRegistered ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 px-4 rounded-xl bg-slate-100 text-slate-400 font-semibold text-sm cursor-not-allowed"
                  >
                    Sudah Terdaftar
                  </button>
                ) : isFull ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 px-4 rounded-xl bg-slate-100 text-slate-400 font-semibold text-sm cursor-not-allowed"
                  >
                    Kuota Penuh
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenRegister(ev)}
                    className="w-full py-3 px-4 rounded-xl bg-[#eaf5f2] hover:bg-[#d8ece7] text-[#145347] font-semibold text-sm transition-colors"
                  >
                    Daftar Event
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <Modal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        title="Pendaftaran Event Perpustakaan"
      >
        {selectedEvent && (
          <div className="space-y-4">
            {registeredSuccess ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">
                  Pendaftaran Berhasil!
                </h4>
                <p className="text-xs text-slate-500 mb-6">
                  Tiket kehadiran atas nama <strong>{currentUser?.nama || 'Pengguna'}</strong> telah dikonfirmasi untuk event <strong>{selectedEvent.judul}</strong>. Silakan hadir tepat waktu di lokasi kegiatan.
                </p>
                <button
                  type="button"
                  onClick={() => setRegisterModalOpen(false)}
                  className="px-6 py-2.5 bg-[#145347] text-white text-xs font-semibold rounded-lg"
                >
                  Selesai
                </button>
              </div>
            ) : (
              <div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mb-4">
                  <h4 className="font-bold text-sm text-slate-800">{selectedEvent.judul}</h4>
                  <p className="text-xs text-slate-500 mt-1">{selectedEvent.tanggal} • {selectedEvent.waktu}</p>
                  <p className="text-xs text-slate-500">{selectedEvent.lokasi}</p>
                </div>

                <div className="space-y-2 text-xs text-slate-600 mb-6">
                  <p><strong>Nama Pendaftar:</strong> {currentUser?.nama || 'Belum Login'}</p>
                  <p><strong>Email:</strong> {currentUser?.email || '-'}</p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setRegisterModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmRegister}
                    className="px-5 py-2 bg-[#145347] hover:bg-[#0f3c34] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Konfirmasi Pendaftaran</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
