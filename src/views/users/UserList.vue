<script setup lang="ts">
import Grid from '@/components/Grid/index.vue'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { formatPhone } from '@/utils/helper'
import userManagementApi from '@/api/userManagement'
const userGridRef = ref<InstanceType<typeof Grid>>()

const emit = defineEmits(['edit', 'statusChange'])

// 获取认证状态标签类型
const getAuthStatusType = (
  status: string
): 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
  const statusMap: Record<string, 'success' | 'warning' | 'info' | 'primary' | 'danger'> = {
    已认证: 'success',
    未认证: 'warning',
    '': 'info'
  }
  return statusMap[status] || 'info'
}

// 获取用户状态标签类型
const getUserStatusType = (status: string) => {
  if (status.includes('封禁')) return 'danger'
  if (status === '已注销') return 'info'
  return 'success'
}

const loadData = async (params: any) => {
  const res = await userManagementApi.fetchUserList(params)
  console.log('loadData', res)
  return Promise.resolve({
    data: [
      {
        id: 3,
        name: '王五',
        phone: '13412349872',
        role: '程序员',
        createTime: '2025.01.08 12:23:45',
        authStatus: '未认证',
        status: '已注销'
      },
      {
        id: 2,
        name: '李四',
        phone: '13412349874',
        role: '程序员',
        createTime: '2025.01.05 12:23:45',
        authStatus: '已认证',
        status: '已封禁 剩余30天'
      },
      {
        id: 1,
        name: '张三',
        phone: '18812342349',
        role: '大学生',
        createTime: '2025.01.02 12:23:45',
        authStatus: '',
        status: '正常'
      }
    ],
    total: 3
  })
}

const load = (params?: any) => {
  if (userGridRef.value) {
    userGridRef.value.loadData?.(params)
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
    ref="userGridRef"
    :remoteMethod="loadData"
  >
    <el-table-column
      prop="id"
      label="id"
      width="80"
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
      prop="role"
      label="用户角色"
      width="100"
    />
    <el-table-column
      prop="createTime"
      label="注册时间"
      width="180"
    />
    <el-table-column
      label="认证状态"
      width="100"
    >
      <template #default="scope">
        <el-tag :type="getAuthStatusType(scope.row.authStatus)">
          {{ scope.row.authStatus || '—' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="用户状态"
      width="150"
    >
      <template #default="scope">
        <el-tag :type="getUserStatusType(scope.row.status)">
          {{ scope.row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      width="200"
    >
      <template #default="scope">
        <el-button
          type="primary"
          size="small"
          @click="emit('edit', scope.row)"
          >编辑</el-button
        >
        <el-button
          :type="scope.row.status === '正常' ? 'danger' : 'success'"
          size="small"
          @click="emit('statusChange', scope.row)"
        >
          {{ scope.row.status === '正常' ? '禁用' : '启用' }}
        </el-button>
      </template>
    </el-table-column>
  </Grid>
</template>

<style scoped lang="scss"></style>
