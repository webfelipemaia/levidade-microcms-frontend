import { defineStore } from 'pinia';
import api from '@/services/api';

export const useSettingStore = defineStore("setting", {
  state: () => ({
    settings: {},
    settingsArray: [],
    pagination: {},
    uploadpath: {},
    filesize: {},
    filetype: {},
    message: null,
    loading: false,
    initialized: false,
  }),

  getters: {

    /**
    * Obtém uma configuração específica por chave com valor padrão
    */
    getSetting:
      (state) =>
      (key, defaultValue = null) => {
        return state.settings[key]?.value ?? defaultValue;
      },
    
    /**
    * Nome do site
    */
    siteName: (state) => state.getSetting("site_name", "Levidade CMS"),

    /**
    * Descrição do site
    */
    siteDescription: (state) => state.getSetting("site_description", ""),

    /**
    * Configurações de tamanho de arquivo
    */
    uploadPaths: (state) => ({
      root: state.uploadpath?.root || "/storage/",
      content: state.uploadpath?.content || "/storage/content/",
      profile: state.uploadpath?.profile || "/storage/profile/",
    }),

    /**
    * Configurações de paginação
    */
    paginationSettings: (state) => ({
      order: state.pagination?.order || ["createdAt", "DESC"],
      pageSize: state.pagination?.page_size || 10,
    }),

    /**
     * Obtém uma configuração específica por chave
     */
    getByKey: (state) => (key) => {
      return state.settings.find((setting) => setting.key === key);
    },

    /**
     * Obtém configurações por categoria
     */
    getByCategory: (state) => (category) => {
      return state.settings.filter((setting) => setting.category === category);
    },
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
          this.getFilesizeSettings(),
        ]);
        this.initialized = true;
      } catch (error) {
        console.error("Erro na inicialização:", error);
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
        const flatten = (obj, prefix = "") => {
          for (let key in obj) {
            const name = prefix ? `${prefix}.${key}` : key;

            if (obj[key] && typeof obj[key] === "object" && "id" in obj[key]) {
              flatList.push({
                id: obj[key].id,
                settingName: name,
                value: obj[key].value,
              });
            } else if (
              typeof obj[key] === "object" &&
              obj[key] !== null &&
              !Array.isArray(obj[key])
            ) {
              flatten(obj[key], name);
            }
          }
        };

        flatten(settingsData);
        this.settingsArray = flatList;
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    },

    async getPaginationSettings() {
      try {
        const response = await api.get(`api/v1/private/setting/pagination`);
        if (response.data.status === "success") {
          this.pagination = response.data.data;
        }
      } catch (error) {
        console.error("Erro paginação:", error);
      }
    },

    async getUploadpathSettings() {
      try {
        const response = await api.get(`api/v1/private/setting/uploadpath`);
        if (response.data.status === "success") {
          this.uploadpath = response.data.data;
        }
      } catch (error) {
        console.error("Erro uploadpath:", error);
      }
    },

    async getFilesizeSettings() {
      try {
        const response = await api.get(`api/v1/private/setting/filesize`);
        if (response.data.status === "success") {
          this.filesize = response.data.data;
        }
      } catch (error) {
        console.error("Erro filesize:", error);
      }
    },

    async updateSetting(payload) {
      try {
        const response = await api.put(
          `api/v1/private/setting/update`,
          payload
        );
        if (response.data.status === "success") {
          this.message = {
            status: "success",
            message: "Configurações atualizadas!",
          };
          await this.getSettings();
        }
        return response.data;
      } catch (error) {
        this.message = { status: "error", message: "Falha na atualização" };
        throw error;
      }
    },

        /**
         * Atualiza uma configuração específica por chave (key)
         * @param {Object} payload - Dados para atualização
         * @param {string} payload.key - A chave da configuração
         * @param {any} [payload.value] - Novo valor
         */
        async updateItem(payload) {
            
            this.loading = true;
            this.message = null;
            
            try {
                const { key, ...updateData } = payload;
                
                if (!key) {
                    throw new Error('A chave (key) da configuração é obrigatória');
                }

                Object.keys(updateData).forEach(k => {
                    if (updateData[k] === undefined || updateData[k] === '') {
                        delete updateData[k];
                    }
                });

                if (Object.keys(updateData).length === 0) {
                    throw new Error('Nenhum dado para atualizar fornecido');
                }

                const response = await api.put(`/api/v1/private/setting/update/${key}`, updateData);
                
                if (response.data.success) {
                    this.message = { 
                        status: 'success', 
                        message: response.data.message || 'Configuração atualizada com sucesso!' 
                    };
                    
                    if (Array.isArray(this.settings)) {
                        const updatedIndex = this.settings.findIndex(s => {
                            return s.key === key || 
                                   s.settingName === key || 
                                   s.id === response.data.data?.id;
                        });
                        
                        if (updatedIndex !== -1) {
                            this.settings[updatedIndex] = { 
                                ...this.settings[updatedIndex], 
                                ...response.data.data,
                                value: updateData.value || this.settings[updatedIndex].value
                            };
                        } else {
                            this.settings.push({
                                key: key,
                                ...response.data.data
                            });
                        }
                    } else if (this.settings && typeof this.settings === 'object') {
                        if (this.settings[key]) {
                            this.settings[key] = { 
                                ...this.settings[key], 
                                ...response.data.data 
                            };
                        } else {
                            this.settings[key] = response.data.data;
                        }
                    }
                    
/*                     setTimeout(() => {
                        this.message = null;
                    }, 3000); */
                }
                
                return response.data;
                
            } catch (error) {
                console.error('Erro ao atualizar configuração:', error);
                
                let errorMessage = 'Falha na atualização';
                
                if (error.response) {
                    
                    const { status, data } = error.response;
                    
                    switch (status) {
                        case 400:
                            errorMessage = data.message || 'Dados inválidos';
                            break;
                        case 403:
                            errorMessage = 'Acesso negado: Você não tem permissão para atualizar esta configuração';
                            break;
                        case 404:
                            errorMessage = `Configuração não encontrada`;
                            break;
                        case 500:
                            errorMessage = 'Erro interno do servidor';
                            break;
                        default:
                            errorMessage = data.message || 'Erro desconhecido';
                    }
                } else if (error.request) {
                    errorMessage = 'Sem resposta do servidor';
                } else {
                    errorMessage = error.message || 'Erro ao processar requisição';
                }
                
                this.message = { 
                    status: 'error', 
                    message: errorMessage 
                };
                
                throw error;
                
            } finally {
                this.loading = false;
            }
        },
        /**
         * Método auxiliar para atualizar apenas o valor de uma configuração
         * @param {string} key - A chave da configuração
         * @param {any} value - Novo valor
         */
        async updateValue(key, value) {
            return await this.updateItem({ key, value });
        },

        /**
         * Método auxiliar para atualizar apenas a descrição
         * @param {string} key - A chave da configuração
         * @param {string} description - Nova descrição
         */
        async updateDescription(key, description) {
            return await this.updateItem({ key, description });
        },

        /**
         * Método auxiliar para atualizar apenas a categoria
         * @param {string} key - A chave da configuração
         * @param {string} category - Nova categoria
         */
        async updateCategory(key, category) {
            return await this.updateItem({ key, category });
        }
  },
});