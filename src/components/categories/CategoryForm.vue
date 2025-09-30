<template>
    <div :id="id" class="modal fade" :class="{show: (show && isEditModalOpen)}" tabindex="-1" aria-labelledby="roleFormLabel" :aria-hidden="show">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="saveData(editedItem)">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="roleFormLabel">{{ editedItem.id ? 'Editar' : 'Adicionar' }} categoria</h1>
                        <button type="button" @click="closeModal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                                <p><i class="bi bi-exclamation-circle me-2"></i> {{ categoryStore.message.message }}</p>
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" @click="closeModal" class="btn btn-secondary" data-bs-dismiss="modal">
                            {{ isSaving ? 'Fechar' : 'Cancelar' }}
                        </button>
                        <button type="submit" class="btn btn-primary" :disabled="isSaving || !editedItem.name">
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
import { useAddBackDrop, useRemoveBackDrop } from  '../layout/composables/HandleBackdrop';

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

// Computed para filtrar categorias disponíveis como pai
const availableParentCategories = computed(() => {
    if (!categoryStore.categories || !Array.isArray(categoryStore.categories)) return []
    
    return categoryStore.categories.filter(category => {
        return !isCategoryDisabled(category)
    })
})

// Função para verificar se uma categoria pode ser selecionada como pai
const isCategoryDisabled = (category) => {
    // Não permitir que uma categoria seja pai de si mesma
    if (editedItem.value.id && category.id === editedItem.value.id) {
        return true
    }
    
    // Não permitir loops hierárquicos
    if (editedItem.value.id && isDescendant(category, editedItem.value.id)) {
        return true
    }
    
    return false
}

// Função para verificar se uma categoria é descendente de outra
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
    useAddBackDrop(props.id)
}

const closeModal = () => {    
    isEditModalOpen.value = false
    useRemoveBackDrop()
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
        await new Promise(resolve => setTimeout(resolve, 500))
        
    } catch (error) {
        console.error('Erro ao salvar categoria:', error)
        isSaving.value = false
    }
}

// Buscar categorias
const fetchCategories = async () => {
    await categoryStore.getCategories()
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
    display: block;
}
</style>