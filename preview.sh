#!/usr/bin/env bash
# ==============================================================================
# note-garden 本地一键预览脚本 (Zero-Cache Local Static Server)
# 用法:
#   ./preview.sh           # 默认启动在 8080 端口并自动打开浏览器
#   ./preview.sh 3000      # 指定端口启动
# ==============================================================================
set -e

cd "$(dirname "$0")"
PORT="${1:-8080}"

echo "🌱 正在启动 note-garden 手账本地预览服务..."
echo "🔗 首页地址:  http://localhost:${PORT}/"
echo "🐬 MySQL手账: http://localhost:${PORT}/mysql/index.html"
echo "🤖 AI手账:    http://localhost:${PORT}/ai/index.html"
echo "💡 修改任何 sections/*.html 后直接刷新浏览器即可生效 (已禁用本地缓存)"
echo "----------------------------------------------------------------------"

# 延迟 0.6 秒自动在 macOS 默认浏览器打开
(sleep 0.6 && open "http://localhost:${PORT}/mysql/index.html" >/dev/null 2>&1 || true) &

python3 - "$PORT" << 'PYEOF'
import http.server
import socketserver
import sys

port = int(sys.argv[1])

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, format, *args):
        sys.stderr.write("  [HTTP] %s\n" % (format % args))

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", port), NoCacheHTTPRequestHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 已停止 note-garden 本地预览服务。")
PYEOF
