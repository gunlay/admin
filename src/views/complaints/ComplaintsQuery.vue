<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['search'])

const searchForm = reactive({
  username: '',
  phone: '',
  status: '全部'
})

// 查询功能
const handleSearch = () => {
  emit('search', searchForm)
}

// 重置功能
const handleReset = () => {
  // 重置表单
  searchForm.username = ''
  searchForm.phone = ''
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
    <el-form-item label="投诉状态">
      <el-select
        v-model="searchForm.status"
        placeholder="请选择状态"
      >
        <el-option
          label="全部"
          value="全部"
        />
        <el-option
          label="已处理"
          value="已处理"
        />
        <el-option
          label="处理中"
          value="处理中"
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

<style scoped>
:deep(.el-input) {
  width: 120px;
}

:deep(.el-select) {
  width: 120px;
}
</style>
