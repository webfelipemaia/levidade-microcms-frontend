<template>
    <div :id="id" class="modal fade" :class="{show: (show && isEditModalOpen)}" tabindex="-1" aria-labelledby="roleFormLabel" :aria-hidden="show">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="roleFormLabel">{{ editedItem.id ? 'Editar' : 'Adicionar' }} item</h1>
                        <button  type="button" @click="$emit('close')" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div v-if="permissionStore.message">
                                <div
                                    class="alert alert-dismissible fade show"
                                    :class="`alert-${permissionStore.message.status === 'error'?'danger':'success'}`"
                                    role="alert"
                                >
                                    <template v-if="typeof permissionStore.message.message === 'string'">
                                        <p><i class="bi bi-exclamation-circle me-2"></i> {{ permissionStore.message.message }}</p>
                                    </template>

                                    <template v-else>
                                        <p><i class="bi bi-exclamation-circle me-2"></i>Oops! We found some problems with the form.</p>
                                        <ul class="mb-0">
                                            <li v-for="(msg, field) in permissionStore.message.message" :key="field">
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
                        <div class="mb-3">
                            <label for="name" class="col-form-label">Name:</label>
                            <input v-model="editedItem.name" type="text" class="form-control" id="name">
                        </div>
                              
                    </div>
                    <div class="modal-footer">
                        <button type="button" @click="$emit('close')" class="btn btn-secondary" data-bs-dismiss="modal">
                            {{ permissionStore.message ? 'Close' : 'Cancel' }}
                        </button>
                        <button v-show="!permissionStore.message" type="submit" class="btn btn-primary" :disabled="isSaving" @click.prevent.stop="saveData(editedItem)">
                            {{ isSaving ? 'Saving...' : 'Save' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { usePermissionStore } from '@/stores/permissionStore'
import { useAddBackDrop, useRemoveBackDrop } from  '@/components/layout/composables/HandleBackdrop';

const permissionStore = usePermissionStore()
const isEditModalOpen = ref(false)
const editedItem = ref({})
const isSaving = ref(false)

    const props = defineProps({
        show: Boolean,
        data: [Object,Array],
        id: {
            type: String,
            required: true
        },
    })

    const emit = defineEmits(['close', 'saveData'])

    watch(() => props.show, () => {
        openEditModal(props.data.id)
        editedItem.value = props.data
        if(!props.show){
            closeEditModal()
            useRemoveBackDrop()
            permissionStore.clearSuccessMessage()
            isSaving.value = false
        }
    })
    
    const openEditModal = (item) => {
      editedItem.value = { ...item }
      isEditModalOpen.value = true
      useAddBackDrop(props.id)
    }
    
    const closeEditModal = () => {    
      isEditModalOpen.value = false
      useRemoveBackDrop()
      permissionStore.clearSuccessMessage()
      isSaving.value = false
    }

    const saveData = (item) => {
        isSaving.value = true
        try {
           emit('saveData', item)
        } catch (error) {
            console.error('Erro ao salvar permissão:', error);
        } finally {
            isSaving.value = false
        }
        
    }
    
    const fetchPermissions = async () => {
       
       try {
        const permission = await permissionStore.getPermissions();
        return permission
        } catch (error) {
        console.error('Erro ao carregar permissões:', error);
        }
    }

    onMounted(() => {
        fetchPermissions()
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
