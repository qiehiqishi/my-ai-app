# AI 辅助开发平台

一个用于管理 Skills、提示词和 Markdown 文档的 AI 辅助开发平台。

## 🎯 项目特点

- ✅ **Skills 管理** - 创建、编辑、删除 Skills
- ✅ **提示词管理** - 管理和复用提示词模板
- ✅ **Markdown 文档管理** - 上传、编辑、预览、下载 Markdown 文档
- ✅ **实时预览** - Markdown 编辑器支持实时预览和代码高亮
- ✅ **Serverless 架构** - 基于 Vercel 的 Serverless 架构
- ✅ **免费部署** - 使用 Vercel 免费套餐部署

## 📂 项目结构

```
my-ai-app/
├── api/                    # Vercel Serverless Functions (后端)
│   ├── lib/
│   │   ├── db.ts          # 数据库操作 (Vercel KV)
│   │   └── storage.ts     # 文件存储 (Vercel Blob)
│   ├── skills.ts          # Skills API
│   ├── prompts.ts         # Prompts API
│   └── documents/         # Documents API
├── frontend/              # 前端项目 (Vue3 + TypeScript + Vant)
│   ├── src/
│   │   ├── views/         # 页面组件
│   │   ├── components/    # 通用组件
│   │   ├── router/        # 路由配置
│   │   └── store/         # Vuex 状态管理
│   └── package.json
├── vercel.json            # Vercel 配置
└── package.json           # 根项目配置
```

## 🛠️ 技术栈

### 前端
- **Vue 3** + TypeScript
- **Vue Router 4** - 路由管理
- **Vuex 4** - 状态管理
- **Vant UI** - 移动端 UI 组件库
- **Markdown-it** - Markdown 解析器
- **Highlight.js** - 代码高亮
- **Vite** - 构建工具

### 后端 (Serverless)
- **Vercel Serverless Functions** - API 接口
- **Vercel KV** - 数据库存储
- **Vercel Blob** - 文件存储

## 🚀 快速开始

### 方式一：本地开发（推荐）

```bash
# 1. 安装依赖
npm install

# 2. 安装 Vercel CLI
npm i -g vercel

# 3. 登录 Vercel
vercel login

# 4. 本地开发（模拟 Vercel 环境）
vercel dev
```

访问：`http://localhost:3000`

### 方式二：传统开发

```bash
# 前端开发
cd frontend
npm install
npm run dev

# 后端需要部署到 Vercel 后才能测试
```

## 📦 部署到 Vercel

### 第 1 步：准备环境

确保已安装 Vercel CLI：
```bash
npm i -g vercel
```

### 第 2 步：部署

```bash
# 部署到生产环境
vercel --prod
```

### 第 3 步：配置存储服务

在 Vercel Dashboard 中：

1. **添加 KV 数据库**
   - 进入项目 → Storage → Create Database → KV
   - 获取环境变量：`KV_REST_API_URL`、`KV_REST_API_TOKEN`

2. **添加 Blob 存储**
   - 进入项目 → Storage → Create Blob Store
   - 获取环境变量：`BLOB_READ_WRITE_TOKEN`

### 第 4 步：重新部署

配置环境变量后，重新部署：
```bash
vercel --prod
```

详细部署指南：[VERCEL部署指南.md](./VERCEL部署指南.md)

## 📊 免费额度

### Vercel KV（数据库）
- 存储空间：30 MB
- 命令限制：10,000 次/天

### Vercel Blob（文件存储）
- 存储空间：2 GB
- 带宽限制：100 GB/月

### Vercel Serverless Functions
- 执行时间：10 秒
- 调用次数：无限制

## 📝 API 文档

所有 API 路径都以 `/api` 开头：

### Skills API
- `GET /api/skills` - 获取所有 Skills
- `POST /api/skills` - 创建新 Skill
- `GET /api/skills/:id` - 获取单个 Skill
- `PUT /api/skills/:id` - 更新 Skill
- `DELETE /api/skills/:id` - 删除 Skill

### Prompts API
- `GET /api/prompts` - 获取所有提示词
- `POST /api/prompts` - 创建新提示词
- `GET /api/prompts/:id` - 获取单个提示词
- `PUT /api/prompts/:id` - 更新提示词
- `DELETE /api/prompts/:id` - 删除提示词

### Documents API
- `GET /api/documents` - 获取所有文档
- `POST /api/documents/upload` - 上传文档
- `GET /api/documents/download/:id` - 下载文档
- `GET /api/documents/:id` - 获取单个文档
- `PUT /api/documents/:id` - 更新文档
- `DELETE /api/documents/:id` - 删除文档

## 🔧 环境配置

在 Vercel 项目设置中添加以下环境变量：

```env
# Vercel KV 数据库
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token

# Vercel Blob 存储
BLOB_READ_WRITE_TOKEN=your_blob_token
```

## 📚 相关文档

- [Vercel 部署指南](./VERCEL部署指南.md)
- [Markdown 功能说明](./MARKDOWN功能说明.md)
- [Vercel 部署方案](./VERCEL部署方案.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
