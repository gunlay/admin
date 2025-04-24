<script setup lang="ts">
import { PageParams } from '@/api/types/common'
import { UserAuthlistDTO, UserAuthParams } from '@/api/types/userAuth'
import userAuthApi from '@/api/userAuth'
import { GridExpose } from '@/Components/Grid/gridType'
import Grid from '@/Components/Grid/index.vue'
import { formatPhone } from '@/utils/helper'
import { defineEmits, onMounted, ref } from 'vue'
import { UserAuthList, UserAuthorizationList } from './const'

const emit = defineEmits(['view'])
const authGridRef = ref<GridExpose<UserAuthlistDTO, UserAuthParams>>()

const loadData = async (params: UserAuthParams & PageParams) => {
  const res = await userAuthApi.fetchUserAuthList(params)
  return {
    data: res.data.list,
    total: res.data.total
  }
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
  load
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
      prop="authType"
      label="认证类别"
      width="120"
    >
      <template #default="scope">
        {{ UserAuthorizationList.find(item => item.value === scope.row.authType)?.label }}
      </template>
    </el-table-column>
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
        <el-tag :type="UserAuthList.find(item => item.value === scope.row.authStatus)?.type">
          {{ UserAuthList.find(item => item.value === scope.row.authStatus)?.label }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="reviewTime"
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
