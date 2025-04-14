<script setup lang="ts">
import { reactive } from 'vue'

const emit = defineEmits(['search'])
// 添加搜索表单数据
const searchForm = reactive({
  username: '',
  phone: '',
  authType: '全部',
  status: '全部'
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
  searchForm.authType = '全部'
  searchForm.status = '全部'
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
    <el-form-item label="认证类别">
      <el-select
        v-model="searchForm.authType"
        placeholder="请选择类别"
      >
        <el-option
          label="全部"
          value="全部"
        />
        <el-option
          label="工作认证"
          value="工作认证"
        />
        <el-option
          label="技能认证"
          value="技能认证"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="审核状态">
      <el-select
        v-model="searchForm.status"
        placeholder="请选择状态"
      >
        <el-option
          label="全部"
          value="全部"
        />
        <el-option
          label="未审核"
          value="未审核"
        />
        <el-option
          label="已通过"
          value="已通过"
        />
        <el-option
          label="已拒绝"
          value="已拒绝"
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
