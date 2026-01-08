<template>
  <ul class="pagination d-flex flex-wrap gap-1">
    <li><button @click="onClickFirstPage" :disabled="isInFirstPage">First</button></li>
    <li><button @click="onClickPreviousPage" :disabled="isInFirstPage">Previous</button></li>

    <li v-for="page in pages" :key="page.name">
      <button
        @click="onClickPage(page.name)"
        :disabled="page.isDisabled"
        :class="{ active: isPageActive(page.name) }"
      >
        {{ page.name }}
      </button>
    </li>

    <li><button @click="onClickNextPage" :disabled="isInLastPage">Next</button></li>
    <li><button @click="onClickLastPage" :disabled="isInLastPage">Last</button></li>
  </ul>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: Number,
  totalPages: Number,
  maxVisibleButtons: { type: Number, default: 5 },
})

const emit = defineEmits(['pagechanged'])

const isInFirstPage = computed(() => props.currentPage === 1)
const isInLastPage = computed(() => props.currentPage === props.totalPages)

const startPage = computed(() => {
  let start = props.currentPage - Math.floor(props.maxVisibleButtons / 2)
  if (start < 1) start = 1
  if (start + props.maxVisibleButtons - 1 > props.totalPages)
    start = Math.max(props.totalPages - props.maxVisibleButtons + 1, 1)
  return start
})

const pages = computed(() => {
  const range = []
  const end = Math.min(startPage.value + props.maxVisibleButtons - 1, props.totalPages)
  for (let i = startPage.value; i <= end; i++) {
    range.push({ name: i, isDisabled: i === props.currentPage })
  }
  return range
})

const onClickFirstPage = () => emit('pagechanged', 1)
const onClickPreviousPage = () => emit('pagechanged', props.currentPage - 1)
const onClickPage = (page) => emit('pagechanged', page)
const onClickNextPage = () => emit('pagechanged', props.currentPage + 1)
const onClickLastPage = () => emit('pagechanged', props.totalPages)
const isPageActive = (page) => props.currentPage === page
</script>

<style scoped>
.pagination {
  list-style: none;
  padding: 0;
}
button {
  border: 1px solid #ccc;
  background: #fff;
  padding: 4px 10px;
  border-radius: 4px;
}
button.active {
  background-color: #007bff;
  color: white;
}
button:disabled {
  opacity: 0.5;
}
</style>
