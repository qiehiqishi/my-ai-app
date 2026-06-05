<template>
  <div id="app">
    <router-view />
    <!-- 悬浮球（游戏入口） -->
    <FloatBall v-if="showFloatBall" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import FloatBall from '@/components/FloatBall.vue'

const route = useRoute()

// 在游戏页面隐藏悬浮球
const showFloatBall = computed(() => {
  return !route.path.startsWith('/games/')
})
</script>

<style>
#app {
  width: 100%;
  min-height: 100vh;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
