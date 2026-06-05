<template>
  <div class="game-page">
    <van-nav-bar
      title="扫雷"
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
        <div class="mines">💣 剩余: {{ minesLeft }}</div>
        <div class="status">{{ gameStatus }}</div>
      </div>

      <div class="board">
        <div 
          v-for="(row, y) in board" 
          :key="y"
          class="row"
        >
          <div 
            v-for="(cell, x) in row"
            :key="x"
            class="cell"
            :class="{
              'revealed': cell.revealed,
              'mine': cell.revealed && cell.mine,
              'flagged': cell.flagged,
              'exploded': cell.exploded
            }"
            @click="reveal(x, y)"
            @contextmenu.prevent="toggleFlag(x, y)"
          >
            <span v-if="cell.flagged">🚩</span>
            <span v-else-if="cell.revealed && cell.mine">💣</span>
            <span v-else-if="cell.revealed && cell.count" :class="`color-${cell.count}`">
              {{ cell.count }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="gameOver || gameWon" class="game-over">
        <div class="game-over-text">
          {{ gameWon ? '🎉 恭喜获胜！' : '💥 游戏结束' }}
        </div>
        <van-button type="primary" @click="restart">重新开始</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const rows = 10
const cols = 10
const totalMines = 15

interface Cell {
  mine: boolean
  revealed: boolean
  flagged: boolean
  count: number
  exploded?: boolean
}

const board = ref<Cell[][]>([])
const gameOver = ref(false)
const gameWon = ref(false)
const firstClick = ref(true)

const minesLeft = computed(() => {
  let flags = 0
  board.value.forEach(row => {
    row.forEach(cell => {
      if (cell.flagged) flags++
    })
  })
  return totalMines - flags
})

const gameStatus = computed(() => {
  if (gameWon.value) return '🎉 获胜'
  if (gameOver.value) return '💥 失败'
  return '游戏中'
})

// 初始化棋盘
const initBoard = () => {
  board.value = Array(rows).fill(null).map(() =>
    Array(cols).fill(null).map(() => ({
      mine: false,
      revealed: false,
      flagged: false,
      count: 0
    }))
  )
  gameOver.value = false
  gameWon.value = false
  firstClick.value = true
}

// 放置地雷
const placeMines = (excludeX: number, excludeY: number) => {
  let placed = 0
  while (placed < totalMines) {
    const x = Math.floor(Math.random() * cols)
    const y = Math.floor(Math.random() * rows)
    
    if (Math.abs(x - excludeX) <= 1 && Math.abs(y - excludeY) <= 1) continue
    if (board.value[y][x].mine) continue
    
    board.value[y][x].mine = true
    placed++
  }

  // 计算数字
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (!board.value[y][x].mine) {
        let count = 0
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy
            const nx = x + dx
            if (ny >= 0 && ny < rows && nx >= 0 && nx < cols) {
              if (board.value[ny][nx].mine) count++
            }
          }
        }
        board.value[y][x].count = count
      }
    }
  }
}

// 揭示格子
const reveal = (x: number, y: number) => {
  if (gameOver.value || gameWon.value) return
  if (board.value[y][x].flagged || board.value[y][x].revealed) return

  if (firstClick.value) {
    placeMines(x, y)
    firstClick.value = false
  }

  board.value[y][x].revealed = true

  if (board.value[y][x].mine) {
    board.value[y][x].exploded = true
    gameOver.value = true
    revealAllMines()
    return
  }

  if (board.value[y][x].count === 0) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const ny = y + dy
        const nx = x + dx
        if (ny >= 0 && ny < rows && nx >= 0 && nx < cols) {
          reveal(nx, ny)
        }
      }
    }
  }

  checkWin()
}

// 揭示所有地雷
const revealAllMines = () => {
  board.value.forEach(row => {
    row.forEach(cell => {
      if (cell.mine) cell.revealed = true
    })
  })
}

// 切换旗帜
const toggleFlag = (x: number, y: number) => {
  if (gameOver.value || gameWon.value) return
  if (board.value[y][x].revealed) return
  board.value[y][x].flagged = !board.value[y][x].flagged
}

// 检查获胜
const checkWin = () => {
  let revealed = 0
  board.value.forEach(row => {
    row.forEach(cell => {
      if (cell.revealed) revealed++
    })
  })
  if (revealed === rows * cols - totalMines) {
    gameWon.value = true
  }
}

// 重新开始
const restart = () => {
  initBoard()
}

// 返回
const goBack = () => {
  router.push('/')
}

onMounted(() => {
  initBoard()
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

.mines, .status {
  font-size: 18px;
  font-weight: 500;
  color: #323233;
}

.board {
  border: 2px solid #969799;
  border-radius: 8px;
  background: #c0c0c0;
  padding: 4px;
}

.row {
  display: flex;
}

.cell {
  width: 30px;
  height: 30px;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  background: #c0c0c0;
}

.cell.revealed {
  border-color: #808080;
  background: #e0e0e0;
}

.cell.mine {
  background: #ff0000;
}

.cell.exploded {
  background: #ff4444;
}

.cell.flagged {
  background: #c0c0c0;
}

.color-1 { color: #0000ff; }
.color-2 { color: #008000; }
.color-3 { color: #ff0000; }
.color-4 { color: #000080; }
.color-5 { color: #800000; }
.color-6 { color: #008080; }
.color-7 { color: #000000; }
.color-8 { color: #808080; }

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
