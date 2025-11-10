<template>
    <div class="container mx-auto p-4">
        <div class="bg-white shadow-md rounded-lg p-6">
            <div class="mb-6">
                <h1 class="text-2xl font-bold text-gray-800">Permissões do Role: {{ roleName }}</h1>
                <p class="text-gray-600">ID: {{ id }}</p>
            </div>

            <div v-if="message" 
                 :class="['p-4 rounded mb-4', 
                         message.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                {{ message.message }}
            </div>

            <div v-if="permissions.length > 0">
                <label class="block text-sm font-medium text-gray-700 mb-2">Permissões</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto p-2 border border-gray-300 rounded">
                    <div v-for="permission in permissions" :key="permission.id" class="flex items-center">
                        <input 
                            type="checkbox" 
                            :id="`permission-${permission.id}`"
                            :checked="isPermissionSelected(permission)"
                            @change="togglePermission(permission)"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                        <label :for="`permission-${permission.id}`" class="ml-2 text-sm text-gray-700">
                            {{ permission.name }}
                        </label>
                    </div>
                </div>
                
                <div class="mt-4 text-sm text-gray-600">
                    {{ selectedPermissionsCount }} permissão(ões) selecionada(s)
                </div>

                <div class="mt-6 flex space-x-4">
                    <button 
                        @click="savePermissions"
                        :disabled="loading"
                        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                        <span v-if="loading">Salvando...</span>
                        <span v-else>Salvar Permissões</span>
                    </button>

                    <button 
                        @click="goBack"
                        class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Voltar para Edição
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
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
        
        console.log('Permissões carregadas para o role:', selectedPermissions.value)
        
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

const goBack = () => router.push(`/roles/${id}/edit`)

onMounted(() => fetchData())
</script>