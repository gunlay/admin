<script setup lang="ts">
import { dayjs } from 'element-plus'
import { ref, reactive } from 'vue'
import { UserAuthList } from './const'
import { UserAuthDetailDTO, UserAuthEnum, UserAuthorizationEnum } from '@/api/types/userAuth'
import { UserAuthorizationList } from './const'

const dialogVisible = ref(false)
const formData = reactive<UserAuthDetailDTO>({
  id: 0,
  type: UserAuthorizationEnum.TechAuthorization,
  authImage: '',
  createTime: '', // 添加提交时间
  status: UserAuthEnum.Authing,
  userId: 0,
  content: ''
})

// 修改审核处理方法，添加类型定义
// const handleAudit = (action: '通过' | '拒绝') => {
//   ElMessageBox.confirm(`确定要${action}该用户的认证申请吗？`, '提示', {
//     confirmButtonText: '确定',
//     cancelButtonText: '取消',
//     type: action === '通过' ? 'success' : 'warning'
//   }).then(() => {
//     // 更新状态
//     const newStatus = action === '通过' ? '已通过' : '已拒绝'
//     formData.status = newStatus

//     // 同步更新列表中的数据
//     // const record = authList.value.find(item => item.id === formData.id)
//     // if (record) {
//     //   record.status = newStatus
//     //   record.authTime = new Date()
//     //     .toLocaleString('zh-CN', {
//     //       year: 'numeric',
//     //       month: '2-digit',
//     //       day: '2-digit',
//     //       hour: '2-digit',
//     //       minute: '2-digit',
//     //       second: '2-digit'
//     //     })
//     //     .replace(/\//g, '.')
//     // }

//     ElMessage.success('审核成功')
//     dialogVisible.value = false
//   })
// }

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
      <!-- <el-form-item label="用户名">
        <span>{{ formData.userName }}</span>
      </el-form-item> -->
      <el-form-item label="认证类型：">
        <span>{{ UserAuthorizationList.find(item => item.value === formData.type)?.label }}</span>
      </el-form-item>
      <el-form-item label="认证材料：">
        <el-image
          v-if="formData.authImage"
          :src="formData.authImage"
          :preview-src-list="[formData.authImage]"
          fit="cover"
          class="auth-image"
        />
      </el-form-item>
      <el-form-item label="提交时间">
        <span>{{ dayjs(formData.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-tag :type="UserAuthList.find(item => item.value === formData.status)?.type">
          {{ UserAuthList.find(item => item.value === formData.status)?.label }}
        </el-tag>
      </el-form-item>
      <el-form-item label="认证内容">
        <span>{{ formData.content }}</span>
      </el-form-item>
      <!-- <el-form-item label="审核时间">
        <span>{{ dayjs(formData.authTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
      </el-form-item> -->
    </el-form>
    <!-- <template #footer>
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
    </template> -->
  </el-dialog>
</template>

<style scoped>
.auth-image {
  width: 200px;
  height: 150px;
}
</style>
