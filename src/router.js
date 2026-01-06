import { createWebHistory, createRouter } from "vue-router";
import { useAuthStore } from '@/stores/authStore';
import { useAclStore } from "./stores/aclStore";

const routes =  [
    {
      path: "/",
      alias: "/home",
      name: "home",
      component: () => import("@/components/layout/AppHome.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/index',
      name: 'index', 
      component: () => import("@/views/public/IndexView.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/login',
      name: 'login', 
      component: () => import("@/views/public/LoginView.vue"),
      meta: { requiresAuth: false, isPublic: true }
    },
    { 
      path: '/logout',
      name: 'logout', 
      component: () => import("@/views/public/LogoutView.vue"),
      meta: { requiresAuth: true }
    },
    { 
      path: '/register',
      name: 'register', 
      component: () => import("@/views/public/RegisterView.vue"),
      meta: { requiresAuth: false, isPublic: true }
    },
    {
      path: '/password/recover',
      name: 'password-recover',
      component: () => import('@/views/public/PasswordRecoverView.vue'),
      meta: { requiresAuth: false, isPublic: true }
    },
    {
      path: '/password/reset/',
      name: 'password-reset',
      component: () => import('@/views/public/PasswordResetView.vue'),
      meta: { requiresAuth: false, isPublic: true }
    },
    { 
      path: '/docs',
      name: 'docs', 
      component: () => import("@/views/public/DocsView.vue"),
      meta: { requiresAuth: true }
    },

    {
      path: '/',
      redirect: '/home'
    },

    {
      path: '/error/:code',
      name: 'error',
      component: () => import('@/views/public/ErrorView.vue'),
      props: true
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/public/ErrorView.vue'),
      meta: { defaultCode: '404' }
    },

    // Users

    { 
      path: '/user',
      name: 'user', 
      component: () => import("@/views/admin/user/UserDetail.vue"),
      meta: { requiresAuth: true }
    },

    // Admins

    { 
      path: '/admin',
      name: 'admin', 
      component: () => import("@/views/admin/admin/AdminIndex.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/admin/settings',
      name: 'admin.settings', 
      component: () => import("@/views/admin/admin/AdminSettings.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/admin/profile',
      name: 'admin.profile', 
      component: () => import("@/views/admin/admin/AdminProfile.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/admin/profile/avatar',
      name: 'admin.profile.avatar', 
      component: () => import("@/views/admin/user/UploadAvatar.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/admin/roles',
      name: 'admin.roles', 
      component: () => import("@/views/admin/admin/AdminRole.vue"),
      meta: { requiresAuth: true }
    },

    {
      path: "/admin/roles/:id/edit",
      name: "roles.edit",
      component: () => import("@/views/admin/roles/RoleEdit.vue"),
      meta: { requiresAuth: true }
    },

    {
      path: "/admin/roles/:id/permissions",
      name: "roles.edit",
      component: () => import("@/views/admin/roles/RolePermissions.vue"),
      meta: { requiresAuth: true }
    },    

    { 
      path: '/admin/permissions',
      name: 'admin.permissions', 
      component: () => import("@/views/admin/admin/AdminPermission.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/admin/permission/:id/edit',
      name: 'permission.edit', 
      component: () => import("@/views/admin/permissions/PermissionEdit.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/admin/users',
      name: 'admin.users', 
      component: () => import("@/views/admin/admin/AdminIndex.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/admin/categories',
      name: 'admin.categories', 
      component: () => import("@/views/admin/admin/AdminCategory.vue"),
      meta: { requiresAuth: true }
    },
    
    { 
      path: '/admin/articles',
      name: 'admin.articles', 
      component: () => import("@/views/admin/admin/AdminArticle.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/admin/articles/new',
      name: 'admin.articles.new', 
      component: () => import("@/views/admin/articles/CreateArticle.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/admin/articles/:id/edit',
      name: 'admin.articles.edit', 
      component: () => import("@/views/admin/articles/EditArticle.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/admin/articles/view',
      name: 'admin.articles.view', 
      component: () => import("@/views/admin/articles/ViewArticle.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/admin/acl',
      name: 'admin.acl', 
      component: () => import("@/views/admin/admin/AdminAcl.vue"),
      meta: { requiresAuth: true }
    },

  ];
  
  const router = createRouter({
    history: createWebHistory(import.meta.env.VUE_APP_URL),
    linkActiveClass: 'active',
    routes,
  });


  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const aclStore = useAclStore()
    
    const publicPages = ['login', 'register', 'password-recover', 'password-reset', 'error']
    const isPublicPage = publicPages.includes(to.name)
  
    // 1. Se for pública (incluindo a página de erro), libera direto
    if (isPublicPage) {
      return next()
    }
  
    // 2. Garante que o estado de autenticação foi checado
    if (!authStore.authChecked) {
      try {
        await authStore.checkAuth()
      } catch (error) {
        return next({ name: 'login' })
      }
    }
  
    // 3. Se não estiver autenticado, vai para login
    if (!authStore.isAuthenticated) {
      return next({ name: 'login' })
    }
  
    // 4. Carrega permissões se necessário (apenas se logado e array vazio)
    if (authStore.isAuthenticated && aclStore.userPermissions.length === 0) {
      try {
        await aclStore.fetchUserPermissions(authStore.user.id)
      } catch (error) {
        console.error("Erro ao carregar permissões:", error)
        // Opcional: redirecionar para erro 500 se falhar drasticamente
      }
    }
  
    // 5. Verifica permissão específica da rota
    const requiredPermission = to.meta.permission
    if (requiredPermission) {
      if (!authStore.can(requiredPermission)) {
        console.warn(`Acesso negado para a permissão: ${requiredPermission}`)
        // Redireciona diretamente para a página de erro 403
        return next({ name: 'error', params: { code: '403' } })
      }
    }
  
    // 6. Se passou por tudo, autoriza o acesso
    next()
  })
  
  

export default router