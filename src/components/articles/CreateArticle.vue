<template>
    <div class="container-fluid">
        <app-card>
            <template #header>
                <app-card-header>
                    <div class="d-flex justify-content-between">
                        <span>New articles</span>
                        <router-link :to="{name: 'admin.articles'}" class="btn btn-primary"> Back</router-link>
                    </div>
                </app-card-header>
            </template>
            <template #body>
                    <form @submit.prevent="" enctype="multipart/form-data">
                                                
                        <div class="card-body">

                            <div v-if="articleStore.message">
                                <div
                                    class="alert alert-dismissible fade show"
                                    :class="`alert-${articleStore.message.status === 'error'?'danger':'success'}`"
                                    role="alert"
                                >
                                    <!-- caso seja uma string -->
                                    <template v-if="typeof articleStore.message.message === 'string'">
                                    <p><i class="bi bi-exclamation-circle me-2"></i> {{ articleStore.message.message }}</p>
                                    </template>

                                    <!-- caso seja um objeto de erros -->
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
                                </div>


                            <div class="row">
                                <div class="col">
                                        <label for="status" class="col-form-label">Status:</label>
                                        <select v-model="article.status" selected="" class="form-select" aria-label="Default select example" id="status">
                                            <option disabled value="">Select</option>
                                            <option v-for="status in statusStore.status.data" :key="status.id" :value="status.value">
                                                {{status.name}}
                                            </option>
                                        </select>
                                    </div>
                                    
                                    
                                    <div class="col">
                                        <div class="col-form-label">Featured:</div>
                                        <div class="d-flex">
                                            <div class="form-check">
                                                    <input v-model="article.featured" class="form-check-input" type="radio" name="featuredOption" id="featuredOption1" :value="false">
                                                    <label class="form-check-label me-5" for="featuredOption1">
                                                        No
                                                    </label>
                                                    </div>
                                                    <div class="form-check">
                                                    <input v-model="article.featured" class="form-check-input" type="radio" name="featuredOption" id="featuredOption2" :value="true">
                                                    <label class="form-check-label" for="featuredOption2">
                                                        Yes
                                                    </label>
                                                    </div>  
                                        </div>
                                    </div>

                                    <div class="col">
                                        <label for="status" class="col-form-label">Category:</label>
                                        <select v-model="article.categoryId" selected="" class="form-select" aria-label="Default select example" id="categoryId">
                                            <option disabled value="">Select</option>
                                            <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
                                                {{ category.parentId ? '- ' : '' }}
                                                {{category.name}}
                                            </option>
                                        </select>
                                    </div>
                            </div>

                            
                        </div>

                        <div class="card-body mb-3 mt-3">

                            <div class="row">
                                <div class="col">
                                    <label for="title" class="col-form-label">Title:</label>
                                    <input v-model="article.title" type="text" class="form-control" id="title">
                                </div>
                                <div class="col">
                                    <label for="slug" class="col-form-label">Slug:</label>
                                    <input v-model="article.slug" type="text" readonly class="form-control-plaintext" id="slug" placeholder="Auto-generate from title" >
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="subtitle" class="col-form-label">Subtitle:</label>
                                <input v-model="article.subtitle" type="text" class="form-control" id="subtitle">
                            </div>
                            
                            <!-- upload -->
                            <div class="upload-wrapper">
                              
                              <div class="upload-input mb-3">
                                <label for="inputSingleFile" class="form-label">Browse File to Upload</label>
                                <input class="form-control" type="file" ref="fileInput" id="inputSingleFile" @change="uploadFile" :disabled="uploadStore.message ? true : false">
                              </div>
                              
                                <div class="upload-content">
                                    
                                  <section class="loading-area" v-if="!uploadStore.error">
                                    <li class="row" v-for="(file, index) in uploadStore.files" :key="index">
                                        <div class="loading-area__content">
                                        <!--
                                            Caso seja implementado um gerenciador de arquivos, talvez seja útil
                                          <div class="loading-area__details">
                                            <p class="name">Nome do arquivo: {{ file.name }}</p>
                                            <p class="percent">Tamanho do arquivo: {{ file.size }}</p>
                                          </div>-->
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

                            <!-- fim upload-->
                            </div>
                            <div class="row">

                                <div class="col">
                                    <label for="body" class="col-form-label">Body:</label>
                                    <input v-model="article.body" type="text" class="form-control" id="body">                                                                    
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
import { ref, onMounted, computed } from 'vue'
//import { useRouter } from 'vue-router'
import AppCard from '../layout/ui/card/AppCard'
import AppCardHeader from '../layout/ui/card/AppCardHeader'
import { useArticleStore } from '../../stores/articleStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useStatusStore } from '@/stores/statusStore'
import { useSanitizeWords } from '../layout/composebles/HandleStrings'
import { useUploadStore } from '@/stores/uploadStore'

const article = ref({ 
    title : '', 
    slug: '',
    subtitle: '', 
    body : '',
    status: '',
    featured: '',
    categoryId: '',
    contentType: 'article',
})
const fileInput = ref(null)

const articleStore = useArticleStore()
const categoryStore = useCategoryStore()
const statusStore = useStatusStore()
const uploadStore = useUploadStore()
//const router = useRouter()

    const resetUploadStore = () => {
        uploadStore.files = null;
        uploadStore.uploadedFiles = [];
        uploadStore.uploadProgress = 0;
        uploadStore.error = null;
        uploadStore.message = null;
        uploadStore.contentType = '';
    }

    article.value.slug = computed(() => {
      return useSanitizeWords(article.value.title)
    })
   
    const uploadFile = (event) => {
        uploadStore.files = Array.from(event.target.files)
        uploadStore.upload({
            contentType: article.value.contentType,
        });     
      
    }

    const onSubmit = (data) => {
    
    // Adiciona o createdFileId ao objeto data
    const createdFileId = uploadStore.message?.created?.id;
    if (createdFileId) {
        data.fileId = createdFileId;
    }

    articleStore.createArticle(data)
    
    // redirecionar para página do item criado após x segundos
    /*setTimeout(() => {
                router.push({ name: 'admin.articles.view' });
            }, 3000); */
    }

    onMounted(() => {
        articleStore.clearSuccessMessage()
        resetUploadStore()
        categoryStore.getCategories()
        statusStore.getStatus()        
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