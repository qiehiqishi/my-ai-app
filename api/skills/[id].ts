import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSkillById, updateSkill, deleteSkill } from '../lib/db'

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
  const skillId = parseInt(id as string)

  if (isNaN(skillId)) {
    res.status(400).json({
      success: false,
      message: 'Invalid ID'
    })
    return
  }

  try {
    if (req.method === 'GET') {
      const skill = await getSkillById(skillId)
      if (!skill) {
        res.status(404).json({
          success: false,
          message: 'Skill not found'
        })
        return
      }
      res.status(200).json({
        success: true,
        data: skill
      })
    } else if (req.method === 'PUT') {
      const updates = req.body
      const skill = await updateSkill(skillId, updates)
      if (!skill) {
        res.status(404).json({
          success: false,
          message: 'Skill not found'
        })
        return
      }
      res.status(200).json({
        success: true,
        data: skill,
        message: 'Skill updated successfully'
      })
    } else if (req.method === 'DELETE') {
      const success = await deleteSkill(skillId)
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Skill not found'
        })
        return
      }
      res.status(200).json({
        success: true,
        message: 'Skill deleted successfully'
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
