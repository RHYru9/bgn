import api from '@/services/axiosInstance';

// Types
export interface KarirBase {
  id?: number;
  tipe: 'pelamar' | 'mitra' | 'supplier';
  nama_lengkap: string;
  created_at?: string;
  updated_at?: string;
}

export interface PelamarData extends KarirBase {
  tipe: 'pelamar';
  nama_panggilan: string;
  email: string;
  link_ijazah: string;
  link_ktp: string;
  link_cv: string;
  status: 'pending' | 'approved' | 'rejected';
  nama_perusahaan?: null;
  email_perusahaan?: null;
  nomor_telepon?: null;
  alamat?: null;
  jenis_mitra?: null;
  deskripsi?: null;
}

export interface MitraData extends KarirBase {
  tipe: 'mitra';
  nama_perusahaan: string;
  email_perusahaan: string;
  nomor_telepon: string;
  alamat: string;
  jenis_mitra: string;
  status: 'aktif' | 'non-aktif' | 'pending';
  deskripsi?: string;
  nama_panggilan?: null;
  email?: null;
  link_ijazah?: null;
  link_ktp?: null;
  link_cv?: null;
}

export type KarirData = PelamarData | MitraData;

export interface CreatePelamarRequest {
  tipe: 'pelamar';
  nama_lengkap: string;
  nama_panggilan: string;
  email: string;
  link_ijazah: string;
  link_ktp: string;
  link_cv: string;
}

export interface CreateMitraRequest {
  tipe: 'mitra';
  nama_lengkap: string;
  nama_perusahaan: string;
  email_perusahaan: string;
  nomor_telepon: string;
  alamat: string;
  jenis_mitra: string;
  status: 'aktif' | 'non-aktif' | 'pending';
  deskripsi?: string;
}

export type CreateKarirRequest = CreatePelamarRequest | CreateMitraRequest;

export interface ApiResponse<T> {
  message: string;
  data?: T;
  validationErrors?: Record<string, string[]>;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface KarirServiceState {
  data: KarirData[];
  loading: boolean;
  lastMessage?: string;
}

class KarirService {
  private state: KarirServiceState = {
    data: [],
    loading: false
  };

  private listeners: Set<(state: KarirServiceState) => void> = new Set();

  // Subscribe to state changes
  subscribe(listener: (state: KarirServiceState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Get current state
  getState(): KarirServiceState {
    return { ...this.state };
  }

  // Update state and notify listeners
  private setState(newState: Partial<KarirServiceState>): void {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }

  // Fetch all karir data
  async fetchKarir(): Promise<ServiceResult<KarirData[]>> {
    this.setState({ loading: true, lastMessage: undefined });
    
    try {
      const response = await api.get<KarirData[]>('/karir');
      
      this.setState({ 
        data: response.data,
        loading: false,
        lastMessage: 'Data berhasil dimuat'
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Data berhasil dimuat'
      };
    } catch {
      const message = 'Gagal memuat data karir';
      
      this.setState({ 
        loading: false,
        lastMessage: message
      });
      
      return {
        success: false,
        message
      };
    }
  }

  // Create new karir entry
  async createKarir(karirData: CreateKarirRequest): Promise<ServiceResult<KarirData>> {
    this.setState({ loading: true, lastMessage: undefined });
    
    try {
      const response = await api.post<ApiResponse<KarirData>>('/karir', karirData);
      
      if (response.data.data) {
        const newData = [...this.state.data, response.data.data];
        
        this.setState({
          data: newData,
          loading: false,
          lastMessage: response.data.message || 'Data berhasil ditambahkan'
        });
        
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Data berhasil ditambahkan'
        };
      }
      
      const message = 'Gagal menambahkan data';
      this.setState({ 
        loading: false,
        lastMessage: message
      });
      
      return {
        success: false,
        message
      };
    } catch {
      const message = 'Gagal menambahkan data karir';
      
      this.setState({ 
        loading: false,
        lastMessage: message
      });
      
      return {
        success: false,
        message
      };
    }
  }

  // Get karir by ID
  async getKarirById(id: number): Promise<ServiceResult<KarirData>> {
    this.setState({ loading: true, lastMessage: undefined });
    
    try {
      const response = await api.get<KarirData>(`/karir/${id}`);
      
      this.setState({ 
        loading: false,
        lastMessage: 'Data berhasil ditemukan'
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Data berhasil ditemukan'
      };
    } catch {
      const message = 'Data tidak ditemukan';
      
      this.setState({ 
        loading: false,
        lastMessage: message
      });
      
      return {
        success: false,
        message
      };
    }
  }

  // Delete karir entry
  async deleteKarir(id: number): Promise<ServiceResult<boolean>> {
    this.setState({ loading: true, lastMessage: undefined });
    
    try {
      await api.delete(`/karir/${id}`);
      
      const filteredData = this.state.data.filter((item: KarirData) => item.id !== id);
      
      this.setState({
        data: filteredData,
        loading: false,
        lastMessage: 'Data berhasil dihapus'
      });
      
      return {
        success: true,
        data: true,
        message: 'Data berhasil dihapus'
      };
    } catch {
      const message = 'Gagal menghapus data';
      
      this.setState({ 
        loading: false,
        lastMessage: message
      });
      
      return {
        success: false,
        message
      };
    }
  }

  // Update karir entry
  async updateKarir(id: number, karirData: Partial<CreateKarirRequest>): Promise<ServiceResult<KarirData>> {
    this.setState({ loading: true, lastMessage: undefined });
    
    try {
      const response = await api.put<ApiResponse<KarirData>>(`/karir/${id}`, karirData);
      
      if (response.data.data) {
        const updatedData = this.state.data.map((item: KarirData) => 
          item.id === id ? response.data.data! : item
        );
        
        this.setState({
          data: updatedData,
          loading: false,
          lastMessage: response.data.message || 'Data berhasil diperbarui'
        });
        
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Data berhasil diperbarui'
        };
      }
      
      const message = 'Gagal memperbarui data';
      this.setState({ 
        loading: false,
        lastMessage: message
      });
      
      return {
        success: false,
        message
      };
    } catch {
      const message = 'Gagal memperbarui data karir';
      
      this.setState({ 
        loading: false,
        lastMessage: message
      });
      
      return {
        success: false,
        message
      };
    }
  }

  // Clear last message
  clearMessage(): void {
    this.setState({ lastMessage: undefined });
  }

  // Reset state
  reset(): void {
    this.setState({
      data: [],
      loading: false,
      lastMessage: undefined
    });
  }

  // Filter helpers
  getPelamarData(): PelamarData[] {
    return this.state.data.filter((item): item is PelamarData => item.tipe === 'pelamar');
  }

  getMitraData(): MitraData[] {
    return this.state.data.filter((item): item is MitraData => item.tipe === 'mitra');
  }

  getDataByStatus<T extends KarirData>(status: string): T[] {
    return this.state.data.filter((item): item is T => 
      'status' in item && item.status === status
    ) as T[];
  }
}

// Create singleton instance
const karirService = new KarirService();

export default karirService;