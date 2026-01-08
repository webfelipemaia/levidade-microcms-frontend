<script setup>
    import { computed } from 'vue'
    import { useAuthStore } from '@/stores/authStore'
    
    const props = defineProps({
        item: {
            type: Object,
            required: true
        }
    })
    const auth = useAuthStore()
    
    const canShow = computed(() => {
      if (props.item.adminOnly) return auth.isAdmin
      if (props.item.role) return auth.hasRole(props.item.role)
      if (props.item.can) return auth.can(props.item.can)
      return true
    })
    </script>
    
    <template>
      <router-link
        v-if="canShow"
        :to="item.to"
        class="nav-link"
        active-class="active"
      >
        <i v-if="item.icon" :class="[item.icon, 'me-2']" />
        <span class="menu-text">{{ item.label }}</span>
      </router-link>
    </template>
    