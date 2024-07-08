import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore({
    id: 'user', 
    state: () => ({
        users: [],
        message: null,
    }),

    actions: {
        async getUsers() {
            //const response = await axios.get(`/users`);
            const response = await axios.get(`/users/roles`);
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.message = null;
                this.users = response.data;
            }
        },

/*         async getUsersRoles() {
            const response = await axios.get(`/users/roles`);
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.message = null;
                this.users = response.data;
            }
        }, */

        async deleteUser(data) {
            try {                
            const response =  await axios.delete(`/users/${data.id}`);
            this.message = response.data
            await axios.get(`/users`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage.replaceAll('"', '')}
                console.log(error.response)
            }
        },        

        async updateUser(id,data) {
            try {                
            const response =  await axios.put(`/users/${id}`, data);
            this.message = response.data
            await axios.get(`/users`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage.replaceAll('"', '')}
                console.log(error.response)
            }
        },


        async createUser(data) {
            try {
            const response =  await axios.post('/users/register',
                { 
                    email: data.email, 
                    password: data.password, 
                    confirmPassword: data.confirmPassword, 
                    name: data.name, 
                    lastname: data.lastname,
                    role: data.role
                }
            );
            this.message = response.data
            await axios.get(`/users`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage.replaceAll('"', '')}
                console.log(error.response)
            }
        },
        
        async doneSuccessfully(response) {
            if(response.data.status === 'success'){                
                const response = await axios.get(`/users`)
                if(response.data.status !== 'error') {
                    this.users = response.data;                 }
            }
        },

        clearSuccessMessage() {
            this.message = null
        }
    }
})