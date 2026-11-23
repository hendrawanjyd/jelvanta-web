"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Pesanan,
  formatRupiah,
  supabase,
  isSupabaseConfigured,
} from "@/lib/supabase";
import {
  Ticket,
  Search,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
} from "lucide-react";

function KontenBooking() {
  const searchParams = useSearchParams();
  const kodeDariUrl = searchParams.get("kode") || "";

  const [daftarPesanan, setDaftarPesanan] = useState<Pesanan[]>([]);
  const [kataCari, setKataCari] = useState(kodeDariUrl);

  useEffect(() => {
    async function muatPesanan() {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false });
        if (data && data.length > 0) {
          setDaftarPesanan(data);
          return;
        }
      }

      const simpananLokal = localStorage.getItem("jelvanta_pesanan");
      if (simpananLokal) {
        setDaftarPesanan(JSON.parse(simpananLokal));
      }
    }
    muatPesanan();
  }, []);

  const simulasiBayarLunas = async (idPesanan: string) => {
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from("bookings")
        .update({ status: "Terkonfirmasi" })
        .eq("id", idPesanan);
    }

    const diperbarui = daftarPesanan.map((item) =>
      item.id === idPesanan
        ? { ...item, status: "Terkonfirmasi" as const }
        : item
    );
    setDaftarPesanan(diperbarui);
    localStorage.setItem("jelvanta_pesanan", JSON.stringify(diperbarui));
  };

  const pesananTersaring = daftarPesanan.filter(
    (item) =>
      item.kode_booking.toLowerCase().includes(kataCari.toLowerCase()) ||
      item.email.toLowerCase().includes(kataCari.toLowerCase()) ||
      item.nama_pemesan.toLowerCase().includes(kataCari.toLowerCase())
  );

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
          Masukkan Kode Booking (contoh JLV-12345) atau alamat email pemesan untuk melihat tiket elektronik dan status pembayaran.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-12">
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#0F3135] border border-[#537C78]/50 focus-within:border-[#C6A878]">
          <Search className="w-5 h-5 text-[#C6A878]" />
          <input
            type="text"
            placeholder="Cari berdasarkan Kode Booking, Nama, atau Email..."
            value={kataCari}
            onChange={(e) => setKataCari(e.target.value)}
            className="bg-transparent w-full text-sm text-[#F5F3ED] placeholder:text-[#F5F3ED]/40 focus:outline-none"
          />
        </div>
      </div>

      {pesananTersaring.length === 0 ? (
        <div className="text-center py-16 px-6 rounded-3xl bg-[#0F3135] border border-[#537C78]/30">
          <p className="text-base text-[#F5F3ED]/80 mb-2">
            Belum ada data pesanan yang ditemukan.
          </p>
          <p className="text-xs text-[#F5F3ED]/50">
            Silakan lakukan pemesanan melalui halaman detail destinasi terlebih dahulu.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pesananTersaring.map((pesanan) => (
            <div
              key={pesanan.id}
              className="p-7 rounded-3xl bg-[#0F3135] border border-[#537C78]/40 shadow-xl flex flex-col md:flex-row justify-between gap-6"
            >
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
                    {pesanan.nama_destinasi}
                  </h2>
                  <p className="text-xs text-[#F5F3ED]/60 mt-1">
                    Pemesan: {pesanan.nama_pemesan} ({pesanan.email} /{" "}
                    {pesanan.telepon})
                  </p>
                </div>

                <div className="flex flex-wrap gap-6 text-xs text-[#F5F3ED]/80 pt-2">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#C6A878]" />
                    Keberangkatan: {pesanan.tanggal_berangkat}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#C6A878]" />
                    Jumlah: {pesanan.jumlah_peserta} Peserta
                  </span>
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#C6A878]" />
                    Metode: {pesanan.metode_pembayaran}
                  </span>
                </div>
              </div>

              <div className="md:border-l border-[#537C78]/30 md:pl-7 flex flex-col justify-between items-start md:items-end">
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[#F5F3ED]/50 md:text-right">
                    Total Tagihan
                  </span>
                  <span className="text-2xl font-bold text-[#C6A878]">
                    {formatRupiah(pesanan.total_harga)}
                  </span>
                </div>

                {pesanan.status === "Menunggu Pembayaran" && (
                  <button
                    onClick={() => simulasiBayarLunas(pesanan.id)}
                    className="mt-4 px-5 py-2.5 rounded-full bg-[#C6A878] text-[#0B2528] text-xs font-bold uppercase tracking-wider hover:bg-[#F5F3ED] transition-all"
                  >
                    Simulasikan Bayar Sekarang
                  </button>
                )}
              </div>
            </div>
          ))}
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