<template>
    <div class="container-fluid">
        <app-card>
            <template #header>
                <app-card-header>
                    <div class="d-flex justify-content-between">
                        <span>Configurações</span>
                        <button 
                            class="btn btn-primary"
                            @click="saveSettings"
                        >
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

                            <!-- Mostrar detalhes adicionais no caso de relatórios parciais -->
                            <div v-if="message.status === 'warning'">
                                <div v-if="message.successes && message.successes.length">
                                    <h5>Itens atualizados com sucesso:</h5>
                                    <ul>
                                        <li v-for="success in message.successes" :key="success">{{ success }}</li>
                                    </ul>
                                </div>
                                <div v-if="message.errors && message.errors.length">
                                    <h5>Itens com erro:</h5>
                                    <ul>
                                        <li v-for="error in message.errors" :key="error">{{ error }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="row mb-4">

                        <template v-for="item in settings" :key="`${item.id}_${item.settingName}`">
                            
                            <div v-if="item.settingName === allowedFields.find((element) => element === item.settingName)" class="col-md-6">

                                <label :for="item.settingName" class="form-label">{{ item.settingName === 'pagination' ? `${capitalizeIt(item.settingName)} - ` : '' }} {{ item.additionalValue }}</label>
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
                            
                            <label for="uploadMaxFileSize" class="form-label">{{ findSetting('uploadMaxFileSize').additionalValue }}:</label>
                            <p style="min-height: 48px;"><small>{{ findSetting('uploadLimit').description }}</small></p>
                            <select v-model="findSetting('uploadMaxFileSize').value" class="form-select" aria-label="Default select example" id="uploadMaxFileSize">
                                <option disabled value="">Select</option>
                                <option 
                                    v-for="maxSize in filesizeOptions" 
                                    :key="maxSize.label" 
                                    :value="maxSize.label"
                                    :selected="findSetting('uploadMaxFileSize').value === maxSize.label"
                                    :title="maxSize.value + ` bytes`"
                                >
                                    {{ maxSize.label }}
                                </option>
                            </select>


                        </div>
                        <div class="col-md-6">
                            <label for="uploadLimit" class="form-label">{{ findSetting('uploadLimit').additionalValue }}</label>
                            <p style="min-height: 48px;"><small>{{ findSetting('uploadLimit').description }}</small></p>
                            <input 
                                type="text" 
                                class="form-control" 
                                id="uploadLimit" 
                                v-model="findSetting('uploadLimit').value"
                            >
                        </div>
                        <br />
                        <div class="col-md mt-4">
                            <p>Os arquivos são armazenados de acordo com o assunto associado ao evento de upload.</p>
                            <br />
                            
                            <dl class="row" v-for="path in uploadPaths" :key="path.label">
                                <dt class="col-sm-3">{{ path.label }}</dt>
                                <dd class="col-sm-9">
                                    <p>{{ path.value.value }}</p>
                                    <p>{{ path.value.description }}</p>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </form>
            </template>
        </app-card>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import AppCard from '../layout/ui/card/AppCard';
import AppCardHeader from '../layout/ui/card/AppCardHeader';
import { useSettingStore } from '@/stores/settingStore';
import { capitalizeFirstLetter } from '../layout/composables/HandleStrings'

const settingStore = useSettingStore();

const settings = reactive({});
const message = ref(null);
const filesizeOptions = ref([]);
const uploadPaths = ref([]);
const allowedFields = [
    'siteName',
    'siteDescription',
    'adminEmail',
    'siteContact',
    'pagination'
];

    onMounted(async () => {
        await settingStore.getSettings();
        await settingStore.getPaginationSettings();
        await settingStore.getUploadpathSettings();
        await settingStore.getFilesizeSettings();

        Object.assign(settings, mapSettings(settingStore.settings));
        filesizeOptions.value = Object.entries(settingStore.filesize).map(([label, expression]) => ({
            label,
            value: eval(expression)
        }));
        uploadPaths.value = Object.entries(settingStore.uploadpath).map(([label, expression]) => ({
            label,
            value: expression
        }));        
    });

    const saveSettings = async () => {
        try {
            const payload = Object.values(settings).map(setting => ({
                id: setting.id,
                value: setting.value
            }));
            await settingStore.updateSetting(payload);
            message.value = { status: 'success', message: 'Configurações salvas com sucesso' };
        } catch (error) {
            console.error(error);
            message.value = { status: 'error', message: 'Erro ao salvar configurações' };
        }
    };


    const findSetting = (settingName, id = null) => {
        if (id) {
            return settings[`${settingName}_${id}`] || {};
        }
        return Object.values(settings).find(setting => setting.settingName === settingName) || {};
    }


    const mapSettings = (apiSettings) => {
        const mapped = {};
        apiSettings.forEach(item => {
            const { settingName, id } = item;
            mapped[`${settingName}_${id}`] = item;
        });

        return mapped;
    }

    const capitalizeIt = (word) => {
        return capitalizeFirstLetter(word);
    }

</script>

<style>
.section-page {
    margin-top: 20px;
    margin-bottom: 10px;
}
</style>
