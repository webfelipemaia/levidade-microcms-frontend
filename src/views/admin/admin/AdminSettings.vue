<template>
    <div class="container-fluid">
        
        <div class="row g-3">
            <div v-if="message" class="alert"
                :class="message.status === 'error' ? 'alert-danger' : (message.status === 'success' ? 'alert-success' : 'alert-warning')">
                {{ message.message }}
                <div v-if="message.status === 'warning'">
                    <div v-if="message.successes?.length">
                        <h5>Itens atualizados com sucesso:</h5>
                        <ul>
                            <li v-for="success in message.successes" :key="success">{{ success }}</li>
                        </ul>
                    </div>
                    <div v-if="message.errors?.length">
                        <h5>Itens com erro:</h5>
                        <ul>
                            <li v-for="error in message.errors" :key="error">{{ error }}</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="section-page">
                <h4>Configurações Gerais</h4>
                <div class="row">
                    <p>
                        Gerencie parâmetros de listagem, políticas de armazenamento de arquivos e até a forma como a identidade visual pode ser apresentada.
                    </p>
                </div>                    
            </div>
                    
            
            <app-card class="mt-4">
                <template #header>
                    <app-card-header>
                        <div class="d-flex justify-content-between">
                            <h5 class="setting-title">Identidade do Projeto</h5>
                        </div>
                    </app-card-header>
                </template>
                <template #body>
                    <div class="row g-3 mb-5">
                        <div class="col-md-6">
                            <label class="form-label">{{ findSetting('site_name').additionalValue }}</label>
                            <input type="text" class="form-control" v-model="findSetting('site_name').value">
                            <div class="form-text">{{ findSetting('site_name').description }}</div>
                        </div>
                        <div class="col-md-6 text-end">
                            <button type="button" class="btn btn-outline-primary btn-sm" @click="saveSetting('site_name')">
                                Salvar Nome
                            </button>
                        </div>
                    </div>
                    <div class="pb-3"><hr class="content-divider"></div>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">{{ findSetting('site_description').additionalValue }}</label>
                            <textarea class="form-control" rows="1" v-model="findSetting('site_description').value"></textarea>
                            <div class="form-text">{{ findSetting('site_description').description }}</div>
                        </div>
                        <div class="col-md-6 text-end">
                            <button type="button" class="btn btn-outline-primary btn-sm" @click="saveSetting('site_description')">
                                Salvar Descrição
                            </button>
                        </div>
                    </div>
                </template>
            </app-card>

            <app-card class="mt-4">
                <template #header>
                    <app-card-header>
                        <div class="d-flex justify-content-between">
                            <h5 class="setting-title">Canais de Contato</h5>
                        </div>
                    </app-card-header>
                </template>
                <template #body>
                    <div class="row g-3 mb-5">
                        <div class="col-md-6">
                            <label class="form-label">{{ findSetting('admin_email').additionalValue }}</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                                <input type="email" class="form-control" v-model="findSetting('admin_email').value">
                            </div>
                            <div class="form-text text-danger">Atenção: Este e-mail recebe notificações críticas do sistema.</div>
                        </div>
                        <div class="col-md-6 text-end">
                            <button type="button" class="btn btn-outline-primary btn-sm" @click="saveSetting('admin_email')">
                                Salvar E-mail
                            </button>
                        </div>
                    </div>
                    <div class="pb-3">
                        <hr class="content-divider">
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">{{ findSetting('site_contact').additionalValue }}</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                                <input type="text" class="form-control" v-model="findSetting('site_contact').value">
                            </div>
                            <div class="form-text">{{ findSetting('site_contact').description }}</div>
                        </div>
                        <div class="col-md-6 text-end">
                            <button type="button" class="btn btn-outline-primary btn-sm" @click="saveSetting('site_contact')">
                                Salvar Contato
                            </button>
                        </div>
                    </div>
                </template>
            </app-card>

            <app-card class="mt-4">
                <template #header>
                    <app-card-header>
                        <div class="d-flex justify-content-between">
                            <h5 class="setting-title">Ordenação Padrão</h5>
                            <button type="button" class="btn btn-outline-primary btn-sm" @click="saveSetting('pagination.order')">
                                Salvar Ordenação
                            </button>
                        </div>
                    </app-card-header>
                </template>
                <template #body>
                    <div class="row">
                        <div class="col-md-12">
                            <label class="form-label d-block">
                                {{ findSetting('pagination.order').additionalValue }}
                            </label>
                            <p><small>{{ findSetting('pagination.order').description }}</small></p>
                            
                            <div class="d-flex gap-4 mt-2">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="orderDir" id="orderAsc" 
                                        value="ASC" v-model="paginationDirection">
                                    <label class="form-check-label" for="orderAsc">
                                        <i class="bi bi-sort-numeric-down"></i> Crescente (ASC)
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="orderDir" id="orderDesc" 
                                        value="DESC" v-model="paginationDirection">
                                    <label class="form-check-label" for="orderDesc">
                                        <i class="bi bi-sort-numeric-up-alt"></i> Decrescente (DESC)
                                    </label>
                                </div>
                            </div>
                            <div class="form-text mt-3">
                                Atualmente ordenando pelo campo: <code>{{ paginationField }}</code>
                            </div>
                        </div>
                    </div>
                </template>
            </app-card>

            <app-card class="mt-4">
                <template #header>
                    <app-card-header>
                        <div class="d-flex justify-content-between">
                            <h5 class="setting-title">Densidade da Listagem</h5>
                            <button type="button" class="btn btn-outline-primary btn-sm" @click="saveSetting('pagination.page_size')">
                                Salvar Tamanho
                            </button>
                        </div>
                    </app-card-header>
                </template>
                <template #body>
                    <div class="row">
                        <div class="col-md-6">
                            <label for="pageSizeSelect" class="form-label">
                                {{ findSetting('pagination.page_size').additionalValue }}
                            </label>
                            <p><small>{{ findSetting('pagination.page_size').description }}</small></p>
                            
                            <select 
                                v-model.number="findSetting('pagination.page_size').value" 
                                class="form-select" 
                                id="pageSizeSelect"
                            >
                                <option v-for="size in [10, 25, 50, 100, 200]" :key="size" :value="size">
                                    {{ size }} itens por página
                                </option>
                            </select>
                            <div class="form-text mt-2">
                                Define quantos registros serão carregados inicialmente em cada tabela.
                            </div>
                        </div>
                    </div>
                </template>
            </app-card>

            <app-card class="mt-4">
                <template #header>
                    <app-card-header>
                        <div class="d-flex justify-content-between">
                            <h5 class="setting-title">Infraestrutura de Armazenamento</h5>
                            <button type="button" class="btn btn-outline-primary btn-sm" @click="saveSetting('upload_path.root')">
                                Salvar Caminho Raiz
                            </button>
                        </div>
                    </app-card-header>
                </template>
                <template #body>
                    <div class="row">
                        <div class="col-md-12">
                            <label for="rootPath" class="form-label">
                                {{ findSetting('upload_path.root').additionalValue }}
                            </label>
                            <p><small>{{ findSetting('upload_path.root').description }}</small></p>
                            <div class="input-group">
                                <span class="input-group-text">Path</span>
                                <input type="text" class="form-control" id="rootPath"
                                    v-model="findSetting('upload_path.root').value" placeholder="/storage/">
                            </div>
                            <div class="form-text text-danger">
                                Cuidado: Alterar este caminho pode tornar arquivos antigos inacessíveis.
                            </div>
                        </div>
                    </div>
                </template>
            </app-card>

            <app-card class="mt-4">
                <template #header>
                    <app-card-header>
                        <div class="d-flex justify-content-between">
                            <h5 class="setting-title">Armazenamento de Conteúdo</h5>
                            <button type="button" class="btn btn-outline-primary btn-sm" @click="saveSetting('upload_path.content')">
                                Salvar Pasta de Conteúdo
                            </button>
                        </div>
                    </app-card-header>
                </template>
                <template #body>
                    <div class="row">
                        <div class="col-md-12">
                            <label class="form-label">{{ findSetting('upload_path.content').additionalValue }}</label>
                            <p><small>{{ findSetting('upload_path.content').description }}</small></p>
                            <input type="text" class="form-control" v-model="findSetting('upload_path.content').value">
                        </div>
                    </div>
                </template>
            </app-card>

            <app-card class="mt-4">
                <template #header>
                    <app-card-header>
                        <div class="d-flex justify-content-between">
                            <h5 class="setting-title">Armazenamento de Avatar de Perfil</h5>
                            <button type="button" class="btn btn-outline-primary btn-sm" @click="saveSetting('upload_path.profile')">
                                Salvar Pasta de Avatar de Perfil
                            </button>
                        </div>
                    </app-card-header>
                </template>
                <template #body>
                    <div class="row">
                        <div class="col-md-12">
                            <label class="form-label">{{ findSetting('upload_path.profile').additionalValue }}</label>
                            <p><small>{{ findSetting('upload_path.profile').description }}</small></p>
                            <input type="text" class="form-control" v-model="findSetting('upload_path.profile').value">
                        </div>
                    </div>
                </template>
            </app-card>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue';
import AppCard from '@/components/layout/ui/card/AppCard.vue';
import AppCardHeader from '@/components/layout/ui/card/AppCardHeader.vue';
import { useSettingStore } from '@/stores/settingStore';
//import { capitalizeFirstLetter } from '@/components/layout/composables/HandleStrings'

const settingStore = useSettingStore();

const settings = reactive({ list: [] });
const message = ref(null);
const filesizeOptions = ref([]);
const uploadPaths = ref([]);

const friendlyNames = {
    'site_name': 'Nome do Site',
    'site_description': 'Descrição do Site',
    'admin_email': 'E-mail Admin',
    'site_contact': 'Contato',
    'pagination': 'Itens por Página',
    'pagination.page_size': 'Quantidade de Itens Padrão',
    'upload.required': 'Upload Obrigatório',
    'upload.max_file_size': 'Tamanho Máximo',
    'upload.limit': 'Limite de Arquivos',
    'upload_path.root': 'Caminho Raiz do Storage',
    'upload_path.content': 'Diretório de Mídia/Conteúdo',
    'upload_path.profile': 'Diretório de Avatares/Perfil',
    
};

// Computada para extrair/salvar apenas a direção (ASC/DESC)
const paginationDirection = computed({
    get() {
        const s = findSetting('pagination.order');
        // Assume que o valor é um array ['CAMPO', 'DIREÇÃO']
        return Array.isArray(s.value) ? s.value[1] : 'DESC';
    },
    set(newDir) {
        const s = findSetting('pagination.order');
        if (s && Array.isArray(s.value)) {
            s.value = [s.value[0], newDir];
        }
    }
});

// Apenas para exibir qual campo está sendo usado (ex: 'id')
const paginationField = computed(() => {
    const s = findSetting('pagination.order');
    return Array.isArray(s.value) ? s.value[0] : 'N/A';
});

onMounted(async () => {
    await settingStore.getSettings();
    await settingStore.getFilesizeSettings();
    await settingStore.getUploadpathSettings();

    if (settingStore.settingsArray) {

        settings.list = settingStore.settingsArray.map(item => ({
            id: item.id,
            settingName: item.settingName,
            value: item.value,
            additionalValue: friendlyNames[item.settingName] || item.settingName,
            description: item.description || `Configuração de ${item.settingName}`
        }));
    }

    filesizeOptions.value = Object.values(settingStore.filesize);

    uploadPaths.value = Object.entries(settingStore.uploadpath).map(([key, val]) => ({
        label: key,
        value: val
    }));
});

/**
 * Envia uma configuração específica para o backend
 * @param {String} settingName Nome da chave (ex: upload_path.content)
 */
const saveSetting = async (settingName) => {
    const item = findSetting(settingName);
    if (!item?.id) {
        message.value = { 
            status: 'error', 
            message: `Configuração "${settingName}" não encontrada` 
        };
        return;
    }

    try {
        await settingStore.updateItem({
            key: settingName,
            value: item.value
        });
        
        message.value = { 
            status: 'success', 
            message: `${item.additionalValue} atualizado com sucesso!` 
        };

        if (settingName.includes('upload_path')) {
            await settingStore.getUploadpathSettings();
            uploadPaths.value = Object.entries(settingStore.uploadpath).map(([key, val]) => ({
                label: key,
                value: val
            }));
        }
        
/*         setTimeout(() => {
            message.value = null;
        }, 3000); */
        
    } catch (error) {
        console.error('Erro ao salvar configuração:', error);
        message.value = { 
            status: 'error', 
            message: `Erro ao salvar ${settingName}: ${error.message}` 
        };
    }
};

const findSetting = (settingName) => {
    return settings.list.find(s => s.settingName === settingName) || { value: '', additionalValue: settingName };
}

/* const capitalizeIt = (word) => capitalizeFirstLetter(word);

const uploadRequired = computed({
    get() {
        const s = findSetting('upload.required');
        return s.value === true || s.value === 'true' || s.value === 1;
    },
    set(newVal) {
        const s = findSetting('upload.required');
        if (s) s.value = newVal;
    }
}); */
</script>