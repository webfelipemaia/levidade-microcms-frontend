import { defineStore } from 'pinia';
import api from '@/services/api';

export const useRoleStore = defineStore({
    id: 'role',
    state: () => ({
        roles: [],
        usersRoles: [],
        message: null,
    }),

    actions: {
        async getRoles() {
            const response = await api.get(`api/v1/private/role`);
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.message = null;
                this.roles = response.data;
            }
        },

        async getUsersRoles() {
            const response = await api.get(`api/v1/private/user/roles/`);
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.message = null;
                this.usersRoles = response.data;
            }
        },        

        async deleteRole(data) {
            try {                
            const response =  await api.delete(`api/v1/private/role/${data.id}`);
            this.message = response.data
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage.replaceAll('"', '')}
            }
        },        

        async updateRole(data) {
            try {
                const roleData = {
                    name: data.name,
                    description: data.description || ''
                }
                
                if (data.permissions && data.permissions.length > 0) {
                    roleData.permissions = data.permissions
                } else {
                    roleData.permissions = []
                }
                
                const response = await api.patch(`api/v1/private/role/${data.id}`, roleData);
                this.message = response.data
                
            } catch (error) {
                let errorMessage = error.response.data?.message
                this.message = { status:'error', message: errorMessage.replaceAll('"', '')}
            }   
        },

        async createRole(data) {
            try {
                const roleData = {
                    name: data.name,
                    description: data.description || ''
                }
                
                if (data.permissions && data.permissions.length > 0) {
                    roleData.permissions = data.permissions
                }
                
                const response = await api.post('api/v1/private/role/', roleData);
                this.message = response.data
                
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage.replaceAll('"', '')}
            }
        },
        
        async doneSuccessfully(response) {
            if(response.data.status === 'success'){                
                await this.getRoles()
            }
        },

        clearSuccessMessage() {
            this.message = null
        }
    }
})