<template>
    <div 
        :class="[offCanvas,{'show': isActive}]"
        class="sidebar leve offcanvas-start" 
        tabindex="-1" 
        id="offcanvasExample" 
        aria-labelledby="offcanvasSidebarMenu"
        ref="offcanvas"
        >
        <div class="offcanvas-header">
            
    <h5 class="offcanvas-title" id="offcanvasSidebarMenu">Navbar</h5>
    <button @click="updateValue" type="button" class="btn-close" aria-label="Close"></button>
  </div>
    <div class="offcanvas-body flex-shrink-0 p-3" style="width: 280px;">
            <ul class="nav flex-column">
                
                <li class="nav-item nav-item_title">
                    <div class="nav-header">
                        <div class="nav-header_title">
                            <a class="nav-link" href="#">UI Kit <span>version 0.1.0</span></a>                            
                        </div>
                        <div class="nav-header_body">
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                        </div>
                    </div>
                </li>

                <li class="nav-item">
                    <router-link to="/admin/articles" class="nav-link">Articles</router-link>
                    <nav class="nav subnav flex-column">
                        <router-link to="/admin/articles" class="nav-link">Manage Articles</router-link>
                        <router-link :to="{name: 'admin.articles.new'}" class="nav-link">New Article</router-link>
                    </nav>
                </li>

                <li class="nav-item">
                    <router-link to="/admin/categories" class="nav-link">Categories</router-link>
                    <nav class="nav subnav flex-column">
                        <router-link to="/admin/categories" class="nav-link">Manage Category</router-link>
                    </nav>
                </li>

                <li class="nav-item">
                    <router-link to="/admin/roles" class="nav-link">Users</router-link>
                    <nav class="nav subnav flex-column">
                        <router-link to="/admin/users" class="nav-link">Manage User</router-link>
                    </nav>
                </li>

                <li class="nav-item">
                    <router-link to="/admin/roles" class="nav-link">Roles</router-link>
                    <nav class="nav subnav flex-column">
                        <router-link to="/admin/roles" class="nav-link">Manage Roles</router-link>
                    </nav>
                </li>

                <li class="nav-item">
                    <router-link to="/admin/permissions" class="nav-link">Permissions</router-link>
                    <nav class="nav subnav flex-column">
                        <router-link to="/admin/permissions" class="nav-link">Manage Permissions</router-link>
                    </nav>
                </li>

                <li class="nav-item">
                    <router-link to="/admin/settings" class="nav-link">Settings</router-link>
                </li>

            </ul>
        </div>
    </div>
</template>

<script setup>
import {  ref, watch, defineProps, defineEmits, computed} from 'vue';

const props = defineProps({
    isActive: {
      type: Boolean,
      default: false
    }
});

const emit = defineEmits(['closeSidebar']);

const activeValue = ref(Boolean(props.isActive));
watch(() => props.isActive, (newVal) => {
  activeValue.value = newVal;
});

const offCanvas = computed(() => {
      return props.isActive ? 'offcanvas' : 'offcanvas-md'
    })

const updateValue = () => {
    
    // remove Bootstrap styles from body tag
    var bodyElem = document.getElementsByTagName("body")[0];
    bodyElem.removeAttribute("style");
    // delete element that activates overlay
    Array.from(document.getElementsByClassName("offcanvas-backdrop"))
    .forEach(element => element.remove());
    activeValue.value = false;
    // updates the value of the variable that activates the menu
    emit('closeSidebar', activeValue.value);
};

</script>
<style>
.nav-header {
    border-bottom: 1px solid rgba(76,103,118,.15);
    margin-bottom: 1rem;
}

.nav-header_title {
    font-size: 20px;
    font-weight: bold;
}

.nav-header_title a,
.nav-header_title .nav-link {
color: #524aac;
}

.nav-header_title span {
    font-weight: 400;
    font-size: 18px;
}
.nav-header_body {
    padding: 0.5rem 1rem;
}

</style>