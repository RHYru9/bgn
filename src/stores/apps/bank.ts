import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios, { AxiosError } from 'axios';

export interface Bank {
  id?: number;
  user_id?: number;
  nama_rekening: string;
  bank_tipe: 'dana' | 'ovo' | 'gopay' | 'bca' | 'bni' | 'bri' | 'mandiri' | 'btn';
  no_rekening: string;
  created_at?: string;
  updated_at?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface BankFormData {
  nama_rekening: string;
  bank_tipe: Bank['bank_tipe'];
  no_rekening: string;
  user_id?: number;
}

// Axios instance with token
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useBankStore = defineStore('bank', () => {
  const banks = ref<Bank[]>([]);
  const myBanks = ref<Bank[]>([]);
  const adminBanks = ref<Bank[]>([]); // 🆕 Admin banks
  const currentBank = ref<Bank | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const bankTypes = computed(() => [
    { value: 'dana', label: 'DANA', icon: 'dana', color: '#118EEA' },
    { value: 'ovo', label: 'OVO', icon: 'ovo', color: '#4C3494' },
    { value: 'gopay', label: 'GoPay', icon: 'gopay', color: '#00AA13' },
    { value: 'bca', label: 'Bank BCA', icon: 'bca', color: '#0066CC' },
    { value: 'bni', label: 'Bank BNI', icon: 'bni', color: '#FF6600' },
    { value: 'bri', label: 'Bank BRI', icon: 'bri', color: '#003D7A' },
    { value: 'mandiri', label: 'Bank Mandiri', icon: 'mandiri', color: '#003D79' },
    { value: 'btn', label: 'Bank BTN', icon: 'btn', color: '#FF6B35' }
  ]);

  const getBankTypeInfo = (type: string) => {
    return bankTypes.value.find(bank => bank.value === type) || bankTypes.value[0];
  };

  const isEWallet = (type: string) => ['dana', 'ovo', 'gopay'].includes(type);

  const setLoading = (state: boolean) => loading.value = state;
  const setError = (message: string | null) => error.value = message;
  const clearError = () => error.value = null;

  const fetchAllBanks = async () => {
    try {
      setLoading(true);
      clearError();
      const { data } = await axiosInstance.get<Bank[]>('/banks');
      banks.value = data;
      return data;
    } catch (err) {
      const errorMessage = (err as AxiosError<{ message: string }>)?.response?.data?.message || 'Gagal mengambil data bank';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBanks = async () => {
    try {
      setLoading(true);
      clearError();
      const { data } = await axiosInstance.get<Bank[]>('/my-banks');
      myBanks.value = data;
      return data;
    } catch (err) {
      const errorMessage = (err as AxiosError<{ message: string }>)?.response?.data?.message || 'Gagal mengambil data bank Anda';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminBanks = async () => {
    try {
      setLoading(true);
      clearError();
      const { data } = await axiosInstance.get<Bank[]>('/admin-banks');
      adminBanks.value = data;
      return data;
    } catch (err) {
      const errorMessage = (err as AxiosError<{ message: string }>)?.response?.data?.message || 'Gagal mengambil data bank admin';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchBank = async (id: number) => {
    try {
      setLoading(true);
      clearError();
      const { data } = await axiosInstance.get<Bank>(`/banks/${id}`);
      currentBank.value = data;
      return data;
    } catch (err) {
      const errorMessage = (err as AxiosError<{ message: string }>)?.response?.data?.message || 'Gagal mengambil detail bank';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createBank = async (bankData: BankFormData) => {
    try {
      setLoading(true);
      clearError();
      const { data } = await axiosInstance.post<Bank>('/banks', bankData);

      if (bankData.user_id) {
        banks.value.push(data);
      } else {
        myBanks.value.push(data);
      }

      return data;
    } catch (err) {
      const errorMessage = (err as AxiosError<{ message: string }>)?.response?.data?.message || 'Gagal menambahkan bank';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBank = async (id: number, bankData: Partial<BankFormData>) => {
    try {
      setLoading(true);
      clearError();
      const { data } = await axiosInstance.put<Bank>(`/banks/${id}`, bankData);

      const updateInArray = (arr: Bank[]) => {
        const index = arr.findIndex(bank => bank.id === id);
        if (index !== -1) arr[index] = data;
      };

      updateInArray(banks.value);
      updateInArray(myBanks.value);

      if (currentBank.value?.id === id) {
        currentBank.value = data;
      }

      return data;
    } catch (err) {
      const errorMessage = (err as AxiosError<{ message: string }>)?.response?.data?.message || 'Gagal mengupdate bank';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBank = async (id: number) => {
    try {
      setLoading(true);
      clearError();
      await axiosInstance.delete(`/banks/${id}`);
      banks.value = banks.value.filter(b => b.id !== id);
      myBanks.value = myBanks.value.filter(b => b.id !== id);

      if (currentBank.value?.id === id) {
        currentBank.value = null;
      }

      return true;
    } catch (err) {
      const errorMessage = (err as AxiosError<{ message: string }>)?.response?.data?.message || 'Gagal menghapus bank';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateBankData = (bankData: BankFormData): string[] => {
    const errors: string[] = [];

    if (!bankData.nama_rekening?.trim()) {
      errors.push('Nama rekening harus diisi');
    }
    if (!bankData.bank_tipe) {
      errors.push('Tipe bank harus dipilih');
    }
    if (!bankData.no_rekening?.trim()) {
      errors.push('Nomor rekening harus diisi');
    } else {
      const maxLength = isEWallet(bankData.bank_tipe) ? 14 : 20;
      if (bankData.no_rekening.length > maxLength) {
        errors.push(`Nomor rekening maksimal ${maxLength} digit untuk ${getBankTypeInfo(bankData.bank_tipe).label}`);
      }
      if (!/^\d+$/.test(bankData.no_rekening)) {
        errors.push('Nomor rekening hanya boleh berisi angka');
      }
    }

    return errors;
  };

  const formatAccountNumber = (number: string, bankType: string): string => {
    if (!number) return '';
    return isEWallet(bankType)
      ? number.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3')
      : number.replace(/(\d{4})(?=\d)/g, '$1-');
  };

  const maskAccountNumber = (number: string): string => {
    if (!number) return '';
    if (number.length <= 4) return number;
    const first = number.slice(0, 4);
    const last = number.slice(-4);
    const mask = '*'.repeat(number.length - 8);
    return `${first}${mask}${last}`;
  };

  const resetStore = () => {
    banks.value = [];
    myBanks.value = [];
    adminBanks.value = [];
    currentBank.value = null;
    loading.value = false;
    error.value = null;
  };

  return {
    banks,
    myBanks,
    adminBanks,
    currentBank,
    loading,
    error,
    bankTypes,
    getBankTypeInfo,
    isEWallet,
    setLoading,
    setError,
    clearError,
    fetchAllBanks,
    fetchMyBanks,
    fetchAdminBanks,
    fetchBank,
    createBank,
    updateBank,
    deleteBank,
    validateBankData,
    formatAccountNumber,
    maskAccountNumber,
    resetStore
  };
});
