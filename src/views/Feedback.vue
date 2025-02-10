<template>
  <el-config-provider :locale="locale">
    <div class="feedback-container">
      <h2>意见反馈管理</h2>
      <el-card>
        <template #header>
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="用户名">
              <el-input v-model="searchForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="searchForm.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="反馈状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态">
                <el-option label="全部" value="全部" />
                <el-option label="已处理" value="已处理" />
                <el-option label="未处理" value="未处理" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </template>

        <el-table :data="feedbackList" style="width: 100%">
          <el-table-column prop="id" label="反馈编号" width="120" />
          <el-table-column prop="username" label="用户名" width="100" />
          <el-table-column label="手机号" width="120">
            <template #default="scope">
              {{ formatPhone(scope.row.phone) }}
            </template>
          </el-table-column>
          <el-table-column prop="role" label="用户角色" width="100" />
          <el-table-column prop="contact" label="联系方式" width="120" />
          <el-table-column prop="type" label="反馈类型" width="100" />
          <el-table-column prop="content" label="反馈内容" show-overflow-tooltip />
          <el-table-column prop="createTime" label="反馈时间" width="180" />
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

const feedbackList = ref([
  {
    id: 'FK20250102001',
    username: '张三',
    phone: '18812342349',
    role: '大学生',
    contact: 'zhangsan@example.com',
    type: '功能建议',
    content: '希望能增加更多的筛选功能',
    createTime: '2025.01.02 12:23:45',
    status: '已处理'
  },
  {
    id: 'FK20250105001',
    username: '李四',
    phone: '13412349874',
    role: '程序员',
    contact: '13412349874',
    type: 'BUG反馈',
    content: '页面加载速度较慢',
    createTime: '2025.01.05 12:23:45',
    status: '未处理'
  },
  {
    id: 'FK20250108001',
    username: '王五',
    phone: '13412349872',
    role: '设计师',
    contact: 'wangwu@example.com',
    type: '体验优化',
    content: '界面设计需要优化',
    createTime: '2025.01.08 12:23:45',
    status: '未处理'
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
    '已处理': 'success',
    '未处理': 'warning'
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
.feedback-container {
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