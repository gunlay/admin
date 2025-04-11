<template>
  <div class="header">
    <el-header>
      <el-row>
        <el-col :span="1" class="open_menu">
          <div @click="menuOpenOrClose">
            <el-icon>
              <Expand v-if="isCollapse" />
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
      </el-row>
    </el-header>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElCol, ElHeader, ElIcon, ElRow } from 'element-plus'
import { Fold, Expand } from '@element-plus/icons-vue'
import { useBreadcrumbStore } from '@/store/breadcrumb'

defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:isCollapse'])
const breadcrumbStore = useBreadcrumbStore()
const breadcrumb = computed(() => breadcrumbStore.breadcrumb)

const menuOpenOrClose = () => {
  emit('update:isCollapse', !isCollapse)
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
}
</style>
