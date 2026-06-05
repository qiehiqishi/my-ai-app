import fs from 'fs'
import path from 'path'
import Router from '@koa/router'
import { UPLOAD_DIR, isAllowedFile, generateUniqueFilename, getFileInfo } from '../utils/upload.js'
import { DocumentModel } from '../models/Document.js'
import { ApiResponse } from '../types/index.js'

const router = new Router({ prefix: '/api/documents' })

// 获取所有文档
router.get('/', async (ctx) => {
  try {
    const documents = DocumentModel.getAll()
    ctx.body = {
      success: true,
      data: documents
    } as ApiResponse<typeof documents>
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      success: false,
      message: 'Failed to fetch documents'
    } as ApiResponse<null>
  }
})

// 获取单个文档
router.get('/:id', async (ctx) => {
  try {
    const id = parseInt(ctx.params.id)
    const document = DocumentModel.getById(id)
    if (document) {
      ctx.body = {
        success: true,
        data: document
      } as ApiResponse<typeof document>
    } else {
      ctx.status = 404
      ctx.body = {
        success: false,
        message: 'Document not found'
      } as ApiResponse<null>
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      success: false,
      message: 'Failed to fetch document'
    } as ApiResponse<null>
  }
})

// 上传文档
router.post('/upload', async (ctx) => {
  try {
    const file = ctx.request.files?.file
    
    if (!file) {
      ctx.status = 400
      ctx.body = {
        success: false,
        message: 'No file uploaded'
      } as ApiResponse<null>
      return
    }

    // 处理单个文件上传
    const uploadedFile = Array.isArray(file) ? file[0] : file
    const originalName = uploadedFile.originalFilename || 'untitled.md'
    
    // 检查文件类型
    if (!isAllowedFile(originalName)) {
      ctx.status = 400
      ctx.body = {
        success: false,
        message: 'File type not allowed. Only .md, .markdown, .txt files are accepted.'
      } as ApiResponse<null>
      return
    }

    // 生成唯一文件名
    const uniqueName = generateUniqueFilename(originalName)
    const filepath = path.join(UPLOAD_DIR, uniqueName)

    // 移动文件到上传目录
    const reader = fs.createReadStream(uploadedFile.filepath)
    const writer = fs.createWriteStream(filepath)
    
    await new Promise((resolve, reject) => {
      reader.pipe(writer)
      writer.on('finish', resolve)
      writer.on('error', reject)
    })

    // 读取文件内容
    const content = fs.readFileSync(filepath, 'utf-8')
    const fileInfo = getFileInfo(filepath)

    // 保存到数据库
    const document = DocumentModel.create({
      title: originalName,
      filename: uniqueName,
      filepath: filepath,
      content: content,
      size: fileInfo.size,
      category: 'markdown'
    })

    ctx.status = 201
    ctx.body = {
      success: true,
      data: document,
      message: 'File uploaded successfully'
    } as ApiResponse<typeof document>
  } catch (error) {
    console.error('Upload error:', error)
    ctx.status = 500
    ctx.body = {
      success: false,
      message: 'Failed to upload file'
    } as ApiResponse<null>
  }
})

// 下载文档
router.get('/download/:id', async (ctx) => {
  try {
    const id = parseInt(ctx.params.id)
    const document = DocumentModel.getById(id)
    
    if (!document) {
      ctx.status = 404
      ctx.body = {
        success: false,
        message: 'Document not found'
      } as ApiResponse<null>
      return
    }

    console.log('下载文档:', {
      id: document.id,
      title: document.title,
      filepath: document.filepath,
      exists: fs.existsSync(document.filepath)
    })

    // 检查文件是否存在
    if (!fs.existsSync(document.filepath)) {
      console.error('文件不存在:', document.filepath)
      ctx.status = 404
      ctx.body = {
        success: false,
        message: 'File not found on disk'
      } as ApiResponse<null>
      return
    }

    // 设置响应头
    ctx.set('Content-Disposition', `attachment; filename="${encodeURIComponent(document.title)}"`)
    ctx.set('Content-Type', 'text/markdown; charset=utf-8')
    
    // 发送文件
    ctx.body = fs.createReadStream(document.filepath)
  } catch (error) {
    console.error('下载错误:', error)
    ctx.status = 500
    ctx.body = {
      success: false,
      message: 'Failed to download file'
    } as ApiResponse<null>
  }
})

// 更新文档内容
router.put('/:id', async (ctx) => {
  try {
    const id = parseInt(ctx.params.id)
    const { content, title, category } = ctx.request.body
    
    const document = DocumentModel.getById(id)
    if (!document) {
      ctx.status = 404
      ctx.body = {
        success: false,
        message: 'Document not found'
      } as ApiResponse<null>
      return
    }

    // 更新文件内容
    if (content) {
      fs.writeFileSync(document.filepath, content, 'utf-8')
    }

    // 更新数据库
    const updated = DocumentModel.update(id, {
      title: title || document.title,
      content: content || document.content,
      category: category || document.category
    })

    ctx.body = {
      success: true,
      data: updated,
      message: 'Document updated successfully'
    } as ApiResponse<typeof updated>
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      success: false,
      message: 'Failed to update document'
    } as ApiResponse<null>
  }
})

// 删除文档
router.delete('/:id', async (ctx) => {
  try {
    const id = parseInt(ctx.params.id)
    const document = DocumentModel.getById(id)
    
    if (!document) {
      ctx.status = 404
      ctx.body = {
        success: false,
        message: 'Document not found'
      } as ApiResponse<null>
      return
    }

    // 删除文件
    if (fs.existsSync(document.filepath)) {
      fs.unlinkSync(document.filepath)
    }

    // 删除数据库记录
    DocumentModel.delete(id)

    ctx.body = {
      success: true,
      message: 'Document deleted successfully'
    } as ApiResponse<null>
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      success: false,
      message: 'Failed to delete document'
    } as ApiResponse<null>
  }
})

export default router
