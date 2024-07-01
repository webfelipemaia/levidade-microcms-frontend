<template>
    <div :id="id" class="modal fade" :class="{show: (show && isEditModalOpen)}" tabindex="-1" aria-labelledby="userFormLabel" :aria-hidden="show">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="userFormLabel">{{ editedItem.id ? 'Editar' : 'Adicionar' }} item</h1>
                        <button  type="button" @click="$emit('close')" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="name" class="col-form-label">Name:</label>
                            <input v-model="editedItem.name" type="text" class="form-control" id="name">
                        </div>
                        <div class="mb-3">
                            <label for="lastname" class="col-form-label">Last Name:</label>
                            <input v-model="editedItem.lastname" type="text" class="form-control" id="lastname">
                        </div>
                        <div class="mb-3">
                            <label for="email" class="col-form-label">E-mail:</label>
                            <input v-model="editedItem.email" type="text" class="form-control" id="email">
                        </div>

                        <div v-if="!editedItem.id" class="mb-3">
                            <label for="password" class="col-form-label">Password:</label>
                            <input v-model="editedItem.password" type="password" class="form-control" id="password">
                        </div>

                        <div v-if="!editedItem.id" class="mb-3">
                            <label for="confirmPassword" class="col-form-label">Confirm Password:</label>
                            <input v-model="editedItem.confirmPassword" type="password" class="form-control" id="confirmPassword">
                        </div>
                        
                        <div v-if="userStore.message">
                            <div class="alert alert-dismissible fade show" :class="`alert-${userStore.message.status === 'error'?'danger':'success'}`" role="alert">
                                <p><i class="bi bi-exclamation-circle me-2"></i> {{ userStore.message.message }}</p>
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" @click="$emit('close')" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary" @click.prevent.stop="saveData(editedItem)">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import { useUserStore } from '@/stores/userStore';
import { useAddBackDrop, useRemoveBackDrop } from '../composebles/HandleBackdrop';

const userStore = useUserStore()
    const isEditModalOpen = ref(false)
    const editedItem = ref({})

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
        openEditModal()
        editedItem.value = props.data
        if(!props.show){
            closeEditModal()
            useRemoveBackDrop()
            userStore.clearSuccessMessage()
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
      userStore.clearSuccessMessage()
    }

    const saveData = (item) => {
        emit('saveData', item)
        
    }
    
    
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