import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach JWT token if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Trip APIs
export const fetchTrips = async () => {
  const response = await api.get('/trips');
  return response.data;
};

export const fetchTripById = async (id) => {
  const response = await api.get(`/trips/${id}`);
  return response.data;
};

export const createTrip = async (tripData) => {
  const response = await api.post('/trips', tripData);
  return response.data;
};

// Destination APIs
export const fetchDestinations = async (tripId) => {
  const response = await api.get(`/destinations/${tripId}`);
  return response.data;
};

// Scraping APIs
export const scrapeSearch = async (query) => {
  const response = await api.get(`/scrape/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

export default api;
