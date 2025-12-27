<template>
    <div class="container-fluid">
        <app-card>
            <template #header>
                <app-card-header>
                    <div class="d-flex justify-content-between">
                        <span>Configurações</span>
                        <button class="btn btn-primary" @click="saveSettings">
                            Salvar Alterações
                        </button>
                    </div>
                </app-card-header>
            </template>

            <template #body>
                <form class="row g-3">
                    <div class="section-page">
                        <h4>Configurações Gerais</h4>
                    </div>
                    <div class="row">
                        <div v-if="message" class="alert" :class="message.status === 'error' ? 'alert-danger' : (message.status === 'success' ? 'alert-success' : 'alert-warning')">
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
                    </div>

                    <div class="row mb-4">
                        <template v-for="item in settings.list" :key="item.settingName">
                            <div v-if="allowedFields.includes(item.settingName)" class="col-md-6">
                                <label :for="item.settingName" class="form-label">
                                    {{ item.settingName === 'pagination' ? `${capitalizeIt(item.settingName)} - ` : '' }} 
                                    {{ item.additionalValue }}
                                </label>
                                <p style="min-height: 48px;"><small>{{ item.description }}</small></p>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    :id="item.settingName" 
                                    v-model="item.value"
                                >
                            </div>
                        </template>
                    </div>

                    <div class="row mb-4">
                        <div class="section-page">
                            <h4>Uploads</h4>
                        </div>

                        <div class="col-md-6">
                            <label for="uploadRequiredSwitch" class="form-label">
                                {{ findSetting('upload.required').additionalValue }}:
                            </label>
                            <p style="min-height: 48px;">
                                <small>{{ findSetting('upload.required').description }}</small>
                            </p>

                            <div class="form-check form-switch">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="uploadRequiredSwitch"
                                    v-model="uploadRequired"
                                >
                                <label class="form-check-label" for="uploadRequiredSwitch">
                                    {{ uploadRequired ? 'Habilitado' : 'Desabilitado' }}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="row mb-4">
                        <div class="col-md-6">
                            <label for="uploadMaxFileSize" class="form-label">{{ findSetting('upload.max_file_size').additionalValue }}:</label>
                            <p style="min-height: 48px;"><small>{{ findSetting('upload.max_file_size').description }}</small></p>
                            <select v-model="findSetting('upload.max_file_size').value" class="form-select" id="uploadMaxFileSize">
                                <option disabled value="">Select</option>
                                <option 
                                    v-for="maxSize in filesizeOptions" 
                                    :key="maxSize.label" 
                                    :value="maxSize.bytes"
                                >
                                    {{ maxSize.label }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="uploadLimit" class="form-label">{{ findSetting('upload.limit').additionalValue }}</label>
                            <p style="min-height: 48px;"><small>{{ findSetting('upload.limit').description }}</small></p>
                            <input 
                                type="text" 
                                class="form-control" 
                                id="uploadLimit" 
                                v-model="findSetting('upload.limit').value"
                            >
                        </div>
                        
                        <div class="col-md mt-4">
                            <p>Os arquivos são armazenados de acordo com o assunto associado ao evento de upload.</p>
                            <dl class="row" v-for="path in uploadPaths" :key="path.label">
                                <dt class="col-sm-3 text-capitalize">{{ path.label }}</dt>
                                <dd class="col-sm-9">
                                    <p class="mb-0"><code>{{ path.value }}</code></p>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </form>
            </template>
        </app-card>
        <app-card class="mt-4">
    <template #header>
        <app-card-header>
            <div class="d-flex justify-content-between">
                <span>Infraestrutura de Armazenamento</span>
                <button class="btn btn-warning btn-sm" @click="saveRootPath">
                    Atualizar Caminho Raiz
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
                    <input 
                        type="text" 
                        class="form-control" 
                        id="rootPath" 
                        v-model="findSetting('upload_path.root').value"
                        placeholder="/storage/"
                    >
                </div>
                <div class="form-text text-danger">
                    Cuidado: Alterar este caminho pode tornar arquivos antigos inacessíveis.
                </div>
            </div>
        </div>
    </template>
</app-card>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue';
import AppCard from '@/components/layout/ui/card/AppCard.vue';
import AppCardHeader from '@/components/layout/ui/card/AppCardHeader.vue';
import { useSettingStore } from '@/stores/settingStore';
import { capitalizeFirstLetter } from '@/components/layout/composables/HandleStrings'

const settingStore = useSettingStore();

const settings = reactive({ list: [] });
const message = ref(null);
const filesizeOptions = ref([]);
const uploadPaths = ref([]);

const allowedFields = [
    'site_name',
    'site_description',
    'admin_email',
    'site_contact',
    'pagination'
];

const friendlyNames = {
    'site_name': 'Nome do Site',
    'site_description': 'Descrição do Site',
    'admin_email': 'E-mail Admin',
    'site_contact': 'Contato',
    'pagination': 'Itens por Página',
    'upload.required': 'Upload Obrigatório',
    'upload.max_file_size': 'Tamanho Máximo',
    'upload.limit': 'Limite de Arquivos',
    'upload_path.root': 'Caminho Raiz do Storage',
};

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
        console.log(settings.list);
    }

    filesizeOptions.value = Object.values(settingStore.filesize);

    uploadPaths.value = Object.entries(settingStore.uploadpath).map(([key, val]) => ({
        label: key,
        value: val
    }));
});

const saveSettings = async () => {
    try {

        const payload = settings.list.map(s => {

            return {
                id: s.id, 
                value: s.value
            };
        });

        await settingStore.updateSetting(payload);
        
        message.value = { status: 'success', message: 'Configurações salvas com sucesso' };
    } catch (error) {
        console.error(error);
        message.value = { status: 'error', message: 'Erro ao salvar configurações' };
    }
};

const saveRootPath = async () => {
    const rootSetting = findSetting('upload_path.root');
    
    // Validamos se o ID foi carregado
    if (!rootSetting.id) {
        message.value = { status: 'error', message: 'ID da configuração não encontrado.' };
        return;
    }

    try {
        // Enviamos um array contendo APENAS este item
        const payload = [{
            id: rootSetting.id,
            value: rootSetting.value
        }];

        await settingStore.updateSetting(payload);
        
        // Feedback específico
        message.value = { 
            status: 'success', 
            message: 'Caminho raiz atualizado com sucesso!' 
        };
        
        // Recarrega os caminhos visuais na lista inferior
        await settingStore.getUploadpathSettings();
        uploadPaths.value = Object.entries(settingStore.uploadpath).map(([key, val]) => ({
            label: key,
            value: val
        }));
        
    } catch (error) {
        console.error(error);
        message.value = { status: 'error', message: 'Falha ao atualizar o caminho raiz.' };
    }
};

const findSetting = (settingName) => {
    return settings.list.find(s => s.settingName === settingName) || { value: '', additionalValue: settingName };
}

const capitalizeIt = (word) => capitalizeFirstLetter(word);

const uploadRequired = computed({
    get() {
        const s = findSetting('upload.required');
        return s.value === true || s.value === 'true' || s.value === 1;
    },
    set(newVal) {
        const s = findSetting('upload.required');
        if (s) s.value = newVal;
    }
});
</script>