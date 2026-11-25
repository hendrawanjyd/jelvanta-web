"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Destination, formatRupiah, getDestinations } from "@/lib/api";
import {
  Search,
  MapPin,
  Clock,
  Users,
  Star,
  ArrowUpRight,
  Compass,
  AlertCircle,
} from "lucide-react";

export default function DestinationsPage() {
  const [daftarDestinasi, setDaftarDestinasi] = useState<Destination[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [kataCari, setKataCari] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  useEffect(() => {
    let aktif = true;

    async function muatData() {
      try {
        setSedangMemuat(true);
        setPesanError(null);
        const data = await getDestinations();
        if (aktif) {
          setDaftarDestinasi(data);
        }
      } catch (err) {
        if (aktif) {
          setPesanError(
            err instanceof Error
              ? err.message
              : "Gagal memuat daftar destinasi dari server"
          );
        }
      } finally {
        if (aktif) {
          setSedangMemuat(false);
        }
      }
    }

    muatData();

    return () => {
      aktif = false;
    };
  }, []);

  const daftarKategori = useMemo(() => {
    const unik = Array.from(
      new Set(daftarDestinasi.map((item) => item.kategori))
    );
    return ["Semua", ...unik];
  }, [daftarDestinasi]);

  const destinasiTersaring = useMemo(() => {
    return daftarDestinasi.filter((item) => {
      const cocokKategori =
        kategoriAktif === "Semua" || item.kategori === kategoriAktif;
      const kata = kataCari.trim().toLowerCase();
      const cocokCari =
        !kata ||
        item.nama.toLowerCase().includes(kata) ||
        item.lokasi.toLowerCase().includes(kata) ||
        item.kategori.toLowerCase().includes(kata);
      return cocokKategori && cocokCari;
    });
  }, [daftarDestinasi, kategoriAktif, kataCari]);

  return (
    <div className="min-h-screen bg-[#0B2528] text-[#F5F3ED]">
      <Navbar />

      <section className="pt-36 pb-16 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F3135] border border-[#C6A878]/40 text-xs uppercase tracking-widest text-[#C6A878]">
            <Compass className="w-3.5 h-3.5" />
            Katalog Ekspedisi Nusantara
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-normal leading-tight">
            Temukan Perjalanan Privat Terbaik Anda
          </h1>
          <p className="text-sm sm:text-base text-[#F5F3ED]/75 leading-relaxed max-w-2xl">
            Setiap paket dirancang untuk memberikan kenyamanan maksimal, akses eksklusif ke lokasi ikonik, serta fleksibilitas jadwal sesuai keinginan Anda.
          </p>
        </div>

        <div className="mt-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex flex-wrap gap-2.5">
            {daftarKategori.map((kat) => {
              const aktif = kategoriAktif === kat;
              return (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setKategoriAktif(kat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    aktif
                      ? "bg-[#C6A878] text-[#0B2528]"
                      : "bg-[#0F3135] text-[#F5F3ED]/80 border border-[#537C78]/40 hover:border-[#C6A878]"
                  }`}
                >
                  {kat}
                </button>
              );
            })}
          </div>

          <div className="w-full lg:w-80 flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#0F3135] border border-[#537C78]/50 focus-within:border-[#C6A878]">
            <Search className="w-4 h-4 text-[#C6A878] shrink-0" />
            <input
              type="text"
              placeholder="Cari destinasi atau lokasi..."
              value={kataCari}
              onChange={(e) => setKataCari(e.target.value)}
              className="bg-transparent w-full text-sm text-[#F5F3ED] placeholder:text-[#F5F3ED]/40 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#EFECE4] text-[#1E2623] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          {sedangMemuat ? (
            <div className="py-20 text-center text-sm text-[#2B2B28]/65">
              Memuat seluruh koleksi ekspedisi...
            </div>
          ) : pesanError ? (
            <div className="p-8 rounded-2xl bg-[#F5F3ED] border border-red-300 text-center space-y-2 max-w-xl mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
              <p className="text-sm font-semibold text-red-700">
                Tidak dapat memuat data destinasi
              </p>
              <p className="text-xs text-[#2B2B28]/70">{pesanError}</p>
            </div>
          ) : destinasiTersaring.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <p className="font-editorial text-2xl text-[#0B2528]">
                Destinasi Tidak Ditemukan
              </p>
              <p className="text-sm text-[#2B2B28]/65">
                Coba ubah kata kunci pencarian atau pilih kategori lainnya.
              </p>
              <button
                type="button"
                onClick={() => {
                  setKataCari("");
                  setKategoriAktif("Semua");
                }}
                className="mt-2 px-6 py-2.5 rounded-full bg-[#0B2528] text-[#F5F3ED] text-xs font-semibold uppercase tracking-wider hover:bg-[#537C78] transition-all"
              >
                Tampilkan Semua Paket
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {destinasiTersaring.map((item) => (
                <article
                  key={item.id}
                  className="group rounded-3xl overflow-hidden bg-[#F5F3ED] border border-[#0B2528]/10 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
                >
                  <div className="relative h-72 w-full overflow-hidden">
                    <img
                      src={item.gambar}
                      alt={item.nama}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
                    <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#F5F3ED]/95 text-[#0B2528] text-[11px] font-semibold uppercase tracking-wider">
                      {item.kategori}
                    </div>
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#0B2528]/80 backdrop-blur-md text-[#C6A878] text-xs font-semibold inline-flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#C6A878]" />
                      {item.rating}
                    </div>
                    <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 text-xs text-[#F5F3ED] font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#C6A878]" />
                      {item.lokasi}
                    </div>
                  </div>

                  <div className="p-7 flex flex-col flex-1 justify-between space-y-6">
                    <div className="space-y-3">
                      <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#0B2528] leading-snug">
                        {item.nama}
                      </h2>
                      <p className="text-sm text-[#2B2B28]/75 leading-relaxed line-clamp-3">
                        {item.deskripsi}
                      </p>

                      <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-[#0B2528]/75">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#537C78]" />
                          {item.durasi}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-[#537C78]" />
                          {item.kuota > 0
                            ? `Sisa ${item.kuota} Kursi`
                            : "Kuota Penuh"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-5 border-t border-[#0B2528]/10 flex items-center justify-between gap-4">
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest text-[#2B2B28]/50">
                          Mulai Dari
                        </span>
                        <span className="text-lg font-bold text-[#0B2528]">
                          {formatRupiah(item.harga)}
                        </span>
                        <span className="text-xs text-[#2B2B28]/50">
                          {" "}
                          / peserta
                        </span>
                      </div>

                      <Link
                        href={`/destinations/${item.slug}`}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#0B2528] text-[#F5F3ED] text-xs font-semibold uppercase tracking-wider hover:bg-[#537C78] transition-all"
                      >
                        <span>Jelajahi</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}