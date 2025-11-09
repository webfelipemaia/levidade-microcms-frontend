<template>
    <div class="container-fluid">
        <app-card>
            <template #header>
                <app-card-header>
                    <div class="d-flex justify-content-between align-items-center flex-wrap">
                        <span>All categories</span>
                        <div class="d-flex flex-wrap gap-2 align-items-center">
                            <button @click="[showModal=true,selectedCategory={}]" type="button" class="btn btn-primary ms-5">
                                <i class="bi bi-plus"></i> New
                            </button>
                        </div>
                    </div>
                </app-card-header>
            </template>
    
            <template #body>
                <div class="table-top">
                    <div class="d-flex justify-content-between flex-wrap gap-2">
                        
                        <input v-model="searchName" class="form-control w-50" placeholder="Search by name" />

                        <div class="d-flex gap-2">
                            <select v-model="sortOrder" class="form-select w-auto">
                                <option value="ASC">Ascending</option>
                                <option value="DESC">Descending</option>
                            </select>
            
                            <select v-model.number="perPage" @change="onPerPageChange" class="form-select w-auto">
                                <option v-for="n in [5,10,20,50]" :key="n" :value="n">{{ n }}</option>
                            </select>
                        </div>
        
                    </div>
                </div>
                <div class="table-responsive mt-3">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Updated at</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="loading">
                                <tr>
                                    <td colspan="4" class="text-center">
                                        <div class="spinner-border" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <template v-else-if="_categories && _categories.length">
                                <tr v-for="category in _categories" :key="category.id">            
                                    <th class="align-middle" scope="row">{{ category.id }}</th>
                                    <td class="align-middle"> 
                                        <span v-if="category.parentId"><i class="bi bi-arrow-90deg-up"></i></span> 
                                        {{ category.name }}
                                    </td>
                                    <td class="align-middle">{{ formatDate(category.updatedAt) }}</td>
                                    <td class="align-middle">
                                        <div class="d-flex">
                                            <button @click="[showModal=true,selectedCategory=category]" type="button" class="btn">
                                                <i class="bi bi-pencil"></i>
                                            </button>
                                            <button @click="[activeModal=true,selectedCategory=category]" type="button" class="btn">
                                                <i class="bi bi-trash3"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <template v-else>
                                <tr>
                                    <td colspan="4" class="text-center">No data</td>
                                </tr>
                            </template>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="4">
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
            :data="selectedCategory" 
            :show="activeModal" 
            confirmation 
            text-save="Delete" 
            :show-header="false" 
            @close="activeModal=false"
            @process-data="processData($event)"
        ></app-modal>
        
        <category-form 
            id="app-modal-02" 
            :data="selectedCategory" 
            :show="showModal" 
            @close="showModal=false" 
            @save-data="saveData($event)"
        ></category-form>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import CategoryForm from '@/views/admin/categories/CategoryForm.vue'
import AppCard from '@/components/layout/ui/card/AppCard.vue'
import AppCardHeader from '@/components/layout/ui/card/AppCardHeader.vue'
import AppModal from '@/components/layout/ui/modal/AppModal.vue'
import AppPagination from '@/components/layout/ui/AppPagination.vue'
//import { storeToRefs } from 'pinia'
import { useCategoryStore } from '@/stores/categoryStore'

const categoryStore = useCategoryStore()
//const { categories } = storeToRefs(categoryStore)

const _categories = ref([])
const currentPage = ref(1)
const totalCategories = ref(0)
const perPage = ref(10)
const selectedCategory = ref(null)
const activeModal = ref(false)
const showModal = ref(false)
const loading = ref(false)

const searchName = ref('')
const sortOrder = ref('ASC')

const totalPages = computed(() => Math.ceil(totalCategories.value / perPage.value))

// --- Funções ---
const fetchCategories = async () => {
    loading.value = true
    try {
        const filters = {
            page: currentPage.value,
            pageSize: perPage.value,
            search: searchName.value,
            order: JSON.stringify([['updatedAt', sortOrder.value]]), // Ordenar por updatedAt
        }

        const response = await categoryStore.getPaginatedCategories(filters);
        _categories.value = response.data;
        totalCategories.value = response.total;
    } catch (error) {
        console.error('Error fetching categories:', error)
    } finally {
        loading.value = false
    }
}

const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const saveData = async (data) => {
    try {
        if(data.id) {
            await updateData(data);
        } else {
            await createData(data);
        }
        fetchCategories();
    } catch (error) {
        console.error("Error saving data:", error);
    }
} 

const processData = async (data) => {
    try {        
        await categoryStore.deleteCategory(data);
        _categories.value = _categories.value.filter(c => c.id !== data.id);
        activeModal.value = false;
        fetchCategories();
    } catch (error) {
        console.error('Error deleting data:', error);
    }
}

const createData = async (data) => {
    await categoryStore.createCategory(data);
}

const updateData = async (data) => {
    await categoryStore.updateCategory(data);
}

// --- Eventos ---
const onPageChange = (page) => {
    currentPage.value = page
    fetchCategories()
}

const onPerPageChange = () => {
    currentPage.value = 1
    fetchCategories()
}

// Watch com debounce para pesquisa
let searchTimeout = null
watch([searchName, sortOrder], () => {
    currentPage.value = 1
    
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        fetchCategories()
    }, 500)
})

onMounted(() => {
    fetchCategories();
})
</script>

<style scoped>
.table-top {
    margin-bottom: 1rem;
}

.badge {
    font-size: 0.75em;
    padding: 0.35em 0.65em;
}

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