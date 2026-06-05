<template>
  <div class="settings">
    <van-nav-bar title="设置" />

    <div class="content">
      <van-cell-group inset>
        <van-cell title="数据库路径" :value="dbPath" />
        <van-cell title="API 地址" :value="apiUrl" />
        <van-cell title="版本" value="1.0.0" />
      </van-cell-group>

      <van-cell-group inset style="margin-top: 16px;">
        <van-cell title="清空缓存" is-link @click="clearCache" />
        <van-cell title="导出数据" is-link @click="exportData" />
        <van-cell title="导入数据" is-link @click="importData" />
      </van-cell-group>
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
import { ref } from 'vue'
import { showSuccessToast, showFailToast } from 'vant'

const active = ref(3)
const dbPath = ref('./data/database.sqlite')
const apiUrl = ref('http://localhost:3000')

const clearCache = () => {
  showSuccessToast('缓存已清空')
}

const exportData = () => {
  showSuccessToast('数据导出成功')
}

const importData = () => {
  showSuccessToast('数据导入成功')
}
</script>

<style scoped>
.settings {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 16px;
  padding-bottom: 60px;
}
</style>
