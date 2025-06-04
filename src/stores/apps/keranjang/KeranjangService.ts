// keranjangService.ts - Complete Cart Service with Types and Interfaces

import api from '@/services/axiosInstance';

// ================== INTERFACES & TYPES ==================

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
  status_pembayaran?: 'belum_bayar' | 'lunas' | 'cod_pending';
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
  BELUM_BAYAR = 'belum_bayar',
  LUNAS = 'lunas',
  COD_PENDING = 'cod_pending'
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


// ================== SERVICE CLASS ==================

export class KeranjangService {
  // ================== KERANJANG API METHODS ==================

  async getKeranjangItems(): Promise<KeranjangItem[]> {
    try {
      const response = await api.get<KeranjangItem[]>('/keranjang');
      return response.data;
    } catch (error) {
      console.error('Error fetching keranjang items:', error);
      throw new Error('Gagal mengambil data keranjang');
    }
  }

  /**
   * Menambah item ke keranjang
   */
  async addToKeranjang(barangId: number, jumlah: number): Promise<ApiResponse<KeranjangItem>> {
    try {
      const response = await api.post('/keranjang', {
        barang_id: barangId,
        jumlah: jumlah
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to keranjang:', error);
      throw new Error('Gagal menambah item ke keranjang');
    }
  }

  /**
   * Update jumlah item dalam keranjang
   */
  async updateKeranjangItem(keranjangId: number, jumlah: number): Promise<ApiResponse<KeranjangItem>> {
    try {
      const response = await api.put(`/keranjang/${keranjangId}`, {
        jumlah: jumlah
      });
      return response.data;
    } catch (error) {
      console.error('Error updating keranjang item:', error);
      throw new Error('Gagal mengupdate item keranjang');
    }
  }

  /**
   * Hapus item dari keranjang
   */
  async removeFromKeranjang(keranjangId: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/keranjang/${keranjangId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from keranjang:', error);
      throw new Error('Gagal menghapus item dari keranjang');
    }
  }

  // ================== BANK API METHODS ==================

  /**
   * Mengambil bank milik user
   */
  async getMyBanks(): Promise<BankUser[]> {
    try {
      const response = await api.get<BankUser[]>('/my-banks');
      return response.data;
    } catch (error) {
      console.error('Error fetching user banks:', error);
      throw new Error('Gagal mengambil data bank user');
    }
  }

  /**
   * Mengambil bank admin untuk transfer
   */
  async getAdminBanks(): Promise<BankAdmin[]> {
    try {
      const response = await api.get<BankAdmin[]>('/admin-banks');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin banks:', error);
      throw new Error('Gagal mengambil data bank admin');
    }
  }

  /**
   * Menambah bank user baru
   */
  async addBankUser(bankData: BankUserForm): Promise<ApiResponse<BankUser>> {
    try {
      const response = await api.post('/banks', bankData);
      return response.data;
    } catch (error) {
      console.error('Error adding bank user:', error);
      throw new Error('Gagal menambah bank user');
    }
  }

  /**
   * Update bank user
   */
  async updateBankUser(bankId: number, bankData: BankUserForm): Promise<ApiResponse<BankUser>> {
    try {
      const response = await api.put(`/banks/${bankId}`, bankData);
      return response.data;
    } catch (error) {
      console.error('Error updating bank user:', error);
      throw new Error('Gagal mengupdate bank user');
    }
  }

  /**
   * Hapus bank user
   */
  async deleteBankUser(bankId: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/banks/${bankId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting bank user:', error);
      throw new Error('Gagal menghapus bank user');
    }
  }

  // ================== TRANSAKSI API METHODS ==================

  /**
   * Membuat transaksi baru
   */
  async createTransaksi(transaksiData: TransaksiData): Promise<TransaksiResponse> {
    try {
      const formData = new FormData();
      
      // Append semua data transaksi ke FormData
      formData.append('tanggal_pesanan', transaksiData.tanggal_pesanan);
      formData.append('total_harga', transaksiData.total_harga);
      formData.append('status_pengiriman', transaksiData.status_pengiriman);
      formData.append('jenis_pengiriman', transaksiData.jenis_pengiriman);
      formData.append('metode_pembayaran', transaksiData.metode_pembayaran);
      formData.append('alamat_pengiriman', transaksiData.alamat_pengiriman);
      formData.append('kode_pos', transaksiData.kode_pos);

      // Optional fields
      if (transaksiData.status_pembayaran) {
        formData.append('status_pembayaran', transaksiData.status_pembayaran);
      }
      if (transaksiData.tanggal_jatuh_tempo) {
        formData.append('tanggal_jatuh_tempo', transaksiData.tanggal_jatuh_tempo);
      }
      if (transaksiData.catatan_pembeli) {
        formData.append('catatan_pembeli', transaksiData.catatan_pembeli);
      }
      
      // Only append bukti_transfer if it exists (not for COD)
      if (transaksiData.bukti_transfer) {
        formData.append('bukti_transfer', transaksiData.bukti_transfer);
      }

      const response = await api.post<TransaksiResponse>('/transaksi', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error creating transaksi:', error);
      throw new Error('Gagal membuat transaksi');
    }
  }

  // ================== LOCAL STORAGE METHODS ==================

  /**
   * Simpan checkout state ke localStorage
   */
  saveCheckoutState(state: CheckoutState): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKOUT_STATE, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving checkout state:', error);
    }
  }

  /**
   * Ambil checkout state dari localStorage
   */
  getCheckoutState(): CheckoutState | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHECKOUT_STATE);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error getting checkout state:', error);
      return null;
    }
  }

  /**
   * Hapus checkout state dari localStorage
   */
  clearCheckoutState(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.CHECKOUT_STATE);
    } catch (error) {
      console.error('Error clearing checkout state:', error);
    }
  }

  /**
   * Simpan keranjang items ke localStorage
   */
  saveKeranjangItems(items: KeranjangItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.KERANJANG_ITEMS, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving keranjang items:', error);
    }
  }

  /**
   * Ambil keranjang items dari localStorage
   */
  getStoredKeranjangItems(): KeranjangItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.KERANJANG_ITEMS);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error getting keranjang items:', error);
      return [];
    }
  }

  /**
   * Simpan payment method ke localStorage
   */
  savePaymentMethod(paymentMethod: PaymentMethod): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENT_METHOD, JSON.stringify(paymentMethod));
    } catch (error) {
      console.error('Error saving payment method:', error);
    }
  }

  /**
   * Ambil payment method dari localStorage
   */
  getPaymentMethod(): PaymentMethod | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENT_METHOD);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error getting payment method:', error);
      return null;
    }
  }

  // ================== UTILITY METHODS ==================

  /**
   * Hitung total harga dari keranjang items
   */
  calculateTotalPrice(items: KeranjangItem[]): number {
    return items.reduce((total, item) => {
      const hargaJual = parseFloat(item.barang.harga_jual);
      return total + (hargaJual * item.jumlah);
    }, 0);
  }

  /**
   * Format harga ke string dengan separator
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  }

  /**
   * Validasi data alamat pengiriman
   */
  validateAlamatPengiriman(alamat: AlamatPengiriman): boolean {
    return !!(
      alamat.nama?.trim() &&
      alamat.no_hp?.trim() &&
      alamat.email?.trim() &&
      alamat.alamat?.trim() &&
      alamat.kode_pos?.trim()
    );
  }

  /**
   * Validasi payment method
   */
  validatePaymentMethod(paymentMethod: PaymentMethod): boolean {
    if (!paymentMethod.type) return false;
    
    if (paymentMethod.type === 'transfer_bank' || paymentMethod.type === 'transfer_ewallet') {
      return !!(paymentMethod.bank_admin && paymentMethod.bank_user);
    }
    
    return true; // COD tidak perlu validasi tambahan
  }

  /**
   * Cek apakah perlu upload bukti transfer
   */
  isRequireBuktiTransfer(paymentMethod: PaymentMethod): boolean {
    return paymentMethod.type === 'transfer_bank' || paymentMethod.type === 'transfer_ewallet';
  }

  /**
   * Siapkan data transaksi dari checkout state
   */
  prepareTransaksiData(
    checkoutState: CheckoutState,
    buktiTransfer?: File
  ): TransaksiData {
    const today = new Date();
    const jatuhTempo = new Date();
    jatuhTempo.setDate(today.getDate() + 7); // 7 hari dari sekarang

    // Determine status pembayaran based on payment method
    let statusPembayaran: 'belum_bayar' | 'lunas' | 'cod_pending';
    switch (checkoutState.paymentMethod.type) {
      case 'cod':
        statusPembayaran = StatusPembayaran.COD_PENDING;
        break;
      case 'transfer_bank':
      case 'transfer_ewallet':
        statusPembayaran = StatusPembayaran.LUNAS;
        break;
      default:
        statusPembayaran = StatusPembayaran.BELUM_BAYAR;
    }

    return {
      tanggal_pesanan: today.toISOString().split('T')[0],
      total_harga: checkoutState.totalHarga.toString(),
      status_pembayaran: statusPembayaran,
      status_pengiriman: 'dikirim',
      jenis_pengiriman: 'dikirim',
      metode_pembayaran: this.getMetodePembayaranString(checkoutState.paymentMethod),
      tanggal_jatuh_tempo: jatuhTempo.toISOString().split('T')[0],
      alamat_pengiriman: checkoutState.alamatPengiriman.alamat,
      kode_pos: checkoutState.alamatPengiriman.kode_pos,
      catatan_pembeli: checkoutState.catatanPembeli || '',
      bukti_transfer: buktiTransfer // Only include if provided (not for COD)
    };
  }

  /**
   * Konversi payment method ke string untuk API
   */
  private getMetodePembayaranString(paymentMethod: PaymentMethod): string {
    switch (paymentMethod.type) {
      case 'cod':
        return 'cod';
      case 'transfer_bank':
      case 'transfer_ewallet':
        return 'transfer';
      default:
        return 'cod';
    }
  }

  // ================== CHECKOUT FLOW METHODS ==================

  /**
   * Inisialisasi checkout dari keranjang
   */
  async initializeCheckout(): Promise<CheckoutState> {
    try {
      const keranjangItems = await this.getKeranjangItems(); // API call
      
      if (keranjangItems.length === 0) {
        throw new Error('Keranjang kosong');
      }

      // Ambil data user dari item pertama (semua item pasti punya user yang sama)
      const user = keranjangItems[0].user;
      
      const checkoutState: CheckoutState = {
        step: 1,
        keranjangItems,
        alamatPengiriman: {
          nama: user.nama,
          no_hp: user.no_hp,
          email: user.email,
          alamat: user.alamat,
          kode_pos: user.kode_pos
        },
        paymentMethod: { type: 'cod' },
        catatanPembeli: '',
        totalHarga: this.calculateTotalPrice(keranjangItems)
      };

      this.saveCheckoutState(checkoutState);
      this.saveKeranjangItems(keranjangItems); // Save to localStorage juga
      return checkoutState;
    } catch (error) {
      console.error('Error initializing checkout:', error);
      throw error;
    }
  }

  /**
   * Update step checkout
   */
  updateCheckoutStep(step: number): void {
    const currentState = this.getCheckoutState();
    if (currentState) {
      currentState.step = step;
      this.saveCheckoutState(currentState);
    }
  }

  /**
   * Update alamat pengiriman
   */
  updateAlamatPengiriman(alamat: AlamatPengiriman): void {
    const currentState = this.getCheckoutState();
    if (currentState) {
      currentState.alamatPengiriman = alamat;
      this.saveCheckoutState(currentState);
    }
  }

  /**
   * Update payment method
   */
  updatePaymentMethod(paymentMethod: PaymentMethod): void {
    const currentState = this.getCheckoutState();
    if (currentState) {
      currentState.paymentMethod = paymentMethod;
      this.saveCheckoutState(currentState);
    }
  }

  /**
   * Update catatan pembeli
   */
  updateCatatanPembeli(catatan: string): void {
    const currentState = this.getCheckoutState();
    if (currentState) {
      currentState.catatanPembeli = catatan;
      this.saveCheckoutState(currentState);
    }
  }

  /**
   * Proses checkout final
   */
  async processCheckout(buktiTransfer?: File): Promise<TransaksiResponse> {
    try {
      const checkoutState = this.getCheckoutState();
      
      if (!checkoutState) {
        throw new Error('Data checkout tidak ditemukan');
      }

      // Validasi data
      if (!this.validateAlamatPengiriman(checkoutState.alamatPengiriman)) {
        throw new Error('Data alamat pengiriman tidak lengkap');
      }

      if (!this.validatePaymentMethod(checkoutState.paymentMethod)) {
        throw new Error('Metode pembayaran tidak valid');
      }

      // Validasi bukti transfer untuk metode transfer
      if (this.isRequireBuktiTransfer(checkoutState.paymentMethod) && !buktiTransfer) {
        throw new Error('Bukti transfer wajib untuk metode pembayaran transfer');
      }

      // Untuk COD, pastikan tidak ada bukti transfer
      if (checkoutState.paymentMethod.type === 'cod' && buktiTransfer) {
        throw new Error('Bukti transfer tidak diperlukan untuk metode COD');
      }

      // Siapkan data transaksi
      const transaksiData = this.prepareTransaksiData(checkoutState, buktiTransfer);

      // Buat transaksi
      const result = await this.createTransaksi(transaksiData);

      // Clear checkout state setelah berhasil
      this.clearCheckoutState();

      return result;
    } catch (error) {
      console.error('Error processing checkout:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const keranjangService = new KeranjangService();