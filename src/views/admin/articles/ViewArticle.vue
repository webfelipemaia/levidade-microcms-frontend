<template>
    <div>
        Edit Article: {{ articleStore.lastArticle }}
    </div>
</template>
  
<script setup>

import { useArticleStore } from '../../stores/articleStore'
const articleStore = useArticleStore()


</script>
  
<style scoped>  
</style>
  