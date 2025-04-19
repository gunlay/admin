import { SelectOptions, UserRolesEnum } from './common'

export enum UserAuthEnum {
  Authing = 0,
  Authed = 1,
  Denied = 2
}
export enum UserStatusEnum {
  Normal = 0,
  Banned = 1
}

export type UserListParams = {
  authStatus?: UserAuthEnum & SelectOptions
  phone?: string
  role?: UserRolesEnum & SelectOptions
  userName?: string
}

export type UserlistDTO = {
  authStatus: UserAuthEnum & SelectOptions
  createTime: string
  id: string
  phone: string
  role: UserRolesEnum & SelectOptions
  userStatus: UserStatusEnum & SelectOptions
  username: string
}

export type UserListResponse = {
  list: UserlistDTO[]
  total: number
}
