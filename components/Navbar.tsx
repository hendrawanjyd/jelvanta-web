"use client";

import { useState, useEffect, useRef } from "react";
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
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 30) {
        setIsAtTop(true);
        setIsVisible(true);
      } else {
        setIsAtTop(false);
        if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
          setIsVisible(false);
          setMobileMenuOpen(false);
        } else if (currentScrollY < lastScrollY.current) {
          setIsVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

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
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isAtTop
          ? "bg-gradient-to-b from-black/45 to-transparent py-6"
          : "bg-[#0B2528]/90 backdrop-blur-md py-4 shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="group">
          <span className="font-logo text-2xl md:text-[26px] tracking-[0.24em] uppercase text-[#F5F3ED] group-hover:text-[#C6A878] transition-colors">
            JELVANTA
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9 text-[13px] tracking-wide font-normal text-[#F5F3ED]/90">
          {MENU_NAVIGASI.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors ${
                cekAktif(item.href)
                  ? "text-[#C6A878] font-medium"
                  : "hover:text-[#C6A878]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/akun"
            title="Akun Saya"
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
              pathname.startsWith("/akun")
                ? "border-[#C6A878] text-[#C6A878]"
                : "border-white/20 text-[#F5F3ED] hover:border-[#C6A878] hover:text-[#C6A878]"
            }`}
          >
            <User className="w-4 h-4 stroke-[1.8]" />
          </Link>
          <Link
            href="/destinations"
            className="group px-5 py-2.5 rounded-full bg-[#F5F3ED] text-[#0B2528] text-[11px] font-semibold tracking-[0.14em] uppercase hover:bg-[#C6A878] transition-all duration-300 flex items-center gap-2 shadow-sm"
          >
            <span>Booking Sekarang</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-[#F5F3ED] p-2"
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
        <div className="lg:hidden bg-[#0B2528]/95 backdrop-blur-xl px-6 py-6 space-y-4">
          {MENU_NAVIGASI.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm py-2 transition-colors ${
                cekAktif(item.href)
                  ? "text-[#C6A878] font-medium"
                  : "text-[#F5F3ED] hover:text-[#C6A878]"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 flex items-center gap-4">
            <Link
              href="/akun"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm text-[#F5F3ED] hover:text-[#C6A878] py-2"
            >
              <User className="w-5 h-5" />
              Akun Saya
            </Link>
            <Link
              href="/destinations"
              onClick={() => setMobileMenuOpen(false)}
              className="px-5 py-2.5 rounded-full bg-[#F5F3ED] text-[#0B2528] text-xs font-semibold uppercase tracking-wider"
            >
              Booking Sekarang
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}