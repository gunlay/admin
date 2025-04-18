import { UserAuthEnum, UserRolesEnum } from '@/api/types/userManagement'

export const UserRoleList = [
  {
    label: '普通',
    value: UserRolesEnum.Normal
  },
  {
    label: '程序员',
    value: UserRolesEnum.Programmer
  }
]
export const UserAuthList = [
  {
    label: '未认证',
    value: UserAuthEnum.Authing,
    type: 'info'
  },
  {
    label: '已认证',
    value: UserAuthEnum.Authed,
    type: 'success'
  },
  {
    label: '认证失败',
    value: UserAuthEnum.Denied,
    type: 'danger'
  }
]

export const UserStatusList = [
  {
    label: '正常',
    value: 0,
    type: 'success'
  },
  {
    label: '已封禁',
    value: 1,
    type: 'danger'
  },
  {
    label: '已注销',
    value: 2,
    type: 'info'
  }
]
