import { defineStore } from 'pinia';
// project imports
import axios from '@/utils/axios';
// types
import { filter, sum } from 'lodash';

// Define interfaces for better type checking
interface KategoriBarang {
  id: number;
  nama_kategori: string;
  deskripsi: string;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: number;
  name: string;
  image: string;
  date: string | Date;
  offerPrice: number;
  salePrice: number;
  isStock: boolean;
  qty?: number;
  // Add other product properties as needed
}

export const useEcomStore = defineStore({
  id: 'eCommerce',
  state: () => ({
    products: [] as Product[],
    cart: [] as Product[],
    gender: '',
    category: [],
    price: '',
    subTotal: 0,
    discount: 5,
    total: 0,
    addresses: [],
    kategoriBarang: [] as KategoriBarang[],
    currentKategori: null as KategoriBarang | null,
    loading: false,
    error: null as string | null
  }),
  getters: {},
  actions: {
    // Fetch Products from action
    async fetchProducts() {
      try {
        this.loading = true;
        const response = await axios.get('/api/products/list');
        this.products = response.data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.error = 'Failed to fetch products';
        console.error(error);
      }
    },

    // Fetch Addresses
    async fetchAddress() {
      try {
        this.loading = true;
        const response = await axios.get('/api/address/list');
        this.addresses = response.data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.error = 'Failed to fetch addresses';
        console.error(error);
      }
    },

    // Fetch all kategori barang - Using Laravel API
    async fetchKategoriBarang() {
      try {
        this.loading = true;
        const response = await axios.get('/api/kategori-barang');
        if (response.data.success) {
          this.kategoriBarang = response.data.data;
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.error = 'Failed to fetch categories';
        console.error(error);
      }
    },

    // Fetch single kategori barang by ID - Using Laravel API
    async fetchKategoriBarangById(id: number) {
      try {
        this.loading = true;
        const response = await axios.get(`/api/kategori-barang/${id}`);
        this.loading = false;
        if (response.data.success) {
          this.currentKategori = response.data.data;
          return response.data.data;
        }
        return null;
      } catch (error) {
        this.loading = false;
        this.error = `Failed to fetch category with ID ${id}`;
        console.error(error);
        return null;
      }
    },

    // Create new kategori barang - Using Laravel API
    async createKategoriBarang(kategoriData: { nama_kategori: string; deskripsi: string }) {
      try {
        this.loading = true;
        const response = await axios.post('/api/kategori-barang', kategoriData);
        this.loading = false;
        if (response.data.success) {
          // Add the new kategori to the list
          this.kategoriBarang.push(response.data.data);
          return response.data.data;
        }
        return null;
      } catch (error) {
        this.loading = false;
        this.error = 'Failed to create category';
        console.error(error);
        return null;
      }
    },

    // Update kategori barang - Using Laravel API
    async updateKategoriBarang(id: number, kategoriData: { nama_kategori: string; deskripsi: string }) {
      try {
        this.loading = true;
        const response = await axios.put(`/api/kategori-barang/${id}`, kategoriData);
        this.loading = false;
        if (response.data.success) {
          // Update the kategori in the list
          const index = this.kategoriBarang.findIndex(item => item.id === id);
          if (index !== -1) {
            this.kategoriBarang[index] = response.data.data;
          }
          
          // Update currentKategori if it's the one being edited
          if (this.currentKategori && this.currentKategori.id === id) {
            this.currentKategori = response.data.data;
          }
          
          return response.data.data;
        }
        return null;
      } catch (error) {
        this.loading = false;
        this.error = `Failed to update category with ID ${id}`;
        console.error(error);
        return null;
      }
    },

    // Delete kategori barang - Using Laravel API
    async deleteKategoriBarang(id: number) {
      try {
        this.loading = true;
        const response = await axios.delete(`/api/kategori-barang/${id}`);
        this.loading = false;
        if (response.data.success) {
          // Remove the kategori from the list
          this.kategoriBarang = this.kategoriBarang.filter(item => item.id !== id);
          
          // Reset currentKategori if it's the one being deleted
          if (this.currentKategori && this.currentKategori.id === id) {
            this.currentKategori = null;
          }
          
          return true;
        }
        return false;
      } catch (error) {
        this.loading = false;
        this.error = `Failed to delete category with ID ${id}`;
        console.error(error);
        return false;
      }
    },

    // Select gender
    SelectGender(items: string) {
      this.gender = items;
    },

    // Select category
    SelectCategory(items: any[]) {
      this.category = items;
    },

    // AddToCart
    AddToCart(item: Product) {
      const product = item;
      this.cart = [...this.cart, product];
    },

    // Increment quantity
    incrementQty(item: Product, cart: Product[]) {
      const productId = item.id;
      const updateCart = cart.map((product) => {
        if (product.id === productId) {
          const updatedQty = (product.qty || 0) + 1; // Ensure qty is defined and increment it
          return {
            ...product,
            qty: updatedQty
          };
        }
        return product;
      });
      // Update cart
      this.cart = updateCart;
      this.recalculateCartTotals();
    },

    // Decrement quantity
    decrementQty(item: number | string) {
      if (typeof item !== 'number' && typeof item !== 'string') return;
      const productId = item;
      const updateCart = this.cart.map((product) => {
        if (product.id === productId) {
          const newQty = typeof product.qty === 'number' && product.qty - 1 >= 0 ? product.qty - 1 : 0;
          return {
            ...product,
            qty: newQty
          };
        }
        return product;
      });
      this.cart = updateCart;
      this.recalculateCartTotals();
    },

    // Delete from cart
    deleteCart(itemId: number) {
      const updateCart = filter(this.cart, (p) => p.id !== itemId);
      this.cart = updateCart;
      this.recalculateCartTotals();
    },

    // Recalculate cart totals
    recalculateCartTotals() {
      // Calculate subtotal
      this.subTotal = sum(
        this.cart.map((product) => {
          if (typeof product.salePrice === 'number' && typeof product.qty === 'number') {
            return product.salePrice * product.qty;
          } else {
            return 0;
          }
        })
      );
      
      // Calculate discount (5%)
      this.discount = Math.round(this.subTotal * (5 / 100));
      
      // Calculate total (subtotal - discount)
      this.total = this.subTotal - this.discount;
    },

    // Get subtotal
    getsubTotal() {
      this.subTotal = sum(
        this.cart.map((product) => {
          if (typeof product.salePrice === 'number' && typeof product.qty === 'number') {
            return product.salePrice * product.qty;
          } else {
            return 0;
          }
        })
      );
    },

    // Get total
    getTotal() {
      this.total = this.subTotal - this.discount;
    },

    // Get discount
    getDiscount() {
      this.discount = Math.round(this.subTotal * (5 / 100));
    }
  }
});