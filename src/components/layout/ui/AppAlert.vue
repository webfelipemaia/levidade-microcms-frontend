<template>
    <div :class="`alert ${alertType}`" class="alert-dismissible fade show" role="alert">
        <span v-if="noIcon"></span>
        <span v-else>
            <i class="bi me-3" :class="`${icon}`"></i>
        </span>
        <span><slot></slot></span>
        <button 
            type="button" 
            class="btn-close" 
            @click="$emit('close')" 
            aria-label="Close">
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps ({
    type: {
        type: String,
        default: 'success'
    },
    noIcon: {
        type: Boolean,
        default: false
    }
})

defineEmits(['close'])

const alertType = computed(() => {
    return {
        success: 'alert-success',
        danger: 'alert-danger',
        warning: 'alert-warning',
        info: 'alert-info',
        light: 'alert-light',
        dark: 'alert-dark',
        primary: 'alert-primary',
        secondary: 'alert-secondary'
    }[props.type]
})

const icon = computed(() => {
    return {
        success: 'bi-check-circle',
        danger: 'bi-shield-exclamation',
        warning: 'bi-exclamation-triangle',
        info: 'bi-info-circle',
        light: 'bi-check-lg',
        dark: 'bi-check-lg',
        primary: 'bi-hand-thumbs-up',
        secondary: 'bi-check-lg'
    }[props.type]
})
</script>

<style lang="scss">

</style>