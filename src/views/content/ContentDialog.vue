<script setup lang="ts">
import { UserPostDetail, UserPubStatusEnum } from '@/api/types/userCotent'
import dayjs from 'dayjs'
import { ref } from 'vue'
import { reactive } from 'vue'
import { UserPubServiceTypeList } from './const'
import { UserPubStatusList } from './const'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Download, Document, Picture, Files } from '@element-plus/icons-vue'
import userPostApi from '@/api/userContent'

const emit = defineEmits(['update:dialogVisible', 'updateList'])
const dialogVisible = ref(false)

const formData = reactive<UserPostDetail>({} as UserPostDetail)
const showDialog = (_formData: UserPostDetail) => {
  Object.assign(formData, _formData)
  dialogVisible.value = true
}

// 获取文件扩展名
const getFileExtension = (filename: string) => {
  if (!filename) return ''
  return filename.split('.').pop()?.toLowerCase() || ''
}

// 判断是否为图片
const isImage = (filename: string) => {
  const ext = getFileExtension(filename)
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)
}

// 判断是否为文档
const isDocument = (filename: string) => {
  const ext = getFileExtension(filename)
  return ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'txt'].includes(ext)
}

// 下载文件
const downloadFile = (url: string) => {
  if (!url) return
  window.open(url, '_blank')
}

// 审核处理方法
const handleAudit = (action: UserPubStatusEnum.Pubed | UserPubStatusEnum.PubDenied) => {
  const actionText = action === UserPubStatusEnum.Pubed ? '通过' : '拒绝'
  ElMessageBox.confirm(`确定要${actionText}该内容吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: action === UserPubStatusEnum.Pubed ? 'success' : 'warning'
  }).then(async () => {
    await userPostApi.reviewUserPost({
      id: formData.id,
      status: action
    })
    // 更新状态映射
    formData.status = action
    emit('updateList')
    ElMessage.success(`审核${actionText}成功`)
    dialogVisible.value = false
  })
}

defineExpose({
  showDialog
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="内容详情"
    width="500px"
  >
    <el-form
      :model="formData"
      label-width="100px"
    >
      <el-form-item label="审核状态">
        <el-tag :type="UserPubStatusList.find(item => item.value === formData.status)?.type">
          {{ UserPubStatusList.find(item => item.value === formData.status)?.label }}
        </el-tag>
      </el-form-item>
      <el-form-item label="内容标题">
        <span>{{ formData.title }}</span>
      </el-form-item>
      <el-form-item label="发布内容">
        <span>{{ formData.content }}</span>
      </el-form-item>
      <el-form-item label="发布时间">
        <span>{{ dayjs(formData.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
      </el-form-item>
      <el-form-item label="交付周期">
        <span>{{ formData.deliveryCycle }}</span>
      </el-form-item>
      <el-form-item label="服务类型">
        <span>{{
          UserPubServiceTypeList.find(item => item.value === formData.serviceType)?.label
        }}</span>
      </el-form-item>
      <el-form-item label="价格">
        <span>{{ formData.price }}元</span>
      </el-form-item>
      <el-form-item label="工作时间">
        <span>{{ formData.workTime }}</span>
      </el-form-item>
      <el-form-item label="附件">
        <div
          v-if="formData.postFile"
          class="file-link-container"
        >
          <el-link
            :icon="Download"
            type="primary"
            :underline="false"
            @click="downloadFile(formData.postFile)"
          >
            <div class="file-link-content">
              <el-icon
                v-if="isImage(formData.postFile)"
                class="file-icon"
                ><Picture
              /></el-icon>
              <el-icon
                v-else-if="isDocument(formData.postFile)"
                class="file-icon"
                ><Document
              /></el-icon>
              <el-icon
                v-else
                class="file-icon"
                ><Files
              /></el-icon>
              <span class="file-name">
                {{ formData.postFile.split('/').pop() || '下载附件' }}
              </span>
            </div>
          </el-link>
        </div>
        <span v-else>无附件</span>
      </el-form-item>

      <el-form-item
        label="图片内容"
        v-if="formData.image"
      >
        <el-image
          :src="formData.image"
          :preview-src-list="[formData.image]"
          fit="cover"
          class="content-image"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="info"
          @click="dialogVisible = false"
          >关闭</el-button
        >
        <template v-if="formData.status === UserPubStatusEnum.Pubing">
          <el-button
            type="success"
            @click="handleAudit(UserPubStatusEnum.Pubed)"
            >通过</el-button
          >
          <el-button
            type="danger"
            @click="handleAudit(UserPubStatusEnum.PubDenied)"
            >拒绝</el-button
          >
        </template>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.content-image {
  width: 200px;
  height: 150px;
}

.file-link-container {
  display: flex;
  align-items: center;
}

.file-link-content {
  display: flex;
  align-items: center;
  max-width: 300px;
}

.file-icon {
  margin-right: 8px;
  font-size: 18px;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
