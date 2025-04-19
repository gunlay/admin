import { SelectOptions } from './common'

export enum UserAuthorizationEnum {
  TechAuthorization = 0,
  WorkAuthorization = 1
}
export enum UserAuthEnum {
  Authing = 0,
  Authed = 1,
  Denied = 2
}

export type UserAuthParams = {
  authStatus?: UserAuthEnum & SelectOptions
  phone?: string
  type?: UserAuthorizationEnum & SelectOptions
  userName?: string
}

export type UserAuthlistDTO = {
  authStatus: UserAuthEnum & SelectOptions
  createTime: string
  authType: UserAuthorizationEnum & SelectOptions
  id: string
  phone: string
  reviewTime: string
  username: string
}

export type UserListResponse = {
  list: UserAuthlistDTO[]
  total: number
}
