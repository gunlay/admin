import request from '@/const/request'
import { UserlistDTO, UserListParams, UserStatusEnum } from './types/userManagement'
import { PageParams } from './types/common'

export const userAuthApi = {
  fetchUserAuthList: async (params: UserListParams & PageParams) => {
    return request
      .post<{
        list: UserlistDTO[]
        total: number
      }>('codePlatform/user/auth/page', params)
      .then(res => res)
  },
  updateUser: async (params: { userStatus: UserStatusEnum; userId: string }) => {
    return request.post<boolean>('codePlatform/user/enable', params).then(res => res)
  }
}
export default userAuthApi
