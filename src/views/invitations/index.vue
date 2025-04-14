<template>
  <div class="channels-container">
    <el-card>
      <template #header>
        <InvitationsQuery
          @search="handleSearch"
          @create="handleCreate"
        />
      </template>
      <InvitationsList
        ref="invitationsListRef"
        @view="handleView"
        @edit="handleEdit"
      />
    </el-card>
    <!-- 新建/编辑对话框 -->
    <InvitationsDialog
      ref="invitationsDialogRef"
      @create="handleSubmitCreate"
      @update="handleSubmitUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InvitationsList from './InvitationsList.vue'
import InvitationsQuery from './InvitationsQuery.vue'
import InvitationsDialog from './InvitationsDialog.vue'

const invitationsListRef = ref<InstanceType<typeof InvitationsList>>()
const invitationsDialogRef = ref<InstanceType<typeof InvitationsDialog>>()

// 查询功能
const handleSearch = (params: any) => {
  if (invitationsListRef.value) invitationsListRef.value.loadData(params)
}

// 查看详情
const handleView = (row: any) => {
  console.log('查看详情:', row)
}

// 创建邀请
const handleCreate = () => {
  if (invitationsDialogRef.value) invitationsDialogRef.value.showCreateDialog()
}

// 编辑邀请
const handleEdit = (row: any) => {
  if (invitationsDialogRef.value) invitationsDialogRef.value.showEditDialog(row)
}

// 提交创建
const handleSubmitCreate = (invitation: any) => {
  if (invitationsListRef.value) invitationsListRef.value.addInvitation(invitation)
}

// 提交更新
const handleSubmitUpdate = (invitation: any) => {
  if (invitationsListRef.value) invitationsListRef.value.updateInvitation(invitation)
}
</script>

<style scoped>
.channels-container {
  padding: 20px;
}

:deep(.el-select) {
  width: 120px;
}

:deep(.el-input__wrapper) {
  background-color: var(--el-fill-color-blank);
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-card__header) {
  padding: 20px;
}

:deep(.el-button--link) {
  margin-right: 16px;
}

:deep(.el-button--link:last-child) {
  margin-right: 0;
}
</style>
