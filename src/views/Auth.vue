<template>
  <el-config-provider :locale="locale">
    <div class="auth-container">
      <h2>认证管理</h2>
      <el-card>
        <template #header>
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="用户名">
              <el-input v-model="searchForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="searchForm.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="认证类别">
              <el-select v-model="searchForm.authType" placeholder="请选择类别">
                <el-option label="全部" value="全部" />
                <el-option label="工作认证" value="工作认证" />
                <el-option label="技能认证" value="技能认证" />
              </el-select>
            </el-form-item>
            <el-form-item label="审核状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态">
                <el-option label="全部" value="全部" />
                <el-option label="未审核" value="未审核" />
                <el-option label="已通过" value="已通过" />
                <el-option label="已拒绝" value="已拒绝" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </template>

        <el-table :data="displayAuthList" style="width: 100%">
          <el-table-column prop="id" label="id" width="100" />
          <el-table-column prop="name" label="用户名" width="120" />
          <el-table-column label="手机号" width="120">
            <template #default="scope">
              {{ formatPhone(scope.row.phone) }}
            </template>
          </el-table-column>
          <el-table-column prop="authType" label="认证类别" width="120" />
          <el-table-column label="审核状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="authTime" label="审核时间" width="180" />
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

      <!-- 查看详情对话框 -->
      <el-dialog
        v-model="dialogVisible"
        title="认证信息详情"
        width="500px"
      >
        <el-form :model="formData" label-width="100px">
          <el-form-item label="用户名">
            <span>{{ formData.username }}</span>
          </el-form-item>
          <el-form-item label="认证类型">
            <span>{{ formData.type }}</span>
          </el-form-item>
          <el-form-item label="认证材料">
            <el-image
              v-if="formData.materials"
              :src="formData.materials"
              :preview-src-list="[formData.materials]"
              fit="cover"
              class="auth-image"
            />
          </el-form-item>
          <el-form-item label="申请时间">
            <span>{{ formData.applyTime }}</span>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-tag :type="getStatusType(formData.status)">
              {{ formData.status }}
            </el-tag>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">关闭</el-button>
            <template v-if="formData.status === '未审核'">
              <el-button type="success" @click="handleAudit('通过')">通过</el-button>
              <el-button type="danger" @click="handleAudit('拒绝')">拒绝</el-button>
            </template>
          </span>
        </template>
      </el-dialog>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox, ElConfigProvider } from 'element-plus'
import { locale } from '../config/element-plus'

const currentPage = ref(1)
const pageSize = ref(10)
// 计算总条数
const total = computed(() => originalAuthList.length)

// 计算当前页显示的数据
const displayAuthList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return authList.value.slice(start, end)
})

// 修改初始列表数据，按审核时间倒序排列
const authList = ref([
  {
    id: 3,
    name: '王五',
    phone: '13412349872',
    authType: '技能认证',
    status: '已拒绝',
    authTime: '2025.01.08 12:23:45'
  },
  {
    id: 2,
    name: '李四',
    phone: '13412349874',
    authType: '技能认证',
    status: '未审核',
    authTime: '2025.01.05 12:23:45'
  },
  {
    id: 1,
    name: '张三',
    phone: '18812342349',
    authType: '工作认证',
    status: '已通过',
    authTime: '2025.01.02 12:23:45'
  }
])

const dialogVisible = ref(false)
const formData = reactive({
  id: '',
  username: '',
  type: '',
  materials: '',
  applyTime: '',
  status: ''
})

// 手机号中间4位隐藏处理
const formatPhone = (phone: string) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 获取状态标签类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    '已通过': 'success',
    '未审核': 'warning',
    '已拒绝': 'danger'
  }
  return statusMap[status] || 'info'
}

// 查看详情
const handleView = (row: any) => {
  formData.id = row.id
  formData.username = row.name
  formData.type = row.authType
  formData.materials = row.materials || '' // 如果暂时没有材料，使用空字符串
  formData.applyTime = row.authTime
  formData.status = row.status
  dialogVisible.value = true
}

// 修改审核处理方法，添加类型定义
const handleAudit = (action: '通过' | '拒绝') => {
  ElMessageBox.confirm(
    `确定要${action}该用户的认证申请吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: action === '通过' ? 'success' : 'warning'
    }
  ).then(() => {
    // 更新状态
    const newStatus = action === '通过' ? '已通过' : '已拒绝'
    formData.status = newStatus
    
    // 同步更新列表中的数据
    const record = authList.value.find(item => item.id === formData.id)
    if (record) {
      record.status = newStatus
      record.authTime = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '.')
    }
    
    ElMessage.success(`审核${action}成功`)
    dialogVisible.value = false
  })
}

// 添加搜索表单数据
const searchForm = reactive({
  username: '',
  phone: '',
  authType: '全部',
  status: '全部'
})

// originalAuthList 的定义也保持按时间倒序
const originalAuthList = [
  {
    id: 3,
    name: '王五',
    phone: '13412349872',
    authType: '技能认证',
    status: '已拒绝',
    authTime: '2025.01.08 12:23:45'
  },
  {
    id: 2,
    name: '李四',
    phone: '13412349874',
    authType: '技能认证',
    status: '未审核',
    authTime: '2025.01.05 12:23:45'
  },
  {
    id: 1,
    name: '张三',
    phone: '18812342349',
    authType: '工作认证',
    status: '已通过',
    authTime: '2025.01.02 12:23:45'
  }
]

// 修改查询功能，保持排序和分页
const handleSearch = () => {
  // 每次都基于原始数据进行过滤
  const filteredList = originalAuthList.filter(auth => {
    const matchUsername = searchForm.username ? auth.name.includes(searchForm.username) : true
    const matchPhone = searchForm.phone ? auth.phone.includes(searchForm.phone) : true
    const matchAuthType = searchForm.authType === '全部' ? true : auth.authType === searchForm.authType
    const matchStatus = searchForm.status === '全部' ? true : auth.status === searchForm.status
    
    return matchUsername && matchPhone && matchAuthType && matchStatus
  })
  
  authList.value = filteredList
  // 重置到第一页
  currentPage.value = 1
  ElMessage.success('查询成功')
}

// 修改重置功能
const handleReset = () => {
  // 重置表单
  searchForm.username = ''
  searchForm.phone = ''
  searchForm.authType = '全部'
  searchForm.status = '全部'
  
  // 重置数据为初始状态
  authList.value = [...originalAuthList]
  // 重置到第一页
  currentPage.value = 1
  
  ElMessage.success('重置成功')
}
</script>

<style scoped>
.auth-container {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-select) {
  width: 120px;
}

:deep(.el-input__wrapper) {
  background-color: var(--el-fill-color-blank);
}

.auth-image {
  width: 200px;
  height: 150px;
  border-radius: 4px;
}
</style> 