"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  DESTINASI_BAWAAN,
  Destinasi,
  Pesanan,
  formatRupiah,
  supabase,
  isSupabaseConfigured,
} from "@/lib/supabase";
import {
  MapPin,
  Clock,
  Users,
  Star,
  CheckCircle2,
  ArrowLeft,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

function KontenDetailDestinasi() {
  const params = useParams();
  const router = useRouter();
  const idDestinasi = params?.id as string;

  const [destinasi, setDestinasi] = useState<Destinasi | null>(null);
  const [namaPemesan, setNamaPemesan] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [tanggalBerangkat, setTanggalBerangkat] = useState("");
  const [jumlahPeserta, setJumlahPeserta] = useState(1);
  const [metodePembayaran, setMetodePembayaran] = useState(
    "Transfer Bank Virtual Account"
  );
  const [catatan, setCatatan] = useState("");
  const [sedangMemproses, setSedangMemproses] = useState(false);

  useEffect(() => {
    async function cariDestinasi() {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase
          .from("destinations")
          .select("*")
          .eq("id", idDestinasi)
          .single();
        if (data) {
          setDestinasi(data);
          return;
        }
      }

      const simpananLokal = localStorage.getItem("jelvanta_destinasi_v2");
      const daftar: Destinasi[] = simpananLokal
        ? JSON.parse(simpananLokal)
        : DESTINASI_BAWAAN;
      const ditemukan =
        daftar.find((item) => item.id === idDestinasi) || DESTINASI_BAWAAN[0];
      setDestinasi(ditemukan);
    }
    cariDestinasi();
  }, [idDestinasi]);

  if (!destinasi) {
    return (
      <div className="min-h-screen bg-[#0B2528] text-[#F5F3ED] flex items-center justify-center">
        <p className="text-sm tracking-widest uppercase text-[#C6A878]">
          Memuat Informasi Destinasi...
        </p>
      </div>
    );
  }

  const totalHarga = destinasi.harga * jumlahPeserta;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSedangMemproses(true);

    const angkaAcak = Math.floor(10000 + Math.random() * 90000);
    const kodeBookingBaru = `JLV-${angkaAcak}`;

    const pesananBaru: Pesanan = {
      id: crypto.randomUUID(),
      kode_booking: kodeBookingBaru,
      destinasi_id: destinasi.id,
      nama_destinasi: destinasi.nama,
      nama_pemesan: namaPemesan,
      email,
      telepon,
      tanggal_berangkat: tanggalBerangkat,
      jumlah_peserta: jumlahPeserta,
      total_harga: totalHarga,
      metode_pembayaran: metodePembayaran,
      status: "Menunggu Pembayaran",
      catatan,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from("bookings").insert([pesananBaru]);
    }

    const riwayatLokal = localStorage.getItem("jelvanta_pesanan");
    const daftarPesanan: Pesanan[] = riwayatLokal
      ? JSON.parse(riwayatLokal)
      : [];
    daftarPesanan.unshift(pesananBaru);
    localStorage.setItem("jelvanta_pesanan", JSON.stringify(daftarPesanan));

    setSedangMemproses(false);
    router.push(`/booking?kode=${kodeBookingBaru}`);
  };

  return (
    <>
      <div className="relative h-[55vh] w-full overflow-hidden">
        <img
          src={destinasi.gambar}
          alt={destinasi.nama}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2528] via-[#0B2528]/50 to-transparent" />

        <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-6 md:px-12">
          <Link
            href="/#paket"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C6A878] hover:text-[#F5F3ED] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Koleksi Ekspedisi
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="px-3.5 py-1 rounded-full bg-[#537C78]/40 border border-[#537C78] text-xs font-medium">
              {destinasi.kategori}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-[#C6A878]">
              <Star className="w-4 h-4 fill-[#C6A878]" />
              {destinasi.rating} Penilaian Eksklusif
            </span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-normal">
            {destinasi.nama}
          </h1>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex flex-wrap gap-6 p-6 rounded-2xl bg-[#0F3135] border border-[#537C78]/30">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#C6A878]" />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#F5F3ED]/50">
                  Lokasi Tujuan
                </p>
                <p className="text-sm font-semibold">{destinasi.lokasi}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#C6A878]" />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#F5F3ED]/50">
                  Durasi Perjalanan
                </p>
                <p className="text-sm font-semibold">{destinasi.durasi}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#C6A878]" />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#F5F3ED]/50">
                  Kapasitas Maksimal
                </p>
                <p className="text-sm font-semibold">
                  Sisa {destinasi.kuota} Kursi
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-editorial text-2xl font-normal text-[#C6A878]">
              Gambaran Perjalanan
            </h2>
            <p className="text-sm sm:text-base text-[#F5F3ED]/80 leading-relaxed">
              {destinasi.deskripsi}
            </p>
          </div>

          {destinasi.fasilitas && destinasi.fasilitas.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-editorial text-2xl font-normal text-[#C6A878]">
                Fasilitas yang Termasuk
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {destinasi.fasilitas.map((fas, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#0F3135] border border-[#537C78]/25 text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#C6A878] shrink-0" />
                    <span>{fas}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {destinasi.itinerary && destinasi.itinerary.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-editorial text-2xl font-normal text-[#C6A878]">
                Rencana Perjalanan Harian
              </h2>
              <div className="space-y-4">
                {destinasi.itinerary.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-[#0F3135] border border-[#537C78]/30 space-y-2"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-[#C6A878]">
                      {item.hari}
                    </span>
                    <h3 className="font-editorial text-xl font-normal">
                      {item.judul}
                    </h3>
                    <p className="text-sm text-[#F5F3ED]/75 leading-relaxed">
                      {item.kegiatan}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28 p-7 rounded-3xl bg-[#0F3135] border border-[#C6A878]/40 shadow-2xl space-y-6">
            <div className="pb-5 border-b border-[#537C78]/30">
              <span className="text-xs uppercase tracking-wider text-[#F5F3ED]/60">
                Harga Paket Mulai
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-[#C6A878]">
                  {formatRupiah(destinasi.harga)}
                </span>
                <span className="text-xs text-[#F5F3ED]/60">/ peserta</span>
              </div>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#F5F3ED]/80 mb-1.5">
                  Nama Lengkap Pemesan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama sesuai identitas"
                  value={namaPemesan}
                  onChange={(e) => setNamaPemesan(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] focus:outline-none focus:border-[#C6A878]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F3ED]/80 mb-1.5">
                  Alamat Email Aktif
                </label>
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] focus:outline-none focus:border-[#C6A878]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F3ED]/80 mb-1.5">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0812xxxxxxxx"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] focus:outline-none focus:border-[#C6A878]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#F5F3ED]/80 mb-1.5">
                    Tanggal Berangkat
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggalBerangkat}
                    onChange={(e) => setTanggalBerangkat(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-xs text-[#F5F3ED] focus:outline-none focus:border-[#C6A878]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#F5F3ED]/80 mb-1.5">
                    Jumlah Peserta
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={destinasi.kuota}
                    required
                    value={jumlahPeserta}
                    onChange={(e) =>
                      setJumlahPeserta(Math.max(1, Number(e.target.value)))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] focus:outline-none focus:border-[#C6A878]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F3ED]/80 mb-1.5">
                  Metode Pembayaran
                </label>
                <select
                  value={metodePembayaran}
                  onChange={(e) => setMetodePembayaran(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] focus:outline-none focus:border-[#C6A878]"
                >
                  <option value="Transfer Bank Virtual Account">
                    Transfer Bank Virtual Account
                  </option>
                  <option value="Kartu Kredit / Debit Visa Mastercard">
                    Kartu Kredit / Debit
                  </option>
                  <option value="QRIS Nusantara Prioritas">
                    QRIS Nusantara Prioritas
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F3ED]/80 mb-1.5">
                  Catatan Khusus (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Permintaan makanan khusus atau penjemputan..."
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] focus:outline-none focus:border-[#C6A878]"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#0B2528] border border-[#537C78]/30 space-y-2">
                <div className="flex justify-between text-xs text-[#F5F3ED]/70">
                  <span>
                    {formatRupiah(destinasi.harga)} x {jumlahPeserta} Peserta
                  </span>
                  <span>{formatRupiah(totalHarga)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#F5F3ED]/70">
                  <span>Pajak & Layanan Prioritas</span>
                  <span className="text-[#C6A878]">Termasuk</span>
                </div>
                <div className="pt-2 border-t border-[#537C78]/30 flex justify-between items-center font-bold">
                  <span className="text-sm">Total Pembayaran</span>
                  <span className="text-lg text-[#C6A878]">
                    {formatRupiah(totalHarga)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={sedangMemproses}
                className="w-full py-4 rounded-full bg-[#C6A878] text-[#0B2528] text-xs font-bold uppercase tracking-widest hover:bg-[#F5F3ED] transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                {sedangMemproses
                  ? "Memproses Reservasi..."
                  : "Konfirmasi Reservasi Sekarang"}
              </button>

              <p className="text-[11px] text-center text-[#F5F3ED]/50 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C6A878]" />
                Data pesanan dijamin aman dan terenkripsi
              </p>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

export default function DetailDestinasiPage() {
  return (
    <div className="min-h-screen bg-[#0B2528] text-[#F5F3ED]">
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#0B2528] text-[#F5F3ED] flex items-center justify-center">
            <p className="text-sm tracking-widest uppercase text-[#C6A878]">
              Memuat Informasi Destinasi...
            </p>
          </div>
        }
      >
        <KontenDetailDestinasi />
      </Suspense>
      <Footer />
    </div>
  );
}