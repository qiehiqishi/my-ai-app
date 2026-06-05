import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getPromptById, updatePrompt, deletePrompt } from '../lib/db'

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
  const promptId = parseInt(id as string)

  if (isNaN(promptId)) {
    res.status(400).json({
      success: false,
      message: 'Invalid ID'
    })
    return
  }

  try {
    if (req.method === 'GET') {
      const prompt = await getPromptById(promptId)
      if (!prompt) {
        res.status(404).json({
          success: false,
          message: 'Prompt not found'
        })
        return
      }
      res.status(200).json({
        success: true,
        data: prompt
      })
    } else if (req.method === 'PUT') {
      const updates = req.body
      const prompt = await updatePrompt(promptId, updates)
      if (!prompt) {
        res.status(404).json({
          success: false,
          message: 'Prompt not found'
        })
        return
      }
      res.status(200).json({
        success: true,
        data: prompt,
        message: 'Prompt updated successfully'
      })
    } else if (req.method === 'DELETE') {
      const success = await deletePrompt(promptId)
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Prompt not found'
        })
        return
      }
      res.status(200).json({
        success: true,
        message: 'Prompt deleted successfully'
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
