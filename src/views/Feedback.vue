<template>
  <el-config-provider :locale="locale">
    <div class="feedback-container">
      <h2>意见反馈</h2>
      <el-card>
        <template #header>
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="用户名">
              <el-input v-model="searchForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态">
                <el-option label="全部" value="全部" />
                <el-option label="未处理" value="未处理" />
                <el-option label="已处理" value="已处理" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </template>

        <el-table :data="displayFeedbackList" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="username" label="用户名" width="120" />
          <el-table-column prop="content" label="反馈内容" min-width="200" show-overflow-tooltip />
          <el-table-column prop="createTime" label="反馈时间" width="180" />
          <el-table-column prop="handleTime" label="处理时间" width="180">
            <template #default="scope">
              {{ scope.row.handleTime || '—' }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
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

        <!-- 查看/处理对话框 -->
        <el-dialog
          v-model="dialogVisible"
          :title="formData.status === '未处理' ? '处理反馈' : '查看反馈'"
          width="600px"
        >
          <el-descriptions :column="1" border>
            <el-descriptions-item label="反馈ID">
              {{ formData.id }}
            </el-descriptions-item>
            <el-descriptions-item label="用户名">
              {{ formData.username }}
            </el-descriptions-item>
            <el-descriptions-item label="反馈内容">
              {{ formData.content }}
            </el-descriptions-item>
            <el-descriptions-item label="反馈时间">
              {{ formData.createTime }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
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
          </el-descriptions>

          <template v-if="formData.status === '未处理'">
            <div class="process-form">
              <h4>处理结果</h4>
              <el-input
                v-model="formData.result"
                type="textarea"
                :rows="4"
                placeholder="请输入处理结果"
              />
            </div>
          </template>

          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">关闭</el-button>
              <el-button 
                v-if="formData.status === '未处理'"
                type="primary" 
                @click="handleSubmit"
              >
                提交处理
              </el-button>
            </span>
          </template>
        </el-dialog>
      </el-card>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElConfigProvider } from 'element-plus'
import { locale } from '../config/element-plus'

interface Feedback {
  id: number
  username: string
  content: string
  createTime: string
  handleTime?: string
  status: string
  result?: string
}

// 列表数据
const feedbackList = ref<Feedback[]>([
  {
    id: 1,
    username: '张三',
    content: '系统使用很流畅，但是希望能增加更多功能',
    createTime: '2024.02.09 15:30:00',
    status: '未处理'
  },
  {
    id: 2,
    username: '李四',
    content: '界面设计很好看，用起来很方便',
    createTime: '2024.02.09 14:20:00',
    handleTime: '2024.02.09 16:30:00',
    status: '已处理',
    result: '感谢您的反馈，我们会继续努力提供更好的服务'
  }
])

const searchForm = reactive({
  username: '',
  status: '全部'
})

// 过滤后的列表
const filteredFeedbackList = computed(() => {
  return feedbackList.value.filter(feedback => {
    const matchUsername = searchForm.username ? feedback.username.includes(searchForm.username) : true
    const matchStatus = searchForm.status === '全部' ? true : feedback.status === searchForm.status
    return matchUsername && matchStatus
  })
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => filteredFeedbackList.value.length)

const displayFeedbackList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredFeedbackList.value.slice(start, end)
})

// 对话框相关
const dialogVisible = ref(false)
const formData = reactive<Feedback>({
  id: 0,
  username: '',
  content: '',
  createTime: '',
  status: '未处理',
  result: ''
})

// 查看功能
const handleView = (row: Feedback) => {
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 提交处理
const handleSubmit = () => {
  if (!formData.result?.trim()) {
    ElMessage.warning('请输入处理结果')
    return
  }

  const now = new Date().toLocaleString('zh-CN').replace(/\//g, '.')
  const index = feedbackList.value.findIndex(item => item.id === formData.id)
  
  if (index > -1) {
    const newList = [...feedbackList.value]
    newList[index] = {
      ...formData,
      status: '已处理',
      handleTime: now
    }
    feedbackList.value = newList
    ElMessage.success('处理成功')
    dialogVisible.value = false
  }
}

// 查询功能
const handleSearch = () => {
  currentPage.value = 1
  ElMessage.success('查询成功')
}

// 重置功能
const handleReset = () => {
  searchForm.username = ''
  searchForm.status = '全部'
  currentPage.value = 1
  ElMessage.success('重置成功')
}

// 获取状态标签类型
const getStatusType = (status: string) => {
  return status === '已处理' ? 'success' : 'warning'
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

.process-form {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-lighter);

  h4 {
    margin: 0 0 10px;
    color: var(--el-text-color-regular);
  }
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
  .el-input,
  .el-select,
  .el-textarea {
    width: 100%;
  }
}

:deep(.el-button--link) {
  padding: 4px 8px;
  height: auto;
  margin: 0 4px;
}
</style> 