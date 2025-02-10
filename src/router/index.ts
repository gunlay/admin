import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/',
      name: 'Layout',
      component: () => import('../layout/index.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('../views/Dashboard.vue'),
          meta: { title: '首页' }
        },
        {
          path: 'users',
          name: 'Users',
          component: () => import('../views/Users.vue'),
          meta: { title: '用户管理' }
        },
        {
          path: 'auth',
          name: 'Auth',
          component: () => import('../views/Auth.vue'),
          meta: { title: '认证管理' }
        },
        {
          path: 'content',
          name: 'Content',
          component: () => import('../views/Content.vue'),
          meta: { title: '发布内容管理' }
        },
        {
          path: 'categories',
          name: 'Categories',
          component: () => import('../views/Categories.vue'),
          meta: { title: '分类&标签管理' }
        },
        {
          path: 'orders',
          name: 'Orders',
          component: () => import('../views/Orders.vue'),
          meta: { title: '订单管理' }
        },
        {
          path: 'invitations',
          name: 'Invitations',
          component: () => import('../views/Invitations.vue'),
          meta: { title: '邀请管理' }
        },
        {
          path: 'coupons',
          name: 'Coupons',
          component: () => import('../views/Coupons.vue'),
          meta: { title: '券码管理' }
        },
        {
          path: 'complaints',
          name: 'Complaints',
          component: () => import('../views/Complaints.vue'),
          meta: { title: '投诉管理' }
        },
        {
          path: 'help-settings',
          name: 'HelpSettings',
          component: () => import('../views/HelpSettings.vue'),
          meta: { title: '帮助中心配置' }
        },
        {
          path: 'feedback',
          name: 'Feedback',
          component: () => import('../views/Feedback.vue'),
          meta: { title: '意见反馈管理' }
        },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('../views/Settings.vue'),
          meta: { title: '通用配置' }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    const isAuthenticated = localStorage.getItem('token')
    if (!isAuthenticated) {
      next('/login')
      return
    }
  }
  next()
})

export default router 