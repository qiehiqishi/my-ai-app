# AI 辅助开发平台

一个用于管理 Skills 和提示词的 AI 辅助开发平台。

## 项目结构

```
my-ai-app/
├── frontend/          # 前端项目 (Vue3 + TypeScript + Vant)
│   ├── src/
│   │   ├── views/     # 页面组件
│   │   ├── components/# 通用组件
│   │   ├── router/    # 路由配置
│   │   ├── store/     # Vuex 状态管理
│   │   ├── api/       # API 接口
│   │   ├── utils/     # 工具函数
│   │   └── assets/    # 静态资源
│   └── package.json
├── backend/           # 后端项目 (Koa + SQLite)
│   ├── src/
│   │   ├── routes/    # API 路由
│   │   ├── models/    # 数据模型
│   │   ├── middleware/# 中间件
│   │   ├── database/  # 数据库配置
│   │   └── utils/     # 工具函数
│   └── package.json
└── package.json       # 根项目配置
```

## 技术栈

### 前端
- Vue 3 + TypeScript
- Vue Router 4
- Vuex 4
- Axios
- Vant UI
- Vite

### 后端
- Koa 2
- better-sqlite3 (SQLite)
- TypeScript

## 快速开始

### 安装依赖

```bash
npm run install:all
```

### 开发模式

```bash
# 同时启动前后端
npm run dev

# 或者分别启动
npm run dev:frontend  # 前端: http://localhost:5173
npm run dev:backend   # 后端: http://localhost:3000
```

### 构建生产版本

```bash
npm run build
```

## 功能特性

- ✅ Skills 管理
- ✅ 提示词管理
- ✅ 项目配置管理
- ✅ 本地数据持久化
- ✅ 前后端分离架构

## 开发指南

### 前端开发

```bash
cd frontend
npm run dev
```

### 后端开发

```bash
cd backend
npm run dev
```

## API 文档

后端 API 运行在 `http://localhost:3000`

- `GET /api/skills` - 获取所有 Skills
- `POST /api/skills` - 创建新 Skill
- `PUT /api/skills/:id` - 更新 Skill
- `DELETE /api/skills/:id` - 删除 Skill
- `GET /api/prompts` - 获取所有提示词
- `POST /api/prompts` - 创建新提示词

## 环境配置

创建 `.env` 文件配置环境变量：

```env
# 后端配置
PORT=3000
DB_PATH=./data/database.sqlite

# 前端配置
VITE_API_BASE_URL=http://localhost:3000
```
