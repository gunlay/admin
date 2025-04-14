<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['process'])

const dialogVisible = ref(false)
const processDialogVisible = ref(false)

// 获取状态标签类型
const getStatusType = (
  status: string
): 'success' | 'warning' | 'info' | 'danger' | 'primary' | undefined => {
  const statusMap: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'primary'> = {
    未处理: 'danger',
    处理中: 'warning',
    已处理: 'success'
  }
  return statusMap[status]
}

// 表单数据
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

// 处理表单数据
const processForm = reactive({
  result: ''
})

// 显示详情对话框
const showDialog = (row: any) => {
  formData.id = row.id
  formData.username = row.complainant
  formData.phone = row.phone
  formData.type = row.type
  formData.content = row.materials
  formData.createTime = row.createTime
  formData.status = row.status
  formData.handleTime = row.handleTime
  formData.result = row.result || ''
  formData.images = row.images || []

  dialogVisible.value = true
}

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

  // 更新表单数据
  formData.status = '已处理'
  formData.handleTime = new Date().toLocaleString('zh-CN').replace(/\//g, '.')
  formData.result = processForm.result

  // 发送处理事件到父组件
  emit('process', {
    id: formData.id,
    result: processForm.result
  })

  ElMessage.success('处理成功')
  processDialogVisible.value = false
}

defineExpose({
  showDialog
})
</script>

<template>
  <!-- 查看详情对话框 -->
  <el-dialog
    v-model="dialogVisible"
    title="投诉详情"
    width="600px"
  >
    <el-descriptions
      :column="1"
      border
    >
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
      <el-descriptions-item
        label="处理时间"
        v-if="formData.handleTime"
      >
        {{ formData.handleTime }}
      </el-descriptions-item>
      <el-descriptions-item
        label="处理结果"
        v-if="formData.result"
      >
        {{ formData.result }}
      </el-descriptions-item>
      <el-descriptions-item
        label="相关图片"
        v-if="formData.images && formData.images.length"
      >
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
    <el-form
      :model="processForm"
      label-width="100px"
    >
      <el-form-item
        label="处理结果"
        required
      >
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
        <el-button
          type="primary"
          @click="submitProcess"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
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

:deep(.el-tag) {
  min-width: 60px;
  text-align: center;
}
</style>
