export interface ItineraryItem {
  hari: string;
  judul: string;
  kegiatan: string;
}

export interface Destination {
  id: number;
  slug: string;
  nama: string;
  lokasi: string;
  kategori: string;
  durasi: string;
  harga: number;
  rating: number;
  kuota: number;
  gambar: string;
  galeri: string[];
  deskripsi: string;
  fasilitas: string[];
  itinerary: ItineraryItem[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  telepon: string | null;
  role: "admin" | "customer";
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: number;
  kode_booking: string;
  user_id: number | null;
  destinasi_id: number;
  nama_pemesan: string;
  email: string;
  telepon: string;
  tanggal_berangkat: string;
  jumlah_peserta: number;
  total_harga: number;
  metode_pembayaran: string;
  status: string;
  catatan: string | null;
  created_at?: string;
  updated_at?: string;
  destination?: Destination;
  user?: User;
}

export interface ContactMessage {
  id: number;
  nama: string;
  email: string;
  telepon: string | null;
  subjek: string;
  pesan: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardStats {
  total_pendapatan: number;
  total_booking: number;
  booking_menunggu: number;
  total_destinasi_aktif: number;
  total_pelanggan: number;
  pesan_belum_dibaca: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_bookings: Booking[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface CreateBookingPayload {
  destinasi_id: number;
  nama_pemesan: string;
  email: string;
  telepon: string;
  tanggal_berangkat: string;
  jumlah_peserta: number;
  metode_pembayaran: string;
  catatan?: string;
}

export interface CreateContactPayload {
  nama: string;
  email: string;
  telepon?: string;
  subjek: string;
  pesan: string;
}

export interface DestinationPayload {
  nama: string;
  slug?: string;
  lokasi: string;
  kategori: string;
  durasi: string;
  harga: number;
  rating?: number;
  kuota: number;
  gambar: string;
  galeri?: string[];
  deskripsi: string;
  fasilitas: string[];
  itinerary: ItineraryItem[];
  is_active?: boolean;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const TOKEN_KEY = "jelvanta_token";
const USER_KEY = "jelvanta_user";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function saveAuthSession(token: string, user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  useAuth = false
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (useAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationErrors = result?.errors
      ? Object.values(result.errors).flat().join(", ")
      : null;
    throw new Error(
      validationErrors || result?.message || "Terjadi kesalahan pada server"
    );
  }

  return result as ApiResponse<T>;
}

export async function getDestinations(): Promise<Destination[]> {
  const res = await apiFetch<Destination[]>("/destinations", {
    cache: "no-store",
  });
  return res.data;
}

export async function getDestinationBySlug(slug: string): Promise<Destination> {
  const res = await apiFetch<Destination>(`/destinations/${slug}`, {
    cache: "no-store",
  });
  return res.data;
}

export async function createBooking(
  payload: CreateBookingPayload
): Promise<ApiResponse<Booking>> {
  return apiFetch<Booking>(
    "/bookings",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    true
  );
}

export async function getBookingByCode(kodeBooking: string): Promise<Booking> {
  const res = await apiFetch<Booking>(`/bookings/${kodeBooking}`, {
    cache: "no-store",
  });
  return res.data;
}

export async function sendContactMessage(
  payload: CreateContactPayload
): Promise<ApiResponse<ContactMessage>> {
  return apiFetch<ContactMessage>("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerAccount(payload: {
  name: string;
  email: string;
  telepon?: string;
  password: string;
}): Promise<ApiResponse<{ user: User; token: string }>> {
  return apiFetch<{ user: User; token: string }>("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginAccount(payload: {
  email: string;
  password: string;
}): Promise<ApiResponse<{ user: User; token: string }>> {
  return apiFetch<{ user: User; token: string }>("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser(): Promise<User> {
  const res = await apiFetch<User>("/me", { cache: "no-store" }, true);
  return res.data;
}

export async function logoutAccount(): Promise<void> {
  await apiFetch<null>("/logout", { method: "POST" }, true);
  clearAuthSession();
}

export async function getMyBookings(): Promise<Booking[]> {
  const res = await apiFetch<Booking[]>(
    "/my-bookings",
    { cache: "no-store" },
    true
  );
  return res.data;
}

export async function getAdminDashboard(): Promise<DashboardData> {
  const res = await apiFetch<DashboardData>(
    "/admin/dashboard",
    { cache: "no-store" },
    true
  );
  return res.data;
}

export async function getAdminDestinations(): Promise<Destination[]> {
  const res = await apiFetch<Destination[]>(
    "/admin/destinations",
    { cache: "no-store" },
    true
  );
  return res.data;
}

export async function createAdminDestination(
  payload: DestinationPayload
): Promise<ApiResponse<Destination>> {
  return apiFetch<Destination>(
    "/admin/destinations",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    true
  );
}

export async function updateAdminDestination(
  id: number,
  payload: Partial<DestinationPayload>
): Promise<ApiResponse<Destination>> {
  return apiFetch<Destination>(
    `/admin/destinations/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    true
  );
}

export async function deleteAdminDestination(id: number): Promise<void> {
  await apiFetch<null>(
    `/admin/destinations/${id}`,
    { method: "DELETE" },
    true
  );
}

export async function getAdminBookings(status?: string): Promise<Booking[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await apiFetch<Booking[]>(
    `/admin/bookings${query}`,
    { cache: "no-store" },
    true
  );
  return res.data;
}

export async function updateAdminBookingStatus(
  id: number,
  status: string
): Promise<ApiResponse<Booking>> {
  return apiFetch<Booking>(
    `/admin/bookings/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
    true
  );
}

export async function deleteAdminBooking(id: number): Promise<void> {
  await apiFetch<null>(`/admin/bookings/${id}`, { method: "DELETE" }, true);
}

export async function getAdminContacts(): Promise<ContactMessage[]> {
  const res = await apiFetch<ContactMessage[]>(
    "/admin/contacts",
    { cache: "no-store" },
    true
  );
  return res.data;
}

export async function updateAdminContactStatus(
  id: number,
  status: string
): Promise<ApiResponse<ContactMessage>> {
  return apiFetch<ContactMessage>(
    `/admin/contacts/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
    true
  );
}

export async function deleteAdminContact(id: number): Promise<void> {
  await apiFetch<null>(`/admin/contacts/${id}`, { method: "DELETE" }, true);
}

export function formatRupiah(nominal: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(nominal);
}