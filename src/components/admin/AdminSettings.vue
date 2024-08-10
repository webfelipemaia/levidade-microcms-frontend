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

            <template #body>
                <form class="row g-3">
                    <div class="section-page">
                        <h4>General Settings</h4>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <label for="siteName" class="form-label">Site name</label>
                            <input type="text" class="form-control" id="siteName">                        
                        </div>
                        <div class="col-md-6">
                            <label for="siteContact" class="form-label">Contact e-mail</label>
                            <input type="text" class="form-control" id="siteContact">                        
                        </div>

                        <div class="section-page">
                            <h4>Manage Articles</h4>
                        </div>

                        <div class="col-md-6">
                            <label for="redirectAfterCreate" class="form-label">Allow redirection after creating article</label>
                            <input type="text" class="form-control" id="redirectAfterCreate">
                        </div>
                        <div class="col-md-6">
                            <label for="redirectAfer" class="form-label">Redirect after x seconds</label>
                            <input type="text" class="form-control" id="redirectAfer">
                        </div>
                    </div>
                </form>

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
.section-page {
    margin-top: 2rem;
    margin-bottom: 1rem;
}
</style>