<script setup>
    import { computed } from 'vue'
    import { useRoute } from 'vue-router'
    import { useAuthStore } from '@/stores/authStore'
    
    const props = defineProps({
        item: {
            type: Object,
            required: true
        }
    })
    const route = useRoute()
    const auth = useAuthStore()
    
    const isActive = computed(() =>
      props.item.routeNames?.includes(route.name)
    )
    
    const canShowChild = (child) => {
      if (child.role) return auth.hasRole(child.role)
      return true
    }
    </script>
    
    <template>
      <a
        class="nav-link collapsed d-flex justify-content-between"
        data-bs-toggle="collapse"
        :href="`#${item.label}`"
        :class="{ active: isActive }"
      >
        <div>
          <i :class="[item.icon, 'me-2']" />
          <span class="menu-text">{{ item.label }}</span>
        </div>
        <i class="bi bi-chevron-down menu-arrow" />
      </a>
    
      <div
        class="collapse submenu"
        :id="item.label"
        :class="{ show: isActive }"
      >
        <ul class="nav flex-column">
          <li v-for="child in item.children" :key="child.label">
            <router-link
              v-if="canShowChild(child)"
              :to="child.to"
              class="nav-link"
              active-class="active"
            >
              <span class="menu-text">{{ child.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </template>
    