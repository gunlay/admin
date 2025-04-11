<script setup lang="ts">
import { reactive, ref } from 'vue'

const disableDialogVisible = ref(false)
// 添加禁用表单数据
const disableForm = reactive({
  duration: 7 // 默认禁用7天
})
const currentUser = reactive({
  status: ''
})
const showDialog = (_disableForm?: any) => {
  if (_disableForm) Object.assign(disableForm, _disableForm)
  disableDialogVisible.value = true
}
// 修改确认禁用方法
const confirmDisable = () => {
  if (!currentUser.status) return
  currentUser.status = `已封禁 剩余${disableForm.duration}天`
  ElMessage.success('禁用成功')
  disableDialogVisible.value = false

  // 如果有实际的 API 调用，可以使用下面的代码
  // try {
  //   await userApi.disableUser({
  //     userId: currentUser.value.id,
  //     duration: disableForm.value.duration
  //   })
  //   ElMessage.success('用户已禁用')
  //   disableDialogVisible.value = false
  //   fetchUserList() // 刷新用户列表
  // } catch (error) {
  //   ElMessage.error('禁用用户失败')
  // }
}

defineExpose({
  showDialog
})
</script>

<template>
  <el-dialog
    v-model="disableDialogVisible"
    title="禁用用户"
    width="30%"
  >
    <div class="disable-dialog-content">
      <p>确定要禁用该用户吗？</p>
      <el-form :model="disableForm">
        <el-form-item label="禁用时长">
          <el-input-number
            v-model="disableForm.duration"
            :min="1"
            :max="365"
            placeholder="请输入禁用天数"
          >
            <template #suffix>天</template>
          </el-input-number>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="disableDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="confirmDisable"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
