<template>
  <div class="float-ball" @click="showGameDialog = true">
    <van-icon name="game" size="24" />
  </div>

  <!-- 游戏列表弹窗 -->
  <van-popup
    v-model:show="showGameDialog"
    position="bottom"
    :style="{ height: '40%', borderRadius: '16px 16px 0 0' }"
  >
    <div class="game-dialog">
      <div class="dialog-header">
        <h3>🎮 离线游戏</h3>
        <p>无需网络，随时畅玩</p>
      </div>
      
      <div class="game-list">
        <div 
          v-for="game in games" 
          :key="game.id"
          class="game-item"
          @click="startGame(game)"
        >
          <div class="game-icon">{{ game.icon }}</div>
          <div class="game-info">
            <div class="game-name">{{ game.name }}</div>
            <div class="game-desc">{{ game.description }}</div>
          </div>
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showGameDialog = ref(false)

const games = [
  {
    id: 'snake',
    name: '贪吃蛇',
    icon: '🐍',
    description: '经典贪吃蛇游戏，控制蛇吃食物'
  },
  {
    id: 'gomoku',
    name: '五子棋',
    icon: '⚫',
    description: '双人对战五子棋，五子连珠获胜'
  },
  {
    id: 'tetris',
    name: '俄罗斯方块',
    icon: '🧱',
    description: '经典俄罗斯方块，消除方块得分'
  },
  {
    id: 'minesweeper',
    name: '扫雷',
    icon: '💣',
    description: '经典扫雷游戏，找出所有地雷'
  }
]

const startGame = (game: any) => {
  showGameDialog.value = false
  router.push(`/games/${game.id}`)
}
</script>

<style scoped>
.float-ball {
  position: fixed;
  right: 20px;
  bottom: 80px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  transition: all 0.3s ease;
  color: white;
}

.float-ball:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
}

.float-ball:active {
  transform: scale(0.95);
}

.game-dialog {
  padding: 20px;
}

.dialog-header {
  text-align: center;
  margin-bottom: 20px;
}

.dialog-header h3 {
  margin: 0;
  font-size: 20px;
  color: #323233;
}

.dialog-header p {
  margin: 8px 0 0;
  font-size: 14px;
  color: #969799;
}

.game-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.game-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f7f8fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.game-item:hover {
  background: #eef0f4;
  transform: translateX(4px);
}

.game-item:active {
  transform: scale(0.98);
}

.game-icon {
  font-size: 32px;
  margin-right: 16px;
}

.game-info {
  flex: 1;
}

.game-name {
  font-size: 16px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 4px;
}

.game-desc {
  font-size: 12px;
  color: #969799;
}
</style>
