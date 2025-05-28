import { defineStore } from 'pinia';
import type { Product } from './products';

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  selected?: boolean;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    wishlist: [] as Product[]
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },

    totalPrice: (state) => {
      return state.items.reduce((total, item) => {
        return total + (parseFloat(item.product.harga_jual) * item.quantity);
      }, 0);
    },

    selectedItems: (state) => {
      return state.items.filter(item => item.selected);
    },

    selectedTotalPrice: (state) => {
      return state.items
        .filter(item => item.selected)
        .reduce((total, item) => {
          return total + (parseFloat(item.product.harga_jual) * item.quantity);
        }, 0);
    },

    isInWishlist: (state) => (productId: number) => {
      return state.wishlist.some(item => item.id === productId);
    },

    isInCart: (state) => (productId: number) => {
      return state.items.some(item => item.product.id === productId);
    },

    getCartItem: (state) => (productId: number) => {
      return state.items.find(item => item.product.id === productId);
    }
  },

  actions: {
    addToCart(product: Product, quantity: number = 1) {
      const existingItem = this.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({
          id: Date.now(),
          product,
          quantity,
          selected: true
        });
      }
      
      // Save to localStorage
      this.saveToStorage();
    },

    removeFromCart(productId: number) {
      const index = this.items.findIndex(item => item.product.id === productId);
      if (index > -1) {
        this.items.splice(index, 1);
        this.saveToStorage();
      }
    },

    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find(item => item.product.id === productId);
      if (item) {
        if (quantity > 0) {
          item.quantity = quantity;
        } else {
          this.removeFromCart(productId);
        }
        this.saveToStorage();
      }
    },

    toggleItemSelection(productId: number) {
      const item = this.items.find(item => item.product.id === productId);
      if (item) {
        item.selected = !item.selected;
        this.saveToStorage();
      }
    },

    selectAllItems(selected: boolean) {
      this.items.forEach(item => {
        item.selected = selected;
      });
      this.saveToStorage();
    },

    clearCart() {
      this.items = [];
      this.saveToStorage();
    },

    addToWishlist(product: Product) {
      if (!this.isInWishlist(product.id)) {
        this.wishlist.push(product);
        this.saveToStorage();
      }
    },

    removeFromWishlist(productId: number) {
      const index = this.wishlist.findIndex(item => item.id === productId);
      if (index > -1) {
        this.wishlist.splice(index, 1);
        this.saveToStorage();
      }
    },

    toggleWishlist(product: Product) {
      if (this.isInWishlist(product.id)) {
        this.removeFromWishlist(product.id);
      } else {
        this.addToWishlist(product);
      }
    },

    saveToStorage() {
      try {
        localStorage.setItem('cart', JSON.stringify(this.items));
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    },

    loadFromStorage() {
      try {
        const cartData = localStorage.getItem('cart');
        const wishlistData = localStorage.getItem('wishlist');
        
        if (cartData) {
          this.items = JSON.parse(cartData);
        }
        
        if (wishlistData) {
          this.wishlist = JSON.parse(wishlistData);
        }
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }
});