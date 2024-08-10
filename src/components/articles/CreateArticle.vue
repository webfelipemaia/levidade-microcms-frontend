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
                    <form @submit.prevent="">
                                                
                        <div class="card-body">

                        <div v-if="articleStore.message">
                            <div class="alert alert-dismissible fade show" :class="`alert-${articleStore.message.status === 'error'?'danger':'success'}`" role="alert">
                                <p><i class="bi bi-exclamation-circle me-2"></i> {{ articleStore.message.message }}</p>
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        </div>

                            <div class="row">
                                <div class="col">
                                        <label for="status" class="col-form-label">Status:</label>
                                        <select v-model="article.status" selected="" class="form-select" aria-label="Default select example" id="status">
                                            <option disabled value="">Select</option>
                                            <option v-for="status in statusStore.status" :key="status.id" :value="status.value">
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
import { useRouter } from 'vue-router'
import AppCard from '../layout/ui/card/AppCard'
import AppCardHeader from '../layout/ui/card/AppCardHeader'
import { useArticleStore } from '../../stores/articleStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useStatusStore } from '@/stores/statusStore'
import { useSanitizeWords } from '../layout/composebles/HandleStrings';

const article = ref({ 
    title : '', 
    slug: '',
    subtitle: '', 
    body : '',
    status: '',
    featured: '',
    categoryId: '',
})

const articleStore = useArticleStore()
const categoryStore = useCategoryStore()
const statusStore = useStatusStore()
const router = useRouter()
    
    article.value.slug = computed(() => {
      return useSanitizeWords(article.value.title)
    })

    const onSubmit = (data) => {
        
        articleStore.createArticle(data)
        setTimeout(() => {
                router.push({ name: 'admin.articles.view' });
            }, 3000);
    }

    onMounted(() => {
        categoryStore.getCategories()
        statusStore.getStatus()        
    })
    
</script>

<style>
.card__form-group {
    margin-bottom: 2rem;
}
</style>