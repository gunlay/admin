<template>
  <el-container style="height: 100%">
    <nav-bar :isCollapse="isCollapse" />
    <el-container direction="vertical">
      <header-component v-model:isCollapse="isCollapse" />
      <!-- <tags-view /> -->
      <el-main>
        <router-view v-slot="{ Component }">
          <el-scrollbar height="100%">
            <keep-alive :include="cacheTags">
              <component
                :is="Component"
                :key="route?.params?.id?.toString()"
              />
            </keep-alive>
          </el-scrollbar>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ElContainer, ElMain, ElScrollbar } from 'element-plus'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTagStore } from '@/store/tag'
import HeaderComponent from './Header.vue'
import NavBar from './NavBar.vue'
// import TagsView from './TagsView.vue';

const tagStore = useTagStore()
const isCollapse = ref(false)
const route = useRoute()

const cacheTags = computed(() => {
  return tagStore.cacheTags
})
</script>

<style scoped>
.el-main {
  padding: 0;
}
</style>
