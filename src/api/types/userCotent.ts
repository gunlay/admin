import { SelectOptions, UserRolesEnum } from './common'

export enum UserPubStatusEnum {
  Pubing = 0,
  Pubed = 1,
  PubDenied = 2
}

export type UserPostParams = {
  pubStatus?: UserPubStatusEnum & SelectOptions
  phone?: string
  role?: UserRolesEnum & SelectOptions
  userName?: string
}

export type UserPostlistDTO = {
  createTime: string
  id: string
  phone: string
  pubStatus: UserPubStatusEnum & SelectOptions
  reviewTime: string
  role: UserRolesEnum & SelectOptions
  username: string
}

export type UserPostListResponse = {
  list: UserPostlistDTO[]
  total: number
}

export type UserPostDetail = {
  content: string
  createTime: string
  id: number
  price: number
  status: number
  timeEinmal: number
  title: string
  userId: string
}
