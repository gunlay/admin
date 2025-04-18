<script setup lang="ts">
import { reactive } from 'vue'
import { UserListParams } from '@/api/types/userManagement'
import { UserRoleList, UserAuthList } from './const'
const emit = defineEmits(['search'])

const searchForm = reactive<UserListParams>({})
// 修改查询功能，保持排序和分页
const handleSearch = () => {
  emit('search', searchForm)
}

// 修改重置功能
const handleReset = () => {
  // 重置表单
  searchForm.userName = ''
  searchForm.phone = ''
  searchForm.role = undefined
  searchForm.authStatus = undefined
  emit('search', searchForm)
  ElMessage.success('重置成功')
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
    <el-form-item label="用户角色">
      <el-select
        v-model="searchForm.role"
        placeholder="请选择角色"
      >
        <el-option
          label="全部"
          value="undefined"
        />
        <el-option
          v-for="role in UserRoleList"
          :key="role.value"
          :label="role.label"
          :value="role.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="认证状态">
      <el-select
        v-model="searchForm.authStatus"
        placeholder="请选择认证状态"
      >
        <!-- <el-option
          label="全部"
          value=""
        /> -->

        <el-option
          v-for="auth in UserAuthList"
          :key="auth.value"
          :label="auth.label"
          :value="auth.value"
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
        type="danger"
        @click="handleReset"
        >重置</el-button
      >
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
