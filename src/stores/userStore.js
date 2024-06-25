import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        users: [],
        error: null,
        successMessage: null,
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
            this.successMessage = response.data.message
            //this.doneSuccessfully(response)
            if(response.data.status === 'success'){                
                const response = await axios.get(`/users`)
                if(response.data.status !== 'error') {
                    this.users = response.data;                 }
            } else {
                this.successMessage = null
            }
        },


        async createUser(data) {
            console.log(data)
            const response =  await axios.post('/users/register',
                { 
                    email: data.email, 
                    password: data.password, 
                    confirmPassword: data.confirmPassword, 
                    name: data.name, 
                    lastname: data.lastname 
                }
            );
            this.successMessage = response.data.message
            //this.doneSuccessfully(response)
            if(response.data.status === 'success'){                
                const response = await axios.get(`/users`)
                if(response.data.status !== 'error') {
                    this.users = response.data;                 }
            } else {
                this.successMessage = null
            }
        },
        
        async doneSuccessfully(response) {
            if(response.data.status === 'success'){                
                const response = await axios.get(`/users`)
                if(response.data.status !== 'error') {
                    this.users = response.data;                 }
            } else {
                this.successMessage = null
            }
        },

        clearSuccessMessage() {
            this.successMessage = null
        }
    }
})