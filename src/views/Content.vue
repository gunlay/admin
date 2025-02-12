<template>
  <el-config-provider :locale="locale">
    <div class="content-container">
      <h2>发布内容管理</h2>
      <el-card>
        <template #header>
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="用户名">
              <el-input v-model="searchForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="searchForm.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="用户角色">
              <el-select v-model="searchForm.role" placeholder="请选择角色">
                <el-option label="全部" value="全部" />
                <el-option label="大学生" value="大学生" />
                <el-option label="程序员" value="程序员" />
              </el-select>
            </el-form-item>
            <el-form-item label="发布状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态">
                <el-option label="全部" value="全部" />
                <el-option label="未审核" value="未审核" />
                <el-option label="已发布" value="已发布" />
                <el-option label="已驳回" value="已驳回" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </template>

        <el-table :data="displayContentList" style="width: 100%">
          <el-table-column prop="id" label="id" width="80" />
          <el-table-column prop="name" label="用户名" width="120" />
          <el-table-column label="手机号" width="120">
            <template #default="scope">
              {{ formatPhone(scope.row.phone) }}
            </template>
          </el-table-column>
          <el-table-column prop="role" label="用户角色" width="100" />
          <el-table-column prop="category" label="所属类别" width="120" />
          <el-table-column prop="createTime" label="发布时间" width="180" />
          <el-table-column label="发布状态" width="100">
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
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElConfigProvider } from 'element-plus'
import { locale } from '../config/element-plus'

const searchForm = reactive({
  username: '',
  phone: '',
  role: '全部',
  status: '全部'
})

const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => originalContentList.length)

const contentList = ref([
  {
    id: 3,
    name: '王五',
    phone: '13412349872',
    role: '程序员',
    category: '一级分类名',
    createTime: '2025.01.08 12:23:45',
    status: '已驳回'
  },
  {
    id: 2,
    name: '李四',
    phone: '13412349874',
    role: '程序员',
    category: '一级分类名',
    createTime: '2025.01.05 12:23:45',
    status: '已发布'
  },
  {
    id: 1,
    name: '张三',
    phone: '18812342349',
    role: '大学生',
    category: '一级分类名',
    createTime: '2025.01.02 12:23:45',
    status: '未审核'
  }
])

const originalContentList = [
  {
    id: 3,
    name: '王五',
    phone: '13412349872',
    role: '程序员',
    category: '一级分类名',
    createTime: '2025.01.08 12:23:45',
    status: '已驳回'
  },
  {
    id: 2,
    name: '李四',
    phone: '13412349874',
    role: '程序员',
    category: '一级分类名',
    createTime: '2025.01.05 12:23:45',
    status: '已发布'
  },
  {
    id: 1,
    name: '张三',
    phone: '18812342349',
    role: '大学生',
    category: '一级分类名',
    createTime: '2025.01.02 12:23:45',
    status: '未审核'
  }
]

// 手机号中间4位隐藏处理
const formatPhone = (phone: string) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 获取状态标签类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    '未审核': 'warning',
    '已发布': 'success',
    '已驳回': 'danger'
  }
  return statusMap[status] || 'info'
}

// 查看详情
const handleView = (row: any) => {
  console.log('查看详情:', row)
}

// 计算当前页显示的数据
const displayContentList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return contentList.value.slice(start, end)
})

// 修改查询功能，保持排序和分页
const handleSearch = () => {
  // 每次都基于原始数据进行过滤
  const filteredList = originalContentList.filter(content => {
    const matchUsername = searchForm.username ? content.name.includes(searchForm.username) : true
    const matchPhone = searchForm.phone ? content.phone.includes(searchForm.phone) : true
    const matchRole = searchForm.role === '全部' ? true : content.role === searchForm.role
    const matchStatus = searchForm.status === '全部' ? true : content.status === searchForm.status
    
    return matchUsername && matchPhone && matchRole && matchStatus
  })
  
  contentList.value = filteredList
  // 重置到第一页
  currentPage.value = 1
  ElMessage.success('查询成功')
}

// 修改重置功能
const handleReset = () => {
  // 重置表单
  searchForm.username = ''
  searchForm.phone = ''
  searchForm.role = '全部'
  searchForm.status = '全部'
  
  // 重置数据为初始状态
  contentList.value = [...originalContentList]
  // 重置到第一页
  currentPage.value = 1
  
  ElMessage.success('重置成功')
}
</script>

<style scoped>
.content-container {
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