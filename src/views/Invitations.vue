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
            </el-form-item>
          </el-form>
        </template>

        <el-table :data="channelList" style="width: 100%">
          <el-table-column prop="id" label="渠道id" width="100" />
          <el-table-column prop="name" label="渠道名称" width="120" />
          <el-table-column prop="code" label="渠道码" width="120" />
          <el-table-column prop="description" label="渠道描述" width="180" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="totalUsers" label="累计邀请注册用户" width="150" />
          <el-table-column prop="yesterdayUsers" label="昨日新增注册用户" width="150" />
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button 
                type="primary" 
                link
                @click="handleView(scope.row)"
              >
                查看
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
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElConfigProvider } from 'element-plus'
import { locale } from '../config/element-plus'

const searchForm = reactive({
  name: '',
  code: ''
})

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 添加一个原始数据的引用
const originalChannelList = [
  {
    id: 1,
    name: 'A',
    code: 'FC8888',
    description: '北大校园地推',
    createTime: '2025.01.02 12:23:45',
    totalUsers: 259,
    yesterdayUsers: 8
  },
  {
    id: 2,
    name: 'B',
    code: 'FC6666',
    description: '北京地铁广告',
    createTime: '2025.01.05 12:23:45',
    totalUsers: 987,
    yesterdayUsers: 32
  },
  {
    id: 3,
    name: 'C',
    code: 'NZ9999',
    description: '抖音投流广告',
    createTime: '2025.01.08 12:23:45',
    totalUsers: 128,
    yesterdayUsers: 45
  }
]

const channelList = ref([...originalChannelList])

// 查看详情
const handleView = (row: any) => {
  console.log('查看详情:', row)
}

// 修改查询功能
const handleSearch = () => {
  // 每次都基于原始数据进行过滤
  const filteredList = originalChannelList.filter(channel => {
    const matchName = searchForm.name ? channel.name.includes(searchForm.name) : true
    const matchCode = searchForm.code ? channel.code.includes(searchForm.code) : true
    
    return matchName && matchCode
  })
  
  channelList.value = filteredList
  ElMessage.success('查询成功')
}

// 修改重置功能
const handleReset = () => {
  // 重置表单
  searchForm.name = ''
  searchForm.code = ''
  
  // 重置数据为初始状态
  channelList.value = [...originalChannelList]
  
  ElMessage.success('重置成功')
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
</style> 