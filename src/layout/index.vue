<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <el-menu
        :router="true"
        default-active="/dashboard"
        class="el-menu-vertical"
        background-color="#304156"
        text-color="#fff"
      >
        <el-menu-item index="/dashboard">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </el-menu-item>
        
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        
        <el-menu-item index="/auth">
          <el-icon><Key /></el-icon>
          <span>认证管理</span>
        </el-menu-item>
        
        <el-menu-item index="/content">
          <el-icon><Document /></el-icon>
          <span>发布内容管理</span>
        </el-menu-item>
        
        <el-menu-item index="/categories">
          <el-icon><Files /></el-icon>
          <span>分类&标签管理</span>
        </el-menu-item>
        
        <el-menu-item index="/orders">
          <el-icon><List /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
        
        <el-menu-item index="/invitations">
          <el-icon><Message /></el-icon>
          <span>邀请管理</span>
        </el-menu-item>
        
        <el-menu-item index="/coupons">
          <el-icon><Ticket /></el-icon>
          <span>券码管理</span>
        </el-menu-item>
        
        <el-menu-item index="/complaints">
          <el-icon><Warning /></el-icon>
          <span>投诉管理</span>
        </el-menu-item>
        
        <el-menu-item index="/help-settings">
          <el-icon><QuestionFilled /></el-icon>
          <span>帮助中心配置</span>
        </el-menu-item>
        
        <el-menu-item index="/feedback">
          <el-icon><ChatDotRound /></el-icon>
          <span>意见反馈管理</span>
        </el-menu-item>
        
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <span>通用配置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header>
        <div class="header-content">
          <h2>管理后台</h2>
          <el-dropdown>
            <span class="el-dropdown-link">
              管理员
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import {
  HomeFilled,
  User,
  Key,
  Document,
  Files,
  List,
  Message,
  Ticket,
  Warning,
  QuestionFilled,
  ChatDotRound,
  Setting,
  ArrowDown
} from '@element-plus/icons-vue'
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.el-menu-vertical {
  height: 100%;
  border-right: none;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}

.el-aside {
  background-color: #304156;
}

.el-menu-item {
  &:hover {
    background-color: #263445 !important;
  }
  
  &.is-active {
    background-color: #1890ff !important;
  }
}
</style> 