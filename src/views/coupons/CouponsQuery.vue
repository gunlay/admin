<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['search', 'create'])

const searchForm = reactive({
  code: '',
  status: '全部'
})

// 查询功能
const handleSearch = () => {
  emit('search', searchForm)
}

// 重置功能
const handleReset = () => {
  // 重置表单
  searchForm.code = ''
  searchForm.status = '全部'
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
    <el-form-item label="券码">
      <el-input
        v-model="searchForm.code"
        placeholder="请输入券码"
      />
    </el-form-item>
    <el-form-item label="状态">
      <el-select
        v-model="searchForm.status"
        placeholder="请选择状态"
        style="width: 120px"
      >
        <el-option
          label="全部"
          value="全部"
        />
        <el-option
          label="未生效"
          value="未生效"
        />
        <el-option
          label="已生效"
          value="已生效"
        />
        <el-option
          label="已过期"
          value="已过期"
        />
        <el-option
          label="已下线"
          value="已下线"
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

:deep(.el-select) {
  width: 120px !important;
}
</style>
