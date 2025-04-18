<script setup lang="ts">
import { onMounted } from 'vue'
import { ref } from 'vue'
import Grid from '@/Components/Grid/index.vue'
import { GridExpose } from '@/Components/Grid/gridType'
import { formatPhone } from '@/utils/helper'
import userManagementApi from '@/api/userManagement'
import { UserListParams, UserlistDTO } from '@/api/types/userManagement'
import { PageParams } from '@/api/types/common'
import { UserRoleList, UserAuthList, UserStatusList } from './const'

const userGridRef = ref<GridExpose<UserlistDTO, UserListParams>>()

const emit = defineEmits(['edit', 'statusChange'])

const loadData = async (params: UserListParams & PageParams) => {
  const res = await userManagementApi.fetchUserList(params)
  return {
    data: res.data.list,
    total: res.data.total
  }
  // console.log('loadData', res)
  // return Promise.resolve({
  //   data: [
  //     {
  //       id: 3,
  //       name: '王五',
  //       phone: '13412349872',
  //       role: '程序员',
  //       createTime: '2025.01.08 12:23:45',
  //       authStatus: '未认证',
  //       status: '已注销'
  //     },
  //     {
  //       id: 2,
  //       name: '李四',
  //       phone: '13412349874',
  //       role: '程序员',
  //       createTime: '2025.01.05 12:23:45',
  //       authStatus: '已认证',
  //       status: '已封禁 剩余30天'
  //     },
  //     {
  //       id: 1,
  //       name: '张三',
  //       phone: '18812342349',
  //       role: '大学生',
  //       createTime: '2025.01.02 12:23:45',
  //       authStatus: '',
  //       status: '正常'
  //     }
  //   ],
  //   total: 3
  // })
}

const load = (params?: UserListParams) => {
  if (userGridRef.value) {
    userGridRef.value.loadData?.(params)
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
    ref="userGridRef"
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
        {{ UserRoleList[scope.row.role]?.label || '—' }}
      </template>
    </el-table-column>
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
        <el-tag
          :type="UserAuthList.find(item => item.value === scope.row.authStatus)?.type || 'info'"
        >
          {{ UserAuthList.find(item => item.value === scope.row.authStatus)?.label || '—' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="用户状态"
      width="150"
    >
      <template #default="scope">
        <el-tag
          :type="
            UserStatusList.find(item => item.value === scope.row.userStatus)?.type || 'success'
          "
        >
          {{ UserStatusList.find(item => item.value === scope.row.userStatus)?.label || '—' }}
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
          :type="
            UserStatusList.find(item => item.value === scope.row.userStatus)?.type || 'success'
          "
          size="small"
          @click="emit('statusChange', scope.row)"
        >
          {{ UserStatusList.find(item => item.value === scope.row.userStatus)?.action || '—' }}
        </el-button>
      </template>
    </el-table-column>
  </Grid>
</template>
