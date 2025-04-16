import request from '@/const/request'
import { UserlistDTO, UserListParams } from './types/userManagement'
import { PageParams } from './types/common'

export const userManagementApi = {
  fetchUserList: async (params: UserListParams & PageParams) => {
    return request
      .post<{
        list: UserlistDTO[]
        total: number
      }>('codePlatform/user/page', params)
      .then(res => res)
  }
}

export default userManagementApi
