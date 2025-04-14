<script setup lang="ts">
import Grid from '@/components/Grid/index.vue'
import { formatPhone } from '@/utils/helper'
import { defineEmits, onMounted, ref } from 'vue'

const emit = defineEmits(['view'])
const authGridRef = ref<InstanceType<typeof Grid>>()

// 获取状态标签类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    已通过: 'success',
    未审核: 'warning',
    已拒绝: 'danger'
  }
  return (statusMap[status] || 'info') as 'success' | 'warning' | 'danger' | 'info' | 'primary'
}

const loadData = (params: any) => {
  // if (userGridRef.value) {
  //   userGridRef.value.loadData?.({})
  // }
  return Promise.resolve({
    data: [
      {
        id: 3,
        name: '王五',
        phone: '13412349872',
        authType: '技能认证',
        status: '已拒绝',
        authTime: '2025.01.08 12:23:45',
        createTime: '2025.01.01 12:00:00' // 添加提交时间
      },
      {
        id: 2,
        name: '李四',
        phone: '13412349874',
        authType: '技能认证',
        status: '未审核',
        authTime: '-----',
        createTime: '2025.01.01 12:00:00' // 添加提交时间
      },
      {
        id: 1,
        name: '张三',
        phone: '18812342349',
        authType: '工作认证',
        status: '已通过',
        authTime: '2025.01.02 12:23:45',
        createTime: '2025.01.01 12:00:00' // 添加提交时间
      }
    ],
    total: 3
  })
}

const load = (params?: any) => {
  if (authGridRef.value) {
    authGridRef.value.loadData?.(params)
  }
}

onMounted(() => {
  load()
})

defineExpose({
  loadData
})
</script>
<template>
  <Grid
    ref="authGridRef"
    :remoteMethod="loadData"
  >
    <el-table-column
      prop="id"
      label="id"
      width="100"
    />
    <el-table-column
      prop="name"
      label="用户名"
      width="120"
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
      prop="authType"
      label="认证类别"
      width="120"
    />
    <el-table-column
      label="提交时间"
      width="180"
    >
      <template #default="scope">
        {{ scope.row.createTime }}
      </template>
    </el-table-column>
    <el-table-column
      label="审核状态"
      width="100"
    >
      <template #default="scope">
        <el-tag :type="getStatusType(scope.row.status)">
          {{ scope.row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="authTime"
      label="审核时间"
      width="180"
    />
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
