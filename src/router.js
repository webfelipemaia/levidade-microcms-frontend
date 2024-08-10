import { createWebHistory, createRouter } from "vue-router";
import { useAuthStore } from './stores/authStore';

const routes =  [
    {
      path: "/",
      alias: "/home",
      name: "home",
      component: () => import("./components/layout/AppHome")
    },

    { 
      path: '/index',
      name: 'index', 
      component: () => import("./views/IndexView.vue")
    },

    { 
      path: '/login',
      name: 'login', 
      component: () => import("./views/LoginView.vue")
    },
    { 
      path: '/logout',
      name: 'logout', 
      component: () => import("./views/LogoutView.vue")
    },
    { 
      path: '/register',
      name: 'register', 
      component: () => import("./views/RegisterView.vue")
    },
    { 
      path: '/docs',
      name: 'docs', 
      component: () => import("./views/DocsView.vue")
    },

    // Users

    { 
      path: '/user',
      name: 'user', 
      component: () => import("./components/user/UserDetail.vue")
    },

    // Admins

    { 
      path: '/admin',
      name: 'admin', 
      component: () => import("./components/admin/AdminIndex")
    },

    { 
      path: '/admin/settings',
      name: 'admin.settings', 
      component: () => import("./components/admin/AdminSettings.vue")
    },

    { 
      path: '/admin/profile',
      name: 'admin.profile', 
      component: () => import("./components/admin/AdminProfile.vue")
    },

    { 
      path: '/admin/roles',
      name: 'admin.roles', 
      component: () => import("./components/admin/RoleIndex.vue")
    },

    {
      path: "/roles/:id",
      name: "roles.details",
      component: () => import("./components/roles/RoleDetail")
    },

    { 
      path: '/admin/permissions',
      name: 'admin.permissions', 
      component: () => import("./components/admin/PermissionIndex.vue")
    },

    { 
      path: '/admin/users',
      name: 'admin.users', 
      component: () => import("./components/admin/AdminIndex.vue")
    },

    { 
      path: '/admin/categories',
      name: 'admin.categories', 
      component: () => import("./components/admin/AdminCategory.vue")
    },
    
    { 
      path: '/admin/articles',
      name: 'admin.articles', 
      component: () => import("./components/admin/AdminArticle.vue")
    },

    { 
      path: '/admin/articles/new',
      name: 'admin.articles.new', 
      component: () => import("./components/articles/CreateArticle.vue")
    },

    { 
      path: '/admin/articles/:id/edit',
      name: 'admin.articles.edit', 
      component: () => import("./components/articles/EditArticle.vue")
    },

    { 
      path: '/admin/articles/view',
      name: 'admin.articles.view', 
      component: () => import("./components/articles/ViewArticle.vue"),
    },

  ];
  
  const router = createRouter({
    history: createWebHistory(process.env.VUE_APP_URL),
    linkActiveClass: 'active',
    routes,
  });

  router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login','/register'];
    const authRequired = !publicPages.includes(to.path);
    const auth = useAuthStore();

    if (authRequired && !auth.user) {
        auth.returnUrl = to.fullPath;
        return '/login';
    }
});
  
  export default router;