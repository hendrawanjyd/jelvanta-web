"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, ArrowUpRight } from "lucide-react";

const MENU_NAVIGASI = [
  { label: "Beranda", href: "/" },
  { label: "Destinasi", href: "/destinations" },
  { label: "Cek Pesanan", href: "/booking" },
  { label: "Tentang Kami", href: "/tentang" },
  { label: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isAtTop, setIsAtTop] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 30);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cekAktif = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const bookingAktif = pathname.startsWith("/destinations");
  const akunAktif = pathname.startsWith("/akun");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isAtTop
          ? "bg-gradient-to-b from-[#0B2528]/45 to-transparent py-6"
          : "bg-[#F5F3ED] py-4 shadow-[0_6px_24px_rgba(11,37,40,0.06)]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/">
          <span
            className={`font-logo text-2xl md:text-[26px] tracking-[0.26em] uppercase transition-colors duration-300 ${
              isAtTop ? "text-[#F5F3ED]" : "text-[#0B2528]"
            }`}
          >
            JELVANTA
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9 text-[13px] tracking-[0.03em]">
          {MENU_NAVIGASI.map((item) => {
            const aktif = cekAktif(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors duration-300 ${
                  isAtTop
                    ? aktif
                      ? "text-[#F5F3ED] font-semibold"
                      : "text-[#F5F3ED]/65 font-normal hover:text-[#F5F3ED]"
                    : aktif
                      ? "text-[#0B2528] font-semibold"
                      : "text-[#2B2B28]/55 font-normal hover:text-[#0B2528]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3.5">
          <Link
            href="/akun"
            title="Akun Saya"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isAtTop
                ? akunAktif
                  ? "bg-[#0B2528] border border-[#0B2528] text-[#F5F3ED] hover:bg-[#143D42] hover:border-[#143D42]"
                  : "border border-[#F5F3ED]/30 text-[#F5F3ED] hover:bg-[#0B2528] hover:border-[#0B2528]"
                : akunAktif
                  ? "bg-[#143D42] text-[#F5F3ED] hover:bg-[#0B2528]"
                  : "bg-[#0B2528] text-[#F5F3ED] hover:bg-[#143D42]"
            }`}
          >
            <User className="w-4 h-4 stroke-[1.8]" />
          </Link>

          <Link
            href="/destinations"
            className={`group px-5 py-2.5 rounded-full text-[11px] font-semibold tracking-[0.14em] uppercase transition-all duration-300 flex items-center gap-2 ${
              isAtTop
                ? bookingAktif
                  ? "bg-[#0B2528] text-[#F5F3ED] hover:bg-[#143D42]"
                  : "bg-[#F5F3ED] text-[#0B2528] hover:bg-[#0B2528] hover:text-[#F5F3ED]"
                : bookingAktif
                  ? "bg-[#143D42] text-[#F5F3ED] hover:bg-[#0B2528]"
                  : "bg-[#0B2528] text-[#F5F3ED] hover:bg-[#143D42]"
            }`}
          >
            <span>Booking Sekarang</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`lg:hidden p-2 transition-colors ${
            isAtTop ? "text-[#F5F3ED]" : "text-[#0B2528]"
          }`}
          aria-label="Menu Navigasi"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          className={`lg:hidden px-6 py-6 space-y-3 transition-colors ${
            isAtTop
              ? "bg-[#0B2528]/95 text-[#F5F3ED]"
              : "bg-[#F5F3ED] text-[#0B2528] shadow-lg"
          }`}
        >
          {MENU_NAVIGASI.map((item) => {
            const aktif = cekAktif(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-sm transition-colors ${
                  isAtTop
                    ? aktif
                      ? "text-[#F5F3ED] font-semibold"
                      : "text-[#F5F3ED]/65 hover:text-[#F5F3ED]"
                    : aktif
                      ? "text-[#0B2528] font-semibold"
                      : "text-[#2B2B28]/55 hover:text-[#0B2528]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-4 mt-2 flex items-center gap-4 border-t border-current/10">
            <Link
              href="/akun"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isAtTop
                  ? "border border-[#F5F3ED]/30 text-[#F5F3ED] hover:bg-[#0B2528] hover:border-[#0B2528]"
                  : "bg-[#0B2528] text-[#F5F3ED] hover:bg-[#143D42]"
              }`}
              aria-label="Akun Saya"
            >
              <User className="w-4 h-4 stroke-[1.8]" />
            </Link>
            <Link
              href="/destinations"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                isAtTop
                  ? "bg-[#F5F3ED] text-[#0B2528] hover:bg-[#0B2528] hover:text-[#F5F3ED]"
                  : "bg-[#0B2528] text-[#F5F3ED] hover:bg-[#143D42]"
              }`}
            >
              Booking Sekarang
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}