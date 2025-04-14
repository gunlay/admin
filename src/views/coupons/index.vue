<template>
  <div class="coupons-container">
    <el-card>
      <template #header>
        <CouponsQuery
          @search="handleSearch"
          @create="handleCreate"
        />
      </template>
      <CouponsList
        ref="couponsListRef"
        @view="handleView"
        @edit="handleEdit"
      />
    </el-card>
    <!-- 新建/编辑对话框 -->
    <CouponsDialog
      ref="couponsDialogRef"
      @create="handleSubmitCreate"
      @update="handleSubmitUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CouponsList from './CouponsList.vue'
import CouponsQuery from './CouponsQuery.vue'
import CouponsDialog from './CouponsDialog.vue'

const couponsListRef = ref<InstanceType<typeof CouponsList>>()
const couponsDialogRef = ref<InstanceType<typeof CouponsDialog>>()

// 查询功能
const handleSearch = (params: any) => {
  if (couponsListRef.value) couponsListRef.value.loadData(params)
}

// 查看详情
const handleView = (row: any) => {
  console.log('查看详情:', row)
  if (couponsDialogRef.value) couponsDialogRef.value.showEditDialog(row)
}

// 创建券码
const handleCreate = () => {
  if (couponsDialogRef.value) couponsDialogRef.value.showCreateDialog()
}

// 编辑券码
const handleEdit = (row: any) => {
  if (couponsDialogRef.value) couponsDialogRef.value.showEditDialog(row)
}

// 提交创建
const handleSubmitCreate = (coupon: any) => {
  if (couponsListRef.value) couponsListRef.value.addCoupon(coupon)
}

// 提交更新
const handleSubmitUpdate = (coupon: any) => {
  if (couponsListRef.value) couponsListRef.value.updateCoupon(coupon)
}
</script>

<style scoped>
.coupons-container {
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

:deep(.el-button--link) {
  margin-right: 16px;
}

:deep(.el-button--link:last-child) {
  margin-right: 0;
}
</style>
