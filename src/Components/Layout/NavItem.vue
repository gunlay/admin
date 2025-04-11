<template>
  <el-sub-menu v-if="item.children" :index="item.url">
    <template #title>
      <div>
        <!-- <el-icon v-if="item.icon">
          <component :is="icon(item.icon)" />
        </el-icon> -->
        <span>{{ item.name }}</span>
      </div>
    </template>
    <template #default>
      <div v-for="children in item.children" :key="children.url">
        <nav-item v-if="children.children" :item="children" />
        <el-menu-item v-else :index="children.url">
          <!-- <el-icon v-if="children.icon">
            <component :is="icon(children.icon)" />
          </el-icon> -->
          {{ children.name }}
        </el-menu-item>
      </div>
    </template>
  </el-sub-menu>
  <el-menu-item v-else :index="item.url">
    <!-- <el-icon v-if="item.icon">
      <component :is="icon(item.icon)" />
    </el-icon> -->
    <span>{{ item.name }}</span>
  </el-menu-item>
</template>

<script setup>
import { ElMenuItem, ElSubMenu } from 'element-plus'

defineProps({
  item: {
    type: Object,
    required: true
  }
})

// const icon = (name) => {
//   return name;
// };
</script>

<style scoped lang="scss">
.el-menu-item,
.el-sub-menu {
  text-align: left;
}
</style>
