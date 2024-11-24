<template>
    <ul class="pagination">
      <li class="pagination-item">
        <button
          type="button"
          @click="onClickFirstPage"
          :disabled="isInFirstPage"
        >
          First
        </button>
      </li>
  
      <li class="pagination-item">
        <button
          type="button"
          @click="onClickPreviousPage"
          :disabled="isInFirstPage"
        >
          Previous
        </button>
      </li>
  
      <!-- Visible Buttons Start -->
  
      <li
        v-for="page in pages"
        :key="page.name"
        class="pagination-item"
      >
        <button
          type="button"
          @click="onClickPage(page.name)"
          :disabled="page.isDisabled"
          :class="{ active: isPageActive(page.name) }"
        >
          {{ page.name }}
        </button>
      </li>
  
      <!-- Visible Buttons End -->
  
      <li class="pagination-item">
        <button
          type="button"
          @click="onClickNextPage"
          :disabled="isInLastPage"
        >
          Next
        </button>
      </li>
  
      <li class="pagination-item">
        <button
          type="button"
          @click="onClickLastPage"
          :disabled="isInLastPage"
        >
          Last
        </button>
      </li>
    </ul>
</template>
  
<script setup>
  import { computed, defineProps, defineEmits } from 'vue';
  
  // Props
  const props = defineProps({
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    maxVisibleButtons: {
      type: Number,
      default: 3,
    },
  });
  
  const emit = defineEmits(['pagechanged']);
  
  // Computed Properties
  const isInFirstPage = computed(() => props.currentPage === 1);
  const isInLastPage = computed(() => props.currentPage === props.totalPages);
  
  const startPage = computed(() => {
    if (props.currentPage === 1) return 1;
    if (props.currentPage === props.totalPages) return props.totalPages - props.maxVisibleButtons + 1;
    return props.currentPage - 1;
  });
  
  const endPage = computed(() => 
    Math.min(startPage.value + props.maxVisibleButtons - 1, props.totalPages)
  );
  
  const pages = computed(() => {
    const range = [];
    for (let i = startPage.value; i <= endPage.value; i++) {
      range.push({
        name: i,
        isDisabled: i === props.currentPage,
      });
    }
    return range;
  });
  
  // Methods
  const onClickFirstPage = () => emit('pagechanged', 1);
  const onClickPreviousPage = () => emit('pagechanged', props.currentPage - 1);
  const onClickPage = (page) => emit('pagechanged', page);
  const onClickNextPage = () => emit('pagechanged', props.currentPage + 1);
  const onClickLastPage = () => emit('pagechanged', props.totalPages);
  const isPageActive = (page) => props.currentPage === page;
  </script>
  
  <style>
  .pagination {
    list-style-type: none;
  }
  
  .pagination-item {
    display: inline-block;
  }
  
  .active {
    background-color: #4AAE9B;
    color: #ffffff;
  }
  </style>
  