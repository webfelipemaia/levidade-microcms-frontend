import { defineStore } from 'pinia';
import api from '@/services/api';

export const useStatusStore = defineStore({
    id: 'status',
    state: () => ({
        status: [],
        message: null,
    }),

    actions: {
        
        async getStatus() {
            const response = await api.get(`api/v1/private/status`);
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.message = null;
                this.status = response.data;
            }
        },


        async deleteStatus(data) {
            try {                
            const response =  await api.delete(`api/v1/private/status/${data.id}`);
            this.message = response.data
            await api.get(`api/v1/private/status`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage}
                console.log(error.response)
            }
        },        

        async updateStatus(data) {
            try {
            const response =  await api.patch(`api/v1/private/status/${data.id}`, data);
            this.message = response.data
            await api.get(`api/v1/private/status`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage}
                console.log(error.response)
            }   
        },


        async createStatus(data) {
            try {
            const response =  await api.post('api/v1/private/status/',
                { 
                    name: data.name, 
                }
            );
            this.message = response.data
            await api.get(`api/v1/private/status`)
            
            } catch (error) {
                let errorMessage = error.response.data.message
                this.message = { status:'error', message: errorMessage}
                console.log(error.response)
            }
        },
        
        async doneSuccessfully(response) {
            if(response.data.status === 'success'){                
                const response = await api.get(`api/v1/private/status`)
                if(response.data.status !== 'error') {
                    this.status = response.data;                 }
            }
        },

        clearSuccessMessage() {
            this.message = null
        }
        
    }
})