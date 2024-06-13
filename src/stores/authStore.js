import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../router';

//const baseUrl = `${process.env.VUE_APP_BASE_URL}/users`;
//const baseUrl = 'http://localhost:4000'
export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')),
        returnUrl: null,
        error: null,
    }),
    actions: {
        async login(email, password) {
            const response = await axios.post(`/users/authenticate`, { email: email, password: password });
            if(response.data.status === 'error') {
                this.error = response.data
            } else {
                this.user = response.data.data;
                localStorage.setItem('user', JSON.stringify(this.user));
                router.push(this.returnUrl || '/');
            }
        },

        logout() {
            this.user = null;
            localStorage.removeItem('user');
            router.push('/login');
        },

        async register(username, password, name, lastname) {
            const response = await axios.post(`/users/authenticate`, { username, password, name, lastname });
            this.user = response.data;
            localStorage.setItem('user', JSON.stringify(this.user));
            router.push(this.returnUrl || '/index');
        },
    }
});