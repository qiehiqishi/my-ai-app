#!/usr/bin/env tsx
/**
 * 初始化数据库数据脚本
 * 用于创建示例 Skills 和 Prompts 数据
 */

import initSqlJs from 'sql.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_PATH = path.join(__dirname, '../data/database.sqlite')

async function initDatabase() {
  console.log('🚀 开始初始化数据库...\n')

  // 初始化 SQL.js
  const SQL = await initSqlJs()

  // 如果数据库文件存在，则加载
  let db
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH)
    db = new SQL.Database(buffer)
    console.log('✅ 已加载现有数据库')
  } else {
    db = new SQL.Database()
    console.log('✅ 创建新数据库')
  }

  // 创建表结构
  db.run(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      content TEXT,
      category TEXT,
      tags TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS prompts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      content TEXT,
      category TEXT,
      variables TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  console.log('✅ 表结构已创建\n')

  // 检查是否已有数据
  const existingSkills = db.exec('SELECT COUNT(*) FROM skills')
  const skillCount = existingSkills[0]?.values[0]?.[0] || 0

  if (skillCount > 0) {
    console.log('⚠️  数据库已有数据，跳过初始化')
    console.log(`   当前 Skills 数量: ${skillCount}`)
  } else {
    console.log('📝 添加示例数据...\n')

    // 添加示例 Skills
    const sampleSkills = [
      {
        name: 'diagnose',
        description: '诊断代码问题和性能回归',
        content: '用于诊断复杂 Bug 和性能问题的 Skill',
        category: '开发工具',
        tags: ['debug', 'performance', 'testing']
      },
      {
        name: 'tdd',
        description: '测试驱动开发流程',
        content: '红-绿-重构循环的 TDD 开发 Skill',
        category: '开发工具',
        tags: ['testing', 'tdd', 'refactoring']
      },
      {
        name: 'review',
        description: '代码审查',
        content: '审查代码质量和最佳实践',
        category: '代码质量',
        tags: ['review', 'quality', 'best-practices']
      }
    ]

    sampleSkills.forEach(skill => {
      db.run(
        `INSERT INTO skills (name, description, content, category, tags) VALUES (?, ?, ?, ?, ?)`,
        [skill.name, skill.description, skill.content, skill.category, JSON.stringify(skill.tags)]
      )
      console.log(`   ✅ 添加 Skill: ${skill.name}`)
    })

    // 添加示例 Prompts
    const samplePrompts = [
      {
        name: '代码解释',
        content: '请详细解释以下代码的功能和实现原理：\n\n{code}',
        category: '代码理解',
        variables: ['code']
      },
      {
        name: 'Bug 修复',
        content: '以下代码存在问题，请帮我找出 Bug 并修复：\n\n问题描述：{issue}\n代码：{code}',
        category: '问题解决',
        variables: ['issue', 'code']
      },
      {
        name: '代码优化',
        content: '请优化以下代码的性能和可读性：\n\n{code}\n\n优化目标：{goal}',
        category: '代码改进',
        variables: ['code', 'goal']
      }
    ]

    console.log('')
    samplePrompts.forEach(prompt => {
      db.run(
        `INSERT INTO prompts (name, content, category, variables) VALUES (?, ?, ?, ?)`,
        [prompt.name, prompt.content, prompt.category, JSON.stringify(prompt.variables)]
      )
      console.log(`   ✅ 添加 Prompt: ${prompt.name}`)
    })
  }

  // 保存数据库
  const data = db.export()
  const buffer = Buffer.from(data)
  
  // 确保目录存在
  const dataDir = path.dirname(DB_PATH)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  fs.writeFileSync(DB_PATH, buffer)

  console.log('\n✅ 数据库已保存到:', DB_PATH)
  console.log('📊 数据库大小:', (buffer.length / 1024).toFixed(2), 'KB')
  console.log('\n🎉 初始化完成！')
}

// 执行初始化
initDatabase().catch(error => {
  console.error('❌ 初始化失败:', error)
  process.exit(1)
})
