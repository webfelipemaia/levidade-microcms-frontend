<template>
    <div class="container-fluid">
        <app-card>
            <template #header>
                <app-card-header>
                    <div class="d-flex justify-content-between">
                        <span>New articles</span>
                        <router-link :to="{name: 'admin.acl'}" class="btn btn-primary"> Back</router-link>
                    </div>
                </app-card-header>
            </template>
            <template #body>
                <div class="mb-6">
                    <h4>Permissões para {{ roleName }}</h4>
                    <p>Permite especificar quais grupos de usuários têm quais permissões. De modo simples, a atribuição de permissões 
                        serve para definir quem (usuário, grupo ou papel) pode fazer o quê (ação, recurso, operação) dentro do sistema.</p>
                </div>

                <div v-if="message" 
                    :class="['p-4 rounded mb-4', 
                            message.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                    {{ message.message }}
                </div>

                <div v-if="permissions.length > 0">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Permissões</label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto p-2 border border-gray-300 rounded">
                        <div 
                            v-for="(permission, index) in permissions" 
                            :key="permission.id" 
                            class="flex items-center list-group-item"
                            :class="index % 2 === 0 ? '' : 'list-group-item-secondary'"
                        >
                            <input 
                                type="checkbox" 
                                :id="`permission-${permission.id}`"
                                :checked="isPermissionSelected(permission)"
                                @change="togglePermission(permission)"
                                class="ms-2"
                            > 
                            <label 
                                :for="`permission-${permission.id}`"
                                class="ms-2 w-full py-2"
                            >
                                {{ permission.name }}
                            </label>
                        </div>
                    </div>
                    
                    <div class="m-2 text-sm">
                        {{ selectedPermissionsCount }} permissão(ões) selecionada(s)
                    </div>

                    <div class="card-footer">
                        <div class="d-flex justify-content-between">
                            <button 
                                @click="goBack"
                                class="btn btn-secondary">
                                Voltar para Edição
                            </button>
                            <button 
                                @click="savePermissions"
                                :disabled="loading"
                                class="btn btn-primary">
                                <span v-if="loading">Salvando...</span>
                                <span v-else>Salvar Permissões</span>
                            </button>
                        </div>
                    </div>
                </div>
            </template>
        </app-card>
    </div>    
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AppCard from '@/components/layout/ui/card/AppCard.vue'
import AppCardHeader from '@/components/layout/ui/card/AppCardHeader.vue'
import { useRoute, useRouter } from 'vue-router'
import { useRoleStore } from '@/stores/roleStore'
import { usePermissionStore } from '@/stores/permissionStore'
import api from '@/services/api';

const route = useRoute()
const router = useRouter()
const roleStore = useRoleStore()
const permissionStore = usePermissionStore()

const id = route.params.id
const roleName = ref('')
const permissions = ref([])
const selectedPermissions = ref([])
const loading = ref(false)
const message = ref(null)

const selectedPermissionsCount = computed(() => selectedPermissions.value.length)

const isPermissionSelected = (permission) => {
    return selectedPermissions.value.includes(permission.id)
}

const togglePermission = (permission) => {
    const index = selectedPermissions.value.indexOf(permission.id)
    if (index > -1) {
        selectedPermissions.value.splice(index, 1)
    } else {
        selectedPermissions.value.push(permission.id)
    }
}

const fetchData = async () => {
    loading.value = true
    try {
        // Carregar role para obter o nome
        await roleStore.getRoles()
        const role = roleStore.roles.find(r => r.id === parseInt(id))
        roleName.value = role?.name || ''

        // Carregar permissões disponíveis
        await permissionStore.getPermissions()
        permissions.value = permissionStore.permissions

        // Carregar permissões atuais do role - CORREÇÃO AQUI
        await loadRolePermissions()

    } catch (error) {
        console.error('Erro ao carregar dados:', error)
        message.value = { status: 'error', message: 'Erro ao carregar dados' }
    } finally {
        loading.value = false
    }
}

// Função corrigida para carregar permissões do role
const loadRolePermissions = async () => {
    try {
        // Primeiro, carrega as roles permissions se ainda não estiverem carregadas
        if (!permissionStore.rolesPermissions || !permissionStore.rolesPermissions.data) {
            await permissionStore.getRolesPermissions()
        }

        // Acessa o array correto: permissionStore.rolesPermissions.data
        const rolePermissions = permissionStore.rolesPermissions.data.filter(rp => rp.roleId === parseInt(id))
        selectedPermissions.value = rolePermissions.map(rp => rp.permissionId)
        
        //console.log('Permissões carregadas para o role:', selectedPermissions.value)
        
    } catch (error) {
        console.error('Erro ao carregar permissões do role:', error)
        message.value = { status: 'error', message: 'Erro ao carregar permissões' }
    }
}

const savePermissions = async () => {
    loading.value = true
    try {
        const response = await api.patch(`/api/v1/private/role/${id}/permissions`, {
            permissions: selectedPermissions.value
        })
        
        message.value = response.data
        if (message.value.status === 'success') {
            setTimeout(() => router.push(`/roles/${id}/edit`), 1500)
        }
    } catch (error) {
        console.error('Erro ao salvar permissões:', error)
        message.value = { status: 'error', message: 'Erro ao salvar permissões' }
    } finally {
        loading.value = false
    }
}

const goBack = () => router.push(`/admin/acl`)

onMounted(() => fetchData())
</script>