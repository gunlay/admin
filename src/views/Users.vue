<template>
  <el-config-provider :locale="locale">
    <div class="users-container">
      <h2>用户管理</h2>
      <el-card>
        <template #header>
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="用户名">
              <el-input v-model="searchForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="searchForm.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="用户角色">
              <el-select v-model="searchForm.role" placeholder="请选择角色">
                <el-option label="全部" value="全部" />
                <el-option label="大学生" value="大学生" />
                <el-option label="程序员" value="程序员" />
              </el-select>
            </el-form-item>
            <el-form-item label="认证状态">
              <el-select v-model="searchForm.authStatus" placeholder="请选择认证状态">
                <el-option label="全部" value="全部" />
                <el-option label="未认证" value="未认证" />
                <el-option label="已认证" value="已认证" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </template>

        <el-table :data="displayUserList" style="width: 100%">
          <el-table-column prop="id" label="id" width="80" />
          <el-table-column prop="name" label="用户名" width="120" />
          <el-table-column label="手机号" width="120">
            <template #default="scope">
              {{ formatPhone(scope.row.phone) }}
            </template>
          </el-table-column>
          <el-table-column prop="role" label="用户角色" width="100" />
          <el-table-column prop="createTime" label="注册时间" width="180" />
          <el-table-column label="认证状态" width="100">
            <template #default="scope">
              <el-tag 
                :type="getAuthStatusType(scope.row.authStatus)"
              >
                {{ scope.row.authStatus || '—' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="用户状态" width="150">
            <template #default="scope">
              <el-tag :type="getUserStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button 
                :type="scope.row.status === '正常' ? 'danger' : 'success'" 
                size="small"
                @click="handleStatusChange(scope.row)"
              >
                {{ scope.row.status === '正常' ? '禁用' : '启用' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
          />
        </div>
      </el-card>

      <!-- 编辑用户对话框 -->
      <el-dialog
        v-model="dialogVisible"
        title="编辑用户"
        width="500px"
      >
        <el-form :model="formData" label-width="100px">
          <el-form-item label="用户名">
            <el-input v-model="formData.name" disabled />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="formData.phone" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="formData.status">
              <el-option label="正常" value="正常" />
              <el-option label="禁用" value="禁用" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 禁用用户对话框 -->
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
            <el-button type="primary" @click="confirmDisable">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox, ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const searchForm = reactive({
  username: '',
  phone: '',
  role: '全部',
  authStatus: '全部'
})

const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => originalUserList.length)

// 计算当前页显示的数据
const displayUserList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return userList.value.slice(start, end)
})

// 修改初始列表数据，按注册时间倒序排列
const userList = ref([
  {
    id: 3,
    name: '王五',
    phone: '13412349872',
    role: '程序员',
    createTime: '2025.01.08 12:23:45',
    authStatus: '未认证',
    status: '已注销'
  },
  {
    id: 2,
    name: '李四',
    phone: '13412349874',
    role: '程序员',
    createTime: '2025.01.05 12:23:45',
    authStatus: '已认证',
    status: '已封禁 剩余30天'
  },
  {
    id: 1,
    name: '张三',
    phone: '18812342349',
    role: '大学生',
    createTime: '2025.01.02 12:23:45',
    authStatus: '',
    status: '正常'
  }
])

const dialogVisible = ref(false)
const disableDialogVisible = ref(false)
const currentUser = ref(null)
const formData = reactive({
  id: '',
  name: '',
  phone: '',
  status: ''
})

// 添加禁用表单数据
const disableForm = ref({
  duration: 7 // 默认禁用7天
})

// 自定义国际化配置
const locale = {
  ...zhCn,
  el: {
    ...zhCn.el,
    pagination: {
      ...zhCn.el.pagination,
      pagesize: '条/页'
    }
  }
}

// 手机号中间4位隐藏处理
const formatPhone = (phone: string) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 获取认证状态标签类型
const getAuthStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    '已认证': 'success',
    '未认证': 'warning',
    '': 'info'
  }
  return statusMap[status] || 'info'
}

// 获取用户状态标签类型
const getUserStatusType = (status: string) => {
  if (status.includes('封禁')) return 'danger'
  if (status === '已注销') return 'info'
  return 'success'
}

const handleEdit = (row: any) => {
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleStatusChange = (row: any) => {
  currentUser.value = row
  if (row.status === '正常') {
    // 如果是禁用操作，显示禁用对话框
    disableDialogVisible.value = true
  } else {
    // 如果是启用操作，直接确认
    ElMessageBox.confirm(
      '确定要启用该用户吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      row.status = '正常'
      ElMessage.success('启用成功')
    })
  }
}

const handleSubmit = () => {
  // 这里添加提交逻辑
  ElMessage.success('更新成功')
  dialogVisible.value = false
}

// originalUserList 的定义也保持按时间倒序
const originalUserList = [
  {
    id: 3,
    name: '王五',
    phone: '13412349872',
    role: '程序员',
    createTime: '2025.01.08 12:23:45',
    authStatus: '未认证',
    status: '已注销'
  },
  {
    id: 2,
    name: '李四',
    phone: '13412349874',
    role: '程序员',
    createTime: '2025.01.05 12:23:45',
    authStatus: '已认证',
    status: '已封禁 剩余30天'
  },
  {
    id: 1,
    name: '张三',
    phone: '18812342349',
    role: '大学生',
    createTime: '2025.01.02 12:23:45',
    authStatus: '',
    status: '正常'
  }
]

// 修改查询功能，保持排序和分页
const handleSearch = () => {
  // 每次都基于原始数据进行过滤
  const filteredList = originalUserList.filter(user => {
    const matchUsername = searchForm.username ? user.name.includes(searchForm.username) : true
    const matchPhone = searchForm.phone ? user.phone.includes(searchForm.phone) : true
    const matchRole = searchForm.role === '全部' ? true : user.role === searchForm.role
    const matchAuthStatus = searchForm.authStatus === '全部' ? true : user.authStatus === searchForm.authStatus
    
    return matchUsername && matchPhone && matchRole && matchAuthStatus
  })
  
  userList.value = filteredList
  // 重置到第一页
  currentPage.value = 1
  ElMessage.success('查询成功')
}

// 修改重置功能
const handleReset = () => {
  // 重置表单
  searchForm.username = ''
  searchForm.phone = ''
  searchForm.role = '全部'
  searchForm.authStatus = '全部'
  
  // 重置数据为初始状态
  userList.value = [...originalUserList]
  // 重置到第一页
  currentPage.value = 1
  
  ElMessage.success('重置成功')
}

// 修改确认禁用方法
const confirmDisable = () => {
  if (!currentUser.value) return
  
  currentUser.value.status = `已封禁 剩余${disableForm.value.duration}天`
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
</script>

<style scoped>
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

:deep(.el-pagination) {
  --el-pagination-button-disabled-bg-color: var(--el-fill-color-blank);
}

/* 修改分页下拉框的选项文本 */
:deep(.el-select-dropdown__item) {
  &::after {
    content: "条/页";
  }
}

/* 修改当前选中项的显示 */
:deep(.el-input__inner) {
  &::after {
    content: "条/页";
  }
}

.disable-dialog-content {
  padding: 20px 0;
}
</style> 