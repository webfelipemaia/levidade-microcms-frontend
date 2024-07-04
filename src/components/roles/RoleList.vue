<template>
    <div>
        <ul>
            <li v-for="user in users" :key="user.id">{{ user }}</li>
        </ul>      
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import RoleService from '../../services/RoleService'

const users = ref([]);

const fetchUsers = async () => {
  try {
    const response = await RoleService.getAll();
    users.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
  
<style scoped>
</style>
  