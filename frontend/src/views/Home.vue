<template>
  <div class="home">
    <van-nav-bar title="AI 辅助开发平台" />
    
    <div class="content">
      <van-grid :column-num="2" :gutter="10">
        <van-grid-item 
          icon="apps-o" 
          text="Skills 管理" 
          to="/skills"
        />
        <van-grid-item 
          icon="edit" 
          text="提示词管理" 
          to="/prompts"
        />
        <van-grid-item 
          icon="description" 
          text="文档管理" 
          to="/documents"
        />
        <van-grid-item 
          icon="setting-o" 
          text="设置" 
          to="/settings"
        />
      </van-grid>

      <div class="stats">
        <van-cell-group inset>
          <van-cell title="Skills 总数" :value="skillsCount" />
          <van-cell title="提示词总数" :value="promptsCount" />
          <van-cell title="文档总数" :value="documentsCount" />
        </van-cell-group>
      </div>
    </div>

    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="apps-o" to="/skills">Skills</van-tabbar-item>
      <van-tabbar-item icon="edit" to="/prompts">提示词</van-tabbar-item>
      <van-tabbar-item icon="description" to="/documents">文档</van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/settings">设置</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const active = ref(0)
const documentsCount = ref(0)

const skillsCount = computed(() => store.state.skills.length)
const promptsCount = computed(() => store.state.prompts.length)

// 获取文档数量
const fetchDocumentsCount = async () => {
  try {
    const response = await fetch('/api/documents')
    const result = await response.json()
    if (result.success && result.data) {
      documentsCount.value = result.data.length
    }
  } catch (error) {
    console.error('Failed to fetch documents count:', error)
  }
}

onMounted(() => {
  store.dispatch('fetchSkills')
  store.dispatch('fetchPrompts')
  fetchDocumentsCount()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 16px;
  padding-bottom: 60px;
}

.stats {
  margin-top: 20px;
}
</style>
