// keranjangcart.ts

// Interface untuk User
export interface User {
  id: number;
  nama: string;
  email: string;
  no_hp: string;
  alamat: string;
  kode_pos: string;
  role: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
}

// Interface untuk Barang
export interface Barang {
  id: number;
  kode_barang: string;
  nama_barang: string;
  merek: string;
  kategori_id: number;
  supplier_id: number;
  gambar_barang: string;
  harga_beli: string;
  harga_jual: string;
  berat_barang: number;
  satuan: string;
  stok: number;
  stok_minimum: number;
  deskripsi: string;
  created_at: string;
  updated_at: string;
}

// Interface untuk Item Keranjang
export interface KeranjangItem {
  id: number;
  user_id: number;
  barang_id: number;
  jumlah: number;
  created_at: string;
  updated_at: string;
  user: User;
  barang: Barang;
}

// Interface untuk Bank User
export interface BankUser {
  id: number;
  user_id: number;
  nama_rekening: string;
  bank_tipe: string;
  no_rekening: string;
  created_at: string;
  updated_at: string;
}

// Interface untuk Bank Admin
export interface BankAdmin {
  nama_rekening: string;
  bank_tipe: string;
  no_rekening: string;
}

// Interface untuk Data Alamat Pengiriman (bisa diubah dari data user)
export interface AlamatPengiriman {
  nama: string;
  no_hp: string;
  email: string;
  alamat: string;
  kode_pos: string;
}

// Interface untuk Payment Method
export interface PaymentMethod {
  type: 'cod' | 'transfer_bank' | 'transfer_ewallet';
  bank_admin?: BankAdmin;
  bank_user?: BankUser;
}

// Interface untuk Data Transaksi
export interface TransaksiData {
  tanggal_pesanan: string;
  total_harga: string;
  status_pembayaran?: string;
  status_pengiriman: string;
  jenis_pengiriman: string;
  metode_pembayaran: string;
  tanggal_jatuh_tempo?: string;
  alamat_pengiriman: string;
  kode_pos: string;
  catatan_pembeli?: string;
  bukti_transfer?: File;
}

// Interface untuk Response Transaksi
export interface TransaksiResponse {
  message: string;
  data: {
    kode_transaksi: string;
    user_id: number;
    tanggal_pesanan: string;
    total_harga: string;
    status_pembayaran: string;
    status_pengiriman: string;
    jenis_pengiriman: string;
    metode_pembayaran: string;
    tanggal_jatuh_tempo: string;
    alamat_pengiriman: string;
    kode_pos: string;
    catatan_pembeli: string;
    bukti_transfer: string;
    updated_at: string;
    created_at: string;
    id: number;
  };
}

// Interface untuk Form Tambah Bank User
export interface BankUserForm {
  nama_rekening: string;
  bank_tipe: string;
  no_rekening: string;
}

// Interface untuk Checkout State (Local Storage)
export interface CheckoutState {
  step: number;
  keranjangItems: KeranjangItem[];
  alamatPengiriman: AlamatPengiriman;
  paymentMethod: PaymentMethod;
  catatanPembeli: string;
  totalHarga: number;
}

// Enum untuk Payment Types
export enum PaymentType {
  COD = 'cod',
  TRANSFER_BANK = 'transfer_bank',
  TRANSFER_EWALLET = 'transfer_ewallet'
}

// Enum untuk Bank Types
export enum BankType {
  BCA = 'bca',
  BNI = 'bni',
  BRI = 'bri',
  MANDIRI = 'mandiri',
  BTN = 'btn',
  DANA = 'dana',
  OVO = 'ovo',
  GOPAY = 'gopay'
}

// Enum untuk Status
export enum StatusPembayaran {
  PENDING = 'pending',
  LUNAS = 'lunas',
  DIBATALKAN = 'dibatalkan'
}

export enum StatusPengiriman {
  DIKIRIM = 'dikirim',
  DALAM_PROSES = 'dalam_proses',
  SELESAI = 'selesai'
}

// Type untuk API Response Generic
export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}

// Constants untuk Local Storage Keys
export const STORAGE_KEYS = {
  CHECKOUT_STATE: 'checkout_state',
  KERANJANG_ITEMS: 'keranjang_items',
  USER_DATA: 'user_data',
  PAYMENT_METHOD: 'payment_method'
} as const;