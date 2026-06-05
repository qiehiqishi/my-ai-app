import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from 'koa-cors'
import dotenv from 'dotenv'
import { koaBody } from 'koa-body'
import serve from 'koa-static'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import skillsRouter from './routes/skills.js'
import promptsRouter from './routes/prompts.js'
import documentsRouter from './routes/documents.js'
import { initDatabase } from './database/index.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = new Koa()
const PORT = process.env.PORT || 3000

// 确保上传目录存在
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
  console.log('✅ 创建上传目录:', uploadDir)
}

// 中间件
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

// 文件上传中间件
app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, 'uploads'),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  }
}))

app.use(bodyParser())

// 静态文件服务（用于访问上传的文件）
app.use(serve(path.join(__dirname, 'uploads')))

// 路由
app.use(skillsRouter.routes())
app.use(skillsRouter.allowedMethods())
app.use(promptsRouter.routes())
app.use(promptsRouter.allowedMethods())
app.use(documentsRouter.routes())
app.use(documentsRouter.allowedMethods())

// 错误处理
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err: any) {
    ctx.status = err.status || 500
    ctx.body = {
      success: false,
      message: err.message || 'Internal Server Error'
    }
    ctx.app.emit('error', err, ctx)
  }
})

// 启动服务器
async function start() {
  try {
    // 初始化数据库
    await initDatabase()
    console.log('✅ Database initialized successfully')

    // 启动服务器
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`)
      console.log(`📊 API endpoints:`)
      console.log(`   - GET    /api/skills`)
      console.log(`   - POST   /api/skills`)
      console.log(`   - PUT    /api/skills/:id`)
      console.log(`   - DELETE /api/skills/:id`)
      console.log(`   - GET    /api/prompts`)
      console.log(`   - POST   /api/prompts`)
      console.log(`   - PUT    /api/prompts/:id`)
      console.log(`   - DELETE /api/prompts/:id`)
      console.log(`   - GET    /api/documents`)
      console.log(`   - POST   /api/documents/upload`)
      console.log(`   - GET    /api/documents/download/:id`)
      console.log(`   - PUT    /api/documents/:id`)
      console.log(`   - DELETE /api/documents/:id`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

start()

export default app
