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
            await this.getRoles() // Usar a ação interna em vez de api.get diretamente
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage.replaceAll('"', '')}
                console.log(error.response)
            }
        },        

        async updateRole(data) {
            try {
                // Preparar os dados para envio incluindo permissões
                const roleData = {
                    name: data.name,
                    description: data.description || ''
                }
                
                // Se houver permissões, incluir no payload
                if (data.permissions && data.permissions.length > 0) {
                    roleData.permissions = data.permissions
                } else {
                    // Se não houver permissões, enviar array vazio para remover todas
                    roleData.permissions = []
                }
                
                const response = await api.patch(`api/v1/private/role/${data.id}`, roleData);
                this.message = response.data
                await this.getRoles() // Atualizar a lista de roles
                
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage.replaceAll('"', '')}
                console.log(error.response)
            }   
        },

        async createRole(data) {
            try {
                const roleData = {
                    name: data.name,
                    description: data.description || ''
                }
                
                // Incluir permissões se houver
                if (data.permissions && data.permissions.length > 0) {
                    roleData.permissions = data.permissions
                }
                
                const response = await api.post('api/v1/private/role/', roleData);
                this.message = response.data
                await this.getRoles()
                
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage.replaceAll('"', '')}
                console.log(error.response)
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