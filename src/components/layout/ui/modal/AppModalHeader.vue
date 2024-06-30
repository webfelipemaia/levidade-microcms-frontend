<template>
    <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button @click="$emit('close')" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  </div>
</template>
<script setup>
import { defineEmits } from 'vue';

defineEmits(['close'])

</script>