# 🌱 note-garden

> 我的技术知识花园 —— 按自己的理解梳理，边学边修正，持续生长。

每个专题以 `<专题>/index.html` 为唯一入口，静态 HTML 自包含，直接双击或通过 [GitHub Pages](https://zxiaor.github.io/note-garden/) 在线阅读。

## 📚 专题目录

| 专题 | 状态 | 内容概览 |
|---|---|---|
| [🧠 Gemini 4 Carbon 开发者指南](ai/index.html) | ✅ 已完成 | Carbon vs Argon 选型 · 1M 统一窗口超长解码 · Interactions API 变更 · 长程基线验证闭环与 `/swarm` 多智能体 |
| [🌙 Anthropic Agent 记忆架构](ai/memory.html) | ✅ 已完成 | 极小常驻目录 · Wiki 双链真值库 · RRF 混合检索 · 离线做梦 (Dreaming) 整理 · 91.3 万次会话分心税 |
| [🧩 Agent 上下文工程与记忆架构](ai/context-memory.html) | ✅ 已完成 | RAM vs Disk 边界 · 上下文腐烂 4 类故障 · 7 层 KV Cache 友好上下文栈 · 双水位线与 4 级超限兜底 · SQL/Vector 双轨异步记忆与推理底座协同 |
| [🎯 Qdrant 向量数据库与 RAG 检索实战](ai/qdrant.html) | ✅ 已完成 | Point 多命名向量与 Payload 模型 · Filterable HNSW 子图连边 · Prefetch + RRF 混合检索与量化 · 结构感知切片 · 跨语言 CJK N-gram 确定性稀疏编码 · 两阶段精排漏斗与 30 题黄金评测集 |
| [🤖 Coding Agent (pi)](pi-agent/index.html) / [🧭 源码与架构全解](pi-agent/guide.html) | ✅ 已完成 | 12 子包与双层循环状态机 · 工具三道防线与 QuickJS 沙箱 · 6 步安全切分压缩与 4 级模型工具追加 · 流式 rg 与 BM25 · 容器化盲测 · Runtime / Framework / Harness 四层权衡 |
| [🐬 MySQL · 基础与实战篇](mysql/index.html) / [📘 原理篇](mysql/principles.html) | ✅ 已完成 | 四平台安装与连接池 · utf8mb4/DECIMAL/JSON生成列 · 幂等写入/窗口函数/递归CTE · 防超卖与EXPLAIN调优 · 16KB页与行溢出 · 冷热LRU与Change Buffer · B+树扇出推导 · ReadView可见性 · Next-Key Lock退化 · 两阶段提交与Doublewrite |
| [🐘 PostgreSQL · 基础与实战篇](postgres/index.html) / [📘 原理篇](postgres/principles.html) | ✅ 已完成 | 四级目录与权限 · JSONB/数组/范围 · UPSERT/LATERAL/窗口函数/递归CTE · 8KB 页与 TOAST · 23B 元组头 MVCC 与 SSI · Lehman-Yao B-tree/GIN/BRIN · HOT 与 VACUUM FREEZE |
| [🧱 Redis · 基础与实战篇](redis/index.html) / [📘 原理篇](redis/principles.html) | ✅ 已完成 | 全景定位与选型边界 · Docker 快速上手与双语言连接 · 5+3 类型(JS类比/避坑) · Cache-Aside 双写时序与三大异常 · 登录态/限流三演进/排行榜/延迟关单/分布式锁/Stream 九大实战 · 持久化淘汰与集群跨槽 · 上线必知与 10 题自测 · 常问/深挖分级内核原理 |
| [🐹 Go · 基础与实战篇](go/index.html) / [📘 原理篇](go/principles.html) | ✅ 已完成 | 基础语法/包管理 · 协程与 GMP 调度 · channel · 锁与同步 · GC(三色标记/写屏障/逃逸分析) · context/泛型/性能优化 |
| [🟢 Node.js · 基础与实战篇](node/index.html) / [📘 原理篇](node/principles.html) | ✅ 已完成 | CJS vs ESM · libuv 事件循环六阶段 · Buffer 8KB 内存池与 Stream 背压 · V8 隐藏类与分代 GC · Cluster 与 worker_threads |
| [🌱 操作系统 · 基础入门篇](os/index.html) | ✅ 已完成 | 指令/变量/地址 · 程序运行与等待 · 进程线程 · 内存 · 多任务协作 · Linux 终端与文件操作 |
| [🖥️ 操作系统 · 原理篇](os/principles.html) | ✅ 已完成 | 系统调用 · 进程切换与写时复制 · 页表与分配器 · 进程间通信 · 锁与调度 · 文件系统/epoll/零拷贝 · 性能排查 |
| [📨 消息队列 · 基础与实战篇](mq/index.html) / [📘 原理篇](mq/principles.html) | ✅ 已完成 | 全景定位与选型边界 · 六大概念与消费组模型 · Docker KRaft 与 Go/Node 跑通 · 七大业务场景(发券/削峰/日志/同步/本地消息表/延迟/死信) · 三段防丢与三类幂等 · 局部保序与积压排障 · 上线必知与 10 题自测 · 零拷贝/时间轮/ISR/Leader Epoch 内核原理 |
| [🌐 浏览器 · 基础与实战篇](browser/index.html) / [📘 原理篇](browser/principles.html) | ✅ 已完成 | 多进程与站点隔离 · DNS/TLS 1.3/HTTP3 · 强/协商缓存状态机 · HTML状态机与CSSOM · Blink六阶段渲染 · 事件循环一帧 · CORS/XSS/CSRF/CWV |
| [🛡️ 服务端稳定性七件套与上线防线](backend/reliability.html) | ✅ 已完成 | 分阶段超时与 IdleReader · 单层重试与预算控制 · 熔断过滤与降级 · Redis Lua 令牌桶 · Expand-Contract 双写迁移与 SSE 排水 · 租户隔离与防 SSRF |
| [📹 音视频与 WebRTC · 基础与实战篇](webrtc/index.html) / [📘 原理篇](webrtc/principles.html) | ✅ 已完成 | 五步通话全景地图与初体验 · 媒体标签与流媒体选型 · 设备轨道热切换 · WebSocket 信令与 DataChannel · Vue 3 封装与 AI 实时语音 · Opus/YUV/GOP 推导 · SDP 与对称型 NAT 穿透 · 弱网 QoS 闭环与 SFU 大小流 |

---

🌿 由 MySQL 开始，慢慢种。
