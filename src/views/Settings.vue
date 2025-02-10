<template>
  <div class="settings-container">
    <h2>通用配置</h2>
    <el-card>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基础设置" name="basic">
          <el-form :model="basicForm" label-width="120px">
            <el-form-item label="系统名称">
              <el-input v-model="basicForm.systemName" />
            </el-form-item>
            <el-form-item label="系统Logo">
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="beforeLogoUpload"
              >
                <img v-if="basicForm.logo" :src="basicForm.logo" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="basicForm.phone" />
            </el-form-item>
            <el-form-item label="联系邮箱">
              <el-input v-model="basicForm.email" />
            </el-form-item>
            <el-form-item label="版权信息">
              <el-input v-model="basicForm.copyright" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="安全设置" name="security">
          <el-form :model="securityForm" label-width="120px">
            <el-form-item label="密码最小长度">
              <el-input-number v-model="securityForm.passwordMinLength" :min="6" :max="20" />
            </el-form-item>
            <el-form-item label="密码复杂度">
              <el-checkbox-group v-model="securityForm.passwordRules">
                <el-checkbox label="number">必须包含数字</el-checkbox>
                <el-checkbox label="letter">必须包含字母</el-checkbox>
                <el-checkbox label="special">必须包含特殊字符</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="登录失败锁定">
              <el-switch v-model="securityForm.loginLock" />
            </el-form-item>
            <el-form-item label="锁定阈值" v-if="securityForm.loginLock">
              <el-input-number v-model="securityForm.lockThreshold" :min="3" :max="10" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="其他设置" name="other">
          <el-form :model="otherForm" label-width="120px">
            <el-form-item label="开启注册">
              <el-switch v-model="otherForm.enableRegister" />
            </el-form-item>
            <el-form-item label="开启邀请码">
              <el-switch v-model="otherForm.enableInviteCode" />
            </el-form-item>
            <el-form-item label="开启评论">
              <el-switch v-model="otherForm.enableComment" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div class="settings-footer">
        <el-button type="primary" @click="handleSave">保存设置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const activeTab = ref('basic')

const basicForm = reactive({
  systemName: '管理系统',
  logo: '',
  phone: '400-123-4567',
  email: 'support@example.com',
  copyright: '© 2024 Company Name. All rights reserved.'
})

const securityForm = reactive({
  passwordMinLength: 8,
  passwordRules: ['number', 'letter'],
  loginLock: true,
  lockThreshold: 5
})

const otherForm = reactive({
  enableRegister: true,
  enableInviteCode: true,
  enableComment: true
})

const beforeLogoUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传文件只能是图片格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleSave = () => {
  ElMessage.success('设置保存成功')
}
</script>

<style scoped>
.settings-container {
  padding: 20px;
}

.settings-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.avatar-uploader {
  width: 178px;
  height: 178px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style> 