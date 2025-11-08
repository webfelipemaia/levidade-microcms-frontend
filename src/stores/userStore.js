import { defineStore } from 'pinia';
import api from '@/services/api';
import { useValidationErrors } from '@/composables/useValidation';

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

        async getPaginatedUsers({ page, pageSize, search, order, date }) {
            try {
                
                const finalOrder = Array.isArray(order) ? order : JSON.parse(order || '[["createdAt", "DESC"]]');
                const params = {
                    page,
                    pageSize,
                    search: search || undefined,
                    order: JSON.stringify(finalOrder),
                };
        
                if (date) params.date = date;
        
                const response = await api.get(`api/v1/private/user/paginated`, { params });
        
                return {
                    data: response.data.data,
                    total: response.data.total,
                };
            } catch (error) {
                console.error('Failed to fetch users:', error);
                return {
                    data: [],
                    total: 0,
                };
            }
        }, 

        async deleteUser(data) {
            try {                
                const response = await api.delete(`api/v1/private/user/${data.id}`);
                this.message = response.data.message;                
                this.users = this.users.filter(user => user.id !== data.id);
                
            } catch (error) {
                let errorMessage = error.response;
                this.message = { status:'error', message: errorMessage};
            }
        },        

        async updateUser(id, data) {
            try {                
                const response = await api.put(`api/v1/private/user/${id}`, data);
                this.message = response.data;
                
                const index = this.users.findIndex(user => user.id === id);
                if (index !== -1) {
                    this.users[index] = { ...this.users[index], ...data };
                }
                
            } catch (error) {
                let errorMessage = error.response;
                this.message = { status:'error', message: useValidationErrors(errorMessage)};
            }
        },

        async createUser(data) {
            try {
                const response = await api.post('api/v1/private/user/register',
                    { 
                        email: data.email, 
                        password: data.password, 
                        confirmPassword: data.confirmPassword, 
                        name: data.name, 
                        lastname: data.lastname,                    
                    }
                );
                this.message = response.data.message;
                await this.getUsers();
                
            } catch (error) {
                let errorMessage = error.response.data.message;
                this.message = { status:'error', message: useValidationErrors(errorMessage)};
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
        },

    }
})