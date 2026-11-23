"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  DESTINASI_BAWAAN,
  Destinasi,
  formatRupiah,
  supabase,
  isSupabaseConfigured,
} from "@/lib/supabase";
import {
  ArrowUpRight,
  Clock,
  Users,
  Compass,
  Shield,
  Calendar,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const TUMPUKAN_FOTO_VISI = [
  {
    id: "visi-1",
    url: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1000&q=85",
    kategori: "Warisan Budaya & Alam",
    lokasi: "Pura Ulun Danu, Bali",
  },
  {
    id: "visi-2",
    url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=85",
    kategori: "Peristirahatan Privat",
    lokasi: "Pesisir Tropis Sumba",
  },
  {
    id: "visi-3",
    url: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=1000&q=85",
    kategori: "Eksplorasi Bawah Laut",
    lokasi: "Taman Laut Banda Neira",
  },
];

export default function HomePage() {
  const heroBoxRef = useRef<HTMLDivElement>(null);

  const [urutanFoto, setUrutanFoto] = useState([0, 1, 2]);
  const [daftarDestinasi, setDaftarDestinasi] =
    useState<Destinasi[]>(DESTINASI_BAWAAN);
  const [slidePerDestinasi, setSlidePerDestinasi] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroBoxRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 }
      );
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    async function muatDestinasi() {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from("destinations")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          setDaftarDestinasi(data);
          return;
        }
      }

      const simpananLokal = localStorage.getItem("jelvanta_destinasi_v2");
      if (simpananLokal) {
        setDaftarDestinasi(JSON.parse(simpananLokal));
      } else {
        localStorage.setItem(
          "jelvanta_destinasi_v2",
          JSON.stringify(DESTINASI_BAWAAN)
        );
      }
    }
    muatDestinasi();
  }, []);

  const tukarTumpukanFoto = () => {
    setUrutanFoto((prev) => [prev[1], prev[2], prev[0]]);
  };

  const geserFotoDestinasi = (
    idDestinasi: string,
    arah: "kiri" | "kanan",
    totalFoto: number
  ) => {
    setSlidePerDestinasi((prev) => {
      const indexSekarang = prev[idDestinasi] || 0;
      const indexBaru =
        arah === "kanan"
          ? (indexSekarang + 1) % totalFoto
          : (indexSekarang - 1 + totalFoto) % totalFoto;
      return { ...prev, [idDestinasi]: indexBaru };
    });
  };

  const pilihTitikFoto = (idDestinasi: string, indexTarget: number) => {
    setSlidePerDestinasi((prev) => ({
      ...prev,
      [idDestinasi]: indexTarget,
    }));
  };

  return (
    <div className="min-h-screen bg-[#0B2528] text-[#F5F3ED]">
      <Navbar />

      <section className="sticky top-0 h-screen w-full overflow-hidden flex items-end z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/jelvantahero.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/30" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-20">
          <div ref={heroBoxRef} className="max-w-md">
            <h1 className="font-editorial text-4xl sm:text-5xl md:text-[52px] font-normal leading-[1.12] tracking-tight text-white mb-4">
              Seni Menjelajahi <br />
              <span className="italic font-normal">Nusantara</span>
            </h1>
            <p className="font-jakarta text-xs sm:text-sm text-white/85 leading-relaxed max-w-xs font-light tracking-wide">
              Pengalaman berlibur yang dirancang secara personal untuk setiap langkah perjalanan Anda.
            </p>
          </div>
        </div>
      </section>

      <div className="relative z-10 bg-[#F5F3ED] shadow-[0_-25px_60px_rgba(0,0,0,0.35)]">
        <section
          id="destinasi"
          className="bg-[#F5F3ED] text-[#2B2B28] py-20 md:py-28"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            <div className="lg:col-span-6">
              <div className="max-w-[520px] space-y-5">
                <p className="font-script text-2xl sm:text-[28px] text-[#537C78]">
                  Tur privat yang dirancang khusus
                </p>

                <h2 className="font-editorial text-2xl sm:text-3xl md:text-[34px] font-normal leading-[1.38] tracking-[-0.01em] text-[#2B2B28]">
                  Kami merancang perjalanan privat yang personal menuju sudut paling istimewa di Nusantara, karena kemewahan sejati adalah waktu yang dihabiskan dengan penuh makna.
                </h2>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div
                onClick={tukarTumpukanFoto}
                className="relative h-[440px] sm:h-[520px] w-full max-w-[500px] lg:ml-4 cursor-pointer select-none"
              >
                {TUMPUKAN_FOTO_VISI.map((item, idx) => {
                  const posisi = urutanFoto.indexOf(idx);
                  const isFront = posisi === 1;

                  let kelasPosisi = "";
                  if (posisi === 0) {
                    kelasPosisi =
                      "top-0 left-0 w-[64%] h-[86%] z-10 opacity-100 scale-100 shadow-md";
                  } else if (posisi === 1) {
                    kelasPosisi =
                      "bottom-4 right-0 w-[68%] h-[78%] z-20 opacity-100 scale-100 shadow-2xl";
                  } else {
                    kelasPosisi =
                      "top-6 left-6 w-[60%] h-[75%] z-0 opacity-0 scale-95 pointer-events-none";
                  }

                  return (
                    <div
                      key={item.id}
                      className={`absolute overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${kelasPosisi}`}
                    >
                      <img
                        src={item.url}
                        alt={item.lokasi}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent transition-opacity duration-500 ${
                          isFront ? "opacity-100" : "opacity-25"
                        }`}
                      />
                      <div
                        className={`absolute bottom-5 left-5 right-5 text-[#F5F3ED] transition-all duration-500 ${
                          isFront
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-3 pointer-events-none"
                        }`}
                      >
                        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#C6A878] mb-1">
                          {item.kategori}
                        </p>
                        <p className="font-editorial text-xl sm:text-2xl">
                          {item.lokasi}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section
          id="paket"
          className="bg-[#EFECE4] text-[#1E2623] py-24 md:py-32 border-t border-[#0B2528]/10"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-16">
            <div className="mb-16 space-y-2">
              <p className="font-script text-2xl sm:text-[28px] text-[#537C78]">
                Kurasi perjalanan terbaik
              </p>
              <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-[#0B2528]">
                Koleksi Ekspedisi Nusantara
              </h2>
            </div>

            <div className="space-y-24">
              {daftarDestinasi.map((item, index) => {
                const barisGenap = index % 2 === 1;
                const daftarFoto =
                  item.galeri && item.galeri.length > 0
                    ? item.galeri
                    : [item.gambar];
                const indexAktif =
                  (slidePerDestinasi[item.id] || 0) % daftarFoto.length;

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
                  >
                    <div
                      className={`lg:col-span-7 overflow-hidden ${
                        barisGenap ? "lg:order-2" : "lg:order-1"
                      }`}
                    >
                      <div className="relative h-[340px] sm:h-[450px] w-full overflow-hidden group shadow-lg">
                        {daftarFoto.map((fotoUrl, i) => (
                          <img
                            key={i}
                            src={fotoUrl}
                            alt={`${item.nama} ${i + 1}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                              i === indexAktif
                                ? "opacity-100 scale-100 z-10"
                                : "opacity-0 scale-105 z-0 pointer-events-none"
                            }`}
                          />
                        ))}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15 z-20 pointer-events-none" />

                        <div className="absolute top-5 left-5 z-30 px-4 py-1.5 rounded-full bg-[#F5F3ED]/95 text-[#0B2528] text-[11px] font-semibold uppercase tracking-widest shadow-sm">
                          {item.kategori}
                        </div>

                        {daftarFoto.length > 1 && (
                          <>
                            <div className="absolute bottom-5 left-5 z-30 flex items-center gap-2">
                              {daftarFoto.map((_, dotIdx) => (
                                <button
                                  key={dotIdx}
                                  type="button"
                                  onClick={() =>
                                    pilihTitikFoto(item.id, dotIdx)
                                  }
                                  aria-label={`Pilih foto ${dotIdx + 1}`}
                                  className={`h-1.5 rounded-full transition-all duration-300 ${
                                    dotIdx === indexAktif
                                      ? "w-7 bg-[#F5F3ED]"
                                      : "w-2 bg-[#F5F3ED]/45 hover:bg-[#F5F3ED]/80"
                                  }`}
                                />
                              ))}
                            </div>

                            <div className="absolute bottom-4 right-5 z-30 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  geserFotoDestinasi(
                                    item.id,
                                    "kiri",
                                    daftarFoto.length
                                  )
                                }
                                aria-label="Foto sebelumnya"
                                className="w-10 h-10 rounded-full bg-[#0B2528]/75 backdrop-blur-md border border-[#F5F3ED]/25 text-[#F5F3ED] flex items-center justify-center hover:bg-[#C6A878] hover:text-[#0B2528] hover:border-[#C6A878] transition-all duration-300"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  geserFotoDestinasi(
                                    item.id,
                                    "kanan",
                                    daftarFoto.length
                                  )
                                }
                                aria-label="Foto selanjutnya"
                                className="w-10 h-10 rounded-full bg-[#0B2528]/75 backdrop-blur-md border border-[#F5F3ED]/25 text-[#F5F3ED] flex items-center justify-center hover:bg-[#C6A878] hover:text-[#0B2528] hover:border-[#C6A878] transition-all duration-300"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div
                      className={`lg:col-span-5 space-y-6 ${
                        barisGenap ? "lg:order-1" : "lg:order-2"
                      }`}
                    >
                      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-[#537C78] font-semibold">
                        <span>0{index + 1}</span>
                        <span>{item.lokasi}</span>
                      </div>

                      <h3 className="font-editorial text-2xl sm:text-4xl font-normal text-[#0B2528] leading-snug">
                        {item.nama}
                      </h3>

                      <p className="text-sm text-[#2B2B28]/75 leading-relaxed">
                        {item.deskripsi}
                      </p>

                      <div className="flex items-center gap-6 pt-2 text-xs text-[#0B2528]/75">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#537C78]" />
                          {item.durasi}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-[#537C78]" />
                          Sisa {item.kuota} Kursi
                        </span>
                      </div>

                      <div className="pt-5 border-t border-[#0B2528]/15 flex items-center justify-between">
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
                          href={`/destinations/${item.id}`}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B2528] text-[#F5F3ED] text-xs font-semibold uppercase tracking-wider hover:bg-[#537C78] transition-all"
                        >
                          <span>Jelajahi</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="tentang"
          className="bg-[#0B2528] text-[#F5F3ED] py-24 md:py-32"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-16">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="font-script text-2xl text-[#C6A878] mb-2">
                Standar layanan kami
              </p>
              <h2 className="font-editorial text-3xl sm:text-5xl font-normal">
                Dedikasi Terhadap Kesempurnaan Perjalanan
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-[#0F3135] border border-[#537C78]/30 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#C6A878]/15 border border-[#C6A878]/40 flex items-center justify-center">
                  <Compass className="w-5 h-5 text-[#C6A878]" />
                </div>
                <h3 className="font-editorial text-2xl font-normal">
                  Rute Ekspedisi Terkurasi
                </h3>
                <p className="text-sm text-[#F5F3ED]/75 leading-relaxed">
                  Setiap jadwal perjalanan disusun secara cermat untuk menghadirkan pengalaman autentik di setiap sudut Nusantara.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-[#0F3135] border border-[#537C78]/30 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#C6A878]/15 border border-[#C6A878]/40 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#C6A878]" />
                </div>
                <h3 className="font-editorial text-2xl font-normal">
                  Akomodasi & Armada Privat
                </h3>
                <p className="text-sm text-[#F5F3ED]/75 leading-relaxed">
                  Seluruh paket sudah mencakup penginapan resor pilihan, kapal Phinisi atau kendaraan privat, serta perlindungan perjalanan penuh.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-[#0F3135] border border-[#537C78]/30 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#C6A878]/15 border border-[#C6A878]/40 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#C6A878]" />
                </div>
                <h3 className="font-editorial text-2xl font-normal">
                  Reservasi Mudah & Transparan
                </h3>
                <p className="text-sm text-[#F5F3ED]/75 leading-relaxed">
                  Pesan jadwal keberangkatan langsung melalui website dan pantau status tiket elektronik Anda kapan saja.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="kontak"
          className="bg-[#0B2528] max-w-7xl mx-auto px-6 md:px-16 pb-24"
        >
          <div className="rounded-3xl bg-[#0F3135] border border-[#C6A878]/40 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-[#C6A878]">
                Konsultasi Perjalanan
              </p>
              <h2 className="font-editorial text-2xl sm:text-4xl font-normal text-[#F5F3ED]">
                Rencanakan Liburan Impian Anda Bersama Tim Kami
              </h2>
              <p className="text-sm text-[#F5F3ED]/75">
                Tim perancang perjalanan Jelvanta siap membantu menyusun jadwal keberangkatan privat maupun grup sesuai kebutuhan Anda.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <a
                href="tel:+6281290008899"
                className="px-6 py-3.5 rounded-full bg-[#C6A878] text-[#0B2528] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#F5F3ED] transition-all"
              >
                <Phone className="w-4 h-4" />
                Hubungi Concierge
              </a>
              <Link
                href="/booking"
                className="px-6 py-3.5 rounded-full border border-[#C6A878] text-[#F5F3ED] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#C6A878] hover:text-[#0B2528] transition-all"
              >
                <Mail className="w-4 h-4" />
                Cek Status Pesanan
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}