<template>
  <div class="auth-container">
    <el-card>
      <template #header>
        <AuthQuery @search="handleSearch" />
      </template>
      <AuthList
        ref="authListRef"
        @view="handleView"
      />
    </el-card>

    <!-- 查看详情对话框 -->
    <AuthDialog ref="authDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthDialog from './AuthDialog.vue'
import AuthList from './AuthList.vue'
import AuthQuery from './AuthQuery.vue'

const authListRef = ref<InstanceType<typeof AuthList>>()
const authDialogRef = ref<InstanceType<typeof AuthDialog>>()

const handleSearch = (searchForm: any) => {
  authListRef.value?.loadData(searchForm)
}

// 查看详情
const handleView = (row: any) => {
  if (authDialogRef.value) {
    authDialogRef.value.showDialog(row)
  }
}
</script>

<style scoped>
.auth-container {
  padding: 20px;
}

:deep(.el-tag) {
  min-width: 60px;
  text-align: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-select) {
  width: 120px;
}

:deep(.el-input__wrapper) {
  background-color: var(--el-fill-color-blank);
}

.auth-image {
  width: 200px;
  height: 150px;
  border-radius: 4px;
}

:deep(.el-button--small) {
  padding: 5px 12px;
  height: 24px;
  font-size: 12px;
  border-radius: 2px;
}
</style>
