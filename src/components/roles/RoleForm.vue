<template>
    <div :id="id" class="modal fade" :class="{show: (show && isEditModalOpen)}" tabindex="-1" aria-labelledby="roleFormLabel" :aria-hidden="show">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="roleFormLabel">{{ editedItem.id ? 'Editar' : 'Adicionar' }} item</h1>
                        <button  type="button" @click="$emit('close')" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div v-if="roleStore.message">
                                <div
                                    class="alert alert-dismissible fade show"
                                    :class="`alert-${roleStore.message.status === 'error'?'danger':'success'}`"
                                    role="alert"
                                >
                                    <template v-if="typeof roleStore.message.message === 'string'">
                                        <p><i class="bi bi-exclamation-circle me-2"></i> {{ roleStore.message.message }}</p>
                                    </template>

                                    <template v-else>
                                        <p><i class="bi bi-exclamation-circle me-2"></i>Oops! We found some problems with the form.</p>
                                        <ul class="mb-0">
                                            <li v-for="(msg, field) in roleStore.message.message" :key="field">
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
                        <div class="mb-3">
                            <label for="name" class="col-form-label">Name:</label>
                            <input v-model="editedItem.name" type="text" class="form-control" id="name">
                        </div>
                        
                        <div v-if="editedItem.id">
                            <p>Permissions:</p>
                            <div class="mb-3" v-for="p in permissions" :key="p.i">
                                <div class="form-check">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        :value="p.id"
                                        :checked="getPermissions(editedItem)
                                                    .some(permission => permission === p.id)"
                                        @change="togglePermission(p,
                                                                    getPermissions(editedItem)
                                                                        .some(permission => permission === p.id)
                                                                        ? 'unchecked' : 'checked' )"
                                    />
                                    <label class="form-check-label" :for="'flexCheck' + p.id">
                                        {{ p.name }}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" @click="$emit('close')" class="btn btn-secondary" data-bs-dismiss="modal">
                            {{ isSaving ? 'Close' : 'Cancel' }}
                        </button>
                        <button type="submit" class="btn btn-primary" :disabled="isSaving" @click.prevent.stop="saveData(editedItem)">
                            {{ isSaving ? 'Saving...' : 'Save' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoleStore } from '@/stores/roleStore';
import { usePermissionStore } from '../../stores/permissionStore'
import { useAddBackDrop, useRemoveBackDrop } from  '../layout/composables/HandleBackdrop';

const roleStore = useRoleStore()
const permissionStore = usePermissionStore()
const { permissions, rolesPermissions } = storeToRefs(permissionStore)
const isEditModalOpen = ref(false)
const editedItem = ref({})
const selectedPermissions = ref([])
const isSaving = ref(false)

    const props = defineProps({
        show: Boolean,
        data: [Object,Array],
        id: {
            type: String,
            required: true
        },
    })

    const emit = defineEmits(['close', 'saveData'])

    watch(() => props.show, () => {
        openEditModal(props.data.id)
        editedItem.value = props.data
        if(!props.show){
            closeEditModal()
            useRemoveBackDrop()
            roleStore.clearSuccessMessage()
            isSaving.value = false
        }
    })
    
    const openEditModal = (item) => {
      editedItem.value = { ...item }
      isEditModalOpen.value = true
      useAddBackDrop(props.id)
    }
    
    const closeEditModal = () => {    
      isEditModalOpen.value = false
      useRemoveBackDrop()
      roleStore.clearSuccessMessage()
      isSaving.value = false
    }

    const saveData = (item) => {
        item.permissions = selectedPermissions.value
        isSaving.value = true
        try {
           emit('saveData', item)
        } finally {
            isSaving.value = false
        }
        
    }

    // Given a list of permissions, checks if a role contains registered permissions and returns true.
    const getPermissions = (data) => {
    var checked = []
    rolesPermissions.value.forEach(d => {
        if(d.roleId === data.id) {
            checked.push(d.permissionId)
        }
    })
    return checked
}

    // Check or uncheck a permission to be saved
    const togglePermission = (data,isChecked) => {
        const index = selectedPermissions.value.indexOf(data)
        if (index !== -1 && selectedPermissions.value.length === 1) {
            selectedPermissions.value.length = 0
        } else if (index !== -1) {
            selectedPermissions.value.splice(index,1)
        } else {
            selectedPermissions.value.push({data,isChecked})
        }
    }
    
    // Get the permissions
    const fetchPermissions = async () => {
       await permissionStore.getPermissions()
    }

    // Gets the permissions associated with roles
    const fetchRolesPermissions = async () => {
       await permissionStore.getRolesPermissions()
    }

    onMounted(() => {
        fetchPermissions()
        fetchRolesPermissions()
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