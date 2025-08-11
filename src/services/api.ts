import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import {
  ApiResponse,
  PaginatedResponse,
  Person,
  Space,
  Reservation,
  PersonFormData,
  SpaceFormData,
  ReservationFormData,
  PaginationParams
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
  // Prefer explicit API URL, fallback to port 3001 (API container exposed as 3001 on host)
  // IMPORTANT: Fallback must match exposed backend host port (3001). If REACT_APP_API_URL not defined at build, this literal is baked.
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

    console.log('🚀 API Service initialized with:', { baseURL });

    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Request interceptor - add JWT token and reduce logging in development
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          // Get the JWT token from Amplify session
          const session = await fetchAuthSession();
                    const token = session.tokens?.idToken?.toString();
          
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
          }
        } catch (error) {
          console.warn('⚠️ Failed to get auth token, continuing without it.', error);
        }
        
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        }
        return response;
      },
      (error) => {
        const errorResponse = {
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.response?.data?.error || error.message,
          url: `${error.config?.baseURL}${error.config?.url}`,
          method: error.config?.method,
        };
        console.error('❌ API Response Error:', errorResponse);
        
        if (error.response?.status === 401) {
          // Optionally, you can trigger a sign-out or token refresh here
          console.warn('Unauthorized access detected. Consider redirecting to login.');
        }

        throw new Error(errorResponse.message || 'An unexpected error occurred');
      }
    );
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    const response = await this.api.get('/health');
    return response.data;
  }

  // Person/User API methods
  async getPersons(): Promise<Person[]> {
    const response = await this.api.get<ApiResponse<Person[]>>('/persons');
    return response.data.data || [];
  }

  async getPersonById(id: number): Promise<Person> {
    const response = await this.api.get<ApiResponse<Person>>(`/persons/${id}`);
    if (!response.data.data) {
      throw new Error('Person not found');
    }
    return response.data.data;
  }

  async getPersonByEmail(email: string): Promise<Person> {
    const response = await this.api.get<ApiResponse<Person>>(`/persons/search?email=${encodeURIComponent(email)}`);
    if (!response.data.data) {
      throw new Error('Person not found');
    }
    return response.data.data;
  }

  async createPerson(data: PersonFormData): Promise<Person> {
    const response = await this.api.post<ApiResponse<Person>>('/persons', data);
    if (!response.data.data) {
      throw new Error('Failed to create person');
    }
    return response.data.data;
  }

  async updatePerson(id: number, data: Partial<PersonFormData>): Promise<Person> {
    const response = await this.api.put<ApiResponse<Person>>(`/persons/${id}`, data);
    if (!response.data.data) {
      throw new Error('Failed to update person');
    }
    return response.data.data;
  }

  async deletePerson(id: number): Promise<void> {
    await this.api.delete(`/persons/${id}`);
  }

  // Space API methods
  async getSpaces(): Promise<Space[]> {
    const response = await this.api.get<ApiResponse<Space[]>>('/spaces');
    return response.data.data || [];
  }

  async getSpaceById(id: number): Promise<Space> {
    const response = await this.api.get<ApiResponse<Space>>(`/spaces/${id}`);
    if (!response.data.data) {
      throw new Error('Space not found');
    }
    return response.data.data;
  }

  async createSpace(data: SpaceFormData): Promise<Space> {
    const response = await this.api.post<ApiResponse<Space>>('/spaces', data);
    if (!response.data.data) {
      throw new Error('Failed to create space');
    }
    return response.data.data;
  }

  async updateSpace(id: number, data: Partial<SpaceFormData>): Promise<Space> {
    const response = await this.api.put<ApiResponse<Space>>(`/spaces/${id}`, data);
    if (!response.data.data) {
      throw new Error('Failed to update space');
    }
    return response.data.data;
  }

  async deleteSpace(id: number): Promise<void> {
    await this.api.delete(`/spaces/${id}`);
  }

  // Reservation API methods
  async getReservations(params?: PaginationParams): Promise<PaginatedResponse<Reservation>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const url = queryParams.toString() ? `/reservations?${queryParams}` : '/reservations';
    const response = await this.api.get<PaginatedResponse<Reservation>>(url);
    return response.data;
  }

  async getReservationById(id: number): Promise<Reservation> {
    const response = await this.api.get<ApiResponse<Reservation>>(`/reservations/${id}`);
    if (!response.data.data) {
      throw new Error('Reservation not found');
    }
    return response.data.data;
  }

  async createReservation(data: ReservationFormData): Promise<Reservation> {
    const payload = {
      ...data,
      personId: typeof data.personId === 'string' ? parseInt(data.personId, 10) : data.personId,
      spaceId: typeof data.spaceId === 'string' ? parseInt(data.spaceId, 10) : data.spaceId,
    };

    const response = await this.api.post<ApiResponse<Reservation>>('/reservations', payload);
    if (!response.data.data) {
      throw new Error('Failed to create reservation');
    }
    return response.data.data;
  }

  async updateReservation(id: number, data: Partial<ReservationFormData>): Promise<Reservation> {
    const payload = { ...data };
    if (typeof payload.personId === 'string') {
      payload.personId = parseInt(payload.personId, 10);
    }
    if (typeof payload.spaceId === 'string') {
      payload.spaceId = parseInt(payload.spaceId, 10);
    }

    const response = await this.api.put<ApiResponse<Reservation>>(`/reservations/${id}`, payload);
    if (!response.data.data) {
      throw new Error('Failed to update reservation');
    }
    return response.data.data;
  }

  // Current authenticated user's reservations
  async getUserReservations(params?: PaginationParams): Promise<PaginatedResponse<Reservation>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const url = queryParams.toString() ? `/reservations/my-reservations?${queryParams}` : '/reservations/my-reservations';
    const response = await this.api.get<PaginatedResponse<Reservation>>(url);
    return response.data;
  }

  async deleteReservation(id: number): Promise<void> {
    await this.api.delete(`/reservations/${id}`);
  }
}

export const apiService = new ApiService();