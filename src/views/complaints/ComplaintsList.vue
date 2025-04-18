<script setup lang="ts">
import Grid from '@/Components/Grid/index.vue'
import { ref, onMounted } from 'vue'
import { formatPhone } from '@/utils/helper'

// 发出事件到父组件
const emit = defineEmits(['view'])

const complaintsGridRef = ref<InstanceType<typeof Grid>>()

// 原始数据列表
const originalComplaintList = [
  {
    id: 'TS20250108001',
    complainant: '王五',
    phone: '13412349872',
    defendant: '李四',
    defendantPhone: '13412349872',
    createTime: '2025.01.08 12:23:45',
    handleTime: '',
    type: '服务投诉',
    materials: '查看',
    status: '处理中',
    result: ''
  },
  {
    id: 'TS20250105001',
    complainant: '李四',
    phone: '13412349874',
    defendant: '张三',
    defendantPhone: '13412349874',
    createTime: '2025.01.05 12:23:45',
    handleTime: '',
    type: '商品投诉',
    materials: '查看',
    status: '处理中',
    result: ''
  },
  {
    id: 'TS20250102001',
    complainant: '张三',
    phone: '18812342349',
    defendant: '王五',
    defendantPhone: '18812342349',
    createTime: '2025.01.02 12:23:45',
    handleTime: '2025.01.03 15:30:22',
    type: '服务投诉',
    materials: '查看',
    status: '已处理',
    result: '已联系双方解决'
  }
]

// 获取状态标签类型
const getStatusType = (
  status: string
): 'success' | 'warning' | 'info' | 'danger' | 'primary' | undefined => {
  const statusMap: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'primary'> = {
    未处理: 'danger',
    处理中: 'warning',
    已处理: 'success'
  }
  return statusMap[status]
}

// 加载数据方法
const loadData = (params: any) => {
  // 如果有参数则根据参数过滤
  let filteredList = [...originalComplaintList]

  if (params) {
    filteredList = originalComplaintList.filter(complaint => {
      const matchUsername = params.username
        ? complaint.complainant.includes(params.username) ||
          complaint.defendant.includes(params.username)
        : true
      const matchPhone = params.phone
        ? complaint.phone.includes(params.phone) || complaint.defendantPhone.includes(params.phone)
        : true
      const matchStatus = params.status === '全部' ? true : complaint.status === params.status

      return matchUsername && matchPhone && matchStatus
    })
  }

  return Promise.resolve({
    data: filteredList,
    total: filteredList.length
  })
}

// 更新投诉处理状态
const updateComplaintStatus = (complaintId: string, result: string) => {
  const index = originalComplaintList.findIndex(item => item.id === complaintId)
  if (index > -1) {
    originalComplaintList[index] = {
      ...originalComplaintList[index],
      status: '已处理',
      handleTime: new Date().toLocaleString('zh-CN').replace(/\//g, '.'),
      result
    }
    load()
  }
}

const load = (params?: any) => {
  if (complaintsGridRef.value) {
    complaintsGridRef.value.loadData?.(params)
  }
}

onMounted(() => {
  load()
})

defineExpose({
  loadData,
  updateComplaintStatus
})
</script>

<template>
  <Grid
    ref="complaintsGridRef"
    :remoteMethod="loadData"
  >
    <el-table-column
      prop="id"
      label="投诉编号"
      width="120"
    />
    <el-table-column
      prop="complainant"
      label="投诉人"
      width="100"
    />
    <el-table-column
      label="手机号"
      width="120"
    >
      <template #default="scope">
        {{ formatPhone(scope.row.phone) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="defendant"
      label="被投诉人"
      width="100"
    />
    <el-table-column
      label="手机号"
      width="120"
    >
      <template #default="scope">
        {{ formatPhone(scope.row.defendantPhone) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="createTime"
      label="投诉时间"
      width="180"
    />
    <el-table-column
      label="处理时间"
      width="180"
    >
      <template #default="scope">
        {{ scope.row.handleTime || '—' }}
      </template>
    </el-table-column>
    <el-table-column
      prop="type"
      label="投诉类型"
      width="120"
    />
    <el-table-column
      prop="materials"
      label="投诉材料"
      width="120"
    />
    <el-table-column
      label="状态"
      width="100"
    >
      <template #default="scope">
        <el-tag :type="getStatusType(scope.row.status)">
          {{ scope.row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      width="100"
    >
      <template #default="scope">
        <el-button
          type="primary"
          size="small"
          @click="emit('view', scope.row)"
        >
          查看
        </el-button>
      </template>
    </el-table-column>
  </Grid>
</template>

<style scoped>
:deep(.el-tag) {
  min-width: 60px;
  text-align: center;
}

:deep(.el-button--small) {
  padding: 5px 12px;
  height: 24px;
  font-size: 12px;
  border-radius: 2px;
}
</style>
