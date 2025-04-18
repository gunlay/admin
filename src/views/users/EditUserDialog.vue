<script setup lang="ts">
import { UserlistDTO, UserStatusEnum } from '@/api/types/userManagement'
import { ref } from 'vue'
import { reactive } from 'vue'
import { UserStatusList } from './const'

const emit = defineEmits(['update:dialogVisible'])
const dialogVisible = ref(false)

const formData = reactive<Partial<UserlistDTO>>({
  id: '',
  username: '',
  phone: '',
  userStatus: UserStatusEnum.Normal
})
const handleSubmit = () => {
  // 这里添加提交逻辑
  ElMessage.success('更新成功')
  dialogVisible.value = false
}
const showDialog = (_formData: Partial<UserlistDTO>) => {
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
          v-model="formData.username"
          disabled
        />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formData.phone" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formData.userStatus">
          <el-option
            v-for="status in UserStatusList"
            :key="status.value"
            :label="status.label"
            :value="status.value"
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
