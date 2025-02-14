<template>
  <el-config-provider :locale="locale">
    <div class="coupons-container">
      <h2>券码管理</h2>
      <el-card>
        <template #header>
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="券码">
              <el-input v-model="searchForm.code" placeholder="请输入券码" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 120px;">
                <el-option label="全部" value="全部" />
                <el-option label="未生效" value="未生效" />
                <el-option label="已生效" value="已生效" />
                <el-option label="已过期" value="已过期" />
                <el-option label="已下线" value="已下线" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleCreate">新建</el-button>
            </el-form-item>
          </el-form>
        </template>

        <el-table :data="displayCouponList" style="width: 100%">
          <el-table-column prop="code" label="券码" width="120" />
          <el-table-column prop="name" label="券码名称" width="120" />
          <el-table-column prop="type" label="券码类型" width="100" />
          <el-table-column prop="amount" label="券码面额" width="120" />
          <el-table-column prop="validPeriod" label="有效期" width="120" />
          <el-table-column prop="createTime" label="生效开始时间" width="180" />
          <el-table-column label="券码状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <el-button 
                type="primary" 
                size="small"
                @click="handleView(scope.row)"
              >
                查看
              </el-button>
              <el-button 
                type="primary" 
                size="small"
                @click="handleEdit(scope.row)"
              >
                修改
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
          :title="dialogType === 'create' ? '新建券码' : '修改券码'"
          width="500px"
        >
          <el-form :model="formData" label-width="100px">
            <el-form-item label="券码名称">
              <el-input v-model="formData.name" placeholder="请输入券码名称" />
            </el-form-item>
            <el-form-item label="券码">
              <el-input v-model="formData.code" placeholder="请输入券码" />
            </el-form-item>
            <el-form-item label="券码类型">
              <el-select v-model="formData.type" placeholder="请选择类型">
                <el-option label="满减券" value="满减券" />
                <el-option label="打折券" value="打折券" />
              </el-select>
            </el-form-item>
            <el-form-item label="券码面额">
              <template v-if="formData.type === '满减券'">
                <el-input 
                  v-model="formData.fullAmount" 
                  placeholder="请输入满足金额"
                  style="width: 45%;"
                >
                  <template #prepend>满</template>
                  <template #append>元</template>
                </el-input>
                <span style="margin: 0 10px;">减</span>
                <el-input 
                  v-model="formData.reduceAmount" 
                  placeholder="请输入优惠金额"
                  style="width: 45%;"
                >
                  <template #append>元</template>
                </el-input>
              </template>
              <template v-else>
                <el-input 
                  v-model="formData.discount" 
                  placeholder="请输入折扣"
                  style="width: 45%;"
                >
                  <template #append>折</template>
                </el-input>
                <span style="margin: 0 10px;">封顶</span>
                <el-input 
                  v-model="formData.maxDiscount" 
                  placeholder="请输入封顶金额"
                  style="width: 45%;"
                >
                  <template #append>元</template>
                </el-input>
              </template>
            </el-form-item>
            <el-form-item label="券码描述">
              <el-input 
                v-model="formData.description" 
                type="textarea"
                :rows="3"
                placeholder="请输入券码描述"
              />
            </el-form-item>
            <el-form-item label="生效开始时间">
              <el-date-picker
                v-model="formData.createTime"
                type="datetime"
                placeholder="请选择生效开始时间"
                format="YYYY-MM-DD HH:mm:ss"
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
  code: '',
  status: '全部'
})

const currentPage = ref(1)
const pageSize = ref(10)
// 计算总条数
const total = computed(() => originalCouponList.length)

// 计算当前页显示的数据
const displayCouponList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return couponList.value.slice(start, end)
})

// 添加获取券码状态的方法
const getCouponStatus = (createTime: string, validPeriod: string) => {
  const now = new Date().getTime()
  const startTime = new Date(createTime.replace(/\./g, '/')).getTime()
  const endTime = new Date(validPeriod.replace('截止', '').replace(/\./g, '/')).getTime()
  
  if (now < startTime) {
    return '未生效'
  } else if (now > endTime) {
    return '已过期'
  } else {
    return '已生效'
  }
}

// 修改初始列表数据
const originalCouponList = [
  {
    code: 'CHJ20250109',
    name: '促活券',
    type: '打折券',
    amount: '8折30封顶',
    validPeriod: '截止2025.10.20',
    createTime: '2025.01.08 12:23:45',
    status: '已下线'
  },
  {
    code: 'CHJ20250108',
    name: '促活券',
    type: '满减券',
    amount: '无门槛减20',
    validPeriod: '截止2025.10.20',
    createTime: '2025.01.08 12:23:45',
    status: '已过期'
  },
  {
    code: 'SDD20250105',
    name: '首单返利券',
    type: '满减券',
    amount: '满300减100',
    validPeriod: '自领取30日内',
    createTime: '2025.01.05 12:23:45',
    status: '未生效'
  },
  {
    code: 'XRJ20250102',
    name: '新注册用户券',
    type: '满减券',
    amount: '满100减30',
    validPeriod: '自领取30日内',
    createTime: '2025.01.02 12:23:45',
    status: '已生效'
  }
]

// 初始化列表数据时计算状态
const couponList = ref(originalCouponList.map(coupon => ({
  ...coupon,
  status: getCouponStatus(coupon.createTime, coupon.validPeriod)
})))

// 获取状态标签类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    '已生效': 'success',
    '未生效': 'warning',
    '已过期': 'info',
    '已下线': 'danger'
  }
  return statusMap[status] || 'info'
}

// 查看详情
const handleView = (row: any) => {
  console.log('查看详情:', row)
}

// 修改查询功能，保持排序和分页
const handleSearch = () => {
  // 每次都基于原始数据进行过滤
  const filteredList = originalCouponList.filter(coupon => {
    const matchCode = searchForm.code ? coupon.code.includes(searchForm.code) : true
    const matchStatus = searchForm.status === '全部' ? true : coupon.status === searchForm.status
    
    return matchCode && matchStatus
  })
  
  couponList.value = filteredList.map(coupon => ({
    ...coupon,
    status: getCouponStatus(coupon.createTime, coupon.validPeriod)
  }))
  // 重置到第一页
  currentPage.value = 1
  ElMessage.success('查询成功')
}

// 修改重置功能
const handleReset = () => {
  // 重置表单
  searchForm.code = ''
  searchForm.status = '全部'
  
  // 重置数据为初始状态
  couponList.value = [...originalCouponList].map(coupon => ({
    ...coupon,
    status: getCouponStatus(coupon.createTime, coupon.validPeriod)
  }))
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
  type: '',
  discount: '',
  maxDiscount: '',
  fullAmount: '',
  reduceAmount: '',
  createTime: '',
  description: '',
  expireTime: '',
  status: ''
})

// 新建按钮处理方法
const handleCreate = () => {
  dialogType.value = 'create'
  // 重置表单数据
  formData.id = ''
  formData.name = ''
  formData.code = ''
  formData.type = ''
  formData.discount = ''
  formData.maxDiscount = ''
  formData.fullAmount = ''
  formData.reduceAmount = ''
  formData.createTime = ''
  formData.description = ''
  formData.expireTime = ''
  formData.status = ''
  dialogVisible.value = true
}

// 修改编辑按钮处理方法
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  // 填充表单数据
  formData.id = row.code
  formData.name = row.name
  formData.code = row.code
  formData.type = row.type
  // 处理面额数据
  if (row.type === '打折券') {
    const matches = row.amount.match(/(\d+)折(\d+)封顶/)
    if (matches) {
      formData.discount = matches[1]
      formData.maxDiscount = matches[2]
    }
  } else {
    if (row.amount.includes('无门槛')) {
      formData.fullAmount = '0'
      formData.reduceAmount = row.amount.replace('无门槛减', '')
    } else {
      const matches = row.amount.match(/满(\d+)元减(\d+)/)
      if (matches) {
        formData.fullAmount = matches[1]
        formData.reduceAmount = matches[2]
      }
    }
  }
  formData.description = row.description || ''
  formData.createTime = row.createTime
  formData.expireTime = row.validPeriod.replace('截止', '')
  formData.status = row.status
  
  dialogVisible.value = true
}

// 修改提交处理方法
const handleSubmit = () => {
  if (!formData.name || !formData.code || !formData.type || 
      (formData.type === '打折券' && (!formData.discount || !formData.maxDiscount)) ||
      (formData.type === '满减券' && (!formData.fullAmount || !formData.reduceAmount)) ||
      !formData.createTime || !formData.expireTime) {
    ElMessage.warning('请填写完整信息')
    return
  }

  const createTimeStr = new Date(formData.createTime).toLocaleString('zh-CN').replace(/\//g, '.')
  const validPeriodStr = `截止${new Date(formData.expireTime).toLocaleDateString('zh-CN').replace(/\//g, '.')}`

  const couponData = {
    code: formData.code,
    name: formData.name,
    type: formData.type,
    amount: formData.type === '打折券' ? 
      `${formData.discount}折${formData.maxDiscount}封顶` : 
      formData.fullAmount === '0' ? 
        `无门槛减${formData.reduceAmount}` : 
        `满${formData.fullAmount}元减${formData.reduceAmount}`,
    description: formData.description || '',
    createTime: createTimeStr,
    validPeriod: validPeriodStr,
    status: getCouponStatus(createTimeStr, validPeriodStr)
  }

  if (dialogType.value === 'create') {
    couponList.value.unshift(couponData)
    originalCouponList.unshift(couponData)
    ElMessage.success('创建成功')
  } else {
    // 编辑逻辑
    const index = couponList.value.findIndex(item => item.code === formData.id)
    if (index > -1) {
      couponList.value[index] = { 
        ...couponList.value[index], 
        ...couponData
      }
      
      // 同步更新原始数据列表
      const originalIndex = originalCouponList.findIndex(item => item.code === formData.id)
      if (originalIndex > -1) {
        originalCouponList[originalIndex] = { 
          ...originalCouponList[originalIndex], 
          ...couponData
        }
      }
      ElMessage.success('修改成功')
    }
  }
  
  dialogVisible.value = false
}
</script>

<style scoped>
.coupons-container {
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

:deep(.el-select) {
  width: 120px !important;
}

:deep(.el-input__wrapper) {
  background-color: var(--el-fill-color-blank);
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-input) {
  width: 120px;
  &.el-input--large {
    width: 100%;
  }
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

:deep(.el-dialog) {
  .el-input {
    width: 100% !important;
    
    &.el-input--small {
      width: 45% !important;
    }
  }
  .el-select {
    width: 100% !important;
  }
}

:deep(.el-button--small) {
  padding: 5px 12px;
  height: 24px;
  font-size: 12px;
  border-radius: 2px;
}
</style> 