import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../router';

//const baseUrl = `${process.env.VUE_APP_BASE_URL}/users`;
//const baseUrl = 'http://localhost:4000'
export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(localStorage.getItem('user')),
        returnUrl: null
    }),
    actions: {
        async login(username, password) {
            const response = await axios.post(`/users/authenticate`, { username, password });

            // update pinia state
            this.user = response.data;

            // store user details and jwt in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(this.user));

            // redirect to previous url or default to home page
            router.push(this.returnUrl || '/');
        },
        logout() {
            this.user = null;
            localStorage.removeItem('user');
            router.push('/login');
        }
    }
});