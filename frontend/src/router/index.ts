import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import Skills from '@/views/Skills.vue'
import Prompts from '@/views/Prompts.vue'
import Documents from '@/views/Documents.vue'
import Settings from '@/views/Settings.vue'

// 游戏页面
import Snake from '@/views/games/Snake.vue'
import Gomoku from '@/views/games/Gomoku.vue'
import Tetris from '@/views/games/Tetris.vue'
import Minesweeper from '@/views/games/Minesweeper.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/skills',
    name: 'Skills',
    component: Skills,
    meta: { title: 'Skills 管理' }
  },
  {
    path: '/prompts',
    name: 'Prompts',
    component: Prompts,
    meta: { title: '提示词管理' }
  },
  {
    path: '/documents',
    name: 'Documents',
    component: Documents,
    meta: { title: '文档管理' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { title: '设置' }
  },
  // 游戏路由
  {
    path: '/games/snake',
    name: 'Snake',
    component: Snake,
    meta: { title: '贪吃蛇' }
  },
  {
    path: '/games/gomoku',
    name: 'Gomoku',
    component: Gomoku,
    meta: { title: '五子棋' }
  },
  {
    path: '/games/tetris',
    name: 'Tetris',
    component: Tetris,
    meta: { title: '俄罗斯方块' }
  },
  {
    path: '/games/minesweeper',
    name: 'Minesweeper',
    component: Minesweeper,
    meta: { title: '扫雷' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router
