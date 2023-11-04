本AI及文档来自 github@NB-Group
# AI Copilot 后端介绍
## 介绍
AI Copilot 是一个基于 AI 的文本生成工具，其基于 LLAMA 模型，可以生成文本。
本 AI 部署在 Cloudflare 平台提供的 Worker AI 服务上，其接受来自前端页面的请求，并返回生成文本。

但 Cloudflare 部署的 AI 服务，目前会被限制，无法直接访问，因此，需要使用VPN才能访问。
我在一台外网(港)服务器上部署了一个转发程序，将请求转发到 Cloudflare 上。

Cloudflare AI 服务器 具体的代码可以在 [这里](Cloudflare%20AI.js) 查看
