import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createDocument } from '../../lib/db'
import { uploadFile, generateUniqueFilename, isAllowedFile } from '../../lib/storage'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({
      success: false,
      message: 'Method not allowed'
    })
    return
  }

  try {
    // 解析 multipart/form-data
    const contentType = req.headers['content-type']
    if (!contentType || !contentType.includes('multipart/form-data')) {
      res.status(400).json({
        success: false,
        message: 'Content-Type must be multipart/form-data'
      })
      return
    }

    // 注意：Vercel Serverless Functions 处理文件上传需要特殊处理
    // 这里简化处理，假设前端已经将文件内容转为 base64
    const { filename, content, category } = req.body
    
    if (!filename || !content) {
      res.status(400).json({
        success: false,
        message: 'Missing filename or content'
      })
      return
    }

    // 验证文件类型
    if (!isAllowedFile(filename)) {
      res.status(400).json({
        success: false,
        message: 'File type not allowed. Only .md, .markdown, .txt files are accepted.'
      })
      return
    }

    // 生成唯一文件名
    const uniqueFilename = generateUniqueFilename(filename)
    
    // 上传到 Vercel Blob
    const buffer = Buffer.from(content, 'base64')
    const uploadResult = await uploadFile(uniqueFilename, buffer)
    
    // 创建文档记录
    const document = await createDocument({
      title: filename,
      filename: uniqueFilename,
      blobUrl: uploadResult.url,
      content: buffer.toString('utf-8'),
      size: uploadResult.size,
      category: category || 'markdown'
    })
    
    res.status(201).json({
      success: true,
      data: document,
      message: 'File uploaded successfully'
    })
  } catch (error) {
    console.error('Upload Error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to upload file'
    })
  }
}
