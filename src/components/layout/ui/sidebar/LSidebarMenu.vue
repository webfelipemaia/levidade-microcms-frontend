<script setup>
    import SidebarItem from './LSidebarItem.vue'
    import SidebarGroup from './LSidebarGroup.vue'
    
    defineProps({
        items: {
            type: Array,
            required: true
        }
    })

    </script>
    
    <template>
      <ul class="nav nav-pills flex-column mb-auto offcanvas-nav">
        <li v-for="item in items" :key="item.label" class="nav-item">
          <SidebarGroup v-if="item.children" :item="item" />
          <SidebarItem v-else :item="item" />
        </li>
      </ul>
    </template>
    