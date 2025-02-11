<template>
  <el-config-provider :locale="locale">
    <div class="coupons-container">
      <h2>券码管理</h2>
      <el-card>
        <template #header>
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="券码名称">
              <el-input v-model="searchForm.name" placeholder="请输入券码名称" />
            </el-form-item>
            <el-form-item label="券码类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型">
                <el-option label="全部" value="全部" />
                <el-option label="满减券" value="满减券" />
                <el-option label="打折券" value="打折券" />
              </el-select>
            </el-form-item>
            <el-form-item label="券码状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态">
                <el-option label="全部" value="全部" />
                <el-option label="已生效" value="已生效" />
                <el-option label="未生效" value="未生效" />
                <el-option label="已过期" value="已过期" />
                <el-option label="已下线" value="已下线" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </template>

        <el-table :data="couponList" style="width: 100%">
          <el-table-column prop="code" label="券码" width="120" />
          <el-table-column prop="name" label="券码名称" width="120" />
          <el-table-column prop="type" label="券码类型" width="100" />
          <el-table-column prop="amount" label="券码面额" width="120" />
          <el-table-column prop="validPeriod" label="有效期" width="120" />
          <el-table-column prop="createTime" label="生效开始时间" width="180" />
          <el-table-column label="券码状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
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
  name: '',
  type: '全部',
  status: '全部'
})

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 添加一个原始数据的引用
const originalCouponList = [
  {
    code: 'XRJ20250102',
    name: '新注册用户券',
    type: '满减券',
    amount: '满100减30',
    validPeriod: '自领取30日内',
    createTime: '2025.01.02 12:23:45',
    status: '已生效'
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
    code: 'CHJ20250108',
    name: '促活券',
    type: '满减券',
    amount: '无门槛减20',
    validPeriod: '截止2025.10.20',
    createTime: '2025.01.08 12:23:45',
    status: '已过期'
  },
  {
    code: 'CHJ20250109',
    name: '促活券',
    type: '打折券',
    amount: '8折30封顶',
    validPeriod: '截止2025.10.20',
    createTime: '2025.01.08 12:23:45',
    status: '已下线'
  }
]

const couponList = ref([...originalCouponList])

// 获取状态标签类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    '已生效': 'success',
    '未生效': 'warning',
    '已过期': 'info',
    '已下线': 'danger'
  }
  return statusMap[status] || 'info'
}

// 查看详情
const handleView = (row: any) => {
  console.log('查看详情:', row)
}

// 修改查询功能
const handleSearch = () => {
  // 每次都基于原始数据进行过滤
  const filteredList = originalCouponList.filter(coupon => {
    const matchName = searchForm.name ? coupon.name.includes(searchForm.name) : true
    const matchType = searchForm.type === '全部' ? true : coupon.type === searchForm.type
    const matchStatus = searchForm.status === '全部' ? true : coupon.status === searchForm.status
    
    return matchName && matchType && matchStatus
  })
  
  couponList.value = filteredList
  ElMessage.success('查询成功')
}

// 修改重置功能
const handleReset = () => {
  // 重置表单
  searchForm.name = ''
  searchForm.type = '全部'
  searchForm.status = '全部'
  
  // 重置数据为初始状态
  couponList.value = [...originalCouponList]
  
  ElMessage.success('重置成功')
}
</script>

<style scoped>
.coupons-container {
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