<template>
  <div class="container-fluid">
      <app-card>
          <template #header>
              <app-card-header>
                  <div class="d-flex justify-content-between">
                      <span v-if="!showSuccessMessage">Edit articles</span>
                      <span v-else>Operation Completed</span>
                      <!-- <router-link :to="{name: 'admin.articles'}" class="btn btn-primary"> Back</router-link> -->
                  </div>
              </app-card-header>
          </template>
          <template #body>
              <!-- Card de sucesso -->
              <div v-if="showSuccessMessage" class="text-center py-4">
                  <div class="alert alert-success mb-4" role="alert">
                      <i class="bi bi-check-circle me-2"></i> 
                      {{ articleStore.message.message }}
                  </div>
                  <router-link :to="{name: 'admin.articles'}" class="btn btn-primary">
                      Back to Articles List
                  </router-link>
              </div>

              <!-- Formulário (escondido quando sucesso) -->
              <form v-if="!showSuccessMessage" @submit.prevent="updateArticle" enctype="multipart/form-data">
                                          
                  <div class="card-body">

                  <div v-if="articleStore.message && articleStore.message.status === 'error'">
                      <div class="alert alert-dismissible fade show alert-danger" role="alert">
                          <p><i class="bi bi-exclamation-circle me-2"></i> {{ articleStore.message.message }}</p>
                          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
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
                        
                          <!-- Task: Implement image update -->
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
                          <router-link :to="{name: 'admin.articles'}" class="btn btn-secondary">Cancel</router-link>
                          <button type="submit" class="btn btn-primary" >Save</button>
                      </div>
                  </div>
              </form>
          </template>
      </app-card>
  </div>
      
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router';
import AppCard from '@/components/layout/ui/card/AppCard.vue'
import AppCardHeader from '@/components/layout/ui/card/AppCardHeader.vue'
import { useArticleStore } from '@/stores/articleStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useStatusStore } from '@/stores/statusStore'
import { useSanitizeWords } from '@/composables/useStrings'
import { useUploadStore } from '@/stores/uploadStore'

const articleId = ref(null);
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
const showSuccessMessage = ref(false)

const route = useRoute();
const articleStore = useArticleStore()
const categoryStore = useCategoryStore()
const statusStore = useStatusStore()
const uploadStore = useUploadStore()
  
  article.value.slug = computed(() => {
    return useSanitizeWords(article.value.title)
  })
 
  const fetchArticle = async (id) => {
    try {
      article.value = await articleStore.getArticleById(id);
    } catch (error) {
      console.error('Erro ao carregar o artigo:', error);
    }
  };

  const updateArticle = async () => {
  try {
    await articleStore.updateArticle(article.value);
    showSuccessMessage.value = true;
  } catch (error) {
    console.error('Erro ao atualizar o artigo:', error);
    showSuccessMessage.value = false;
  }
};

    onMounted(() => {
      uploadStore.clearUploadData();
      articleId.value = route.params.id;
      categoryStore.getCategories();
      statusStore.getStatus();
      fetchArticle(articleId.value);
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