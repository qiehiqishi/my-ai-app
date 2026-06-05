import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getAllPrompts, createPrompt } from './lib/db'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    if (req.method === 'GET') {
      const prompts = await getAllPrompts()
      res.status(200).json({
        success: true,
        data: prompts
      })
    } else if (req.method === 'POST') {
      const { name, content, category, variables } = req.body
      
      if (!name || !content) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields'
        })
        return
      }
      
      const prompt = await createPrompt({
        name,
        content,
        category: category || 'general',
        variables: variables || []
      })
      
      res.status(201).json({
        success: true,
        data: prompt,
        message: 'Prompt created successfully'
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
