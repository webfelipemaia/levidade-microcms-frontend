<template>
  <AppNavigation @open-sidebar="toggleSidebar">
    <template #actions="{ openSidebar }">
      <OffcanvasButton @click="openSidebar" />
    </template>
  </AppNavigation>


  <div class="d-flex align-items-stretch">
    <AppSidebar
      v-if="authStore.isAuthenticated && !$route.meta.hideSidebar"
      :is-active="sidebarOpen"
      @close-sidebar="toggleSidebar"
    />
    <div class="maincontent container">
      <router-view />
    </div>
  </div>

  <AppFooter />
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import AppNavigation from '@/components/layout/ui/nav/LNavigation.vue';
import AppFooter from '@/components/layout/LFooter.vue';
import AppSidebar from '@/components/layout/ui/sidebar/LSidebar.vue';
import OffcanvasButton from '@/components/layout/ui/sidebar/LOffcanvasButton.vue';

const sidebarOpen = ref(false);
const authStore = useAuthStore();

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}
</script>
