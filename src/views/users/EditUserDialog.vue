<script setup lang="ts">
import { ref } from 'vue'
import { reactive } from 'vue'

interface FormData {
  id: string
  name: string
  phone: string
  status: string
}

const emit = defineEmits(['update:dialogVisible'])
const dialogVisible = ref(false)

const formData = reactive<FormData>({
  id: '',
  name: '',
  phone: '',
  status: ''
})
const handleSubmit = () => {
  // 这里添加提交逻辑
  ElMessage.success('更新成功')
  dialogVisible.value = false
}
const showDialog = (_formData: FormData) => {
  Object.assign(formData, _formData)
  dialogVisible.value = true
}

defineExpose({
  showDialog
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑用户"
    width="500px"
  >
    <el-form
      :model="formData"
      label-width="100px"
    >
      <el-form-item label="用户名">
        <el-input
          v-model="formData.name"
          disabled
        />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formData.phone" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formData.status">
          <el-option
            label="正常"
            value="正常"
          />
          <el-option
            label="禁用"
            value="禁用"
          />
        </el-select>
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

<style scoped lang="scss"></style>
