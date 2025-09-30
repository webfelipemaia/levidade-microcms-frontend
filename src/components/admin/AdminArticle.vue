<template>
    <div class="container-fluid">
        <app-card>
            <template #header>
                <app-card-header>
                    <div class="d-flex justify-content-between">
                        <span>All articles</span>
                        <router-link :to="{name: 'admin.articles.new'}" class="btn btn-primary"><i class="bi bi-plus"></i> New</router-link>
                    </div>
                </app-card-header>
            </template>
            <template #body>
                <div class="table-responsive">
                    <table class="table table-striped">
                                <thead>
                                    <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Category</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Updated at</th>
                                    <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-if="_articles && _articles.length">
                                        <tr v-for="article in _articles" :key="article.id">                        
                                            <th class="align-middle" scope="row">{{ article.id }}</th>
                                            <td class="align-middle">{{ article.title }}</td>
                                            <td class="align-middle">{{ getCategory(article.categoryId) }}</td>
                                            <td class="align-middle">{{ getStatus(article.status) }}</td>
                                            <td class="align-middle">{{ article.updatedAt }}</td>
                                            <td>
                                                <div class="d-flex">
                                                    <div class="p-2 flex-fill">
                                                        <router-link :to="{ name: 'admin.articles.edit', params: { id: article.id } }" class="btn">
                                                            <i class="bi bi-pencil"></i>
                                                        </router-link>
                                                    </div>
                                                    <div class="p-2 flex-fill">
                                                        <button @click="[activeModal=true,selectedArticle=article]" type="button" class="btn">
                                                            <i class="bi bi-trash3"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </template>
                                    <template v-else>
                                        <tr>
                                            <td colspan="6" class="text-center">No data</td>
                                        </tr>
                                    </template>
                                </tbody>

                    </table>
                </div>
            </template>
        </app-card>
        <app-pagination
        :total-pages="totalPages"
        :total="totalArticles"
        :per-page="perPage"
        :current-page="currentPage"
        @pagechanged="onPageChange"
        />
    </div>

    <app-modal :id="'app-modal-01'" :data="selectedArticle" :show="activeModal" confirmation text-save="Delete" :show-header="false" @close="activeModal=false" @process-data="processData($event)"></app-modal>
    
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AppCard from '../layout/ui/card/AppCard'
import AppModal from '../layout/ui/modal/AppModal'
import AppCardHeader from '../layout/ui/card/AppCardHeader'
import AppPagination from '../layout/ui/AppPagination.vue'
import { storeToRefs } from 'pinia'
import { useArticleStore } from '../../stores/articleStore'
import { useCategoryStore } from '../../stores/categoryStore'
import { useStatusStore } from '../../stores/statusStore'

const articleStore = useArticleStore()
const categoryStore = useCategoryStore()
const { categories } = storeToRefs(categoryStore)
const statusStore = useStatusStore()
const { status } = storeToRefs(statusStore)
const selectedArticle = ref([])
const activeModal = ref(false)

const _articles = ref([])
const currentPage = ref(1)
const perPage = 10
const totalArticles = ref(0)

const totalPages = computed(() => Math.ceil(totalArticles.value / perPage))

const fetchArticles = async () => {
  const response = await articleStore.getPaginatedArticles({
    page: currentPage.value,
    pageSize: perPage,
    search: '',
    order: JSON.stringify([['id', 'ASC']]),
  });

  _articles.value = response.data;
  totalArticles.value = response.total;
  articleStore.message = null
};

const onPageChange = (page) => {
  currentPage.value = page
  fetchArticles()
}

const fetchCategories = async () => {
   await categoryStore.getCategories()
}

const fetchStatus = async () => {
    await statusStore.getStatus()
}

const getCategory = (id) => {
    const cat = categories.value
    
    const categoryFound = cat.find(item => item.id === id);

    if (categoryFound) {
        return categoryFound.name;
    } else {
        return null;
    }
} 

const getStatus = (id) => {

    const stat = status.value?.data || [];
    const statusFound = stat.find(item => parseInt(item.value) === id);
    if (statusFound) {
        return statusFound.name;
    } else {
        return null;
    }
}

const processData = (data) => {
    articleStore.deleteArticle(data)
    _articles.value = _articles.value.filter(a => a.id !== data.id);
    activeModal.value=false
}

onMounted(() => {
    fetchArticles()
    fetchCategories()
    fetchStatus()
})

</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  padding: 0;
  border-radius: 8px;
}
.show {
    transform: none;
}
</style>