<template>
  <el-config-provider :locale="locale">
    <div class="channels-container">
      <h2>邀请管理</h2>
      <el-card>
        <template #header>
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="渠道名称">
              <el-input v-model="searchForm.name" placeholder="请输入渠道名称" />
            </el-form-item>
            <el-form-item label="渠道码">
              <el-input v-model="searchForm.code" placeholder="请输入渠道码" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleCreate">新建</el-button>
            </el-form-item>
          </el-form>
        </template>

        <el-table :data="displayChannelList" style="width: 100%">
          <el-table-column prop="id" label="渠道id" width="100" />
          <el-table-column prop="name" label="渠道名称" width="120" />
          <el-table-column prop="code" label="渠道码" width="120" />
          <el-table-column prop="description" label="渠道描述" width="180" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="expireTime" label="有效期" width="180">
            <template #default="scope">
              {{ formatDateTime(scope.row.expireTime) }}
            </template>
          </el-table-column>
          <el-table-column label="使用情况" width="150">
            <template #default="scope">
              {{ scope.row.usedCount }}/{{ scope.row.maxUses }}
            </template>
          </el-table-column>
          <el-table-column prop="totalUsers" label="累计邀请注册用户" width="150" />
          <el-table-column prop="yesterdayUsers" label="昨日新增注册用户" width="150" />
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <el-button 
                type="primary" 
                link
                @click="handleView(scope.row)"
              >
                查看
              </el-button>
              <el-button 
                type="primary" 
                link
                @click="handleEdit(scope.row)"
              >
                编辑
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

        <!-- 新建/编辑对话框 -->
        <el-dialog
          v-model="dialogVisible"
          :title="dialogType === 'create' ? '新建邀请' : '编辑邀请'"
          width="500px"
        >
          <el-form :model="formData" label-width="100px">
            <el-form-item label="渠道名称">
              <el-input v-model="formData.name" placeholder="请输入渠道名称" />
            </el-form-item>
            <el-form-item label="渠道码">
              <el-input v-model="formData.code" placeholder="请输入邀请码" />
            </el-form-item>
            <el-form-item label="渠道描述">
              <el-input 
                v-model="formData.description" 
                type="textarea"
                :rows="3"
                placeholder="请输入渠道描述"
              />
            </el-form-item>
            <el-form-item label="有效期">
              <el-date-picker
                v-model="formData.expireTime"
                type="datetime"
                placeholder="请选择有效期"
                format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
            <el-form-item label="使用次数">
              <el-input-number 
                v-model="formData.maxUses" 
                :min="1"
                placeholder="请输入可使用次数"
              />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="handleSubmit">确定</el-button>
            </span>
          </template>
        </el-dialog>
      </el-card>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElConfigProvider } from 'element-plus'
import { locale } from '../config/element-plus'

const searchForm = reactive({
  name: '',
  code: ''
})

const currentPage = ref(1)
const pageSize = ref(10)
// 计算总条数
const total = computed(() => originalChannelList.length)

// 计算当前页显示的数据
const displayChannelList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return channelList.value.slice(start, end)
})

// 修改初始列表数据，添加新字段
const channelList = ref([
  {
    id: 3,
    name: 'C',
    code: 'NZ9999',
    description: '抖音投流广告',
    createTime: '2025.01.08 12:23:45',
    expireTime: '2025.02.08 12:23:45',
    maxUses: 100,
    usedCount: 45,
    totalUsers: 128,
    yesterdayUsers: 45
  },
  {
    id: 2,
    name: 'B',
    code: 'FC6666',
    description: '北京地铁广告',
    createTime: '2025.01.05 12:23:45',
    expireTime: '2025.03.05 12:23:45',
    maxUses: 200,
    usedCount: 89,
    totalUsers: 987,
    yesterdayUsers: 32
  },
  {
    id: 1,
    name: 'A',
    code: 'FC8888',
    description: '北大校园地推',
    createTime: '2025.01.02 12:23:45',
    expireTime: '2025.04.02 12:23:45',
    maxUses: 50,
    usedCount: 8,
    totalUsers: 259,
    yesterdayUsers: 8
  }
])

// originalChannelList 也需要同样更新
const originalChannelList = [
  {
    id: 3,
    name: 'C',
    code: 'NZ9999',
    description: '抖音投流广告',
    createTime: '2025.01.08 12:23:45',
    expireTime: '2025.02.08 12:23:45',
    maxUses: 100,
    usedCount: 45,
    totalUsers: 128,
    yesterdayUsers: 45
  },
  {
    id: 2,
    name: 'B',
    code: 'FC6666',
    description: '北京地铁广告',
    createTime: '2025.01.05 12:23:45',
    expireTime: '2025.03.05 12:23:45',
    maxUses: 200,
    usedCount: 89,
    totalUsers: 987,
    yesterdayUsers: 32
  },
  {
    id: 1,
    name: 'A',
    code: 'FC8888',
    description: '北大校园地推',
    createTime: '2025.01.02 12:23:45',
    expireTime: '2025.04.02 12:23:45',
    maxUses: 50,
    usedCount: 8,
    totalUsers: 259,
    yesterdayUsers: 8
  }
]

// 添加日期时间格式化方法
const formatDateTime = (dateTime: string | Date) => {
  if (!dateTime) return '—'
  if (typeof dateTime === 'string') return dateTime
  return dateTime.toLocaleString('zh-CN').replace(/\//g, '.')
}

// 查看详情
const handleView = (row: any) => {
  console.log('查看详情:', row)
}

// 添加编辑按钮处理方法
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  // 填充表单数据
  formData.name = row.name
  formData.code = row.code
  formData.description = row.description
  formData.expireTime = row.expireTime
  formData.maxUses = row.maxUses
  // 保存当前编辑的记录ID
  formData.id = row.id
  
  dialogVisible.value = true
}

// 修改查询功能，保持排序和分页
const handleSearch = () => {
  // 每次都基于原始数据进行过滤
  const filteredList = originalChannelList.filter(channel => {
    const matchName = searchForm.name ? channel.name.includes(searchForm.name) : true
    const matchCode = searchForm.code ? channel.code.includes(searchForm.code) : true
    
    return matchName && matchCode
  })
  
  channelList.value = filteredList
  // 重置到第一页
  currentPage.value = 1
  ElMessage.success('查询成功')
}

// 修改重置功能
const handleReset = () => {
  // 重置表单
  searchForm.name = ''
  searchForm.code = ''
  
  // 重置数据为初始状态
  channelList.value = [...originalChannelList]
  // 重置到第一页
  currentPage.value = 1
  
  ElMessage.success('重置成功')
}

const dialogVisible = ref(false)
const dialogType = ref<'create' | 'edit'>('create')
const formData = reactive({
  id: '',
  name: '',
  code: '',
  description: '',
  expireTime: '',
  maxUses: 1
})

// 修改新建按钮处理方法，重置id
const handleCreate = () => {
  dialogType.value = 'create'
  // 重置表单数据
  formData.id = ''
  formData.name = ''
  formData.code = ''
  formData.description = ''
  formData.expireTime = ''
  formData.maxUses = 1
  dialogVisible.value = true
}

// 修改提交处理方法，处理编辑情况
const handleSubmit = () => {
  if (!formData.name || !formData.code || !formData.expireTime) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (dialogType.value === 'create') {
    // 新建逻辑保持不变
    const newInvitation = {
      id: Date.now(),
      name: formData.name,
      code: formData.code,
      description: formData.description || '',
      expireTime: formData.expireTime,
      maxUses: formData.maxUses,
      usedCount: 0,
      status: '未使用',
      createTime: new Date().toLocaleString('zh-CN').replace(/\//g, '.'),
      totalUsers: 0,
      yesterdayUsers: 0
    }
    
    channelList.value.unshift(newInvitation)
    ElMessage.success('创建成功')
  } else {
    // 编辑逻辑
    const index = channelList.value.findIndex(item => item.id === formData.id)
    if (index > -1) {
      // 更新数据，保持其他字段不变
      const updatedChannel = {
        ...channelList.value[index],
        name: formData.name,
        code: formData.code,
        description: formData.description,
        expireTime: formData.expireTime,
        maxUses: formData.maxUses
      }
      channelList.value[index] = updatedChannel
      
      // 同步更新原始数据列表
      const originalIndex = originalChannelList.findIndex(item => item.id === formData.id)
      if (originalIndex > -1) {
        originalChannelList[originalIndex] = updatedChannel
      }
      
      ElMessage.success('更新成功')
    }
  }
  
  dialogVisible.value = false
}
</script>

<style scoped>
.channels-container {
  padding: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
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

:deep(.el-input) {
  width: 120px;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-card__header) {
  padding: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-date-editor) {
  width: 100%;
}

:deep(.el-textarea__inner) {
  background-color: var(--el-fill-color-blank);
}

:deep(.el-button--link) {
  margin-right: 16px;
}

:deep(.el-button--link:last-child) {
  margin-right: 0;
}
</style> 