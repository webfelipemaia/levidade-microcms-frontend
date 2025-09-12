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
            const response = await axios.get(`api/v1/private/setting`);
            if(response.data.status === 'error') {
                this.message = response.data.data
            } else {
                this.message = null;
                this.settings = Object.values(response.data.data);
            }
        },

        async getPaginationSettings() {
            const response = await axios.get(`api/v1/private/setting/pagination`);
            
            if(response.data.data) {
                this.pagination = response.data.data;
            } else {
                this.message = null;
                this.pagination = [];
            }
        },

        async getUploadpathSettings() {
            const response = await axios.get(`api/v1/private/setting/uploadpath`);     
        
            if(response.data) {
                this.uploadpath = response.data.data;
            } else {
                this.message = null;
                this.uploadpath = [];
            }
        },
        
        async getFilesizeSettings() {
            const response = await axios.get(`api/v1/private/setting/filesize`);       
            if (response.data && response.data.status === 'success') {
                this.filesize = response.data.data;
            } else {
                this.message = null;
                this.filesize = {};
            }
        },

        async updateSetting(data) {
            try {
                const response = await axios.put(`api/v1/private/setting/update`, data);
                const { status, message, successes, errors } = response.data.data;
        
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
        
                await axios.get(`api/v1/private/setting`);
                
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Erro inesperado.';
                this.message = { status: 'error', message: errorMessage };
                console.error('Erro ao atualizar configurações:', error);
            }
        },
        
        
        async doneSuccessfully(response) {
            if(response.data.status === 'success'){                
                const response = await axios.get(`api/v1/private/setting`)
                if(response.data.status !== 'error') {
                    this.settings = response.data.data;
                }
            }
        },

        clearSuccessMessage() {
            this.message = null
        }
    }
})
