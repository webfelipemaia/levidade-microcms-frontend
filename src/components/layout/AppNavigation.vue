<template>
    <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
            <a class="navbar-brand" href="">Navbar</a>
            
            <button @click="notifyParent" class="btn sidebar-offcanvas-btn  navbar-toggler" 
                    type="button" data-bs-toggle="collapse" 
                    data-bs-target="#offcanvasSidebarMenu" 
                    aria-controls="#offcanvasSidebarMenu" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item d-flex align-items-center" v-if="authStore.user">
                        Welcome <a class="nav-link" href="/admin/profile">{{ authStore.user.email  }}</a>
                    </li>
                    <li v-if="authStore.user" class="nav-item">
                        <a class="nav-link" href="/logout">Logout</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>

import { useAuthStore } from '../../stores/authStore';    

const authStore = useAuthStore();
const emit = defineEmits(['openSidebar'])

function notifyParent() {
  emit('openSidebar',true)
}

</script>

<style>
@media (min-width: 768px) {
    .sidebar-offcanvas-btn {
        display: none !important;
    }
}
</style>