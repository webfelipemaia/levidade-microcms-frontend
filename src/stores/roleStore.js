import { defineStore } from 'pinia';
import api from '@/services/api';
import { useValidationErrors } from '@/composables/useValidation';

export const useRoleStore = defineStore({
    id: 'role',
    state: () => ({
        roles: [],
        usersRoles: [],
        message: null,
    }),

    actions: {
        async getRoles() {
            try {
            const response = await api.get(`api/v1/private/role`);
                if(response.data.status === 'error') {
                    this.message = response.data
                } else {
                    this.roles = response.data;
                }
            } catch (error) {
                this.message = { status: 'error', message: 'Erro ao carregar roles' };
            }
        },

                async getPaginatedRoles({ page, pageSize, search, order, date }) {
                    try {
                        
                        const finalOrder = Array.isArray(order) ? order : JSON.parse(order || '[["createdAt", "DESC"]]');
                        const params = {
                            page,
                            pageSize,
                            search: search || undefined,
                            order: JSON.stringify(finalOrder),
                        };
                
                        if (date) params.date = date;
                
                        const response = await api.get(`api/v1/private/role/paginated`, { params });
                
                        return {
                            data: response.data.data,
                            total: response.data.total,
                        };
                    } catch (error) {
                        console.error('Failed to fetch roles:', error);
                        return {
                            data: [],
                            total: 0,
                        };
                    }
                }, 

        async getUsersRoles() {
            try {
                const response = await api.get(`api/v1/private/user/roles/`);
                if(response.data.status === 'error') {
                    this.message = response.data
                } else {
                    this.usersRoles = response.data;
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Erro ao carregar roles dos usuários';
                this.message = { status: 'error', message: errorMessage };
            }
        },        

        async deleteRole(data) {
            try {                
                const response =  await api.delete(`api/v1/private/role/${data.id}`);
                this.message = response.data
                if (response.data.status === 'success') {
                    await this.getRoles();
                }
                this.message = null;
            } catch (error) {
                let errorMessage = error.response?.data?.message
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
                this.message = { status:'error', message: useValidationErrors(errorMessage)}
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
                let errorMessage = error.response?.data?.message
                this.message = { status:'error', message: useValidationErrors(errorMessage) }
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