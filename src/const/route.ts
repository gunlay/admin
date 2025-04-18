import { createRouter } from 'vue-router'
import { history } from './history'
import menuList from './menu'
import { createRoutesFromMenu } from '@/utils/menuToRoutes'

// 路由守卫
const routerGuard = (router: any) => {
  router.beforeEach((to: any, _: any, next: any) => {
    if (to.path !== '/login') {
      const isAuthenticated = localStorage.getItem('login_token')
      if (!isAuthenticated) {
        next('/login')
        return
      }
    }
    next()
  })

  return router
}
const routes = createRoutesFromMenu(menuList)

// 导出routes以供其他模块使用
export { routes }

console.log(routes)

const router = routerGuard(createRouter({ history, routes }))

export default router
