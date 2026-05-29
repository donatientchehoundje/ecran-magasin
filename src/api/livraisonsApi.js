import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

export const livraisonsApi = {
  enAttente: async (params = {}) => {
    return client.get('/livraisons/en-attente', { params });
  },

  stats: async (params = {}) => {
    return client.get('/livraisons/stats', { params });
  },
};
