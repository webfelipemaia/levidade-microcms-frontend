import { defineStore } from 'pinia';
import axios from 'axios';
//import router from '../router';

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        users: [],
        error: null,
    }),

    actions: {
        async getUsers() {
            const response = await axios.get(`/users`);
            if(response.data.status === 'error') {
                this.error = response.data
            } else {
                this.error = null;
                this.users = response.data;
            }
        },

        async updateUser(id,data) {
            const response =  await axios.put(`/users/${id}`, data);
            if(response.data.status === 'success'){                
                    const response = await axios.get(`/users`)

                    if(response.data.status !== 'error') {
                        this.users = response.data;
                    }
            }
        }
    }
})