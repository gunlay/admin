<template>
  <div class="users-container">
    <el-card>
      <template #header>
        <Query @search="handleSearch" />
      </template>
      <UserList
        ref="userListRef"
        @edit="handleEdit"
        @statusChange="handleStatusChange"
      />
    </el-card>

    <!-- 编辑用户对话框 -->
    <EditUserDialog ref="editUserDialogRef" />
    <!-- 禁用用户对话框 -->
    <BanUserDialog ref="banUserDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UserlistDTO, UserListParams, UserStatusEnum } from '@/api/types/userManagement'
import userManagementApi from '@/api/userManagement'
import EditUserDialog from './EditUserDialog.vue'
import BanUserDialog from './BanUserDialog.vue'
import Query from './UserQuery.vue'
import UserList from './UserList.vue'
import { UserStatusList } from './const'

const editUserDialogRef = ref<InstanceType<typeof EditUserDialog>>()
const banUserDialogRef = ref<InstanceType<typeof BanUserDialog>>()
const userListRef = ref<InstanceType<typeof UserList>>()
const handleEdit = (row: UserlistDTO) => {
  editUserDialogRef.value?.showDialog(row)
}

const handleSearch = (searchForm: UserListParams) => {
  userListRef.value?.load(searchForm)
}

const handleStatusChange = async (row: UserlistDTO) => {
  const action = UserStatusList.find(item => item.value === row.userStatus)?.action
  await ElMessageBox.confirm(`确定要${action}该用户吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await userManagementApi.updateUser({
    userId: row.id,
    userStatus: {
      0: UserStatusEnum.Banned,
      1: UserStatusEnum.Normal
    }[row.userStatus]
  })
  row.userStatus = {
    0: UserStatusEnum.Banned,
    1: UserStatusEnum.Normal
  }[row.userStatus]
  ElMessage.success(`${action}成功`)
}
</script>

<style scoped lang="scss">
.users-container {
  padding: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-tag) {
  min-width: 60px;
  text-align: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-select) {
  width: 120px;
}

:deep(.el-input__wrapper) {
  background-color: var(--el-fill-color-blank);
}
.disable-dialog-content {
  padding: 20px 0;
}
</style>
