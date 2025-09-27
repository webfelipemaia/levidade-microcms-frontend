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
            const response = await api.get(`api/v1/private/category`);
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.message = null;
                this.categories = response.data;
            }
        },

        async createCategory(data) {
            try {
            const response =  await api.post('api/v1/private/category/', data);
            this.message = response.data
            await api.get(`api/v1/private/category`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage}
                console.log(error.response)
            }
        },

        async updateCategory(data) {
            try {
            const response =  await api.patch(`api/v1/private/category/${data.id}`, data);
            this.message = response.data
            await api.get(`api/v1/private/category`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage}
                console.log(error.response)
            }   
        },

        async deleteCategory(data) {
            try {                
            const response =  await api.delete(`api/v1/private/category/${data.id}`);
            this.message = response.data
            await api.get(`api/v1/private/category`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage}
                console.log(error.response)
            }
        },

        async doneSuccessfully(response) {
            if(response.data.status === 'success'){                
                const response = await api.get(`api/v1/private/category`)
                if(response.data.status !== 'error') {
                    this.categories = response.data;                 }
            }
        },

        clearSuccessMessage() {
            this.message = null
        }
    }
})