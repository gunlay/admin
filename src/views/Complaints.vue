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
                <el-option label="已处理" value="已处理" />
                <el-option label="处理中" value="处理中" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </template>

        <el-table :data="displayComplaintList" style="width: 100%">
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
          <el-table-column label="处理时间" width="180">
            <template #default="scope">
              {{ scope.row.handleTime || '—' }}
            </template>
          </el-table-column>
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
        title="投诉详情"
        width="600px"
      >
        <el-descriptions :column="1" border>
          <el-descriptions-item label="投诉编号">
            {{ formData.id }}
          </el-descriptions-item>
          <el-descriptions-item label="投诉用户">
            {{ formData.username }}
          </el-descriptions-item>
          <el-descriptions-item label="手机号">
            {{ formData.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="投诉类型">
            {{ formData.type }}
          </el-descriptions-item>
          <el-descriptions-item label="投诉内容">
            {{ formData.content }}
          </el-descriptions-item>
          <el-descriptions-item label="投诉时间">
            {{ formData.createTime }}
          </el-descriptions-item>
          <el-descriptions-item label="处理状态">
            <el-tag :type="getStatusType(formData.status)">
              {{ formData.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="处理时间" v-if="formData.handleTime">
            {{ formData.handleTime }}
          </el-descriptions-item>
          <el-descriptions-item label="处理结果" v-if="formData.result">
            {{ formData.result }}
          </el-descriptions-item>
          <el-descriptions-item label="相关图片" v-if="formData.images && formData.images.length">
            <div class="image-list">
              <el-image
                v-for="(url, index) in formData.images"
                :key="index"
                :src="url"
                :preview-src-list="formData.images"
                fit="cover"
                class="complaint-image"
              />
            </div>
          </el-descriptions-item>
        </el-descriptions>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">关闭</el-button>
            <el-button 
              type="primary" 
              v-if="formData.status === '处理中'"
              @click="handleProcess"
            >
              处理
            </el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 处理确认对话框 -->
      <el-dialog
        v-model="processDialogVisible"
        title="处理投诉"
        width="500px"
      >
        <el-form :model="processForm" label-width="100px">
          <el-form-item label="处理结果" required>
            <el-input
              v-model="processForm.result"
              type="textarea"
              :rows="4"
              placeholder="请输入处理结果"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="processDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitProcess">确定</el-button>
          </span>
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
const total = computed(() => originalComplaintList.length)

// 计算当前页显示的数据
const displayComplaintList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return complaintList.value.slice(start, end)
})

// 修改初始列表数据，按投诉时间倒序排列
const complaintList = ref([
  {
    id: 'TS20250108001',
    complainant: '王五',
    phone: '13412349872',
    defendant: '李四',
    defendantPhone: '13412349872',
    createTime: '2025.01.08 12:23:45',
    handleTime: '',
    type: '服务投诉',
    materials: '查看',
    status: '处理中'
  },
  {
    id: 'TS20250105001',
    complainant: '李四',
    phone: '13412349874',
    defendant: '张三',
    defendantPhone: '13412349874',
    createTime: '2025.01.05 12:23:45',
    handleTime: '',
    type: '商品投诉',
    materials: '查看',
    status: '处理中'
  },
  {
    id: 'TS20250102001',
    complainant: '张三',
    phone: '18812342349',
    defendant: '王五',
    defendantPhone: '18812342349',
    createTime: '2025.01.02 12:23:45',
    handleTime: '2025.01.03 15:30:22',
    type: '服务投诉',
    materials: '查看',
    status: '已处理'
  }
])

// originalComplaintList 的定义也保持按时间倒序
const originalComplaintList = [
  {
    id: 'TS20250108001',
    complainant: '王五',
    phone: '13412349872',
    defendant: '李四',
    defendantPhone: '13412349872',
    createTime: '2025.01.08 12:23:45',
    handleTime: '',
    type: '服务投诉',
    materials: '查看',
    status: '处理中'
  },
  {
    id: 'TS20250105001',
    complainant: '李四',
    phone: '13412349874',
    defendant: '张三',
    defendantPhone: '13412349874',
    createTime: '2025.01.05 12:23:45',
    handleTime: '',
    type: '商品投诉',
    materials: '查看',
    status: '处理中'
  },
  {
    id: 'TS20250102001',
    complainant: '张三',
    phone: '18812342349',
    defendant: '王五',
    defendantPhone: '18812342349',
    createTime: '2025.01.02 12:23:45',
    handleTime: '2025.01.03 15:30:22',
    type: '服务投诉',
    materials: '查看',
    status: '已处理'
  }
]

// 手机号中间4位隐藏处理
const formatPhone = (phone: string) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

const dialogVisible = ref(false)
const formData = reactive({
  id: '',
  username: '',
  phone: '',
  type: '',
  content: '',
  createTime: '',
  status: '',
  handleTime: '',
  result: '',
  images: [] as string[]
})

// 查看详情
const handleView = (row: any) => {
  formData.id = row.id
  formData.username = row.complainant
  formData.phone = row.phone
  formData.type = row.type
  formData.content = row.materials
  formData.createTime = row.createTime
  formData.status = row.status
  formData.handleTime = row.handleTime
  formData.result = row.result
  formData.images = row.images || []
  
  dialogVisible.value = true
}

const processDialogVisible = ref(false)
const processForm = reactive({
  result: ''
})

// 处理投诉
const handleProcess = () => {
  processForm.result = '' // 重置处理结果
  processDialogVisible.value = true
}

// 提交处理结果
const submitProcess = () => {
  if (!processForm.result.trim()) {
    ElMessage.warning('请输入处理结果')
    return
  }

  // 更新列表中的状态
  const updateComplaint = (list: any[]) => {
    const index = list.findIndex(item => item.id === formData.id)
    if (index > -1) {
      list[index] = {
        ...list[index],
        status: '已处理',
        handleTime: new Date().toLocaleString('zh-CN').replace(/\//g, '.'),
        result: processForm.result
      }
    }
  }

  // 更新当前列表和原始列表
  updateComplaint(complaintList.value)
  updateComplaint(originalComplaintList)

  // 更新表单数据
  formData.status = '已处理'
  formData.handleTime = new Date().toLocaleString('zh-CN').replace(/\//g, '.')
  formData.result = processForm.result

  ElMessage.success('处理成功')
  processDialogVisible.value = false
}

// 获取状态标签类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    '未处理': 'danger',
    '处理中': 'warning',
    '已处理': 'success'
  }
  return statusMap[status] || 'info'
}

// 修改查询功能，保持排序和分页
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
  complaintList.value = [...originalComplaintList]
  // 重置到第一页
  currentPage.value = 1
  
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

.complaint-image {
  width: 120px;
  height: 120px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
}

:deep(.el-descriptions) {
  padding: 20px;
}

:deep(.el-descriptions__label) {
  width: 120px;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-dialog) {
  .el-textarea {
    width: 100%;
  }
}

:deep(.el-button--small) {
  padding: 5px 12px;
  height: 24px;
  font-size: 12px;
  border-radius: 2px;
}
</style> 