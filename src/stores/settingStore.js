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
        // Getter para acesso fácil às configurações
        getSetting: (state) => (key, defaultValue = null) => {
            return state.settings[key]?.value ?? defaultValue;
        },

        // Getters específicos para configurações comuns
        siteName: (state) => state.getSetting('siteName', 'Levidade CMS'),
        siteDescription: (state) => state.getSetting('siteDescription', ''),
        siteUrl: (state) => state.getSetting('siteAddress', ''),
        uploadMaxSize: (state) => state.getSetting('uploadMaxFileSize', '2 MB'),
        
        // Getter para configurações agrupadas por tipo
        uploadPaths: (state) => ({
            root: state.getSetting('uploadPathRoot', '/storage/'),
            content: state.getSetting('uploadPathContent', '/storage/content/'),
            profile: state.getSetting('uploadPathProfile', '/storage/profile/')
        }),

        // Getter para paginação
        paginationSettings: (state) => ({
            order: state.pagination.order || ['createdAt', 'DESC'],
            pageSize: state.pagination.pageSize || 10
        })
    },

    actions: {
        async initialize() {
            if (this.initialized && Object.keys(this.settings).length > 0) {
                return;
            }

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
                console.error('Erro na inicialização das configurações:', error);
            } finally {
                this.loading = false;
            }
        },

        async getSettings() {
            try {
                const response = await api.get(`api/v1/private/setting`);
                
                if (response.data.status === 'error') {
                    this.message = response.data.data;
                    return;
                }

                this.message = null;
                const settingsData = response.data.data;
                this.settingsArray = settingsData;

                this.settings = settingsData.reduce((acc, setting) => {
                    acc[setting.settingName] = setting;
                    return acc;
                }, {});

            } catch (error) {
                console.error('Erro ao buscar configurações:', error);
                this.message = { status: 'error', message: 'Erro ao carregar configurações' };
            }
        },

        async getPaginationSettings() {
            try {
                const response = await api.get(`api/v1/private/setting/pagination`);
                
                if (response.data.data) {
                    this.pagination = response.data.data.reduce((acc, item) => {
                        if (item.additionalValue === 'order') {
                            acc.order = JSON.parse(item.value);
                        } else if (item.additionalValue === 'pageSize') {
                            acc.pageSize = parseInt(item.value);
                        }
                        return acc;
                    }, {});
                }
            } catch (error) {
                console.error('Erro ao buscar configurações de paginação:', error);
            }
        },

        async getUploadpathSettings() {
            try {
                const response = await api.get(`api/v1/private/setting/uploadpath`);     
            
                if (response.data) {
                    this.uploadpath = response.data.data;
                }
            } catch (error) {
                console.error('Erro ao buscar caminhos de upload:', error);
            }
        },
        
        async getFilesizeSettings() {
            try {
                const response = await api.get(`api/v1/private/setting/filesize`);       
                if (response.data && response.data.status === 'success') {
                    this.filesize = response.data.data;
                }
            } catch (error) {
                console.error('Erro ao buscar tamanhos de arquivo:', error);
            }
        },

        // Action para agrupar filetypes
        async getFiletypeSettings() {
            try {
                const response = await api.get(`api/v1/private/setting/filetype`);       
                if (response.data && response.data.status === 'success') {
                    this.filetype = response.data.data.reduce((acc, item) => {
                        acc[item.additionalValue] = item.value;
                        return acc;
                    }, {});
                }
            } catch (error) {
                console.error('Erro ao buscar tipos de arquivo:', error);
            }
        },

        async updateSetting(data) {
            try {
                const response = await api.put(`api/v1/private/setting/update`, data);
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
                    // Recarregar configurações após atualização
                    await this.getSettings();
                } else {
                    this.message = { status: 'error', message };
                }
                
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Erro inesperado.';
                this.message = { status: 'error', message: errorMessage };
                console.error('Erro ao atualizar configurações:', error);
            }
        },

        clearMessage() {
            this.message = null;
        }
    }
});