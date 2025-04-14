<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['create', 'update'])

const dialogVisible = ref(false)
const dialogType = ref<'create' | 'edit'>('create')

// 表单数据
const formData = reactive({
  id: 0,
  name: '',
  code: '',
  description: '',
  expireTime: '',
  maxUses: 1
})

// 显示创建对话框
const showCreateDialog = () => {
  dialogType.value = 'create'
  // 重置表单数据
  formData.id = 0
  formData.name = ''
  formData.code = ''
  formData.description = ''
  formData.expireTime = ''
  formData.maxUses = 1
  dialogVisible.value = true
}

// 显示编辑对话框，接收行数据
const showEditDialog = (row: any) => {
  dialogType.value = 'edit'
  // 填充表单数据
  formData.id = row.id
  formData.name = row.name
  formData.code = row.code
  formData.description = row.description
  formData.expireTime = row.expireTime
  formData.maxUses = row.maxUses
  dialogVisible.value = true
}

// 提交处理方法
const handleSubmit = () => {
  if (!formData.name || !formData.code || !formData.expireTime) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (dialogType.value === 'create') {
    // 新建逻辑
    const newInvitation = {
      id: Date.now(),
      name: formData.name,
      code: formData.code,
      description: formData.description || '',
      expireTime: formData.expireTime,
      maxUses: formData.maxUses,
      usedCount: 0,
      status: '未使用',
      createTime: new Date().toLocaleString('zh-CN').replace(/\//g, '.'),
      totalUsers: 0,
      yesterdayUsers: 0
    }

    emit('create', newInvitation)
    ElMessage.success('创建成功')
  } else {
    // 编辑逻辑
    const updatedInvitation = {
      id: formData.id,
      name: formData.name,
      code: formData.code,
      description: formData.description,
      expireTime: formData.expireTime,
      maxUses: formData.maxUses,
      // 以下字段在编辑时不修改，需要从原数据中获取
      usedCount: 0,
      totalUsers: 0,
      yesterdayUsers: 0,
      createTime: ''
    }

    emit('update', updatedInvitation)
    ElMessage.success('更新成功')
  }

  dialogVisible.value = false
}

defineExpose({
  showCreateDialog,
  showEditDialog
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogType === 'create' ? '新建邀请' : '编辑邀请'"
    width="500px"
  >
    <el-form
      :model="formData"
      label-width="100px"
    >
      <el-form-item label="渠道名称">
        <el-input
          v-model="formData.name"
          placeholder="请输入渠道名称"
        />
      </el-form-item>
      <el-form-item label="渠道码">
        <el-input
          v-model="formData.code"
          placeholder="请输入邀请码"
        />
      </el-form-item>
      <el-form-item label="渠道描述">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入渠道描述"
        />
      </el-form-item>
      <el-form-item label="有效期">
        <el-date-picker
          v-model="formData.expireTime"
          type="datetime"
          placeholder="请选择有效期"
          format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="使用次数">
        <el-input-number
          v-model="formData.maxUses"
          :min="1"
          placeholder="请输入可使用次数"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-date-editor) {
  width: 100%;
}

:deep(.el-textarea__inner) {
  background-color: var(--el-fill-color-blank);
}
</style>
