// categoryStore.js - versão corrigida
import { defineStore } from 'pinia';
import api from '@/services/api';

export const useCategoryStore = defineStore({
    id: 'category',
    state: () => ({
        categories: [],
        usersCategories: [],
        message: null,
    }),

    actions: {
        async getCategories() {
            try {
                const response = await api.get(`api/v1/private/category`);
                if(response.data.status === 'error') {
                    this.message = response.data
                } else {
                    this.categories = response.data;
                }
            } catch (error) {
                this.message = { status: 'error', message: 'Erro ao carregar categorias' };
            }
        },

        async getPaginatedCategories({ page, pageSize, search, order, date }) {
            try {
                
                const finalOrder = Array.isArray(order) ? order : JSON.parse(order || '[["createdAt", "DESC"]]');
                const params = {
                    page,
                    pageSize,
                    search: search || undefined,
                    order: JSON.stringify(finalOrder),
                };
        
                if (date) params.date = date;
        
                const response = await api.get(`api/v1/private/category/paginated`, { params });
        
                return {
                    data: response.data.data,
                    total: response.data.total,
                };
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                return {
                    data: [],
                    total: 0,
                };
            }
        }, 

        async createCategory(data) {
            try {
                const response = await api.post('api/v1/private/category/', data);
                this.message = response.data
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Erro ao criar categoria';
                this.message = { status:'error', message: errorMessage };
            }
        },

        async updateCategory(data) {
            try {
                const response = await api.patch(`api/v1/private/category/${data.id}`, data);
                this.message = response.data;
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Erro ao atualizar categoria';
                this.message = { status:'error', message: errorMessage };
            }   
        },

        async deleteCategory(data) {
            try {                
                const response = await api.delete(`api/v1/private/category/${data.id}`);
                this.message = response.data;
                if (response.data.status === 'success') {
                    await this.getCategories();
                }
                this.message = null;
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Erro ao excluir categoria';
                this.message = { status:'error', message: errorMessage };
            }
        },

        clearSuccessMessage() {
            this.message = null;
        }
    }
});