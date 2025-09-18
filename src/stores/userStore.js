import { defineStore } from 'pinia';
import api from '@/services/api';

export const useUserStore = defineStore({
    id: 'user', 
    state: () => ({
        users: [],
        message: null,
    }),

    actions: {
        async getUsers() {
            const response = await api.get(`api/v1/private/user/roles`);
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.message = null;
                this.users = response.data;
            }
        },

        async deleteUser(data) {
            try {                
            const response =  await api.delete(`api/v1/private/user/${data.id}`);
            this.message = response.data
            await api.get(`api/v1/private/user`)
            
            } catch (error) {
                let errorMessage = error.response
                this.message = { status:'error', message: errorMessage}
                console.log(error.response)
            }
        },        

        async updateUser(id,data) {
            try {                
            const response =  await api.put(`api/v1/private/user/${id}`, data);
            this.message = response.data
            await api.get(`api/v1/private/user`)
            
            } catch (error) {
                let errorMessage = error.response
                this.message = { status:'error', message: errorMessage}
                console.log(error.response)
            }
        },


        async createUser(data) {
            try {
            const response =  await api.post('api/v1/private/user/register',
                { 
                    email: data.email, 
                    password: data.password, 
                    confirmPassword: data.confirmPassword, 
                    name: data.name, 
                    lastname: data.lastname,                    
                }
            );
            this.message = response.data
            await api.get(`api/v1/private/user`)
            
            } catch (error) {
                let errorMessage = error.response
                this.message = { status:'error', message: errorMessage}
                console.log(error.response)
            }
        },
        
        async doneSuccessfully(response) {
            if(response.data.status === 'success'){                
                const response = await api.get(`api/v1/private/user`)
                if(response.data.status !== 'error') {
                    this.users = response.data;                 }
            }
        },

        clearSuccessMessage() {
            this.message = null
        }
    }
})