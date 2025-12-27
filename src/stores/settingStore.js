import { defineStore } from 'pinia';
import api from '@/services/api';

export const useSettingStore = defineStore('setting', {
    state: () => ({
        settings: {},
        settingsArray: [],
        pagination: {},
        uploadpath: {},
        filesize: {},
        filetype: {},
        message: null,
        loading: false,
        initialized: false
    }),

    getters: {
        getSetting: (state) => (key, defaultValue = null) => {
            return state.settings[key]?.value ?? defaultValue;
        },

        siteName: (state) => state.getSetting('site_name', 'Levidade CMS'),
        siteDescription: (state) => state.getSetting('site_description', ''),
        
        uploadPaths: (state) => ({
            root: state.uploadpath?.root || '/storage/',
            content: state.uploadpath?.content || '/storage/content/',
            profile: state.uploadpath?.profile || '/storage/profile/'
        }),

        paginationSettings: (state) => ({
            order: state.pagination?.order || ['createdAt', 'DESC'],
            pageSize: state.pagination?.page_size || 10
        })
    },

    actions: {
        async initialize() {
            if (this.initialized) return;

            this.loading = true;
            try {
                await Promise.all([
                    this.getSettings(),
                    this.getPaginationSettings(),
                    this.getUploadpathSettings(),
                    this.getFilesizeSettings()
                ]);
                this.initialized = true;
            } catch (error) {
                console.error('Erro na inicialização:', error);
            } finally {
                this.loading = false;
            }
        },

        async getSettings() {
            try {
                const response = await api.get(`api/v1/private/setting`);
                const settingsData = response.data.data;
        
                this.settings = settingsData;
                       
                const flatList = [];
                const flatten = (obj, prefix = '') => {
                    for (let key in obj) {
                        const name = prefix ? `${prefix}.${key}` : key;
                        
                        if (obj[key] && typeof obj[key] === 'object' && 'id' in obj[key]) {
                            flatList.push({
                                id: obj[key].id,
                                settingName: name,
                                value: obj[key].value
                            });
                        } 
                        
                        else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                            flatten(obj[key], name);
                        }
                    }
                };
                
                flatten(settingsData);
                this.settingsArray = flatList;
        
            } catch (error) {
                console.error('Erro ao carregar configurações:', error);
            }
        },

        async getPaginationSettings() {
            try {
                const response = await api.get(`api/v1/private/setting/pagination`);
                if (response.data.status === 'success') {
                    this.pagination = response.data.data;
                }
            } catch (error) {
                console.error('Erro paginação:', error);
            }
        },

        async getUploadpathSettings() {
            try {
                const response = await api.get(`api/v1/private/setting/uploadpath`);
                if (response.data.status === 'success') {
                    this.uploadpath = response.data.data;
                }
            } catch (error) {
                console.error('Erro uploadpath:', error);
            }
        },

        async getFilesizeSettings() {
            try {
                const response = await api.get(`api/v1/private/setting/filesize`);
                if (response.data.status === 'success') {
                    this.filesize = response.data.data;
                }
            } catch (error) {
                console.error('Erro filesize:', error);
            }
        },

        async updateSetting(payload) {
            try {
                const response = await api.put(`api/v1/private/setting/update`, payload);
                if (response.data.status === 'success') {
                    this.message = { status: 'success', message: 'Configurações atualizadas!' };
                    await this.getSettings();
                }
                return response.data;
            } catch (error) {
                this.message = { status: 'error', message: 'Falha na atualização' };
                throw error;
            }
        }
    }
});