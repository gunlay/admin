<template>
  <div class="orders-container">
    <el-card>
      <template #header>
        <OrdersQuery @search="handleSearch" />
      </template>
      <OrdersList
        ref="ordersListRef"
        @viewDialog="handleView"
      />
    </el-card>
    <!-- 查看详情对话框 -->
    <OrdersDialog ref="ordersDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import OrdersList from './OrdersList.vue'
import OrdersQuery from './OrdersQuery.vue'
import OrdersDialog from './OrdersDialog.vue'

const ordersListRef = ref<InstanceType<typeof OrdersList>>()
const ordersDialogRef = ref<InstanceType<typeof OrdersDialog>>()

// 查看详情
const handleView = (row: any) => {
  if (ordersDialogRef.value) ordersDialogRef.value.showDialog(row)
}

// 查询功能
const handleSearch = (params: any) => {
  if (ordersListRef.value) ordersListRef.value.loadData(params)
}
</script>

<style scoped>
.orders-container {
  padding: 20px;
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
