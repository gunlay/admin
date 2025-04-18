<script setup lang="ts">
import Grid from '@/Components/Grid/index.vue'
import { ref, onMounted } from 'vue'

// 发出事件到父组件
const emit = defineEmits(['view', 'edit'])

const couponsGridRef = ref<InstanceType<typeof Grid>>()

// 添加获取券码状态的方法
const getCouponStatus = (createTime: string, validPeriod: string) => {
  const now = new Date().getTime()
  const startTime = new Date(createTime.replace(/\./g, '/')).getTime()
  const endTime = new Date(validPeriod.replace('截止', '').replace(/\./g, '/')).getTime()

  if (now < startTime) {
    return '未生效'
  } else if (now > endTime) {
    return '已过期'
  } else {
    return '已生效'
  }
}

// 原始数据列表
const originalCouponList = [
  {
    code: 'CHJ20250109',
    name: '促活券',
    type: '打折券',
    amount: '8折30封顶',
    validPeriod: '截止2025.10.20',
    createTime: '2025.01.08 12:23:45',
    status: '已下线'
  },
  {
    code: 'CHJ20250108',
    name: '促活券',
    type: '满减券',
    amount: '无门槛减20',
    validPeriod: '截止2025.10.20',
    createTime: '2025.01.08 12:23:45',
    status: '已过期'
  },
  {
    code: 'SDD20250105',
    name: '首单返利券',
    type: '满减券',
    amount: '满300减100',
    validPeriod: '自领取30日内',
    createTime: '2025.01.05 12:23:45',
    status: '未生效'
  },
  {
    code: 'XRJ20250102',
    name: '新注册用户券',
    type: '满减券',
    amount: '满100减30',
    validPeriod: '自领取30日内',
    createTime: '2025.01.02 12:23:45',
    status: '已生效'
  }
]

// 获取状态标签类型
const getStatusType = (
  status: string
): 'success' | 'warning' | 'info' | 'danger' | 'primary' | undefined => {
  const statusMap: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'primary'> = {
    已生效: 'success',
    未生效: 'warning',
    已过期: 'info',
    已下线: 'danger'
  }
  return statusMap[status]
}

// 加载数据方法
const loadData = (params: any) => {
  return Promise.resolve({
    data: originalCouponList,
    total: originalCouponList.length
  })
}

// 添加新的券码
const addCoupon = (coupon: any) => {
  originalCouponList.unshift(coupon)
  load()
}

// 更新券码
const updateCoupon = (updatedCoupon: any) => {
  const index = originalCouponList.findIndex(item => item.code === updatedCoupon.code)
  if (index > -1) {
    originalCouponList[index] = updatedCoupon
    load()
  }
}

const load = (params?: any) => {
  if (couponsGridRef.value) {
    couponsGridRef.value.loadData?.(params)
  }
}

onMounted(() => {
  load()
})

defineExpose({
  loadData,
  addCoupon,
  updateCoupon
})
</script>

<template>
  <Grid
    ref="couponsGridRef"
    :remoteMethod="loadData"
  >
    <el-table-column
      prop="code"
      label="券码"
      width="120"
    />
    <el-table-column
      prop="name"
      label="券码名称"
      width="120"
    />
    <el-table-column
      prop="type"
      label="券码类型"
      width="100"
    />
    <el-table-column
      prop="amount"
      label="券码面额"
      width="120"
    />
    <el-table-column
      prop="validPeriod"
      label="有效期"
      width="120"
    />
    <el-table-column
      prop="createTime"
      label="生效开始时间"
      width="180"
    />
    <el-table-column
      label="券码状态"
      width="100"
    >
      <template #default="scope">
        <el-tag :type="getStatusType(scope.row.status)">
          {{ scope.row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      width="180"
    >
      <template #default="scope">
        <el-button
          type="primary"
          size="small"
          @click="emit('view', scope.row)"
        >
          查看
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="emit('edit', scope.row)"
        >
          修改
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

:deep(.el-button--small) {
  padding: 5px 12px;
  height: 24px;
  font-size: 12px;
  border-radius: 2px;
}
</style>
