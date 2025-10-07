// api.js
import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import router from "../router";

const api = axios.create();

api.defaults.withCredentials = true;
api.defaults.withXSRFToken = true;
api.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
api.defaults.baseURL = import.meta.env.VITE_APP_API_URL || "http://localhost:4000";

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/password/recover',
  '/password/reset',
  '/logout'
];

const getCurrentPath = () => {
  return window.location.pathname;
};

const isPublicRoute = () => {
  const currentPath = getCurrentPath();
  return PUBLIC_PATHS.some(publicPath => currentPath.startsWith(publicPath));
};

const isAuthRoute = () => {
  const currentPath = getCurrentPath();
  const authPaths = ['/login', '/register', '/password/recover', '/password/reset'];
  return authPaths.some(authPath => currentPath.startsWith(authPath));
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Interceptor error:", error);
    const authStore = useAuthStore();
    
    const isPublic = isPublicRoute();
    const isAuth = isAuthRoute();

    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      console.error("API offline - Network Error detected");
      authStore.clearAuthData();

      if (!isPublic && !authStore.alertShown) {
        alert("Servidor indisponível. Tente novamente mais tarde.");
        authStore.setAlertShown(true);
        setTimeout(() => authStore.setAlertShown(false), 5000);
      }

      const currentPath = getCurrentPath();
      if (currentPath !== "/login" && !isPublic) {
        authStore.error = "Servidor indisponível. Tente novamente mais tarde.";
        authStore.returnUrl = window.location.pathname + window.location.search;
        router.push("/login");
      }
      
      return Promise.reject(error);
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      authStore.clearAuthData();

      if (!isPublic && !isAuth && !authStore.alertShown) {
        //alert('Sessão expirada. Por favor, faça login novamente.');
        //authStore.setAlertShown(true);
        //setTimeout(() => authStore.setAlertShown(false), 5000);
        router.push({ name: 'login' })
      }

      const currentPath = getCurrentPath();
      if (currentPath !== "/login" && !isPublic && !isAuth) {
        authStore.returnUrl = window.location.pathname + window.location.search;
        router.push("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { axios as originalAxios };