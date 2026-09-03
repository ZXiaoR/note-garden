# 🌱 note-garden

> 我的技术知识花园 —— 按自己的理解梳理，边学边修正，持续生长。

每个专题是一份**自包含的 HTML 笔记**（无需构建、无依赖，双击即可打开），风格统一：图解 + 对比表 + 弹窗例子 + 高频面试速记。

## 📚 专题目录

| 专题 | 状态 | 内容概览 |
|---|---|---|
| [🐬 MySQL](mysql/index.html) | ✅ 已完成 | 架构 · 存储结构(B+树/页/行格式) · 索引 · 事务 · MVCC · 锁 · 日志 · 主从复制 · 完整执行链路 |
| 🧱 Redis | 🚧 建设中 | 数据结构 · 持久化 · 过期淘汰 · 主从/哨兵/集群 · 缓存三大问题 |
| 🌐 浏览器 | 🚧 建设中 | 渲染流程 · 事件循环 · 跨域 · 缓存 · 性能优化 |

## 🖥️ 在线阅读

开启 GitHub Pages 后可直接在线看（含手机）：

- 首页：`https://<用户名>.github.io/note-garden/`
- MySQL：`https://<用户名>.github.io/note-garden/mysql/`

开启方式：仓库 **Settings → Pages → Source 选 `main` 分支 `/ (root)`**，保存即可。

## 🗂️ 目录结构

```
note-garden/
├── index.html        # 首页导航（专题卡片）
├── mysql/index.html  # MySQL 笔记
├── redis/index.html  # Redis（占位）
├── browser/index.html# 浏览器（占位）
└── assets/           # 预留：以后抽公共 CSS
```

## ✍️ 约定

- 新增专题：在根目录建 `<专题>/index.html`，并在首页 `index.html` 和本 README 加一张卡片/一行。
- 内容以「先讲我的理解，再逐步修正补全」为主，重图解、重面试串联。

---

🌿 由 MySQL 开始，慢慢种。
