<template>

  <AppNavigation @open-sidebar="sidebarIsActive" />
  
  <div class="d-flex align-items-strech">
    
    <AppSidebar v-if="authStore.isAuthenticated" :is-active="sidebarOpen" @close-sidebar="sidebarIsActive"  />
    
    <div class="maincontent container">      
      <router-view />
    </div>

  </div>
  
  <app-footer/>
</template>

<script setup>
import { ref } from 'vue';
import AppNavigation from '@/components/layout/AppNavigation.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { useAuthStore } from '@/stores/authStore'
    
const authStore = useAuthStore()
const sidebarOpen = ref(false)

function sidebarIsActive() {
  sidebarOpen.value = sidebarOpen.value === true ? false : true
}

</script>

<style lang="scss">
</style>
