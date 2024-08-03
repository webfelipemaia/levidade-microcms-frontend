<template>
    <div class="container-fluid">
        <app-card>

            <template #header>
                
                <app-card-header>
                    <div class="d-flex justify-content-between">
                        <span>Settings</span>
                    </div>
                </app-card-header>

            </template>
            
        </app-card>
    </div>

</template>

<script setup>
import { onMounted } from 'vue'
import AppCard from '../layout/ui/card/AppCard'
import AppCardHeader from '../layout/ui/card/AppCardHeader'



onMounted(() => {
    console.log('Settings page.')
})

</script>

<style>
</style>