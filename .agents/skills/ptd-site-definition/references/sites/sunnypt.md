# SunnyPT（sunnypt.top）接口参考

SunnyPT 是接口驱动的私有站：没有 HTML 列表页，**两套 JSON API**，PT-depiler 的 `definitions/sunnypt.ts` 走的是其中的 mp API。本文件记录 2026-11 从站点前端产物与线上探测得到的接口事实，供后续实现搜索/用户信息/下载之外的其它能力时参考。

## 基础设施

| 项        | 值                                                                                         | 来源                                                  |
| --------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| 站点前端  | `https://sunnypt.top`（Next.js App Router，`zh-CN`，登录在 `/auth/sign-in`，支持二步验证） | 页面 HTML                                             |
| API 基址  | `https://api.sunnypt.top`                                                                  | 前端 chunk 里的 `APP_API_URL` 常量                    |
| WebSocket | `wss://api.sunnypt.top`                                                                    | 同上，`APP_WS_URL`                                    |
| 图片 CDN  | `https://img.sunnypt.top`；接口返回相对路径 `/pic/...` 时拼到这个域名                      | 同上，`APP_IMAGE_CDN_URL` + `utils` 里的 `/pic/` 处理 |
| 前端版本  | `0.0.24`（`APP_VERSION`，页脚也打印）                                                      | 同上                                                  |
| 后端      | Go（未匹配路由返回 `404 page not found` 的 `text/plain`）                                  | 线上探测                                              |

**没有公开的 OpenAPI / swagger**：`/openapi.json`、`/api-docs/openapi.json`、`/v3/api-docs`、`/swagger-ui`、`/redoc`、`/docs`、`/api/v1/docs`、`/api/v1/mp/docs` 全部 404。前端那份客户端是从内部 spec 用 hey-api 生成的（生成的代码里带 `security:[{name:"Authorization",type:"apiKey"}]` / `client` / `url` 三个字段），所以接口清单只能从 bundle 里抠。

## 响应信封

两套 API 统一：

```json
{ "code": 0, "data": {}, "msg": "ok" }
```

- `code === 0` 表示成功；`definitions/sunnypt.ts` 的 `loggedCheck` 就按这个判定。
- 鉴权失败：HTTP 401 + `{"code":401001,"data":null,"msg":"missing API key"}` 或 `"invalid API key"`。

## 两套 API

### 1. mp API（第三方集成，`X-API-Key`）

```
POST/GET https://api.sunnypt.top/api/v1/mp/<path>
Header: X-API-Key: <站点设置页发放的 key>
```

PT-depiler 当前使用这一套（`apiBaseUrl` + 覆写 `request()` 注入 header）。

| 方法 | 路径                                      | 说明                                                                    | 验证                                |
| ---- | ----------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------- |
| GET  | `/api/v1/mp/profile`                      | 账号概览（见下方字段表）                                                | 带 key 实测 200                     |
| GET  | `/api/v1/mp/torrents`                     | 种子搜索/列表，参数 `page` / `page_size` / `sort` / `order` / `keyword` | 无 key 401                          |
| GET  | `/api/v1/mp/categories`                   | 分类列表                                                                | 无 key 401                          |
| GET  | `/api/v1/mp/messages`                     | 站内消息                                                                | 带 key 实测 200                     |
| POST | `/api/v1/mp/torrents/{id}/download-token` | 换取一次性下载地址（返回 `data.download_url`）                          | 无 key 401（`{id}` 不存在时才 404） |

已知坑：`download-token` 返回的 `download_url` 指向 `https://sunnypt.top/...`，该 host 实际不能直接下载，需要替换成 `https://api.sunnypt.top/`（`sunnypt.ts` 里已做兼容）。mp API 的端点集合只能靠「401 = 存在但缺 key，404 = 不存在」来探测（`GET /api/v1/mp/torrents/1`、`/api/v1/mp/user`、`/api/v1/mp/stats`、`/api/v1/mp/bookmark`、`/api/v1/mp/rank`、`/api/v1/mp/seeding`、`/api/v1/mp/health` 均为 404，不存在）。

`GET /profile` 的响应结构（字段名与类型来自实测，数值已替换为示例）：

```json
{
  "code": 0,
  "data": {
    "id": 12345,
    "username": "example",
    "class": 1,
    "level": "User",
    "registered_at": "2023-01-01T00:00:00+08:00",
    "uploaded": 1099511627776,
    "downloaded": 219902325555,
    "ratio": 5.0,
    "bonus": 123456.789,
    "seeding_count": 12,
    "seeding_size": 549755813888,
    "leeching_count": 1,
    "leeching_size": 1073741824,
    "unread_messages": 0,
    "download_allowed": true
  },
  "msg": "ok"
}
```

与 `userInfo.process[0].selectors` 的对应关系：

| PTD 字段                  | API 字段                                   | 备注                                                                                                                                  |
| ------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `id` / `name`             | `data.id` / `data.username`                |                                                                                                                                       |
| `joinTime`                | `data.registered_at`                       | ISO 8601 带偏移，必须加 `{ name: "parseTime" }`                                                                                       |
| `uploaded` / `downloaded` | `data.uploaded` / `data.downloaded`        | 已是字节数                                                                                                                            |
| `ratio`                   | `data.ratio`                               | 已是倍率，不是字符串                                                                                                                  |
| `bonus`                   | `data.bonus`                               | 小数                                                                                                                                  |
| `seeding` / `seedingSize` | `data.seeding_count` / `data.seeding_size` |                                                                                                                                       |
| `leeching`                | `data.leeching_count`                      | `leeching_size` 目前没有对应 PTD 字段                                                                                                 |
| `messageCount`            | `data.unread_messages`                     | 见下方「已知偏差」                                                                                                                    |
| `levelName` / `levelId`   | `data.level` / `data.class`                | `class` 是 NexusPHP 原始常量（0 Peasant … 9 Nexus Master, 10 VIP … 16 Staff Leader），`levelId` 靠 `getLevelIdFromClass` 换算组别编号 |

`GET /messages` 结构：

```json
{
  "code": 0,
  "data": {
    "items": [
      {
        "id": 2962,
        "title": "站点公告",
        "content": "...",
        "created_at": "...",
        "unread": true,
        "link": "https://sunnypt.top/user/notifications"
      }
    ],
    "page": 1,
    "page_size": 100,
    "total": 1,
    "unread_count": 1,
    "has_more": false
  },
  "msg": "ok"
}
```

**已知偏差**：站点把「站点公告」也算进 `unread_messages` / `unread_count`，而站点页面上的未读角标不统计它，于是 PTD 会显示 1 条未读而站点显示 0（#1557 第 2 点）。消息项里没有可区分的类型字段，客户端无法可靠地过滤掉它。

### 2. 第一方 API（站点前端自用，`Bearer`）

```
GET/POST https://api.sunnypt.top/api/v1/<path>
Header: Authorization: Bearer <next-auth 会话 token>
```

前端客户端配置（chunk 内）：`{ auth: async () => token ? \`Bearer ${token}\` : undefined, baseUrl: "https://api.sunnypt.top" }`。鉴权是浏览器登录态换来的会话 token，**不接受 Cookie，也不需要 `X-API-Key`**；`sunnypt.top/api/v1/...` 是 SPA 兜底路由，直接请求会返回 HTML，不能当 API 用。

路径前缀是 `/api/v1`，不是 `/api/v1/mp`。下表「验证」列的含义：`401/404 探测` 表示分别用 GET / POST 打过一次、按 401 与 404 的差异确认方法与路径存在；`仅 bundle` 表示只在生成代码里出现，未探测。

| 分组     | 方法       | 路径                                      | 说明                      | 验证                     |
| -------- | ---------- | ----------------------------------------- | ------------------------- | ------------------------ |
| 用户     | GET        | `/api/v1/user/basic-info`                 | 基本资料                  | 401/404 探测             |
| 用户     | GET        | `/api/v1/user/details/info`               | 详细资料                  | 401/404 探测             |
| 用户     | GET        | `/api/v1/user/details/seeding`            | 当前做种                  | 401/404 探测             |
| 用户     | GET        | `/api/v1/user/details/leeching`           | 当前下载                  | 仅 bundle                |
| 用户     | GET        | `/api/v1/user/details/torrent-completed`  | 已完成种子                | 仅 bundle                |
| 用户     | GET        | `/api/v1/user/details/torrent-incomplete` | 未完成种子                | 仅 bundle                |
| 用户     | GET        | `/api/v1/user/details/uploaded`           | 我发布的种子              | 仅 bundle                |
| 用户     | GET        | `/api/v1/user/seed-bonus`                 | 做种积分                  | 401/404 探测             |
| 用户     | GET        | `/api/v1/user/rainbow-status`             | 「彩虹」状态（站点玩法）  | 仅 bundle                |
| 账号安全 | GET        | `/api/v1/user-rcp/info`                   | 安全设置概览              | 401/404 探测             |
| 账号安全 | GET        | `/api/v1/user-rcp/generate-opt`           | 生成二次验证 OTP          | 仅 bundle                |
| 账号安全 | POST       | `/api/v1/user-rcp/personal-edit`          | 改个人资料                | 仅 bundle                |
| 账号安全 | POST       | `/api/v1/user-rcp/security-edit`          | 改安全设置                | 仅 bundle                |
| 账号安全 | POST       | `/api/v1/user-rcp/tracker-edit`           | 改 tracker 相关           | 仅 bundle                |
| 种子     | GET        | `/api/v1/torrent/download`                | 下载种子（参数传种子 id） | 401/404 探测             |
| 种子     | POST       | `/api/v1/torrent/download-link`           | 生成下载链接              | 401/404 探测             |
| 种子     | POST       | `/api/v1/torrent/edit`                    | 编辑种子                  | 仅 bundle                |
| 种子     | POST       | `/api/v1/torrent/delete`                  | 删除（进回收站）          | 仅 bundle                |
| 种子     | POST       | `/api/v1/torrent/restore`                 | 从回收站恢复              | 仅 bundle                |
| 种子     | POST       | `/api/v1/torrent/hard-delete`             | 彻底删除                  | 仅 bundle                |
| 收藏     | GET        | `/api/v1/bookmark/list`                   | 收藏列表                  | 401/404 探测             |
| 收藏     | POST       | `/api/v1/bookmark/delete`                 | 取消收藏                  | 仅 bundle                |
| 排行     | GET        | `/api/v1/rank`                            | 排行榜                    | 401/404 探测             |
| 站点     | GET        | `/api/v1/site/stats`                      | 站点统计                  | 401/404 探测             |
| 勋章     | GET        | `/api/v1/medals/my`                       | 我的勋章                  | 401/404 探测             |
| 勋章     | POST       | `/api/v1/medals/buy`                      | 购买勋章                  | 仅 bundle                |
| 勋章     | POST       | `/api/v1/medals/gift`                     | 赠送勋章                  | 仅 bundle                |
| 勋章     | POST       | `/api/v1/medals/wear`                     | 佩戴勋章                  | 仅 bundle                |
| 商店     | GET        | `/api/v1/shop/catalog`                    | 商店目录                  | 401/404 探测             |
| 商店     | GET        | `/api/v1/shop/invite/temporary`           | 临时邀请                  | 仅 bundle                |
| 后宫     | GET / POST | `/api/v1/harem/auctions`                  | 拍卖列表 / 发起拍卖       | 401/404 探测（GET+POST） |
| 后宫     | GET / POST | `/api/v1/harem/auctions/{id}/bids`        | 出价列表 / 出价           | 仅 bundle                |
| 后宫     | POST       | `/api/v1/harem/auctions/{id}/cancel`      | 取消拍卖                  | 仅 bundle                |
| 后宫     | POST       | `/api/v1/harem/auctions/{id}/reject`      | 驳回出价                  | 仅 bundle                |
| 后宫     | GET        | `/api/v1/harem/my-overview`               | 我的后宫概览              | 仅 bundle                |
| 聊天     | GET        | `/api/v1/chat/channels`                   | 频道列表                  | 401/404 探测             |
| 聊天     | GET        | `/api/v1/chat/history`                    | 历史消息                  | 401/404 探测             |
| 聊天     | GET        | `/api/v1/chat/private/list`               | 私聊列表                  | 401/404 探测             |
| 聊天     | POST       | `/api/v1/chat/notification/send`          | 发通知                    | 仅 bundle（方法未解析）  |
| 聊天     | GET        | `/api/v1/chat/admin/list`                 | 管理频道                  | 仅 bundle（方法未解析）  |
| 管理     | GET        | `/api/v1/admin/settings/list`             | 站点设置项                | 仅 bundle                |
| 管理     | GET        | `/api/v1/admin/settings/schema`           | 设置项 schema             | 仅 bundle                |
| 管理     | POST       | `/api/v1/admin/settings/edit`             | 修改设置                  | 仅 bundle                |
| 管理     | GET        | `/api/v1/admin/blind-box/stats`           | 盲盒统计                  | 仅 bundle                |
| 管理     | GET        | `/api/v1/admin/blind-box/medal-options`   | 盲盒勋章选项              | 仅 bundle                |

## 重新抓取接口清单的方法

1. 未登录时 `/home` 会 307 到 `/auth/sign-in`，只能拿到共享 chunk；**登录态下的路由 chunk（列表页、详情页、管理页）需要登录后从 DevTools 的 Network 面板补抓**，未登录侧的清单一律不完整（本次的 44 条来自 `/auth/sign-in` 页面加载的 39 个 chunk）。
2. 拉取页面引用的 chunk 并本地 grep：

   ```bash
   curl -sSL https://sunnypt.top/auth/sign-in -o page.html
   grep -oE '/_next/static/[^"]+\.js' page.html | sort -u | while read -r p; do
     curl -sSL --compressed "https://sunnypt.top$p" -o "chunks/$(echo "$p" | sed 's#.*/##')"
   done
   grep -ohE '"/api/v1[^"]*"' chunks/*.js | sort -u
   ```

3. 方法从生成代码里按 `).get(|.post(|.put(|.patch(|.delete({` 最近的匹配还原；生成的 service 形如 `e => (e.client ?? client).post({security:[...], url:"/api/v1/..."})`。
4. 存在性用 401 / 404 二分：第一方 API 无 token 时存在的方法返回 401、不存在的方法返回 404（`text/plain`）；mp API 缺 key 时返回 `{"code":401001,...}`、不存在返回 404。

## 对 PT-depiler 的可用性判断

- 搜索、用户信息、下载都能落在 mp API 上，`definitions/sunnypt.ts` 当前就是这三项；mp API 没有暴露分类外的检索参数（`imdb` / `tmdb` 之类），也没有收藏、做种列表、消息已读标记。
- 第一方 API 的能力明显更全（收藏、做种/下载列表、勋章、商店、聊天），但它只认 next-auth 的 Bearer token：token 存在浏览器会话里，PTD 既拿不到也没有为其实现的登录流程（站点还可能有二步验证），**不要指望用 Cookie 复用**。
- `/api/v1/mp/torrents` 的响应外层同样是 `{code, data:{items, ...}}`，`details_url` 是相对路径，需要 `fixLink` 以站点主页为基址拼接（`sunnypt.ts` 已覆写）。
