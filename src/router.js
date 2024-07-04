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
      path: "/roles",
      name: "role",
      component: () => import("./components/roles/RoleList")
    },
    {
      path: "/roles/:id",
      name: "roles-details",
      component: () => import("./components/roles/RoleDetail")
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
      component: () => import("./components/roles/RoleList.vue")
    },

    // Admins

    { 
      path: '/admin',
      name: 'admin', 
      component: () => import("./components/admin/AdminIndex")
    },

    { 
      path: '/roles2',
      name: 'roles2', 
      component: () => import("./components/admin/RoleIndex.vue")
    },

    { 
      path: '/admin/profile',
      name: 'admin/profile', 
      component: () => import("./components/admin/AdminProfile.vue")
    }
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