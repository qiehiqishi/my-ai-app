<template>
  <div class="game-page">
    <van-nav-bar
      title="俄罗斯方块"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    >
      <template #right>
        <van-icon name="replay" @click="restart" />
      </template>
    </van-nav-bar>

    <div class="game-container">
      <div class="game-info">
        <div class="score">得分: {{ score }}</div>
        <div class="level">等级: {{ level }}</div>
      </div>

      <canvas 
        ref="canvasRef"
        :width="canvasWidth"
        :height="canvasHeight"
        class="game-canvas"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      ></canvas>

      <div class="controls">
        <van-button @click="moveLeft" :disabled="gameOver">←</van-button>
        <van-button @click="rotate" :disabled="gameOver">旋转</van-button>
        <van-button @click="moveRight" :disabled="gameOver">→</van-button>
        <van-button @click="moveDown" :disabled="gameOver">↓</van-button>
      </div>

      <div v-if="gameOver" class="game-over">
        <div class="game-over-text">游戏结束</div>
        <van-button type="primary" @click="restart">重新开始</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const canvasRef = ref<HTMLCanvasElement>()
const canvasWidth = 300
const canvasHeight = 600
const gridSize = 30
const cols = canvasWidth / gridSize
const rows = canvasHeight / gridSize

const score = ref(0)
const level = ref(1)
const gameOver = ref(false)

let board: number[][] = []
let currentPiece: any = null
let gameLoop: number | null = null

// 触摸相关
let touchStartX = 0
let touchStartY = 0
let touchStartTime = 0
let lastTouchTime = 0
let isLongPress = false
let longPressTimer: number | null = null

// 方块形状
const pieces = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 0, 0], [1, 1, 1]], // L
  [[0, 0, 1], [1, 1, 1]], // J
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 0], [0, 1, 1]]  // Z
]

const colors = [
  '#00f0f0', '#f0f000', '#a000f0', '#f0a000', '#0000f0', '#00f000', '#f00000'
]

// 初始化游戏
const initGame = () => {
  board = Array(rows).fill(null).map(() => Array(cols).fill(0))
  score.value = 0
  level.value = 1
  gameOver.value = false
  spawnPiece()
}

// 生成新方块
const spawnPiece = () => {
  const index = Math.floor(Math.random() * pieces.length)
  currentPiece = {
    shape: pieces[index],
    color: colors[index],
    x: Math.floor(cols / 2) - Math.floor(pieces[index][0].length / 2),
    y: 0
  }

  if (collision()) {
    gameOver.value = true
  }
}

// 碰撞检测
const collision = () => {
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x]) {
        const newX = currentPiece.x + x
        const newY = currentPiece.y + y

        if (newX < 0 || newX >= cols || newY >= rows) return true
        if (newY >= 0 && board[newY][newX]) return true
      }
    }
  }
  return false
}

// 合并方块到棋盘
const mergePiece = () => {
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x]) {
        const boardY = currentPiece.y + y
        if (boardY >= 0) {
          board[boardY][currentPiece.x + x] = currentPiece.color
        }
      }
    }
  }
}

// 清除完整行
const clearLines = () => {
  let linesCleared = 0
  for (let y = rows - 1; y >= 0; y--) {
    if (board[y].every(cell => cell !== 0)) {
      board.splice(y, 1)
      board.unshift(Array(cols).fill(0))
      linesCleared++
      y++
    }
  }
  if (linesCleared > 0) {
    score.value += linesCleared * 100 * level.value
    level.value = Math.floor(score.value / 1000) + 1
  }
}

// 移动
const moveLeft = () => {
  currentPiece.x--
  if (collision()) currentPiece.x++
}

const moveRight = () => {
  currentPiece.x++
  if (collision()) currentPiece.x--
}

const moveDown = () => {
  currentPiece.y++
  if (collision()) {
    currentPiece.y--
    mergePiece()
    clearLines()
    spawnPiece()
  }
}

const rotate = () => {
  const shape = currentPiece.shape
  const rotated = shape[0].map((_: any, i: number) => 
    shape.map((row: any) => row[i]).reverse()
  )
  const originalShape = currentPiece.shape
  currentPiece.shape = rotated
  if (collision()) {
    currentPiece.shape = originalShape
  }
}

// 绘制
const draw = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // 绘制棋盘
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (board[y][x]) {
        ctx.fillStyle = board[y][x]
        ctx.fillRect(x * gridSize + 1, y * gridSize + 1, gridSize - 2, gridSize - 2)
      }
    }
  }

  // 绘制当前方块
  if (currentPiece) {
    ctx.fillStyle = currentPiece.color
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          ctx.fillRect(
            (currentPiece.x + x) * gridSize + 1,
            (currentPiece.y + y) * gridSize + 1,
            gridSize - 2,
            gridSize - 2
          )
        }
      }
    }
  }
}

// 游戏循环
const gameLoopFn = () => {
  if (!gameOver.value) {
    moveDown()
    draw()
  }
}

// 开始游戏
const startGame = () => {
  initGame()
  if (gameLoop) clearInterval(gameLoop)
  gameLoop = setInterval(gameLoopFn, 1000 / level.value)
}

// 重新开始
const restart = () => {
  startGame()
}

// 返回
const goBack = () => {
  router.push('/')
}

// 键盘控制
const handleKeydown = (e: KeyboardEvent) => {
  if (gameOver.value) return
  switch (e.key) {
    case 'ArrowLeft': moveLeft(); break
    case 'ArrowRight': moveRight(); break
    case 'ArrowDown': moveDown(); break
    case 'ArrowUp': rotate(); break
  }
  draw()
}

// 触摸开始
const handleTouchStart = (e: TouchEvent) => {
  e.preventDefault()
  const touch = e.touches[0]
  touchStartX = touch.clientX
  touchStartY = touch.clientY
  touchStartTime = Date.now()
  isLongPress = false

  // 长按检测（快速下落）
  longPressTimer = setTimeout(() => {
    isLongPress = true
  }, 500)
}

// 触摸移动
const handleTouchMove = (e: TouchEvent) => {
  e.preventDefault()
  if (gameOver.value) return

  const touch = e.touches[0]
  const deltaX = touch.clientX - touchStartX
  const deltaY = touch.clientY - touchStartY

  // 水平移动
  const moveThreshold = 30
  if (Math.abs(deltaX) > moveThreshold) {
    if (deltaX > 0) {
      moveRight()
    } else {
      moveLeft()
    }
    touchStartX = touch.clientX
    draw()
  }

  // 下滑加速
  if (deltaY > moveThreshold) {
    moveDown()
    touchStartY = touch.clientY
    draw()
  }
}

// 触摸结束
const handleTouchEnd = (e: TouchEvent) => {
  e.preventDefault()
  if (gameOver.value) return

  // 清除长按定时器
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }

  const touch = e.changedTouches[0]
  const deltaX = touch.clientX - touchStartX
  const deltaY = touch.clientY - touchStartY
  const deltaTime = Date.now() - touchStartTime

  // 判断是否为点击（旋转）
  const maxSwipeDistance = 30
  const maxTapTime = 300

  if (
    Math.abs(deltaX) < maxSwipeDistance &&
    Math.abs(deltaY) < maxSwipeDistance &&
    deltaTime < maxTapTime &&
    !isLongPress
  ) {
    // 点击旋转
    rotate()
    draw()
  }
}

onMounted(() => {
  startGame()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (gameLoop) clearInterval(gameLoop)
  if (longPressTimer) clearTimeout(longPressTimer)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.game-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.game-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.score, .level {
  font-size: 18px;
  font-weight: 500;
  color: #323233;
}

.game-canvas {
  border: 2px solid #ebedf0;
  border-radius: 8px;
  background: #000;
}

.controls {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 40px;
  border-radius: 16px;
  text-align: center;
}

.game-over-text {
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
