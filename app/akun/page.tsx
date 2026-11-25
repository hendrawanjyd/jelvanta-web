"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Booking,
  User,
  clearAuthSession,
  formatRupiah,
  getAuthToken,
  getCurrentUser,
  getMyBookings,
  loginAccount,
  logoutAccount,
  registerAccount,
  saveAuthSession,
} from "@/lib/api";
import {
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  LogOut,
  Ticket,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Award,
  AlertCircle,
  ArrowUpRight,
  ShieldCheck,
  MapPin,
  Compass,
} from "lucide-react";

export default function AkunPage() {
  const [user, setUser] = useState<User | null>(null);
  const [riwayat, setRiwayat] = useState<Booking[]>([]);
  const [sedangCekSesi, setSedangCekSesi] = useState(true);

  const [modeAuth, setModeAuth] = useState<"masuk" | "daftar">("masuk");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [password, setPassword] = useState("");
  const [sedangProses, setSedangProses] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);

  const muatDataAkun = useCallback(async () => {
    const [profil, bookings] = await Promise.all([
      getCurrentUser(),
      getMyBookings(),
    ]);
    setUser(profil);
    setRiwayat(bookings);
  }, []);

  useEffect(() => {
    let aktif = true;

    async function cekSesi() {
      const token = getAuthToken();
      if (!token) {
        if (aktif) setSedangCekSesi(false);
        return;
      }

      try {
        const [profil, bookings] = await Promise.all([
          getCurrentUser(),
          getMyBookings(),
        ]);
        if (aktif) {
          setUser(profil);
          setRiwayat(bookings);
        }
      } catch {
        clearAuthSession();
        if (aktif) {
          setUser(null);
          setRiwayat([]);
        }
      } finally {
        if (aktif) setSedangCekSesi(false);
      }
    }

    cekSesi();

    return () => {
      aktif = false;
    };
  }, []);

  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSedangProses(true);
    setPesanError(null);

    try {
      if (modeAuth === "masuk") {
        const res = await loginAccount({
          email: email.trim(),
          password,
        });
        saveAuthSession(res.data.token, res.data.user);
      } else {
        const res = await registerAccount({
          name: nama.trim(),
          email: email.trim(),
          telepon: telepon.trim() || undefined,
          password,
        });
        saveAuthSession(res.data.token, res.data.user);
      }

      setNama("");
      setEmail("");
      setTelepon("");
      setPassword("");
      await muatDataAkun();
    } catch (err) {
      setPesanError(
        err instanceof Error
          ? err.message
          : "Proses autentikasi gagal, silakan periksa kembali data Anda"
      );
    } finally {
      setSedangProses(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAccount();
    } catch {
      clearAuthSession();
    }
    setUser(null);
    setRiwayat([]);
  };

  return (
    <div className="min-h-screen bg-[#0B2528] text-[#F5F3ED]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 md:px-12 pt-36 pb-24">
        {sedangCekSesi ? (
          <div className="py-24 text-center">
            <p className="text-xs tracking-[0.25em] uppercase text-[#C6A878]">
              Memuat Informasi Akun...
            </p>
          </div>
        ) : !user ? (
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F3135] border border-[#C6A878]/40 text-xs uppercase tracking-widest text-[#C6A878]">
                <UserIcon className="w-3.5 h-3.5" />
                Akun Pelanggan Jelvanta
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl font-normal">
                {modeAuth === "masuk"
                  ? "Selamat Datang Kembali"
                  : "Buat Akun Perjalanan"}
              </h1>
              <p className="text-xs text-[#F5F3ED]/70 leading-relaxed">
                Masuk atau daftar untuk menyimpan riwayat reservasi dan mempermudah proses pemesanan ekspedisi berikutnya.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#0F3135] border border-[#C6A878]/35 shadow-2xl space-y-6">
              <div className="grid grid-cols-2 gap-2 p-1 rounded-full bg-[#0B2528] border border-[#537C78]/40">
                <button
                  type="button"
                  onClick={() => {
                    setModeAuth("masuk");
                    setPesanError(null);
                  }}
                  className={`py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    modeAuth === "masuk"
                      ? "bg-[#C6A878] text-[#0B2528]"
                      : "text-[#F5F3ED]/70 hover:text-[#F5F3ED]"
                  }`}
                >
                  Masuk
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModeAuth("daftar");
                    setPesanError(null);
                  }}
                  className={`py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    modeAuth === "daftar"
                      ? "bg-[#C6A878] text-[#0B2528]"
                      : "text-[#F5F3ED]/70 hover:text-[#F5F3ED]"
                  }`}
                >
                  Daftar
                </button>
              </div>

              {pesanError && (
                <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-400/40 text-xs text-red-200 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-300" />
                  <span>{pesanError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitAuth} className="space-y-4">
                {modeAuth === "daftar" && (
                  <div>
                    <label className="block text-xs font-medium text-[#F5F3ED]/80 mb-1.5">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama lengkap Anda"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] placeholder:text-[#F5F3ED]/35 focus:outline-none focus:border-[#C6A878]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[#F5F3ED]/80 mb-1.5">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] placeholder:text-[#F5F3ED]/35 focus:outline-none focus:border-[#C6A878]"
                  />
                </div>

                {modeAuth === "daftar" && (
                  <div>
                    <label className="block text-xs font-medium text-[#F5F3ED]/80 mb-1.5">
                      Nomor WhatsApp (Opsional)
                    </label>
                    <input
                      type="tel"
                      placeholder="0812xxxxxxxx"
                      value={telepon}
                      onChange={(e) => setTelepon(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] placeholder:text-[#F5F3ED]/35 focus:outline-none focus:border-[#C6A878]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[#F5F3ED]/80 mb-1.5">
                    Kata Sandi
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] placeholder:text-[#F5F3ED]/35 focus:outline-none focus:border-[#C6A878]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sedangProses}
                  className="w-full py-3.5 rounded-full bg-[#C6A878] text-[#0B2528] text-xs font-bold uppercase tracking-widest hover:bg-[#F5F3ED] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  {sedangProses
                    ? "Memproses..."
                    : modeAuth === "masuk"
                      ? "Masuk Sekarang"
                      : "Daftar Akun Baru"}
                </button>
              </form>
            </div>

            <div className="text-center text-xs text-[#F5F3ED]/65">
              Hanya ingin melacak tiket tanpa masuk?{" "}
              <Link
                href="/booking"
                className="text-[#C6A878] hover:underline font-medium"
              >
                Cek Pesanan dengan Kode Booking
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="p-7 sm:p-9 rounded-3xl bg-[#0F3135] border border-[#C6A878]/35 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#0B2528] border border-[#C6A878]/50 text-[#C6A878] flex items-center justify-center font-editorial text-2xl shrink-0">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="font-editorial text-2xl sm:text-3xl font-normal">
                      {user.name}
                    </h1>
                    <span className="px-3 py-0.5 rounded-full bg-[#C6A878]/20 border border-[#C6A878]/40 text-[11px] font-semibold text-[#C6A878] uppercase tracking-wider">
                      {user.role === "admin" ? "Administrator" : "Pelanggan"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#F5F3ED]/70">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#C6A878]" />
                      {user.email}
                    </span>
                    {user.telepon && (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#C6A878]" />
                        {user.telepon}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="px-5 py-2.5 rounded-full bg-[#C6A878] text-[#0B2528] text-xs font-bold uppercase tracking-wider hover:bg-[#F5F3ED] transition-all inline-flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Buka Panel Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-full bg-red-500/15 border border-red-400/30 text-xs font-semibold text-red-200 hover:bg-red-500/25 transition-all inline-flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#C6A878]">
                    Aktivitas Perjalanan
                  </p>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-normal mt-1">
                    Riwayat Pemesanan Anda ({riwayat.length})
                  </h2>
                </div>
                <Link
                  href="/destinations"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C6A878] hover:text-[#F5F3ED] transition-colors"
                >
                  <Compass className="w-4 h-4" />
                  Pesan Ekspedisi Baru
                </Link>
              </div>

              {riwayat.length === 0 ? (
                <div className="p-12 rounded-3xl bg-[#0F3135] border border-[#537C78]/30 text-center space-y-4">
                  <Ticket className="w-8 h-8 text-[#C6A878] mx-auto" />
                  <div className="space-y-1">
                    <p className="text-base font-medium text-[#F5F3ED]">
                      Belum Ada Riwayat Pemesanan
                    </p>
                    <p className="text-xs text-[#F5F3ED]/60 max-w-md mx-auto">
                      Pemesanan yang Anda buat saat masuk dengan akun ini akan otomatis tersimpan dan tampil di sini.
                    </p>
                  </div>
                  <Link
                    href="/destinations"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C6A878] text-[#0B2528] text-xs font-bold uppercase tracking-wider hover:bg-[#F5F3ED] transition-all"
                  >
                    Jelajahi Paket Wisata
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {riwayat.map((pesanan) => (
                    <div
                      key={pesanan.id}
                      className="p-6 sm:p-7 rounded-3xl bg-[#0F3135] border border-[#537C78]/35 flex flex-col md:flex-row justify-between gap-6"
                    >
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="px-3 py-1 rounded-full bg-[#0B2528] border border-[#C6A878]/50 text-xs font-bold tracking-wider text-[#C6A878]">
                            {pesanan.kode_booking}
                          </span>

                          {pesanan.status === "Terkonfirmasi" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Terkonfirmasi Lunas
                            </span>
                          )}
                          {pesanan.status === "Selesai" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-medium border border-sky-500/30">
                              <Award className="w-3.5 h-3.5" />
                              Perjalanan Selesai
                            </span>
                          )}
                          {pesanan.status === "Menunggu Pembayaran" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30">
                              <Clock className="w-3.5 h-3.5" />
                              Menunggu Pembayaran
                            </span>
                          )}
                          {pesanan.status === "Dibatalkan" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-medium border border-red-500/30">
                              <XCircle className="w-3.5 h-3.5" />
                              Dibatalkan
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-editorial text-2xl font-normal text-[#F5F3ED]">
                            {pesanan.destination?.nama || "Paket Ekspedisi"}
                          </h3>
                          {pesanan.destination?.lokasi && (
                            <p className="inline-flex items-center gap-1.5 text-xs text-[#C6A878] mt-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {pesanan.destination.lokasi}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-5 text-xs text-[#F5F3ED]/75 pt-1">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-[#C6A878]" />
                            {pesanan.tanggal_berangkat}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-[#C6A878]" />
                            {pesanan.jumlah_peserta} Peserta
                          </span>
                        </div>
                      </div>

                      <div className="md:border-l border-[#537C78]/30 md:pl-6 flex flex-col justify-between items-start md:items-end gap-4">
                        <div>
                          <span className="block text-[11px] uppercase tracking-wider text-[#F5F3ED]/50 md:text-right">
                            Total Tagihan
                          </span>
                          <span className="text-xl font-bold text-[#C6A878]">
                            {formatRupiah(pesanan.total_harga)}
                          </span>
                        </div>

                        <Link
                          href={`/booking?kode=${encodeURIComponent(
                            pesanan.kode_booking
                          )}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#C6A878] text-[#C6A878] text-xs font-bold uppercase tracking-wider hover:bg-[#C6A878] hover:text-[#0B2528] transition-all"
                        >
                          Lihat E-Tiket
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}