# 🌱 note-garden

> 我的技术知识花园 —— 按自己的理解梳理，边学边修正，持续生长。

每个专题是一份**自包含的 HTML 笔记**（无需构建、无依赖，双击即可打开），风格统一：图解 + 对比表 + 弹窗例子 + 高频面试速记。

## 📚 专题目录

| 专题 | 状态 | 内容概览 |
|---|---|---|
| [🐬 MySQL](mysql/index.html) | ✅ 已完成 | 架构 · 存储结构(B+树/页/行格式) · 索引 · 事务 · MVCC · 锁 · 日志 · 主从复制 · 完整执行链路 |
| [🧱 Redis](redis/index.html) | ✅ 已完成 | 为什么快/单线程 · 数据结构(编码/阈值) · 缓存三大问题 · 持久化(RDB/AOF) · 过期淘汰 · 主从/哨兵/集群 · 分布式锁 |
| [🐹 Go](go/index.html) | ✅ 已完成 | 基础语法(slice/map/defer/interface) · 包管理(Go Modules/项目实战) · 为什么引入协程 · GMP 调度 · channel · 锁与同步 · GC(三色标记/写屏障/逃逸分析) · context/泛型/数据竞争/测试/性能优化 |
| [🖥️ 操作系统](os/index.html) | ✅ 已完成 | 用户态/内核态 · 系统调用/中断 · 进程线程/上下文切换 · fork/COW · 存储层次(L1/L2/L3/内存/磁盘) · 虚拟内存(分页/多级页表/TLB/缺页置换) · IPC · 并发同步/死锁 · CPU 调度(CFS) · 文件系统/inode/fd · Page Cache/刷盘 · I/O 模型/epoll/Reactor/零拷贝 · 性能排查(load/top/vmstat)（侧重 Linux） |
| [📨 消息队列](mq/index.html) | ✅ 已完成 | 为什么用(解耦/异步/削峰) · 队列/发布订阅模型 · Topic/分区/Offset/消费者组 · 三大主流对比 · 不丢/不重(幂等)/有序/堆积/延迟/事务消息/死信 · 推拉模型 · Kafka 为什么快(顺序写/页缓存/零拷贝) · 存储结构 · ISR/HW/LEO 副本 · Rebalance · RocketMQ CommitLog · RabbitMQ 路由 |
| [🤖 Coding Agent (pi)](pi-agent/index.html) | ✅ 已完成 | 从输入指令到沙箱落盘的 12 站全链路源码图谱 · 会话树与 Compaction 防爆 · KV Cache 前缀保护 · Code Mode 工具压缩 · 流式 JSON 残片解析 · BeforeToolCall 安检与 QuickJS Wasm 256MB 沙箱 · Steering 实时打断 |
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
├── redis/index.html  # Redis（已完成）
├── go/index.html     # Go（已完成）
├── os/index.html     # 操作系统（已完成，侧重 Linux）
├── mq/index.html     # 消息队列（已完成，Kafka/RocketMQ/RabbitMQ）
├── pi-agent/index.html # Coding Agent (pi) 12站全链路源码图谱
├── browser/index.html# 浏览器（占位）
└── assets/           # 预留：以后抽公共 CSS
```

## ✍️ 约定

- 新增专题：在根目录建 `<专题>/index.html`，并在首页 `index.html` 和本 README 加一张卡片/一行。
- 内容以「先讲我的理解，再逐步修正补全」为主，重图解、重面试串联。

---

🌿 由 MySQL 开始，慢慢种。
