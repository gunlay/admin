<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['search', 'create'])

const searchForm = reactive({
  name: '',
  code: ''
})

// 查询功能
const handleSearch = () => {
  emit('search', searchForm)
}

// 重置功能
const handleReset = () => {
  // 重置表单
  searchForm.name = ''
  searchForm.code = ''
  emit('search', searchForm)
  ElMessage.success('重置成功')
}

// 新建按钮处理方法
const handleCreate = () => {
  emit('create')
}
</script>

<template>
  <el-form
    :inline="true"
    :model="searchForm"
  >
    <el-form-item label="渠道名称">
      <el-input
        v-model="searchForm.name"
        placeholder="请输入渠道名称"
      />
    </el-form-item>
    <el-form-item label="渠道码">
      <el-input
        v-model="searchForm.code"
        placeholder="请输入渠道码"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="handleSearch"
        >查询</el-button
      >
      <el-button @click="handleReset">重置</el-button>
      <el-button
        type="success"
        @click="handleCreate"
        >新建</el-button
      >
    </el-form-item>
  </el-form>
</template>

<style scoped>
:deep(.el-input) {
  width: 120px;
}
</style>
