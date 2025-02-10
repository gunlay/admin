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
              <el-button type="primary">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </template>

        <el-table :data="authList" style="width: 100%">
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
        title="认证详情"
        width="500px"
      >
        <el-form :model="detailForm" label-width="100px">
          <el-form-item label="用户昵称">
            <div>{{ detailForm.name }}</div>
          </el-form-item>
          <el-form-item label="手机号">
            <div>{{ formatPhone(detailForm.phone) }}</div>
          </el-form-item>
          <el-form-item label="认证类别">
            <div>{{ detailForm.authType }}</div>
          </el-form-item>
          <el-form-item label="认证材料">
            <!-- 这里可以添加认证材料的展示，如图片等 -->
          </el-form-item>
          <el-form-item label="审核状态" v-if="detailForm.status === '未审核'">
            <el-radio-group v-model="detailForm.auditResult">
              <el-radio label="通过">通过</el-radio>
              <el-radio label="拒绝">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">关闭</el-button>
            <el-button 
              v-if="detailForm.status === '未审核'"
              type="primary" 
              @click="handleAudit"
            >
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElConfigProvider } from 'element-plus'
import { locale } from '../config/element-plus'

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const authList = ref([
  {
    id: 1,
    name: '张三',
    phone: '18812342349',
    authType: '工作认证',
    status: '已通过',
    authTime: '2025.01.02 12:23:45'
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
    id: 3,
    name: '王五',
    phone: '13412349872',
    authType: '技能认证',
    status: '已拒绝',
    authTime: '2025.01.08 12:23:45'
  }
])

const dialogVisible = ref(false)
const detailForm = reactive({
  id: '',
  name: '',
  phone: '',
  authType: '',
  status: '',
  auditResult: ''
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
  Object.assign(detailForm, row)
  dialogVisible.value = true
}

// 提交审核
const handleAudit = () => {
  if (!detailForm.auditResult) {
    ElMessage.warning('请选择审核结果')
    return
  }
  
  ElMessage.success('审核提交成功')
  dialogVisible.value = false
}

// 添加搜索表单数据
const searchForm = reactive({
  username: '',
  phone: '',
  authType: '全部',
  status: '全部'
})

// 添加重置功能
const handleReset = () => {
  searchForm.username = ''
  searchForm.phone = ''
  searchForm.authType = '全部'
  searchForm.status = '全部'
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
</style> 