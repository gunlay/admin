<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { ref, reactive } from 'vue'

const dialogVisible = ref(false)
const formData = reactive({
  id: '',
  username: '',
  type: '',
  materials: '',
  applyTime: '',
  status: '',
  createTime: '', // 添加提交时间
  authTime: ''
})

// 获取状态标签类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    已通过: 'success',
    未审核: 'warning',
    已拒绝: 'danger'
  }
  return statusMap[status] || 'info'
}

// 修改审核处理方法，添加类型定义
const handleAudit = (action: '通过' | '拒绝') => {
  ElMessageBox.confirm(`确定要${action}该用户的认证申请吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: action === '通过' ? 'success' : 'warning'
  }).then(() => {
    // 更新状态
    const newStatus = action === '通过' ? '已通过' : '已拒绝'
    formData.status = newStatus

    // 同步更新列表中的数据
    // const record = authList.value.find(item => item.id === formData.id)
    // if (record) {
    //   record.status = newStatus
    //   record.authTime = new Date()
    //     .toLocaleString('zh-CN', {
    //       year: 'numeric',
    //       month: '2-digit',
    //       day: '2-digit',
    //       hour: '2-digit',
    //       minute: '2-digit',
    //       second: '2-digit'
    //     })
    //     .replace(/\//g, '.')
    // }

    ElMessage.success('审核成功')
    dialogVisible.value = false
  })
}

const showDialog = (row: any) => {
  Object.assign(formData, row)
  dialogVisible.value = true
}

defineExpose({
  showDialog
})
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    title="认证信息详情"
    width="500px"
  >
    <el-form
      :model="formData"
      label-width="100px"
    >
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
      <el-form-item label="提交时间">
        <span>{{ formData.createTime }}</span>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-tag :type="getStatusType(formData.status)">
          {{ formData.status }}
        </el-tag>
      </el-form-item>
      <el-form-item label="审核时间">
        <span>{{ formData.authTime }}</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <template v-if="formData.status === '未审核'">
          <el-button
            type="success"
            @click="handleAudit('通过')"
            >通过</el-button
          >
          <el-button
            type="danger"
            @click="handleAudit('拒绝')"
            >拒绝</el-button
          >
        </template>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
