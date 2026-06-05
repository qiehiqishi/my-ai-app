import { kv } from '@vercel/kv'

// 数据类型定义
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
  blobUrl: string
  content: string
  size: number
  category: string
  createdAt: string
  updatedAt: string
}

// 生成唯一 ID
export function generateId(): number {
  return Date.now()
}

// Skills 操作
export async function getAllSkills(): Promise<Skill[]> {
  const skills = await kv.get<Skill[]>('skills')
  return skills || []
}

export async function getSkillById(id: number): Promise<Skill | null> {
  const skills = await getAllSkills()
  return skills.find(s => s.id === id) || null
}

export async function createSkill(skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Skill> {
  const skills = await getAllSkills()
  const newSkill: Skill = {
    ...skill,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  skills.push(newSkill)
  await kv.set('skills', skills)
  return newSkill
}

export async function updateSkill(id: number, updates: Partial<Skill>): Promise<Skill | null> {
  const skills = await getAllSkills()
  const index = skills.findIndex(s => s.id === id)
  if (index === -1) return null
  
  skills[index] = {
    ...skills[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  await kv.set('skills', skills)
  return skills[index]
}

export async function deleteSkill(id: number): Promise<boolean> {
  const skills = await getAllSkills()
  const index = skills.findIndex(s => s.id === id)
  if (index === -1) return false
  
  skills.splice(index, 1)
  await kv.set('skills', skills)
  return true
}

// Prompts 操作
export async function getAllPrompts(): Promise<Prompt[]> {
  const prompts = await kv.get<Prompt[]>('prompts')
  return prompts || []
}

export async function getPromptById(id: number): Promise<Prompt | null> {
  const prompts = await getAllPrompts()
  return prompts.find(p => p.id === id) || null
}

export async function createPrompt(prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prompt> {
  const prompts = await getAllPrompts()
  const newPrompt: Prompt = {
    ...prompt,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  prompts.push(newPrompt)
  await kv.set('prompts', prompts)
  return newPrompt
}

export async function updatePrompt(id: number, updates: Partial<Prompt>): Promise<Prompt | null> {
  const prompts = await getAllPrompts()
  const index = prompts.findIndex(p => p.id === id)
  if (index === -1) return null
  
  prompts[index] = {
    ...prompts[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  await kv.set('prompts', prompts)
  return prompts[index]
}

export async function deletePrompt(id: number): Promise<boolean> {
  const prompts = await getAllPrompts()
  const index = prompts.findIndex(p => p.id === id)
  if (index === -1) return false
  
  prompts.splice(index, 1)
  await kv.set('prompts', prompts)
  return true
}

// Documents 操作
export async function getAllDocuments(): Promise<Document[]> {
  const documents = await kv.get<Document[]>('documents')
  return documents || []
}

export async function getDocumentById(id: number): Promise<Document | null> {
  const documents = await getAllDocuments()
  return documents.find(d => d.id === id) || null
}

export async function createDocument(document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document> {
  const documents = await getAllDocuments()
  const newDocument: Document = {
    ...document,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  documents.push(newDocument)
  await kv.set('documents', documents)
  return newDocument
}

export async function updateDocument(id: number, updates: Partial<Document>): Promise<Document | null> {
  const documents = await getAllDocuments()
  const index = documents.findIndex(d => d.id === id)
  if (index === -1) return null
  
  documents[index] = {
    ...documents[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  await kv.set('documents', documents)
  return documents[index]
}

export async function deleteDocument(id: number): Promise<boolean> {
  const documents = await getAllDocuments()
  const index = documents.findIndex(d => d.id === id)
  if (index === -1) return false
  
  documents.splice(index, 1)
  await kv.set('documents', documents)
  return true
}
