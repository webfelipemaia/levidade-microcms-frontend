<template>
    <div class="container-fluid">
        <app-card>
            <template #header>
                <app-card-header>
                    <div class="d-flex justify-content-between">
                        <span>Manage permissions</span>
                        <button @click="[showModal=true,selectedPermission={}]" type="button" class="btn btn-primary"><i class="bi bi-plus"></i> New</button>
                    </div>
                </app-card-header>
            </template>
            <template #body>
                <div class="table-responsive">
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
                                    <template v-if="permissions && permissions.length">
                                        <tr v-for="permission in permissions" :key="permission.id">                        
                                            <th class="align-middle" scope="row">{{ permission.id }}</th>
                                            <td class="align-middle">{{ permission.name }}</td>
                                            <td class="align-middle">0</td>
                                            <td class="align-middle">{{ permission.updatedAt }}</td>
                                            <td>
                                                <div class="d-flex">
                                                    <div class="p-2 flex-fill">
                                                        <button @click="[showModal=true,selectedPermission=permission]" type="button" class="btn">
                                                            <i class="bi bi-pencil"></i>
                                                        </button>
                                                    </div>
                                                    <div class="p-2 flex-fill">
                                                        <button @click="[activeModal=true,selectedPermission=permission]" type="button" class="btn">
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

    <app-modal 
        :id="'app-modal-01'" 
        :data="selectedPermission" 
        :show="activeModal" 
        confirmation 
        text-save="Delete" 
        :show-header="false" 
        @close="activeModal=false" 
        @process-data="processData($event)">
    </app-modal>
    <permission-form 
        :id="'app-modal-02'" 
        :data="selectedPermission" 
        :show="showModal" 
        @close="showModal=false" 
        @save-data="saveData($event)">
    </permission-form>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePermissionStore } from '@/stores/permissionStore'
import AppCard from '@/components/layout/ui/card/AppCard.vue'
import AppCardHeader from '@/components/layout/ui/card/AppCardHeader.vue'
import AppModal from '@/components/layout/ui/modal/AppModal.vue'
import PermissionForm from '@/views/admin/permissions/PermissionForm.vue'

const permissionStore = usePermissionStore()
const { permissions } = storeToRefs(permissionStore)
const showModal = ref(false)
const activeModal = ref(false)
const selectedPermission = ref({})

const fetchPermissions = async () => {
   await permissionStore.getPermissions()
}

const saveData = async (data) => {
    try {
        if(data.id) {
            await updateData(data);
        } else {
            await createData(data); 
        }
    } catch (error) {
        console.error('Error saving data:', error);
    }
} 

const processData = async (data) => {
    try {
        await permissionStore.deletePermission(data);
        permissions.value = permissions.value.filter(p => p.id !== data.id);
        activeModal.value = false;
        //selectedPermission.value = {};
    } catch (error) {
        console.error('Error deleting data:', error);
    }
}

const createData = async (data) => {
    await permissionStore.createPermission(data);
    await fetchPermissions();
}

const updateData = async (data) => {
    await permissionStore.updatePermission(data);
    await fetchPermissions();
}

onMounted(() => {
    fetchPermissions();
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