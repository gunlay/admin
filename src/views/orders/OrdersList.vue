<script setup lang="ts">
import Grid from '@/Components/Grid/index.vue'
import { ref, onMounted } from 'vue'
import { formatPhone } from '@/utils/helper'

// 发出事件到父组件
const emit = defineEmits(['viewDialog'])

const ordersGridRef = ref<InstanceType<typeof Grid>>()

// 原始数据列表（模拟后端数据）
const originalOrderList = [
  {
    orderNo: 'DD20250108001',
    payerName: '王五',
    payerPhone: '13412349872',
    receiverName: '王五',
    receiverPhone: '13412349872',
    createTime: '2025.01.08 12:23:45',
    status: '已完成',
    amount: 199,
    actualAmount: 199,
    receiveTime: '2025.01.08 12:23:45',
    serviceTime: '2025.01.09 10:00:00',
    meetingCode: '123456'
  },
  {
    orderNo: 'DD20250105001',
    payerName: '李四',
    payerPhone: '13412349874',
    receiverName: '李四',
    receiverPhone: '13412349874',
    createTime: '2025.01.05 12:23:45',
    status: '已支付',
    amount: 299,
    actualAmount: 299,
    receiveTime: '',
    serviceTime: '',
    meetingCode: ''
  },
  {
    orderNo: 'DD20250102001',
    payerName: '张三',
    payerPhone: '18812342349',
    receiverName: '张三',
    receiverPhone: '18812342349',
    createTime: '2025.01.02 12:23:45',
    status: '未支付',
    amount: 99,
    actualAmount: 0,
    receiveTime: '',
    serviceTime: '',
    meetingCode: ''
  }
]

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

// 加载数据方法
const loadData = (params: any) => {
  return Promise.resolve({
    data: originalOrderList,
    total: originalOrderList.length
  })
}

const load = (params?: any) => {
  if (ordersGridRef.value) {
    ordersGridRef.value.loadData?.(params)
  }
}

onMounted(() => {
  load()
})

defineExpose({
  loadData
})
</script>

<template>
  <Grid
    ref="ordersGridRef"
    :remoteMethod="loadData"
  >
    <el-table-column
      prop="orderNo"
      label="订单号"
      width="120"
    />
    <el-table-column
      prop="payerName"
      label="付款人"
      width="100"
    />
    <el-table-column
      label="手机号"
      width="120"
    >
      <template #default="scope">
        {{ formatPhone(scope.row.payerPhone) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="receiverName"
      label="收款人"
      width="100"
    />
    <el-table-column
      label="手机号"
      width="120"
    >
      <template #default="scope">
        {{ formatPhone(scope.row.receiverPhone) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="createTime"
      label="下单时间"
      width="180"
    />
    <el-table-column
      label="订单状态"
      width="100"
    >
      <template #default="scope">
        <el-tag :type="getStatusType(scope.row.status)">
          {{ scope.row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="amount"
      label="订单金额"
      width="100"
    >
      <template #default="scope"> ¥{{ scope.row.amount }} </template>
    </el-table-column>
    <el-table-column
      prop="actualAmount"
      label="实付金额"
      width="100"
    >
      <template #default="scope"> ¥{{ scope.row.actualAmount }} </template>
    </el-table-column>
    <el-table-column
      prop="receiveTime"
      label="完成时间"
      width="180"
    >
      <template #default="scope">
        {{ scope.row.receiveTime || '—' }}
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      width="100"
    >
      <template #default="scope">
        <el-button
          type="primary"
          size="small"
          @click="emit('viewDialog', scope.row)"
        >
          查看
        </el-button>
      </template>
    </el-table-column>
  </Grid>
</template>

<style scoped>
:deep(.el-tag) {
  min-width: 60px;
  text-align: center;
}
</style>
