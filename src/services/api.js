// api.js
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import router from "@/router";

const api = axios.create();

api.defaults.withCredentials = true;
api.defaults.withXSRFToken = true;
api.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
api.defaults.baseURL = import.meta.env.VITE_APP_API_URL || "http://localhost:4000";

const PUBLIC_PATHS = [
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
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore();
    const isPublic = isPublicRoute();
    const isAuth = isAuthRoute();
    const currentPath = getCurrentPath();
    
    if (error.response?.status === 422) {
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      authStore.clearAuthData();
      authStore.isAuthenticated = false
      authStore.user = null
      authStore.authChecked = false;

      if (!isPublic && !isAuth && !authStore.alertShown) {
        router.push({ name: "login" });
      }

      if (currentPath !== "/login" && !isPublic && !isAuth) {
        authStore.returnUrl = window.location.pathname + window.location.search;
        router.push("/login");
      }
    }
    
    const status = error.response?.status || 0;
    let safeMessage = "Erro inesperado. Tente novamente.";

    if (status === 404) safeMessage = "Recurso não encontrado.";
    if (status === 500) safeMessage = "Erro interno do servidor.";
    return Promise.reject(new Error(safeMessage));
  }
);

export default api;
export { axios as originalAxios };
