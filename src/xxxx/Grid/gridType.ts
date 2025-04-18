import { PageParams } from '@/api/types/common'

export interface ApiResponse<T> {
  data: T[]
  total: number
}

export interface PostData extends PageParams {
  [key: string]: unknown
}

export interface GridExpose<T> {
  loadData: (params?: PostData) => Promise<ApiResponse<T> | null>
  reload: () => Promise<ApiResponse<T> | null>
  getTableData: () => T[]
}
