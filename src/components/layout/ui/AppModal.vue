<template>
    <div class="modal fade" :class="{show: (show && isEditModalOpen)}">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">{{ editedItem.id ? 'Editar' : 'Adicionar' }} item</h1>
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
                        <!--    
                        
                        Next updates:
                        1. Update this message with each new registration/update
                        2. Change to create or edit modal
                        
                        <div v-if="userStore.successMessage">
                            <div class="alert alert-success  alert-dismissible fade show" role="alert">
                                <p><i class="bi bi-exclamation-circle me-2"></i> {{ userStore.successMessage }}</p>
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        </div> -->
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
import { useUserStore } from '@/stores/userStore';
import { ref, defineProps, defineEmits, watch } from 'vue'

const userStore = useUserStore()
    const isEditModalOpen = ref(false)
    const editedItem = ref({})

    const props = defineProps({
        show: Boolean,
        data: [Object,Array]
    })

    const emit = defineEmits(['close', 'saveData'])

    watch(() => props.show, () => {
        openEditModal()
        editedItem.value = props.data
        if(!props.show){
            closeEditModal()
            removeBackDrop()
            userStore.clearSuccessMessage()
        }
    })
    
    const openEditModal = (item) => {
      editedItem.value = { ...item }
      isEditModalOpen.value = true
      addBackDrop()
    }
    
    const closeEditModal = () => {    
      isEditModalOpen.value = false
      removeBackDrop()
    }
    
    const addBackDrop = () => {
        // add styles to body
        const body = document.querySelector('body')
        body.style.overflow = 'hidden'
        body.style.paddingRight = '15px'
    
        // show modal
        const modal = document.querySelector('.modal.fade')
        if(modal) {
            modal.classList.add('show')
            modal.style.display = 'block'
        }
    
        // create a new div
        const parentDiv = document.querySelector('.maincontent.container')
        const newDiv = document.createElement('div')
        newDiv.classList.add('modal-overlay', 'modal-content')
        parentDiv.appendChild(newDiv)
    }
    
    const removeBackDrop = () => {
        document.body.style = ''
        const modal = document.querySelector('.modal.fade')
        modal.style =  ''
        modal.classList.remove('show')
        
        const parentDiv = document.querySelector('.maincontent.container')
        const childDiv = parentDiv.querySelector('.modal-overlay.modal-content')
        if (childDiv) {
          parentDiv.removeChild(childDiv)
        }

    }

    const saveData = (item) => {
            if(item.id) {
                emit('saveData', item)
            } else{
                emit('saveData', item)
            }
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