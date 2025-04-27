import request from '@/const/request'
import { PageParams } from './types/common'
import {
  UserPostDetail,
  UserPostlistDTO,
  UserPostParams,
  UserPubStatusEnum
} from './types/userCotent'

export const userPostApi = {
  fetchUserPostList: async (params: UserPostParams & PageParams) => {
    return request
      .post<{
        list: UserPostlistDTO[]
        total: number
      }>('codePlatform/user/post/page', params)
      .then(res => res)
  },
  fetchUserPostDetail: async (params: { id: string }) => {
    return request.get<UserPostDetail>('codePlatform/user/post/info', params).then(res => res)
  },
  reviewUserPost: async (params: { id: number; status: UserPubStatusEnum }) => {
    return request.post<boolean>('codePlatform/user/post/review', params).then(res => res)
  }
}
export default userPostApi
