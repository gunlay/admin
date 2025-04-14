<script setup lang="ts">
import { ref } from 'vue'
import { reactive } from 'vue'

const emit = defineEmits(['update:dialogVisible'])
const dialogVisible = ref(false)

const formData = reactive({
  id: '',
  username: '',
  type: '',
  title: '',
  description: '',
  duration: '',
  price: '',
  time: '',
  attachment: '',
  images: [] as string[],
  createTime: '',
  auditTime: '',
  status: ''
})
const showDialog = (_formData: FormData) => {
  Object.assign(formData, _formData)
  dialogVisible.value = true
}

// 审核处理方法
const handleAudit = (action: '通过' | '拒绝') => {
  ElMessageBox.confirm(`确定要${action}该内容吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: action === '通过' ? 'success' : 'warning'
  }).then(() => {
    // 更新状态映射
    const newStatus = action === '通过' ? '已发布' : '已驳回'
    formData.status = newStatus

    // 同步更新列表中的数据
    // const record = contentList.value.find(item => item.id === formData.id)
    // if (record) {
    //   record.status = newStatus
    //   record.auditTime = new Date()
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

    ElMessage.success(`审核${action}成功`)
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
      <el-form-item label="发布用户">
        <span>{{ formData.username }}</span>
      </el-form-item>
      <el-form-item label="内容类型">
        <span>{{ formData.type }}</span>
      </el-form-item>
      <el-form-item label="内容标题">
        <span>{{ formData.title }}</span>
      </el-form-item>
      <el-form-item label="内容描述">
        <span>{{ formData.description }}</span>
      </el-form-item>
      <el-form-item label="时长">
        <span>{{ formData.duration }}</span>
      </el-form-item>
      <el-form-item label="价格">
        <span>{{ formData.price }}</span>
      </el-form-item>
      <el-form-item label="时间">
        <span>{{ formData.time }}</span>
      </el-form-item>
      <el-form-item label="附件">
        <span>{{ formData.attachment }}</span>
      </el-form-item>
      <el-form-item label="提交时间">
        <span>{{ formData.createTime }}</span>
      </el-form-item>
      <el-form-item label="审核时间">
        <span>{{ formData.auditTime }}</span>
      </el-form-item>
      <el-form-item
        label="图片内容"
        v-if="formData.images"
      >
        <el-image
          v-for="(image, index) in formData.images"
          :key="index"
          :src="image"
          :preview-src-list="formData.images"
          fit="cover"
          class="content-image"
        />
      </el-form-item>
      <el-form-item label="审核状态">
        <el-tag :type="getStatusType(formData.status)">
          {{ formData.status }}
        </el-tag>
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

<style scoped lang="scss"></style>
