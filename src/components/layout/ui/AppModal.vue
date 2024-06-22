<template>
    <div class="modal fade" :class="{show: (show && isEditModalOpen)}">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="saveEdit">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Edit item</h1>
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
                    </div>
                    <div class="modal-footer">
                        <button type="button" @click="$emit('close')" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" @click="$emit('close')">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, defineProps, watch } from 'vue'
    //import { storeToRefs } from 'pinia'
    //import { useAuthStore } from '../../../stores/authStore'
    import { useUserStore } from '../../../stores/userStore'
    
    //const authStore = useAuthStore()
    const userStore = useUserStore()
    //const { users } =  storeToRefs(userStore)
    const isEditModalOpen = ref(false)
    const editedItem = ref({})

    const props = defineProps({
        show: Boolean,
        data: [Object,Array]
    })

    watch(() => props.show, () => {
        openEditModal()
        editedItem.value = props.data
        if(!props.show){
            closeEditModal()
            removeBackDrop()
        }
    })
    
    const fetchUsers = async () => {
       await userStore.getUsers()
    }
    
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
    
    const saveEdit = () => {
        userStore.updateUser(editedItem.value.id,editedItem.value)
        isEditModalOpen.value = false
        closeEditModal()    
    }
    
    onMounted(() => {
        fetchUsers()
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