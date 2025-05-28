import { defineStore } from 'pinia';
import axios from 'axios';

export interface Product {
  id: number;
  kode_barang: string;
  nama_barang: string;
  merek: string;
  kategori_id: number;
  supplier_id: number;
  gambar_barang: string | null;
  harga_beli: string;
  harga_jual: string;
  berat_barang: number;
  satuan: string;
  stok: number;
  stok_minimum: number;
  deskripsi: string;
  created_at: string;
  updated_at: string;
  kategori: {
    id: number;
    nama_kategori: string;
    deskripsi: string;
    created_at: string;
    updated_at: string;
  };
  supplier: {
    id: number;
    nama: string;
    alamat: string;
    kode_pos: string;
    email: string;
    no_telp: string;
    kategori: string;
    created_at: string;
    updated_at: string;
  };
}

export interface ProductFilters {
  searchQuery: string;
  sortBy: string;
  categories: string[];
  priceRange: [number, number];
  rating: number;
  colors: string[];
}

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [] as Product[],
    loading: false,
    error: null as string | null,
    filters: {
      searchQuery: '',
      sortBy: 'Harga: Rendah ke Tinggi',
      categories: ['all'],
      priceRange: [0, 1000000] as [number, number],
      rating: 0,
      colors: []
    } as ProductFilters,
    categories: [] as any[],
    suppliers: [] as any[]
  }),

  getters: {
    filteredProducts: (state) => {
      let filtered = [...state.products];

      // Filter by search query
      if (state.filters.searchQuery) {
        filtered = filtered.filter(product =>
          product.nama_barang.toLowerCase().includes(state.filters.searchQuery.toLowerCase()) ||
          product.merek.toLowerCase().includes(state.filters.searchQuery.toLowerCase()) ||
          product.deskripsi.toLowerCase().includes(state.filters.searchQuery.toLowerCase())
        );
      }

      // Filter by categories
      if (!state.filters.categories.includes('all') && state.filters.categories.length > 0) {
        filtered = filtered.filter(product =>
          state.filters.categories.includes(product.kategori.nama_kategori.toLowerCase())
        );
      }

      // Filter by price range
      filtered = filtered.filter(product => {
        const price = parseFloat(product.harga_jual);
        return price >= state.filters.priceRange[0] && price <= state.filters.priceRange[1];
      });

      // Sort products
      switch (state.filters.sortBy) {
        case 'Harga: Tinggi ke Rendah':
          filtered.sort((a, b) => parseFloat(b.harga_jual) - parseFloat(a.harga_jual));
          break;
        case 'Harga: Rendah ke Tinggi':
          filtered.sort((a, b) => parseFloat(a.harga_jual) - parseFloat(b.harga_jual));
          break;
        case 'Produk Terbaru':
          filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        case 'Populer':
          // Sort by stock (assuming higher stock = more popular)
          filtered.sort((a, b) => b.stok - a.stok);
          break;
        default:
          break;
      }

      return filtered;
    },

    productById: (state) => (id: number) => {
      return state.products.find(product => product.id === id);
    },

    uniqueCategories: (state) => {
      const categories = state.products.map(product => product.kategori);
      return categories.filter((category, index, self) =>
        index === self.findIndex(c => c.id === category.id)
      );
    },

    uniqueSuppliers: (state) => {
      const suppliers = state.products.map(product => product.supplier);
      return suppliers.filter((supplier, index, self) =>
        index === self.findIndex(s => s.id === supplier.id)
      );
    },

    priceRange: (state) => {
      if (state.products.length === 0) return [0, 1000000];
      const prices = state.products.map(product => parseFloat(product.harga_jual));
      return [Math.min(...prices), Math.max(...prices)];
    }
  },

  actions: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await axios.get('/api/barang', {
          headers: {
            Accept: 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        });

        if (response.data.success) {
          this.products = response.data.data;
          // Update price range based on actual data
          const prices = this.products.map(product => parseFloat(product.harga_jual));
          if (prices.length > 0) {
            this.filters.priceRange = [Math.min(...prices), Math.max(...prices)];
          }
        } else {
          this.error = 'Failed to fetch products';
        }
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch products';
        console.error('Error fetching products:', error);
      } finally {
        this.loading = false;
      }
    },

    setSearchQuery(query: string) {
      this.filters.searchQuery = query;
    },

    setSortBy(sortBy: string) {
      this.filters.sortBy = sortBy;
    },

    setCategories(categories: string[]) {
      this.filters.categories = categories;
    },

    setPriceRange(range: [number, number]) {
      this.filters.priceRange = range;
    },

    setRating(rating: number) {
      this.filters.rating = rating;
    },

    setColors(colors: string[]) {
      this.filters.colors = colors;
    },

    resetFilters() {
      this.filters = {
        searchQuery: '',
        sortBy: 'Harga: Rendah ke Tinggi',
        categories: ['all'],
        priceRange: this.priceRange,
        rating: 0,
        colors: []
      };
    }
  }
});