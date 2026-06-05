import axios from 'axios'
import { Skill, Prompt, ApiResponse } from '@/types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Skills API
export const skillsApi = {
  getAll: () => api.get<ApiResponse<Skill[]>>('/skills'),
  getById: (id: number) => api.get<ApiResponse<Skill>>(`/skills/${id}`),
  create: (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<ApiResponse<Skill>>('/skills', skill),
  update: (id: number, skill: Partial<Skill>) => 
    api.put<ApiResponse<Skill>>(`/skills/${id}`, skill),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/skills/${id}`)
}

// Prompts API
export const promptsApi = {
  getAll: () => api.get<ApiResponse<Prompt[]>>('/prompts'),
  getById: (id: number) => api.get<ApiResponse<Prompt>>(`/prompts/${id}`),
  create: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<ApiResponse<Prompt>>('/prompts', prompt),
  update: (id: number, prompt: Partial<Prompt>) => 
    api.put<ApiResponse<Prompt>>(`/prompts/${id}`, prompt),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/prompts/${id}`)
}

export default api
