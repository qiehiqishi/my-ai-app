import Router from '@koa/router'
import { SkillModel } from '../models/Skill.js'
import { ApiResponse } from '../types/index.js'

const router = new Router({ prefix: '/api/skills' })

// 获取所有 Skills
router.get('/', async (ctx) => {
  try {
    const skills = SkillModel.getAll()
    ctx.body = {
      success: true,
      data: skills
    } as ApiResponse<typeof skills>
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      success: false,
      message: 'Failed to fetch skills'
    } as ApiResponse<null>
  }
})

// 获取单个 Skill
router.get('/:id', async (ctx) => {
  try {
    const id = parseInt(ctx.params.id)
    const skill = SkillModel.getById(id)
    if (skill) {
      ctx.body = {
        success: true,
        data: skill
      } as ApiResponse<typeof skill>
    } else {
      ctx.status = 404
      ctx.body = {
        success: false,
        message: 'Skill not found'
      } as ApiResponse<null>
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      success: false,
      message: 'Failed to fetch skill'
    } as ApiResponse<null>
  }
})

// 创建 Skill
router.post('/', async (ctx) => {
  try {
    const skill = SkillModel.create(ctx.request.body)
    ctx.status = 201
    ctx.body = {
      success: true,
      data: skill
    } as ApiResponse<typeof skill>
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      success: false,
      message: 'Failed to create skill'
    } as ApiResponse<null>
  }
})

// 更新 Skill
router.put('/:id', async (ctx) => {
  try {
    const id = parseInt(ctx.params.id)
    const skill = SkillModel.update(id, ctx.request.body)
    if (skill) {
      ctx.body = {
        success: true,
        data: skill
      } as ApiResponse<typeof skill>
    } else {
      ctx.status = 404
      ctx.body = {
        success: false,
        message: 'Skill not found'
      } as ApiResponse<null>
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      success: false,
      message: 'Failed to update skill'
    } as ApiResponse<null>
  }
})

// 删除 Skill
router.delete('/:id', async (ctx) => {
  try {
    const id = parseInt(ctx.params.id)
    const deleted = SkillModel.delete(id)
    if (deleted) {
      ctx.body = {
        success: true,
        message: 'Skill deleted successfully'
      } as ApiResponse<null>
    } else {
      ctx.status = 404
      ctx.body = {
        success: false,
        message: 'Skill not found'
      } as ApiResponse<null>
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      success: false,
      message: 'Failed to delete skill'
    } as ApiResponse<null>
  }
})

export default router
