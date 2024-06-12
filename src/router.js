import { createWebHistory, createRouter } from "vue-router";
import { useAuthStore } from './stores/authStore';

const routes =  [
    {
      path: "/",
      alias: "/home",
      name: "home",
      component: () => import("./components/AppHome")
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
      path: "/roles/create",
      name: "roles-create",
      component: () => import("./components/roles/RoleCreate")
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