<script setup lang="ts">
import Grid from '@/Components/Grid/index.vue'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { formatPhone } from '@/utils/helper'
const userGridRef = ref<InstanceType<typeof Grid>>()

const emit = defineEmits(['viewDialog', 'statusChange'])

// 获取状态标签类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    未审核: 'warning',
    已发布: 'success',
    已驳回: 'danger'
  }
  return statusMap[status] || 'info'
}

const loadData = (params: any) => {
  // if (userGridRef.value) {
  //   userGridRef.value.loadData?.({})
  // }
  console.log('loadData', params)
  return Promise.resolve({
    data: [
      {
        id: 3,
        name: '王五',
        phone: '13412349872',
        role: '程序员',
        category: '一级分类名',
        createTime: '2025.01.08 12:23:45',
        status: '已驳回'
      },
      {
        id: 2,
        name: '李四',
        phone: '13412349874',
        role: '程序员',
        category: '一级分类名',
        createTime: '2025.01.05 12:23:45',
        status: '已发布'
      },
      {
        id: 1,
        name: '张三',
        phone: '18812342349',
        role: '大学生',
        category: '一级分类名',
        createTime: '2025.01.02 12:23:45',
        status: '未审核'
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
    ref="contentGridRef"
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
      prop="category"
      label="所属分类"
      width="120"
    />
    <el-table-column
      prop="createTime"
      label="提交时间"
      width="180"
    />
    <el-table-column
      label="发布状态"
      width="100"
    >
      <template #default="scope">
        <el-tag :type="getStatusType(scope.row.status)">
          {{ scope.row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="审核时间"
      width="180"
    >
      <template #default="scope">
        {{ scope.row.auditTime || '2025.01.08 12:23:45' }}
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
          @click="emit('viewDialog', scope.row)"
        >
          查看
        </el-button>
      </template>
    </el-table-column>
  </Grid>
</template>

<style scoped lang="scss"></style>
