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
            await api.get(`api/v1/private/role`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage.replaceAll('"', '')}
                console.log(error.response)
            }
        },        

        async updateRole(data) {
            try {
            const response =  await api.patch(`api/v1/private/role/${data.id}`, data);
            this.message = response.data
            await api.get(`api/v1/private/role`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage.replaceAll('"', '')}
                console.log(error.response)
            }   
        },


        async createRole(data) {
            try {
            const response =  await api.post('api/v1/private/role/',
                { 
                    name: data.name, 
                }
            );
            this.message = response.data
            await api.get(`api/v1/private/role`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage.replaceAll('"', '')}
                console.log(error.response)
            }
        },
        
        async doneSuccessfully(response) {
            if(response.data.status === 'success'){                
                const response = await api.get(`api/v1/private/role`)
                if(response.data.status !== 'error') {
                    this.roles = response.data;                 }
            }
        },

        clearSuccessMessage() {
            this.message = null
        }
    }
})