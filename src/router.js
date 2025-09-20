import { createWebHistory, createRouter } from "vue-router";
import { useAuthStore } from './stores/authStore';

const routes =  [
    {
      path: "/",
      alias: "/home",
      name: "home",
      component: () => import("./components/layout/AppHome"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/index',
      name: 'index', 
      component: () => import("./views/IndexView.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/login',
      name: 'login', 
      component: () => import("./views/LoginView.vue"),
      meta: { requiresAuth: false, isPublic: true }
    },
    { 
      path: '/logout',
      name: 'logout', 
      component: () => import("./views/LogoutView.vue"),
      meta: { requiresAuth: true }
    },
    { 
      path: '/register',
      name: 'register', 
      component: () => import("./views/RegisterView.vue"),
      meta: { requiresAuth: false, isPublic: true }
    },
    {
      path: '/password/recover',
      name: 'password-recover',
      component: () => import('./views/PasswordRecoverView.vue'),
      meta: { requiresAuth: false, isPublic: true }
    },
    {
      path: '/password/reset/',
      name: 'password-reset',
      component: () => import('./views/PasswordResetView.vue'),
      meta: { requiresAuth: false, isPublic: true }
    },
    { 
      path: '/docs',
      name: 'docs', 
      component: () => import("./views/DocsView.vue"),
      meta: { requiresAuth: true }
    },

    {
      path: '/',
      redirect: '/home'
    },
    
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    },

    // Users

    { 
      path: '/user',
      name: 'user', 
      component: () => import("./components/user/UserDetail.vue"),
      meta: { requiresAuth: true }
    },

    // Admins

    { 
      path: '/admin',
      name: 'admin', 
      component: () => import("./components/admin/AdminIndex"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/admin/settings',
      name: 'admin.settings', 
      component: () => import("./components/admin/AdminSettings.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/admin/profile',
      name: 'admin.profile', 
      component: () => import("./components/admin/AdminProfile.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/admin/roles',
      name: 'admin.roles', 
      component: () => import("./components/admin/RoleIndex.vue"),
      meta: { requiresAuth: true }
    },

    {
      path: "/roles/:id",
      name: "roles.details",
      component: () => import("./components/roles/RoleDetail"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/admin/permissions',
      name: 'admin.permissions', 
      component: () => import("./components/admin/PermissionIndex.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/admin/users',
      name: 'admin.users', 
      component: () => import("./components/admin/AdminIndex.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/admin/categories',
      name: 'admin.categories', 
      component: () => import("./components/admin/AdminCategory.vue"),
      meta: { requiresAuth: true }
    },
    
    { 
      path: '/admin/articles',
      name: 'admin.articles', 
      component: () => import("./components/admin/AdminArticle.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/admin/articles/new',
      name: 'admin.articles.new', 
      component: () => import("./components/articles/CreateArticle.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/admin/articles/:id/edit',
      name: 'admin.articles.edit', 
      component: () => import("./components/articles/EditArticle.vue"),
      meta: { requiresAuth: true }
    },

    { 
      path: '/admin/articles/view',
      name: 'admin.articles.view', 
      component: () => import("./components/articles/ViewArticle.vue"),
      meta: { requiresAuth: true }
    },

  ];
  
  const router = createRouter({
    history: createWebHistory(process.env.VUE_APP_URL),
    linkActiveClass: 'active',
    routes,
  });

let isAppInitialized = false

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (!isAppInitialized) {
    try {
      await authStore.initialize()
      isAppInitialized = true
    } catch (error) {
      console.error('Erro na inicialização:', error)
      isAppInitialized = true
    }
  }

  const publicRoutes = ['login', 'register', 'password-recover', 'password-reset']
  const isPublicRoute = publicRoutes.includes(to.name) || to.meta.isPublic
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } 
  else if (authStore.isAuthenticated && isPublicRoute) {
    next()
  }  
  else {
    next()
  }
})

export default router