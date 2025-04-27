import { UserRolesEnum } from '@/api/types/common'

import { UserPubServiceType, UserPubStatusEnum } from '@/api/types/userCotent'

export const UserPubStatusList = [
  {
    label: '审核中',
    value: UserPubStatusEnum.Pubing,
    type: 'info'
  },
  {
    label: '审核通过',
    value: UserPubStatusEnum.Pubed,
    type: 'success'
  },
  {
    label: '审核失败',
    value: UserPubStatusEnum.PubDenied,
    type: 'danger'
  }
]
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

export const UserPubServiceTypeList = [
  {
    label: '线上',
    value: UserPubServiceType.Online
  },
  {
    label: '线下',
    value: UserPubServiceType.Offline
  }
]
