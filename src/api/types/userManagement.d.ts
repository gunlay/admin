export type UserListParams = {
  authStatus?: number
  phone?: string
  role?: number
  userName?: string
}

export type UserlistDTO = {
  authStatus: string
  createTime: string
  id: string
  phone: string
  role: string
  userStatus: string
  username: string
}

export type UserListResponse = {
  list: UserlistDTO[]
  total: number
}
