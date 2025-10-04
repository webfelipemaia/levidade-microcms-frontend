<template>
    <div class="container mx-auto p-4">
        <div class="bg-white shadow-md rounded-lg p-6">
            <!-- Header -->
            <div class="mb-6">
                <h1 class="text-2xl font-bold text-gray-800">Editar Permissão</h1>
                <p class="text-gray-600">ID: {{ route.query.id }}</p>
            </div>

            <div v-if="permissionStore.message">
                
                                <div
                                    class="alert alert-dismissible fade show"
                                    :class="`alert-${permissionStore.message.status === 'error'?'danger':'success'}`"
                                    role="alert"
                                >
                                    <template v-if="typeof permissionStore.message.message === 'string'">
                                        <p><i class="bi bi-exclamation-circle me-2"></i> {{ permissionStore.message.message }}</p>
                                    </template>

                                    <template v-else>
                                        <p><i class="bi bi-exclamation-circle me-2"></i>Oops! We found some problems with the form.</p>
                                        <ul class="mb-0">
                                            <li v-for="(msg, field) in permissionStore.message.message" :key="field">
                                            <strong>{{ field }}:</strong> {{ msg }}
                                            </li>
                                        </ul>
                                    </template>

                                    <button
                                    type="button"
                                    class="btn-close"
                                    data-bs-dismiss="alert"
                                    aria-label="Close"
                                    ></button>
                                </div>
                            </div>

            <!-- Formulário de edição -->
            <form @submit.prevent="updatePermission" class="space-y-4" v-if="permission">
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Nome da Permissão</label>
                    <input 
                        type="text" 
                        id="name" 
                        v-model="permission.name" 
                        required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Digite o nome da permissão">
                </div>

                <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">Descrição</label>
                    <textarea 
                        id="description" 
                        v-model="permission.description" 
                        rows="3"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Digite a descrição da permissão"></textarea>
                </div>

                <div class="flex space-x-4">
                    <button 
                        type="submit" 
                        :disabled="loading"
                        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                        <span v-if="loading">Salvando...</span>
                        <span v-else>Salvar Alterações</span>
                    </button>

                    <button 
                        type="button" 
                        @click="goBack"
                        class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Voltar
                    </button>
                </div>
            </form>

            <!-- Loading state -->
            <div v-else-if="loading" class="text-center py-8">
                <p class="text-gray-600">Carregando permissão...</p>
            </div>

            <!-- Error state -->
            <div v-else class="text-center py-8">
                <p class="text-red-600">Permissão não encontrada</p>
                <button 
                    @click="goBack"
                    class="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Voltar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePermissionStore } from '@/stores/permissionStore'

const route = useRoute()
const router = useRouter()
const permissionStore = usePermissionStore()

const permission = ref(null)
const loading = ref(false)

const fetchPermission = async () => {
    if (!route.query.id) return
    
    loading.value = true
    try {
        await permissionStore.getPermissions()
        const foundPermission = permissionStore.permissions.find(p => p.id === parseInt(route.query.id))
        if (foundPermission) {
            permission.value = { ...foundPermission }
        } else {
            permission.value = null
        }
    } catch (error) {
        console.error('Erro ao carregar permissão:', error)
        permission.value = null
    } finally {
        loading.value = false
    }
}

const updatePermission = async () => {
    if (!permission.value) return
    
    loading.value = true
    try {
        await permissionStore.updatePermission(permission.value)
        if (permissionStore.message?.status === 'success') {
            setTimeout(() => {
                router.push('/permissions')
            }, 1500)
        }
    } catch (error) {
        console.error('Erro ao atualizar permissão:', error)
    } finally {
        loading.value = false
    }
}

const goBack = () => {
    router.push('/permissions')
}

watch(() => route.query.id, (newId) => {
    if (newId) {
        fetchPermission()
    }
})

onUnmounted(() => {
    permissionStore.clearSuccessMessage()
})

onMounted(() => {
    fetchPermission()
})
</script>

<style scoped>
.container {
    max-width: 600px;
}
</style>