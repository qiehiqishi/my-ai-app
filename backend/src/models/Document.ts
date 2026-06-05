import { getDatabase, saveDatabase } from '../database/index.js'
import { Document } from '../types/index.js'

export class DocumentModel {
  static getAll(): Document[] {
    const db = getDatabase()
    const result = db.exec('SELECT * FROM documents ORDER BY createdAt DESC')
    
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

    return rows
  }

  static getById(id: number): Document | undefined {
    const db = getDatabase()
    const result = db.exec(`SELECT * FROM documents WHERE id = ${id}`)
    
    if (!result.length || !result[0].values || !result[0].values.length) {
      return undefined
    }

    const columns = result[0].columns
    const row = result[0].values[0]
    const obj: any = {}
    columns.forEach((col, idx) => {
      obj[col] = row[idx]
    })

    return obj
  }

  static create(document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Document {
    const db = getDatabase()
    db.run(
      `INSERT INTO documents (title, filename, filepath, content, size, category) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        document.title,
        document.filename,
        document.filepath,
        document.content,
        document.size,
        document.category
      ]
    )
    saveDatabase()

    // 获取最后插入的 ID
    const result = db.exec('SELECT last_insert_rowid() as id')
    const lastId = result[0].values[0][0] as number
    
    return this.getById(lastId)!
  }

  static update(id: number, document: Partial<Document>): Document | undefined {
    const db = getDatabase()
    const fields: string[] = []
    const values: any[] = []

    if (document.title !== undefined) {
      fields.push('title = ?')
      values.push(document.title)
    }
    if (document.content !== undefined) {
      fields.push('content = ?')
      values.push(document.content)
    }
    if (document.category !== undefined) {
      fields.push('category = ?')
      values.push(document.category)
    }
    if (document.size !== undefined) {
      fields.push('size = ?')
      values.push(document.size)
    }

    fields.push('updatedAt = CURRENT_TIMESTAMP')
    values.push(id)

    db.run(`UPDATE documents SET ${fields.join(', ')} WHERE id = ?`, values)
    saveDatabase()
    
    return this.getById(id)
  }

  static delete(id: number): boolean {
    const db = getDatabase()
    db.run('DELETE FROM documents WHERE id = ?', [id])
    saveDatabase()
    return true
  }
}
