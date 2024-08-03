<template>
    <div class="container-fluid">
        <app-card>
            <template #header>
                <app-card-header>
                    <div class="d-flex justify-content-between">
                        <span>Manage permissions</span>
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
                                    <th scope="col">Name</th>
                                    <th scope="col">Permissions</th>
                                    <th scope="col">Updated</th>
                                    <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody v-if="roles">
                                    <tr v-for="role in roles" :key="role.id">                        
                                    <th class="align-middle" scope="row">{{ role.id }}</th>
                                    <td class="align-middle">{{ role.name }}</td>
                                    <td class="align-middle">0</td>
                                    <td class="align-middle">{{ role.updatedAt }}</td>
                                    <td>
                                        <div class="d-flex">
                                            <div class="p-2 flex-fill"><button @click="[showModal=true,selectedUser=user]" type="button" class="btn"><i class="bi bi-pencil"></i></button></div>
                                            <div class="p-2 flex-fill"><button @click="[activeModal=true,selectedUser=user]" type="button" class="btn"><i class="bi bi-trash3"></i></button></div>
                                        </div>
                                    </td>
                                    </tr>
                                </tbody>

                                <tbody v-else>
                                    <p>No data</p>
                                </tbody>
                    </table>
                </div>       
            </template>
        </app-card>
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import AppCard from '../layout/ui/card/AppCard'
import AppCardHeader from '../layout/ui/card/AppCardHeader'
import { useUserStore } from '../../stores/userStore'
import { useRoleStore } from '../../stores/roleStore'
import { usePermissionStore } from '../../stores/permissionStore'

const userStore = useUserStore()
const roleStore = useRoleStore()
const { roles } =  storeToRefs(roleStore)
const permissionStore = usePermissionStore()
const showModal = ref(false)
const selectedUser = ref([])

const fetchUsers = async () => {
   await userStore.getUsers()
}

const fetchRoles = async () => {
   await roleStore.getRoles()
}

const fetchPermissions = async () => {
   await permissionStore.getPermissions()
}

onMounted(() => {
    fetchUsers()
    fetchRoles()
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