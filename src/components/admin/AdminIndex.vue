<template>
    <div class="container-fluid">
        <app-alert type="success">Success! Lorem ipsum dolor sit amet</app-alert>        
        <app-alert type="danger">Danger! Lorem ipsum dolor sit amet</app-alert>
        <app-alert type="warning">Warning! Lorem ipsum dolor sit amet</app-alert>
        <app-alert type="info">Info! Lorem ipsum dolor sit amet</app-alert>
        <app-alert type="light" no-icon>Light! Lorem ipsum dolor sit amet</app-alert>
        <app-alert type="dark" no-icon>Dark! Lorem ipsum dolor sit amet</app-alert>
        <app-alert type="primary">Primary! Lorem ipsum dolor sit amet</app-alert>
        <app-alert type="secondary" :no-icon="true">Secondary! Lorem ipsum dolor sit amet</app-alert>
        <app-card>
            <template #header>
                <app-card-header>
                    <div class="d-flex justify-content-between">
                        <span>All users</span>
                        <button @click="[showModal=true,selectedUser={}]" type="button" class="btn btn-primary"><i class="bi bi-plus"></i> New</button>
                    </div>
                </app-card-header>
            </template>
            <template #body>
                <div class="table-responsive">
                    <table class="table table-striped">
                                <thead>
                                    <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">E-mail</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Updated</th>
                                    <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody v-if="users">
                                    <tr v-for="user in users" :key="user.id">                        
                                    <th class="align-middle" scope="row">{{ user.id }}</th>
                                    <td class="align-middle">{{ user.name }} {{ user.lastname }}</td>
                                    <td class="align-middle">{{ user.email }}</td>
                                    <td class="align-middle">{{ user.updated_at }}</td>
                                    <td>
                                        <div class="d-flex">
                                            <div class="p-2 flex-fill"><button @click="[showModal=true,selectedUser=user]" type="button" class="btn"><i class="bi bi-pencil"></i></button></div>
                                            <div class="p-2 flex-fill"><button type="button" class="btn"><i class="bi bi-trash3"></i></button></div>
                                        </div>
                                    </td>
                                    </tr>
                                </tbody>

                                <tbody v-else>
                                    <p>No data</p>
                                </tbody>
                    </table>
                    {{ userStore.message }}
                </div>
            </template>
        </app-card>
    </div>
    <app-modal :data="selectedUser" :show="showModal" @close="showModal=false" @save-data="saveData($event)"></app-modal>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppModal from '../layout/ui/AppModal'
import AppAlert from '../layout/ui/AppAlert'
import AppCard from '../layout/ui/card/AppCard'
import AppCardHeader from '../layout/ui/card/AppCardHeader'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../../stores/userStore'

const userStore = useUserStore()
const { users } =  storeToRefs(userStore)
const showModal = ref(false)
const selectedUser = ref([])

const fetchUsers = async () => {
   await userStore.getUsers()
}

const saveData = (data) => {
    if(data.id) {
        updateData(data)
    } else {
        createData(data)  
    }
} 

const createData = (data) => {
    userStore.createUser(data)
}

const updateData = (data) => {
    userStore.updateUser(data.id,data)
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