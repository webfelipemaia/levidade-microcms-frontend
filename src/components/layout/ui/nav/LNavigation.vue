<template>
    <header class="p-3 mb-3 border-bottom">
      <div class="container-fluid">
        <div class="d-flex flex-wrap align-items-center justify-content-between">
          <NavbarBrand
            linkClasses="justify-content-center"
            :imgStyle="{ height: '90px' }"
          />
  
          <div class="profile-container d-flex align-items-center">
            <NavProfile
              v-if="isAuthenticated"
              :user="authStore.user"
              :avatarUrl="authStore.avatar"
            />
  
            <slot name="actions" :openSidebar="notifyParent" />
          </div>
        </div>
      </div>
    </header>
  </template>

    <script setup>
    import { computed } from 'vue';
    import { useAuthStore } from '@/stores/authStore';
    import NavProfile from '@/components/layout/ui/nav/LNavbarProfile.vue';
    import NavbarBrand from '@/components/layout/ui/nav/LNavbarBrand.vue';

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

    .d-flex.justify-content-between {
        width: 100%;
    }
    </style>