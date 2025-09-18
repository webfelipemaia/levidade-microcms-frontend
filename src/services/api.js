// api.js
import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import router from "../router";

const api = axios.create();

api.defaults.withCredentials = true;
api.defaults.withXSRFToken = true;
api.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
api.defaults.baseURL = process.env.VUE_APP_API_URL || "http://localhost:4000";

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Interceptor error:", error);
    const authStore = useAuthStore();

    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      console.error("API offline - Network Error detected");
      authStore.clearAuthData();

      if (router.currentRoute.value.name !== "login") {
        authStore.error = "Servidor indisponível. Tente novamente mais tarde.";
        authStore.returnUrl = router.currentRoute.value.fullPath;
        router.push("/login");
      }
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      authStore.clearAuthData();

      if (router.currentRoute.value.name !== "login") {
        authStore.returnUrl = router.currentRoute.value.fullPath;
        router.push("/login");
      }
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
export { axios as originalAxios };
