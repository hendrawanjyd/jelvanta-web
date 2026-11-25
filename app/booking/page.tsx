"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Booking,
  formatRupiah,
  getAuthToken,
  getBookingByCode,
  getMyBookings,
} from "@/lib/api";
import {
  Ticket,
  Search,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  AlertCircle,
  MapPin,
  Award,
} from "lucide-react";

function KartuTiket({ pesanan }: { pesanan: Booking }) {
  return (
    <div className="p-7 rounded-3xl bg-[#0F3135] border border-[#537C78]/40 shadow-xl flex flex-col md:flex-row justify-between gap-6">
      <div className="space-y-4 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3.5 py-1 rounded-full bg-[#0B2528] border border-[#C6A878]/50 text-xs font-bold tracking-wider text-[#C6A878]">
            {pesanan.kode_booking}
          </span>

          {pesanan.status === "Terkonfirmasi" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Terkonfirmasi Lunas
            </span>
          )}

          {pesanan.status === "Selesai" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-medium border border-sky-500/30">
              <Award className="w-3.5 h-3.5" />
              Perjalanan Selesai
            </span>
          )}

          {pesanan.status === "Menunggu Pembayaran" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30">
              <Clock className="w-3.5 h-3.5" />
              Menunggu Pembayaran
            </span>
          )}

          {pesanan.status === "Dibatalkan" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-medium border border-red-500/30">
              <XCircle className="w-3.5 h-3.5" />
              Dibatalkan
            </span>
          )}
        </div>

        <div>
          <h2 className="font-playfair text-2xl font-bold text-[#F5F3ED]">
            {pesanan.destination?.nama || "Paket Ekspedisi JELVANTA"}
          </h2>
          {pesanan.destination?.lokasi && (
            <p className="inline-flex items-center gap-1.5 text-xs text-[#C6A878] mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {pesanan.destination.lokasi}
            </p>
          )}
          <p className="text-xs text-[#F5F3ED]/65 mt-1.5">
            {pesanan.nama_pemesan} ({pesanan.email} / {pesanan.telepon})
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-xs text-[#F5F3ED]/80 pt-2">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#C6A878]" />
            {pesanan.tanggal_berangkat}
          </span>
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#C6A878]" />
            {pesanan.jumlah_peserta} Peserta
          </span>
          <span className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#C6A878]" />
            {pesanan.metode_pembayaran}
          </span>
        </div>

        {pesanan.catatan && (
          <p className="text-xs text-[#F5F3ED]/60 pt-1 italic">
            Catatan tambahan &ldquo;{pesanan.catatan}&rdquo;
          </p>
        )}
      </div>

      <div className="md:border-l border-[#537C78]/30 md:pl-7 flex flex-col justify-between items-start md:items-end min-w-[210px]">
        <div>
          <span className="block text-[11px] uppercase tracking-wider text-[#F5F3ED]/50 md:text-right">
            Total Tagihan
          </span>
          <span className="text-2xl font-bold text-[#C6A878]">
            {formatRupiah(pesanan.total_harga)}
          </span>
        </div>

        {pesanan.status === "Menunggu Pembayaran" && (
          <div className="mt-4 p-3 rounded-2xl bg-[#0B2528] border border-amber-500/30 text-[11px] text-[#F5F3ED]/75 md:text-right max-w-[230px]">
            Selesaikan transfer sesuai metode pilihan Anda. Status akan diperbarui otomatis setelah diverifikasi admin.
          </div>
        )}

        {pesanan.status === "Terkonfirmasi" && (
          <div className="mt-4 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300">
            E-Tiket Aktif & Siap Berangkat
          </div>
        )}
      </div>
    </div>
  );
}

function KontenBooking() {
  const searchParams = useSearchParams();
  const kodeDariUrl = searchParams.get("kode") || "";

  const [kataCari, setKataCari] = useState(kodeDariUrl);
  const [hasilCari, setHasilCari] = useState<Booking | null>(null);
  const [riwayatSaya, setRiwayatSaya] = useState<Booking[]>([]);
  const [sedangMencari, setSedangMencari] = useState(false);
  const [sedangMemuatRiwayat, setSedangMemuatRiwayat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [sudahLogin, setSudahLogin] = useState(false);

  const lacakPesanan = useCallback(async (kode: string) => {
    const kodeBersih = kode.trim().toUpperCase();
    if (!kodeBersih) {
      setHasilCari(null);
      setPesanError(null);
      return;
    }

    try {
      setSedangMencari(true);
      setPesanError(null);
      const data = await getBookingByCode(kodeBersih);
      setHasilCari(data);
    } catch (err) {
      setHasilCari(null);
      setPesanError(
        err instanceof Error
          ? err.message
          : "Kode booking tidak ditemukan di sistem kami"
      );
    } finally {
      setSedangMencari(false);
    }
  }, []);

  useEffect(() => {
    if (kodeDariUrl) {
      setKataCari(kodeDariUrl);
      lacakPesanan(kodeDariUrl);
    }
  }, [kodeDariUrl, lacakPesanan]);

  useEffect(() => {
    let aktif = true;

    async function muatRiwayatAkun() {
      const token = getAuthToken();
      if (!token) return;

      try {
        if (aktif) {
          setSudahLogin(true);
          setSedangMemuatRiwayat(true);
        }
        const data = await getMyBookings();
        if (aktif) {
          setRiwayatSaya(data);
        }
      } catch {
        if (aktif) {
          setRiwayatSaya([]);
        }
      } finally {
        if (aktif) {
          setSedangMemuatRiwayat(false);
        }
      }
    }

    muatRiwayatAkun();

    return () => {
      aktif = false;
    };
  }, []);

  const handleSubmitCari = (e: React.FormEvent) => {
    e.preventDefault();
    lacakPesanan(kataCari);
  };

  return (
    <main className="max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F3135] border border-[#C6A878]/40 text-xs uppercase tracking-widest text-[#C6A878] mb-4">
          <Ticket className="w-3.5 h-3.5" />
          Tiket & Status Reservasi
        </div>
        <h1 className="font-playfair text-3xl sm:text-5xl font-bold mb-4">
          Cek Pesanan Perjalanan Anda
        </h1>
        <p className="text-sm text-[#F5F3ED]/75">
          Masukkan Kode Booking Anda (contoh JLV-20261123-QYMD) untuk melihat detail tiket elektronik dan status verifikasi pembayaran secara langsung.
        </p>
      </div>

      <form
        onSubmit={handleSubmitCari}
        className="max-w-xl mx-auto mb-12 flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-1 flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#0F3135] border border-[#537C78]/50 focus-within:border-[#C6A878]">
          <Search className="w-5 h-5 text-[#C6A878] shrink-0" />
          <input
            type="text"
            placeholder="Masukkan Kode Booking (misal JLV-20261123-QYMD)"
            value={kataCari}
            onChange={(e) => setKataCari(e.target.value)}
            className="bg-transparent w-full text-sm text-[#F5F3ED] placeholder:text-[#F5F3ED]/40 focus:outline-none uppercase"
          />
        </div>
        <button
          type="submit"
          disabled={sedangMencari}
          className="px-7 py-3.5 rounded-full bg-[#C6A878] text-[#0B2528] text-xs font-bold uppercase tracking-widest hover:bg-[#F5F3ED] transition-all disabled:opacity-50"
        >
          {sedangMencari ? "Mencari..." : "Lacak Tiket"}
        </button>
      </form>

      {pesanError && (
        <div className="max-w-xl mx-auto mb-10 p-4 rounded-2xl bg-red-500/15 border border-red-400/40 text-sm text-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-300" />
          <span>{pesanError}</span>
        </div>
      )}

      {hasilCari && (
        <div className="space-y-4 mb-12">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C6A878]">
              Hasil Pelacakan Tiket
            </p>
            <button
              type="button"
              onClick={() => {
                setHasilCari(null);
                setKataCari("");
                setPesanError(null);
              }}
              className="text-xs text-[#F5F3ED]/60 hover:text-[#C6A878] transition-colors"
            >
              Bersihkan Pencarian
            </button>
          </div>
          <KartuTiket pesanan={hasilCari} />
        </div>
      )}

      {!hasilCari && !pesanError && !sudahLogin && (
        <div className="text-center py-16 px-6 rounded-3xl bg-[#0F3135] border border-[#537C78]/30 space-y-4">
          <p className="text-base text-[#F5F3ED]/85">
            Belum ada kode booking yang dilacak.
          </p>
          <p className="text-xs text-[#F5F3ED]/55 max-w-md mx-auto">
            Ketik kode booking Anda pada kolom pencarian di atas, atau mulai jelajahi paket ekspedisi untuk membuat reservasi baru.
          </p>
          <div className="pt-2">
            <Link
              href="/#paket"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#C6A878] text-[#C6A878] text-xs font-bold uppercase tracking-wider hover:bg-[#C6A878] hover:text-[#0B2528] transition-all"
            >
              Lihat Koleksi Ekspedisi
            </Link>
          </div>
        </div>
      )}

      {sudahLogin && (
        <div className="space-y-5 mt-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#C6A878]">
            Riwayat Pemesanan Akun Anda
          </p>

          {sedangMemuatRiwayat ? (
            <div className="text-center py-12 text-xs text-[#F5F3ED]/60">
              Memuat riwayat pemesanan Anda...
            </div>
          ) : riwayatSaya.length === 0 ? (
            <div className="text-center py-12 px-6 rounded-3xl bg-[#0F3135] border border-[#537C78]/30 text-sm text-[#F5F3ED]/70">
              Anda belum memiliki riwayat pemesanan pada akun ini.
            </div>
          ) : (
            <div className="space-y-6">
              {riwayatSaya.map((pesanan) => (
                <KartuTiket key={pesanan.id} pesanan={pesanan} />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-[#0B2528] text-[#F5F3ED]">
      <Navbar />
      <Suspense
        fallback={
          <div className="pt-40 pb-24 text-center text-sm text-[#C6A878]">
            Memuat Data Pesanan...
          </div>
        }
      >
        <KontenBooking />
      </Suspense>
      <Footer />
    </div>
  );
}