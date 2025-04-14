import { RouteRecordRaw } from 'vue-router'
import Layout from '@/Components/Layout/index.vue'

export interface MenuItem {
  id: string
  name: string
  url: string
  icon?: string
  meta?: {
    title: string
    [key: string]: any
  }
  children?: MenuItem[]
}

/**
 * 动态导入组件
 * 使用Vite支持的动态导入语法
 * @param componentPath 组件路径
 */
function loadComponent(componentPath: string) {
  // 使用Vite的glob导入，允许构建工具在编译时收集所有可能的导入
  return async () => {
    try {
      // 格式化路径
      const path = componentPath.startsWith('/') ? componentPath.substring(1) : componentPath

      // 动态导入组件
      return await import(`../views/${path}/index.vue`)
    } catch (error) {
      console.error(`加载组件失败: ${componentPath}`, error)
      // 加载失败时返回错误提示组件
      return {
        template: `<div class="error-component">无法加载组件: ${componentPath}</div>`
      }
    }
  }
}

/**
 * 将菜单配置转换为路由配置
 * @param menuList 菜单列表
 * @returns 路由配置数组
 */
export function menuToRoutes(menuList: MenuItem[]): RouteRecordRaw[] {
  // 创建登录路由
  const loginRoute: RouteRecordRaw = {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录'
    }
  }

  // 创建根路由
  const rootRoute: RouteRecordRaw = {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: {
      title: '系统管理'
    },
    children: [] as RouteRecordRaw[]
  }

  // 处理菜单项，转换为子路由
  const processMenuItems = (items: MenuItem[], parentPath: string = ''): RouteRecordRaw[] => {
    return items.map(item => {
      // 处理路径，确保格式正确
      const path = item.url.startsWith('/')
        ? item.url.substring(1) // 去掉开头的斜杠
        : item.url

      const route = {
        path,
        name: item.name,
        component: loadComponent(path),
        meta: item.meta || { title: item.name },
        children: undefined as RouteRecordRaw[] | undefined
      } as RouteRecordRaw

      // 如果有子菜单，递归处理
      if (item.children && item.children.length > 0) {
        route.children = processMenuItems(item.children, `${parentPath}${path}/`)
      }

      return route
    })
  }

  // 将菜单项转换为子路由并添加到根路由
  rootRoute.children = processMenuItems(menuList)

  // 返回完整的路由配置
  return [loginRoute, rootRoute]
}

/**
 * 创建路由
 * @param menuList 菜单列表
 * @returns Vue Router实例
 */
export function createRoutesFromMenu(menuList: MenuItem[]): RouteRecordRaw[] {
  return menuToRoutes(menuList)
}

// 示例使用
/*
import { createRouter } from 'vue-router'
import { history } from '@/const/history'
import { menuList } from '@/const/menu'

const routes = createRoutesFromMenu(menuList)
export const router = createRouter({ history, routes })
*/
