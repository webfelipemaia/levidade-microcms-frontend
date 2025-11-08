<template>
    <div class="container-fluid">
        <app-card>
            <template #header>
                <app-card-header>
                    <div class="d-flex justify-content-between align-items-center flex-wrap">
                        <span>All roles</span>
                        <div class="d-flex flex-wrap gap-2 align-items-center">
                            <button @click="[showModal=true,selectedRole={}]" type="button" class="btn btn-primary ms-5">
                                <i class="bi bi-plus"></i> New
                            </button>
                        </div>
                    </div>
                </app-card-header>
            </template>
    
            <template #body>
                <div class="table-top">
                    <div class="d-flex justify-content-between flex-wrap gap-2">
                        
                        <input v-model="searchName" class="form-control w-50" placeholder="Search by name" />

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
                                <th>Updated at</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="loading">
                                <tr>
                                    <td colspan="4" class="text-center">
                                        <div class="spinner-border" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <template v-else-if="_roles && _roles.length">
                                <tr v-for="role in _roles" :key="role.id">                        
                                    <th class="align-middle" scope="row">{{ role.id }}</th>
                                    <td class="align-middle">{{ role.name }}</td>
                                    <td class="align-middle">{{ formatDate(role.updatedAt) }}</td>
                                    <td>
                                        <div class="d-flex">
                                            <button @click="[showModal=true,selectedRole=role]" type="button" class="btn">
                                                <i class="bi bi-pencil"></i>
                                            </button>
                                            <button @click="[activeModal=true,selectedRole=role]" type="button" class="btn">
                                                <i class="bi bi-trash3"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <template v-else>
                                <tr>
                                    <td colspan="4" class="text-center">No data</td>
                                </tr>
                            </template>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="4">
                                    <div class="d-flex justify-content-end">
                                        <app-pagination
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
        </app-card>

        <app-modal 
            :id="'app-modal-01'" 
            :data="selectedRole" 
            :show="activeModal" 
            confirmation 
            text-save="Delete" 
            :show-header="false" 
            @close="activeModal=false" 
            @process-data="processData($event)">
        </app-modal>
        
        <role-form 
            :id="'app-modal-02'" 
            :data="selectedRole" 
            :show="showModal" 
            @close="showModal=false" 
            @save-data="saveData($event)">
        </role-form>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import RoleForm from '@/views/admin/roles/RoleForm.vue'
import AppCard from '@/components/layout/ui/card/AppCard.vue'
import AppModal from '@/components/layout/ui/modal/AppModal.vue'
import AppCardHeader from '@/components/layout/ui/card/AppCardHeader.vue'
import AppPagination from '@/components/layout/ui/AppPagination.vue'
//import { storeToRefs } from 'pinia'
import { useRoleStore } from '@/stores/roleStore'

const roleStore = useRoleStore()
//const { roles } = storeToRefs(roleStore)

const _roles = ref([])
const currentPage = ref(1)
const totalRoles = ref(0)
const perPage = ref(10)
const selectedRole = ref(null)
const activeModal = ref(false)
const showModal = ref(false)
const loading = ref(false)

const searchName = ref('')
const sortOrder = ref('ASC')

const totalPages = computed(() => Math.ceil(totalRoles.value / perPage.value))

// --- Funções ---
const fetchRoles = async () => {
    loading.value = true
    try {
        const filters = {
            page: currentPage.value,
            pageSize: perPage.value,
            search: searchName.value,
            // Ordenar por updatedAt ou id conforme necessário
            order: JSON.stringify([['updatedAt', sortOrder.value]]),
        }

        const response = await roleStore.getPaginatedRoles(filters);
        _roles.value = response.data;
        totalRoles.value = response.total;
    } catch (error) {
        console.error('Error fetching roles:', error)
    } finally {
        loading.value = false
    }
}

const saveData = async (data) => {
    try {
        if(data.id) {
            await updateData(data);
        } else {
            await createData(data);
        }
        fetchRoles();
    } catch (error) {
        console.error("Error saving data:", error);
    }
} 

const processData = async (data) => {
    try {            
        await roleStore.deleteRole(data);
        _roles.value = _roles.value.filter(r => r.id !== data.id);
        activeModal.value = false;
        fetchRoles();
    } catch (error) {
        console.error("Error deleting data:", error);
    }
}

const createData = async (data) => {
    await roleStore.createRole(data);
}

const updateData = async (data) => {
    await roleStore.updateRole(data);
}

const formatDate = (dateString) => {
    if (!dateString) return '-'
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
    fetchRoles()
}

const onPerPageChange = () => {
    currentPage.value = 1
    fetchRoles()
}

// Watch com debounce para pesquisa
let searchTimeout = null
watch([searchName, sortOrder], () => {
    currentPage.value = 1
    
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        fetchRoles()
    }, 500)
})

onMounted(() => {
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