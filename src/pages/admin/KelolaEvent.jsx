import React, { useState } from 'react';
import { Plus, Calendar, Clock, MapPin, Users, Edit3, Trash2 } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import dummyData from '../../data/dummyData.json';

const { eventCategories } = dummyData;

export default function KelolaEvent({ events = [], users = [], onSaveEvent, onDeleteEvent }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [participantsModal, setParticipantsModal] = useState({ open: false, event: null });
  const [eventToEdit, setEventToEdit] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);

  const initialFormState = {
    judul: '',
    pembicara: '',
    tanggal: '',
    waktu: '',
    lokasi: '',
    kuota: 50,
    terdaftar: 0,
    peserta: [],
    kategori: eventCategories[0] || 'Temu Penulis',
    status: 'Akan Datang',
    deskripsi: '',
    deskripsiSingkat: '',
    cover_color: 'bg-[#145347]'
  };

  const [formData, setFormData] = useState(initialFormState);

  function handleOpenCreate() {
    setEventToEdit(null);
    setFormData(initialFormState);
    setModalOpen(true);
  }

  function handleOpenEdit(ev) {
    setEventToEdit(ev);
    setFormData({
      ...initialFormState,
      ...ev
    });
    setModalOpen(true);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'kuota' || name === 'terdaftar'
          ? Number(value)
          : value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.judul.trim()) return;

    const saved = {
      ...formData,
      id: eventToEdit
        ? eventToEdit.id
        : events.length + 1,
      kode: eventToEdit
        ? eventToEdit.kode
        : `EV-${new Date().getFullYear()}-${String(events.length + 1).padStart(2, '0')}`,
      peserta: eventToEdit ? (eventToEdit.peserta || []) : []
    };

    if (onSaveEvent) {
      onSaveEvent(saved, Boolean(eventToEdit));
    }
    setModalOpen(false);
  }

  function handleDeleteConfirm() {
    if (eventToDelete && onDeleteEvent) {
      onDeleteEvent(eventToDelete.id);
      setDeleteModalOpen(false);
      setEventToDelete(null);
    }
  }

  function handleShowParticipants(ev) {
    setParticipantsModal({ open: true, event: ev });
  }

  const upcomingEvents = events.filter((e) => e.status !== 'Selesai');
  const doneEvents = events.filter((e) => e.status === 'Selesai');

  return (
    <main className="p-8 lg:p-10 max-w-7xl w-full">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase mb-1">
            Kegiatan & Komunitas
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Kelola Event Perpustakaan
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Atur jadwal bedah buku, workshop literasi, dan sesi temu penulis.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 bg-[#1c5544] hover:bg-[#154336] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Buat Event Baru</span>
        </button>
      </header>

      {upcomingEvents.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Akan Datang ({upcomingEvents.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((ev) => (
              <EventCard
                key={ev.id}
                ev={ev}
                onEdit={() => handleOpenEdit(ev)}
                onDelete={() => {
                  setEventToDelete(ev);
                  setDeleteModalOpen(true);
                }}
                onShowParticipants={() => handleShowParticipants(ev)}
              />
            ))}
          </div>
        </section>
      )}

      {doneEvents.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Sudah Selesai ({doneEvents.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
            {doneEvents.map((ev) => (
              <EventCard
                key={ev.id}
                ev={ev}
                onEdit={() => handleOpenEdit(ev)}
                onDelete={() => {
                  setEventToDelete(ev);
                  setDeleteModalOpen(true);
                }}
                onShowParticipants={() => handleShowParticipants(ev)}
              />
            ))}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <div className="text-center py-20 text-slate-400 text-sm">
          Belum ada event. Klik "Buat Event Baru" untuk menambahkan.
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={eventToEdit ? 'Edit Data Event' : 'Formulir Event Baru'}
        maxWidth="max-w-lg"
      >
        <p className="text-xs text-slate-500 mb-5 -mt-1">
          Masukkan informasi detail event atau kegiatan literasi untuk dipublikasikan ke agenda perpustakaan.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="bg-slate-50 rounded-xl p-4 space-y-4 border border-slate-100">
            <h3 className="text-xs font-bold text-slate-700">Informasi Utama</h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5" htmlFor="judul">
                Nama / Judul Event <span className="text-rose-500">*</span>
              </label>
              <input
                id="judul"
                name="judul"
                type="text"
                required
                value={formData.judul}
                onChange={handleChange}
                placeholder="cth. Bedah Buku & Diskusi Literasi Kreatif"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1c5544] focus:ring-1 focus:ring-[#1c5544] outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5" htmlFor="pembicara">
                Pembicara / Narasumber <span className="text-rose-500">*</span>
              </label>
              <input
                id="pembicara"
                name="pembicara"
                type="text"
                required
                value={formData.pembicara}
                onChange={handleChange}
                placeholder="cth. Dr. Maya Kusuma"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1c5544] focus:ring-1 focus:ring-[#1c5544] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5" htmlFor="kategori">
                  Kategori Event <span className="text-rose-500">*</span>
                </label>
                <select
                  id="kategori"
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 focus:border-[#1c5544] focus:ring-1 focus:ring-[#1c5544] outline-none"
                >
                  {eventCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5" htmlFor="kuota">
                  Kuota <span className="text-rose-500">*</span>
                </label>
                <input
                  id="kuota"
                  name="kuota"
                  type="number"
                  min={1}
                  required
                  value={formData.kuota}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 focus:border-[#1c5544] focus:ring-1 focus:ring-[#1c5544] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-4 border border-slate-100">
            <h3 className="text-xs font-bold text-slate-700">Jadwal & Lokasi Pelaksanaan</h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5" htmlFor="tanggal">
                Tanggal Pelaksanaan <span className="text-rose-500">*</span>
              </label>
              <input
                id="tanggal"
                name="tanggal"
                type="text"
                required
                value={formData.tanggal}
                onChange={handleChange}
                placeholder="cth. Sabtu, 28 Nov 2026"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1c5544] focus:ring-1 focus:ring-[#1c5544] outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5" htmlFor="waktu">
                Waktu Pelaksanaan <span className="text-rose-500">*</span>
              </label>
              <input
                id="waktu"
                name="waktu"
                type="text"
                required
                value={formData.waktu}
                onChange={handleChange}
                placeholder="cth. 10.00 - 12.00 WIB"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1c5544] focus:ring-1 focus:ring-[#1c5544] outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5" htmlFor="lokasi">
                Lokasi Ruangan <span className="text-rose-500">*</span>
              </label>
              <input
                id="lokasi"
                name="lokasi"
                type="text"
                required
                value={formData.lokasi}
                onChange={handleChange}
                placeholder="cth. Ruang Baca Utama"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1c5544] focus:ring-1 focus:ring-[#1c5544] outline-none"
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 mb-3">Deskripsi Event</h3>
            <textarea
              id="deskripsi"
              name="deskripsi"
              rows={4}
              value={formData.deskripsi}
              onChange={handleChange}
              placeholder="Tuliskan ringkasan agenda atau deskripsi acara..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1c5544] focus:ring-1 focus:ring-[#1c5544] outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#1c5544] hover:bg-[#154336] text-white font-semibold rounded-xl shadow-xs text-xs transition"
            >
              {eventToEdit ? 'Simpan Perubahan' : 'Simpan Event'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={participantsModal.open}
        onClose={() => setParticipantsModal({ open: false, event: null })}
        title={`Daftar Peserta: ${participantsModal.event?.judul || ''}`}
        maxWidth="max-w-2xl"
      >
        <div className="py-2 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl mb-4 text-slate-700 border border-slate-100">
            <span>
              Total Terdaftar: <strong>{participantsModal.event?.peserta?.length || 0}</strong> dari kuota {participantsModal.event?.kuota}
            </span>
            <span>
              Kategori: <strong>{participantsModal.event?.kategori}</strong>
            </span>
          </div>

          {(!participantsModal.event?.peserta || participantsModal.event.peserta.length === 0) ? (
            <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p>Belum ada peserta yang mendaftar pada kegiatan ini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase">
                    <th className="py-2.5 px-3 w-12 text-center">No</th>
                    <th className="py-2.5 px-4">Nama Peserta</th>
                    <th className="py-2.5 px-4">Email</th>
                    <th className="py-2.5 px-4">ID Anggota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {participantsModal.event.peserta.map((uid, idx) => {
                    const u = users.find((user) => user.id === uid) || { nama: `Peserta (${uid})`, email: '-', id: uid };
                    return (
                      <tr key={uid + idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 text-center text-slate-400 font-medium">{idx + 1}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{u.nama}</td>
                        <td className="py-3 px-4 text-slate-600">{u.email}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{u.id}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end pt-5 mt-2">
            <button
              type="button"
              onClick={() => setParticipantsModal({ open: false, event: null })}
              className="px-5 py-2 bg-[#1c5544] hover:bg-[#154336] text-white rounded-lg font-semibold text-xs transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Hapus Event"
      >
        <div className="py-2">
          <p className="text-xs text-slate-600 mb-6">
            Apakah Anda yakin ingin menghapus agenda <strong>"{eventToDelete?.judul}"</strong>?
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg"
            >
              Hapus Event
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}

function EventCard({ ev, onEdit, onDelete, onShowParticipants }) {
  return (
    <article className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow relative">
      {ev.status === 'Selesai' && (
        <span className="absolute top-4 left-4 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
          Selesai
        </span>
      )}

      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded block w-fit mb-3 mt-1">
          {ev.kategori}
        </span>

        <h3 className="font-bold text-slate-900 text-base leading-snug mb-2">
          {ev.judul}
        </h3>

        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {ev.deskripsi}
        </p>

        <div className="space-y-2 text-xs text-slate-600 mb-6 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{ev.tanggal}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{ev.waktu}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{ev.lokasi}</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Peserta: <strong>{ev.peserta?.length || ev.terdaftar || 0}</strong> / {ev.kuota}
              </span>
            </div>
            <button
              type="button"
              onClick={onShowParticipants}
              className="text-[11px] font-bold text-[#1c5544] hover:underline bg-emerald-50 px-2.5 py-1 rounded-md"
            >
              Lihat Peserta
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-[11px] font-medium text-slate-400 truncate pr-2">
          {ev.pembicara}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onEdit}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            title="Edit Event"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
            title="Hapus Event"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
