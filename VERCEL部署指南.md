# Vercel 部署指南

## ✅ 改造完成

项目已成功改造为 Vercel Serverless 架构！

### 📋 改造内容

#### 1. **数据库改造**
- ❌ 移除 SQLite（不支持 Serverless）
- ✅ 使用 **Vercel KV**（免费额度：30MB 存储，10K 命令/天）

#### 2. **文件存储改造**
- ❌ 移除本地文件系统（临时存储）
- ✅ 使用 **Vercel Blob**（免费额度：2GB 存储，100GB 带宽/月）

#### 3. **后端改造**
- ❌ 移除 Koa 服务器
- ✅ 转换为 **Vercel Serverless Functions**

#### 4. **前端改造**
- ✅ 修改文件上传逻辑（Base64 编码）
- ✅ 保持原有功能不变

### 📂 新的项目结构

```
d:\web\my-app\my-ai-app\
├── api/                          ← Vercel Serverless Functions
│   ├── lib/
│   │   ├── db.ts                ← 数据库操作（Vercel KV）
│   │   └── storage.ts           ← 文件存储（Vercel Blob）
│   ├── skills.ts                ← GET/POST /api/skills
│   ├── skills/[id].ts           ← GET/PUT/DELETE /api/skills/:id
│   ├── prompts.ts               ← GET/POST /api/prompts
│   ├── prompts/[id].ts          ← GET/PUT/DELETE /api/prompts/:id
│   ├── documents.ts             ← GET /api/documents
│   ├── documents/upload.ts      ← POST /api/documents/upload
│   ├── documents/download/[id].ts ← GET /api/documents/download/:id
│   └── documents/[id].ts        ← GET/PUT/DELETE /api/documents/:id
├── frontend/                     ← Vue 前端代码
├── vercel.json                   ← Vercel 配置
└── package.json                  ← 依赖管理
```

## 🚀 部署步骤

### 第 1 步：安装依赖

```bash
cd d:\web\my-app\my-ai-app
npm install
```

### 第 2 步：在 Vercel 创建项目

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 导入你的 Git 仓库
4. 或者使用 CLI：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel
```

### 第 3 步：配置环境变量

在 Vercel 项目设置中添加以下环境变量：

#### **Vercel KV（数据库）**
1. 在项目中添加 Storage → KV
2. 获取环境变量：
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

#### **Vercel Blob（文件存储）**
1. 在项目中添加 Storage → Blob
2. 获取环境变量：
   - `BLOB_READ_WRITE_TOKEN`

### 第 4 步：部署

```bash
# 部署到生产环境
vercel --prod

# 或者在 Vercel Dashboard 中点击 Deploy
```

## 📊 免费额度说明

### Vercel KV（数据库）
- **存储空间**：30 MB
- **命令限制**：10,000 次/天
- **适合场景**：小型项目、开发测试

### Vercel Blob（文件存储）
- **存储空间**：2 GB
- **带宽限制**：100 GB/月
- **适合场景**：Markdown 文档、图片存储

### Vercel Serverless Functions
- **执行时间**：10 秒（Hobby 套餐）
- **调用次数**：无限制
- **适合场景**：API 接口

## 🔧 本地开发

### 使用 Vercel CLI 本地开发

```bash
# 安装依赖
npm install

# 本地开发（模拟 Vercel 环境）
vercel dev
```

访问：`http://localhost:3000`

### 传统开发方式

```bash
# 前端开发
cd frontend
npm run dev

# 后端需要部署到 Vercel 后才能测试
```

## 📝 注意事项

### 1. 数据迁移
**重要**：原有的 SQLite 数据不会自动迁移到 Vercel KV

**解决方案**：
- 手动导出数据为 JSON
- 通过 API 重新导入
- 或使用 Vercel KV 的导入功能

### 2. 文件迁移
**重要**：原有的本地文件不会自动迁移到 Vercel Blob

**解决方案**：
- 手动上传文件到 Vercel Blob
- 或通过前端重新上传

### 3. API 路径
所有 API 路径保持不变：
- `/api/skills`
- `/api/prompts`
- `/api/documents`

### 4. CORS 配置
所有 API 已配置 CORS，支持跨域访问

## 🎯 功能对比

| 功能 | 原架构（本地） | 新架构（Vercel） |
|------|---------------|-----------------|
| 数据库 | SQLite | Vercel KV |
| 文件存储 | 本地文件系统 | Vercel Blob |
| 后端服务 | Koa 服务器 | Serverless Functions |
| 部署方式 | 手动部署 | 自动部署 |
| 扩展性 | 单机 | 自动扩展 |
| 费用 | 免费 | 免费（有额度限制） |

## 🔍 故障排查

### 问题 1：KV 连接失败
```
Error: KV_REST_API_URL is not defined
```
**解决**：在 Vercel 项目设置中添加 KV 环境变量

### 问题 2：Blob 上传失败
```
Error: BLOB_READ_WRITE_TOKEN is not defined
```
**解决**：在 Vercel 项目设置中添加 Blob 环境变量

### 问题 3：API 404 错误
```
Error: 404 Not Found
```
**解决**：检查 `api/` 目录结构是否正确

## 📚 相关文档

- [Vercel KV 文档](https://vercel.com/docs/storage/vercel-kv)
- [Vercel Blob 文档](https://vercel.com/docs/storage/vercel-blob)
- [Serverless Functions 文档](https://vercel.com/docs/functions/serverless-functions)

## 🎉 部署成功后

部署成功后，你将获得：
- ✅ 自动部署的 URL（`https://your-app.vercel.app`）
- ✅ 自动 HTTPS 证书
- ✅ 全球 CDN 加速
- ✅ 自动扩展能力
- ✅ 完整的功能支持

享受你的 Serverless 应用吧！🚀
