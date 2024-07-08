import { defineStore } from 'pinia';
import axios from 'axios';

export const usePermissionStore = defineStore({
    id: 'permission',
    state: () => ({
        permissions: [],
        message: null,
    }),

    actions: {
        async getPermissions() {
            const response = await axios.get(`/permissions`);
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.permissions = response.data;
                this.message = null;
            }
        },

        async deletePermission(data) {
            try {                
            const response =  await axios.delete(`/permissions/${data.id}`);
            this.message = response.data
            await axios.get(`/permissions`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage.replaceAll('"', '')}
                console.log(error.response)
            }
        },        

        async updatePermission(id,data) {
            try {                
            const response =  await axios.put(`/permissions/${id}`, data);
            this.message = response.data
            await axios.get(`/permissions`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage.replaceAll('"', '')}
                console.log(error.response)
            }
        },


        async createPermission(data) {
            try {
            const response =  await axios.post('/permissions/',
                { 
                    name: data.name, 
                }
            );
            this.message = response.data
            await axios.get(`/permissions`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage.replaceAll('"', '')}
                console.log(error.response)
            }
        },
        
        async doneSuccessfully(response) {
            if(response.data.status === 'success'){                
                const response = await axios.get(`/permissions`)
                if(response.data.status !== 'error') {
                    this.permissions = response.data;                 }
            }
        },

        clearSuccessMessage() {
            this.message = null
        }
    }
})