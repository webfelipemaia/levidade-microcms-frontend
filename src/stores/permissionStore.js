import { defineStore } from 'pinia';
import api from '@/services/api';

export const usePermissionStore = defineStore({
    id: 'permission',
    state: () => ({
        permissions: [],
        rolesPermissions: [],
        message: null,
    }),

    actions: {
        async getPermissions() {
            const response = await api.get(`api/v1/private/permission`);
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.message = null;
                this.permissions = response.data;
            }
        },

        async getRolesPermissions() {
            const response = await api.get(`/api/v1/private/permission/roles/`);
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.message = null;
                this.rolesPermissions = response.data.data;
            }
        },        

        async getUsersRoles() {
            const response = await api.get(`/api/v1/private/users/roles/`);
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.message = null;
                this.rolesPermissions = response.data;
            }
        },
        
        async deletePermission(data) {
            try {                
            const response =  await api.delete(`api/v1/private/permission/${data.id}`);
            this.message = response.data
            await api.get(`api/v1/private/permission`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage}
                console.log(error.response)
            }
        },        

        async updatePermission(data) {
            try {                
            const response =  await api.patch(`api/v1/private/permission/${data.id}`, data);
            this.message = response.data
            await api.get(`api/v1/private/permission`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage}
                console.log(error.response)
            }
        },


        async createPermission(data) {
            try {
            const response =  await api.post('api/v1/private/permission/',
                { 
                    name: data.name, 
                }
            );
            this.message = response.data
            await api.get(`api/v1/private/permission`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage}
                console.log(error.response)
            }
        },
        
        async doneSuccessfully(response) {
            if(response.data.status === 'success'){                
                const response = await api.get(`api/v1/private/permission`)
                if(response.data.status !== 'error') {
                    this.permissions = response.data;                 }
            }
        },

        clearSuccessMessage() {
            this.message = null
        }
    }
})
