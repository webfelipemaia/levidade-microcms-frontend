<template>
    <div class="container-fluid">
        <app-card>
            <template #header>
                <app-card-header>
                    <div class="d-flex justify-content-between align-items-center">
                        <span>Gerenciador da ACL</span>
                    </div>
                </app-card-header>
            </template>
            <template #body>
                <!-- Loading State -->
                <div v-if="isLoading" class="text-center py-4">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>

                <!-- Matriz ACL -->
                <div v-else class="mb-4">
                    <h4 class="mb-3">Matriz de Controle de Acesso (ACL)</h4>
                    <div class="table-responsive">
                        <table class="table table-bordered table-sm acl-matrix">
                            <thead>
                                <tr>
                                    <th>Role / Permission</th>
                                    <th v-for="permission in permissions" :key="permission.id" class="text-center">
                                        {{ permission.name }}<br>
                                        <small class="text-muted">ID: {{ permission.id }}</small>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="role in roles" :key="role.id">
                                    <td class="fw-bold">
                                        {{ role.name }}<br>
                                        <small class="text-muted">ID: {{ role.id }}</small>
                                    </td>
                                    <td v-for="permission in permissions" :key="permission.id" class="text-center">
                                        <span v-if="hasPermission(role.id, permission.id)" class="text-success">
                                            <i class="bi bi-check-circle-fill"></i>
                                        </span>
                                        <span v-else class="text-secondary">
                                            <i class="bi bi-x-circle-fill"></i>
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Tabela de Roles -->
                <div v-if="!isLoading" class="table-responsive">
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
                        <tbody>
                            <template v-if="roles && roles.length">
                                <tr v-for="role in roles" :key="role.id">                        
                                    <th class="align-middle" scope="row">{{ role.id }}</th>
                                    <td class="align-middle">{{ role.name }}</td>
                                    <td class="align-middle">
                                        <div v-if="getRolePermissions(role.id).length">
                                            <span v-for="permission in getRolePermissions(role.id)" 
                                                  :key="permission.id" 
                                                  class="badge bg-secondary me-1 mb-1">
                                                {{ permission.name }}
                                            </span>
                                        </div>
                                        <span v-else class="text-muted">No permissions</span>
                                    </td>
                                    <td class="align-middle">{{ formatDate(role.updatedAt) }}</td>
                                    <td>
                                        <div class="d-flex">
                                            <div class="p-2 flex-fill">
                                                <button @click="goToRole(role.id)"
                                                        type="button" 
                                                        class="btn btn-sm btn-outline-primary">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                            </div>
                                            <div class="p-2 flex-fill">
                                                <button @click="[activeModal=true,selectedRole=role]" 
                                                        type="button" 
                                                        class="btn btn-sm btn-outline-danger">
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

    <app-modal :id="'app-modal-01'" 
               :data="selectedRole" 
               :show="activeModal" 
               confirmation 
               text-save="Delete" 
               :show-header="false" 
               @close="activeModal=false" 
               @process-data="processData($event)">
    </app-modal>
    
    <role-form :id="'app-modal-02'" 
               :data="selectedRole" 
               :show="showModal" 
               @close="showModal=false" 
               @save-data="saveData($event)">
    </role-form>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import RoleForm from '../../components/roles/RoleForm'
import AppCard from '../layout/ui/card/AppCard'
import AppModal from '../layout/ui/modal/AppModal'
import AppCardHeader from '../layout/ui/card/AppCardHeader'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useRoleStore } from '../../stores/roleStore'
import { usePermissionStore } from '../../stores/permissionStore'

const roleStore = useRoleStore()
const permissionStore = usePermissionStore()

const { roles } = storeToRefs(roleStore)
const { permissions, rolesPermissions } = storeToRefs(permissionStore)

const showModal = ref(false)
const selectedRole = ref({})
const activeModal = ref(false)
const isLoading = ref(false)

const router = useRouter()

// Corrigindo: rolesPermissions pode ser um objeto com propriedade data
const normalizedRolesPermissions = computed(() => {
    if (!rolesPermissions.value) return []
    
    // Se rolesPermissions.value for um array, retorna diretamente
    if (Array.isArray(rolesPermissions.value)) {
        return rolesPermissions.value
    }
    
    // Se for um objeto com propriedade data (resposta da API)
    if (rolesPermissions.value.data && Array.isArray(rolesPermissions.value.data)) {
        return rolesPermissions.value.data
    }
    
    // Se for um objeto com propriedade status e data
    if (rolesPermissions.value.status === 'success' && Array.isArray(rolesPermissions.value.data)) {
        return rolesPermissions.value.data
    }
    
    console.warn('Formato inesperado de rolesPermissions:', rolesPermissions.value)
    return []
})

// Matriz ACL computada
const aclMatrix = computed(() => {
    const matrix = {}
    
    if (!roles.value.length || !permissions.value.length) return matrix
    
    // Inicializa a matriz
    roles.value.forEach(role => {
        matrix[role.id] = {}
        permissions.value.forEach(permission => {
            matrix[role.id][permission.id] = false
        })
    })
    
    // Preenche a matriz com as permissões existentes
    const rpData = normalizedRolesPermissions.value
    if (rpData && rpData.length) {
        rpData.forEach(rp => {
            if (matrix[rp.roleId] && matrix[rp.roleId][rp.permissionId] !== undefined) {
                matrix[rp.roleId][rp.permissionId] = true
            }
        })
    }
    
    return matrix
})

// Método para verificar se uma role tem uma permissão
const hasPermission = (roleId, permissionId) => {
    return aclMatrix.value[roleId] && aclMatrix.value[roleId][permissionId] === true
}

// Método para obter as permissões de uma role
const getRolePermissions = (roleId) => {
    if (!aclMatrix.value[roleId] || !permissions.value.length) return []
    
    return permissions.value.filter(permission => 
        aclMatrix.value[roleId][permission.id] === true
    )
}

// Formatar data
const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR')
}

const fetchData = async () => {
    isLoading.value = true
    try {
        await Promise.all([
            roleStore.getRoles(),
            permissionStore.getPermissions(),
            permissionStore.getRolesPermissions()
        ])
    } catch (error) {
        console.error('Error fetching data:', error)
    } finally {
        isLoading.value = false
    }
}

const saveData = async (data) => {
    if (data.id) {
        await updateData(data)
    } else {
        await createData(data)  
    }
    await fetchData()
} 

const processData = async (data) => {
    await roleStore.deleteRole(data)
    await fetchData()
    activeModal.value = false
}

const createData = async (data) => {
    await roleStore.createRole(data)
}

const updateData = async (data) => {
    await roleStore.updateRole(data)
}

function goToRole(id) {
    router.push({ name: "roles.edit", params: { id } })
}

onMounted(() => {
    fetchData()
})
</script>

<style scoped>
.acl-matrix {
    font-size: 0.85rem;
}

.acl-matrix th, .acl-matrix td {
    vertical-align: middle;
}

.acl-matrix th {
    background-color: #f8f9fa;
    font-weight: 600;
}

.badge {
    font-size: 0.75rem;
}

.table-responsive {
    margin-bottom: 2rem;
}

.spinner-border {
    width: 3rem;
    height: 3rem;
}
</style>