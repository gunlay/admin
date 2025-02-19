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
                <el-option label="已完成" value="已完成" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </template>

        <el-table :data="displayOrderList" style="width: 100%">
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
          <el-table-column prop="actualAmount" label="实付金额" width="100">
            <template #default="scope">
              ¥{{ scope.row.actualAmount }}
            </template>
          </el-table-column>
          <el-table-column prop="receiveTime" label="完成时间" width="180">
            <template #default="scope">
              {{ scope.row.receiveTime || '—' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button 
                type="primary" 
                size="small"
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

      <!-- 查看详情对话框 -->
      <el-dialog
        v-model="dialogVisible"
        title="订单详情"
        width="500px"
      >
        <el-form :model="formData" label-width="100px">
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
            <span>{{ formData.serviceTime }}</span>
          </el-form-item>
          <el-form-item label="会议码">
            <span>{{ formData.meetingCode }}</span>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">关闭</el-button>
        </template>
      </el-dialog>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElConfigProvider } from 'element-plus'
import { locale } from '../config/element-plus'

const searchForm = reactive({
  username: '',
  phone: '',
  status: '全部'
})

const currentPage = ref(1)
const pageSize = ref(10)
// 计算总条数
const total = computed(() => originalOrderList.length)

// 计算当前页显示的数据
const displayOrderList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return orderList.value.slice(start, end)
})

// 修改初始列表数据，按下单时间倒序排列
const orderList = ref([
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
])

// originalOrderList 的定义也保持按时间倒序
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

const dialogVisible = ref(false)
const formData = reactive({
  orderNo: '',
  payerName: '',
  receiverName: '',
  createTime: '',
  status: '',
  amount: 0,
  actualAmount: 0,
  receiveTime: '',
  serviceTime: '',
  meetingCode: ''
})

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
    '已完成': 'info'
  }
  return statusMap[status] || 'info'
}

// 查看详情
const handleView = (row: any) => {
  formData.orderNo = row.orderNo
  formData.payerName = row.payerName
  formData.receiverName = row.receiverName
  formData.createTime = row.createTime
  formData.status = row.status
  formData.amount = row.amount
  formData.actualAmount = row.actualAmount
  formData.receiveTime = row.receiveTime
  formData.serviceTime = row.serviceTime
  formData.meetingCode = row.meetingCode
  dialogVisible.value = true
}

// 修改查询功能，保持排序和分页
const handleSearch = () => {
  // 每次都基于原始数据进行过滤
  const filteredList = originalOrderList.filter(order => {
    const matchUsername = searchForm.username ? 
      (order.payerName.includes(searchForm.username) || order.receiverName.includes(searchForm.username)) : true
    const matchPhone = searchForm.phone ? 
      (order.payerPhone.includes(searchForm.phone) || order.receiverPhone.includes(searchForm.phone)) : true
    const matchStatus = searchForm.status === '全部' ? true : order.status === searchForm.status
    
    return matchUsername && matchPhone && matchStatus
  })
  
  orderList.value = filteredList
  // 重置到第一页
  currentPage.value = 1
  ElMessage.success('查询成功')
}

// 修改重置功能
const handleReset = () => {
  // 重置表单
  searchForm.username = ''
  searchForm.phone = ''
  searchForm.status = '全部'
  
  // 重置数据为初始状态
  orderList.value = [...originalOrderList]
  // 重置到第一页
  currentPage.value = 1
  
  ElMessage.success('重置成功')
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

:deep(.el-button--small) {
  padding: 5px 12px;
  height: 24px;
  font-size: 12px;
  border-radius: 2px;
}
</style> 