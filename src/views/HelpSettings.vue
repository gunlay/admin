<template>
  <div class="help-settings-container">
    <h2>帮助中心配置</h2>
    <el-card>
      <template #header>
        <div class="header-actions">
          <el-button type="primary" @click="handleAdd">新增帮助文档</el-button>
        </div>
      </template>
      
      <el-table :data="helpList" style="width: 100%">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增帮助文档' : '编辑帮助文档'"
      width="60%"
    >
      <el-form :model="formData" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="formData.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="formData.category" placeholder="请选择分类">
            <el-option label="常见问题" value="faq" />
            <el-option label="使用指南" value="guide" />
            <el-option label="服务条款" value="terms" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="formData.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="formData.content"
            type="textarea"
            rows="10"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const helpList = ref([
  {
    id: 1,
    title: '如何修改密码？',
    category: '常见问题',
    sort: 1,
    status: 1,
    updateTime: '2024-02-09 15:30:00'
  },
  {
    id: 2,
    title: '新手使用指南',
    category: '使用指南',
    sort: 0,
    status: 1,
    updateTime: '2024-02-09 16:00:00'
  }
])

const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formData = reactive({
  id: '',
  title: '',
  category: '',
  sort: 0,
  content: ''
})

const handleAdd = () => {
  dialogType.value = 'add'
  Object.assign(formData, {
    id: '',
    title: '',
    category: '',
    sort: 0,
    content: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    '确定要删除这条帮助文档吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 这里添加删除逻辑
    ElMessage.success('删除成功')
  })
}

const handleStatusChange = (row: any) => {
  // 这里添加状态更新逻辑
  ElMessage.success('状态更新成功')
}

const handleSubmit = () => {
  // 这里添加提交逻辑
  ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
  dialogVisible.value = false
}
</script>

<style scoped>
.help-settings-container {
  padding: 20px;
}

.header-actions {
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 