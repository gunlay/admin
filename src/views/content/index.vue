<template>
  <div class="content-container">
    <el-card>
      <template #header>
        <ContentQuery
          ref="contentQueryRef"
          @search="handleSearch"
        />
      </template>
    </el-card>
    <ContentList
      ref="contentListRef"
      @viewDialog="handleView"
    />
    <!-- 查看详情对话框 -->
    <ContentDialog
      ref="contentDialogRef"
      @updateList="handleUpdateList"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UserPostlistDTO, UserPostParams } from '@/api/types/userCotent'
import ContentList from './ContentList.vue'
import ContentQuery from './ContentQuery.vue'
import ContentDialog from './ContentDialog.vue'
import userPostApi from '@/api/userContent'

const contentListRef = ref<InstanceType<typeof ContentList>>()
const contentQueryRef = ref<InstanceType<typeof ContentQuery>>()
const contentDialogRef = ref<InstanceType<typeof ContentDialog>>()

// 查看详情
const handleView = async (row: UserPostlistDTO) => {
  if (contentDialogRef.value) {
    const res = await userPostApi.fetchUserPostDetail({ id: row.id })
    contentDialogRef.value.showDialog(res.data)
  }
}

// 修改查询功能，保持排序和分页
const handleSearch = (params: UserPostParams) => {
  if (contentListRef.value) contentListRef.value.load(params)
}

// 更新列表
const handleUpdateList = () => {
  if (contentQueryRef.value) contentQueryRef.value.handleSearch()
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
