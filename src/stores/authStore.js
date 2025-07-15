import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../router';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        user: null,
        returnUrl: null,
        error: null,
        isAuthenticated: false,
    }),
    actions: {

        async login(email, password) {
          try {
              const response = await axios.post('/auth/login', {
                  email,
                  password
              });
      
              this.error = null;
              this.user = response.data.data;
              this.isAuthenticated = true;
              router.push(this.returnUrl || '/');
      
          } catch (error) {
              this.error = error.response?.data || { message: "Login failed" };
              this.isAuthenticated = false;
          }
      },
      

        async fetchUser() {
            try {
              const response = await axios.get('/auth/me');
              this.user = response.data.user;
              this.isAuthenticated = true;
            } catch (error) {
              this.logout();
            }
          },

        logout() {
            this.user = null;
            this.isAuthenticated = false;
            router.push(this.returnUrl || '/login');
        },          

        async register(email, password, confirmPassword, name, lastname) {
          try {
              const response = await axios.post('/auth/register', {
                  email,
                  password,
                  confirmPassword,
                  name,
                  lastname
              });
      
              this.user = response.data.data;
              this.isAuthenticated = true;
              router.push(this.returnUrl || '/');
      
          } catch (error) {
              this.error = error.response?.data || { message: "Registration failed" };
              this.isAuthenticated = false;
          }
      },
      

        async initialize() {
          try {
              const response = await axios.get('/auth/me');
              this.user = response.data.user;
              this.isAuthenticated = true;
          } catch (error) {
              this.clearAuthData();
          }
      },      

      clearAuthData() {
        this.user = null;
        this.isAuthenticated = false;
      }
    
    }
});