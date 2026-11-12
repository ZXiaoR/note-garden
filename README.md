# 🌱 note-garden

> 我的技术知识花园 —— 按自己的理解梳理，边学边修正，持续生长。

每个专题以 `<专题>/index.html` 为唯一入口，静态 HTML 自包含，直接双击或通过 [GitHub Pages](https://zxiaor.github.io/note-garden/) 在线阅读。

## 📚 专题目录

| 专题 | 状态 | 内容概览 |
|---|---|---|
| [🧠 Gemini 4 Carbon 开发者指南](ai/index.html) | ✅ 已完成 | Carbon vs Argon 选型 · 1M 统一窗口超长解码 · Interactions API 变更 · 长程基线验证闭环与 `/swarm` 多智能体 |
| [🌙 Anthropic Agent 记忆架构](ai/memory.html) | ✅ 已完成 | 极小常驻目录 · Wiki 双链真值库 · RRF 混合检索 · 离线做梦 (Dreaming) 整理 · 91.3 万次会话分心税 |
| [🤖 Coding Agent (pi)](pi-agent/index.html) | ✅ 已完成 | 12 站机制链路图与源码导读 · 单步交互模拟 · 会话树 · Skills 与 MCP · 运行中补充指令 · 上下文水位压缩 |
| [🐬 MySQL](mysql/index.html) | ✅ 已完成 | 架构 · 存储结构(B+树/页/行格式) · 索引 · 事务 · MVCC · 锁 · 日志(redo/undo/binlog) · 主从复制 |
| [🐘 PostgreSQL](postgres/index.html) | ✅ 已完成 | 进程架构 · 数据类型与 SQL · MVCC · 锁 · 索引(GIN/BRIN) · EXPLAIN · VACUUM 与表膨胀 |
| [🧱 Redis](redis/index.html) | ✅ 已完成 | 为什么快/单线程 · 数据结构(底层编码/阈值) · 缓存三大问题 · 持久化(RDB/AOF) · 过期淘汰 · 主从/哨兵/集群 · 分布式锁 |
| [🐹 Go](go/index.html) | ✅ 已完成 | 基础语法/包管理 · 协程与 GMP 调度 · channel · 锁与同步 · GC(三色标记/写屏障/逃逸分析) · context/泛型/性能优化 |
| [🌱 操作系统 · 基础入门篇](os/index.html) | ✅ 已完成 | 指令/变量/地址 · 程序运行与等待 · 进程线程 · 内存 · 多任务协作 · Linux 终端与文件操作 |
| [🖥️ 操作系统 · 原理篇](os/principles.html) | ✅ 已完成 | 系统调用 · 进程切换与写时复制 · 页表与分配器 · 进程间通信 · 锁与调度 · 文件系统/epoll/零拷贝 · 性能排查 |
| [📨 消息队列](mq/index.html) | ✅ 已完成 | 解耦/异步/削峰 · 核心模型 · Kafka / RocketMQ / RabbitMQ 对比 · 不丢/不重/有序/堆积 · 顺序写/页缓存/零拷贝/ISR |
| [🌐 浏览器](browser/index.html) | 🚧 建设中 | 渲染流程 · 事件循环 · 跨域 · 缓存 · 性能优化 |

---

🌿 由 MySQL 开始，慢慢种。
