<script setup lang="ts">
import Grid from '@/Components/Grid/index.vue'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { formatPhone } from '@/utils/helper'
import { GridExpose } from '@/Components/Grid/gridType'
import { UserPostListResponse, UserPostParams } from '@/api/types/userCotent'
import userPostApi from '@/api/userContent'
import { PageParams } from '@/api/types/common'
import { UserPubStatusList, UserRoleList } from './const'
const contentGridRef = ref<GridExpose<UserPostListResponse, UserPostParams>>()

const emit = defineEmits(['viewDialog', 'statusChange'])

const loadData = async (params: UserPostParams & PageParams) => {
  const res = await userPostApi.fetchUserPostList(params)
  return {
    data: res.data.list,
    total: res.data.total
  }
}

const load = (params?: any) => {
  if (contentGridRef.value) {
    contentGridRef.value.loadData?.(params)
  }
}

onMounted(() => {
  load()
})

defineExpose({
  load
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
      prop="username"
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
    >
      <template #default="scope">
        {{ UserRoleList.find(item => item.value === scope.row.role)?.label }}
      </template>
    </el-table-column>
    <!-- <el-table-column
      prop="category"
      label="所属分类"
      width="120"
    /> -->
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
        <el-tag :type="UserPubStatusList.find(item => item.value === scope.row.pubStatus)?.type">
          {{ UserPubStatusList.find(item => item.value === scope.row.pubStatus)?.label }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="审核时间"
      width="180"
    >
      <template #default="scope">
        {{ scope.row.reviewTime }}
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
