<template>
    <header class="p-3 mb-3 border-bottom">
        <div class="container-fluid">
            <div class="d-flex flex-wrap align-items-center justify-content-between">
                

              <NavbarBrand linkClasses="justify-content-center" imgStyle="height: 90px;"></NavbarBrand>


                <div class="profile-container d-flex align-items-center">
                    <app-profile v-if="isAuthenticated" :user="authStore.user"></app-profile>                    
                    <button
                        @click="notifyParent"
                        class="btn sidebar-offcanvas-btn navbar-toggler ms-2 me-2 d-lg-none"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#offcanvasSidebarMenu"
                        aria-controls="#offcanvasSidebarMenu"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                        <i class="bi bi-list" style="font-size: 2rem;"></i>
                    </button>
                </div>

            </div>
        </div>
    </header>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';    
import AppProfile from '@/components/layout/ui/nav/NavProfile.vue';
import NavbarBrand from '@/components/layout/ui/nav/NavbarBrand.vue'

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const emit = defineEmits(['openSidebar'])

function notifyParent() {
    emit('openSidebar', true)
}
</script>

<style scoped>
@media (min-width: 992px) {
    .sidebar-offcanvas-btn {
        display: none !important;
    }
}

.navbar-brand {
    margin-bottom: 0;
    color: inherit;
}


.border-bottom {
    border-color: #dee2e6 !important;
}

.nav-link {
    transition: color 0.15s ease-in-out;
}

.nav-link:hover {
    color: #0d6efd !important;
}

.form-control:focus {
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* Garante que o profile fique alinhado à direita */
.d-flex.justify-content-between {
    width: 100%;
}
</style>