import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  supabaseUrl.startsWith("http");

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface Destinasi {
  id: string;
  nama: string;
  lokasi: string;
  kategori: string;
  durasi: string;
  harga: number;
  rating: number;
  kuota: number;
  gambar: string;
  galeri?: string[];
  deskripsi: string;
  fasilitas: string[];
  itinerary: { hari: string; judul: string; kegiatan: string }[];
}

export interface Pesanan {
  id: string;
  kode_booking: string;
  destinasi_id: string;
  nama_destinasi: string;
  nama_pemesan: string;
  email: string;
  telepon: string;
  tanggal_berangkat: string;
  jumlah_peserta: number;
  total_harga: number;
  metode_pembayaran: string;
  status: "Menunggu Pembayaran" | "Terkonfirmasi" | "Dibatalkan";
  catatan: string;
  created_at: string;
}

export const DESTINASI_BAWAAN: Destinasi[] = [
  {
    id: "labuan-bajo",
    nama: "Ekspedisi Phinisi Labuan Bajo",
    lokasi: "Nusa Tenggara Timur",
    kategori: "Bahari & Kapal Pesiar",
    durasi: "4 Hari 3 Malam",
    harga: 6850000,
    rating: 4.9,
    kuota: 8,
    gambar:
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1400&q=85",
    galeri: [
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85",
    ],
    deskripsi:
      "Berlayar melintasi Taman Nasional Komodo menggunakan kapal Phinisi kabin privat. Nikmati matahari terbit dari puncak Pulau Padar, bersantai di Pink Beach, dan menyelam bersama pari manta di Manta Point.",
    fasilitas: [
      "Kabin Privat Kapal Phinisi Ber-AC",
      "Antar Jemput Bandara Komodo",
      "Koki Pribadi & Sajian Kuliner Lengkap",
      "Peralatan Snorkeling & Dokumentasi Drone",
      "Tiket Masuk Taman Nasional Komodo",
    ],
    itinerary: [
      {
        hari: "Hari 01",
        judul: "Penyambutan & Pelayaran Pulau Kelor",
        kegiatan:
          "Penjemputan di Bandara Komodo menuju pelabuhan, dilanjutkan berlayar ke Pulau Kelor dan menikmati senja di Pulau Kalong.",
      },
      {
        hari: "Hari 02",
        judul: "Puncak Pulau Padar & Pink Beach",
        kegiatan:
          "Pendakian pagi di Pulau Padar, bersantai di Pink Beach, serta melihat komodo secara langsung bersama ranger resmi.",
      },
      {
        hari: "Hari 03",
        judul: "Manta Point & Taka Makassar",
        kegiatan:
          "Berenang bersama pari manta di perairan jernih dan bersantai di hamparan pasir timbul Taka Makassar.",
      },
      {
        hari: "Hari 04",
        judul: "Pulau Kanawa & Kepulangan",
        kegiatan:
          "Sarapan di atas dek kapal sambil menikmati pemandangan Pulau Kanawa sebelum kembali ke pelabuhan Labuan Bajo.",
      },
    ],
  },
  {
    id: "raja-ampat",
    nama: "Surga Tersembunyi Raja Ampat",
    lokasi: "Papua Barat Daya",
    kategori: "Eksplorasi Pulau",
    durasi: "5 Hari 4 Malam",
    harga: 11500000,
    rating: 5.0,
    kuota: 6,
    gambar:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=85",
    galeri: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=1400&q=85",
    ],
    deskripsi:
      "Menjelajahi gugusan pulau karst Piaynemo dan Wayag yang ikonik. Menginap di resor atas air eksklusif dengan akses langsung ke terumbu karang terkaya di dunia.",
    fasilitas: [
      "Resor Atas Air Eksklusif 4 Malam",
      "Speedboat Privat Selama Perjalanan",
      "Pemandu Lokal & Instruktur Selam",
      "Izin Masuk Kawasan Konservasi Raja Ampat",
      "Hidangan Laut Segar Setiap Hari",
    ],
    itinerary: [
      {
        hari: "Hari 01",
        judul: "Tiba di Sorong & Menuju Waisai",
        kegiatan:
          "Penjemputan di Bandara Domine Eduard Osok Sorong, menyeberang menggunakan kapal cepat menuju resor di Raja Ampat.",
      },
      {
        hari: "Hari 02",
        judul: "Puncak Karst Piaynemo & Telaga Bintang",
        kegiatan:
          "Menjelajahi panorama gugusan pulau Piaynemo dan Telaga Bintang, dilanjutkan menyelam di Yenbuba.",
      },
      {
        hari: "Hari 03",
        judul: "Desa Wisata Arborek & Pasir Timbul",
        kegiatan:
          "Mengunjungi desa budaya Arborek dan bersantai di hamparan Pasir Timbul Mansuar saat air surut.",
      },
      {
        hari: "Hari 04",
        judul: "Kalibiru Warsambin yang Jernih",
        kegiatan:
          "Menyusuri hutan menuju sungai Kalibiru dengan air sebening kristal di pedalaman Teluk Mayalibit.",
      },
      {
        hari: "Hari 05",
        judul: "Kepulangan Menuju Sorong",
        kegiatan:
          "Menikmati pagi tenang di beranda resor sebelum kembali menuju Bandara Sorong.",
      },
    ],
  },
  {
    id: "ubud-bali",
    nama: "Retret Budaya & Lembah Hijau Ubud",
    lokasi: "Bali",
    kategori: "Budaya & Relaksasi",
    durasi: "3 Hari 2 Malam",
    harga: 4200000,
    rating: 4.8,
    kuota: 12,
    gambar:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=85",
    galeri: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=1400&q=85",
    ],
    deskripsi:
      "Menemukan ketenangan di vila tepi jurang lembah Sungai Ayung. Paket ini mencakup sesi spa tradisional Bali, jamuan makan malam romantis, dan eksplorasi terasering sawah Tegalalang.",
    fasilitas: [
      "Vila Privat dengan Infinity Pool",
      "Mobil Premium & Sopir Pribadi",
      "Sesi Spa Tradisional Bali 120 Menit",
      "Jamuan Makan Malam Fine Dining Lembah Ubud",
      "Tiket Masuk Destinasi Budaya",
    ],
    itinerary: [
      {
        hari: "Hari 01",
        judul: "Kedatangan & Relaksasi Vila Lembah",
        kegiatan:
          "Penjemputan privat dari Bandara Ngurah Rai menuju vila di Ubud dilanjutkan sesi teh sore menghadap hutan tropis.",
      },
      {
        hari: "Hari 02",
        judul: "Tegalalang, Tirta Empul & Spa",
        kegiatan:
          "Berjalan pagi di persawahan Tegalalang, kunjungan budaya ke Pura Tirta Empul, dan ditutup sesi spa relaksasi.",
      },
      {
        hari: "Hari 03",
        judul: "Pasar Seni Ubud & Kepulangan",
        kegiatan:
          "Sarapan terapung di kolam vila dan berbelanja kerajinan tangan kurasi sebelum diantar kembali ke bandara.",
      },
    ],
  },
  {
    id: "kaldera-bromo",
    nama: "Fajar Mistis Kaldera Bromo",
    lokasi: "Jawa Timur",
    kategori: "Petualangan Gunung",
    durasi: "3 Hari 2 Malam",
    harga: 3450000,
    rating: 4.9,
    kuota: 10,
    gambar:
      "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1400&q=85",
    galeri: [
      "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1400&q=85",
    ],
    deskripsi:
      "Menyaksikan kemegahan matahari terbit di atas kaldera Gunung Bromo dan Semeru. Dilengkapi pengalaman piknik sarapan hangat di tengah lautan pasir berbisik menggunakan armada Land Cruiser 4x4 privat.",
    fasilitas: [
      "Hotel Bintang 4 Lereng Bromo",
      "Armada Toyota Land Cruiser 4x4 Privat",
      "Piknik Sarapan Eksklusif di Lautan Pasir",
      "Fotografer Profesional Selama Tur",
      "Tiket Masuk Taman Nasional Bromo Tengger Semeru",
    ],
    itinerary: [
      {
        hari: "Hari 01",
        judul: "Kedatangan di Malang & Menuju Tosari",
        kegiatan:
          "Penjemputan di Stasiun atau Bandara Malang menuju penginapan dataran tinggi dengan pemandangan lembah.",
      },
      {
        hari: "Hari 02",
        judul: "Golden Sunrise Bukit Kingkong & Kawah Bromo",
        kegiatan:
          "Perjalanan dini hari dengan Jeep 4x4 menuju titik matahari terbit, dilanjutkan piknik di Bukit Teletubbies dan pendakian kawah.",
      },
      {
        hari: "Hari 03",
        judul: "Air Terjun Madakaripura & Kepulangan",
        kegiatan:
          "Mengunjungi air terjun tersembunyi Madakaripura sebelum pengantaran kembali ke kota Malang atau Surabaya.",
      },
    ],
  },
];

export const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
};