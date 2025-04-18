export enum UserRolesEnum {
  Normal = 0,
  Programmer = 1
}
export enum UserAuthEnum {
  Authing = 0,
  Authed = 1,
  Denied = 2
}
export enum UserStatusEnum {
  Authing = 0,
  Authed = 1,
  Denied = 2
}

export type UserListParams = {
  authStatus?: UserAuthEnum
  phone?: string
  role?: UserRolesEnum
  userName?: string
}

export type UserlistDTO = {
  authStatus: UserAuthEnum
  createTime: string
  id: string
  phone: string
  role: UserRolesEnum
  userStatus: string
  username: string
}

export type UserListResponse = {
  list: UserlistDTO[]
  total: number
}
