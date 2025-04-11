import { createRouter, RouteRecordRaw } from 'vue-router'
import Layout from '@/Components/Layout/index.vue'
import { history } from './history'

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/',
    redirect: '/dashboard',
    meta: {
      title: '系统管理'
    },
    component: Layout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/Users.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'auth',
        name: 'Auth',
        component: () => import('@/views/Auth.vue'),
        meta: { title: '认证管理' }
      },
      {
        path: 'content',
        name: 'Content',
        component: () => import('@/views/Content.vue'),
        meta: { title: '发布内容管理' }
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/views/Categories.vue'),
        meta: { title: '分类&标签管理' }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/Orders.vue'),
        meta: { title: '订单管理' }
      },
      {
        path: 'invitations',
        name: 'Invitations',
        component: () => import('@/views/Invitations.vue'),
        meta: { title: '邀请管理' }
      },
      {
        path: 'coupons',
        name: 'Coupons',
        component: () => import('@/views/Coupons.vue'),
        meta: { title: '券码管理' }
      },
      {
        path: 'complaints',
        name: 'Complaints',
        component: () => import('@/views/Complaints.vue'),
        meta: { title: '投诉管理' }
      },
      {
        path: 'help-settings',
        name: 'HelpSettings',
        component: () => import('@/views/HelpSettings.vue'),
        meta: { title: '帮助中心配置' }
      },
      {
        path: 'feedback',
        name: 'Feedback',
        component: () => import('@/views/Feedback.vue'),
        meta: { title: '意见反馈管理' }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue'),
        meta: { title: '通用配置' }
      }
    ]
  }
]

// 路由守卫
const routerGuard = (router: any) => {
  router.beforeEach((to: any, _: any, next: any) => {
    if (to.path !== '/login') {
      const isAuthenticated = localStorage.getItem('token')
      if (!isAuthenticated) {
        next('/login')
        return
      }
    }
    next()
  })

  return router
}

export const router = routerGuard(createRouter({ history, routes }))
