
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

// Instance Axios principale
const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Instance dédiée au renouvellement des tokens
const refreshApi = axios.create({
  baseURL,
  withCredentials: true,
});

// Récupération du token CSRF
let csrfToken = null;

export const getCsrfToken = async () => {
  const response = await api.get("/api/auth/csrf/");
  csrfToken = response.data.csrfToken;
  return csrfToken;
};

// Ajout automatique du token CSRF aux requêtes
api.interceptors.request.use((config) => {
  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken;
  }

  return config;
});

// Renouvellement automatique du JWT
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/api/auth/")
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await refreshApi.post(
        "/api/auth/refresh/",
        {},
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      const newAccessToken = response.data.access;

      api.defaults.headers.common.Authorization =
        `Bearer ${newAccessToken}`;

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);

      return api(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError, null);

      api.defaults.headers.common.Authorization = undefined;

      window.dispatchEvent(new Event("auth:logout"));

      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
