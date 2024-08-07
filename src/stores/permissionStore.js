import { defineStore } from 'pinia';
import axios from 'axios';

export const usePermissionStore = defineStore({
    id: 'permission',
    state: () => ({
        permissions: [],
        rolesPermissions: [],
        message: null,
    }),

    actions: {
        async getPermissions() {
            const response = await axios.get(`/permissions`);
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.message = null;
                this.permissions = response.data;
            }
        },

        async getRolesPermissions() {
            const response = await axios.get(`/roles/permissions`);
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.message = null;
                this.rolesPermissions = response.data;
            }
        },
        
        async deletePermission(data) {
            try {                
            const response =  await axios.delete(`/permissions/${data.id}`);
            this.message = response.data
            await axios.get(`/permissions`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage}
                console.log(error.response)
            }
        },        

        async updatePermission(data) {
            try {                
            const response =  await axios.patch(`/permissions/${data.id}`, data);
            this.message = response.data
            await axios.get(`/permissions`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage}
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
                this.message = { status:'error', message: errorMessage}
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
