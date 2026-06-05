# 数据库使用说明

## SQLite 数据库文件

本项目使用 SQLite 作为数据库，数据库文件位于：
```
backend/data/database.sqlite
```

## 团队数据共享

### ✅ 数据库文件已纳入版本控制

SQLite 数据库是一个单独的文件，可以直接提交到 Git 仓库，实现团队数据共享。

### 工作流程

1. **初始化数据**
   - 首次运行后端服务会自动创建数据库和表结构
   - 可以预先添加一些初始数据（示例 Skills 和 Prompts）

2. **提交数据**
   ```bash
   git add backend/data/database.sqlite
   git commit -m "添加初始数据库"
   git push
   ```

3. **团队同步**
   - 其他成员拉取代码后，直接获得相同的数据库
   - 无需额外配置或安装数据库服务器

### 注意事项

#### ⚠️ 并发写入冲突

SQLite 适合低并发场景。如果多人同时修改数据：
- **方案 1**: 使用 Git 协调（提交前先拉取最新数据）
- **方案 2**: 定期备份数据库文件

#### 💡 最佳实践

1. **初始数据准备**
   - 创建一些示例 Skills 和 Prompts
   - 提交到仓库作为团队共享数据

2. **数据备份**
   ```bash
   # 备份数据库
   cp backend/data/database.sqlite backend/data/database.backup.sqlite
   ```

3. **数据迁移**
   - 如果需要导出数据，可以直接复制 `.sqlite` 文件
   - 在其他机器上直接使用，无需导入操作

### 数据库管理工具

推荐使用以下工具查看和编辑 SQLite 数据：
- **DB Browser for SQLite** (免费、跨平台)
- **DBeaver** (免费、功能强大)
- **VS Code 插件**: SQLite Viewer

### 数据库文件信息

- **位置**: `backend/data/database.sqlite`
- **类型**: SQLite 3 数据库
- **大小**: 根据数据量动态增长
- **编码**: UTF-8
- **跨平台**: Windows/Mac/Linux 通用
