import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Compass,
  Shield,
  Calendar,
  Award,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const PILAR_LAYANAN = [
  {
    ikon: Compass,
    judul: "Rute Ekspedisi Terkurasi",
    deskripsi:
      "Setiap destinasi dan jadwal perjalanan disusun langsung bersama pemandu lokal berpengalaman agar Anda merasakan sisi paling autentik dari Nusantara.",
  },
  {
    ikon: Shield,
    judul: "Akomodasi & Armada Privat",
    deskripsi:
      "Mulai dari kabin kapal Phinisi privat, resor pilihan di tepi pantai, hingga kendaraan eksklusif dengan standar keamanan dan asuransi perjalanan penuh.",
  },
  {
    ikon: Calendar,
    judul: "Reservasi Transparan",
    deskripsi:
      "Proses pemesanan langsung melalui sistem kami dengan rincian biaya yang jelas, pemotongan kuota real-time, dan pelacakan status e-tiket kapan saja.",
  },
];

const KEUNGGULAN_ANGKA = [
  { angka: "100%", label: "Jadwal Privat & Fleksibel" },
  { angka: "24/7", label: "Pendampingan Concierge" },
  { angka: "50+", label: "Mitra Resor & Phinisi Pilihan" },
  { angka: "4.9", label: "Rata-rata Kepuasan Pelanggan" },
];

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-[#0B2528] text-[#F5F3ED]">
      <Navbar />

      <section className="pt-36 pb-20 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F3135] border border-[#C6A878]/40 text-xs uppercase tracking-widest text-[#C6A878]">
              <Sparkles className="w-3.5 h-3.5" />
              Tentang Jelvanta
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.15]">
              Menghadirkan Seni Perjalanan yang Personal di Nusantara
            </h1>

            <p className="text-sm sm:text-base text-[#F5F3ED]/75 leading-relaxed">
              JELVANTA lahir dari keyakinan bahwa perjalanan terbaik bukanlah sekadar berpindah tempat, melainkan rangkaian momen bermakna yang dirancang dengan ketenangan, privasi, dan ketelitian di setiap detailnya.
            </p>

            <p className="text-sm text-[#F5F3ED]/70 leading-relaxed">
              Dari perairan eksotis Labuan Bajo dan Raja Ampat hingga ketenangan budaya Ubud dan pesona alam Danau Toba, tim kurator kami merancang setiap ekspedisi agar Anda cukup menikmati perjalanan sementara seluruh logistik kami tangani sepenuhnya.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden h-[420px] sm:h-[500px] border border-[#537C78]/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1200&q=85"
                alt="Keindahan Nusantara bersama Jelvanta"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2528]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-[#0B2528]/80 backdrop-blur-md border border-[#C6A878]/30">
                <p className="font-script text-2xl text-[#C6A878] mb-1">
                  Filosofi Kami
                </p>
                <p className="text-xs sm:text-sm text-[#F5F3ED]/85 leading-relaxed">
                  Kemewahan sejati adalah waktu berkualitas yang dihabiskan tanpa tergesa bersama orang terdekat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0F3135] border-y border-[#537C78]/30 py-14">
        <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {KEUNGGULAN_ANGKA.map((item) => (
            <div key={item.label} className="space-y-1.5">
              <p className="font-editorial text-3xl sm:text-4xl text-[#C6A878]">
                {item.angka}
              </p>
              <p className="text-xs sm:text-sm text-[#F5F3ED]/75">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F5F3ED] text-[#1E2623] py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="max-w-2xl mb-14 space-y-2">
            <p className="font-script text-2xl text-[#537C78]">
              Standar layanan kami
            </p>
            <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-[#0B2528]">
              Dedikasi Terhadap Kesempurnaan Perjalanan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PILAR_LAYANAN.map((pilar) => {
              const Icon = pilar.ikon;
              return (
                <div
                  key={pilar.judul}
                  className="p-8 rounded-3xl bg-[#EFECE4] border border-[#0B2528]/10 space-y-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#0B2528] text-[#C6A878] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-editorial text-2xl font-normal text-[#0B2528]">
                    {pilar.judul}
                  </h3>
                  <p className="text-sm text-[#2B2B28]/75 leading-relaxed">
                    {pilar.deskripsi}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#0B2528] py-20 px-6 md:px-16">
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#0F3135] border border-[#C6A878]/40 p-10 md:p-14 text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-[#C6A878]/15 border border-[#C6A878]/40 flex items-center justify-center mx-auto">
            <Award className="w-5 h-5 text-[#C6A878]" />
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-normal">
            Siap Merancang Ekspedisi Berikutnya?
          </h2>
          <p className="text-sm text-[#F5F3ED]/75 max-w-xl mx-auto">
            Jelajahi koleksi perjalanan terkurasi kami atau diskusikan rencana liburan privat Anda bersama tim concierge Jelvanta.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/destinations"
              className="px-7 py-3.5 rounded-full bg-[#C6A878] text-[#0B2528] text-xs font-bold uppercase tracking-widest hover:bg-[#F5F3ED] transition-all inline-flex items-center gap-2"
            >
              <span>Jelajahi Destinasi</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/kontak"
              className="px-7 py-3.5 rounded-full border border-[#C6A878] text-[#F5F3ED] text-xs font-bold uppercase tracking-widest hover:bg-[#C6A878] hover:text-[#0B2528] transition-all"
            >
              Hubungi Tim Kami
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}