<template>
    <div class="container-fluid">
        <app-card>
            <template #header>
                <app-card-header>
                    <div class="d-flex justify-content-between">
                        <span>Avatar</span>
                        <router-link :to="{name: 'admin.profile'}" class="btn btn-primary"> Back</router-link>
                    </div>
                </app-card-header>
            </template>
            <template #body>
                    <form @submit.prevent="" enctype="multipart/form-data">
                                                
                        <div class="card-body">

                            <!-- <div v-if="articleStore.message">
                                <div
                                    class="alert alert-dismissible fade show"
                                    :class="`alert-${articleStore.message.status === 'error'?'danger':'success'}`"
                                    role="alert"
                                >
                                    <template v-if="typeof articleStore.message.message === 'string'">
                                        <p><i class="bi bi-exclamation-circle me-2"></i> {{ articleStore.message.message }}</p>
                                    </template>

                                    <template v-else>
                                        <p><i class="bi bi-exclamation-circle me-2"></i>Oops! We found some problems with the form.</p>
                                        <ul class="mb-0">
                                            <li v-for="(msg, field) in articleStore.message.message" :key="field">
                                            <strong>{{ field }}:</strong> {{ msg }}
                                            </li>
                                        </ul>
                                    </template>

                                    <button
                                    type="button"
                                    class="btn-close"
                                    data-bs-dismiss="alert"
                                    aria-label="Close"
                                    ></button>
                                </div>
                            </div> -->

                            
                        </div>

                        <div class="card-body mb-3 mt-3">

                            
                            <div v-if="settings.settings.uploadRequired.value" class="upload-wrapper">
                              
                              <div class="upload-input mb-3">
                                <label for="inputSingleFile" class="form-label">Browse File to Upload</label>
                                <input class="form-control" type="file" ref="fileInput" id="inputSingleFile" @change="uploadFile" :disabled="uploadStore.message ? true : false">
                              </div>
                              
                                <div class="upload-content">
                                    
                                  <section class="loading-area" v-if="!uploadStore.error">
                                    <li class="row" v-for="(file, index) in uploadStore.files" :key="index">
                                        <div class="loading-area__content">
                                        
                                          <div class="loading-bar">
                                            <p>Status do upload:</p>
                                            <div class="progress" role="progressbar" aria-label="Upload progress status" :aria-valuenow="uploadStore.uploadProgress" aria-valuemin="0" aria-valuemax="100">
                                              <div class="progress-bar bg-success" :style="{width: uploadStore.uploadProgress + '%'}">
                                                {{ uploadStore.uploadProgress }}%
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                    </li>

                                  <section class="uploaded-area" v-if="uploadStore.message">
                                      {{ uploadStore.message.uploaded }}
                                  </section>
                                </section>
                                <section v-else>
                                  <p>{{ uploadStore.error}}</p>
                                </section>
                            </div>

                            </div>

                        </div>

                        <div class="card-footer">
                            <div class="d-flex justify-content-between">
                                <button type="button" @click="$emit('close')" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary" @click.prevent.stop="onSubmit(article)">Save</button>
                            </div>
                        </div>
                    </form>
                </template>
        </app-card>
    </div>
            
</template>

<script setup>
import { ref, onMounted, /* computed  */} from 'vue'
//import { useRouter } from 'vue-router'
import AppCard from '@/components/layout/ui/card/AppCard.vue'
import AppCardHeader from '@/components/layout/ui/card/AppCardHeader.vue'
import { useUploadStore } from '@/stores/uploadStore'
import { useSettingStore } from '@/stores/settingStore'
import { useAuthStore } from '@/stores/authStore'


const fileInput = ref(null)
const uploadStore = useUploadStore()
const settings = useSettingStore()
const authStore = useAuthStore();

    const resetUploadStore = () => {
        uploadStore.files = null;
        uploadStore.uploadedFiles = [];
        uploadStore.uploadProgress = 0;
        uploadStore.error = null;
        uploadStore.message = null;
        uploadStore.contentType = '';
    }

    const fileData = ref({ 
        userId: authStore.user.id,
        contentType: 'profile',
    })

    const uploadFile = (event) => {
        uploadStore.files = Array.from(event.target.files)
        uploadStore.upload({
            contentType: fileData.value.contentType,
            userId: fileData.value.userId,
        });     
      
    }

    const onSubmit = (data) => {
    
        const createdFileId = uploadStore.message?.created?.id;
        if (createdFileId) {
            data.fileId = createdFileId;

        }

    }

    const loadSettings = () => {
        loadSettings.value = Object.values(settings).map(setting => ({
                setting           }));
    }

    onMounted(() => {
        //articleStore.clearSuccessMessage()
        resetUploadStore()
        loadSettings()
    })
    
</script>

<style>
.card__form-group {
    margin-bottom: 2rem;
}
</style>
<style scoped>
.loading-area__content {
    padding: 0.5rem;
}

.loading-area__details {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.125rem;
}

.loading-area__details span:first-child {
    margin-top: 0;
}

.loading-area__details span{
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}
</style>