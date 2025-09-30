<template>
    <div :id="id" class="modal fade common-modal" :class="{show: show}" tabindex="-1" aria-labelledby="appModalLabel" :aria-hidden="show">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div v-if="showHeader" class="modal-header">
                    <h1 class="modal-title fs-5" id="appModalLabel">{{ title }}</h1>
                    <button @click="$emit('close')" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div v-if="hasDefaultSlotContent">
                        <slot></slot>
                    </div>
                    <div v-else>
                        <div v-if="confirmation">
                            <div class="p-4 text-center">
                                <h5 class="mb-0">Do you want to continue with this action?</h5>
                                <p class="mb-0">Once confirmed, the action cannot be undone.</p>
                            </div>
                        </div>
                    </div>
                    <div v-if="userStore.message" class="p-4 text-center">
                        {{ userStore.message }}
                    </div>
                </div>

                <div v-if="showFooter" 
                    :class="confirmation 
                        ? 'modal-footer flex-nowrap p-0' 
                        : 'modal-footer'">

                    <button type="button" 
                        @click="$emit('close')" 
                        :class="confirmation 
                        ? 'btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end' 
                        : 'btn btn-secondary'" data-bs-dismiss="modal">{{ userStore.message ? textClose : textCancel }}</button>

                    <button type="submit" 
                        @click.prevent.stop="processData(itemToHandle)"
                        :class="confirmation 
                        ? 'btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0' 
                        : 'btn btn-primary'"
                        :disabled="userStore.message">{{ textSave }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, useSlots } from 'vue'
import { useAddBackDrop, useRemoveBackDrop } from '../../composables/HandleBackdrop';
import { useUserStore } from '@/stores/userStore';

    const userStore = useUserStore()

    const itemToHandle = ref({})
    const slots = useSlots();   
     
    const props = defineProps({
        show: Boolean,
        data: [Object,Array],
        title: String,
        id: {
            type: String,
            required: true
        },
        showHeader: { 
            type: Boolean,
            default: true,
        },
        showFooter: { 
            type: Boolean,
            default: true,
        },
        confirmation: { 
            type: Boolean,
            default: false,
        },
        textSave: { 
            type: String,
            default: 'Save',
        },
        textCancel: { 
            type: String,
            default: 'Cancel',
        },
        textClose: { 
            type: String,
            default: 'Close',
        },
    })
 
    const emit = defineEmits(['close', 'processData'])
    const hasDefaultSlotContent = !!slots.default;

    watch(() => props.show, () => {
        openModal()
        itemToHandle.value = props.data
        if(!props.show){
            closeModal()
            useRemoveBackDrop()
        }
    })
    
    const openModal = (item) => {
      itemToHandle.value = { ...item }
      useAddBackDrop(props.id)
    }
    
    const closeModal = () => {
      useRemoveBackDrop()
    }

   const processData = (item) => {
        if(item) {
            emit('processData', item)
        }
    }
</script>

<style lang="scss">
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