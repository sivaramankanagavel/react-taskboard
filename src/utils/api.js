import axios from 'axios';
import { logoutWithGoogle } from '../store/slice/auth-slice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setupInterceptors = (store) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        store.dispatch(logoutWithGoogle());
      }
      return Promise.reject(error);
    }
  );
};

export default api;