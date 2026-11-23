import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#07191B] text-[#F5F3ED] border-t border-[#537C78]/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#537C78]/20">
        <div className="space-y-4 md:col-span-2">
          <span className="font-playfair text-2xl font-bold tracking-[0.25em] uppercase text-[#F5F3ED] block">
            JELVANTA
          </span>
          <p className="text-sm text-[#F5F3ED]/70 max-w-md leading-relaxed">
            Kurator perjalanan dan ekspedisi wisata mewah Nusantara. Kami menghadirkan pengalaman eksklusif menuju keindahan alam dan budaya terbaik di Indonesia.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C6A878]">
            Eksplorasi
          </h4>
          <ul className="space-y-2.5 text-sm text-[#F5F3ED]/70">
            <li>
              <Link href="/" className="hover:text-[#C6A878] transition-colors">
                Beranda Utama
              </Link>
            </li>
            <li>
              <Link
                href="/#destinasi"
                className="hover:text-[#C6A878] transition-colors"
              >
                Koleksi Destinasi
              </Link>
            </li>
            <li>
              <Link
                href="/booking"
                className="hover:text-[#C6A878] transition-colors"
              >
                Cek Status Tiket
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className="hover:text-[#C6A878] transition-colors"
              >
                Panel Pengelola
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C6A878]">
            Layanan Pelanggan
          </h4>
          <ul className="space-y-2.5 text-sm text-[#F5F3ED]/70">
            <li className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#C6A878] shrink-0" />
              Bekasi & Jakarta, Indonesia
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#C6A878] shrink-0" />
              +62 812 9000 8899
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#C6A878] shrink-0" />
              concierge@jelvanta.id
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F5F3ED]/50 gap-4">
        <p>Hak Cipta 2026 Jelvanta Indonesia. Seluruh hak dilindungi.</p>
        <p>Keindahan Nusantara dalam Kemewahan Perjalanan.</p>
      </div>
    </footer>
  );
}