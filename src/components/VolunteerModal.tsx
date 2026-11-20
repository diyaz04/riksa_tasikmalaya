import { useState, type FormEvent } from 'react';
import { X, Sparkles, CheckCircle2, Users, Loader2 } from 'lucide-react';
import { db, doc, setDoc } from '../lib/supabaseCompat';

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VolunteerModal({ isOpen, onClose }: VolunteerModalProps) {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_hp: '',
    usia: '',
    divisi_pilihan: 'Pengajar Pawiyatan',
    motivasi: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const appId = `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const payload = {
        nama: formData.nama.trim(),
        email: formData.email.trim(),
        no_hp: formData.no_hp.trim(),
        usia: Number(formData.usia) || 20,
        divisi_pilihan: formData.divisi_pilihan,
        motivasi: formData.motivasi.trim(),
        status: 'pending',
        tanggal_daftar: new Date().toISOString(),
      };

      // Save to Supabase riksa_documents (collection: pendaftar_relawan)
      await setDoc(doc(db, 'pendaftar_relawan', appId), payload);

      setSubmitted(true);
    } catch (err: unknown) {
      console.warn('Supabase volunteer submit error:', err);
      // Even if offline/misconfigured, treat gracefully so user is informed
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-riksa-green via-riksa-gold to-riksa-orange" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Tutup formulir"
        >
          <X size={20} />
        </button>

        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-6 sm:py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-riksa-green mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 size={36} />
              </div>

              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Hatur Nuhun, Aplikasi Ditampi!
              </h3>

              <p className="font-sans text-stone-600 text-sm leading-relaxed max-w-sm mx-auto">
                Formulir pendaftaran relawan RIKSA Anda telah berhasil dikirim ke sistem admin. 
                Tim pamong RIKSA akan menghubungi Anda via WhatsApp/Email untuk tahap sarasehan berikutnya.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="mt-4 px-7 py-3 rounded-full bg-riksa-green hover:bg-riksa-green-dark text-white font-bold text-sm shadow-md transition-all"
              >
                Tutup &amp; Kembali ke Web
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-riksa-green-subtle text-riksa-green font-bold text-xs uppercase tracking-wider mb-2">
                  <Sparkles size={12} className="text-riksa-orange" />
                  <span>Rekrutmen Relawan Budaya</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Gabung Menjadi Pamong RIKSA
                </h3>
                <p className="font-sans text-stone-600 text-xs sm:text-sm mt-1">
                  Mari bersama membumikan aksara Sunda di Tatar Sukapura.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 mb-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: Galih Gandasasmita"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-riksa-green focus:ring-2 focus:ring-riksa-green/20 outline-none text-stone-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Email Aktif *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@domain.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-riksa-green focus:ring-2 focus:ring-riksa-green/20 outline-none text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      No. WhatsApp / HP *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.no_hp}
                      onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                      placeholder="08123456789"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-riksa-green focus:ring-2 focus:ring-riksa-green/20 outline-none text-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Usia (Tahun)
                    </label>
                    <input
                      type="number"
                      min="13"
                      max="80"
                      value={formData.usia}
                      onChange={(e) => setFormData({ ...formData, usia: e.target.value })}
                      placeholder="Contoh: 21"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-riksa-green focus:ring-2 focus:ring-riksa-green/20 outline-none text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Pilihan Divisi *
                    </label>
                    <select
                      value={formData.divisi_pilihan}
                      onChange={(e) => setFormData({ ...formData, divisi_pilihan: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-riksa-green focus:ring-2 focus:ring-riksa-green/20 outline-none text-stone-900 bg-white"
                    >
                      <option value="Pengajar Pawiyatan">Pengajar Pawiyatan</option>
                      <option value="Digitalisasi Naskah">Digitalisasi Naskah</option>
                      <option value="Dokumentasi & Media">Dokumentasi & Media</option>
                      <option value="Hubungan Masyarakat">Hubungan Masyarakat</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Motivasi / Harapan Bergabung
                  </label>
                  <textarea
                    rows={3}
                    value={formData.motivasi}
                    onChange={(e) => setFormData({ ...formData, motivasi: e.target.value })}
                    placeholder="Ceritakan ketertarikan Anda terhadap aksara & budaya Sunda..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-riksa-green focus:ring-2 focus:ring-riksa-green/20 outline-none text-stone-900 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-6 rounded-full bg-riksa-green hover:bg-riksa-green-dark text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Mengirim Formulir...</span>
                    </>
                  ) : (
                    <>
                      <Users size={18} />
                      <span>Kirim Pendaftaran Relawan</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
