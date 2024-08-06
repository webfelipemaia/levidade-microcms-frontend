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
                                    <th scope="col">Title</th>
                                    <th scope="col">Category</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Updated at</th>
                                    <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody v-if="articles">
                                    <tr v-for="article in articles" :key="article.id">                        
                                    <th class="align-middle" scope="row">{{ article.id }}</th>
                                    <td class="align-middle">{{ article.title }}</td>
                                    <td class="align-middle">{{ article.categoryId }}</td>
                                    <td class="align-middle">{{ article.status }}</td>
                                    <td class="align-middle">{{ article.updatedAt }}</td>
                                    <td>
                                        <div class="d-flex">
                                            <div class="p-2 flex-fill"><button @click="[showModal=true,selectedRole=article]" type="button" class="btn"><i class="bi bi-pencil"></i></button></div>
                                            <div class="p-2 flex-fill"><button @click="[activeModal=true,selectedRole=article]" type="button" class="btn"><i class="bi bi-trash3"></i></button></div>
                                        </div>
                                    </td>
                                    </tr>
                                </tbody>

                                <tbody v-else>
                                    <p>No data</p>
                                </tbody>
                    </table>
                </div>
            </template>
        </app-card>
    </div>

    <!-- <app-modal :id="'app-modal-01'" :data="selectedRole" :show="activeModal" confirmation text-save="Delete" :show-header="false" @close="activeModal=false" @process-data="processData($event)"></app-modal>
    <role-form :id="'app-modal-02'" :data="selectedRole" :show="showModal" @close="showModal=false" @save-data="saveData($event)"></role-form> -->
</template>

<script setup>
import { ref, onMounted } from 'vue'
//import RoleForm from '../../components/roles/RoleForm'
import AppCard from '../layout/ui/card/AppCard'
//import AppModal from '../layout/ui/modal/AppModal'
import AppCardHeader from '../layout/ui/card/AppCardHeader'
import { storeToRefs } from 'pinia'
import { useArticleStore } from '../../stores/articleStore'

const articleStore = useArticleStore()
const { articles } =  storeToRefs(articleStore)
const showModal = ref(false)
const selectedRole = ref([])
const activeModal = ref(false)

const fetchArticles = async () => {
   await articleStore.getArticles()
}

// const saveData = (data) => {
//     if(data.id) {
//         updateData(data)
//     } else {
//         createData(data)  
//     }
// } 

// const processData = (data) => {
//     articleStore.deleteRole(data)
// }

// const createData = (data) => {
//     articleStore.createRole(data)
// }

// const updateData = (data) => {
//     articleStore.updateRole(data)
// }

onMounted(() => {
    fetchArticles()
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