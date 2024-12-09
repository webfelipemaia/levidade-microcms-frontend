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
                        <div class="mb-3" v-if="editedItem.Roles">
                            <ul class="list-group list-group-flush" v-if="editedItem.Roles">
                                <li class="list-group-item" v-for="role in editedItem.Roles" :key="role.id">
                                    {{role.name }}
                                </li>
                            </ul>
                        </div>

                        <div v-if="editedItem.id">
                            <p>Roles:</p>
                            <div class="mb-3" v-for="r in roles" :key="r.i">
                                <div class="form-check">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        :value="r.id"
                                        :checked="getRoles(editedItem)
                                                    .some(role => role.name === r.name)"
                                        @change="toggleRole(r,
                                                                    getRoles(editedItem)
                                                                        .some(role => role.name === r.name)
                                                                        ? 'unchecked' : 'checked' )"
                                    />
                                    <label class="form-check-label" :for="'flexCheck' + r.id">
                                        {{ r.name }}
                                    </label>
                                </div>
                            </div>
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
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore';
import { useRoleStore } from '@/stores/roleStore';
import { useAddBackDrop, useRemoveBackDrop } from '../../components/layout/composebles/HandleBackdrop';

const userStore = useUserStore()
const roleStore = useRoleStore()
const { roles, usersRoles } =  storeToRefs(roleStore)
//const { users } =  storeToRefs(userStore)

const isEditModalOpen = ref(false)
const editedItem = ref({})
const selectedRoles = ref([])

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
        item.roles = selectedRoles.value
        emit('saveData', item)
        
    }

    // Given a list of roles, checks if a role contains registered roles and returns true.
    const getRoles = (data) => {
        var checked = []
        usersRoles.value.forEach(d => {
            if(d.name === data.name) {
                let roles = d.Roles
                roles.forEach(p => {
                    checked.push(p)
                })
            }
        })
        return checked
    }
    
    // Check or uncheck a role to be saved
    // is checked, then enter the data
    // is not checked, then delete the data
    const toggleRole = (data,isChecked) => {
        const index = selectedRoles.value.indexOf(data)
        if (index !== -1 && selectedRoles.value.length === 1) {
            selectedRoles.value.length = 0
        } else if (index !== -1) {
            selectedRoles.value.splice(index,1)
        } else {
            selectedRoles.value.push({data,isChecked})
        }        
    }
    
    // Get the roles
    const fetchRoles = async () => {
       await roleStore.getRoles()
    }

    // Gets the roles 
    const fetchUsersRoles = async () => {
       await roleStore.getUsersRoles()
    }    

    onMounted(() => {
        fetchRoles()
        fetchUsersRoles()
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