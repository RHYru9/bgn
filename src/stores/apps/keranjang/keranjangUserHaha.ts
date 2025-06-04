import api from '@/services/axiosInstance';

export interface KeranjangData {
  barang_id?: number;
  jumlah?: number;
}

// Tambah keranjang (POST)
export async function tambahKeranjang(data: KeranjangData) {
  try {
    const response = await api.post('/keranjang', data);
    return response.data;
  } catch (error) {
    console.error('Gagal menambahkan keranjang:', error);
    throw error;
  }
}

// Hapus keranjang (DELETE)
export async function hapusKeranjang(id: number) {
  try {
    const response = await api.delete(`/keranjang/${id}`);
    return response.data;
  } catch (error) {
    console.error('Gagal menghapus keranjang:', error);
    throw error;
  }
}

// Update keranjang (PUT)
export async function updateKeranjang(id: number, data: KeranjangData) {
  try {
    const response = await api.put(`/keranjang/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Gagal mengupdate keranjang:', error);
    throw error;
  }
}
