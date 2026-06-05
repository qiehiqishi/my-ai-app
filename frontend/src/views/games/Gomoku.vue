<template>
  <div class="game-page">
    <van-nav-bar
      title="五子棋"
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
        <div class="current-player">
          当前: {{ currentPlayer === 'black' ? '⚫ 黑方' : '⚪ 白方' }}
        </div>
        <div v-if="winner" class="winner">
          🎉 {{ winner === 'black' ? '黑方' : '白方' }}获胜！
        </div>
      </div>

      <canvas 
        ref="canvasRef"
        :width="canvasSize"
        :height="canvasSize"
        class="game-canvas"
        @click="handleClick"
      ></canvas>

      <div v-if="winner" class="game-over">
        <van-button type="primary" @click="restart">再来一局</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const canvasRef = ref<HTMLCanvasElement>()
const boardSize = 15
const gridSize = 30
const canvasSize = boardSize * gridSize + gridSize

const currentPlayer = ref<'black' | 'white'>('black')
const winner = ref<'black' | 'white' | null>(null)

let board: Array<Array<'black' | 'white' | null>> = []

// 初始化棋盘
const initBoard = () => {
  board = Array(boardSize).fill(null).map(() => 
    Array(boardSize).fill(null)
  )
  currentPlayer.value = 'black'
  winner.value = null
}

// 绘制棋盘
const draw = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 清空画布
  ctx.fillStyle = '#dcb35c'
  ctx.fillRect(0, 0, canvasSize, canvasSize)

  // 绘制网格线
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 1

  for (let i = 0; i < boardSize; i++) {
    // 横线
    ctx.beginPath()
    ctx.moveTo(gridSize, gridSize * (i + 1))
    ctx.lineTo(gridSize * boardSize, gridSize * (i + 1))
    ctx.stroke()

    // 竖线
    ctx.beginPath()
    ctx.moveTo(gridSize * (i + 1), gridSize)
    ctx.lineTo(gridSize * (i + 1), gridSize * boardSize)
    ctx.stroke()
  }

  // 绘制星位
  const starPoints = [
    [3, 3], [3, 11], [7, 7], [11, 3], [11, 11]
  ]
  ctx.fillStyle = '#000'
  starPoints.forEach(([x, y]) => {
    ctx.beginPath()
    ctx.arc(gridSize * (x + 1), gridSize * (y + 1), 4, 0, Math.PI * 2)
    ctx.fill()
  })

  // 绘制棋子
  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const centerX = gridSize * (x + 1)
        const centerY = gridSize * (y + 1)
        
        // 绘制棋子阴影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
        ctx.beginPath()
        ctx.arc(centerX + 2, centerY + 2, gridSize / 2 - 2, 0, Math.PI * 2)
        ctx.fill()

        // 绘制棋子
        ctx.fillStyle = cell === 'black' ? '#000' : '#fff'
        ctx.beginPath()
        ctx.arc(centerX, centerY, gridSize / 2 - 2, 0, Math.PI * 2)
        ctx.fill()

        // 绘制棋子边框
        ctx.strokeStyle = cell === 'black' ? '#000' : '#999'
        ctx.lineWidth = 1
        ctx.stroke()
      }
    })
  })
}

// 处理点击
const handleClick = (e: MouseEvent) => {
  if (winner.value) return

  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const x = Math.round((e.clientX - rect.left) / gridSize) - 1
  const y = Math.round((e.clientY - rect.top) / gridSize) - 1

  if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) return
  if (board[y][x]) return

  // 落子
  board[y][x] = currentPlayer.value

  // 检查获胜
  if (checkWin(x, y)) {
    winner.value = currentPlayer.value
  } else {
    currentPlayer.value = currentPlayer.value === 'black' ? 'white' : 'black'
  }

  draw()
}

// 检查获胜
const checkWin = (x: number, y: number): boolean => {
  const player = board[y][x]
  if (!player) return false

  const directions = [
    [1, 0],   // 横向
    [0, 1],   // 纵向
    [1, 1],   // 斜向
    [1, -1]   // 反斜向
  ]

  for (const [dx, dy] of directions) {
    let count = 1

    // 正向检查
    for (let i = 1; i < 5; i++) {
      const nx = x + dx * i
      const ny = y + dy * i
      if (nx < 0 || nx >= boardSize || ny < 0 || ny >= boardSize) break
      if (board[ny][nx] !== player) break
      count++
    }

    // 反向检查
    for (let i = 1; i < 5; i++) {
      const nx = x - dx * i
      const ny = y - dy * i
      if (nx < 0 || nx >= boardSize || ny < 0 || ny >= boardSize) break
      if (board[ny][nx] !== player) break
      count++
    }

    if (count >= 5) return true
  }

  return false
}

// 重新开始
const restart = () => {
  initBoard()
  draw()
}

// 返回
const goBack = () => {
  router.push('/')
}

onMounted(() => {
  initBoard()
  draw()
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
  margin-bottom: 20px;
  text-align: center;
}

.current-player {
  font-size: 18px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 10px;
}

.winner {
  font-size: 20px;
  font-weight: bold;
  color: #07c160;
}

.game-canvas {
  border: 2px solid #ebedf0;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.game-over {
  margin-top: 20px;
}
</style>
