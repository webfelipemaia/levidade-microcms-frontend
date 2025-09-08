<template>
    <div class="container-fluid">
        <app-card>
            <template #header>
                <app-card-header>
                    <div class="d-flex justify-content-between">
                        <span>All categories</span>
                        <button @click="[showModal=true,selectedCategory={}]" type="button" class="btn btn-primary"><i class="bi bi-plus"></i> New</button>
                    </div>
                </app-card-header>
            </template>
            <template #body>
                <div class="table-responsive">
                    <table class="table table-striped">
                                <thead>
                                    <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Updated</th>
                                    <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                        <template v-if="categories && categories.length">
                                            <tr v-for="category in categories" :key="category.id">            
                                                <th class="align-middle" scope="row">{{ category.id }}</th>
                                                <td class="align-middle"> 
                                                    <span v-if="category.parentId"><i class="bi bi-arrow-90deg-up"></i></span> 
                                                    {{ category.name }}
                                                </td>
                                                <td class="align-middle">{{ category.updatedAt }}</td>
                                                <td>
                                                    <div class="d-flex">
                                                        <div class="p-2 flex-fill">
                                                            <button @click="[showModal=true,selectedCategory=category]" type="button" class="btn">
                                                                <i class="bi bi-pencil"></i>
                                                            </button>
                                                        </div>
                                                        <div class="p-2 flex-fill">
                                                            <button @click="[activeModal=true,selectedCategory=category]" type="button" class="btn">
                                                                <i class="bi bi-trash3"></i>
                                                            </button>
                                                        </div>
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

                    </table>
                </div>
            </template>
        </app-card>
    </div>


    <app-modal :id="'app-modal-01'" 
        :data="selectedCategory" 
        :show="activeModal" 
        confirmation 
        text-save="Delete" 
        :show-header="false" 
        @close="activeModal=false"
         @process-data="processData($event)">
    </app-modal>
    <category-form 
        :id="'app-modal-02'" 
        :data="selectedCategory" 
        :show="showModal" 
        @close="showModal=false" 
        @save-data="saveData($event)">
    </category-form>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import CategoryForm from '../categories/CategoryForm'
import AppCard from '../layout/ui/card/AppCard'
import AppCardHeader from '../layout/ui/card/AppCardHeader'
import AppModal from '../layout/ui/modal/AppModal'
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '../../stores/categoryStore'

const categoryStore = useCategoryStore()
const { categories } =  storeToRefs(categoryStore)
const showModal = ref(false)
const selectedCategory = ref([])
const activeModal = ref(false)

const fetchCategories = async () => {
   await categoryStore.getCategories()
}

const saveData = (data) => {
    if(data.id) {
        updateData(data)
    } else {
        createData(data)
    }
    fetchCategories()
} 

const processData = (data) => {
    categoryStore.deleteCategory(data)
    categories.value = categories.value.filter(c => c.id !== data.id);
    activeModal.value=false
}

const createData = (data) => {
    categoryStore.createCategory(data)
}

const updateData = (data) => {
    categoryStore.updateCategory(data)
    fetchCategories()
}

onMounted(() => {
    fetchCategories()
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