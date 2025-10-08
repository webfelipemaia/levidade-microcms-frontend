<template>
  
    <div class="dropdown text-end">
      <a
        href="#"
        class="dropdown-profile-link d-block link-body-emphasis text-decoration-none dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img
          src="https://avatars.githubusercontent.com/u/2156393?v=4"
          :alt="fullName"
          width="32"
          height="32"
          class="rounded-circle"
        />
      </a>
  
      <ul class="dropdown-menu text-small shadow">
        <li class="dropdown-header fw-semibold">
          Olá {{ user.name }}
        </li>
        <li><a class="dropdown-item" href="/admin/profile">Profile</a></li>
        <li><hr class="dropdown-divider" /></li>
        <li>
          <a class="dropdown-item" href="/logout">
            Sign out
          </a>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    user: {
      type: Object,
      required: true,
    },
  })
  
  const fullName = computed(() => {
    return props.user ? `${props.user.name} ${props.user.lastname}` : 'User'
  })
  
  </script>
  
  <style scoped>
  .dropdown-menu {
    min-width: 180px;
  }
  .dropdown-header {
    padding: 0.5rem 1rem;
  }
  </style>
  