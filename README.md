# 🌱 note-garden

> 我的技术知识花园 —— 按自己的理解梳理，边学边修正，持续生长。

每个专题以 `<专题>/index.html` 为唯一入口，使用静态 HTML，无需构建。内容包含图解、对比、交互例子与源码导读。

页面可直接双击打开。Pi 导读两篇页面的 CSS 与交互脚本均内联在 HTML 中，可离线阅读与单步模拟。

## 📚 专题目录

| 专题 | 状态 | 内容概览 |
|---|---|---|
| [🐬 MySQL](mysql/index.html) | ✅ 已完成 | 架构 · 存储结构(B+树/页/行格式) · 索引 · 事务 · MVCC · 锁 · 日志 · 主从复制 · 完整执行链路 |
| [🐘 PostgreSQL](postgres/index.html) | ✅ 已完成 | 进程架构 · 数据类型与 SQL · MVCC · 锁 · 索引 · EXPLAIN · VACUUM 与表膨胀 |
| [🧱 Redis](redis/index.html) | ✅ 已完成 | 为什么快/单线程 · 数据结构(编码/阈值) · 缓存三大问题 · 持久化(RDB/AOF) · 过期淘汰 · 主从/哨兵/集群 · 分布式锁 |
| [🐹 Go](go/index.html) | ✅ 已完成 | 基础语法(slice/map/defer/interface) · 包管理(Go Modules/项目实战) · 为什么引入协程 · GMP 调度 · channel · 锁与同步 · GC(三色标记/写屏障/逃逸分析) · context/泛型/数据竞争/测试/性能优化 |
| [🖥️ 操作系统](os/index.html) | ✅ 已完成 | 用户态/内核态 · 系统调用/中断 · 进程线程/上下文切换 · fork/COW · 存储层次(L1/L2/L3/内存/磁盘) · 虚拟内存(分页/多级页表/TLB/缺页置换) · IPC · 并发同步/死锁 · CPU 调度(CFS) · 文件系统/inode/fd · Page Cache/刷盘 · I/O 模型/epoll/Reactor/零拷贝 · 性能排查(load/top/vmstat)（侧重 Linux） |
| [📨 消息队列](mq/index.html) | ✅ 已完成 | 为什么用(解耦/异步/削峰) · 队列/发布订阅模型 · Topic/分区/Offset/消费者组 · 三大主流对比 · 不丢/不重(幂等)/有序/堆积/延迟/事务消息/死信 · 推拉模型 · Kafka 为什么快(顺序写/页缓存/零拷贝) · 存储结构 · ISR/HW/LEO 副本 · Rebalance · RocketMQ CommitLog · RabbitMQ 路由 |
| [🤖 Coding Agent (pi)](pi-agent/index.html) | ✅ 已完成 | 架构和源码入口 · 12 站机制链路图与源码永久链接 · 单步与变量面板 · 会话分支 · 项目指令与 Skills · MCP 工具暴露 · 可选模型路由与审批扩展 · codemode · 运行中补充指令 · 按 Token 水位压缩 |
| [🌐 浏览器](browser/index.html) | 🚧 建设中 | 渲染流程 · 事件循环 · 跨域 · 缓存 · 性能优化 |

## 🖥️ 在线阅读

开启 GitHub Pages 后可直接在线看（含手机）：

- 首页：[note-garden](https://zxiaor.github.io/note-garden/)
- Pi 导读：[Coding Agent (pi)](https://zxiaor.github.io/note-garden/pi-agent/)
- 其他专题：从首页进入对应目录。

开启方式：仓库 **Settings → Pages → Source 选 `main` 分支 `/ (root)`**，保存即可。

## 🗂️ 目录结构

```
note-garden/
├── index.html        # 首页导航（专题卡片）
├── mysql/index.html  # MySQL 笔记
├── postgres/index.html # PostgreSQL 笔记
├── redis/index.html  # Redis（已完成）
├── go/index.html     # Go（已完成）
├── os/index.html     # 操作系统（已完成，侧重 Linux）
├── mq/index.html     # 消息队列（已完成，Kafka/RocketMQ/RabbitMQ）
├── pi-agent/index.html # Coding Agent (pi) 12 个机制与源码导读
├── browser/index.html# 浏览器（占位）
├── assets/           # 预留：以后抽公共 CSS
└── temp/             # 本地临时资料，已由 .gitignore 排除
```

## ✍️ 约定

- 新增专题：在根目录建 `<专题>/index.html`，并在首页 `index.html` 和本 README 加一张卡片/一行。
- 更新已有专题：直接修改该专题的 `index.html`；首页和 README 的简介有变化时同步更新。
- 同一专题不在根目录另存完整 HTML 副本，避免编辑页与网站入口不一致。
- 临时资料放 `temp/`；备份保存在仓库外或通过 Git 历史保留，避免进入站点目录。
- 内容以「先讲我的理解，再逐步修正补全」为主，重图解、重面试串联。

---

🌿 由 MySQL 开始，慢慢种。

## Pi 源码导读维护

`pi-agent/` 只保留 `index.html` 和 `basics.html` 两篇文章。源码导读 `index.html` 的样式、数据和交互全部内联，直接双击打开；修改 HTML 即可，无需安装依赖、构建或打包。

源码链接固定到 Pi commit `62752fd4c37a`，最新版另有入口。更新讲解版本时，对照仓库原文核对代码节选和行号。页面单步为教学模拟，真实变量请按「架构和源码入口」里的步骤在本地调试。
