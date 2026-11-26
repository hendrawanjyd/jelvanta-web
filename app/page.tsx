"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Destination, formatRupiah, getDestinations } from "@/lib/api";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Users,
  Compass,
  Shield,
  Calendar,
  Mail,
  ChevronLeft,
  ChevronRight,
  Ticket,
} from "lucide-react";

const SOROTAN_DESTINASI = [
  {
    id: "sorotan-1",
    url: "https://plus.unsplash.com/premium_photo-1723921232154-574f9172f3f4?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    judulBaris1: "Warisan Budaya",
    judulBaris2: "Penuh Warna",
    lokasi: "Tradisi & Budaya Nusantara",
    deskripsi:
      "Abadikan setiap momen di tengah kekayaan tradisi, perayaan penuh warna, dan kisah budaya lokal yang dirancang khusus untuk perjalanan personal Anda.",
    tautanLabel: "Jelajahi Pengalaman Budaya Terbaik",
    tautanHref: "/destinations",
  },
  {
    id: "sorotan-2",
    url: "https://images.unsplash.com/photo-1634671813653-c817a18c2398?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    judulBaris1: "Peristirahatan Privat",
    judulBaris2: "Di Atas Lautan",
    lokasi: "Vila Terapung Nusantara",
    deskripsi:
      "Bangun di atas perairan sebening kristal bersama vila kayu privat, hamparan pasir putih, dan ketenangan pulau tropis yang jauh dari hiruk pikuk keseharian.",
    tautanLabel: "Jelajahi Peristirahatan Pulau Terbaik",
    tautanHref: "/destinations",
  },
  {
    id: "sorotan-3",
    url: "https://images.unsplash.com/photo-1560477936-d27e03b6cb55?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    judulBaris1: "Eksplorasi Bahari",
    judulBaris2: "Taman Laut Jernih",
    lokasi: "Perairan Tropis Nusantara",
    deskripsi:
      "Berlayar menuju gugusan terumbu karang alami dengan perahu privat, menyelam di perairan biru toska yang jernih, dan nikmati petualangan laut tak terlupakan.",
    tautanLabel: "Jelajahi Ekspedisi Bahari Terbaik",
    tautanHref: "/destinations",
  },
];

export default function HomePage() {
  const heroBoxRef = useRef<HTMLDivElement>(null);

  const [indexSorotan, setIndexSorotan] = useState(0);
  const [daftarDestinasi, setDaftarDestinasi] = useState<Destination[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [slidePerDestinasi, setSlidePerDestinasi] = useState<
    Record<number, number>
  >({});

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
    let aktif = true;

    async function muatDestinasi() {
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

    muatDestinasi();

    return () => {
      aktif = false;
    };
  }, []);

  const pindahSorotan = (targetIndex: number) => {
    if (
      targetIndex === indexSorotan ||
      targetIndex < 0 ||
      targetIndex >= SOROTAN_DESTINASI.length
    ) {
      return;
    }
    setIndexSorotan(targetIndex);
  };

  const geserFotoDestinasi = (
    idDestinasi: number,
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

  const pilihTitikFoto = (idDestinasi: number, indexTarget: number) => {
    setSlidePerDestinasi((prev) => ({
      ...prev,
      [idDestinasi]: indexTarget,
    }));
  };

  const bisaMundur = indexSorotan > 0;
  const bisaMaju = indexSorotan < SOROTAN_DESTINASI.length - 1;
  const destinasiUnggulan = daftarDestinasi.slice(0, 3);

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

        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2528]/70 via-[#0B2528]/10 to-[#0B2528]/30" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-20">
          <div ref={heroBoxRef} className="max-w-md">
            <h1 className="font-editorial text-4xl sm:text-5xl md:text-[52px] font-normal leading-[1.12] tracking-tight text-[#F5F3ED] mb-4">
              Seni Menjelajahi <br />
              <span className="italic font-normal">Nusantara</span>
            </h1>
            <p className="font-jakarta text-xs sm:text-sm text-[#F5F3ED]/85 leading-relaxed max-w-xs font-light tracking-wide">
              Pengalaman berlibur yang dirancang secara personal untuk setiap langkah perjalanan Anda.
            </p>
          </div>
        </div>
      </section>

      <div className="relative z-10 bg-[#EFECE4] shadow-[0_-25px_60px_rgba(11,37,40,0.35)]">
        <section
          id="destinasi"
          className="relative bg-[#EFECE4] text-[#2B2B28] py-16 md:py-24 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="relative">
              <div className="hidden lg:block absolute inset-y-0 left-0 w-[60%] bg-[#F8F6F1]" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-8 py-6 lg:py-14 lg:pl-12">
                <div className="w-full lg:w-[39%] shrink-0 bg-[#F8F6F1] lg:bg-transparent p-7 sm:p-9 lg:p-0 lg:pr-6">
                  <div className="grid">
                    {SOROTAN_DESTINASI.map((item, idx) => {
                      const aktif = idx === indexSorotan;
                      return (
                        <div
                          key={item.id}
                          aria-hidden={!aktif}
                          className={`col-start-1 row-start-1 self-start transition-opacity ease-in-out ${
                            aktif
                              ? "opacity-100 duration-500 delay-200 z-10"
                              : "opacity-0 duration-200 delay-0 z-0 pointer-events-none"
                          }`}
                        >
                          <h2 className="font-jakarta text-[28px] sm:text-[32px] md:text-[34px] font-bold leading-[1.2] tracking-[-0.02em] text-[#0B2528]">
                            {item.judulBaris1}
                            <br />
                            {item.judulBaris2}
                          </h2>

                          <div className="w-10 h-[2.5px] bg-[#C6A878] mt-5 mb-6" />

                          <p className="font-jakarta text-sm sm:text-[15px] text-[#2B2B28]/80 leading-[1.7] max-w-[380px]">
                            {item.deskripsi}
                          </p>

                          <div className="pt-8">
                            <Link
                              href={item.tautanHref}
                              tabIndex={aktif ? 0 : -1}
                              className="group inline-flex items-center gap-2.5 font-jakarta text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] text-[#0B2528] hover:text-[#537C78] transition-colors"
                            >
                              <span>{item.tautanLabel}</span>
                              <ArrowRight className="w-4 h-4 text-[#C6A878] transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div
                  className="w-full lg:w-[61%] relative [--active-w:84vw] [--inactive-w:84vw] [--gap:14px] [--active-h:320px] [--inactive-h:320px] sm:[--active-w:400px] sm:[--inactive-w:180px] sm:[--gap:18px] sm:[--active-h:430px] sm:[--inactive-h:345px] lg:[--active-w:380px] lg:[--inactive-w:165px] lg:[--gap:18px] lg:[--active-h:430px] lg:[--inactive-h:345px] xl:[--active-w:460px] xl:[--inactive-w:195px] xl:[--gap:20px] xl:[--active-h:455px] xl:[--inactive-h:365px]"
                  style={{ "--active-idx": indexSorotan } as CSSProperties}
                >
                  <div className="overflow-hidden w-full h-[var(--active-h)]">
                    <div
                      className="flex items-start transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
                      style={{
                        gap: "var(--gap)",
                        transform:
                          "translateX(calc(var(--active-idx) * -1 * (var(--inactive-w) + var(--gap))))",
                      }}
                    >
                      {SOROTAN_DESTINASI.map((item, idx) => {
                        const aktif = idx === indexSorotan;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => pindahSorotan(idx)}
                            aria-label={`Tampilkan ${item.lokasi}`}
                            style={{
                              width: aktif
                                ? "var(--active-w)"
                                : "var(--inactive-w)",
                              height: aktif
                                ? "var(--active-h)"
                                : "var(--inactive-h)",
                            }}
                            className={`relative shrink-0 overflow-hidden bg-[#0B2528]/10 text-left transition-[width,height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                              aktif
                                ? "shadow-md cursor-default"
                                : "shadow-xs cursor-pointer group"
                            }`}
                          >
                            <img
                              src={item.url}
                              alt={item.lokasi}
                              className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                                aktif ? "scale-100" : "group-hover:scale-105"
                              }`}
                            />
                            <div
                              className={`absolute inset-0 transition-opacity duration-500 ${
                                aktif
                                  ? "bg-[#0B2528]/0 opacity-0"
                                  : "bg-[#0B2528]/15 opacity-100 group-hover:opacity-0"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-0 sm:absolute sm:bottom-1 sm:left-[calc(var(--active-w)+var(--gap))] flex items-center gap-3 z-20">
                    <button
                      type="button"
                      onClick={() => pindahSorotan(indexSorotan - 1)}
                      disabled={!bisaMundur}
                      aria-label="Sorotan sebelumnya"
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                        bisaMundur
                          ? "bg-[#0B2528] text-[#F5F3ED] hover:bg-[#537C78] active:scale-95 cursor-pointer"
                          : "bg-[#DFDCD3] text-[#2B2B28]/35 cursor-not-allowed"
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => pindahSorotan(indexSorotan + 1)}
                      disabled={!bisaMaju}
                      aria-label="Sorotan selanjutnya"
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                        bisaMaju
                          ? "bg-[#0B2528] text-[#F5F3ED] hover:bg-[#537C78] active:scale-95 cursor-pointer"
                          : "bg-[#DFDCD3] text-[#2B2B28]/35 cursor-not-allowed"
                      }`}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="paket"
          className="bg-[#EFECE4] text-[#1E2623] py-24 md:py-32 border-t border-[#0B2528]/10"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-16">
            <div className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="space-y-2">
                <p className="font-script text-2xl sm:text-[28px] text-[#537C78]">
                  Kurasi perjalanan terbaik
                </p>
                <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-[#0B2528]">
                  Koleksi Ekspedisi Nusantara
                </h2>
              </div>

              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0B2528] hover:text-[#537C78] transition-colors"
              >
                <span>Lihat Semua ({daftarDestinasi.length})</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {sedangMemuat ? (
              <div className="py-16 text-center text-sm text-[#2B2B28]/65">
                Memuat koleksi ekspedisi Nusantara...
              </div>
            ) : pesanError ? (
              <div className="p-8 rounded-2xl bg-[#F5F3ED] border border-red-300 text-center space-y-2">
                <p className="text-sm font-semibold text-red-700">
                  Tidak dapat terhubung ke server destinasi
                </p>
                <p className="text-xs text-[#2B2B28]/70">{pesanError}</p>
              </div>
            ) : destinasiUnggulan.length === 0 ? (
              <div className="py-16 text-center text-sm text-[#2B2B28]/65">
                Belum ada paket ekspedisi yang tersedia saat ini.
              </div>
            ) : (
              <>
                <div className="space-y-24">
                  {destinasiUnggulan.map((item, index) => {
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

                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B2528]/45 via-transparent to-[#0B2528]/15 z-20 pointer-events-none" />

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
                            <span>{String(index + 1).padStart(2, "0")}</span>
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
                              href={`/destinations/${item.slug}`}
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

                {daftarDestinasi.length > 3 && (
                  <div className="mt-20 text-center">
                    <Link
                      href="/destinations"
                      className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#0B2528] text-[#F5F3ED] text-xs font-bold uppercase tracking-widest hover:bg-[#537C78] transition-all"
                    >
                      <span>
                        Jelajahi Seluruh {daftarDestinasi.length} Koleksi Ekspedisi
                      </span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </>
            )}
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

            <div className="mt-12 text-center">
              <Link
                href="/tentang"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C6A878] hover:text-[#F5F3ED] transition-colors"
              >
                <span>Kenali Kisah & Filosofi Kami</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
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
              <Link
                href="/kontak"
                className="px-6 py-3.5 rounded-full bg-[#C6A878] text-[#0B2528] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#F5F3ED] transition-all"
              >
                <Mail className="w-4 h-4" />
                Kirim Pesan Konsultasi
              </Link>
              <Link
                href="/booking"
                className="px-6 py-3.5 rounded-full border border-[#C6A878] text-[#F5F3ED] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#C6A878] hover:text-[#0B2528] transition-all"
              >
                <Ticket className="w-4 h-4" />
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