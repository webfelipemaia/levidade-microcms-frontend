<template>
    <div>{{ articleData }}</div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useArticleStore } from '@/stores/articleStore';

const route = useRoute();
const articleStore = useArticleStore();

const articleId = ref(null);
const articleData = ref({});

onMounted(async () => {
    articleId.value = route.params.id;
    await fetchArticle(articleId.value);
});

const fetchArticle = async (id) => {
    articleData.value = await articleStore.getArticleById(id);
};

</script>
