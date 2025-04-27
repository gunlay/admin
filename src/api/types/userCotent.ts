import { SelectOptions, UserRolesEnum } from './common'

export enum UserPubStatusEnum {
  Pubing = 0,
  Pubed = 1,
  PubDenied = 2
}

export enum UserPubServiceType {
  Online = 0,
  Offline = 1
}

export type UserPostParams = {
  authStatus?: UserPubStatusEnum & SelectOptions
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
  deliveryCycle: number
  id: number
  image: string
  postFile: string
  price: number
  restTime: string
  serviceType: UserPubServiceType
  status: number
  title: string
  userId: number
  workTime: string
}
