<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>总用户数</span>
            </div>
          </template>
          <div class="card-content">
            <h2>-----</h2>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>今日访问</span>
            </div>
          </template>
          <div class="card-content">
            <h2>-----</h2>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>订单总数</span>
            </div>
          </template>
          <div class="card-content">
            <h2>-----</h2>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>总收入</span>
            </div>
          </template>
          <div class="card-content">
            <h2>-----</h2>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.card-content {
  text-align: center;
}
</style>
