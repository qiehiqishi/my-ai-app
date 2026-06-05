import { getDatabase, saveDatabase } from '../database/index.js'
import { Prompt } from '../types/index.js'

export class PromptModel {
  static getAll(): Prompt[] {
    const db = getDatabase()
    const result = db.exec('SELECT * FROM prompts ORDER BY createdAt DESC')
    
    if (!result.length || !result[0].values) {
      return []
    }

    const columns = result[0].columns
    const rows = result[0].values.map(row => {
      const obj: any = {}
      columns.forEach((col, idx) => {
        obj[col] = row[idx]
      })
      return obj
    })

    return rows.map(row => ({
      ...row,
      variables: JSON.parse(row.variables || '[]')
    }))
  }

  static getById(id: number): Prompt | undefined {
    const db = getDatabase()
    const result = db.exec(`SELECT * FROM prompts WHERE id = ${id}`)
    
    if (!result.length || !result[0].values || !result[0].values.length) {
      return undefined
    }

    const columns = result[0].columns
    const row = result[0].values[0]
    const obj: any = {}
    columns.forEach((col, idx) => {
      obj[col] = row[idx]
    })

    return {
      ...obj,
      variables: JSON.parse(obj.variables || '[]')
    }
  }

  static create(prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Prompt {
    const db = getDatabase()
    db.run(
      `INSERT INTO prompts (name, content, category, variables) VALUES (?, ?, ?, ?)`,
      [
        prompt.name,
        prompt.content,
        prompt.category,
        JSON.stringify(prompt.variables || [])
      ]
    )
    saveDatabase()

    // 获取最后插入的 ID
    const result = db.exec('SELECT last_insert_rowid() as id')
    const lastId = result[0].values[0][0] as number
    
    return this.getById(lastId)!
  }

  static update(id: number, prompt: Partial<Prompt>): Prompt | undefined {
    const db = getDatabase()
    const fields: string[] = []
    const values: any[] = []

    if (prompt.name !== undefined) {
      fields.push('name = ?')
      values.push(prompt.name)
    }
    if (prompt.content !== undefined) {
      fields.push('content = ?')
      values.push(prompt.content)
    }
    if (prompt.category !== undefined) {
      fields.push('category = ?')
      values.push(prompt.category)
    }
    if (prompt.variables !== undefined) {
      fields.push('variables = ?')
      values.push(JSON.stringify(prompt.variables))
    }

    fields.push('updatedAt = CURRENT_TIMESTAMP')
    values.push(id)

    db.run(`UPDATE prompts SET ${fields.join(', ')} WHERE id = ?`, values)
    saveDatabase()
    
    return this.getById(id)
  }

  static delete(id: number): boolean {
    const db = getDatabase()
    db.run('DELETE FROM prompts WHERE id = ?', [id])
    saveDatabase()
    return true
  }
}
