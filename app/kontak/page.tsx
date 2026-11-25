"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { sendContactMessage } from "@/lib/api";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Ticket,
} from "lucide-react";

export default function KontakPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [subjek, setSubjek] = useState("");
  const [pesan, setPesan] = useState("");
  const [sedangKirim, setSedangKirim] = useState(false);
  const [statusKirim, setStatusKirim] = useState<{
    tipe: "sukses" | "error";
    teks: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSedangKirim(true);
    setStatusKirim(null);

    try {
      const res = await sendContactMessage({
        nama: nama.trim(),
        email: email.trim(),
        telepon: telepon.trim() || undefined,
        subjek: subjek.trim(),
        pesan: pesan.trim(),
      });

      setStatusKirim({
        tipe: "sukses",
        teks:
          res.message ||
          "Pesan berhasil dikirim, tim kami akan segera menghubungi Anda",
      });
      setNama("");
      setEmail("");
      setTelepon("");
      setSubjek("");
      setPesan("");
    } catch (err) {
      setStatusKirim({
        tipe: "error",
        teks:
          err instanceof Error
            ? err.message
            : "Gagal mengirim pesan, silakan coba beberapa saat lagi",
      });
    } finally {
      setSedangKirim(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B2528] text-[#F5F3ED]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 md:px-16 pt-36 pb-24">
        <div className="max-w-2xl mb-14 space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[#C6A878]">
            Layanan Concierge Jelvanta
          </p>
          <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-normal leading-tight">
            Rencanakan Perjalanan Anda Bersama Kami
          </h1>
          <p className="text-sm sm:text-base text-[#F5F3ED]/75 leading-relaxed">
            Punya pertanyaan seputar jadwal keberangkatan, permintaan private trip khusus, atau kolaborasi perjalanan grup? Kirim pesan langsung melalui formulir di bawah ini.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-3xl bg-[#0F3135] border border-[#537C78]/35 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#C6A878]/15 border border-[#C6A878]/35 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#C6A878]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#F5F3ED]/50">
                    Telepon & WhatsApp
                  </p>
                  <a
                    href="tel:+6281290008899"
                    className="text-sm font-semibold text-[#F5F3ED] hover:text-[#C6A878] transition-colors"
                  >
                    +62 812 9000 8899
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#C6A878]/15 border border-[#C6A878]/35 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#C6A878]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#F5F3ED]/50">
                    Email Resmi
                  </p>
                  <p className="text-sm font-semibold text-[#F5F3ED]">
                    concierge@jelvanta.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#C6A878]/15 border border-[#C6A878]/35 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#C6A878]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#F5F3ED]/50">
                    Kantor Operasional
                  </p>
                  <p className="text-sm text-[#F5F3ED]/85 leading-relaxed">
                    Kemang Raya, Jakarta Selatan, Indonesia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#C6A878]/15 border border-[#C6A878]/35 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#C6A878]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#F5F3ED]/50">
                    Jam Operasional
                  </p>
                  <p className="text-sm text-[#F5F3ED]/85">
                    Senin sampai Minggu, 08.00 hingga 21.00 WIB
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#0F3135] border border-[#C6A878]/35 space-y-3">
              <p className="text-xs uppercase tracking-wider text-[#C6A878]">
                Sudah Memiliki Reservasi?
              </p>
              <p className="text-xs text-[#F5F3ED]/75 leading-relaxed">
                Pantau status verifikasi pembayaran dan detail e-tiket Anda secara langsung menggunakan kode booking.
              </p>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#C6A878] text-[#C6A878] text-xs font-bold uppercase tracking-wider hover:bg-[#C6A878] hover:text-[#0B2528] transition-all"
              >
                <Ticket className="w-4 h-4" />
                Lacak Status Pesanan
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="p-7 sm:p-10 rounded-3xl bg-[#0F3135] border border-[#C6A878]/40 shadow-2xl space-y-5"
            >
              <div className="space-y-1">
                <h2 className="font-editorial text-2xl sm:text-3xl font-normal">
                  Kirim Pesan Langsung
                </h2>
                <p className="text-xs text-[#F5F3ED]/60">
                  Tim perancang perjalanan kami akan membalas pesan Anda secepat mungkin.
                </p>
              </div>

              {statusKirim && (
                <div
                  className={`p-4 rounded-xl border text-xs flex items-start gap-2.5 ${
                    statusKirim.tipe === "sukses"
                      ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-200"
                      : "bg-red-500/15 border-red-400/40 text-red-200"
                  }`}
                >
                  {statusKirim.tipe === "sukses" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-300" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-300" />
                  )}
                  <span>{statusKirim.teks}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#F5F3ED]/80 mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Anda"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] placeholder:text-[#F5F3ED]/35 focus:outline-none focus:border-[#C6A878]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#F5F3ED]/80 mb-1.5">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] placeholder:text-[#F5F3ED]/35 focus:outline-none focus:border-[#C6A878]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#F5F3ED]/80 mb-1.5">
                    Nomor WhatsApp (Opsional)
                  </label>
                  <input
                    type="tel"
                    placeholder="0812xxxxxxxx"
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] placeholder:text-[#F5F3ED]/35 focus:outline-none focus:border-[#C6A878]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#F5F3ED]/80 mb-1.5">
                    Subjek Pertanyaan
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tanya Private Trip atau Jadwal"
                    value={subjek}
                    onChange={(e) => setSubjek(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] placeholder:text-[#F5F3ED]/35 focus:outline-none focus:border-[#C6A878]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F3ED]/80 mb-1.5">
                  Detail Pesan
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Ceritakan destinasi tujuan, perkiraan tanggal, dan jumlah peserta Anda..."
                  value={pesan}
                  onChange={(e) => setPesan(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] placeholder:text-[#F5F3ED]/35 focus:outline-none focus:border-[#C6A878]"
                />
              </div>

              <button
                type="submit"
                disabled={sedangKirim}
                className="w-full py-4 rounded-full bg-[#C6A878] text-[#0B2528] text-xs font-bold uppercase tracking-widest hover:bg-[#F5F3ED] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {sedangKirim ? "Mengirim Pesan..." : "Kirim Pesan Sekarang"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}