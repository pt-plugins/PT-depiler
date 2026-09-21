# PT-depiler Privacy Policy / 隐私权保护政策

**Last updated / 最后更新：2026-09-21**

> **English** · [中文](#中文版)

---

## English Version

### 1. Overview

PT-depiler ("the Extension", "we", "us") is a browser extension that enhances the usability of
Private Tracker (PT) sites you already have an account on. It provides multi-site torrent search,
torrent management, download-history tracking, user-information display, media-server integration,
and optional backup of your own configuration.

This Privacy Policy explains **what data the Extension handles, how it is collected, how it is used,
where it is stored, with whom it is shared, and how you can control or delete it**. It applies to
the Extension only, and not to any third-party website you visit.

**In short:** the Extension has **no backend server of its own and no analytics or telemetry**. Your
data stays in your own browser unless **you** explicitly configure a backup destination.

### 2. Data We Handle

#### 2.1 Data stored locally by default

The Extension stores the following in your browser's own storage
(`chrome.storage.local` / IndexedDB), on your device only:

| Category | Examples | Purpose |
| --- | --- | --- |
| Configuration | Extension settings, language, theme, UI preferences | Remember your preferences |
| Site configuration | Sites you added, site URLs, per-site search/layout options, timeouts | Know which sites to work with |
| Search solutions & snapshots | Saved search plans, search-result snapshots | Reuse your search setup |
| User information | Username, user ID, level, join time, upload/download traffic, ratio, seeding size, bonus points, invite and message counts, H&R status | Display your PT account statistics |
| Download history | Torrent names, sizes, timestamps, target downloader/folder | Show and manage download records |
| Keep-upload (cross-seed) tasks | Site, torrent title, detail-page link, download link, size, seeder/leecher counts, target downloader and save path | Resume and track seeding tasks |
| Downloader / media-server config | Host, port, username, password or API key, save paths | Connect to your own downloader or media server |
| Native bridge state | Instance ID, enabled flag | Coordinate with the optional local CLI |

#### 2.2 Cookies

When you search or refresh user information, the Extension reads the cookies for the PT sites you
have configured, so that your **existing logged-in session** can be used for requests. Cookie access
is performed through the browser's cookie API and is limited to the sites you configured.

If you enable cookie backup/restore, cookies are included in the backup described in section 2.3.
The Extension does not use cookies for advertising or tracking, and does not send them anywhere
except to the PT site they belong to (and to your own backup destination, if you enabled backup).

#### 2.3 Backup (optional, opt-in, off by default)

If — and only if — you configure a backup server, the Extension can upload a backup archive
containing the fields you explicitly select, which may include: cookies, extension configuration,
site metadata, user information, search-result snapshots, keep-upload tasks, and download history.

- Supported destinations are ones **you** provide credentials for: WebDAV, OWSS, Amazon S3 /
  S3-compatible storage, Backblaze B2, Dropbox, Google Drive, GitHub Gist, and CookieCloud.
- Data is sent **directly from your browser to your chosen destination**. It never passes through
  any server operated by the Extension's developers, because none exists.
- You may enable **AES encryption** and set your own encryption key before backing up. We strongly
  recommend using an `https` destination URL together with encryption. When encryption is enabled,
  the data is encrypted in your browser before it is uploaded.

#### 2.4 Native Messaging (optional, opt-in, off by default)

After you grant the `nativeMessaging` permission and enable the native bridge, the Extension
communicates with a locally installed CLI tool (`ptd-cli`) through the browser's Native Messaging
mechanism. Messages may include site configuration, search results, download history, user
information, and downloader status. **All such communication happens locally, between your browser
and a process on your own machine.** Nothing is sent to a remote server by this channel. You can
revoke the permission or disable the feature at any time in the settings page.

#### 2.5 Data sent to third-party sites

To provide its functionality, the Extension sends requests to sites **you** have configured or
invoked. This necessarily transmits your request content (such as a search keyword) and the
credentials/cookies needed to authenticate you to those sites. This is the same data your browser
would send if you used those sites directly.

When you use social-information features (IMDb, Douban, Bangumi, TMDB, TVMaze, AniDB) or
recommendation features, the Extension requests public metadata from those services (for example, a
movie rating for an ID). If you configure an API key for such a service (for example a Bangumi API
key), that key is stored locally and sent only to that service.

#### 2.6 What we do NOT collect

- **No** analytics, telemetry, crash reporting, or usage statistics.
- **No** advertising identifiers, and no advertising SDKs.
- **No** selling, renting, or sharing of your data with data brokers.
- **No** collection of your browsing history beyond the PT sites you explicitly configure.
- **No** reading of page content on sites unrelated to the functionality you invoked.

### 3. How We Use Data

Data is used **solely** to provide the features you use: searching your configured sites, displaying
your account statistics, managing downloads and seeding tasks, resolving media metadata, and
backing up/restoring your own configuration. We do not use your data for advertising, profiling, or
any purpose unrelated to the Extension's single purpose.

### 4. Storage, Retention, and Security

- **Location:** local browser storage on your device; plus your chosen backup destination if you
  enabled backup.
- **Retention:** data remains until **you** delete it — by removing sites, clearing the relevant
  history, clearing the Extension's storage, or uninstalling the Extension. Backup copies persist at
  your backup destination until you delete them there.
- **Security:** requests to PT sites use the same transport security your browser applies. The
  Extension supports AES-encrypted backups and recommends `https` for backup destinations. The
  Extension does not transmit your data to third parties over unencrypted HTTP where a secure
  transport is available. Note that PT sites conventionally authenticate requests with a passkey
  carried in the URL, so such credentials are necessarily transmitted to that site as part of the
  request; the Extension does not act as an intermediary and does not forward them anywhere else.
- **No public disclosure:** your authentication information (passwords, API keys, cookies, passkeys)
  is never publicly disclosed.

### 5. Sharing with Third Parties

We do not share your data with any third party, because we do not receive it. Data leaves your
browser only in the two cases you control: (a) requests to the PT sites and public metadata services
you configured, and (b) uploads to the backup destination you configured, using credentials you
provided.

### 6. Your Rights and Controls

You can, at any time and without contacting us:

- **Access and export** your data through the Extension's own backup/export features.
- **Delete** data by removing sites, clearing histories, clearing browser storage, or uninstalling
  the Extension.
- **Opt out** of the optional features: leave backup unconfigured, disable the native bridge, or
  revoke the `nativeMessaging` permission.
- **Restrict** the Extension's site access by adjusting its host permissions in your browser.

### 7. Children's Privacy

The Extension is not directed at children and is not intended for use by anyone under the age
required to hold an account on the PT sites they use. It does not knowingly collect data from
children.

### 8. Limited Use Disclosure

The Extension's use of data obtained through browser APIs adheres to the Chrome Web Store User Data
Policy, including the Limited Use requirements. Specifically, data is used only to provide or
improve the Extension's single, user-facing purpose; it is not transferred to third parties except
as needed for that purpose or as required by law; it is not used for advertising; and it is not used
to determine creditworthiness or for lending purposes.

### 9. Changes to This Policy

We may update this Privacy Policy to reflect changes in the Extension's functionality or applicable
requirements. The updated version will be published at this page with a revised "Last updated" date.
Material changes will also be noted in the Extension's release notes.

### 10. Contact

Questions about this Privacy Policy or about how your data is handled:

- Issue tracker: <https://github.com/pt-plugins/PT-depiler/issues>
- Email: `ptdepiler.ptplugins@gmail.com`

---

## 中文版

### 一、概述

PT-depiler（下称「本助手」）是一款浏览器扩展，用于增强您**已经拥有账号**的 Private Tracker（PT）
站点的使用体验，提供多站点种子搜索、种子管理、下载历史记录、用户信息展示、媒体服务器集成，以及可选的
个人配置备份功能。

本政策旨在说明**本助手处理哪些数据、如何收集、如何使用、存储于何处、与谁共享，以及您如何控制与删除这些
数据**。本政策仅适用于本助手，不适用于您访问的任何第三方网站。

**一句话概括：** 本助手**没有自建后端服务器，也不含任何统计、埋点或遥测**。除您**主动配置**备份目标外，
您的数据始终留在您自己的浏览器中。

### 二、本助手处理的数据

#### 2.1 默认仅存于本地的数据

本助手将以下数据存放于您浏览器自身的存储空间（`chrome.storage.local` / IndexedDB），**仅在您的设备上**：

| 类别 | 举例 | 用途 |
| --- | --- | --- |
| 基本配置 | 扩展设置、语言、主题、界面偏好 | 记住您的使用偏好 |
| 站点配置 | 您添加的站点、站点地址、各站点的搜索/布局选项、超时设置 | 确定要操作的站点 |
| 搜索方案与快照 | 已保存的搜索方案、搜索结果快照 | 复用您的搜索配置 |
| 用户信息 | 用户名、用户 ID、等级、加入时间、上传/下载量、分享率、做种量、魔力值、邀请数与消息数、H&R 状态 | 展示您的 PT 账号数据 |
| 下载历史 | 种子名称、大小、时间、目标下载器/目录 | 展示并管理下载记录 |
| 辅种任务 | 站点、种子标题、详情页链接、下载链接、大小、做种/下载人数、目标下载器与保存路径 | 续传并跟踪做种任务 |
| 下载器 / 媒体服务器配置 | 地址、端口、用户名、密码或 API Key、保存路径 | 连接您自己的下载器或媒体服务器 |
| 原生通信桥状态 | 实例 ID、启用标记 | 与可选的本地 CLI 协同 |

#### 2.2 Cookie

当您搜索或刷新用户信息时，本助手会读取您**已配置的** PT 站点的 Cookie，以便使用您**现有的登录状态**
发起请求。Cookie 通过浏览器提供的 Cookie API 访问，且仅限于您已配置的站点。

若您启用了 Cookie 备份/恢复，Cookie 会被包含在 2.3 所述的备份中。本助手不会将 Cookie 用于广告或追踪，
除发送给其所属的 PT 站点（以及在您启用备份时发送到您自己的备份目标）外，不会发送到任何其他地方。

#### 2.3 备份（可选、需主动开启，默认关闭）

**仅当**您自行配置了备份服务器时，本助手才会将备份数据上传至该服务器。备份包含的字段由您自行勾选，可能
包括：Cookie、扩展基本配置、站点元数据、用户信息、搜索结果快照、辅种任务、下载历史。

- 支持的备份目标均为**您自己提供凭证**的服务：WebDAV、OWSS、Amazon S3 / S3 兼容存储、Backblaze B2、
  Dropbox、Google Drive、GitHub Gist、CookieCloud。
- 数据**由您的浏览器直接发往您指定的目标**，不经过本助手开发者运营的任何服务器（因为并不存在这样的服务器）。
- 您可以在备份前启用 **AES 加密**并自行设置加密密钥。我们强烈建议同时使用 `https` 的目标地址与加密功能。
  启用加密后，数据会在上传前于您的浏览器内完成加密。

#### 2.4 原生通信桥（Native Messaging，可选、需主动开启，默认关闭）

当您在设置页面授予 `nativeMessaging` 权限并启用原生通信桥后，本助手会通过浏览器的 Native Messaging 机制
与本地安装的 CLI 工具（`ptd-cli`）通信。通信内容可能包括：站点配置、搜索结果、下载历史、用户信息、下载器
状态。**上述通信全部在本地进行（您的浏览器与本机进程之间）**，该通道不会向任何远程服务器发送数据。您可以
随时在设置页面中撤销该权限或关闭该功能。

#### 2.5 发送给第三方站点的数据

为实现功能，本助手会向**您**已配置或主动操作的站点发起请求。这必然会传输您的请求内容（例如搜索关键词）以及
用于向该站点验证身份的凭证/Cookie。这与您直接用浏览器访问这些站点时所发送的数据相同。

当您使用社交信息功能（IMDb、豆瓣、Bangumi、TMDB、TVMaze、AniDB）或推荐功能时，本助手会向这些服务请求
公开的元数据（例如某个 ID 对应的影片评分）。若您为某服务配置了 API Key（例如 Bangumi API Key），该密钥仅
保存在本地，且仅发送给该服务本身。

#### 2.6 本助手**不会**收集的数据

- **不含**任何统计、埋点、崩溃上报或使用情况分析；
- **不含**广告标识符，也未集成任何广告 SDK；
- **不会**向数据经纪商出售、出租或共享您的数据；
- **不会**收集您明确配置的 PT 站点以外的浏览历史；
- **不会**读取与您所调用功能无关的页面内容。

### 三、数据的使用方式

数据**仅**用于实现您正在使用的功能：搜索您配置的站点、展示您的账号数据、管理下载与辅种任务、解析媒体元数据，
以及备份/恢复您自己的配置。我们不会将您的数据用于广告、画像，或任何与本助手单一用途无关的目的。

### 四、存储、保留与安全

- **存储位置：** 您设备上的浏览器本地存储；若您启用了备份，还包括您所选择的备份目标。
- **保留期限：** 数据会一直保留，直到**您**主动删除——通过移除站点、清除相关历史记录、清除扩展存储空间或
  卸载扩展。备份副本会保留在您的备份目标上，直到您在该处删除。
- **安全措施：** 对 PT 站点的请求采用与浏览器一致的安全传输方式；本助手支持 AES 加密备份，并建议备份目标
  使用 `https`。在存在安全传输方式的前提下，本助手不会通过未加密的 HTTP 向第三方传输您的数据。请注意，PT
  站点惯例上使用携带在 URL 中的 passkey 进行认证，因此这类凭证会作为请求的一部分必然发送给该站点；本助手
  不充当中介，也不会将其转发到其他任何地方。
- **不公开披露：** 您的认证信息（密码、API Key、Cookie、passkey）绝不会被公开披露。

### 五、与第三人共享

我们不会与任何第三方共享您的数据，因为我们根本不会接收到这些数据。数据仅在两种由您掌控的情形下离开您的浏览器：
(a) 向您所配置的 PT 站点及公开元数据服务发起请求；(b) 使用您提供的凭证，上传至您所配置的备份目标。

### 六、您的权利与控制方式

您随时可以（无需联系我们）：

- **访问与导出**数据：使用本助手自带的备份/导出功能；
- **删除**数据：移除站点、清除历史记录、清除浏览器存储空间，或卸载扩展；
- **关闭**可选功能：不配置备份、关闭原生通信桥、撤销 `nativeMessaging` 权限；
- **限制**站点访问：在浏览器中调整本助手的主机权限。

### 七、儿童隐私

本助手并非面向儿童，也不适用于未达到其所用 PT 站点账号注册年龄要求的用户。本助手不会有意收集儿童数据。

### 八、有限使用声明（Limited Use）

本助手通过浏览器 API 获取的数据的使用方式，遵循 Chrome 应用商店用户数据政策（含 Limited Use 要求）。
具体而言：数据仅用于提供或改进本助手单一且面向用户的功能；除为实现该功能所必需或法律要求外，不向第三方
传输；不用于广告；不用于评估信用状况或放贷目的。

### 九、政策修订

我们可能因功能变化或适用要求变更而更新本隐私权保护政策。更新后的版本将在本页面公布，并同步修订「最后更新」
日期。若有重大变更，我们也会在扩展的发行说明中注明。

### 十、联系方式

如对本政策或数据处理方式有疑问，请联系：

- Issue 反馈：<https://github.com/pt-plugins/PT-depiler/issues>
- 邮箱：`ptdepiler.ptplugins@gmail.com`
