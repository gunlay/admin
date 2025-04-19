<script setup lang="ts">
import { UserAuthParams } from '@/api/types/userAuth'
import { reactive } from 'vue'
import { UserAuthList, UserAuthorizationList } from './const'
import { SelectOptions } from '@/api/types/common'

const emit = defineEmits(['search'])
// 添加搜索表单数据
const searchForm = reactive<UserAuthParams>({
  userName: '',
  phone: '',
  type: undefined,
  authStatus: undefined
})
// 修改查询功能，保持排序和分页
const handleSearch = () => {
  emit('search', {
    ...searchForm,
    type: searchForm.type === SelectOptions.ALLOPTIONS ? undefined : searchForm.type,
    authStatus:
      searchForm.authStatus === SelectOptions.ALLOPTIONS ? undefined : searchForm.authStatus
  })
}

// 修改重置功能
const handleReset = () => {
  // 重置表单
  searchForm.userName = ''
  searchForm.phone = ''
  searchForm.type = undefined
  searchForm.authStatus = undefined
  emit('search', searchForm)
}
</script>
<template>
  <el-form
    :inline="true"
    :model="searchForm"
  >
    <el-form-item label="用户名">
      <el-input
        v-model="searchForm.userName"
        placeholder="请输入用户名"
      />
    </el-form-item>
    <el-form-item label="手机号">
      <el-input
        v-model="searchForm.phone"
        placeholder="请输入手机号"
      />
    </el-form-item>
    <el-form-item label="认证类别">
      <el-select
        v-model="searchForm.type"
        placeholder="请选择类别"
      >
        <el-option
          label="全部"
          :value="SelectOptions.ALLOPTIONS"
        />
        <el-option
          v-for="item in UserAuthorizationList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="审核状态">
      <el-select
        v-model="searchForm.authStatus"
        placeholder="请选择状态"
      >
        <el-option
          label="全部"
          :value="SelectOptions.ALLOPTIONS"
        />
        <el-option
          v-for="item in UserAuthList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="handleSearch"
        >查询</el-button
      >
      <el-button
        @click="handleReset"
        type="danger"
        >重置</el-button
      >
    </el-form-item>
  </el-form>
</template>
