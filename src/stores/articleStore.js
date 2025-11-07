import { defineStore } from 'pinia';
import api from '@/services/api';
import { useValidationErrors } from '@/composables/useValidation';

export const useArticleStore = defineStore({
    id: 'article',
    state: () => ({
        articles: [],
        lastArticle: [],
        message: null,
    }),

    actions: {
        
        async getArticles() {
            const response = await api.get(`api/v1/private/article`);
            this.message = null;
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.message = null;
                this.articles = response.data;
            }
        },

        async getPaginatedArticles({ page, pageSize, search, order, categoryId, status, date }) {
            try {
                
                const finalOrder = Array.isArray(order) ? order : JSON.parse(order || '[["createdAt", "DESC"]]');
                const params = {
                    page,
                    pageSize,
                    search: search || undefined,
                    order: JSON.stringify(finalOrder),
                };
        
                if (categoryId) params.categoryId = categoryId;
                if (status !== null && status !== undefined && status !== '') params.status = status;
                if (date) params.date = date;
        
                const response = await api.get(`api/v1/private/article/paginated`, { params });
        
                return {
                    data: response.data.data,
                    total: response.data.total,
                };
            } catch (error) {
                console.error('Failed to fetch articles:', error);
                return {
                    data: [],
                    total: 0,
                };
            }
        },        

        async deleteArticle(data) {
            try {            
                const response =  await api.delete(`api/v1/private/article/${data.id}`);
                this.message = response.data
            } catch (error) {

                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage.replaceAll('"', '')}
            }
        },        

        async updateArticle(data) {
            try {
                
                const response =  await api.patch(`api/v1/private/article/${data.id}`, data);
                this.message = response.data

                const index = this.articles.findIndex(article => article.id === data.id);
                if (index !== -1) {
                    this.articles[index] = { ...this.articles[index], ...data };
                }
            } catch (error) {

                let errorMessage = error.response.data.message
                this.message = { status:'error', message: useValidationErrors(errorMessage) }
            }   
        },

        async createArticle(data) {
            try {
                const response = await api.post('api/v1/private/article/', data);
                this.message = response.data.message;
                const last = await api.get(`api/v1/private/article/last`);
                this.lastArticle = last.data;
                return {
                    status: 'success',
                    data: response.data
                };
            } catch (error) {
                
                if (error.response?.status === 422) {
                    const errorData = error.response.data;
                    
                    this.message = {
                        status: 'error',
                        message: useValidationErrors(errorData.message) || 'Erro de validação'
                    };
                } 
                
                else if (error.response?.data) {
                    this.message = {
                        status: 'error',
                        message: useValidationErrors(error.response.data.message) || 'Erro ao criar artigo'
                    };
                } else {
                    this.message = {
                        status: 'error',
                        message: error.message || 'Erro de conexão'
                    };
                }
                
                return {
                    status: 'error',
                    error: this.message
                };
            }
        },
        
        async doneSuccessfully(response) {
            if(response.data.status === 'success'){                
                const response = await api.get(`api/v1/private/article`)
                if(response.data.status !== 'error') {
                    this.articles = response.data;                 }
            }
        },

        clearSuccessMessage() {
            this.message = null
        },

        
    }
})