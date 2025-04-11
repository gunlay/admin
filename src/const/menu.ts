import { MenuItem } from '@/utils/menuToRoutes'

const menuList: MenuItem[] = [
  {
    id: '1.1',
    name: '首页',
    url: '/dashboard',
    icon: 'HomeFilled',
    meta: {
      title: '首页'
    }
  },
  {
    id: '1.2',
    name: '用户管理',
    url: '/users',
    icon: 'User',
    meta: {
      title: '用户管理'
    }
  },
  {
    id: '1.3',
    name: '认证管理',
    url: '/auth',
    icon: 'Key',
    meta: {
      title: '认证管理'
    }
  },
  {
    id: '1.4',
    name: '内容管理',
    url: '/content',
    icon: 'Document',
    meta: {
      title: '发布内容管理'
    }
  },
  {
    id: '1.5',
    name: '分类标签',
    url: '/categories',
    icon: 'Files',
    meta: {
      title: '分类&标签管理'
    }
  },
  {
    id: '2.1',
    name: '订单管理',
    url: '/orders',
    icon: 'List',
    meta: {
      title: '订单管理'
    }
  },
  {
    id: '2.2',
    name: '邀请管理',
    url: '/invitations',
    icon: 'Message',
    meta: {
      title: '邀请管理'
    }
  },
  {
    id: '2.3',
    name: '券码管理',
    url: '/coupons',
    icon: 'Ticket',
    meta: {
      title: '券码管理'
    }
  },
  {
    id: '3.1',
    name: '投诉管理',
    url: '/complaints',
    icon: 'Warning',
    meta: {
      title: '投诉管理'
    }
  },
  {
    id: '3.2',
    name: '帮助中心',
    url: '/help-settings',
    icon: 'QuestionFilled',
    meta: {
      title: '帮助中心配置'
    }
  },
  {
    id: '3.3',
    name: '意见反馈',
    url: '/feedback',
    icon: 'ChatDotRound',
    meta: {
      title: '意见反馈管理'
    }
  },
  {
    id: '3.4',
    name: '通用配置',
    url: '/settings',
    icon: 'Setting',
    meta: {
      title: '通用配置'
    }
  }
]

export default menuList
