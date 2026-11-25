"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Booking,
  ContactMessage,
  DashboardStats,
  Destination,
  User,
  clearAuthSession,
  createAdminDestination,
  deleteAdminBooking,
  deleteAdminContact,
  deleteAdminDestination,
  formatRupiah,
  getAdminBookings,
  getAdminContacts,
  getAdminDashboard,
  getAdminDestinations,
  getAuthToken,
  getCurrentUser,
  loginAccount,
  logoutAccount,
  saveAuthSession,
  updateAdminBookingStatus,
  updateAdminContactStatus,
  updateAdminDestination,
} from "@/lib/api";
import {
  LayoutDashboard,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  MapPin,
  Ticket,
  Wallet,
  Compass,
  Mail,
  LogOut,
  Lock,
  AlertCircle,
  Pencil,
  Award,
  RefreshCw,
  CheckCheck,
  Users,
  ExternalLink,
  Menu,
  X,
  ArrowLeft,
  Clock,
} from "lucide-react";

const FOTO_DEFAULT =
  "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80";

const FASILITAS_DEFAULT = [
  "Akomodasi Resor Bintang Lima",
  "Transportasi Privat Selama Tur",
  "Pemandu Wisata Berlisensi",
  "Asuransi Perjalanan Penuh",
];

const ITINERARY_DEFAULT = [
  {
    hari: "Hari 01",
    judul: "Penyambutan & Eksplorasi Awal",
    kegiatan:
      "Penjemputan di bandara ketibaan dan pengantaran menuju penginapan utama.",
  },
  {
    hari: "Hari 02",
    judul: "Penjelajahan Destinasi Utama",
    kegiatan:
      "Mengunjungi titik panorama ikonik bersama pemandu lokal berpengalaman.",
  },
];

type MenuAdmin = "ringkasan" | "pesanan" | "destinasi" | "kontak";

const JUDUL_HALAMAN: Record<MenuAdmin, { judul: string; deskripsi: string }> = {
  ringkasan: {
    judul: "Ringkasan Operasional",
    deskripsi: "Pantau performa pendapatan, reservasi masuk, dan aktivitas terbaru",
  },
  pesanan: {
    judul: "Kelola Pesanan",
    deskripsi: "Verifikasi pembayaran, perbarui status keberangkatan, dan kelola transaksi",
  },
  destinasi: {
    judul: "Kelola Paket Wisata",
    deskripsi: "Tambah, ubah, atur kuota, dan kontrol visibilitas paket ekspedisi",
  },
  kontak: {
    judul: "Kotak Masuk Pesan",
    deskripsi: "Tinjau pertanyaan dan permintaan perjalanan khusus dari calon pelanggan",
  },
};

export default function AdminDashboardPage() {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [sedangCekSesi, setSedangCekSesi] = useState(true);

  const [emailLogin, setEmailLogin] = useState("admin@jelvanta.com");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [sedangLogin, setSedangLogin] = useState(false);
  const [errorLogin, setErrorLogin] = useState<string | null>(null);

  const [menuAktif, setMenuAktif] = useState<MenuAdmin>("ringkasan");
  const [sidebarTerbuka, setSidebarTerbuka] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  const [stats, setStats] = useState<DashboardStats>({
    total_pendapatan: 0,
    total_booking: 0,
    booking_menunggu: 0,
    total_destinasi_aktif: 0,
    total_pelanggan: 0,
    pesan_belum_dibaca: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [daftarPesanan, setDaftarPesanan] = useState<Booking[]>([]);
  const [daftarDestinasi, setDaftarDestinasi] = useState<Destination[]>([]);
  const [daftarPesan, setDaftarPesan] = useState<ContactMessage[]>([]);
  const [sedangMemuatData, setSedangMemuatData] = useState(false);
  const [notifikasi, setNotifikasi] = useState<{
    tipe: "sukses" | "error";
    teks: string;
  } | null>(null);

  const [editDestinasiId, setEditDestinasiId] = useState<number | null>(null);
  const [namaWisata, setNamaWisata] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [kategori, setKategori] = useState("Bahari & Kapal Pesiar");
  const [durasi, setDurasi] = useState("4 Hari 3 Malam");
  const [harga, setHarga] = useState(5000000);
  const [kuota, setKuota] = useState(10);
  const [gambar, setGambar] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sedangSimpanDestinasi, setSedangSimpanDestinasi] = useState(false);

  const tampilkanPesan = (tipe: "sukses" | "error", teks: string) => {
    setNotifikasi({ tipe, teks });
    setTimeout(() => {
      setNotifikasi((prev) => (prev?.teks === teks ? null : prev));
    }, 4000);
  };

  const muatSemuaDataAdmin = useCallback(async (statusPesanan = "") => {
    try {
      setSedangMemuatData(true);
      const [dashboardRes, bookingsRes, destinationsRes, contactsRes] =
        await Promise.all([
          getAdminDashboard(),
          getAdminBookings(statusPesanan || undefined),
          getAdminDestinations(),
          getAdminContacts(),
        ]);

      setStats(dashboardRes.stats);
      setRecentBookings(dashboardRes.recent_bookings);
      setDaftarPesanan(bookingsRes);
      setDaftarDestinasi(destinationsRes);
      setDaftarPesan(contactsRes);
    } catch (err) {
      tampilkanPesan(
        "error",
        err instanceof Error
          ? err.message
          : "Gagal memuat data panel pengelola"
      );
    } finally {
      setSedangMemuatData(false);
    }
  }, []);

  useEffect(() => {
    let aktif = true;

    async function cekSesiAdmin() {
      const token = getAuthToken();
      if (!token) {
        if (aktif) setSedangCekSesi(false);
        return;
      }

      try {
        const user = await getCurrentUser();
        if (!aktif) return;

        if (user.role !== "admin") {
          clearAuthSession();
          setErrorLogin("Akun ini tidak memiliki hak akses administrator.");
          setSedangCekSesi(false);
          return;
        }

        setAdminUser(user);
        setSedangCekSesi(false);
        await muatSemuaDataAdmin();
      } catch {
        clearAuthSession();
        if (aktif) {
          setAdminUser(null);
          setSedangCekSesi(false);
        }
      }
    }

    cekSesiAdmin();

    return () => {
      aktif = false;
    };
  }, [muatSemuaDataAdmin]);

  const handleLoginAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSedangLogin(true);
    setErrorLogin(null);

    try {
      const res = await loginAccount({
        email: emailLogin.trim(),
        password: passwordLogin,
      });

      if (res.data.user.role !== "admin") {
        setErrorLogin("Akses ditolak. Gunakan akun dengan peran administrator.");
        setSedangLogin(false);
        return;
      }

      saveAuthSession(res.data.token, res.data.user);
      setAdminUser(res.data.user);
      setPasswordLogin("");
      await muatSemuaDataAdmin();
    } catch (err) {
      setErrorLogin(
        err instanceof Error
          ? err.message
          : "Login gagal. Periksa kembali email dan password Anda."
      );
    } finally {
      setSedangLogin(false);
    }
  };

  const handleLogoutAdmin = async () => {
    try {
      await logoutAccount();
    } catch {
      clearAuthSession();
    }
    setAdminUser(null);
    setDaftarPesanan([]);
    setRecentBookings([]);
    setDaftarDestinasi([]);
    setDaftarPesan([]);
  };

  const handleGantiFilterStatus = async (statusBaru: string) => {
    setFilterStatus(statusBaru);
    try {
      const bookingsRes = await getAdminBookings(statusBaru || undefined);
      setDaftarPesanan(bookingsRes);
    } catch (err) {
      tampilkanPesan(
        "error",
        err instanceof Error ? err.message : "Gagal menyaring daftar pesanan"
      );
    }
  };

  const ubahStatusPesanan = async (
    id: number,
    statusBaru:
      | "Menunggu Pembayaran"
      | "Terkonfirmasi"
      | "Selesai"
      | "Dibatalkan"
  ) => {
    try {
      await updateAdminBookingStatus(id, statusBaru);
      await muatSemuaDataAdmin(filterStatus);
      tampilkanPesan(
        "sukses",
        `Status pesanan berhasil diubah menjadi ${statusBaru}`
      );
    } catch (err) {
      tampilkanPesan(
        "error",
        err instanceof Error ? err.message : "Gagal memperbarui status pesanan"
      );
    }
  };

  const hapusPesanan = async (id: number) => {
    if (!window.confirm("Hapus data pesanan ini secara permanen?")) return;

    try {
      await deleteAdminBooking(id);
      await muatSemuaDataAdmin(filterStatus);
      tampilkanPesan("sukses", "Data pesanan berhasil dihapus");
    } catch (err) {
      tampilkanPesan(
        "error",
        err instanceof Error ? err.message : "Gagal menghapus data pesanan"
      );
    }
  };

  const resetFormDestinasi = () => {
    setEditDestinasiId(null);
    setNamaWisata("");
    setLokasi("");
    setKategori("Bahari & Kapal Pesiar");
    setDurasi("4 Hari 3 Malam");
    setHarga(5000000);
    setKuota(10);
    setGambar("");
    setDeskripsi("");
    setIsActive(true);
  };

  const mulaiEditDestinasi = (item: Destination) => {
    setEditDestinasiId(item.id);
    setNamaWisata(item.nama);
    setLokasi(item.lokasi);
    setKategori(item.kategori);
    setDurasi(item.durasi);
    setHarga(item.harga);
    setKuota(item.kuota);
    setGambar(item.gambar);
    setDeskripsi(item.deskripsi);
    setIsActive(item.is_active);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSimpanDestinasi = async (e: React.FormEvent) => {
    e.preventDefault();
    setSedangSimpanDestinasi(true);

    const urlGambar = gambar.trim() || FOTO_DEFAULT;

    try {
      if (editDestinasiId !== null) {
        await updateAdminDestination(editDestinasiId, {
          nama: namaWisata.trim(),
          lokasi: lokasi.trim(),
          kategori,
          durasi: durasi.trim(),
          harga: Number(harga),
          kuota: Number(kuota),
          gambar: urlGambar,
          deskripsi: deskripsi.trim(),
          is_active: isActive,
        });
        tampilkanPesan("sukses", "Paket wisata berhasil diperbarui");
      } else {
        await createAdminDestination({
          nama: namaWisata.trim(),
          lokasi: lokasi.trim(),
          kategori,
          durasi: durasi.trim(),
          harga: Number(harga),
          rating: 4.9,
          kuota: Number(kuota),
          gambar: urlGambar,
          galeri: [urlGambar],
          deskripsi: deskripsi.trim(),
          fasilitas: FASILITAS_DEFAULT,
          itinerary: ITINERARY_DEFAULT,
          is_active: isActive,
        });
        tampilkanPesan("sukses", "Paket wisata baru berhasil ditambahkan");
      }

      resetFormDestinasi();
      await muatSemuaDataAdmin(filterStatus);
    } catch (err) {
      tampilkanPesan(
        "error",
        err instanceof Error ? err.message : "Gagal menyimpan paket wisata"
      );
    } finally {
      setSedangSimpanDestinasi(false);
    }
  };

  const toggleStatusDestinasi = async (item: Destination) => {
    try {
      await updateAdminDestination(item.id, {
        is_active: !item.is_active,
      });
      await muatSemuaDataAdmin(filterStatus);
      tampilkanPesan(
        "sukses",
        `Paket ${item.nama} berhasil ${!item.is_active ? "diaktifkan" : "dinonaktifkan"}`
      );
    } catch (err) {
      tampilkanPesan(
        "error",
        err instanceof Error ? err.message : "Gagal mengubah status destinasi"
      );
    }
  };

  const hapusDestinasi = async (id: number) => {
    if (!window.confirm("Hapus paket wisata ini dari database?")) return;

    try {
      await deleteAdminDestination(id);
      if (editDestinasiId === id) {
        resetFormDestinasi();
      }
      await muatSemuaDataAdmin(filterStatus);
      tampilkanPesan("sukses", "Paket wisata berhasil dihapus");
    } catch (err) {
      tampilkanPesan(
        "error",
        err instanceof Error ? err.message : "Gagal menghapus paket wisata"
      );
    }
  };

  const ubahStatusPesan = async (
    id: number,
    statusBaru: "Belum Dibaca" | "Sudah Dibaca" | "Dibalas"
  ) => {
    try {
      await updateAdminContactStatus(id, statusBaru);
      await muatSemuaDataAdmin(filterStatus);
      tampilkanPesan("sukses", `Status pesan diubah menjadi ${statusBaru}`);
    } catch (err) {
      tampilkanPesan(
        "error",
        err instanceof Error ? err.message : "Gagal memperbarui status pesan"
      );
    }
  };

  const hapusPesan = async (id: number) => {
    if (!window.confirm("Hapus pesan masuk ini?")) return;

    try {
      await deleteAdminContact(id);
      await muatSemuaDataAdmin(filterStatus);
      tampilkanPesan("sukses", "Pesan kontak berhasil dihapus");
    } catch (err) {
      tampilkanPesan(
        "error",
        err instanceof Error ? err.message : "Gagal menghapus pesan kontak"
      );
    }
  };

  const renderBadgeStatusBooking = (status: string) => {
    if (status === "Terkonfirmasi") {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    }
    if (status === "Selesai") {
      return "bg-sky-50 text-sky-700 border border-sky-200";
    }
    if (status === "Dibatalkan") {
      return "bg-red-50 text-red-700 border border-red-200";
    }
    return "bg-amber-50 text-amber-700 border border-amber-200";
  };

  if (sedangCekSesi) {
    return (
      <div className="min-h-screen bg-[#0B2528] text-[#F5F3ED] flex items-center justify-center">
        <p className="text-xs tracking-[0.25em] uppercase text-[#C6A878]">
          Memverifikasi Sesi Administrator...
        </p>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#0B2528] text-[#F5F3ED] flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-1">
            <p className="text-2xl tracking-[0.3em] font-light text-[#F5F3ED]">
              JELVANTA
            </p>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#C6A878]">
              Admin Management Portal
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#0F3135] border border-[#537C78]/40 shadow-2xl space-y-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-xs text-[#C6A878] mb-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Autentikasi Pengelola</span>
              </div>
              <h1 className="font-editorial text-2xl font-normal text-[#F5F3ED]">
                Masuk ke Panel Admin
              </h1>
              <p className="text-xs text-[#F5F3ED]/65 leading-relaxed">
                Gunakan akun administrator untuk mengelola transaksi, katalog perjalanan, dan pesan masuk.
              </p>
            </div>

            {errorLogin && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-400/40 text-xs text-red-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-300" />
                <span>{errorLogin}</span>
              </div>
            )}

            <form onSubmit={handleLoginAdmin} className="space-y-4">
              <div>
                <label className="block text-xs text-[#F5F3ED]/80 mb-1.5">
                  Email Administrator
                </label>
                <input
                  type="email"
                  required
                  value={emailLogin}
                  onChange={(e) => setEmailLogin(e.target.value)}
                  placeholder="admin@jelvanta.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] focus:outline-none focus:border-[#C6A878]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#F5F3ED]/80 mb-1.5">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  required
                  value={passwordLogin}
                  onChange={(e) => setPasswordLogin(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full px-4 py-3 rounded-xl bg-[#0B2528] border border-[#537C78]/50 text-sm text-[#F5F3ED] focus:outline-none focus:border-[#C6A878]"
                />
              </div>

              <button
                type="submit"
                disabled={sedangLogin}
                className="w-full py-3.5 rounded-xl bg-[#C6A878] text-[#0B2528] text-xs font-bold uppercase tracking-widest hover:bg-[#F5F3ED] transition-all disabled:opacity-50"
              >
                {sedangLogin ? "Memverifikasi..." : "Masuk Dashboard"}
              </button>
            </form>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-[#F5F3ED]/60 hover:text-[#C6A878] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Halaman Pengunjung
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const daftarMenuNavigasi: {
    id: MenuAdmin;
    label: string;
    ikon: typeof LayoutDashboard;
    badge?: number;
  }[] = [
    { id: "ringkasan", label: "Ringkasan", ikon: LayoutDashboard },
    {
      id: "pesanan",
      label: "Pesanan",
      ikon: Ticket,
      badge: stats.booking_menunggu > 0 ? stats.booking_menunggu : undefined,
    },
    { id: "destinasi", label: "Paket Wisata", ikon: Compass },
    {
      id: "kontak",
      label: "Pesan Kontak",
      ikon: Mail,
      badge: stats.pesan_belum_dibaca > 0 ? stats.pesan_belum_dibaca : undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F3] text-[#1E2623] flex">
      {sidebarTerbuka && (
        <div
          onClick={() => setSidebarTerbuka(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0B2528] text-[#F5F3ED] flex flex-col justify-between transition-transform duration-300 shrink-0 ${
          sidebarTerbuka ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">
            <div>
              <p className="text-lg tracking-[0.28em] font-medium text-[#F5F3ED]">
                JELVANTA
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#C6A878]">
                Admin Console
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSidebarTerbuka(false)}
              className="lg:hidden p-1.5 rounded-lg text-[#F5F3ED]/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1.5">
            <p className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-[0.2em] text-[#F5F3ED]/40 font-semibold">
              Menu Utama
            </p>
            {daftarMenuNavigasi.map((item) => {
              const Icon = item.ikon;
              const aktif = menuAktif === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setMenuAktif(item.id);
                    setSidebarTerbuka(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    aktif
                      ? "bg-[#C6A878] text-[#0B2528] font-semibold shadow-sm"
                      : "text-[#F5F3ED]/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </span>
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        aktif
                          ? "bg-[#0B2528] text-[#F5F3ED]"
                          : "bg-[#C6A878]/20 text-[#C6A878]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#F5F3ED]/75 hover:bg-white/10 hover:text-white transition-all"
          >
            <ExternalLink className="w-4 h-4 text-[#C6A878]" />
            Lihat Website Publik
          </Link>
          <button
            type="button"
            onClick={handleLogoutAdmin}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-red-300 hover:bg-red-500/15 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Keluar Sesi
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-20 bg-white border-b border-zinc-200/80 px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarTerbuka(true)}
              className="lg:hidden p-2 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-[#0B2528] truncate">
                {JUDUL_HALAMAN[menuAktif].judul}
              </h1>
              <p className="text-xs text-zinc-500 hidden sm:block truncate">
                {JUDUL_HALAMAN[menuAktif].deskripsi}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => muatSemuaDataAdmin(filterStatus)}
              disabled={sedangMemuatData}
              className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-xs font-semibold text-zinc-700 inline-flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#0B2528] ${
                  sedangMemuatData ? "animate-spin" : ""
                }`}
              />
              <span className="hidden sm:inline">Muat Ulang</span>
            </button>

            <div className="flex items-center gap-2.5 pl-3 border-l border-zinc-200">
              <div className="w-9 h-9 rounded-full bg-[#0B2528] text-[#C6A878] flex items-center justify-center text-xs font-bold">
                {adminUser.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="hidden md:block leading-tight">
                <p className="text-xs font-semibold text-[#0B2528]">
                  {adminUser.name}
                </p>
                <p className="text-[11px] text-zinc-500">{adminUser.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-8 space-y-6 flex-1">
          {notifikasi && (
            <div
              className={`p-4 rounded-2xl border text-sm flex items-center gap-3 ${
                notifikasi.tipe === "sukses"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {notifikasi.tipe === "sukses" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              )}
              <span>{notifikasi.teks}</span>
            </div>
          )}

          {menuAktif === "ringkasan" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 mb-1">
                      Pendapatan Terkonfirmasi
                    </p>
                    <p className="text-xl font-bold text-[#0B2528]">
                      {formatRupiah(stats.total_pendapatan)}
                    </p>
                    <p className="text-[11px] text-emerald-600 mt-1">
                      Akumulasi lunas & selesai
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-[#0B2528]/10 flex items-center justify-center shrink-0">
                    <Wallet className="w-5 h-5 text-[#0B2528]" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 mb-1">
                      Total Reservasi
                    </p>
                    <p className="text-xl font-bold text-[#0B2528]">
                      {stats.total_booking} Pesanan
                    </p>
                    <p className="text-[11px] text-amber-600 mt-1">
                      {stats.booking_menunggu} menunggu verifikasi
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <Ticket className="w-5 h-5 text-amber-600" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 mb-1">
                      Paket Wisata Aktif
                    </p>
                    <p className="text-xl font-bold text-[#0B2528]">
                      {stats.total_destinasi_aktif} Destinasi
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      dari {daftarDestinasi.length} total katalog
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5 text-teal-700" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 mb-1">
                      Pesan Belum Dibaca
                    </p>
                    <p className="text-xl font-bold text-[#0B2528]">
                      {stats.pesan_belum_dibaca} Pesan
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      dari {daftarPesan.length} pesan masuk
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-sky-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-zinc-200/80 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-[#0B2528]">
                      Reservasi Terbaru
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Lima transaksi terakhir yang masuk ke sistem
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMenuAktif("pesanan")}
                    className="text-xs font-semibold text-[#537C78] hover:text-[#0B2528]"
                  >
                    Lihat Semua
                  </button>
                </div>

                {recentBookings.length === 0 ? (
                  <div className="p-10 text-center text-sm text-zinc-500">
                    Belum ada transaksi yang tercatat.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-zinc-50 border-b border-zinc-200/80 text-[11px] uppercase tracking-wider text-zinc-500">
                          <th className="px-5 py-3.5">Kode</th>
                          <th className="px-5 py-3.5">Pemesan</th>
                          <th className="px-5 py-3.5">Paket Destinasi</th>
                          <th className="px-5 py-3.5">Total</th>
                          <th className="px-5 py-3.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 text-sm">
                        {recentBookings.map((p) => (
                          <tr key={p.id} className="hover:bg-zinc-50/70">
                            <td className="px-5 py-3.5 font-semibold text-[#0B2528] whitespace-nowrap">
                              {p.kode_booking}
                            </td>
                            <td className="px-5 py-3.5">
                              <p className="font-medium text-zinc-800">
                                {p.nama_pemesan}
                              </p>
                              <p className="text-xs text-zinc-500">{p.email}</p>
                            </td>
                            <td className="px-5 py-3.5">
                              <p className="font-medium text-zinc-800">
                                {p.destination?.nama || "Paket Ekspedisi"}
                              </p>
                              <p className="text-xs text-zinc-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {p.tanggal_berangkat} ({p.jumlah_peserta} Orang)
                              </p>
                            </td>
                            <td className="px-5 py-3.5 font-semibold text-zinc-800 whitespace-nowrap">
                              {formatRupiah(p.total_harga)}
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-medium ${renderBadgeStatusBooking(
                                  p.status
                                )}`}
                              >
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {menuAktif === "pesanan" && (
            <div className="rounded-2xl bg-white border border-zinc-200/80 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-[#0B2528]">
                    Daftar Reservasi Pelanggan ({daftarPesanan.length})
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Pembatalan pesanan akan otomatis mengembalikan sisa kuota paket
                  </p>
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => handleGantiFilterStatus(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700 focus:outline-none focus:border-[#0B2528]"
                >
                  <option value="">Semua Status</option>
                  <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                  <option value="Terkonfirmasi">Terkonfirmasi</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </div>

              {daftarPesanan.length === 0 ? (
                <div className="p-12 text-center text-sm text-zinc-500">
                  Belum ada data pesanan yang sesuai dengan filter saat ini.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-200/80 text-[11px] uppercase tracking-wider text-zinc-500">
                        <th className="px-5 py-3.5">Kode</th>
                        <th className="px-5 py-3.5">Pelanggan</th>
                        <th className="px-5 py-3.5">Destinasi & Jadwal</th>
                        <th className="px-5 py-3.5">Total Tagihan</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5 text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-sm">
                      {daftarPesanan.map((p) => (
                        <tr key={p.id} className="hover:bg-zinc-50/70">
                          <td className="px-5 py-4 font-bold text-[#0B2528] whitespace-nowrap">
                            {p.kode_booking}
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-zinc-800">
                              {p.nama_pemesan}
                            </p>
                            <p className="text-xs text-zinc-500">{p.email}</p>
                            <p className="text-xs text-zinc-400">{p.telepon}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-medium text-zinc-800">
                              {p.destination?.nama || "Paket Ekspedisi"}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {p.tanggal_berangkat} ({p.jumlah_peserta} Orang)
                            </p>
                          </td>
                          <td className="px-5 py-4 font-semibold text-zinc-800 whitespace-nowrap">
                            {formatRupiah(p.total_harga)}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${renderBadgeStatusBooking(
                                p.status
                              )}`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right whitespace-nowrap space-x-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                ubahStatusPesanan(p.id, "Terkonfirmasi")
                              }
                              title="Setujui Pembayaran"
                              className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => ubahStatusPesanan(p.id, "Selesai")}
                              title="Tandai Selesai"
                              className="p-2 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
                            >
                              <Award className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                ubahStatusPesanan(p.id, "Dibatalkan")
                              }
                              title="Batalkan Pesanan"
                              className="p-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => hapusPesanan(p.id)}
                              title="Hapus Data"
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {menuAktif === "destinasi" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-1 p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs h-fit">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-[#0B2528] flex items-center gap-2">
                    {editDestinasiId !== null ? (
                      <Pencil className="w-4 h-4 text-[#537C78]" />
                    ) : (
                      <Plus className="w-4 h-4 text-[#537C78]" />
                    )}
                    {editDestinasiId !== null
                      ? "Edit Paket Wisata"
                      : "Tambah Paket Baru"}
                  </h2>

                  {editDestinasiId !== null && (
                    <button
                      type="button"
                      onClick={resetFormDestinasi}
                      className="text-xs font-medium text-zinc-500 hover:text-zinc-800"
                    >
                      Batal
                    </button>
                  )}
                </div>

                <form onSubmit={handleSimpanDestinasi} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">
                      Nama Paket Wisata
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh Eksplorasi Pulau Derawan"
                      value={namaWisata}
                      onChange={(e) => setNamaWisata(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-800 focus:outline-none focus:border-[#0B2528]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">
                      Lokasi Provinsi
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh Kalimantan Timur"
                      value={lokasi}
                      onChange={(e) => setLokasi(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-800 focus:outline-none focus:border-[#0B2528]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">
                      Kategori Wisata
                    </label>
                    <select
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-800 focus:outline-none focus:border-[#0B2528]"
                    >
                      <option value="Bahari & Kapal Pesiar">
                        Bahari & Kapal Pesiar
                      </option>
                      <option value="Eksplorasi Pulau">Eksplorasi Pulau</option>
                      <option value="Budaya & Alam">Budaya & Alam</option>
                      <option value="Budaya & Relaksasi">
                        Budaya & Relaksasi
                      </option>
                      <option value="Petualangan Gunung">
                        Petualangan Gunung
                      </option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-600 mb-1">
                        Durasi
                      </label>
                      <input
                        type="text"
                        required
                        value={durasi}
                        onChange={(e) => setDurasi(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-800 focus:outline-none focus:border-[#0B2528]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-600 mb-1">
                        Kuota Kursi
                      </label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={kuota}
                        onChange={(e) => setKuota(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-800 focus:outline-none focus:border-[#0B2528]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">
                      Harga per Peserta (IDR)
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={harga}
                      onChange={(e) => setHarga(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-800 focus:outline-none focus:border-[#0B2528]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">
                      URL Foto Utama
                    </label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={gambar}
                      onChange={(e) => setGambar(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-800 focus:outline-none focus:border-[#0B2528]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">
                      Deskripsi Singkat
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Jelaskan keistimewaan paket wisata ini..."
                      value={deskripsi}
                      onChange={(e) => setDeskripsi(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-800 focus:outline-none focus:border-[#0B2528]"
                    />
                  </div>

                  <label className="flex items-center gap-2.5 text-xs text-zinc-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded accent-[#0B2528]"
                    />
                    Tampilkan paket di halaman utama
                  </label>

                  <button
                    type="submit"
                    disabled={sedangSimpanDestinasi}
                    className="w-full py-3 rounded-xl bg-[#0B2528] text-[#F5F3ED] text-xs font-bold uppercase tracking-wider hover:bg-[#537C78] transition-all disabled:opacity-50"
                  >
                    {sedangSimpanDestinasi
                      ? "Menyimpan..."
                      : editDestinasiId !== null
                        ? "Simpan Perubahan"
                        : "Simpan Paket Wisata"}
                  </button>
                </form>
              </div>

              <div className="xl:col-span-2 space-y-3.5">
                {daftarDestinasi.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 w-full min-w-0">
                      <img
                        src={item.gambar}
                        alt={item.nama}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#537C78]">
                            {item.kategori}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              item.is_active
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-zinc-100 text-zinc-500 border border-zinc-200"
                            }`}
                          >
                            {item.is_active ? "Aktif" : "Nonaktif"}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#0B2528] truncate">
                          {item.nama}
                        </h3>
                        <p className="text-xs text-zinc-500 flex flex-wrap items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#537C78]" />
                            {item.lokasi}
                          </span>
                          <span className="font-semibold text-zinc-700">
                            {formatRupiah(item.harga)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-[#537C78]" />
                            Sisa {item.kuota}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleStatusDestinasi(item)}
                        className="px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors"
                      >
                        {item.is_active ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                      <button
                        type="button"
                        onClick={() => mulaiEditDestinasi(item)}
                        title="Edit Paket"
                        className="p-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => hapusDestinasi(item.id)}
                        title="Hapus Paket"
                        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {menuAktif === "kontak" && (
            <div className="rounded-2xl bg-white border border-zinc-200/80 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#0B2528]">
                    Pesan Pelanggan ({daftarPesan.length})
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Kelola pertanyaan yang dikirim melalui formulir kontak website
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                  <ShieldCheck className="w-4 h-4 text-[#537C78]" />
                  Terhubung ke Database
                </span>
              </div>

              {daftarPesan.length === 0 ? (
                <div className="p-12 text-center text-sm text-zinc-500">
                  Belum ada pesan yang masuk dari formulir kontak.
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {daftarPesan.map((pesan) => (
                    <div
                      key={pesan.id}
                      className="p-5 flex flex-col md:flex-row justify-between gap-4 hover:bg-zinc-50/70"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                              pesan.status === "Dibalas"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : pesan.status === "Sudah Dibaca"
                                  ? "bg-sky-50 text-sky-700 border border-sky-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {pesan.status}
                          </span>
                          <h3 className="font-bold text-sm text-[#0B2528]">
                            {pesan.subjek}
                          </h3>
                        </div>

                        <p className="text-xs font-medium text-[#537C78]">
                          {pesan.nama} ({pesan.email}
                          {pesan.telepon ? ` / ${pesan.telepon}` : ""})
                        </p>

                        <p className="text-sm text-zinc-600 leading-relaxed">
                          {pesan.pesan}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                        <button
                          type="button"
                          onClick={() => ubahStatusPesan(pesan.id, "Sudah Dibaca")}
                          className="px-3 py-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold inline-flex items-center gap-1.5"
                        >
                          <CheckCheck className="w-4 h-4" />
                          Dibaca
                        </button>
                        <button
                          type="button"
                          onClick={() => ubahStatusPesan(pesan.id, "Dibalas")}
                          className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold inline-flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Dibalas
                        </button>
                        <button
                          type="button"
                          onClick={() => hapusPesan(pesan.id)}
                          title="Hapus Pesan"
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}