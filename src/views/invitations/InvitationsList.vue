<script setup lang="ts">
import Grid from '@/components/Grid/index.vue'
import { ref, onMounted } from 'vue'

// 发出事件到父组件
const emit = defineEmits(['view', 'edit'])

const invitationsGridRef = ref<InstanceType<typeof Grid>>()

// 原始数据列表
const originalChannelList = [
  {
    id: 3,
    name: 'C',
    code: 'NZ9999',
    description: '抖音投流广告',
    createTime: '2025.01.08 12:23:45',
    expireTime: '2025.02.08 12:23:45',
    maxUses: 100,
    usedCount: 45,
    totalUsers: 128,
    yesterdayUsers: 45
  },
  {
    id: 2,
    name: 'B',
    code: 'FC6666',
    description: '北京地铁广告',
    createTime: '2025.01.05 12:23:45',
    expireTime: '2025.03.05 12:23:45',
    maxUses: 200,
    usedCount: 89,
    totalUsers: 987,
    yesterdayUsers: 32
  },
  {
    id: 1,
    name: 'A',
    code: 'FC8888',
    description: '北大校园地推',
    createTime: '2025.01.02 12:23:45',
    expireTime: '2025.04.02 12:23:45',
    maxUses: 50,
    usedCount: 8,
    totalUsers: 259,
    yesterdayUsers: 8
  }
]

// 添加日期时间格式化方法
const formatDateTime = (dateTime: string | Date) => {
  if (!dateTime) return '—'
  if (typeof dateTime === 'string') return dateTime
  return dateTime.toLocaleString('zh-CN').replace(/\//g, '.')
}

// 加载数据方法
const loadData = (params: any) => {
  return Promise.resolve({
    data: originalChannelList,
    total: originalChannelList.length
  })
}

// 添加新的邀请
const addInvitation = (invitation: any) => {
  originalChannelList.unshift(invitation)
  load()
}

// 更新邀请
const updateInvitation = (updatedInvitation: any) => {
  const index = originalChannelList.findIndex(item => item.id === updatedInvitation.id)
  if (index > -1) {
    originalChannelList[index] = updatedInvitation
    load()
  }
}

const load = (params?: any) => {
  if (invitationsGridRef.value) {
    invitationsGridRef.value.loadData?.(params)
  }
}

onMounted(() => {
  load()
})

defineExpose({
  loadData,
  addInvitation,
  updateInvitation
})
</script>

<template>
  <Grid
    ref="invitationsGridRef"
    :remoteMethod="loadData"
  >
    <el-table-column
      prop="id"
      label="渠道id"
      width="100"
    />
    <el-table-column
      prop="name"
      label="渠道名称"
      width="120"
    />
    <el-table-column
      prop="code"
      label="渠道码"
      width="120"
    />
    <el-table-column
      prop="description"
      label="渠道描述"
      width="180"
    />
    <el-table-column
      prop="createTime"
      label="创建时间"
      width="180"
    />
    <el-table-column
      prop="expireTime"
      label="有效期"
      width="180"
    >
      <template #default="scope">
        {{ formatDateTime(scope.row.expireTime) }}
      </template>
    </el-table-column>
    <el-table-column
      label="使用情况"
      width="150"
    >
      <template #default="scope"> {{ scope.row.usedCount }}/{{ scope.row.maxUses }} </template>
    </el-table-column>
    <el-table-column
      prop="totalUsers"
      label="累计邀请注册用户"
      width="150"
    />
    <el-table-column
      prop="yesterdayUsers"
      label="昨日新增注册用户"
      width="150"
    />
    <el-table-column
      label="操作"
      width="180"
    >
      <template #default="scope">
        <el-button
          type="primary"
          size="small"
          @click="emit('view', scope.row)"
        >
          查看
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="emit('edit', scope.row)"
        >
          编辑
        </el-button>
      </template>
    </el-table-column>
  </Grid>
</template>

<style scoped>
:deep(.el-button--small) {
  padding: 5px 12px;
  height: 24px;
  font-size: 12px;
  border-radius: 2px;
}
</style>
