import { UserRolesEnum } from '@/api/types/common'
import { UserAuthEnum, UserStatusEnum } from '@/api/types/userManagement'

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
    value: UserStatusEnum.Normal,
    tagType: 'success',
    actionType: 'danger',
    action: '禁用'
  },
  {
    label: '已封禁',
    value: UserStatusEnum.Banned,
    tagType: 'danger',
    actionType: 'success',
    action: '启用'
  }
]
