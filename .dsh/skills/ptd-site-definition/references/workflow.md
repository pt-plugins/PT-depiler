# 新增 / 修改站点定义的完整流程

## 0. 前置确认

- **站点是否已被支持**：查 `src/packages/site/definitions/` 是否有同名文件；注意域名可能已在别的文件的 `legacyUrls` 里（换域名场景）。已支持就改为修改既有文件，不要新建。
- **站点是否还活着**：彻底死亡才写 `isDead: true`。
- **是不是"换域名"**：旧域名要从 `urls` 移到 `legacyUrls`，不要删除。

查重命令：

```bash
ls src/packages/site/definitions/ | grep -i <关键词>
grep -rn "uggcf://\|https://" src/packages/site/definitions/ | grep -i <域名>
```

## 1. 收集事实（工作量的主要来源）

| 要写进 metadata 的内容 | 从哪里拿 |
| --- | --- |
| `id` / `name` / `aka` | 站点自身；Jackett 同名站点配置可作命名参考 |
| `type` | PT 私有站 = `private`；公开 BT 站 = `public` |
| `urls` / `legacyUrls` | 站点实际地址；旧地址查历史 |
| `schema` | 见第 2 步 |
| `timezoneOffset` | 站点显示时间的时区；不写则按引擎缺省 |
| `favicon` | 站点 favicon URL；或往 `public/icons/site/` 放 `{id}.png` |
| `category` | 搜索页的分类下拉/表单（value 必须是站点真实值） |
| `officialGroupPattern` | 站点的官组命名规则（标题里的组名特征） |
| `levelRequirements` | 站点规则页/等级页；含各等级的门槛与保号要求 |
| `userInputSettingMeta` | 需要用户额外提供的值（API key、uid 等） |
| `noLoginAssert` | 未登录时站点返回的状态码/跳转/特征串 |
| `search` / `userInfo` | 搜索接口与个人页的 DOM 或 API 响应 |

**拿不到的值不要猜**：留空或使用 schema 默认值，并在交付说明里列出"待确认项"。编造 category value 或选择器会让站点静默失效，比不做更糟。

若站点信息来自 PT-Plugin-Plus 的既有配置，按仓库惯例在文件头标注来源（参考 `definitions/cinemageddon.ts:1-4`、`definitions/hdroute.ts:1-3` 的 `@PTPPDefinitions` 注释）。

## 2. 判定引擎

`schema` 的合法取值见 `types/site.ts:11-22`。判定方法：

```bash
# 看同引擎的既有站点都长什么样
grep -rln 'schema: "<Engine>"' src/packages/site/definitions/ | head
```

各引擎的可观测判定特征写在各引擎文档的「判定站点是否属于该引擎」一节，先读它再动手。判定不出来时用 `type` + 基类（private → `AbstractPrivateSite`，public → `AbstractBittorrentSite`）也可以先跑起来，但会失去引擎提供的默认选择器与用户信息流程，通常不是终点。

## 3. 选骨架

挑一个**同引擎、同类型、结构最接近**的既有定义作为起点（同语种站点更好），然后：

- 展开引擎的默认 metadata：`...SchemaMetadata`（若该 schema 导出了它，例如 `definitions/hdsky.ts:122`）。
- 只写与默认值不同的部分。整段复制默认值会让后续引擎升级难以追踪。
- 只有需要覆写行为时才 `export default class X extends <Schema> { ... }`（`index.ts:79-84`）。

## 4. 写文件

路径：`src/packages/site/definitions/<id>.ts`，文件名必须等于 `id`。

最小骨架（private + 引擎模板）：

```ts
import type { ISiteMetadata } from "../types";
import NexusPHP, { SchemaMetadata } from "../schemas/NexusPHP.ts";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,          // 必须显式展开：引擎默认值不会自动合并（index.ts:100-101）

  version: 1,                 // 跟随同引擎既有文件取值，仓库现状多为 1
  id: "example",
  name: "Example",
  aka: ["EX"],
  description: "一句话说明",
  tags: ["影视"],

  type: "private",
  schema: "NexusPHP",
  urls: ["https://example.com/"],

  category: [ /* ... */ ],
  // search / userInfo / levelRequirements 只写与引擎默认不同的部分
};

// 需要覆写引擎行为时才写
export default class Example extends NexusPHP {}
```

建议按既有定义的字段顺序排列（id/name/aka/description/tags → type/schema/urls → category → search → detail → userInfo → levelRequirements），diff 更易读。

## 5. 校验

```bash
# 1) 静态结构检查（本 skill 自带，无依赖）
node .dsh/skills/ptd-site-definition/scripts/check-site-definition.mjs src/packages/site/definitions/<id>.ts

# 2) 类型检查（定义文件在 tsconfig include 内，错误会在此暴露）
pnpm check

# 3) 格式化
pnpm format
```

`pnpm check` 是 `vue-tsc --noEmit`（根 `package.json:31`）。有覆写类方法时，类型检查能抓出签名不匹配、缺 `override` 等问题。

## 6. 真机验证

```bash
pnpm dev              # 开发模式，产物输出到 dist-chrome（vite.config.ts:48）
pnpm build:dist       # Chrome 构建，同样输出 dist-chrome
pnpm build:dist-firefox   # Firefox 构建，输出 dist-firefox
```

在浏览器「加载已解压的扩展程序」中指向对应输出目录，然后至少验证：

1. 站点能正常添加、URL 可用；
2. 搜索返回结果，标题/大小/时间/做种数等字段解析正确（不是空值或错位）；
3. 种子下载链接可用（不是 404 或未登录页）；
4. 私有站能取到用户信息与等级；
5. 控制台无解析异常（搜索入口会打印站点名与关键词，见 `AbstractBittorrentSite.ts:175`）。

排查手段见 [debugging.md](debugging.md)。

## 7. 交付

- 提交信息沿用仓库习惯：新增站点 `feat(pkg/site): 适配<站点名>站点 (#PR)`，单站点修复 `fix(pkg/site/<id>): <说明> (#PR)`。
- 在交付说明中写明：判定为哪个引擎、依据是什么、哪些值来自真实站点、哪些是假设或待确认。
- 只提交定义文件相关的改动；不要顺带格式化无关文件或提交构建产物（`dist-*` 已在 `.gitignore` 中）。
