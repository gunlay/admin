import { RouteRecordRaw } from 'vue-router'

export const menuList = [
  {
    id: '1',
    name: '首页',
    url: '/',
    redirect: '/dashboard',
    meta: {
      title: '系统管理'
    },
    children: [
      {
        id: '1.1',
        name: '首页',
        url: '/dashboard',
        icon: 'dashboard',
        meta: {
          title: '首页'
        }
      },
      {
        id: '1.2',
        name: '用户管理',
        url: '/users',
        icon: 'user',
        meta: {
          title: '用户管理'
        }
      },
      {
        id: '1.3',
        name: '认证管理',
        url: '/auth',
        icon: 'shield',
        meta: {
          title: '认证管理'
        }
      },
      {
        id: '1.4',
        name: '内容管理',
        url: '/content',
        icon: 'file',
        meta: {
          title: '发布内容管理'
        }
      },
      {
        id: '1.5',
        name: '分类标签',
        url: '/categories',
        icon: 'tag',
        meta: {
          title: '分类&标签管理'
        }
      }
    ]
  },
  {
    id: '2',
    name: '业务管理',
    url: '/business',
    meta: {
      title: '业务管理'
    },
    children: [
      {
        id: '2.1',
        name: '订单管理',
        url: '/orders',
        icon: 'shopping-cart',
        meta: {
          title: '订单管理'
        }
      },
      {
        id: '2.2',
        name: '邀请管理',
        url: '/invitations',
        icon: 'user-add',
        meta: {
          title: '邀请管理'
        }
      },
      {
        id: '2.3',
        name: '券码管理',
        url: '/coupons',
        icon: 'gift',
        meta: {
          title: '券码管理'
        }
      }
    ]
  },
  {
    id: '3',
    name: '系统设置',
    url: '/system',
    meta: {
      title: '系统设置'
    },
    children: [
      {
        id: '3.1',
        name: '投诉管理',
        url: '/complaints',
        icon: 'message',
        meta: {
          title: '投诉管理'
        }
      },
      {
        id: '3.2',
        name: '帮助中心',
        url: '/help-settings',
        icon: 'question-circle',
        meta: {
          title: '帮助中心配置'
        }
      },
      {
        id: '3.3',
        name: '意见反馈',
        url: '/feedback',
        icon: 'comment',
        meta: {
          title: '意见反馈管理'
        }
      },
      {
        id: '3.4',
        name: '通用配置',
        url: '/settings',
        icon: 'setting',
        meta: {
          title: '通用配置'
        }
      }
    ]
  }
]

const getRoutes = (menuList: any[]): RouteRecordRaw[] => {
  const routes: RouteRecordRaw[] = []

  const generateRoutes = (menus: any[]) => {
    menus.forEach(menu => {
      if (menu.children && menu.children.length > 0) {
        generateRoutes(menu.children)
      } else {
        const route: RouteRecordRaw = {
          path: menu.url,
          name: menu.name,
          component: () => import(`../views${menu.url}.vue`),
          meta: menu.meta
        }
        routes.push(route)
      }
    })
  }

  generateRoutes(menuList)
  return routes
}

export default getRoutes
