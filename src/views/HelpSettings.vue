<template>
  <el-config-provider :locale="locale">
    <div class="help-settings-container">
      <h2>帮助中心配置</h2>
      <el-card>
        <template #header>
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="标题">
              <el-input v-model="searchForm.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="分类">
              <el-select v-model="searchForm.category" placeholder="请选择分类">
                <el-option label="全部" value="全部" />
                <el-option label="新手指南" value="新手指南" />
                <el-option label="常见问题" value="常见问题" />
                <el-option label="服务协议" value="服务协议" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleCreate">新增帮助文档</el-button>
            </el-form-item>
          </el-form>
        </template>

        <el-table :data="displayHelpList" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="title" label="标题" width="200" />
          <el-table-column prop="category" label="分类" width="120" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="updateTime" label="更新时间" width="180" />
          <el-table-column label="状态" width="100">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="'已发布'"
                :inactive-value="'未发布'"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template #default="scope">
              <el-button 
                type="primary" 
                link
                @click="handleEdit(scope.row)"
              >
                编辑
              </el-button>
              <el-button 
                type="primary" 
                link
                @click="handleView(scope.row)"
              >
                查看
              </el-button>
              <el-button 
                type="danger" 
                link
                @click="handleDelete(scope.row)"
              >
                删除
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

        <!-- 新增/编辑对话框 -->
        <el-dialog
          v-model="dialogVisible"
          :title="dialogType === 'create' ? '新增帮助文档' : '编辑帮助文档'"
          width="800px"
        >
          <el-form :model="formData" label-width="100px">
            <el-form-item label="标题" required>
              <el-input v-model="formData.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="分类" required>
              <el-select v-model="formData.category" placeholder="请选择分类">
                <el-option label="新手指南" value="新手指南" />
                <el-option label="常见问题" value="常见问题" />
                <el-option label="服务协议" value="服务协议" />
              </el-select>
            </el-form-item>
            <el-form-item label="内容" required>
              <el-input
                v-model="formData.content"
                type="textarea"
                :rows="15"
                placeholder="请输入内容"
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="formData.status">
                <el-radio label="已发布">已发布</el-radio>
                <el-radio label="未发布">未发布</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="handleSubmit">确定</el-button>
            </span>
          </template>
        </el-dialog>

        <!-- 删除确认对话框 -->
        <el-dialog
          v-model="deleteDialogVisible"
          title="确认删除"
          width="400px"
        >
          <div>确定要删除该帮助文档吗？</div>
          <div class="delete-info">
            <p>标题：{{ deleteItem?.title }}</p>
            <p>分类：{{ deleteItem?.category }}</p>
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="deleteDialogVisible = false">取消</el-button>
              <el-button type="danger" @click="confirmDelete">确定</el-button>
            </span>
          </template>
        </el-dialog>
      </el-card>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, reactive, computed, shallowRef } from 'vue'
import { ElMessage, ElConfigProvider } from 'element-plus'
import { locale } from '../config/element-plus'

interface HelpDoc {
  id: number
  title: string
  category: string
  content: string
  createTime: string
  updateTime: string
  status: string
}

// 使用 shallowRef 来管理列表数据
const helpList = shallowRef<HelpDoc[]>([
  {
    id: 1,
    title: '如何修改密码?',
    category: '常见问题',
    content: '1. 登录后点击右上角头像\n2. 选择修改密码\n3. 输入原密码和新密码\n4. 点击确定完成修改',
    createTime: '2024.02.09 15:30:00',
    updateTime: '2024.02.09 15:30:00',
    status: '已发布'
  },
  {
    id: 2,
    title: '新手使用指南',
    category: '使用指南',
    content: '欢迎使用本系统，本指南将帮助您快速了解系统功能...',
    createTime: '2024.02.09 16:00:00',
    updateTime: '2024.02.09 16:00:00',
    status: '已发布'
  }
])

const searchForm = reactive({
  title: '',
  category: '全部'
})

// 过滤后的列表
const filteredHelpList = computed(() => {
  return helpList.value.filter(help => {
    const matchTitle = searchForm.title ? help.title.includes(searchForm.title) : true
    const matchCategory = searchForm.category === '全部' ? true : help.category === searchForm.category
    return matchTitle && matchCategory
  })
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => filteredHelpList.value.length)

const displayHelpList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredHelpList.value.slice(start, end)
})

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref<'create' | 'edit'>('create')
const formData = reactive({
  id: 0,
  title: '',
  category: '',
  content: '',
  status: '未发布'
})

// 提交处理方法
const handleSubmit = () => {
  if (!formData.title || !formData.category || !formData.content) {
    ElMessage.warning('请填写完整信息')
    return
  }

  const now = new Date().toLocaleString('zh-CN').replace(/\//g, '.')
  const helpData: HelpDoc = {
    id: dialogType.value === 'create' ? Date.now() : formData.id,
    title: formData.title,
    category: formData.category,
    content: formData.content,
    createTime: dialogType.value === 'create' ? now : helpList.value.find(item => item.id === formData.id)?.createTime || now,
    updateTime: now,
    status: formData.status
  }

  const newList = [...helpList.value]
  
  if (dialogType.value === 'create') {
    newList.unshift(helpData)
  } else {
    const index = newList.findIndex(item => item.id === formData.id)
    if (index > -1) {
      newList[index] = helpData
    }
  }
  
  helpList.value = newList
  ElMessage.success(dialogType.value === 'create' ? '创建成功' : '更新成功')
  dialogVisible.value = false
}

// 删除相关
const deleteDialogVisible = ref(false)
const deleteItem = ref<HelpDoc | null>(null)

const handleDelete = (row: HelpDoc) => {
  deleteItem.value = row
  deleteDialogVisible.value = true
}

const confirmDelete = () => {
  if (!deleteItem.value) return
  
  const newList = helpList.value.filter(item => item.id !== deleteItem.value!.id)
  helpList.value = newList
  
  ElMessage.success('删除成功')
  deleteDialogVisible.value = false
  deleteItem.value = null
}

// 编辑功能
const handleEdit = (row: HelpDoc) => {
  dialogType.value = 'edit'
  Object.assign(formData, {
    id: row.id,
    title: row.title,
    category: row.category,
    content: row.content,
    status: row.status
  })
  dialogVisible.value = true
}

// 新增按钮处理方法
const handleCreate = () => {
  dialogType.value = 'create'
  formData.id = 0
  formData.title = ''
  formData.category = ''
  formData.content = ''
  formData.status = '未发布'
  dialogVisible.value = true
}

// 查询功能
const handleSearch = () => {
  currentPage.value = 1
  ElMessage.success('查询成功')
}

// 重置功能
const handleReset = () => {
  searchForm.title = ''
  searchForm.category = '全部'
  currentPage.value = 1
  ElMessage.success('重置成功')
}

// 查看功能
const handleView = (row: HelpDoc) => {
  console.log('查看文档:', row)
}

// 状态切换处理方法
const handleStatusChange = (row: HelpDoc) => {
  const newList = [...helpList.value]
  const index = newList.findIndex(item => item.id === row.id)
  if (index > -1) {
    newList[index] = {
      ...row,
      updateTime: new Date().toLocaleString('zh-CN').replace(/\//g, '.')
    }
    helpList.value = newList
    ElMessage.success(`${row.status === '已发布' ? '发布' : '下线'}成功`)
  }
}
</script>

<style scoped>
.help-settings-container {
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

.delete-info {
  margin: 20px 0;
  padding: 10px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
  
  p {
    margin: 5px 0;
    color: var(--el-text-color-regular);
  }
}

:deep(.el-button--link) {
  padding: 4px 8px;
  height: auto;
  margin: 0 4px;
  
  &.el-button--danger {
    color: var(--el-color-danger);
    
    &:hover {
      color: var(--el-color-danger-light-3);
    }
  }
}

:deep(.el-table) {
  .cell {
    display: flex;
    justify-content: flex-start;
    gap: 8px;
  }
}

:deep(.el-switch) {
  --el-switch-on-color: var(--el-color-success);
}
</style> 