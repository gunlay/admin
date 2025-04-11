<template>
  <div class="tags_box">
    <div class="tags_left_btn" @click="tagsScroll(300)">
      <el-button plain :icon="ArrowLeft"></el-button>
    </div>
    <div class="tags_right_btn" @click="tagsScroll(-300)">
      <el-button plain :icon="ArrowRight"></el-button>
    </div>
    <div class="tags_close">
      <el-dropdown trigger="click">
        <el-button plain :icon="Close"></el-button>
        <template #dropdown>
          <el-dropdown-item @click="closeAll">{{ $t('closeButton.closeAll') }}</el-dropdown-item>
          <el-dropdown-item @click="closeOther">{{
            $t('closeButton.closeOther')
          }}</el-dropdown-item>
          <el-dropdown-item @click="closeRight">{{
            $t('closeButton.closeRight')
          }}</el-dropdown-item>
          <el-dropdown-item @click="closeLeft">{{ $t('closeButton.closeLeft') }}</el-dropdown-item>
        </template>
      </el-dropdown>
    </div>
    <div class="tags_list" ref="tagsListRef">
      <div class="tags_view" ref="tagsViewRef" :style="{ left: tagsViewLeft + 'px' }">
        <el-tag
          v-for="tag in tagList"
          :key="tag.fullPath"
          size="large"
          :closable="tag.closable"
          :color="isActive(tag)"
          :disable-transitions="false"
          @click="openTagPage(tag)"
          @close="closeTagPage(tag)"
        >
          <el-icon v-if="isStar(tag)" size="10">
            <star-filled />
          </el-icon>
          {{ tag.title }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Close, ArrowLeft, ArrowRight, StarFilled } from '@element-plus/icons-vue'
import config from '@/config'
import { useTagStore } from '@/store/tag'

const tagsViewLeft = ref(0)

const tagStore = useTagStore()
const route = useRoute()
const router = useRouter()

const isStar = tag => {
  return tag.fullPath === route.fullPath
}

const closeAll = () => {
  let tagList = []
  tagStore.tags.forEach((item, index) => {
    if (item.closable) {
      tagList.push(index)
    }
  })

  tagStore.closeTagHandle(tagList)
  router.push({ path: config.dashboardFullPath })
}

const closeOther = () => {
  let tagList = []
  tagStore.tags.forEach((item, index) => {
    if (item.closable && item.fullPath !== route.fullPath) {
      tagList.push(index)
    }
  })

  tagStore.closeTagHandle(tagList)
}

const closeRight = () => {
  let tagList = []
  let flag = false
  tagStore.tags.forEach((item, index) => {
    if (item.fullPath === route.fullPath) {
      flag = true
    } else if (item.closable && flag) {
      tagList.push(index)
    }
  })

  tagStore.closeTagHandle(tagList)
}

const closeLeft = () => {
  let tagList = []
  let flag = true
  tagStore.tags.forEach((item, index) => {
    if (item.fullPath === route.fullPath) {
      flag = false
    }
    if (item.closable && flag) {
      tagList.push(index)
    }
  })

  tagStore.closeTagHandle(tagList)
}

const tagsListRef = ref(null)
const tagsViewRef = ref(null)

const tagsScroll = offset => {
  const tagsListWidth = tagsListRef.value?.offsetWidth - 150 || 0
  const tagsViewWidth = tagsViewRef.value?.offsetWidth || 0

  if (tagsListWidth > tagsViewWidth) {
    return (tagsViewLeft.value = 0)
  }

  if (offset > 0) {
    return (tagsViewLeft.value = Math.min(0, tagsViewLeft.value + offset))
  }

  if (tagsViewLeft.value > -(tagsViewWidth - tagsListWidth)) {
    tagsViewLeft.value = Math.max(tagsViewLeft.value + offset, tagsListWidth - tagsViewWidth)
  }
}

const tagList = tagStore.tags
const closeTagPage = tag => tagStore.closeTagView(tag.fullPath)
const isActive = tag => (tag.fullPath === route.fullPath ? '' : '#fff')
const openTagPage = tag => router.push({ path: tag.fullPath })
</script>

<style scoped>
.tags_box {
  position: relative;
  height: 45px;
  line-height: 45px;
  overflow: hidden;
  border-bottom: 1px solid #e6e6e6;
  background-color: #fff;
}

.tags_left_btn,
.tags_right_btn {
  position: absolute;
  top: 0;
  width: 35px;
  height: 100%;
  z-index: 2;
  text-align: center;
  line-height: 45px;
  background-color: #fff;
}

.tags_left_btn {
  left: 0;
  box-shadow: 5px 0 5px -6px #ccc;
}

.tags_right_btn {
  right: 35px;
  box-shadow: -5px 0 5px -6px #ccc;
}

.tags_close {
  position: absolute;
  right: 0;
  top: 0;
  width: 35px;
  height: 100%;
  line-height: 45px;
  text-align: center;
  background-color: #fff;
}

.tags_list {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 0 70px;
  box-sizing: border-box;
  overflow: hidden;
}

.tags_view {
  position: absolute;
  height: 100%;
  white-space: nowrap;
  transition: left 0.3s ease;
}

.tags_view > * {
  margin-right: 5px;
}
</style>
