import { getDatabase, saveDatabase } from '../database/index.js'
import { Skill } from '../types/index.js'

export class SkillModel {
  static getAll(): Skill[] {
    const db = getDatabase()
    const result = db.exec('SELECT * FROM skills ORDER BY createdAt DESC')
    
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
      tags: JSON.parse(row.tags || '[]')
    }))
  }

  static getById(id: number): Skill | undefined {
    const db = getDatabase()
    const result = db.exec(`SELECT * FROM skills WHERE id = ${id}`)
    
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
      tags: JSON.parse(obj.tags || '[]')
    }
  }

  static create(skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>): Skill {
    const db = getDatabase()
    db.run(
      `INSERT INTO skills (name, description, content, category, tags) VALUES (?, ?, ?, ?, ?)`,
      [
        skill.name,
        skill.description,
        skill.content,
        skill.category,
        JSON.stringify(skill.tags || [])
      ]
    )
    saveDatabase()

    // 获取最后插入的 ID
    const result = db.exec('SELECT last_insert_rowid() as id')
    const lastId = result[0].values[0][0] as number
    
    return this.getById(lastId)!
  }

  static update(id: number, skill: Partial<Skill>): Skill | undefined {
    const db = getDatabase()
    const fields: string[] = []
    const values: any[] = []

    if (skill.name !== undefined) {
      fields.push('name = ?')
      values.push(skill.name)
    }
    if (skill.description !== undefined) {
      fields.push('description = ?')
      values.push(skill.description)
    }
    if (skill.content !== undefined) {
      fields.push('content = ?')
      values.push(skill.content)
    }
    if (skill.category !== undefined) {
      fields.push('category = ?')
      values.push(skill.category)
    }
    if (skill.tags !== undefined) {
      fields.push('tags = ?')
      values.push(JSON.stringify(skill.tags))
    }

    fields.push('updatedAt = CURRENT_TIMESTAMP')
    values.push(id)

    db.run(`UPDATE skills SET ${fields.join(', ')} WHERE id = ?`, values)
    saveDatabase()
    
    return this.getById(id)
  }

  static delete(id: number): boolean {
    const db = getDatabase()
    db.run('DELETE FROM skills WHERE id = ?', [id])
    saveDatabase()
    return true
  }
}
