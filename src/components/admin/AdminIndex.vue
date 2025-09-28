<template>
    <div class="container-fluid">
        <app-card>
            <template #header>
                <app-card-header>
                    <div class="d-flex justify-content-between">
                        <span>All users</span>
                        <button @click="[showModal=true, selectedUser={}]" type="button" class="btn btn-primary">
                            <i class="bi bi-plus"></i> New
                        </button>
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
                                <th scope="col">E-mail</th>
                                <th scope="col">Updated</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="users && users.length">
                                <tr v-for="user in users" :key="user.id">                        
                                    <th class="align-middle" scope="row">{{ user.id }}</th>
                                    <td class="align-middle">{{ user.name }} {{ user.lastname }}</td>
                                    <td class="align-middle">{{ user.email }}</td>
                                    <td class="align-middle">{{ formatDate(user.updatedAt) }}</td>
                                    <td>
                                        <div class="d-flex">
                                            <div class="p-2 flex-fill">
                                                <button @click="[showModal=true, selectedUser=user]" type="button" class="btn">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                            </div>
                                            <div class="p-2 flex-fill">
                                                <button @click="[activeModal=true, selectedUser=user]" type="button" class="btn">
                                                    <i class="bi bi-trash3"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <template v-else>
                                <tr>
                                    <td colspan="5" class="text-center">No data</td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </template>
        </app-card>
    </div>

    <app-modal 
        :id="'app-modal-01'" 
        :data="selectedUser" 
        :show="activeModal" 
        confirmation 
        text-save="Delete" 
        :show-header="false" 
        @close="activeModal = false" 
        @process-data="processData">
    </app-modal>
    
    <user-form 
        :id="'app-modal-02'" 
        :data="selectedUser" 
        :show="showModal" 
        @close="closeUserForm" 
        @save-data="saveData">
    </user-form>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import UserForm from '../user/UserForm'
import AppCard from '../layout/ui/card/AppCard'
import AppModal from '../layout/ui/modal/AppModal'
import AppCardHeader from '../layout/ui/card/AppCardHeader'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../../stores/userStore'
import { useRoleStore } from '../../stores/roleStore'

const userStore = useUserStore()
const { users, message } = storeToRefs(userStore)
const roleStore = useRoleStore()

const showModal = ref(false)
const selectedUser = ref({})
const activeModal = ref(false)

const fetchUsers = async () => {
    await userStore.getUsers()
}

const fetchRoles = async () => {
    await roleStore.getRoles()
}

const saveData = async (data) => {
    if(data.id) {
        await updateData(data)
    } else {
        await createData(data)  
    }
    
    if (!userStore.message || userStore.message.status === 'error') {
        showModal.value = false
    }
} 

const processData = async (data) => {
    await userStore.deleteUser(data)
    
    if (!userStore.message || userStore.message.status === 'error') {
        activeModal.value = false
    }
}

const createData = async (data) => {
    await userStore.createUser(data)
}

const updateData = async (data) => {
    await userStore.updateUser(data.id, data)
}

const closeUserForm = () => {
    showModal.value = false
    userStore.clearSuccessMessage()
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString()
}

watch(message, (newMessage) => {
    if (newMessage && newMessage.status === 'success') {
        setTimeout(() => {
            userStore.clearSuccessMessage()
        }, 3000)
    }
})

onMounted(() => {
    fetchUsers()
    fetchRoles()
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