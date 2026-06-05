export interface Skill {
  id: number
  name: string
  description: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Prompt {
  id: number
  name: string
  content: string
  category: string
  variables: string[]
  createdAt: string
  updatedAt: string
}

export interface Document {
  id: number
  title: string
  filename: string
  filepath: string
  content: string
  size: number
  category: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}
