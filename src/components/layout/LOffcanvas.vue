<script setup>
    import { computed } from 'vue'
    import SidebarMenu from '@/components/navigation/LSidebarMenu.vue'
    import { sidebarMenu } from '@/data/sidebarMenu'
    
    const props = defineProps({
      isActive: Boolean
    })
    
    const emit = defineEmits(['closeSidebar'])
    
    const offCanvas = computed(() =>
      props.isActive ? 'offcanvas' : 'offcanvas-md'
    )
    
    const close = () => {
      document.body.removeAttribute('style')
      document
        .querySelectorAll('.offcanvas-backdrop')
        .forEach(e => e.remove())
    
      emit('closeSidebar', false)
    }
    </script>
    
    <template>
      <div
        :class="[offCanvas, { show: isActive }]"
        class="sidebar leve offcanvas-start"
        tabindex="-1"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title">Navbar</h5>
          <button class="btn-close" @click="close" />
        </div>
    
        <div class="offcanvas-body flex-shrink-0 p-3 mt-5">
          <SidebarMenu :items="sidebarMenu" />
        </div>
      </div>
    </template>
    