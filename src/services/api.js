// api.js
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import router from "@/router";

const api = axios.create();

api.defaults.withCredentials = true;
api.defaults.withXSRFToken = true;
api.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
api.defaults.baseURL = import.meta.env.VITE_APP_API_URL || "http://localhost:4000";

/* const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/password/recover",
  "/password/reset",
  "/logout",
];

const getCurrentPath = () => window.location.pathname;

const isPublicRoute = () => {
  const currentPath = getCurrentPath();
  return PUBLIC_PATHS.some(publicPath => currentPath.startsWith(publicPath));
};

const isAuthRoute = () => {
  const currentPath = getCurrentPath();
  const authPaths = ["/login", "/register", "/password/recover", "/password/reset"];
  return authPaths.some(authPath => currentPath.startsWith(authPath));
}; */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const authStore = useAuthStore();

    // 401: Não autorizado (Sessão expirada ou token inválido)
    if (status === 401) {
      authStore.clearAuthData();
      router.push({ name: 'error', params: { code: '401' } });
      return Promise.reject(error);
    }

    // 403: Proibido (Usuário logado mas sem permissão)
    if (status === 403) {
      router.push({ name: 'error', params: { code: '403' } });
      return Promise.reject(error);
    }

    // 500 ou outros erros críticos
    if (status >= 500) {
      router.push({ name: 'error', params: { code: '500' } });
    }

    return Promise.reject(error);
  }
);

export default api;
export { axios as originalAxios };
