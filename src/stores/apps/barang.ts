import { defineStore } from 'pinia';
import axios from 'axios';

interface Kategori {
  id: number;
  nama_kategori: string;
  deskripsi: string;
  created_at: string;
  updated_at: string;
}

interface Supplier {
  id: number;
  nama: string;
  alamat: string;
  kode_pos: string;
  email: string;
  no_telp: string;
  kategori: string;
  created_at: string;
  updated_at: string;
}

interface Barang {
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
  kategori?: Kategori;
  supplier?: Supplier;
}

interface CartItem {
  id: number;
  kode_barang: string;
  nama_barang: string;
  harga_jual: string;
  quantity: number;
  gambar_barang: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const useBarangStore = defineStore('barang', {
  state: () => ({
    barangList: [] as Barang[],
    kategoriList: [] as Kategori[],
    currentBarang: null as Barang | null,
    cart: [] as CartItem[],
    loading: false,
    error: null as string | null,
    searchQuery: '',
    sortBy: 'Harga: Rendah ke Tinggi',
  }),
  
  getters: {
    semuaBarang: (state) => state.barangList,
    
    detailBarang: (state) => state.currentBarang,
    
    keranjangBelanja: (state) => state.cart,
    
    totalKeranjang: (state) => {
      return state.cart.reduce((total, item) => {
        return total + (Number(item.harga_jual) * item.quantity);
      }, 0);
    },
    
    jumlahItemKeranjang: (state) => {
      return state.cart.reduce((count, item) => count + item.quantity, 0);
    },
    
    barangBerdasarkanKategori: (state) => (categoryId: number) => {
      return state.barangList.filter(barang => barang.kategori_id === categoryId);
    },
    
    filteredProducts: (state) => (categoryId: string | number, priceRange: number[]) => {
      let filtered = [...state.barangList];
      
      // Filter by category
      if (categoryId !== 'all') {
        filtered = filtered.filter(barang => barang.kategori_id === Number(categoryId));
      }
      
      // Filter by price range
      const [minPrice, maxPrice] = priceRange;
      filtered = filtered.filter(barang => {
        const harga = Number(barang.harga_jual);
        return harga >= minPrice && harga <= maxPrice;
      });
      
      // Filter by search query
      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(barang => 
          barang.nama_barang.toLowerCase().includes(query) ||
          (barang.kode_barang && barang.kode_barang.toLowerCase().includes(query)) ||
          (barang.merek && barang.merek.toLowerCase().includes(query)) ||
          (barang.deskripsi && barang.deskripsi.toLowerCase().includes(query))
        );
      }
      
      // Sort products
      switch (state.sortBy) {
        case 'Harga: Tinggi ke Rendah':
          return filtered.sort((a, b) => Number(b.harga_jual) - Number(a.harga_jual));
        case 'Harga: Rendah ke Tinggi':
          return filtered.sort((a, b) => Number(a.harga_jual) - Number(b.harga_jual));
        case 'Produk Terbaru':
          return filtered.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case 'Populer':
        default:
          return filtered;
      }
    },
  },
  
  actions: {
    async ambilSemuaBarang() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get<ApiResponse<Barang[]>>('http://127.0.0.1:8000/api/barang');
        
        if (response.data.success) {
          this.barangList = response.data.data.map(item => ({
            ...item,
            harga_jual: String(Number(item.harga_jual)) // Ensure harga_jual is properly formatted
          }));
        } else {
          throw new Error('Gagal mengambil data barang');
        }
      } catch (error: any) {
        this.error = error.message || 'Gagal mengambil data barang';
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async ambilKategori() {
      try {
        const response = await axios.get<ApiResponse<Kategori[]>>('http://127.0.0.1:8000/api/kategori-barang');
        if (response.data.success) {
          this.kategoriList = response.data.data;
        }
      } catch (error) {
        console.error('Gagal mengambil kategori', error);
      }
    },
    
    async ambilBarangById(id: string | number) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get<ApiResponse<Barang>>(`http://127.0.0.1:8000/api/barang/${id}`);
        
        if (response.data.success) {
          this.currentBarang = response.data.data;
        } else {
          throw new Error('Barang tidak ditemukan');
        }
      } catch (error: any) {
        this.error = error.message || 'Gagal mengambil detail barang';
        this.currentBarang = null;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },
    
    tambahKeKeranjang(item: CartItem) {
      const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        this.cart.push({ ...item });
      }
    },
    
    hapusDariKeranjang(itemId: number) {
      const index = this.cart.findIndex(item => item.id === itemId);
      if (index > -1) {
        this.cart.splice(index, 1);
      }
    },
    
    updateJumlahItem(itemId: number, quantity: number) {
      const item = this.cart.find(cartItem => cartItem.id === itemId);
      if (item) {
        if (quantity <= 0) {
          this.hapusDariKeranjang(itemId);
        } else {
          item.quantity = quantity;
        }
      }
    },
    
    kosongkanKeranjang() {
      this.cart = [];
    },
    
    setSearchQuery(query: string) {
      this.searchQuery = query;
    },
    
    setSortBy(sortBy: string) {
      this.sortBy = sortBy;
    },
    
    barangSerupa(currentBarangId: number, limit = 4) {
      if (!this.currentBarang) return [];
      return this.barangList
        .filter(barang => barang.id !== currentBarangId && barang.kategori_id === this.currentBarang?.kategori_id)
        .slice(0, limit);
    },
    
    barangStokSedikit() {
      return this.barangList.filter(barang => barang.stok <= barang.stok_minimum);
    },
    
    barangHabis() {
      return this.barangList.filter(barang => barang.stok === 0);
    },
  },
});