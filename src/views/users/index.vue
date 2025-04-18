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
import EditUserDialog from './EditUserDialog.vue'
import BanUserDialog from './BanUserDialog.vue'
import Query from './UserQuery.vue'
import UserList from './UserList.vue'

const editUserDialogRef = ref<InstanceType<typeof EditUserDialog>>()
const banUserDialogRef = ref<InstanceType<typeof BanUserDialog>>()
const userListRef = ref<InstanceType<typeof UserList>>()
const handleEdit = (row: any) => {
  editUserDialogRef.value?.showDialog(row)
}

const handleSearch = (searchForm: any) => {
  userListRef.value?.loadData(searchForm)
}

const handleStatusChange = (row: any) => {
  if (row.userStatus === '正常') {
    // 如果是禁用操作，显示禁用对话框
    banUserDialogRef.value?.showDialog()
  } else {
    // 如果是启用操作，直接确认
    ElMessageBox.confirm('确定要启用该用户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      row.status = '正常'
      ElMessage.success('启用成功')
    })
  }
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
