export interface Transaksi {
  id: number;
  kode_transaksi: string;
  user_id: number;
  tanggal_pesanan: string;
  total_harga: number;
  status_pembayaran: 'belum_bayar' | 'lunas';
  status_pengiriman: 'pending' | 'diproses' | 'dikirim' | 'selesai' | 'batal';
  jenis_pengiriman: 'diambil_sendiri' | 'dikirim';
  metode_pembayaran: 'cod' | 'transfer' | 'qris' | 'tempo';
  tanggal_jatuh_tempo?: string;
  alamat_pengiriman: string;
  kode_pos: string;
  catatan_pembeli?: string;
  created_at: string;
  updated_at: string;
}

export interface DetailTransaksi {
  transaksi_id: number;
  barang_id: number;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
}