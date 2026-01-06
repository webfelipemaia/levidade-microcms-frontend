<template>
    <div :class="[offCanvas, { 'show': isActive }]" class="sidebar leve offcanvas-start" tabindex="-1"
        id="offcanvasExample" aria-labelledby="offcanvasSidebarMenu" ref="offcanvas">
        <div class="offcanvas-header">

            <h5 class="offcanvas-title" id="offcanvasSidebarMenu">Navbar</h5>
            <button @click="updateValue" type="button" class="btn-close" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body flex-shrink-0 p-3 mt-5">
        
        <ul class="nav offcanvas-nav nav-pills flex-column mb-auto">
            <li class="nav-item">
                <router-link to="/home" class="nav-link" active-class="active" exact-active-class="active">
                    <i class="bi bi-house me-2"></i>
                    <span class="menu-text">Dashboard</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/admin/articles" class="nav-link" active-class="active">
                    <i class="bi bi-file-text me-2"></i>
                    <span class="menu-text">Articles</span>
                </router-link>
            </li>

            <li class="nav-item">
                <router-link to="/admin/categories" class="nav-link" active-class="active">
                    <i class="bi bi-collection me-2"></i>
                    <span class="menu-text">Categories</span>
                </router-link>
            </li>

            <!-- Menu Usuários com subitens colapsíveis -->
            <li class="nav-item">
                <a class="nav-link collapsed d-flex justify-content-between" data-bs-toggle="collapse" href="#usuariosCollapse" role="button"
                    aria-expanded="false" aria-controls="usuariosCollapse"
                    :class="{ active: isUsersMenuActive, collapsed: !isUsersMenuActive }">
                    <i class="bi bi-people me-2"></i>
                    <span class="menu-text">Usuários</span>
                    <i class="bi bi-chevron-down menu-arrow"></i>
                </a>
                <div class="collapse submenu" id="usuariosCollapse"
                     :class="{ show: isUsersMenuActive }">
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <router-link to="/admin/users" class="nav-link" active-class="active">
                                <span class="menu-text">Users</span>
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/admin/roles" class="nav-link" active-class="active">
                                <span class="menu-text">Roles</span>
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/admin/permissions" class="nav-link" active-class="active">
                                <span class="menu-text">Permissions</span>
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link v-if="authStore.hasRole('Administrator')" to="/admin/acl" class="nav-link" active-class="active">
                                <span class="menu-text">Controle de Acesso (ACL)</span>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="nav-item">
                <router-link v-if="authStore.can('users:read')" to="/relatorios" class="nav-link" active-class="active">
                    <i class="bi bi-table me-2"></i>
                    <span class="menu-text">Relatórios</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link v-if="authStore.isAdmin" to="/admin/settings" class="nav-link" active-class="active">
                    <i class="bi bi-gear me-2"></i>
                    <span class="menu-text">Configurações</span>
                </router-link>
            </li>
        </ul>
    </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const props = defineProps({
    isActive: {
        type: Boolean,
        default: false
    }
});

const route = useRoute();
const emit = defineEmits(['closeSidebar']);

const authStore = useAuthStore();

const activeValue = ref(Boolean(props.isActive));
watch(() => props.isActive, (newVal) => {
    activeValue.value = newVal;
});

const offCanvas = computed(() => {
    return props.isActive ? 'offcanvas' : 'offcanvas-md'
})

const updateValue = () => {

    var bodyElem = document.getElementsByTagName("body")[0];
    bodyElem.removeAttribute("style");

    Array.from(document.getElementsByClassName("offcanvas-backdrop"))
        .forEach(element => element.remove());
    activeValue.value = false;

    emit('closeSidebar', activeValue.value);
};

const isUsersMenuActive = computed(() => {
            const usersRoutes = [
                'admin.users',
                'admin.roles', 
                'admin.permissions',
                'admin.acl',
                'roles.edit',
                'roles.permissions',
                'permission.edit'
            ];
            
            return usersRoutes.includes(route.name);
        });
     
</script>
<style>
.nav-header {
    border-bottom: 1px solid rgba(76, 103, 118, .15);
    margin-bottom: 1rem;
}

.nav-header_title {
    font-size: 20px;
    font-weight: normal;
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

.offcanvas-body {
    padding: 0;
}

.nav-link {
    font-weight: 500;
    color: #333;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    border-radius: 0;
    border-left: 3px solid transparent;
}

.nav-link:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.nav-link.active {
    background-color: #e7f1ff;
    color: #0d6efd;
    border-left-color: #0d6efd;
}

.nav-link .menu-text {
    flex-grow: 1;
}

.nav-link .menu-arrow {
    margin-left: auto;
    transition: transform 0.2s ease-in-out;
}

.nav-link:not(.collapsed) .menu-arrow,  
a[data-bs-toggle=collapse][aria-expanded=true] .menu-arrow {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
}

.nav-link[data-bs-toggle=collapse][aria-expanded=true].active {
    background-color: rgba(0, 0, 0, 0.15);
    color: #333;
}

.nav-link[data-bs-toggle=collapse][aria-expanded=true].active i,
.nav-link[data-bs-toggle=collapse][aria-expanded=true].active .menu-text {
    color: #333;
}

.submenu {
    background-color: rgba(0, 0, 0, 0.02);
}

.submenu .nav-link {
    padding-left: 2.5rem;
    font-size: 0.9rem;
    border-left: none;
}

.submenu .nav-link.active {
    background-color: rgba(13, 110, 253, 0.1);
    color: #0d6efd;
    font-weight: 500;
}
</style>
