# 下载器配置 (Download Client Configuration)

PT-depiler 支持多种下载客户端，可以实现一键推送种子到下载器。

## 🎯 支持的下载器

- **Aria2**
- **Deluge**
- **Flood**
- **Transmission**
- **qBittorrent**
- **ruTorrent**
- **synologyDownloadStation**
- **uTorrent**

## ⚙️ 通用配置步骤

1. 在 PT-depiler 选项页面中，进入"设置" → "下载器"
2. 点击"添加"按钮
3. 选择您使用的下载器类型
4. 填写下载器的连接信息

## 🔧 配置说明

每个下载器通常需要配置：
- **名称**: 自定义名称
- **地址**: 下载器 WebUI 或 RPC 地址
- **用户名/密码**: 认证信息

## ❓ 常见问题

**Q: 连接测试失败？**
A: 请检查地址、用户名密码是否正确，以及 WebUI/RPC 服务是否已启用。
