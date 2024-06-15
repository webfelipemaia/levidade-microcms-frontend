<template>
  <AppNavigation @click="notifySidebar" />
  <div class="d-flex align-items-strech">
    <AppSidebar :is-active="sidebarActiveValue"  @updateValue="handleSidebarNotification"  />
    
    <div class="maincontent container">
      <router-view />
    </div>

  </div>
  <app-footer/>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import AppNavigation from './components/layout/AppNavigation.vue'
import AppFooter from './components/layout/AppFooter.vue'
import AppSidebar from './components/layout/AppSidebar.vue'

const emit = defineEmits(['update-value']);

const notifySidebar = () => {  
var sidebarElem = document.querySelector(".sidebar");
sidebarElem.classList.add('show');
handleSidebarNotification(true);
emit('update-value', true);
};

const sidebarActiveValue = ref('false');

const handleSidebarNotification = (value) => {
sidebarActiveValue.value = value;
};

</script>

<style lang="scss">
</style>
