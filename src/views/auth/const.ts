import { UserAuthEnum, UserAuthorizationEnum } from '@/api/types/userAuth'

export const UserAuthorizationList = [
  {
    label: '工作认证',
    value: UserAuthorizationEnum.WorkAuthorization
  },
  {
    label: '技能认证',
    value: UserAuthorizationEnum.TechAuthorization
  }
]
export const UserAuthList = [
  {
    label: '审核中',
    value: UserAuthEnum.Authing,
    type: 'info'
  },
  {
    label: '审核通过',
    value: UserAuthEnum.Authed,
    type: 'success'
  },
  {
    label: '审核失败',
    value: UserAuthEnum.Denied,
    type: 'danger'
  }
]
