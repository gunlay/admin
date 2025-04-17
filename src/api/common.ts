import request from '@/const/request'

export const commonApi = {
  login: async (params: { password: string; phone: number }) => {
    return request.post<{ token: string }>('codePlatform/sys/auth/login', params).then(res => res)
  }
}

export default commonApi
