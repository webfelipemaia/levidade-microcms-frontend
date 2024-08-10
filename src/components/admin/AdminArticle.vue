<template>
    <div class="container-fluid">
        <app-card>
            <template #header>
                <app-card-header>
                    <div class="d-flex justify-content-between">
                        <span>All articles</span>
                        <router-link :to="{name: 'admin.articles.new'}" class="btn btn-primary"><i class="bi bi-plus"></i> New</router-link>
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
                                            <div class="p-2 flex-fill">
                                                <router-link :to="{ name: 'admin.articles.edit', params: { id: article.id } }" class="btn btn-primary"><i class="bi bi-plus"></i> Edit</router-link>
                                            </div>
                                            <div class="p-2 flex-fill"><button @click="[showModal=true,selectedArticle=article]" type="button" class="btn"><i class="bi bi-pencil"></i></button></div>
                                            <div class="p-2 flex-fill"><button @click="[activeModal=true,selectedArticle=article]" type="button" class="btn"><i class="bi bi-trash3"></i></button></div>
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

    <app-modal :id="'app-modal-01'" :data="selectedArticle" :show="activeModal" confirmation text-save="Delete" :show-header="false" @close="activeModal=false" @process-data="processData($event)"></app-modal>
    
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppCard from '../layout/ui/card/AppCard'
import AppModal from '../layout/ui/modal/AppModal'
import AppCardHeader from '../layout/ui/card/AppCardHeader'
import { storeToRefs } from 'pinia'
import { useArticleStore } from '../../stores/articleStore'

const articleStore = useArticleStore()
const { articles } =  storeToRefs(articleStore)
const showModal = ref(false)
const selectedArticle = ref([])
const activeModal = ref(false)

const fetchArticles = async () => {
   await articleStore.getArticles()
}

const processData = (data) => {
    articleStore.deleteRole(data)
}

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