<script setup lang="ts">
import { reactive } from 'vue'

const emit = defineEmits(['search'])

const searchForm = reactive({
  username: '',
  phone: '',
  role: '全部',
  authStatus: '全部'
})
// 修改查询功能，保持排序和分页
const handleSearch = () => {
  emit('search', searchForm)
}

// 修改重置功能
const handleReset = () => {
  // 重置表单
  searchForm.username = ''
  searchForm.phone = ''
  searchForm.role = '全部'
  searchForm.authStatus = '全部'
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
        v-model="searchForm.username"
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
          value="全部"
        />
        <el-option
          label="大学生"
          value="大学生"
        />
        <el-option
          label="程序员"
          value="程序员"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="认证状态">
      <el-select
        v-model="searchForm.authStatus"
        placeholder="请选择认证状态"
      >
        <el-option
          label="全部"
          value="全部"
        />
        <el-option
          label="未认证"
          value="未认证"
        />
        <el-option
          label="已认证"
          value="已认证"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="handleSearch"
        >查询</el-button
      >
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
