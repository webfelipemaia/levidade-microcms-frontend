import { defineStore } from 'pinia';
import axios from 'axios';

export const useCategoryStore = defineStore({
    id: 'category',
    state: () => ({
        categories: [],
        usersCategories: [],
        message: null,
    }),

    actions: {
        async getCategories() {
            const response = await axios.get(`/categories`);
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.message = null;
                this.categories = response.data;
            }
        },


        async deleteCategory(data) {
            try {                
            const response =  await axios.delete(`/categories/${data.id}`);
            this.message = response.data
            await axios.get(`/categories`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage}
                console.log(error.response)
            }
        },        

        async updateCategory(data) {
            try {
            const response =  await axios.patch(`/categories/${data.id}`, data);
            this.message = response.data
            await axios.get(`/categories`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage}
                console.log(error.response)
            }   
        },


        async createCategory(data) {
            try {
            const response =  await axios.post('/categories/',
                { 
                    name: data.name, 
                }
            );
            this.message = response.data
            await axios.get(`/categories`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage}
                console.log(error.response)
            }
        },
        
        async doneSuccessfully(response) {
            if(response.data.status === 'success'){                
                const response = await axios.get(`/categories`)
                if(response.data.status !== 'error') {
                    this.categories = response.data;                 }
            }
        },

        clearSuccessMessage() {
            this.message = null
        }
    }
})