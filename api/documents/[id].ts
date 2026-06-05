import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createDocument, getDocumentById, updateDocument, deleteDocument } from '../lib/db'
import { deleteFile } from '../lib/storage'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
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
    if (req.method === 'GET') {
      const document = await getDocumentById(documentId)
      if (!document) {
        res.status(404).json({
          success: false,
          message: 'Document not found'
        })
        return
      }
      res.status(200).json({
        success: true,
        data: document
      })
    } else if (req.method === 'PUT') {
      const updates = req.body
      const document = await updateDocument(documentId, updates)
      if (!document) {
        res.status(404).json({
          success: false,
          message: 'Document not found'
        })
        return
      }
      res.status(200).json({
        success: true,
        data: document,
        message: 'Document updated successfully'
      })
    } else if (req.method === 'DELETE') {
      const document = await getDocumentById(documentId)
      if (!document) {
        res.status(404).json({
          success: false,
          message: 'Document not found'
        })
        return
      }
      
      // 删除 Blob 存储
      if (document.blobUrl) {
        await deleteFile(document.blobUrl)
      }
      
      const success = await deleteDocument(documentId)
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Document not found'
        })
        return
      }
      res.status(200).json({
        success: true,
        message: 'Document deleted successfully'
      })
    } else {
      res.status(405).json({
        success: false,
        message: 'Method not allowed'
      })
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}
