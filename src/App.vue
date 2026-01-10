<template>
  <LNavigation @open-sidebar="toggleSidebar">
    <template #actions="{ openSidebar }">
      <LOffcanvasButton @click="openSidebar" />
    </template>
  </LNavigation>


  <div class="d-flex align-items-stretch">
    <LSidebar
      v-if="authStore.isAuthenticated && !$route.meta.hideSidebar"
      :is-active="sidebarOpen"
      @close-sidebar="toggleSidebar"
    />
    <div class="maincontent container">
      <router-view />
    </div>
  </div>

  <LFooter />
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import LNavigation from '@/components/layout/LNavigation.vue';
import LFooter from '@/components/layout/LFooter.vue';
import LSidebar from '@/components/layout/LOffcanvas.vue';
import LOffcanvasButton from '@/components/navigation/LOffcanvasButton.vue';

const sidebarOpen = ref(false);
const authStore = useAuthStore();

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}
</script>
