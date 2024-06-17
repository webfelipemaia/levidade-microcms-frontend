<template>
        <div class="container-fluid">
                <div class="card card-fluid">
                    <div class="card-header">
                        Featured
                    </div>
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
                                            <div class="p-2 flex-fill"><button type="button" class="btn" data-bs-toggle="button"><i class="bi bi-pencil"></i></button></div>
                                            <div class="p-2 flex-fill"><button type="button" class="btn" data-bs-toggle="button"><i class="bi bi-trash3"></i></button></div>
                                        </div>
                                    </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                </div>
        </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
//import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
//const authStore = useAuthStore()
const userStore = useUserStore()

//const { user } = storeToRefs(authStore);
const { users } =  storeToRefs(userStore);

const fetchUsers = async () => {
    await userStore.getUsers();
};

onMounted(() => {
    fetchUsers();
    
});
</script>