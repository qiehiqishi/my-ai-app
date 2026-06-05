import Router from '@koa/router'
import { PromptModel } from '../models/Prompt.js'
import { ApiResponse } from '../types/index.js'

const router = new Router({ prefix: '/api/prompts' })

// 获取所有 Prompts
router.get('/', async (ctx) => {
  try {
    const prompts = PromptModel.getAll()
    ctx.body = {
      success: true,
      data: prompts
    } as ApiResponse<typeof prompts>
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      success: false,
      message: 'Failed to fetch prompts'
    } as ApiResponse<null>
  }
})

// 获取单个 Prompt
router.get('/:id', async (ctx) => {
  try {
    const id = parseInt(ctx.params.id)
    const prompt = PromptModel.getById(id)
    if (prompt) {
      ctx.body = {
        success: true,
        data: prompt
      } as ApiResponse<typeof prompt>
    } else {
      ctx.status = 404
      ctx.body = {
        success: false,
        message: 'Prompt not found'
      } as ApiResponse<null>
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      success: false,
      message: 'Failed to fetch prompt'
    } as ApiResponse<null>
  }
})

// 创建 Prompt
router.post('/', async (ctx) => {
  try {
    const prompt = PromptModel.create(ctx.request.body)
    ctx.status = 201
    ctx.body = {
      success: true,
      data: prompt
    } as ApiResponse<typeof prompt>
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      success: false,
      message: 'Failed to create prompt'
    } as ApiResponse<null>
  }
})

// 更新 Prompt
router.put('/:id', async (ctx) => {
  try {
    const id = parseInt(ctx.params.id)
    const prompt = PromptModel.update(id, ctx.request.body)
    if (prompt) {
      ctx.body = {
        success: true,
        data: prompt
      } as ApiResponse<typeof prompt>
    } else {
      ctx.status = 404
      ctx.body = {
        success: false,
        message: 'Prompt not found'
      } as ApiResponse<null>
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      success: false,
      message: 'Failed to update prompt'
    } as ApiResponse<null>
  }
})

// 删除 Prompt
router.delete('/:id', async (ctx) => {
  try {
    const id = parseInt(ctx.params.id)
    const deleted = PromptModel.delete(id)
    if (deleted) {
      ctx.body = {
        success: true,
        message: 'Prompt deleted successfully'
      } as ApiResponse<null>
    } else {
      ctx.status = 404
      ctx.body = {
        success: false,
        message: 'Prompt not found'
      } as ApiResponse<null>
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      success: false,
      message: 'Failed to delete prompt'
    } as ApiResponse<null>
  }
})

export default router
