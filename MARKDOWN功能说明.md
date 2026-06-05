# Markdown 文档管理功能

## 功能概述

AI 辅助开发平台现已支持 Markdown 文档管理功能，包括：

- ✅ 文档上传（支持 .md, .markdown, .txt 文件）
- ✅ 文档下载
- ✅ Markdown 实时预览
- ✅ 代码高亮显示
- ✅ 在线编辑
- ✅ 文档分类管理

## 技术实现

### 后端

**新增文件：**
- `src/routes/documents.ts` - 文档 API 路由
- `src/models/Document.ts` - 文档数据模型
- `src/utils/upload.ts` - 文件上传工具

**新增依赖：**
- `koa-body` - 文件上传中间件
- `koa-static` - 静态文件服务

**数据库表：**
```sql
CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL,
  content TEXT,
  size INTEGER,
  category TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
)
```

**API 接口：**
- `GET /api/documents` - 获取所有文档
- `GET /api/documents/:id` - 获取单个文档
- `POST /api/documents/upload` - 上传文档
- `GET /api/documents/download/:id` - 下载文档
- `PUT /api/documents/:id` - 更新文档
- `DELETE /api/documents/:id` - 删除文档

### 前端

**新增文件：**
- `src/views/Documents.vue` - 文档管理页面
- `src/components/MarkdownEditor.vue` - Markdown 编辑器组件

**新增依赖：**
- `markdown-it` - Markdown 解析器
- `highlight.js` - 代码高亮

**功能特性：**
1. **实时预览** - 左侧编辑，右侧实时预览
2. **代码高亮** - 支持多种编程语言的语法高亮
3. **文件上传** - 支持拖拽上传和点击上传
4. **文件下载** - 点击下载按钮直接下载文档

## 使用指南

### 1. 上传文档

1. 进入"文档管理"页面
2. 点击"上传文档"按钮
3. 选择 `.md`, `.markdown` 或 `.txt` 文件
4. 文件自动上传并保存到数据库

### 2. 编辑文档

1. 在文档列表中点击文档标题
2. 打开 Markdown 编辑器
3. 左侧编辑内容，右侧实时预览
4. 点击"保存"按钮保存修改

### 3. 下载文档

1. 在文档列表中找到要下载的文档
2. 点击下载图标
3. 文件自动下载到本地

### 4. 删除文档

1. 在文档列表中找到要删除的文档
2. 点击删除图标
3. 确认删除操作

## 文件存储

### 上传目录

文件存储在：`backend/src/uploads/`

### 文件命名规则

上传的文件会自动重命名，格式为：
```
原文件名_时间戳_随机字符.扩展名
```

例如：`README_1234567890_abc123.md`

### 文件大小限制

- 最大文件大小：5MB
- 允许的文件类型：`.md`, `.markdown`, `.txt`

## Markdown 编辑器功能

### 支持的 Markdown 语法

- ✅ 标题（H1-H6）
- ✅ 段落和换行
- ✅ 强调（粗体、斜体）
- ✅ 列表（有序、无序）
- ✅ 代码块（带语法高亮）
- ✅ 引用块
- ✅ 链接和图片
- ✅ 表格
- ✅ 分隔线

### 代码高亮

支持多种编程语言的语法高亮：
- JavaScript / TypeScript
- Python
- Java
- C / C++
- Go
- Rust
- HTML / CSS
- SQL
- Shell
- 等等...

## 开发说明

### 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd frontend
npm install
```

### 启动服务

```bash
# 后端
cd backend
npm run dev

# 前端
cd frontend
npm run dev
```

### 访问地址

- 前端：http://localhost:5173
- 后端：http://localhost:3000
- 文档管理：http://localhost:5173/documents

## 注意事项

1. **文件存储**：上传的文件存储在服务器本地，重启服务后文件依然存在
2. **数据库同步**：文件信息和内容同时保存到 SQLite 数据库
3. **团队协作**：可以将 `backend/src/uploads` 目录和数据库文件提交到 Git 仓库
4. **文件清理**：删除文档时会同时删除数据库记录和物理文件

## 未来扩展

可以考虑添加的功能：
- 📁 文件夹分类管理
- 🔍 文档搜索功能
- 📤 导出为 PDF / HTML
- 🔄 版本控制
- 👥 协作编辑
- 🎨 自定义主题
