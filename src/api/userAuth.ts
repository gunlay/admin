import request from '@/const/request'
import { PageParams } from './types/common'
import { UserAuthlistDTO, UserAuthParams } from './types/userAuth'

export const userAuthApi = {
  fetchUserAuthList: async (params: UserAuthParams & PageParams) => {
    return request
      .post<{
        list: UserAuthlistDTO[]
        total: number
      }>('codePlatform/user/auth/page', params)
      .then(res => res)
  },
  fetchUserAuthDetail: async (params: { userId: string }) => {
    return request.post<UserAuthlistDTO>('codePlatform/user/auth/detail', params).then(res => res)
  }
}
export default userAuthApi
