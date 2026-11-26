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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isAtTop
          ? "bg-gradient-to-b from-[#0B2528]/50 to-transparent py-6"
          : "bg-[#F5F3ED]/95 backdrop-blur-md py-4 shadow-[0_6px_24px_rgba(11,37,40,0.08)]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="group">
          <span
            className={`font-logo text-2xl md:text-[26px] tracking-[0.24em] uppercase transition-colors duration-300 ${
              isAtTop
                ? "text-[#F5F3ED] group-hover:text-[#C6A878]"
                : "text-[#0B2528] group-hover:text-[#537C78]"
            }`}
          >
            JELVANTA
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9 text-[13px] tracking-wide font-normal">
          {MENU_NAVIGASI.map((item) => {
            const aktif = cekAktif(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors duration-300 ${
                  isAtTop
                    ? aktif
                      ? "text-[#C6A878] font-medium"
                      : "text-[#F5F3ED]/90 hover:text-[#C6A878]"
                    : aktif
                      ? "text-[#537C78] font-semibold"
                      : "text-[#2B2B28]/85 hover:text-[#537C78]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/akun"
            title="Akun Saya"
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
              isAtTop
                ? pathname.startsWith("/akun")
                  ? "border-[#C6A878] text-[#C6A878]"
                  : "border-[#F5F3ED]/25 text-[#F5F3ED] hover:border-[#C6A878] hover:text-[#C6A878]"
                : pathname.startsWith("/akun")
                  ? "border-[#537C78] text-[#537C78]"
                  : "border-[#0B2528]/20 text-[#0B2528] hover:border-[#537C78] hover:text-[#537C78]"
            }`}
          >
            <User className="w-4 h-4 stroke-[1.8]" />
          </Link>

          <Link
            href="/destinations"
            className={`group px-5 py-2.5 rounded-full text-[11px] font-semibold tracking-[0.14em] uppercase transition-all duration-300 flex items-center gap-2 shadow-sm ${
              isAtTop
                ? "bg-[#F5F3ED] text-[#0B2528] hover:bg-[#C6A878]"
                : "bg-[#0B2528] text-[#F5F3ED] hover:bg-[#537C78]"
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
          className={`lg:hidden backdrop-blur-xl px-6 py-6 space-y-4 transition-colors ${
            isAtTop
              ? "bg-[#0B2528]/95 text-[#F5F3ED]"
              : "bg-[#F5F3ED]/98 text-[#0B2528] shadow-lg"
          }`}
        >
          {MENU_NAVIGASI.map((item) => {
            const aktif = cekAktif(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm py-2 transition-colors ${
                  isAtTop
                    ? aktif
                      ? "text-[#C6A878] font-medium"
                      : "text-[#F5F3ED] hover:text-[#C6A878]"
                    : aktif
                      ? "text-[#537C78] font-semibold"
                      : "text-[#2B2B28] hover:text-[#537C78]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-4 flex items-center gap-4">
            <Link
              href="/akun"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 text-sm py-2 transition-colors ${
                isAtTop
                  ? "text-[#F5F3ED] hover:text-[#C6A878]"
                  : "text-[#0B2528] hover:text-[#537C78]"
              }`}
            >
              <User className="w-5 h-5" />
              Akun Saya
            </Link>
            <Link
              href="/destinations"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                isAtTop
                  ? "bg-[#F5F3ED] text-[#0B2528]"
                  : "bg-[#0B2528] text-[#F5F3ED]"
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