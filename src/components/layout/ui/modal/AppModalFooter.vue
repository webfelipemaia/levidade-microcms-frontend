<template>
    <div class="modal-footer">
        <button type="button" @click="$emit('close')" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="submit" class="btn btn-primary" @click.prevent.stop="saveData(editedItem)">Save</button>
    </div>
</template>
<script setup>
</script>