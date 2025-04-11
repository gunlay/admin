<template>
  <el-sub-menu
    v-if="props.item.children"
    :index="props.item.url.slice(1)"
    :class="{ 'is-active': isActive }"
  >
    <template #title>
      <div>
        <el-icon v-if="props.item.icon">
          <component :is="icon(props.item.icon)" />
        </el-icon>
        <span>{{ props.item.name }}</span>
      </div>
    </template>
    <template #default>
      <div v-for="children in props.item.children" :key="children.url">
        <nav-item v-if="children.children" :item="children" />
        <el-menu-item v-else :index="children.url">
          <el-icon v-if="children.icon">
            <component :is="icon(children.icon)" />
          </el-icon>
          {{ children.name }}
        </el-menu-item>
      </div>
    </template>
  </el-sub-menu>
  <el-menu-item v-else :index="props.item.url.slice(1)" :class="{ 'is-active': isActive }">
    <el-icon v-if="props.item.icon">
      <component :is="icon(props.item.icon)" />
    </el-icon>
    <span>{{ props.item.name }}</span>
  </el-menu-item>
</template>

<script setup>
import { ElMenuItem, ElSubMenu } from 'element-plus'
import { useRoute } from 'vue-router'
import { ref, computed, watch } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})
const route = useRoute()
const isActive = ref(false)

watch(
  () => route.path,
  newPath => {
    isActive.value = newPath.includes(props.item.url)
  },
  { immediate: true }
)

const icon = name => {
  return name
}
</script>

<style scoped lang="scss">
.el-menu-item,
.el-sub-menu {
  text-align: left;
}
.is-active {
  color: #fff;
}
</style>
