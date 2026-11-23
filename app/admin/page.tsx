"use client";

import { useEffect, useState } from "react";
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
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  MapPin,
  Ticket,
  Wallet,
  Compass,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [tabAktif, setTabAktif] = useState<"pesanan" | "destinasi">("pesanan");
  const [daftarPesanan, setDaftarPesanan] = useState<Pesanan[]>([]);
  const [daftarDestinasi, setDaftarDestinasi] =
    useState<Destinasi[]>(DESTINASI_BAWAAN);

  const [namaWisata, setNamaWisata] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [kategori, setKategori] = useState("Bahari & Kapal Pesiar");
  const [durasi, setDurasi] = useState("4 Hari 3 Malam");
  const [harga, setHarga] = useState(5000000);
  const [kuota, setKuota] = useState(10);
  const [gambar, setGambar] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  useEffect(() => {
    async function muatDataAdmin() {
      if (isSupabaseConfigured && supabase) {
        const { data: dataBooking } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false });
        if (dataBooking) setDaftarPesanan(dataBooking);

        const { data: dataDest } = await supabase
          .from("destinations")
          .select("*")
          .order("created_at", { ascending: false });
        if (dataDest && dataDest.length > 0) setDaftarDestinasi(dataDest);
        return;
      }

      const pesananLokal = localStorage.getItem("jelvanta_pesanan");
      if (pesananLokal) setDaftarPesanan(JSON.parse(pesananLokal));

      const destinasiLokal = localStorage.getItem("jelvanta_destinasi");
      if (destinasiLokal) {
        setDaftarDestinasi(JSON.parse(destinasiLokal));
      } else {
        localStorage.setItem(
          "jelvanta_destinasi",
          JSON.stringify(DESTINASI_BAWAAN)
        );
      }
    }
    muatDataAdmin();
  }, []);

  const ubahStatusPesanan = async (
    id: string,
    statusBaru: "Menunggu Pembayaran" | "Terkonfirmasi" | "Dibatalkan"
  ) => {
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from("bookings")
        .update({ status: statusBaru })
        .eq("id", id);
    }

    const diperbarui = daftarPesanan.map((item) =>
      item.id === id ? { ...item, status: statusBaru } : item
    );
    setDaftarPesanan(diperbarui);
    localStorage.setItem("jelvanta_pesanan", JSON.stringify(diperbarui));
  };

  const hapusPesanan = async (id: string) => {
    if (isSupabaseConfigured && supabase) {
      await supabase.from("bookings").delete().eq("id", id);
    }

    const diperbarui = daftarPesanan.filter((item) => item.id !== id);
    setDaftarPesanan(diperbarui);
    localStorage.setItem("jelvanta_pesanan", JSON.stringify(diperbarui));
  };

  const handleTambahDestinasi = async (e: React.FormEvent) => {
    e.preventDefault();
    const idBaru = namaWisata
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const paketBaru: Destinasi = {
      id: `${idBaru}-${Date.now().toString().slice(-3)}`,
      nama: namaWisata,
      lokasi,
      kategori,
      durasi,
      harga: Number(harga),
      rating: 4.9,
      kuota: Number(kuota),
      gambar:
        gambar ||
        "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80",
      deskripsi,
      fasilitas: [
        "Akomodasi Resor Bintang Lima",
        "Transportasi Privat Selama Tur",
        "Pemandu Wisata Berlisensi",
        "Asuransi Perjalanan Penuh",
      ],
      itinerary: [
        {
          hari: "Hari 01",
          judul: "Penyambutan & Eksplorasi Awal",
          kegiatan:
            "Penjemputan di bandara ketibaan dan pengantaran menuju penginapan utama.",
        },
        {
          hari: "Hari 02",
          judul: "Penjelajahan Destinasi Utama",
          kegiatan:
            "Mengunjungi titik panorama ikonik bersama pemandu lokal berpengalaman.",
        },
      ],
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from("destinations").insert([paketBaru]);
    }

    const diperbarui = [paketBaru, ...daftarDestinasi];
    setDaftarDestinasi(diperbarui);
    localStorage.setItem("jelvanta_destinasi", JSON.stringify(diperbarui));

    setNamaWisata("");
    setLokasi("");
    setGambar("");
    setDeskripsi("");
  };

  const hapusDestinasi = async (id: string) => {
    if (isSupabaseConfigured && supabase) {
      await supabase.from("destinations").delete().eq("id", id);
    }

    const diperbarui = daftarDestinasi.filter((item) => item.id !== id);
    setDaftarDestinasi(diperbarui);
    localStorage.setItem("jelvanta_destinasi", JSON.stringify(diperbarui));
  };

  const totalPendapatan = daftarPesanan
    .filter((p) => p.status === "Terkonfirmasi")
    .reduce((acc, curr) => acc + curr.total_harga, 0);

  return (
    <div className="min-h-screen bg-[#0B2528] text-[#F5F3ED]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0F3135] border border-[#C6A878]/40 text-xs uppercase tracking-widest text-[#C6A878] mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Panel Kendali Pengelola
            </div>
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold">
              Dashboard Manajemen Jelvanta
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setTabAktif("pesanan")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                tabAktif === "pesanan"
                  ? "bg-[#C6A878] text-[#0B2528]"
                  : "bg-[#0F3135] text-[#F5F3ED] border border-[#537C78]/40"
              }`}
            >
              Kelola Pesanan ({daftarPesanan.length})
            </button>
            <button
              onClick={() => setTabAktif("destinasi")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                tabAktif === "destinasi"
                  ? "bg-[#C6A878] text-[#0B2528]"
                  : "bg-[#0F3135] text-[#F5F3ED] border border-[#537C78]/40"
              }`}
            >
              Kelola Paket Wisata ({daftarDestinasi.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-3xl bg-[#0F3135] border border-[#537C78]/30 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#F5F3ED]/60 mb-1">
                Pendapatan Terkonfirmasi
              </p>
              <p className="text-2xl font-bold text-[#C6A878]">
                {formatRupiah(totalPendapatan)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#C6A878]/15 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-[#C6A878]" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0F3135] border border-[#537C78]/30 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#F5F3ED]/60 mb-1">
                Total Transaksi Masuk
              </p>
              <p className="text-2xl font-bold text-[#F5F3ED]">
                {daftarPesanan.length} Pesanan
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#C6A878]/15 flex items-center justify-center">
              <Ticket className="w-6 h-6 text-[#C6A878]" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0F3135] border border-[#537C78]/30 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#F5F3ED]/60 mb-1">
                Paket Wisata Aktif
              </p>
              <p className="text-2xl font-bold text-[#F5F3ED]">
                {daftarDestinasi.length} Destinasi
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#C6A878]/15 flex items-center justify-center">
              <Compass className="w-6 h-6 text-[#C6A878]" />
            </div>
          </div>
        </div>

        {tabAktif === "pesanan" ? (
          <div className="rounded-3xl bg-[#0F3135] border border-[#537C78]/30 overflow-hidden">
            <div className="p-6 border-b border-[#537C78]/30">
              <h2 className="font-playfair text-xl font-bold">
                Daftar Reservasi Pelanggan
              </h2>
            </div>

            {daftarPesanan.length === 0 ? (
              <div className="p-12 text-center text-sm text-[#F5F3ED]/60">
                Belum ada pesanan yang masuk. Cobalah membuat pesanan dari halaman utama.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#537C78]/30 text-[11px] uppercase tracking-wider text-[#C6A878]">
                      <th className="p-4">Kode</th>
                      <th className="p-4">Pelanggan</th>
                      <th className="p-4">Destinasi & Jadwal</th>
                      <th className="p-4">Total Tagihan</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#537C78]/20 text-sm">
                    {daftarPesanan.map((p) => (
                      <tr key={p.id} className="hover:bg-[#0B2528]/40">
                        <td className="p-4 font-bold text-[#C6A878]">
                          {p.kode_booking}
                        </td>
                        <td className="p-4">
                          <p className="font-semibold">{p.nama_pemesan}</p>
                          <p className="text-xs text-[#F5F3ED]/60">{p.email}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-medium">{p.nama_destinasi}</p>
                          <p className="text-xs text-[#F5F3ED]/60">
                            {p.tanggal_berangkat} ({p.jumlah_peserta} Orang)
                          </p>
                        </td>
                        <td className="p-4 font-semibold">
                          {formatRupiah(p.total_harga)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              p.status === "Terkonfirmasi"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : p.status === "Dibatalkan"
                                ? "bg-red-500/20 text-red-300"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() =>
                              ubahStatusPesanan(p.id, "Terkonfirmasi")
                            }
                            title="Setujui Pesanan"
                            className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              ubahStatusPesanan(p.id, "Dibatalkan")
                            }
                            title="Batalkan Pesanan"
                            className="p-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => hapusPesanan(p.id)}
                            title="Hapus Data"
                            className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 p-7 rounded-3xl bg-[#0F3135] border border-[#537C78]/30 h-fit">
              <h2 className="font-playfair text-xl font-bold mb-6 flex items-center gap-2 text-[#C6A878]">
                <Plus className="w-5 h-5" />
                Tambah Paket Wisata
              </h2>

              <form onSubmit={handleTambahDestinasi} className="space-y-4">
                <div>
                  <label className="block text-xs text-[#F5F3ED]/80 mb-1">
                    Nama Paket Wisata
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh Eksplorasi Pulau Derawan"
                    value={namaWisata}
                    onChange={(e) => setNamaWisata(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] focus:outline-none focus:border-[#C6A878]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#F5F3ED]/80 mb-1">
                    Lokasi Provinsi
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh Kalimantan Timur"
                    value={lokasi}
                    onChange={(e) => setLokasi(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] focus:outline-none focus:border-[#C6A878]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#F5F3ED]/80 mb-1">
                    Kategori Wisata
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] focus:outline-none focus:border-[#C6A878]"
                  >
                    <option value="Bahari & Kapal Pesiar">
                      Bahari & Kapal Pesiar
                    </option>
                    <option value="Eksplorasi Pulau">Eksplorasi Pulau</option>
                    <option value="Budaya & Relaksasi">
                      Budaya & Relaksasi
                    </option>
                    <option value="Petualangan Gunung">
                      Petualangan Gunung
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#F5F3ED]/80 mb-1">
                      Durasi
                    </label>
                    <input
                      type="text"
                      required
                      value={durasi}
                      onChange={(e) => setDurasi(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] focus:outline-none focus:border-[#C6A878]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#F5F3ED]/80 mb-1">
                      Kuota Kursi
                    </label>
                    <input
                      type="number"
                      required
                      value={kuota}
                      onChange={(e) => setKuota(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] focus:outline-none focus:border-[#C6A878]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#F5F3ED]/80 mb-1">
                    Harga per Peserta (IDR)
                  </label>
                  <input
                    type="number"
                    required
                    value={harga}
                    onChange={(e) => setHarga(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] focus:outline-none focus:border-[#C6A878]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#F5F3ED]/80 mb-1">
                    URL Foto atau Path (/images/nama.jpg)
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={gambar}
                    onChange={(e) => setGambar(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] focus:outline-none focus:border-[#C6A878]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#F5F3ED]/80 mb-1">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Jelaskan keistimewaan paket wisata ini..."
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] focus:outline-none focus:border-[#C6A878]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#C6A878] text-[#0B2528] text-xs font-bold uppercase tracking-wider hover:bg-[#F5F3ED] transition-all"
                >
                  Simpan Paket Wisata
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {daftarDestinasi.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-[#0F3135] border border-[#537C78]/30 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 w-full">
                    <img
                      src={item.gambar}
                      alt={item.nama}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#C6A878]">
                        {item.kategori}
                      </span>
                      <h3 className="font-playfair text-lg font-bold">
                        {item.nama}
                      </h3>
                      <p className="text-xs text-[#F5F3ED]/70 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C6A878]" />
                        {item.lokasi} • {formatRupiah(item.harga)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => hapusDestinasi(item.id)}
                    className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-medium flex items-center gap-1.5 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}