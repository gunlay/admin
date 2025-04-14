<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['create', 'update'])

const dialogVisible = ref(false)
const dialogType = ref<'create' | 'edit'>('create')

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

// 表单数据
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

// 显示创建对话框
const showCreateDialog = () => {
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

// 显示编辑对话框，接收行数据
const showEditDialog = (row: any) => {
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
      const matches = row.amount.match(/满(\d+)元?减(\d+)/)
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

// 提交处理方法
const handleSubmit = () => {
  if (
    !formData.name ||
    !formData.code ||
    !formData.type ||
    (formData.type === '打折券' && (!formData.discount || !formData.maxDiscount)) ||
    (formData.type === '满减券' && (!formData.fullAmount || !formData.reduceAmount)) ||
    !formData.createTime ||
    !formData.expireTime
  ) {
    ElMessage.warning('请填写完整信息')
    return
  }

  const createTimeStr = new Date(formData.createTime).toLocaleString('zh-CN').replace(/\//g, '.')
  const validPeriodStr = `截止${new Date(formData.expireTime).toLocaleDateString('zh-CN').replace(/\//g, '.')}`

  const couponData = {
    code: formData.code,
    name: formData.name,
    type: formData.type,
    amount:
      formData.type === '打折券'
        ? `${formData.discount}折${formData.maxDiscount}封顶`
        : formData.fullAmount === '0'
          ? `无门槛减${formData.reduceAmount}`
          : `满${formData.fullAmount}元减${formData.reduceAmount}`,
    description: formData.description || '',
    createTime: createTimeStr,
    validPeriod: validPeriodStr,
    status: getCouponStatus(createTimeStr, validPeriodStr)
  }

  if (dialogType.value === 'create') {
    emit('create', couponData)
    ElMessage.success('创建成功')
  } else {
    // 编辑逻辑
    emit('update', couponData)
    ElMessage.success('修改成功')
  }

  dialogVisible.value = false
}

defineExpose({
  showCreateDialog,
  showEditDialog
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogType === 'create' ? '新建券码' : '修改券码'"
    width="500px"
  >
    <el-form
      :model="formData"
      label-width="100px"
    >
      <el-form-item label="券码名称">
        <el-input
          v-model="formData.name"
          placeholder="请输入券码名称"
        />
      </el-form-item>
      <el-form-item label="券码">
        <el-input
          v-model="formData.code"
          placeholder="请输入券码"
        />
      </el-form-item>
      <el-form-item label="券码类型">
        <el-select
          v-model="formData.type"
          placeholder="请选择类型"
        >
          <el-option
            label="满减券"
            value="满减券"
          />
          <el-option
            label="打折券"
            value="打折券"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="券码面额">
        <template v-if="formData.type === '满减券'">
          <el-input
            v-model="formData.fullAmount"
            placeholder="请输入满足金额"
            style="width: 45%"
          >
            <template #prepend>满</template>
            <template #append>元</template>
          </el-input>
          <span style="margin: 0 10px">减</span>
          <el-input
            v-model="formData.reduceAmount"
            placeholder="请输入优惠金额"
            style="width: 45%"
          >
            <template #append>元</template>
          </el-input>
        </template>
        <template v-else>
          <el-input
            v-model="formData.discount"
            placeholder="请输入折扣"
            style="width: 45%"
          >
            <template #append>折</template>
          </el-input>
          <span style="margin: 0 10px">封顶</span>
          <el-input
            v-model="formData.maxDiscount"
            placeholder="请输入封顶金额"
            style="width: 45%"
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
        <el-button
          type="primary"
          @click="handleSubmit"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
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
</style>
