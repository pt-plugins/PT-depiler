<p align="center">
  <img alt="Logo" width="100" src="./public/icons/logo/128.png?raw=true">
</p>

<p align="center">
    <a href="../../releases?include_prereleases/latest" title="GitHub Pre-releases"><img src="https://img.shields.io/github/release/pt-plugins/PT-depiler.svg?include_prereleases&label=pre-release"></a>
    <a href="../../releases" title="GitHub All Releases"><img alt="Releases" src="https://img.shields.io/github/downloads/pt-plugins/PT-depiler/total.svg?label=Downloads"></a>
    <img src="https://img.shields.io/badge/Used-TypeScript%20Vue-blue.svg">
    <a href="./LICENSE" title="GitHub license"><img src="https://img.shields.io/github/license/pt-plugins/PT-depiler.svg?label=License" alt="GitHub license"/></a>
    <a href="https://t.me/joinchat/NZ9NCxPKXyby8f35rn_QTw"><img src="https://img.shields.io/badge/Telegram-Chat-blue.svg?logo=telegram" alt="Telegram"/></a>
</p>

### 🚀 关于 Introduction

PT-depiler 是在原 [PT-Plugin-Plus](https://github.com/pt-plugins/PT-Plugin-Plus) 基础上，
基于浏览器最新的 [Manifest v3](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3) 标准开发的一款浏览器插件（Web Extensions），
一个可以提升 PT 站点使用效率的工具。

适用于各 PT 站，可使下载种子等各项操作变化更简单、快捷。配合下载服务器（如 Transmission、qBittorrent 等），可一键下载指定的种子。

### 🖥️ 功能 Features

- **多站点支持**：兼容 NexusPHP、Gazelle 等多种类型的 PT 站点，提供聚合搜索相同关键字的种子、批量下载等功能
- **下载器集成**：支持 qBittorrent、Transmission、Deluge、ruTorrent、Synology Download Station、Aria2 等多种下载器，并保存下载历史记录
- **备份服务器管理**：集成 WebDav、Gist、CookieCloud、Google Drive、DropBox 等备份服务，方便数据同步
- **智能搜索**：增强搜索功能，支持多站点同时搜索并合并结果
- **用户信息管理**：集中显示和管理各站点的用户信息和统计数据
- 更多功能请参考 [Wiki](../../wiki)

### 🔧 安装 Installation

1. 从各个浏览器的扩展商店安装

TODO

2. 从 Github Action 或者 Release 中获取并安装

TODO

3. 从源码构建

```bash
git clone https://github.com/pt-plugins/PT-depiler
cd PT-depiler
pnpm install
# pnpm dev
pnpm build:dist    # or pnpm build:dist-firefox
```

### 📝 改动说明 Changelog

PT-Depiler 并不是对 PT-Plugin-Plus 的简单移植，而是对其进行了全面的重构和改进，以获得更好的使用体验。

> 目前， PT-Depiler 仅支持**已适配站点**的PTPP历史用户数据迁移。
> 请勿将 [PT-Plugin-Plus](https://github.com/pt-plugins/PT-Plugin-Plus) 或者 [PT 助手](https://github.com/ronggang/PT-Plugin) 的配置文件直接导入 PT-Depiler。

更新记录请见： [CHANGELOG.md](./CHANGELOG.md)

### 💁‍♂️ 贡献 Contributors

✨ 欢迎 Star & 提 Issue，共同完善 PT-Depiler！ 有兴趣贡献的开发者请阅读[行为准则](./CODE_OF_CONDUCT.md)

> 请不要在 Issue 中提出一般性问题。Issue 仅用于报告错误、提出改进建议或请求新功能。

我们还有一个 [help wanted](https://github.com/pt-plugins/PT-depiler/labels/help%20wanted) 的问题列表，您可能会感兴趣。

### 📝 许可证 License

PT-Depiler 是一个开源项目，遵循 [MIT 许可证](http://opensource.org/licenses/MIT)

Copyright (c) 2020-present [pt-plugins](https://github.com/pt-plugins)

--------------

特别感谢以下所有为本项目做出贡献的人 😍！

![Contributors](https://opencollective.com/pt-depiler/contributors.svg?width=890&button=false)
