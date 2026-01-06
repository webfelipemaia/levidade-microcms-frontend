// authStore.js
import { defineStore } from "pinia";
import api from "@/services/api";
import router from "../router";
import { useAclStore } from '@/stores/aclStore';
import defaultAvatar from "@/assets/images/profile.png";

export const useAuthStore = defineStore({
  id: "auth",

  state: () => ({
    user: null,
    avatarUrl: null,
    error: null,
    isAuthenticated: false,
    authChecked: false,
    isLoading: true,
    alertShown: false,
  }),
  
  getters: {
    avatar: (state) => state.avatarUrl || defaultAvatar,
    // Retorna true se o usuário tiver a role
    hasRole: (state) => (roleName) => {
      return state.user?.roles?.includes(roleName) || false;
    },

    // Atalho para Administrator
    isAdmin: (state) => {
      return state.user?.roles?.includes('Administrator') || false;
    },

    // NOVO: Verifica permissão na aclStore
    // No authStore.js -> getters
    can: (state) => (permissionName) => {
      // 1. Super-admin sempre pode tudo
      if (state.user?.roles?.includes('Administrator')) return true;
      
      const aclStore = useAclStore();
      
      // LOG PARA DEBUG: Delete após funcionar
      console.log("Checando permissão:", permissionName, "Total carregado:", aclStore.userPermissions.length);

      // 2. Verifica se a permissão bate com Name ou Slug (independente de maiúsculas/minúsculas)
      return aclStore.userPermissions.some(p => 
        p.slug?.toLowerCase() === permissionName.toLowerCase() || 
        p.name?.toLowerCase() === permissionName.toLowerCase()
      );
    }
  }, 	

  actions: {
    async checkAuth() {
      try {
        this.isLoading = true;
        const response = await api.get('api/v1/private/auth/me', {
          withCredentials: true
        }).catch(() => null);
        this.user = response.data.user;
        this.isAuthenticated = true;
        this.authChecked = true;
        this.error = null;
        this.fetchAvatar()
        return true;
      } catch (error) {
        if (error.response?.status === 401) {
          this.clearAuthData();
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
        this.authChecked = false;
        this.error = null;
        this.user = response.data.data;
        this.isAuthenticated = true;
        router.push(this.returnUrl || "/home");
        
      } catch (error) {
        if (error.response?.status === 429) {
          this.handleRateLimitError();
        } else {
          this.error = error.response?.data || { 
            message: "Credenciais inválidas. Verifique seu email e senha." 
          };
        }
        
        this.isAuthenticated = false;
        throw error;
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
        const response = await api.get("api/v1/private/auth/me").catch(() => null);
        this.user = response.data.user;
        this.isAuthenticated = true;
      } catch (error) {
        this.logout();
      }
    },

    async logout() {

      const aclStore = useAclStore();
      try {
        await api.post(
          "api/v1/public/auth/logout",
          {},
          {
            withCredentials: true,
          }
        );
        aclStore.clearAclData();
        this.authChecked = false;
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        this.user = null;
        this.isAuthenticated = false;
        this.authChecked = false;
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

    async fetchAvatar() {
      try {
        
        if (!this.user) return;
        if (!this.user.files || this.user.files.length === 0) {
          this.avatarUrl = null;
          return;
        }

        const avatar = this.user.files[0];
        const avatarResponse = await api.get(`/api/v1/private/file/${avatar.id}/url`);

        if (avatarResponse.data.success) {
          this.avatarUrl = avatarResponse.data.data.url;
        } else {
          throw new Error(avatarResponse.data.error);
        }
      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message;
        this.error = errorMsg;
        this.avatarUrl = null;
      } finally {
        this.isLoading = false;
      }
    },

    async checkSession() {
      try {
        this.isLoading = true;
        const res = await api.get('/api/v1/public/auth/session-check', {
          withCredentials: true
        }).catch(() => null);

          if (res.data.authenticated) {
            this.user = res.data.user
            this.isAuthenticated = true
            this.loading = false
            this.fetchAvatar()
          } else {
            this.clearAuthData()
          }
      } catch (err) {
        this.clearAuthData()
      } finally {
        this.loading = false
      }
    },

    async initialize() {
      try {
        await this.checkSession();
    
        if (this.isAuthenticated) {
          //await this.checkAuth();
          const aclStore = useAclStore();
          // Carrega as permissões do usuário logado assim que a sessão é confirmada
          await aclStore.fetchUserPermissions(this.user.id);
        }
      } finally {
        this.isLoading = false;
      }
    }
    ,

    clearAuthData() {
      this.user = null;
      this.isAuthenticated = false;
      this.authChecked = true;
      this.error = null;
      localStorage.removeItem("authToken");
    },

    clearError() {
      this.user = null;
      this.isAuthenticated = false;
      this.error = null;
    },

    setAlertShown(value) {
      this.alertShown = value;
    },
  },
});