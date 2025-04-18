import { PageParams } from '@/api/types/common'

export interface ApiResponse<T> {
  data: T[]
  total: number
}

export type PostData<U> = U & Partial<PageParams>

export interface GridExpose<T, U> {
  loadData: (params?: PostData<U>) => Promise<ApiResponse<T> | null>
  reload: () => Promise<ApiResponse<T> | null>
  getTableData: () => T[]
}
