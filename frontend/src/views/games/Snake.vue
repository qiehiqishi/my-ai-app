<template>
  <div class="game-page">
    <van-nav-bar
      title="贪吃蛇"
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
        <div class="best-score">最高分: {{ bestScore }}</div>
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
        <div class="control-row">
          <van-button 
            icon="arrow-up" 
            @click="changeDirection('up')"
            :disabled="gameOver"
          />
        </div>
        <div class="control-row">
          <van-button 
            icon="arrow-left" 
            @click="changeDirection('left')"
            :disabled="gameOver"
          />
          <van-button 
            icon="arrow-down" 
            @click="changeDirection('down')"
            :disabled="gameOver"
          />
          <van-button 
            icon="arrow-right" 
            @click="changeDirection('right')"
            :disabled="gameOver"
          />
        </div>
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
const canvasWidth = 400
const canvasHeight = 400
const gridSize = 20

const score = ref(0)
const bestScore = ref(parseInt(localStorage.getItem('snake-best') || '0'))
const gameOver = ref(false)

let snake: Array<{ x: number; y: number }> = []
let food = { x: 0, y: 0 }
let direction = 'right'
let nextDirection = 'right'
let gameLoop: number | null = null

// 触摸相关
let touchStartX = 0
let touchStartY = 0
let touchStartTime = 0

// 初始化游戏
const initGame = () => {
  snake = [
    { x: 5, y: 10 },
    { x: 4, y: 10 },
    { x: 3, y: 10 }
  ]
  direction = 'right'
  nextDirection = 'right'
  score.value = 0
  gameOver.value = false
  generateFood()
}

// 生成食物
const generateFood = () => {
  const maxX = canvasWidth / gridSize
  const maxY = canvasHeight / gridSize
  do {
    food = {
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY)
    }
  } while (snake.some(s => s.x === food.x && s.y === food.y))
}

// 改变方向
const changeDirection = (newDirection: string) => {
  const opposites: Record<string, string> = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left'
  }
  
  if (opposites[newDirection] !== direction) {
    nextDirection = newDirection
  }
}

// 游戏循环
const update = () => {
  if (gameOver.value) return

  direction = nextDirection

  const head = { ...snake[0] }
  
  switch (direction) {
    case 'up': head.y--; break
    case 'down': head.y++; break
    case 'left': head.x--; break
    case 'right': head.x++; break
  }

  // 检查碰撞
  const maxX = canvasWidth / gridSize
  const maxY = canvasHeight / gridSize
  
  if (
    head.x < 0 || head.x >= maxX ||
    head.y < 0 || head.y >= maxY ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    gameOver.value = true
    if (score.value > bestScore.value) {
      bestScore.value = score.value
      localStorage.setItem('snake-best', bestScore.value.toString())
    }
    return
  }

  snake.unshift(head)

  // 吃食物
  if (head.x === food.x && head.y === food.y) {
    score.value += 10
    generateFood()
  } else {
    snake.pop()
  }
}

// 绘制游戏
const draw = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 清空画布
  ctx.fillStyle = '#f7f8fa'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // 绘制网格
  ctx.strokeStyle = '#ebedf0'
  ctx.lineWidth = 1
  for (let i = 0; i <= canvasWidth; i += gridSize) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, canvasHeight)
    ctx.stroke()
  }
  for (let i = 0; i <= canvasHeight; i += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(canvasWidth, i)
    ctx.stroke()
  }

  // 绘制蛇
  snake.forEach((segment, index) => {
    if (index === 0) {
      ctx.fillStyle = '#07c160'
    } else {
      ctx.fillStyle = '#4cd964'
    }
    ctx.fillRect(
      segment.x * gridSize + 1,
      segment.y * gridSize + 1,
      gridSize - 2,
      gridSize - 2
    )
  })

  // 绘制食物
  ctx.fillStyle = '#ff4444'
  ctx.beginPath()
  ctx.arc(
    food.x * gridSize + gridSize / 2,
    food.y * gridSize + gridSize / 2,
    gridSize / 2 - 2,
    0,
    Math.PI * 2
  )
  ctx.fill()
}

// 游戏主循环
const gameLoopFn = () => {
  update()
  draw()
}

// 开始游戏
const startGame = () => {
  initGame()
  if (gameLoop) clearInterval(gameLoop)
  gameLoop = setInterval(gameLoopFn, 150)
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
  switch (e.key) {
    case 'ArrowUp': changeDirection('up'); break
    case 'ArrowDown': changeDirection('down'); break
    case 'ArrowLeft': changeDirection('left'); break
    case 'ArrowRight': changeDirection('right'); break
  }
}

// 触摸开始
const handleTouchStart = (e: TouchEvent) => {
  e.preventDefault()
  const touch = e.touches[0]
  touchStartX = touch.clientX
  touchStartY = touch.clientY
  touchStartTime = Date.now()
}

// 触摸移动
const handleTouchMove = (e: TouchEvent) => {
  e.preventDefault()
}

// 触摸结束
const handleTouchEnd = (e: TouchEvent) => {
  e.preventDefault()
  if (gameOver.value) return

  const touch = e.changedTouches[0]
  const deltaX = touch.clientX - touchStartX
  const deltaY = touch.clientY - touchStartY
  const deltaTime = Date.now() - touchStartTime

  // 最小滑动距离和最大时间
  const minSwipeDistance = 30
  const maxSwipeTime = 500

  if (deltaTime > maxSwipeTime) return

  // 判断滑动方向
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // 水平滑动
    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        changeDirection('right')
      } else {
        changeDirection('left')
      }
    }
  } else {
    // 垂直滑动
    if (Math.abs(deltaY) > minSwipeDistance) {
      if (deltaY > 0) {
        changeDirection('down')
      } else {
        changeDirection('up')
      }
    }
  }
}

onMounted(() => {
  startGame()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (gameLoop) clearInterval(gameLoop)
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

.score, .best-score {
  font-size: 18px;
  font-weight: 500;
  color: #323233;
}

.game-canvas {
  border: 2px solid #ebedf0;
  border-radius: 8px;
  background: #fff;
}

.controls {
  margin-top: 20px;
}

.control-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
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
