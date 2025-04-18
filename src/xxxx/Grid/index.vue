<template>
  <div class="flex_box">
    <div class="flex_box">
      <el-table
        :data="tableData.data"
        :border="border"
        :load="load"
        :lazy="lazy"
        :row-key="rowKey"
        :default-expand-all="defaultExpandAll"
        :row-style="rowStyle"
        :default-sort="defaultSort"
        show-overflow-tooltip
        stripe
        highlight-current-row
        style="width: 100%; margin-bottom: 12px"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <slot></slot>
      </el-table>
    </div>
    <el-pagination
      v-if="hasPagination"
      :current-page="tableData.currentPage"
      :page-sizes="pageSizes"
      :page-size="tableData.size"
      :layout="layout"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import { PropType, reactive, ref, defineEmits, defineExpose, defineProps } from 'vue'
import { ElPagination, ElTable, TreeNode } from 'element-plus'
import { deepCopy } from '@/utils/helper'
import { GridExpose, ApiResponse, PostData } from './gridType'

interface SortProps {
  prop: string
  order: 'ascending' | 'descending'
}

interface SortChangeEvent {
  column: unknown
  prop: string
  order: string
}

interface TableRecord {
  data: T[]
  currentPage: number
  size: number
  total: number
}

const props = defineProps({
  remoteMethod: {
    type: Function as PropType<(params: PostData) => Promise<ApiResponse<T>>>,
    required: true
  },
  load: {
    type: Function as PropType<
      ((row: T, treeNode: TreeNode, resolve: (data: T[]) => void) => void) | undefined
    >
  },
  lazy: {
    type: Boolean,
    default: false
  },
  defaultExpandAll: {
    type: Boolean,
    default: false
  },
  pageSize: {
    type: Number,
    default: 20
  },
  pageSizes: {
    type: Array as PropType<number[]>,
    default: () => [20, 30, 40, 50, 200]
  },
  rowKey: {
    type: String,
    default: ''
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  pageIndexName: {
    type: String,
    default: 'pageIndex'
  },
  border: {
    type: Boolean,
    default: true
  },
  hasPagination: {
    type: Boolean,
    default: true
  },
  rowStyle: {
    type: Object,
    default: () => ({})
  },
  defaultSort: {
    type: Object as PropType<SortProps>,
    default: () => ({})
  }
})

const emit = defineEmits(['current-change', 'selection-change', 'sort-change'])

const searching = ref<boolean>(false)
const tableData = reactive<TableRecord>({
  data: [] as T[],
  currentPage: 1,
  size: props.pageSize,
  total: 0
})

const postData = ref<PostData>({
  pageIndex: tableData.currentPage,
  pageSize: props.pageSize
})

const handleSelectionChange = (selection: T[]) => {
  emit('selection-change', selection)
}

const handleSortChange = (param: SortChangeEvent) => {
  emit('sort-change', param)
}

const _loadData = async (params?: PostData) => {
  if (!props.remoteMethod) {
    return null
  }
  if (params) postData.value = deepCopy(params)
  postData.value = postData.value || {}
  postData.value[props.pageIndexName] = tableData.currentPage
  postData.value.pageSize = tableData.size
  searching.value = true

  try {
    const response = await props.remoteMethod(postData.value)
    if (response) {
      const responseData = response.data
      const recordsCount = response.total

      if (Array.isArray(responseData)) {
        tableData.data.length = 0
        ;(responseData as T[]).forEach(item => {
          tableData.data.push(item as any)
        })
      } else {
        tableData.data.length = 0
      }

      if (typeof recordsCount === 'number') {
        tableData.total = recordsCount
      } else if (typeof recordsCount === 'string') {
        tableData.total = parseInt(recordsCount, 10) || 0
      } else {
        tableData.total = 0
      }
    }
    searching.value = false
    return response
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'name' in e && e.name === 'CancelError') return null
    // errorMessage.show(e);
    tableData.data.length = 0
    tableData.total = 0
    searching.value = false
    return null
  }
}

const reload = async () => {
  return _loadData(postData.value)
}

const handleSizeChange = (size: number) => {
  tableData.size = size
  _loadData()
}

const handleCurrentChange = (page: number) => {
  emit('current-change', page)
  tableData.currentPage = page
  _loadData()
}

const loadData = (params?: PostData) => {
  if (params) {
    tableData.currentPage = params.pageIndex || 1
  } else {
    tableData.currentPage = 1
  }
  return _loadData(params)
}

defineExpose<GridExpose<T>>({
  loadData,
  reload,
  getTableData: () => [...(tableData.data as any)]
})
</script>

<style lang="scss" scoped>
.flex_box {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
  z-index: 0;
}
</style>
./gridType
