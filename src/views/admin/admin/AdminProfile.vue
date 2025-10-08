<template>
    
    <div v-if="userStore.message">
      {{ userStore.message }}
    </div>
  
    <UserProfile :user="authStore.user" @update-profile="processData" />
    
</template>
<script setup>
import UserProfile from "@/components/layout/ui/UserProfile.vue"
import { useAuthStore } from "@/stores/authStore"
import { useUserStore } from "@/stores/userStore"

const authStore = useAuthStore()
const userStore = useUserStore()

const processData = (data) => {
  userStore.updateUser(data.id, data)
}
</script>