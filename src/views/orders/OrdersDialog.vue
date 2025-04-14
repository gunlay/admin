<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)

// 表单数据
const formData = reactive({
  orderNo: '',
  payerName: '',
  payerPhone: '',
  receiverName: '',
  receiverPhone: '',
  createTime: '',
  status: '',
  amount: 0,
  actualAmount: 0,
  receiveTime: '',
  serviceTime: '',
  meetingCode: ''
})

// 获取状态标签类型
const getStatusType = (
  status: string
): 'success' | 'warning' | 'info' | 'danger' | 'primary' | undefined => {
  const statusMap: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'primary'> = {
    未支付: 'warning',
    已支付: 'success',
    已完成: 'info'
  }
  return statusMap[status]
}

// 显示对话框，接收行数据
const showDialog = (row: any) => {
  Object.assign(formData, row)
  dialogVisible.value = true
}

defineExpose({
  showDialog
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="订单详情"
    width="500px"
  >
    <el-form
      :model="formData"
      label-width="100px"
    >
      <el-form-item label="订单号">
        <span>{{ formData.orderNo }}</span>
      </el-form-item>
      <el-form-item label="付款人">
        <span>{{ formData.payerName }}</span>
      </el-form-item>
      <el-form-item label="收款人">
        <span>{{ formData.receiverName }}</span>
      </el-form-item>
      <el-form-item label="下单时间">
        <span>{{ formData.createTime }}</span>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-tag :type="getStatusType(formData.status)">
          {{ formData.status }}
        </el-tag>
      </el-form-item>
      <el-form-item label="订单金额">
        <span>¥{{ formData.amount }}</span>
      </el-form-item>
      <el-form-item label="实付金额">
        <span>¥{{ formData.actualAmount }}</span>
      </el-form-item>
      <el-form-item label="完成时间">
        <span>{{ formData.receiveTime || '—' }}</span>
      </el-form-item>
      <el-form-item label="服务时间">
        <span>{{ formData.serviceTime || '—' }}</span>
      </el-form-item>
      <el-form-item label="会议码">
        <span>{{ formData.meetingCode || '—' }}</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
:deep(.el-tag) {
  min-width: 60px;
  text-align: center;
}
</style>
