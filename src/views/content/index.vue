<template>
  <div class="content-container">
    <el-card>
      <template #header>
        <ContentQuery @search="handleSearch" />
      </template>
    </el-card>
    <ContentList
      ref="contentListRef"
      @viewDialog="handleView"
    />
    <!-- 查看详情对话框 -->
    <ContentDialog ref="contentDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContentList from './ContentList.vue'
import ContentQuery from './ContentQuery.vue'
import ContentDialog from './ContentDialog.vue'

const contentListRef = ref<InstanceType<typeof ContentList>>()
const contentDialogRef = ref<InstanceType<typeof ContentDialog>>()

// 查看详情
const handleView = (row: any) => {
  if (contentDialogRef.value) contentDialogRef.value.showDialog(row)
}

// 修改查询功能，保持排序和分页
const handleSearch = () => {
  if (contentListRef.value) contentListRef.value.loadData({})
}
</script>

<style scoped>
.content-container {
  padding: 20px;
}
.content-image {
  width: 120px;
  height: 120px;
  margin-right: 10px;
  border-radius: 4px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-tag) {
  min-width: 60px;
  text-align: center;
}

:deep(.el-select) {
  width: 120px;
}

:deep(.el-input__wrapper) {
  background-color: var(--el-fill-color-blank);
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-input) {
  width: 120px;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-card__header) {
  padding: 20px;
}

:deep(.el-button--small) {
  padding: 5px 12px;
  height: 24px;
  font-size: 12px;
  border-radius: 2px;
}
</style>
