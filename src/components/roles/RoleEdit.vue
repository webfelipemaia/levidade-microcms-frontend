<template>
    <div class="container mx-auto p-4">
        <div class="bg-white shadow-md rounded-lg p-6">
            <div class="mb-6">
                <h1 class="text-2xl font-bold text-gray-800">Editar Role</h1>
                <p class="text-gray-600">ID: {{ id }}</p>
            </div>

            <div v-if="roleStore.message" 
                 :class="['p-4 rounded mb-4', 
                         roleStore.message.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                {{ roleStore.message.message }}
            </div>

            <form @submit.prevent="updateRole" class="space-y-4" v-if="role">
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Nome do Role</label>
                    <input 
                        type="text" 
                        id="name" 
                        v-model="role.name" 
                        required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                </div>

                <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">Descrição</label>
                    <textarea 
                        id="description" 
                        v-model="role.description" 
                        rows="3"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    </textarea>
                </div>

                <div class="flex space-x-4">
                    <button 
                        type="submit" 
                        :disabled="loading"
                        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                        <span v-if="loading">Salvando...</span>
                        <span v-else>Salvar Alterações</span>
                    </button>

                    <button 
                        type="button" 
                        @click="goBack"
                        class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Voltar
                    </button>
                </div>
            </form>

            <!-- Link para gerenciar permissões -->
            <div v-if="role" class="mt-8 pt-6 border-t">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Gerenciar Permissões</h2>
                <p class="text-gray-600 mb-4">Gerencie as permissões associadas a este role</p>
                <router-link 
                    :to="`/roles/${id}/permissions`"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
                    Gerenciar Permissões →
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRoleStore } from '@/stores/roleStore'

const route = useRoute()
const router = useRouter()
const roleStore = useRoleStore()

const id = route.params.id
const role = ref(null)
const loading = ref(false)

const fetchRole = async () => {
    if (!id) return
    loading.value = true
    try {
        await roleStore.getRoles()
        const foundRole = roleStore.roles.find(r => r.id === parseInt(id))
        role.value = foundRole ? { ...foundRole } : null
    } catch (error) {
        console.error('Erro ao carregar role:', error)
    } finally {
        loading.value = false
    }
}

const updateRole = async () => {
    if (!role.value) return
    loading.value = true
    try {
        await roleStore.updateRole(role.value)
        if (roleStore.message?.status === 'success') {
            setTimeout(() => router.push('/admin/roles'), 1500)
        }
    } catch (error) {
        console.error('Erro ao atualizar role:', error)
    } finally {
        loading.value = false
    }
}

const goBack = () => router.push('/admin/roles')

onMounted(() => fetchRole())
</script>