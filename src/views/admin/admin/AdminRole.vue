<template>
    <div class="container-fluid">
        <app-card>
            <template #header>
                <app-card-header>
                    <div class="d-flex justify-content-between">
                        <span>All roles</span>
                        <button @click="[showModal=true,selectedRole={}]" type="button" class="btn btn-primary"><i class="bi bi-plus"></i> New</button>
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
                                    <th scope="col">Updated</th>
                                    <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-if="roles && roles.length">
                                        <tr v-for="role in roles" :key="role.id">                        
                                            <th class="align-middle" scope="row">{{ role.id }}</th>
                                            <td class="align-middle">{{ role.name }}</td>
                                            <td class="align-middle">{{ role.updatedAt }}</td>
                                            <td>
                                                <div class="d-flex">
                                                    <div class="p-2 flex-fill">
                                                        <button @click="[showModal=true,selectedRole=role]" type="button" class="btn">
                                                            <i class="bi bi-pencil"></i>
                                                        </button>
                                                    </div>
                                                    <div class="p-2 flex-fill">
                                                        <button @click="[activeModal=true,selectedRole=role]" type="button" class="btn">
                                                            <i class="bi bi-trash3"></i>
                                                        </button>
                                                    </div>
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

                    </table>
                </div>
            </template>
        </app-card>
    </div>

    <app-modal :id="'app-modal-01'" :data="selectedRole" :show="activeModal" confirmation text-save="Delete" :show-header="false" @close="activeModal=false" @process-data="processData($event)"></app-modal>
    <role-form :id="'app-modal-02'" :data="selectedRole" :show="showModal" @close="showModal=false" @save-data="saveData($event)"></role-form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import RoleForm from '@/views/admin/roles/RoleForm.vue'
import AppCard from '@/components/layout/ui/card/AppCard.vue'
import AppModal from '@/components/layout/ui/modal/AppModal.vue'
import AppCardHeader from '@/components/layout/ui/card/AppCardHeader.vue'
import { storeToRefs } from 'pinia'
import { useRoleStore } from '@/stores/roleStore'

const roleStore = useRoleStore()
const { roles } =  storeToRefs(roleStore)
const showModal = ref(false)
const selectedRole = ref([])
const activeModal = ref(false)
    
const fetchRoles = async () => {
   await roleStore.getRoles();
}

const saveData = (data) => {
    if(data.id) {
        updateData(data);
    } else {
        createData(data);
    }
    fetchRoles()
} 

const processData = (data) => {
    roleStore.deleteRole(data);
    roles.value = roles.value.filter(r => r.id !== data.id);
    activeModal.value = false;
}

const createData = (data) => {
    roleStore.createRole(data);
}

const updateData = (data) => {
    roleStore.updateRole(data);
    fetchRoles();
}

onMounted(() => {
    fetchRoles()
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