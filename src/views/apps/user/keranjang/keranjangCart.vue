<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useKeranjangStore } from '@/stores/apps/keranjang/keranjangcart'
import { useCustomizerStore } from '@/stores/customizer'
import { useDisplay } from 'vuetify'
import Appbar from '@/views/pages/landingpage/Components/AppBarMenu.vue'
import FooterSection from '@/views/pages/landingpage/Components/FooterSection.vue'

// Types
interface Barang {
  id: number
  nama_barang: string
  merek: string
  kode_barang: string
  gambar_barang: string
  harga_jual: string
  harga_beli: string
  satuan: string
  berat_barang: number
  stok: number
}

interface KeranjangItem {
  id: number
  user_id: number
  barang_id: number
  jumlah: number
  created_at: string
  updated_at: string
  barang: Barang
}

interface GroupedItem {
  id: number
  barang_id: number
  totalQuantity: number
  totalPrice: number
  items: KeranjangItem[]
  barang: Barang
}

// Composables
const router = useRouter()
const keranjangStore = useKeranjangStore()
const customizerStore = useCustomizerStore()
const { mobile } = useDisplay()

// State
const confirmDialog = ref(false)
const itemToRemove = ref<KeranjangItem | null>(null)
const loadingStates = ref<Record<number, boolean>>({})
const errorStates = ref<Record<number, string>>({})

// Computed Properties
const groupedItems = computed<GroupedItem[]>(() => {
  const groupedMap = new Map<number, GroupedItem>()

  keranjangStore.getKeranjangItems.forEach(item => {
    if (!groupedMap.has(item.barang_id)) {
      groupedMap.set(item.barang_id, {
        id: item.id,
        barang_id: item.barang_id,
        totalQuantity: 0,
        totalPrice: 0,
        items: [],
        barang: item.barang
      })
    }

    const group = groupedMap.get(item.barang_id)!
    group.totalQuantity += item.jumlah
    group.totalPrice += item.jumlah * parseFloat(item.barang.harga_jual)
    group.items.push(item)
  })

  return Array.from(groupedMap.values())
})

const totalItems = computed(() => 
  groupedItems.value.reduce((sum, item) => sum + item.totalQuantity, 0)
)

const totalWeight = computed(() =>
  groupedItems.value.reduce((sum, item) => sum + (item.totalQuantity * item.barang.berat_barang), 0)
)

const subtotal = computed(() =>
  groupedItems.value.reduce((sum, item) => sum + item.totalPrice, 0)
)

const hasOutOfStockItems = computed(() =>
  groupedItems.value.some(item => item.barang.stok < item.totalQuantity)
)

// Methods
const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/images/placeholder.png'
  return imagePath.startsWith('http') ? imagePath : `http://127.0.0.1:8000/${imagePath}`
}

const setLoading = (itemId: number, isLoading: boolean) => {
  loadingStates.value = { ...loadingStates.value, [itemId]: isLoading }
}

const setError = (itemId: number, error: string) => {
  errorStates.value = { ...errorStates.value, [itemId]: error }
}

const clearError = (itemId: number) => {
  const { [itemId]: _, ...rest } = errorStates.value
  errorStates.value = rest
}

const updateQuantity = async (group: GroupedItem, newQuantity: number) => {
  // Validasi: quantity minimal adalah 1
  if (newQuantity < 1) {
    setError(group.items[0].id, 'Jumlah minimal 1')
    return false
  }

  // Validasi: quantity tidak boleh melebihi stok
  if (newQuantity > group.barang.stok) {
    setError(group.items[0].id, `Stok tersedia hanya ${group.barang.stok}`)
    return false
  }

  try {
    setLoading(group.items[0].id, true)
    clearError(group.items[0].id)

    // Calculate difference
    const quantityDifference = newQuantity - group.totalQuantity

    if (quantityDifference === 0) return true

    // Untuk perubahan kecil (tambah/kurang 1), update item pertama
    if (Math.abs(quantityDifference) === 1) {
      const firstItem = group.items[0]
      const newItemQuantity = firstItem.jumlah + quantityDifference
      
      // Pastikan quantity item tidak kurang dari 1
      if (newItemQuantity >= 1) {
        await keranjangStore.updateKeranjangItem(firstItem.id, newItemQuantity)
      }
    } 
    // Untuk perubahan besar, reorganisasi semua items dalam group
    else {
      let remainingQuantity = newQuantity
      
      // Update atau hapus existing items
      for (const item of group.items) {
        if (remainingQuantity <= 0) {
          // Hapus item jika tidak diperlukan lagi
          await keranjangStore.removeFromKeranjang(item.id)
          continue
        }

        const quantityToAssign = Math.min(remainingQuantity, item.jumlah)
        
        if (quantityToAssign !== item.jumlah) {
          if (quantityToAssign > 0) {
            await keranjangStore.updateKeranjangItem(item.id, quantityToAssign)
          } else {
            await keranjangStore.removeFromKeranjang(item.id)
          }
        }
        
        remainingQuantity -= quantityToAssign
      }

      // Tambah item baru jika masih ada sisa quantity
      if (remainingQuantity > 0) {
        await keranjangStore.addToKeranjang(group.barang_id, remainingQuantity)
      }
    }

    await keranjangStore.fetchKeranjang()
    return true
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Gagal memperbarui jumlah'
    setError(group.items[0].id, errorMessage)
    console.error('Error updating cart:', error)
    return false
  } finally {
    setLoading(group.items[0].id, false)
  }
}

const increaseQuantity = async (group: GroupedItem) => {
  // Cek apakah masih bisa ditambah (tidak melebihi stok)
  if (group.totalQuantity >= group.barang.stok) {
    setError(group.items[0].id, `Stok tersedia hanya ${group.barang.stok}`)
    return
  }
  
  await updateQuantity(group, group.totalQuantity + 1)
}

const decreaseQuantity = async (group: GroupedItem) => {
  // Jika quantity sudah 1, maka hapus item dari keranjang
  if (group.totalQuantity <= 1) {
    removeItem(group)
    return
  }
  
  // Kurangi quantity sebesar 1
  await updateQuantity(group, group.totalQuantity - 1)
}

const removeItem = (group: GroupedItem) => {
  itemToRemove.value = group.items[0]
  confirmDialog.value = true
}

const confirmRemove = async () => {
  if (!itemToRemove.value) return

  try {
    setLoading(itemToRemove.value.id, true)
    
    // Remove all items in the group
    const group = groupedItems.value.find(g => g.barang_id === itemToRemove.value?.barang_id)
    if (group) {
      for (const item of group.items) {
        await keranjangStore.removeFromKeranjang(item.id)
      }
    }
    
    confirmDialog.value = false
    itemToRemove.value = null
    await keranjangStore.fetchKeranjang()
  } catch (error) {
    console.error('Error removing item:', error)
  } finally {
    setLoading(itemToRemove.value?.id || 0, false)
  }
}

const proceedToCheckout = () => {
  if (keranjangStore.getKeranjangItems.length === 0) return
  
  if (hasOutOfStockItems.value) {
    setError(0, 'Terdapat barang yang melebihi stok tersedia')
    return
  }
  
  router.push('/checkout/shipping')
}

// Lifecycle
onMounted(async () => {
  try {
    await keranjangStore.fetchKeranjang()
  } catch (error) {
    console.error('Error fetching cart:', error)
  }
})
</script>

<template>
  <div class="page-wrapper">
    <Appbar />
    
    <div class="main-content">
      <v-container fluid class="px-4 px-md-6">
        <!-- Cart Header -->
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center mb-4">
              <h2 class="text-h5 font-weight-bold">Keranjang Belanja</h2>
              <v-chip 
                v-if="keranjangStore.getKeranjangItems.length > 0" 
                class="ml-2" 
                size="small" 
                color="primary"
              >
                {{ keranjangStore.getKeranjangItems.length }} item
              </v-chip>
            </div>
          </v-col>
        </v-row>

        <!-- Loading State -->
        <v-row v-if="keranjangStore.loading && keranjangStore.getKeranjangItems.length === 0">
          <v-col cols="12">
            <v-skeleton-loader type="list-item-three-line@3"></v-skeleton-loader>
          </v-col>
        </v-row>

        <!-- Error State -->
        <v-row v-else-if="keranjangStore.error">
          <v-col cols="12">
            <v-alert type="error" variant="tonal">
              {{ keranjangStore.error }}
              <v-btn 
                variant="text" 
                color="error" 
                @click="keranjangStore.fetchKeranjang()"
                class="ml-2"
              >
                Coba Lagi
              </v-btn>
            </v-alert>
          </v-col>
        </v-row>

        <!-- Empty Cart -->
        <v-row v-else-if="keranjangStore.getKeranjangItems.length === 0">
          <v-col cols="12">
            <v-card class="text-center pa-8" variant="outlined">
              <v-icon size="64" color="grey-lighten-1" class="mb-4">
                mdi-cart-outline
              </v-icon>
              <h3 class="text-h6 mb-2">Keranjang belanja Anda kosong</h3>
              <p class="text-body-2 text-medium-emphasis mb-4">
                Tambahkan beberapa item untuk memulai
              </p>
              <v-btn color="primary" variant="flat" @click="router.push('/produk')">
                <v-icon start>mdi-shopping</v-icon>
                Lanjutkan Berbelanja
              </v-btn>
            </v-card>
          </v-col>
        </v-row>

        <!-- Cart Items -->
        <v-row v-else>
          <v-col cols="12" md="8">
            <v-card variant="outlined" rounded="lg">
              <v-card-text class="pa-0">
                <!-- Back to Shopping Link -->
                <div class="pa-4 border-b">
                  <v-btn 
                    variant="text" 
                    color="primary" 
                    @click="router.push('/products')"
                    class="pl-0"
                  >
                    <v-icon start size="18">mdi-chevron-left</v-icon>
                    Kembali Berbelanja
                  </v-btn>
                </div>

                <!-- Cart Items List -->
                <div class="pa-4">
                  <v-list class="pa-0">
                    <template v-for="(group, index) in groupedItems" :key="group.barang_id">
                      <v-list-item class="pa-0 mb-4">
                        <template #prepend>
                          <v-avatar size="80" rounded="lg" class="me-4">
                            <v-img 
                              :src="getImageUrl(group.barang.gambar_barang)" 
                              :alt="group.barang.nama_barang"
                              cover
                              aspect-ratio="1"
                            >
                              <template #placeholder>
                                <div class="d-flex align-center justify-center fill-height">
                                  <v-icon size="32" color="grey-lighten-3">
                                    mdi-image-outline
                                  </v-icon>
                                </div>
                              </template>
                            </v-img>
                          </v-avatar>
                        </template>

                        <div class="flex-grow-1">
                          <div class="d-flex justify-space-between align-start">
                            <div class="flex-grow-1 me-4">
                              <h4 class="text-subtitle-1 font-weight-medium mb-1">
                                {{ group.barang.nama_barang }}
                              </h4>
                              <p class="text-body-2 text-medium-emphasis mb-2">
                                {{ group.barang.merek }} • {{ group.barang.kode_barang }}
                              </p>
                              <div class="text-h6 font-weight-bold text-primary">
                                {{ keranjangStore.formatCurrency(parseFloat(group.barang.harga_jual)) }}
                                <span class="text-body-2 text-medium-emphasis">/ {{ group.barang.satuan }}</span>
                              </div>
                              
                              <!-- Stock info -->
                              <v-chip 
                                v-if="group.barang.stok < group.totalQuantity"
                                size="small"
                                color="warning"
                                variant="outlined"
                                class="mt-1"
                              >
                                Stok tersedia: {{ group.barang.stok }}
                              </v-chip>
                            </div>

                            <!-- Quantity Controls & Remove -->
                            <div class="d-flex flex-column align-end">
                              <v-btn 
                                icon="mdi-delete-outline" 
                                size="small" 
                                variant="text" 
                                color="error"
                                class="mb-2"
                                @click="removeItem(group)"
                                :loading="loadingStates[group.items[0].id]"
                              ></v-btn>

                              <div class="d-flex align-center">
                                <v-btn 
                                  icon="mdi-minus" 
                                  size="small" 
                                  variant="outlined"
                                  @click="decreaseQuantity(group)"
                                  :disabled="loadingStates[group.items[0].id]"
                                ></v-btn>
                                
                                <span class="mx-3 text-body-1 font-weight-medium" style="min-width: 40px; text-align: center;">
                                  {{ group.totalQuantity }}
                                </span>
                                
                                <v-btn 
                                  icon="mdi-plus" 
                                  size="small" 
                                  variant="outlined"
                                  @click="increaseQuantity(group)"
                                  :disabled="group.totalQuantity >= group.barang.stok || loadingStates[group.items[0].id]"
                                ></v-btn>
                              </div>
                            </div>
                          </div>

                          <!-- Error message -->
                          <v-alert
                            v-if="errorStates[group.items[0].id]"
                            type="error"
                            variant="tonal"
                            density="compact"
                            class="mt-2"
                          >
                            {{ errorStates[group.items[0].id] }}
                          </v-alert>

                          <!-- Item Subtotal -->
                          <div class="d-flex justify-space-between align-center mt-3">
                            <span class="text-body-2 text-medium-emphasis">
                              Subtotal ({{ group.totalQuantity }} {{ group.barang.satuan }}):
                            </span>
                            <span class="text-subtitle-1 font-weight-bold">
                              {{ keranjangStore.formatCurrency(group.totalPrice) }}
                            </span>
                          </div>
                        </div>
                      </v-list-item>

                      <v-divider v-if="index < groupedItems.length - 1" class="my-4"></v-divider>
                    </template>
                  </v-list>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Order Summary -->
          <v-col cols="12" md="4">
            <div class="summary-wrapper">
              <v-card variant="outlined" rounded="lg" class="summary-card">
                <v-card-title class="text-h6 font-weight-bold pa-4 border-b">
                  Ringkasan Pesanan
                </v-card-title>
                
                <v-card-text class="pa-4">
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-body-1">Sub Total</span>
                    <span class="text-body-1 font-weight-medium">
                      {{ keranjangStore.formatCurrency(subtotal) }}
                    </span>
                  </div>

                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-body-2 text-medium-emphasis">Total Barang</span>
                    <span class="text-body-2">
                      {{ totalItems }} barang
                    </span>
                  </div>

                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-body-2 text-medium-emphasis">Total Berat</span>
                    <span class="text-body-2">
                      {{ totalWeight }} kg
                    </span>
                  </div>

                  <v-divider class="my-4"></v-divider>

                  <div class="d-flex justify-space-between align-center mb-4">
                    <span class="text-h6 font-weight-bold">Total</span>
                    <span class="text-h6 font-weight-bold text-primary">
                      {{ keranjangStore.formatCurrency(subtotal) }}
                    </span>
                  </div>

                  <v-btn 
                    color="primary" 
                    variant="flat" 
                    block 
                    size="large"
                    rounded="lg"
                    @click="proceedToCheckout"
                    :disabled="keranjangStore.getKeranjangItems.length === 0 || hasOutOfStockItems"
                  >
                    Lanjut ke Checkout
                  </v-btn>

                  <!-- Warning if any item exceeds stock -->
                  <v-alert
                    v-if="hasOutOfStockItems"
                    type="warning"
                    variant="tonal"
                    density="compact"
                    class="mt-4"
                  >
                    Beberapa barang melebihi stok yang tersedia
                  </v-alert>

                  <!-- Global error message -->
                  <v-alert
                    v-if="errorStates[0]"
                    type="error"
                    variant="tonal"
                    density="compact"
                    class="mt-4"
                  >
                    {{ errorStates[0] }}
                  </v-alert>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>

        <!-- Confirmation Dialog -->
        <v-dialog v-model="confirmDialog" max-width="400" persistent>
          <v-card>
            <v-card-title class="text-h6">
              Hapus Barang
            </v-card-title>
            <v-card-text>
              Apakah Anda yakin ingin menghapus <strong>{{ itemToRemove?.barang.nama_barang }}</strong> dari keranjang?
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="text" @click="confirmDialog = false" :disabled="loadingStates[itemToRemove?.id || 0]">
                Batal
              </v-btn>
              <v-btn 
                color="error" 
                variant="flat" 
                @click="confirmRemove"
                :loading="loadingStates[itemToRemove?.id || 0]"
              >
                Hapus
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </div>

    <FooterSection />
  </div>
</template>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: rgb(var(--v-theme-background));
}

.main-content {
  flex: 1;
  padding-top: 80px;
  padding-bottom: 2rem;
}

.border-b {
  border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.summary-wrapper {
  position: sticky;
  top: 100px;
}

.summary-card {
  position: sticky;
  top: 100px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .main-content {
    padding-top: 70px;
  }
  
  .summary-wrapper {
    position: static;
  }
  
  .summary-card {
    position: static;
    box-shadow: none;
  }
}

@media (min-width: 1264px) {
  .main-content {
    padding-top: 90px;
  }
  
  .summary-wrapper {
    top: 110px;
  }
}

/* Animation for cart items */
.v-list-item {
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.02);
  transform: translateY(-2px);
}
</style>