<template>
    <div v-if="show && isEditModalOpen" class="modal-backdrop fade show"></div>
    <div :id="id" 
         class="modal fade" 
         :class="{'show d-block': (show && isEditModalOpen)}" 
         tabindex="-1" 
         aria-labelledby="roleFormLabel" 
         :aria-hidden="!show">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="saveData(editedItem)">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="roleFormLabel">{{ editedItem.id ? 'Editar' : 'Adicionar' }} categoria</h1>
                        <button type="button" @click="closeModal" class="btn-close" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="name" class="col-form-label">Nome:</label>
                            <input v-model="editedItem.name" type="text" class="form-control" id="name" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="parent" class="col-form-label">Categoria Pai:</label>
                            <select v-model="editedItem.parentId" class="form-select" id="parent">
                                <option :value="null">Nenhuma (categoria principal)</option>
                                <option 
                                    v-for="category in availableParentCategories" 
                                    :key="category.id" 
                                    :value="category.id"
                                    :disabled="isCategoryDisabled(category)">
                                    {{ category.name }}
                                </option>
                            </select>
                            <small class="form-text text-muted">
                                Deixe como "Nenhuma" para criar uma categoria principal
                            </small>
                        </div>
                        <div v-if="categoryStore.message">
                            <div class="alert alert-dismissible fade show" :class="`alert-${categoryStore.message.status === 'error'?'danger':'success'}`" role="alert">
                                <p><i class="bi bi-exclamation-circle me-2"></i> {{ categoryStore.message.message || categoryStore.message }}</p>
                                <!-- <button type="button" class="btn-close" @click="categoryStore.clearSuccessMessage()" aria-label="Close"></button> -->
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" @click="closeModal" class="btn btn-secondary">
                            {{ categoryStore.message ? 'Fechar' : 'Cancelar' }}
                        </button>
                        <button v-show="!categoryStore.message" type="submit" class="btn btn-primary" :disabled="isSaving || !editedItem.name">
                            {{ isSaving ? 'Salvando...' : 'Salvar' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore';

const categoryStore = useCategoryStore()
const isEditModalOpen = ref(false)
const editedItem = ref({
    name: '',
    parentId: null
})
const isSaving = ref(false)

const props = defineProps({
    show: Boolean,
    data: Object,
    id: {
        type: String,
        required: true
    },
})

const emit = defineEmits(['close', 'saveData'])

// Filtrar categorias disponíveis como pai
const availableParentCategories = computed(() => {
    if (!categoryStore.categories || !Array.isArray(categoryStore.categories)) return []
    
    return categoryStore.categories.filter(category => {
        return !isCategoryDisabled(category)
    })
})

// Verificar se uma categoria pode ser selecionada como pai
const isCategoryDisabled = (category) => {
    if (editedItem.value.id && category.id === editedItem.value.id) {
        return true
    }
    if (editedItem.value.id && isDescendant(category, editedItem.value.id)) {
        return true
    }    
    return false
}

// Verificar se uma categoria é descendente de outra
const isDescendant = (category, targetId) => {
    if (!targetId || !category.parentId) return false
    
    let currentCategory = category
    const visited = new Set()
    
    while (currentCategory && currentCategory.parentId && !visited.has(currentCategory.id)) {
        visited.add(currentCategory.id)
        
        if (currentCategory.parentId === targetId) {
            return true
        }
        
        const parent = categoryStore.categories.find(cat => cat.id === currentCategory.parentId)
        if (!parent) break
        
        currentCategory = parent
    }
    
    return false
}

watch(() => props.show, async (newVal) => {
    if (newVal) {
        await nextTick()
        openEditModal(props.data)
    } else {
        closeModal()
    }
})

const openEditModal = (item) => {
    editedItem.value = {
        name: '',
        parentId: null
    }
    
    if (item && item.id) {
        editedItem.value = {
            id: item.id,
            name: item.name || '',
            parentId: item.parentId || null
        }
    }
    
    isEditModalOpen.value = true
}

const closeModal = () => {    
    isEditModalOpen.value = false
    categoryStore.clearSuccessMessage()
    isSaving.value = false
    emit('close')
}

const saveData = async (item) => {
    if (!item.name) return
    
    isSaving.value = true
    try {
        const dataToSave = {
            name: item.name,
            parentId: item.parentId || null
        }
        
        if (item.id) {
            dataToSave.id = item.id
        }
        
        emit('saveData', dataToSave)        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
    } catch (error) {
        console.error('Erro ao salvar categoria:', error)
    } finally {
        isSaving.value = false
    }
}

const fetchCategories = async () => {
    await categoryStore.getCategories()
}

onMounted(() => {
    fetchCategories()
})
</script>

<style scoped>
.modal-backdrop {
    z-index: 1040;
}
.modal {
    z-index: 1050;
}
.show {
    transform: none;
    display: block !important;
}
</style>