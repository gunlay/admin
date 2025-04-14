import request from '@/const/request'
import { UserListParams } from './types/userManagement'
import { PageParams } from './types/common'

export const userManagementApi = {
  fetchUserList: async (params: UserListParams & PageParams) => {
    return request
      .post<{ token: string; sessionKey: string }>('codePlatform/user/page', params)
      .then(res => res)
  }
}

export default userManagementApi
