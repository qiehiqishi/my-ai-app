import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 上传目录配置
export const UPLOAD_DIR = path.join(__dirname, '../uploads')

// 确保上传目录存在
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  console.log('✅ 创建上传目录:', UPLOAD_DIR)
}

// 允许的文件类型
export const ALLOWED_EXTENSIONS = ['.md', '.markdown', '.txt']

// 文件大小限制 (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024

// 检查文件类型是否允许
export function isAllowedFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase()
  return ALLOWED_EXTENSIONS.includes(ext)
}

// 生成唯一文件名
export function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName)
  const basename = path.basename(originalName, ext)
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${basename}_${timestamp}_${random}${ext}`
}

// 获取文件信息
export function getFileInfo(filepath: string) {
  const stats = fs.statSync(filepath)
  return {
    size: stats.size,
    created: stats.birthtime,
    modified: stats.mtime
  }
}
