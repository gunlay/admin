<template>
  <div class="header">
    <el-header>
      <el-row>
        <el-col :span="1" class="open_menu">
          <div @click="menuOpenOrClose">
            <el-icon>
              <Expand v-if="props.isCollapse" />
              <Fold v-else />
            </el-icon>
          </div>
        </el-col>
        <el-col :span="15">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="bc in breadcrumb" :key="bc.path" :to="{ path: bc.path }">
              {{ bc.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
        <el-col :span="8" class="dropdown-container">
          <div class="header-content">
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
        </el-col>
      </el-row>
    </el-header>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElCol,
  ElHeader,
  ElIcon,
  ElRow,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem
} from 'element-plus'
import { Fold, Expand, ArrowDown } from '@element-plus/icons-vue'
import { useBreadcrumbStore } from '@/store/breadcrumb'

const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:isCollapse'])
const breadcrumbStore = useBreadcrumbStore()
const breadcrumb = computed(() => breadcrumbStore.breadcrumb)

const menuOpenOrClose = () => {
  emit('update:isCollapse', !props.isCollapse)
}
</script>

<style scoped lang="scss">
.header {
  height: 60px;
  :global(.el-header) {
    border-bottom: 1px solid #e6e6e6;
    height: 60px;
    line-height: 60px;
  }
  :global(.el-button) {
    border: none;
  }

  .open_menu {
    cursor: pointer;
  }
  :global(.el-breadcrumb) {
    line-height: 60px;
  }
  a {
    text-decoration: none;
  }

  .dropdown-container {
    display: flex;
    justify-content: flex-end;

    :deep(.el-dropdown) {
      outline: none;

      .el-dropdown-link {
        outline: none;
        cursor: pointer;

        &:hover,
        &:focus {
          outline: none;
          box-shadow: none;
        }
      }
    }

    :deep(.el-dropdown-menu__item) {
      &:hover,
      &:focus {
        outline: none;
      }
    }
  }

  .header-content {
    display: flex;
    align-items: center;
    height: 100%;
  }
}
</style>
