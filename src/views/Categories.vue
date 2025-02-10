<template>
  <div class="categories-container">
    <h2>分类&标签管理</h2>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card header="分类管理">
          <el-table :data="categories" style="width: 100%">
            <el-table-column prop="name" label="分类名称" />
            <el-table-column prop="count" label="内容数量" width="100" />
            <el-table-column label="操作" width="200">
              <template #default>
                <el-button type="primary" size="small">编辑</el-button>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="标签管理">
          <el-table :data="tags" style="width: 100%">
            <el-table-column prop="name" label="标签名称" />
            <el-table-column prop="count" label="使用次数" width="100" />
            <el-table-column label="操作" width="200">
              <template #default>
                <el-button type="primary" size="small">编辑</el-button>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
const categories = [
  { name: '分类1', count: 10 },
  { name: '分类2', count: 5 }
]

const tags = [
  { name: '标签1', count: 15 },
  { name: '标签2', count: 8 }
]
</script>

<style scoped>
.categories-container {
  padding: 20px;
}
.el-card {
  margin-bottom: 20px;
}
</style> 