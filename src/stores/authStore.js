// authStore.js
import { defineStore } from "pinia";
import api from "@/services/api";
import router from "../router";

export const useAuthStore = defineStore({
  id: "auth",

  state: () => ({
    user: null,
    returnUrl: null,
    error: null,
    isAuthenticated: false,
    isLoading: true,
    alertShown: false, // Adicionado para controle de alertas
  }),
  
  actions: {
    async checkAuth() {
      try {
        const response = await api.get('api/v1/private/auth/me', {
          withCredentials: true
        });
        this.user = response.data.user;
        this.isAuthenticated = true;
        this.error = null;
        return true;
      } catch (error) {
        if (error.response?.status === 401) {
          this.clearAuthData();
          // Não redireciona automaticamente, deixa o interceptor tratar
        } else if (error.response?.status === 429) {
          this.handleRateLimitError();
        }
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async login(email, password) {
      try {
        const response = await api.post("api/v1/public/auth/login", {
          email,
          password,
        });
    
        this.error = null;
        this.user = response.data.data;
        this.isAuthenticated = true;
        router.push(this.returnUrl || "/home");
        
      } catch (error) {
        if (error.response?.status === 429) {
          this.handleRateLimitError();
        } else {
          // Mensagem mais específica para detectar tentativas falhas
          this.error = error.response?.data || { 
            message: "Credenciais inválidas. Verifique seu email e senha." 
          };
        }
        
        this.isAuthenticated = false;
        throw error; // Importante: lançar o erro para ser capturado no componente
      } finally {
        this.isLoading = false;
      }
    },
    
    // Tratar rate limiting
    async handleRateLimitError() {
      try {
        await this.forceLogout();          
        this.clearClientSideAuthData();
        this.error = { 
          message: "Muitas tentativas de login. Por favor, aguarde alguns minutos antes de tentar novamente." 
        };
        
        if (router.currentRoute.value.name !== 'login') {
          router.push({
            name: 'login',
            query: { rateLimited: 'true' }
          });
        }
        
      } catch (logoutError) {
        this.clearClientSideAuthData();
        this.error = { 
          message: "Problema de autenticação. Por favor, faça login novamente." 
        };
      }
    },
    
    clearClientSideAuthData() {
      localStorage.removeItem('user');
      localStorage.removeItem('auth_data');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('auth_data');
      
      this.user = null;
      this.isAuthenticated = false;
      this.error = null;
    },
    
    async forceLogout() {
      try {
        await api.post("api/v1/public/auth/logout", {}, {
          withCredentials: true
        });
      } catch (error) {
        console.warn("Erro durante logout forçado:", error);
        throw error;
      }
    },

    async fetchUser() {
      try {
        const response = await api.get("api/v1/private/auth/me");
        this.user = response.data.user;
        this.isAuthenticated = true;
      } catch (error) {
        this.logout();
      }
    },

    async logout() {
      try {
        await api.post(
          "api/v1/public/auth/logout",
          {},
          {
            withCredentials: true,
          }
        );
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        this.user = null;
        this.isAuthenticated = false;
        this.clearAuthData();
        router.push("/login");
      }
    },

    async register(email, password, confirmPassword, name, lastname) {
      try {
        const response = await api.post("api/v1/public/auth/register", {
          email,
          password,
          confirmPassword,
          name,
          lastname,
        });

        this.user = response.data.data;
        this.isAuthenticated = true;
        router.push(this.returnUrl || "/");
      } catch (error) {
        this.error = error.response?.data || { message: "Registration failed" };
        this.isAuthenticated = false;
      }
    },

    async initialize() {
      await this.checkAuth();
    },

    clearAuthData() {
      this.user = null;
      this.isAuthenticated = false;
      this.error = null;
      localStorage.removeItem("authToken");
    },

    clearError() {
      this.user = null;
      this.isAuthenticated = false;
      this.error = null;
    },

    // Método para controle de alertas
    setAlertShown(value) {
      this.alertShown = value;
    },
  },
});