import request from '@/const/request'
import { PageParams } from './types/common'
import { UserAuthDetailDTO, UserAuthlistDTO, UserAuthParams } from './types/userAuth'

export const userAuthApi = {
  fetchUserAuthList: async (params: UserAuthParams & PageParams) => {
    return request
      .post<{
        list: UserAuthlistDTO[]
        total: number
      }>('codePlatform/user/auth/page', params)
      .then(res => res)
  },
  fetchUserAuthDetail: async (params: { id: string }) => {
    return request.get<UserAuthDetailDTO>('codePlatform/user/auth/detail', params).then(res => res)
  }
}
export default userAuthApi
