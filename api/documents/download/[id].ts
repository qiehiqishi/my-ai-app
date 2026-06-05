import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDocumentById } from '../../lib/db'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    res.status(405).json({
      success: false,
      message: 'Method not allowed'
    })
    return
  }

  const { id } = req.query
  const documentId = parseInt(id as string)

  if (isNaN(documentId)) {
    res.status(400).json({
      success: false,
      message: 'Invalid ID'
    })
    return
  }

  try {
    const document = await getDocumentById(documentId)
    if (!document) {
      res.status(404).json({
        success: false,
        message: 'Document not found'
      })
      return
    }

    // 设置下载响应头
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(document.title)}"`)
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
    
    // 返回文件内容
    res.status(200).send(document.content)
  } catch (error) {
    console.error('Download Error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to download file'
    })
  }
}
