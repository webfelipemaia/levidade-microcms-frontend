import { defineStore } from 'pinia';
import api from '@/services/api';
import { useValidationErrors } from '@/composables/validation';

export const useArticleStore = defineStore({
    id: 'article',
    state: () => ({
        articles: [],
        lastArticle: [],
        message: null,
    }),

    actions: {
        
        // Simple query
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

        // Paginated data
        async getPaginatedArticles({ page, pageSize, search, order }) {
            try {
                const response = await api.get(`api/v1/private/article`, {
                    params: {
                        page,
                        pageSize,
                        search,
                        order,
                    },
                });
          
                return {
                    data: response.data,
                    total: response.data.total,
                };
            } catch (error) {
                console.error('Failed to fetch articles:', error);
                return { 
                    data: [], 
                    total: 0 
                };
            }
        },
        
        async getArticleById(id) {
            try {
                
                const response = await api.get(`api/v1/private/article/${id}`);
                this.article = response.data;
                this.message = { status: 'success', message: 'Artigo carregado com sucesso.' };
                return response.data;
            } catch (error) {
                
                let errorMessage = error.response?.data?.message || 'Erro desconhecido';
                this.message = { status: 'error', message: errorMessage.replaceAll('"', '') };
                console.error('Erro ao buscar artigo:', error);
                throw error;
            }
        },
        

        async getLastInsertedArticle() {
            const response = await api.get(`api/v1/private/article/last`);
            
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.lastArticle = response.data;
            }
        },


        async getUsersArticles() {
            const response = await api.get(`api/v1/user/articles/`);
            
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.usersArticles = response.data;
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
            } catch (error) {

                let errorMessage = error.response.data.message
                this.message = { status:'error', message: useValidationErrors(errorMessage) }
            }   
        },


        async createArticle(data) {
            try {
                const response =  await api.post('api/v1/private/article/', data);
                this.message = response.data
                const last = await api.get(`api/v1/private/article/last`);
                this.lastArticle = last.data
            } catch (error) {
                
                let errorMessage = error.response.data.message
                this.message = { 
                    status:'error', 
                    message: useValidationErrors(errorMessage)
                }
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