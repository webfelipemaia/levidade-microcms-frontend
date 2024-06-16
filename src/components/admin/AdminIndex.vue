<template>
    <div>
        <p>Admin Index</p>
        <p v-if="authStore.user.email">Welcome, {{ authStore.user.email }}</p>
        <div>
            <ul>
                <li v-for="user in userStore.users" :key="user.id">{{ user.name }} {{ user.lastname }} - {{ user.email }}</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
const authStore = useAuthStore()
const userStore = useUserStore()

</script>