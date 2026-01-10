<template>
    <div class="container-fluid">
        <l-card>
            <template #header>
                <l-card-header>
                    <div class="d-flex justify-content-between align-items-center flex-wrap">
                        <span>All users</span>
                        <div class="d-flex flex-wrap gap-2 align-items-center">
                            <button @click="openCreateModal(); selectedUser={}" type="button" class="btn btn-primary ms-5">
                                <i class="bi bi-plus"></i> New
                            </button>
                        </div>
                    </div>
                </l-card-header>
            </template>
    
            <template #body>
                <div class="table-top">
                    <div class="d-flex justify-content-between flex-wrap gap-2">
                        
                        <input v-model="searchQuery" class="form-control w-50" placeholder="Search by name or email" />


                        <div class="d-flex gap-2">
                            <select v-model="sortOrder" class="form-select w-auto">
                                <option value="ASC">Ascending</option>
                                <option value="DESC">Descending</option>
                            </select>
            
                            <select v-model.number="perPage" @change="onPerPageChange" class="form-select w-auto">
                                <option v-for="n in [5,10,20,50]" :key="n" :value="n">{{ n }}</option>
                            </select>
                        </div>
                        
                    </div>
                </div>
                <div class="table-responsive mt-3">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>E-mail</th>
                                <th>Updated at</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="loading">
                                <tr>
                                    <td colspan="5" class="text-center">
                                        <div class="spinner-border" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <template v-else-if="_users && _users.length">
                                <tr v-for="user in _users" :key="user.id">                        
                                    <th class="align-middle" scope="row">{{ user.id }}</th>
                                    <td class="align-middle">{{ user.name }} {{ user.lastname }}</td>
                                    <td class="align-middle">{{ user.email }}</td>
                                    <td class="align-middle">{{ formatDate(user.updatedAt) }}</td>
                                    <td>
                                        <div class="d-flex">
                                            <button @click="openCreateModal(); selectedUser=user;" type="button" class="btn">
                                                <i class="bi bi-pencil"></i>
                                            </button>
                                            <button @click="openCreateModal(); selectedUser=user" type="button" class="btn">
                                                <i class="bi bi-trash3"></i>
                                            </button>
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
                        <tfoot>
                            <tr>
                                <td colspan="5">
                                    <div class="d-flex justify-content-end">
                                        <l-pagination
                                            :total-pages="totalPages"
                                            :current-page="currentPage"
                                            @pagechanged="onPageChange"
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </template>
        </l-card>

        <l-modal 
            :id="'app-modal-01'" 
            :data="selectedUser" 
            :show="activeModal" 
            confirmation 
            text-save="Delete" 
            :show-header="false" 
            @close="activeModal = false" 
            @process-data="processData">
        </l-modal>
        
        <user-form 
            :id="'app-modal-02'" 
            :data="selectedUser" 
            :show="showModal" 
            @close="closeUserForm" 
            @save-data="saveData">
        </user-form>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import UserForm from '@/views/admin/user/UserForm.vue'
import LModal from '@/components/feedback/modal/LModal.vue'
import LCard from '@/components/surfaces/card/LCard.vue'
import LCardHeader from '@/components/surfaces/card/LCardHeader.vue'
import LPagination from '@/components/data/LPagination.vue'

import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import { useRoleStore } from '@/stores/roleStore'

const userStore = useUserStore()
const { message } = storeToRefs(userStore)
const roleStore = useRoleStore()

const _users = ref([])
const currentPage = ref(1)
const totalUsers = ref(0)
const perPage = ref(10)
const selectedUser = ref(null)
const activeModal = ref(false)
const showModal = ref(false)
const loading = ref(false)

const searchQuery = ref('')
const sortOrder = ref('ASC')

const totalPages = computed(() => Math.ceil(totalUsers.value / perPage.value))

// --- Funções ---
const fetchUsers = async () => {
    loading.value = true
    try {
        const filters = {
            page: currentPage.value,
            pageSize: perPage.value,
            search: searchQuery.value,
            order: JSON.stringify([['updatedAt', sortOrder.value]]),
        }

        const response = await userStore.getPaginatedUsers(filters);
        _users.value = response.data;
        totalUsers.value = response.total;
    } catch (error) {
        console.error('Error fetching users:', error)
    } finally {
        loading.value = false
    }
}

const fetchRoles = async () => {
    await roleStore.getRoles();
}

const saveData = async (data) => {
    console.log("saveData: ", data)
    try {
        if(data.id) {
            await updateData(data);
        } else {
            await createData(data); 
        }
        
        fetchUsers();
    } catch (error) {
        console.error("Error saving data:", error);
    }
} 

const processData = async (data) => {
    try {
        await userStore.deleteUser(data);
        _users.value = _users.value.filter(u => u.id !== data.id);
        activeModal.value = false;
        
        fetchUsers();
    } catch (error) {
        console.error('Error deleting data:', error);
    }
}

const createData = async (data) => {
    await userStore.createUser(data);
}

const updateData = async (data) => {
    await userStore.updateUser(data.id, data);
}

const openCreateModal = () => {
  showModal.value = true
  selectedUser.value = {}
}

const closeUserForm = () => {
    showModal.value = false;
    userStore.clearSuccessMessage();
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// --- Eventos ---
const onPageChange = (page) => {
    currentPage.value = page
    fetchUsers()
}

const onPerPageChange = () => {
    currentPage.value = 1
    fetchUsers()
}

// Watch com debounce para pesquisa
let searchTimeout = null
watch([searchQuery, sortOrder], () => {
    currentPage.value = 1
    
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        fetchUsers()
    }, 500)
})

watch(message, (newMessage) => {
    if (newMessage && newMessage.status === 'success') {
        setTimeout(() => {
            userStore.clearSuccessMessage();
        }, 3000)
    }
})

onMounted(() => {
    fetchUsers()
    fetchRoles()
})
</script>

<style scoped>
.table-top {
    margin-bottom: 1rem;
}

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