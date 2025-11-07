<template>
    <div class="container-fluid">

        <app-card>
            <template #header>
                <app-card-header>
                    <div class="d-flex justify-content-between align-items-center flex-wrap">
                        <span>Articles</span>
                        <div class="d-flex flex-wrap gap-2 align-items-center">
                            <router-link :to="{ name: 'admin.articles.new' }" class="btn btn-primary ms-5">
                                <i class="bi bi-plus"></i> New
                            </router-link>
                        </div>
                    </div>
                </app-card-header>
            </template>
    
            <template #body>
                <div class="table-top">
                    <div class="d-flex justify-content-between flex-wrap gap-2">
                        
                            <input v-model="searchTitle" class="form-control w-50" placeholder="Search by title" />

                            <select v-model="selectedCategory" class="form-select w-auto">
                                <option value="">All Categories</option>
                                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                            </select>

                            <select v-model="selectedStatus" class="form-select w-auto">
                                <option value="">All Status</option>
                                <option v-for="s in availableStatuses" :key="s.id" :value="s.value">{{ s.name }}</option>
                            </select>
                                
                            <select v-model="sortOrder" class="form-select w-auto">
                                <option value="ASC">Ascending</option>
                                <option value="DESC">Descending</option>
                            </select>
            
                            <select v-model.number="perPage" @change="onPerPageChange" class="form-select w-auto">
                                <option v-for="n in [5,10,20,50]" :key="n" :value="n">{{ n }}</option>
                            </select>
            
                        </div>
                </div>
                <div class="table-responsive mt-3">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Updated at</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="loading">
                                <tr>
                                    <td colspan="6" class="text-center">
                                        <div class="spinner-border" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <template v-else-if="_articles && _articles.length">
                                <tr v-for="article in _articles" :key="article.id">
                                    <th>{{ article.id }}</th>
                                    <td>{{ article.title }}</td>
                                    <td>{{ getCategory(article.categoryId) }}</td>
                                    <td>
                                        <span :class="getStatusBadgeClass(article.status)">
                                            {{ getStatusName(article.status) }}
                                        </span>
                                    </td>
                                    <td>{{ formatDate(article.updatedAt) }}</td>
                                    <td>
                                        <div class="d-flex">
                                            <router-link :to="{ name: 'admin.articles.edit', params: { id: article.id } }" class="btn">
                                                <i class="bi bi-pencil"></i>
                                            </router-link>
                                            <button @click="[activeModal = true, selectedArticle = article]" type="button" class="btn">
                                                <i class="bi bi-trash3"></i>
                                            </button>
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
                        <tfoot>
                            <tr>
                                <td colspan="6">
                                    <div class="d-flex justify-content-end">
                                        <app-pagination
                                            :total-pages="totalPages"
                                            :current-page="currentPage"
                                            @pagechanged="onPageChange"
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </template>
        </app-card>
    
        <app-modal
            id="app-modal-01"
            :data="selectedArticle"
            :show="activeModal"
            confirmation
            text-save="Delete"
            :show-header="false"
            @close="activeModal = false"
            @process-data="processData($event)"
        ></app-modal>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import AppCard from '@/components/layout/ui/card/AppCard.vue'
import AppCardHeader from '@/components/layout/ui/card/AppCardHeader.vue'
import AppModal from '@/components/layout/ui/modal/AppModal.vue'
import AppPagination from '@/components/layout/ui/AppPagination.vue'
import { useArticleStore } from '@/stores/articleStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useStatusStore } from '@/stores/statusStore'
import { storeToRefs } from 'pinia'

const articleStore = useArticleStore()
const categoryStore = useCategoryStore()
const statusStore = useStatusStore()
const { categories } = storeToRefs(categoryStore)
const { status } = storeToRefs(statusStore)

const _articles = ref([])
const currentPage = ref(1)
const totalArticles = ref(0)
const perPage = ref(10)
const selectedArticle = ref(null)
const activeModal = ref(false)
const loading = ref(false)

const searchTitle = ref('')
const sortOrder = ref('ASC')

const totalPages = computed(() => Math.ceil(totalArticles.value / perPage.value))

const selectedCategory = ref('')
const selectedStatus = ref('')

// Status disponíveis
const availableStatuses = computed(() => {
    if (!status.value?.data) return []
    return status.value.data.map(s => ({
        id: s.id,
        name: s.name,
        value: parseInt(s.value)
    }))
})

// --- Funções ---
const fetchArticles = async () => {
    loading.value = true
    try {
        const filters = {
            page: currentPage.value,
            pageSize: perPage.value,
            search: searchTitle.value,
            order: JSON.stringify([['id', sortOrder.value]]),
            categoryId: selectedCategory.value || undefined,
            status: selectedStatus.value !== '' ? parseInt(selectedStatus.value) : undefined,
        }

        const response = await articleStore.getPaginatedArticles(filters);
        _articles.value = response.data;
        totalArticles.value = response.total;
    } catch (error) {
        console.error('Error fetching articles:', error)
    } finally {
        loading.value = false
    }
}

const fetchCategories = async () => categoryStore.getCategories()
const fetchStatus = async () => statusStore.getStatus()

const getCategory = (id) => categories.value.find(c => c.id === id)?.name || '-'

const getStatusName = (statusValue) => {
    const statusObj = availableStatuses.value.find(s => s.value === statusValue)
    return statusObj?.name || `Unknown (${statusValue})`
}

const getStatusBadgeClass = (statusValue) => {
    const classes = {
        '-2': 'badge bg-danger',     // Trash
        '-1': 'badge bg-secondary',  // Archive  
        '0': 'badge bg-warning',     // Unpublish
        '1': 'badge bg-success'      // Publish
    }
    return classes[statusValue] || 'badge bg-light'
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const processData = (data) => {
    articleStore.deleteArticle(data)
    _articles.value = _articles.value.filter(a => a.id !== data.id)
    activeModal.value = false
}

// --- Eventos ---
const onPageChange = (page) => {
    currentPage.value = page
    fetchArticles()
}

const onPerPageChange = () => {
    currentPage.value = 1
    fetchArticles()
}

// Watch com debounce
let searchTimeout = null
watch([searchTitle, sortOrder, selectedCategory, selectedStatus], () => {
    currentPage.value = 1
    
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        fetchArticles()
    }, 500)
})

onMounted(() => {
    fetchCategories()
    fetchStatus()
    fetchArticles()
})
</script>

<style scoped>
.badge {
    font-size: 0.75em;
    padding: 0.35em 0.65em;
}
</style>