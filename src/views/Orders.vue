<template>
  <el-config-provider :locale="locale">
    <div class="orders-container">
      <h2>订单管理</h2>
      <el-card>
        <template #header>
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="用户名">
              <el-input v-model="searchForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="searchForm.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="订单状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态">
                <el-option label="全部" value="全部" />
                <el-option label="未支付" value="未支付" />
                <el-option label="已支付" value="已支付" />
                <el-option label="已收货" value="已收货" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </template>

        <el-table :data="orderList" style="width: 100%">
          <el-table-column prop="orderNo" label="订单号" width="120" />
          <el-table-column prop="payerName" label="付款人" width="100" />
          <el-table-column label="手机号" width="120">
            <template #default="scope">
              {{ formatPhone(scope.row.payerPhone) }}
            </template>
          </el-table-column>
          <el-table-column prop="receiverName" label="收款人" width="100" />
          <el-table-column label="手机号" width="120">
            <template #default="scope">
              {{ formatPhone(scope.row.receiverPhone) }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="下单时间" width="180" />
          <el-table-column label="订单状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="订单金额" width="100">
            <template #default="scope">
              ¥{{ scope.row.amount }}
            </template>
          </el-table-column>
          <el-table-column prop="receiveTime" label="收货时间" width="180">
            <template #default="scope">
              {{ scope.row.receiveTime || '—' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button 
                type="primary" 
                link
                @click="handleView(scope.row)"
              >
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
          />
        </div>
      </el-card>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElConfigProvider } from 'element-plus'
import { locale } from '../config/element-plus'

const searchForm = reactive({
  username: '',
  phone: '',
  status: '全部'
})

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const orderList = ref([
  {
    orderNo: 'DD20250102001',
    payerName: '张三',
    payerPhone: '18812342349',
    receiverName: '张三',
    receiverPhone: '18812342349',
    createTime: '2025.01.02 12:23:45',
    status: '未支付',
    amount: 99,
    receiveTime: ''
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
    receiveTime: ''
  },
  {
    orderNo: 'DD20250108001',
    payerName: '王五',
    payerPhone: '13412349872',
    receiverName: '王五',
    receiverPhone: '13412349872',
    createTime: '2025.01.08 12:23:45',
    status: '已收货',
    amount: 199,
    receiveTime: '2025.01.08 12:23:45'
  }
])

// 手机号中间4位隐藏处理
const formatPhone = (phone: string) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 获取状态标签类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    '未支付': 'warning',
    '已支付': 'success',
    '已收货': 'info'
  }
  return statusMap[status] || 'info'
}

// 查看详情
const handleView = (row: any) => {
  console.log('查看详情:', row)
}

// 重置功能
const handleReset = () => {
  searchForm.username = ''
  searchForm.phone = ''
  searchForm.status = '全部'
}
</script>

<style scoped>
.orders-container {
  padding: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
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
</style> 