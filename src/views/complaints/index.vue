<template>
  <el-config-provider>
    <div class="complaints-container">
      <h2>投诉管理</h2>
      <el-card>
        <template #header>
          <ComplaintsQuery @search="handleSearch" />
        </template>
        <ComplaintsList
          ref="complaintsListRef"
          @view="handleView"
        />
      </el-card>
      <!-- 查看详情对话框 -->
      <ComplaintsDialog
        ref="complaintsDialogRef"
        @process="handleProcess"
      />
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElConfigProvider } from 'element-plus'
import ComplaintsList from './ComplaintsList.vue'
import ComplaintsQuery from './ComplaintsQuery.vue'
import ComplaintsDialog from './ComplaintsDialog.vue'

const complaintsListRef = ref<InstanceType<typeof ComplaintsList>>()
const complaintsDialogRef = ref<InstanceType<typeof ComplaintsDialog>>()

// 查询功能
const handleSearch = (params: any) => {
  if (complaintsListRef.value) complaintsListRef.value.loadData(params)
}

// 查看详情
const handleView = (row: any) => {
  if (complaintsDialogRef.value) complaintsDialogRef.value.showDialog(row)
}

// 处理投诉
const handleProcess = (data: { id: string; result: string }) => {
  if (complaintsListRef.value) complaintsListRef.value.updateComplaintStatus(data.id, data.result)
}
</script>

<style scoped>
.complaints-container {
  padding: 20px;
}

:deep(.el-input__wrapper) {
  background-color: var(--el-fill-color-blank);
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-card__header) {
  padding: 20px;
}
</style>
