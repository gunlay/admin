<template>
  <el-config-provider :locale="locale">
    <div class="complaints-container">
      <h2>投诉管理</h2>
      <el-card>
        <template #header>
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="用户名">
              <el-input v-model="searchForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="searchForm.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="投诉状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态">
                <el-option label="全部" value="全部" />
                <el-option label="已解决" value="已解决" />
                <el-option label="处理中" value="处理中" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </template>

        <el-table :data="complaintList" style="width: 100%">
          <el-table-column prop="id" label="投诉编号" width="120" />
          <el-table-column prop="complainant" label="投诉人" width="100" />
          <el-table-column label="手机号" width="120">
            <template #default="scope">
              {{ formatPhone(scope.row.phone) }}
            </template>
          </el-table-column>
          <el-table-column prop="defendant" label="被投诉人" width="100" />
          <el-table-column label="手机号" width="120">
            <template #default="scope">
              {{ formatPhone(scope.row.defendantPhone) }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="投诉时间" width="180" />
          <el-table-column prop="type" label="投诉类型" width="120" />
          <el-table-column prop="materials" label="投诉材料" width="120" />
          <el-table-column label="状态" width="100">
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
  username: '',
  phone: '',
  status: '全部'
})

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 添加一个原始数据的引用
const originalComplaintList = [
  {
    id: 'TS20250102001',
    complainant: '张三',
    phone: '18812342349',
    defendant: '王五',
    defendantPhone: '18812342349',
    createTime: '2025.01.02 12:23:45',
    type: '服务投诉',
    materials: '查看',
    status: '已解决'
  },
  {
    id: 'TS20250105001',
    complainant: '李四',
    phone: '13412349874',
    defendant: '张三',
    defendantPhone: '13412349874',
    createTime: '2025.01.05 12:23:45',
    type: '商品投诉',
    materials: '查看',
    status: '处理中'
  },
  {
    id: 'TS20250108001',
    complainant: '王五',
    phone: '13412349872',
    defendant: '李四',
    defendantPhone: '13412349872',
    createTime: '2025.01.08 12:23:45',
    type: '服务投诉',
    materials: '查看',
    status: '处理中'
  }
]

const complaintList = ref([...originalComplaintList])

// 手机号中间4位隐藏处理
const formatPhone = (phone: string) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 获取状态标签类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    '已解决': 'success',
    '处理中': 'warning'
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
  const filteredList = originalComplaintList.filter(complaint => {
    const matchUsername = searchForm.username ? 
      (complaint.complainant.includes(searchForm.username) || complaint.defendant.includes(searchForm.username)) : true
    const matchPhone = searchForm.phone ? 
      (complaint.phone.includes(searchForm.phone) || complaint.defendantPhone.includes(searchForm.phone)) : true
    const matchStatus = searchForm.status === '全部' ? true : complaint.status === searchForm.status
    
    return matchUsername && matchPhone && matchStatus
  })
  
  complaintList.value = filteredList
  ElMessage.success('查询成功')
}

// 修改重置功能
const handleReset = () => {
  // 重置表单
  searchForm.username = ''
  searchForm.phone = ''
  searchForm.status = '全部'
  
  // 重置数据为初始状态
  complaintList.value = [...originalComplaintList]
  
  ElMessage.success('重置成功')
}
</script>

<style scoped>
.complaints-container {
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