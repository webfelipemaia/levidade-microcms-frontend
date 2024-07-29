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
                        <div class="mb-3">
                            <label for="name" class="col-form-label">Name:</label>
                            <input v-model="editedItem.name" type="text" class="form-control" id="name">
                        </div>
                        
                        <p>Permissions:</p>
                        <div class="mb-3" v-for="p in permissions" :key="p.i">
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    :value="p.id"
                                    :checked="getPermissions(editedItem).some(permission => permission.name === p.name)"
                                    @change="togglePermission(p)"
                                />
                                <label class="form-check-label" :for="'flexCheck' + p.id">
                                    {{ p.name }}
                                </label>
                            </div>
                        </div>
                        <p>Selected permissions: {{ selectedPermissions }}</p>

                        
                        <div v-if="roleStore.message">
                            <div class="alert alert-dismissible fade show" :class="`alert-${roleStore.message.status === 'error'?'danger':'success'}`" role="alert">
                                <p><i class="bi bi-exclamation-circle me-2"></i> {{ roleStore.message.message }}</p>
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" @click="$emit('close')" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary" @click.prevent.stop="saveData(editedItem)">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoleStore } from '@/stores/roleStore';
import { usePermissionStore } from '../../stores/permissionStore'
import { useAddBackDrop, useRemoveBackDrop } from  '../../components/layout/composebles/HandleBackdrop';

const roleStore = useRoleStore()
const permissionStore = usePermissionStore()
const { permissions, rolesPermissions } = storeToRefs(permissionStore)
const isEditModalOpen = ref(false)
const editedItem = ref({})
const selectedPermissions = ref([])
//const savedPermissions = ref([])

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
        selectedPermissions.value = props.data.permissions || []
        if(!props.show){
            closeEditModal()
            useRemoveBackDrop()
            roleStore.clearSuccessMessage()
        }
    })
    
    const openEditModal = (item) => {
      editedItem.value = { ...item }
      selectedPermissions.value = item.permissions || []
      isEditModalOpen.value = true
      useAddBackDrop(props.id)
    }
    
    const closeEditModal = () => {    
      isEditModalOpen.value = false
      useRemoveBackDrop()
      roleStore.clearSuccessMessage()
    }

    const saveData = (item) => {
        item.permissions = selectedPermissions.value
        emit('saveData', item)
        
    }

    //Given a list of permissions, checks if a role contains registered permissions and returns true.
    const getPermissions = (data) => {
        var checked = []
        rolesPermissions.value.forEach(d => {
            if(d.name === data.name) {
                let permissions = d.Permissions
                permissions.forEach(p => {
                    checked.push(p)
                })
            }
        })
        return checked
    }

    // Check or uncheck a permission to be saved
    const togglePermission = (data) => {
        if (selectedPermissions.value.includes(data.id)) {
            selectedPermissions.value = selectedPermissions.value.filter(permissionId => permissionId !== data.id)
        } else {
            selectedPermissions.value.push(data)
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

    // checks if role has associated permissions
/*     const getSavePermissions = async (id) => {
        const permissionStore = usePermissionStore();

        if (permissionStore.permissions.length === 0) {
            await permissionStore.getRolesPermissions();
        }

        const permissions = permissionStore.permissions;

        const permission = permissions.find(permission => permission.id === id);

        if (permission) {
            savedPermissions.value = permission.Permissions;
        } else {
            console.log(`Role with id ${id} not found.`);
        }
    }; */

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