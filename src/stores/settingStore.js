import { defineStore } from 'pinia';
import axios from 'axios';

export const useSettingStore = defineStore('setting',{
    state: () => ({
        settings: [],
        pagination: [],
        uploadpath: [],
        filesize: [],
        message: null,
    }),

    actions: {
        async getSettings() {
            const response = await axios.get(`/settings`);
            if(response.data.status === 'error') {
                this.message = response.data
            } else {
                this.message = null;
                this.settings = Object.values(response.data);
            }
        },

        async getPaginationSettings() {
            const response = await axios.get(`/settings/pagination`);
            
            if(response.data) {
                this.pagination = response.data;
            } else {
                this.message = null;
                this.pagination = [];
            }
        },

        async getUploadpathSettings() {
            const response = await axios.get(`/settings/uploadpath`);     
        
            if(response.data) {
                this.uploadpath = response.data;
            } else {
                this.message = null;
                this.uploadpath = [];
            }
        },
        
        async getFilesizeSettings() {
            const response = await axios.get(`/settings/filesize`);        
            
            if(response.data) {
                this.filesize = response.data;
            } else {
                this.message = null;
                this.filesize = [];
            }
        },

        async updateSetting(data) {
            console.log(data)
            try {
                const response = await axios.put(`/settings/update`, data);
                const { status, message, successes, errors } = response.data;
        
                if (status === 'partial') {
                    this.message = {
                        status: 'warning',
                        message: `${message} Por favor, revise os erros listados.`,
                        errors: errors.map(err => err.message),
                        successes: successes.map(suc => suc.message),
                    };
                } else if (status === 'success') {
                    this.message = { status: 'success', message };
                } else {
                    this.message = { status: 'error', message };
                }
        
                await axios.get(`/settings`);
                
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Erro inesperado.';
                this.message = { status: 'error', message: errorMessage };
                console.error('Erro ao atualizar configurações:', error);
            }
        },
        
        
        async doneSuccessfully(response) {
            if(response.data.status === 'success'){                
                const response = await axios.get(`/settings`)
                if(response.data.status !== 'error') {
                    this.settings = response.data;                 }
            }
        },

        clearSuccessMessage() {
            this.message = null
        }
    }
})
