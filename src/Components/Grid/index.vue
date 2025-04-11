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
        @selection-change="(e: any) => $emit('selectionChange', e)"
        @sort-change="(e: any) => $emit('sortChange', e)"
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

<script setup lang="ts">
import { PropType, reactive, ref, defineEmits, defineExpose, defineProps } from 'vue'
import { ElPagination, ElTable, TreeNode } from 'element-plus'
import { deepCopy } from '@/utils/helper'

type PostData = Record<string, number>

const props = defineProps({
  remoteMethod: {
    type: Function,
    required: true
  },
  load: {
    type: Function as PropType<
      ((row: any, treeNode: TreeNode, resolve: (data: any[]) => void) => void) | undefined
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
  totalCountName: {
    type: String,
    default: 'total'
  },
  dataName: {
    type: String,
    default: 'data'
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
    type: Object as PropType<{
      prop: any
      order: any
    }>,
    default: () => ({})
  }
})

const emit = defineEmits<{
  (e: 'currentChange', page: number): void
  (e: 'selectionChange', selection: any): void
  (e: 'sortChange', change: any): void
}>()

const postData = ref<PostData>({})
const searching = ref<boolean>(false)
const tableData = reactive({
  data: [],
  currentPage: 1,
  size: props.pageSize,
  total: 0
})

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
    console.log('response', response)
    if (response) {
      const data = response[props.dataName]
      const recordsCount = response[props.totalCountName]
      tableData.data = data
      tableData.total = recordsCount
    }

    searching.value = false
    return response
  } catch (e: unknown) {
    if ((e as any).name === 'CancelError') return null
    // errorMessage.show(e);
    tableData.data = []
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
  emit('currentChange', page)
  tableData.currentPage = page
  _loadData()
}

const loadData = (params: PostData) => {
  if (params) {
    tableData.currentPage = params.pageIndex || 1
  } else {
    tableData.currentPage = 1
  }
  return _loadData(params)
}

defineExpose({ loadData, reload })
</script>

<style lang="scss" module>
.flex_box {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
  z-index: 0;
}
</style>
