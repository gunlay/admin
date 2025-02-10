import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

export const locale = {
  ...zhCn,
  el: {
    ...zhCn.el,
    pagination: {
      ...zhCn.el.pagination,
      pagesize: '条/页'
    }
  }
} 