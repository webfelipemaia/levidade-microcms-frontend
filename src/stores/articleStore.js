import { defineStore } from 'pinia';
import axios from 'axios';

export const useArticleStore = defineStore({
    id: 'article',
    state: () => ({
        articles: [],
        lastArticle: [],
        message: null,
    }),

    actions: {
        async getArticles() {
            const response = await axios.get(`/articles`);
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.message = null;
                this.articles = response.data;
            }
        },

        async getLastInsertedArticle() {
            const response = await axios.get(`/articles/last`);
            
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.message = null;
                this.lastArticle = response.data;
            }
        },


        async getUsersArticles() {
            const response = await axios.get(`/users/articles/`);
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.message = null;
                this.usersArticles = response.data;
            }
        },        

        async deleteArticle(data) {
            try {                
            const response =  await axios.delete(`/articles/${data.id}`);
            this.message = response.data
            await axios.get(`/articles`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage.replaceAll('"', '')}
                console.log(error.response)
            }
        },        

        async updateArticle(data) {
            try {
            const response =  await axios.patch(`/articles/${data.id}`, data);
            this.message = response.data
            await axios.get(`/articles`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage.replaceAll('"', '')}
                console.log(error.response)
            }   
        },


        async createArticle(data) {
            console.log(data)
            /* try {
            const response =  await axios.post('/articles/', data);
            this.message = response.data
            const last = await axios.get(`/articles/last`);
            this.lastArticle = last.data
            await axios.get(`/articles`)
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage.replaceAll('"', '')}
                console.log(error.response)
            } */
        },
        
        async doneSuccessfully(response) {
            if(response.data.status === 'success'){                
                const response = await axios.get(`/articles`)
                if(response.data.status !== 'error') {
                    this.articles = response.data;                 }
            }
        },

        clearSuccessMessage() {
            this.message = null
        }
    }
})