import axios from 'axios';

const API_BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  sendOtp: (phone) => apiClient.post('/auth/send-otp', { phone }),
  verifyOtp: (phone, otp) => apiClient.post('/auth/verify-otp', { phone, otp }),
};

export const barbersApi = {
  getAll: (params) => apiClient.get('/barbers', { params }),
  getById: (id) => apiClient.get(`/barbers/${id}`),
  getSlots: (barberId, date) => apiClient.get(`/barbers/${barberId}/slots`, { params: { date } }),
};

export const servicesApi = {
  create: (data) => apiClient.post('/barber/services', data),
  update: (id, data) => apiClient.put(`/barber/services/${id}`, data),
  delete: (id) => apiClient.delete(`/barber/services/${id}`),
};

export const availabilityApi = {
  set: (data) => apiClient.post('/barber/availability', data),
};

export const bookingsApi = {
  create: (data) => apiClient.post('/bookings', data),
  getMy: () => apiClient.get('/bookings/my'),
  getBarberBookings: (params) => apiClient.get('/barber/bookings', { params }),
  simulatePayment: (eripCode) => apiClient.post('/bookings/webhook', { eripCode }),
};

export const barberProfileApi = {
  upsert: (data) => apiClient.post('/barber/profile/me', data),
};

export const mapsApi = {
  geocode: (address) => apiClient.get('/maps/geocode', { params: { address } }),
};
