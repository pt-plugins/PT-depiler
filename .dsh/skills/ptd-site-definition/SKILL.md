---
name: ptd-site-definition
description: 为 PT-depiler 仓库新增或修改 PT/BT 站点定义文件（src/packages/site/definitions/*.ts）时使用。覆盖：判定站点所属引擎、编写 siteMetadata（id/urls/version/category/search/userInfo/levelRequirements）、编写选择器与 filters、覆写引擎类方法、以及提交前的类型检查与静态校验。Use when adding support for a new tracker site, editing an existing site definition, adapting a NexusPHP / Unit3D / Gazelle / GazelleJSONAPI / AvistazNetwork / Luminance / Rartracker / TCG site, or when the task mentions definitions/、schemas/、siteMetadata、search selectors、userInfo process。
---

# PT-depiler 站点定义（site definition）编写

目标产物是 `src/packages/site/definitions/<id>.ts`：一个文件定义一个站点，导出 `siteMetadata: ISiteMetadata`，按需再导出一个覆写引擎行为的 `default class`。本 skill 只讲「如何写这个文件」；修改 `types/` 公共类型或 `schemas/` 引擎实现属于另一层次的工作，除非用户明确要求，不要顺手改动。

## 先理解加载机制（决定了哪些东西必须写、哪些不用写）

- `src/packages/site/index.ts:21-29` 用 `import.meta.glob` 自动收集 `schemas/*.ts` 与 `definitions/*.ts`。**新增定义文件不需要注册到任何列表**，文件名（去扩展名）就是 siteId。
- 实例构造顺序见 `index.ts:79-102`：
  1. definition 导出了 `default class` → 直接用它；
  2. 否则取 `siteMetadata.schema` 指向的 schema 类；
  3. `schema` 值在 `schemas/` 里没有对应实现 → 按 `type` 回落 `AbstractPrivateSite`（private）或 `AbstractBittorrentSite`（public）。
- `index.ts:41-42`：`siteMetadata.schema` 缺省时同样按 `type` 回落，所以**不写 `schema` 也合法**。
- **`SchemaMetadata` 不会被自动合并**：`index.ts:100-101` 从 schema 模块只取 `default class`。definition 必须自己写 `...SchemaMetadata` 才能拿到引擎默认值（如 `search`/`userInfo`/`detail`），否则该站点的这些配置就是空的。
- `index.ts:53-56`：`urls` / `legacyUrls` 会做 rot13 还原后再使用。
- `index.ts:59-60`：`tags` 缺省为 `[]`；`timezoneOffset` 缺省为 `NexusPHP` 站点 `+0800`、其余 `+0000`。

## 工作流

1. **判定引擎**：先确定目标站点由哪个 schema 承载（NexusPHP / Unit3D / Gazelle / GazelleJSONAPI / AvistazNetwork / Luminance / Rartracker / TCG / 仅基类）。判定依据写在各个引擎文档的「判定站点是否属于该引擎」一节。
2. **读该引擎的 reference**：见下方「按需读取」。**不要凭记忆套模板**，不同 schema 的 `SchemaMetadata` 默认值差异很大。
3. **收集事实**：category 的 value→name、搜索入口、选择器、等级要求必须来自真实页面、接口响应或站点规则页。拿不到就明确写出假设并向用户确认，**严禁为了让文件"看起来完整"而编造数值、选择器或接口路径**。
4. **写文件**：以同引擎既有定义文件为骨架（`...SchemaMetadata` 展开 + 覆写差异项），只写与默认值不同的部分。
5. **校验**：跑 `pnpm check`（`vue-tsc --noEmit`，定义文件在 tsconfig include 内）与静态检查脚本（见下），必要时跑 `pnpm format`。
6. **交付**：说明改了什么、依据是什么、哪些值来自真实站点、哪些是待确认的假设。

## 硬性规则

- **id = 文件名**，必须匹配 `/[0-9a-z]+/`（无大写、无特殊字符，见 `types/site.ts:36-44`）。若 Jackett 有同名站点配置，优先与其命名一致。
- **version**：必填数字，既有定义全部显式声明（2026-09 的 master 上 301 个定义文件无一例外）。`types/site.ts:46-54` 的约定是「模板类 `-1`；`NexusPHP` / `Unit3D` / `Gazelle` / `GazelleJSONAPI` / `AvistaZ` 系 `0` 且无需递增；其余站点 >0」。
  但仓库现状与文字约定不一致：引擎类定义普遍写 `1`（2026-09 统计：NexusPHP 164 个定义里 158 个写 `1`、Unit3D 35 个里 31 个、GazelleJSONAPI 14 个里 12 个），模板类站点也常写 `1`。
  实际做法：**跟随同引擎既有文件的取值**（绝大多数是 `1`），同一站点内保持一致；修改既有站点时不要顺手改这个字段（除非该站点本来就用 `YYYYMMDD` 式自定义版本号）。
- **urls**：第一个是默认使用地址；支持 https 就优先 https；敏感站点网址可写成 rot13（`uggc://` / `uggcf://`，类型见 `types/base.ts:11-21`，还原见 `utils/html.ts:49`）。
- **legacyUrls**：更换域名时**不要**删 `urls` 里的旧地址，把它移入 `legacyUrls`；若该域名曾出现在 ptpp 中而未出现在 `urls` 中，必须补进 `legacyUrls`（`types/site.ts:88-96`）。
- **favicon**（`types/site.ts:98-106`）：可写完整 `https://.../favicon.ico`、`./<name>.png`（`public/icons/site/` 下的文件）或 `data:image/...`；若 `public/icons/site/` 已存在 `{id}.{png,ico,svg}` 则无需声明。
- **isDead**：只在站点彻底死亡、无恢复可能时写 `isDead: true`；临时不可用应交给用户配置，不要写进 metadata（`types/site.ts:108-115`）。
- **prettier**：printWidth 120、分号、trailing comma all（根 `package.json` 的 prettier 配置）。
- 若同时修改了公共类型/schema，必须同步检查其余定义文件是否受影响（`definitions/` 下 300+ 个定义文件、10 个 schema）。

## 按需读取

| 场景 | 读取 |
| --- | --- |
| 从零新增一个站点、想知道完整流程与交付前检查 | [references/workflow.md](references/workflow.md) |
| 不确定 `ISiteMetadata` 各字段的含义、默认值与约束 | [references/metadata-fields.md](references/metadata-fields.md) |
| 写 selectors、filters、category、searchEntry、userInfo process | [references/selectors-and-filters.md](references/selectors-and-filters.md) |
| 排查"搜不到/解析为空/提示未登录/结果字段错误" | [references/debugging.md](references/debugging.md) |
| 目标站点是 NexusPHP 系（国内 HDSky/OurBits 类结构） | [references/engines/nexusphp.md](references/engines/nexusphp.md) |
| 目标站点是 Unit3D 系（Laravel + API） | [references/engines/unit3d.md](references/engines/unit3d.md) |
| 目标站点是 Gazelle 系（音乐 tracker，网页解析） | [references/engines/gazelle.md](references/engines/gazelle.md) |
| 目标站点是 Gazelle 的 JSON API 变体 | [references/engines/gazelle-json-api.md](references/engines/gazelle-json-api.md) |
| 目标站点属于 AvistaZ 网络（AvistaZ/AsiaTorrents/CinemaZ/PrivateHD 等） | [references/engines/avistaz-network.md](references/engines/avistaz-network.md) |
| 目标站点是 Luminance 引擎 | [references/engines/luminance.md](references/engines/luminance.md) |
| 目标站点是 Rartracker 引擎 | [references/engines/rartracker.md](references/engines/rartracker.md) |
| 目标站点是 TCG 引擎 | [references/engines/tcg.md](references/engines/tcg.md) |
| 私有站但没有现成引擎，直接用私有站模板 | [references/engines/abstract-private-site.md](references/engines/abstract-private-site.md) |
| 公共 BT 站（type: "public"）与基类提供的通用能力 | [references/engines/abstract-bittorrent-site.md](references/engines/abstract-bittorrent-site.md) |

## 静态校验

写完定义文件后运行（无需安装依赖）：

```bash
node .dsh/skills/ptd-site-definition/scripts/check-site-definition.mjs src/packages/site/definitions/<id>.ts
node .dsh/skills/ptd-site-definition/scripts/check-site-definition.mjs   # 不带参数 = 全量扫描
```

脚本检查：文件名与 `id` 是否一致、`id` 是否合法、必填字段是否齐全、`type` 取值、`urls` 是否非空且可 rot13 还原、`timezoneOffset` 格式、`category` 的 key 是否重复、`levelRequirements` 的 id 是否重复或非递增；并对 `schema` 命名、version 口径、明文 http 给出提示。脚本只做静态结构检查，**不能替代** `pnpm check` 与真实站点上的运行验证。

## 交付前检查清单

- [ ] `id` 与文件名一致，且只含小写字母与数字
- [ ] `version` 与同引擎既有文件取值一致（新增站点通常为 `1`）
- [ ] `urls` 至少一项，首个为默认地址，可用 https 就用 https；旧域名进了 `legacyUrls`
- [ ] `type` 与 `schema` 匹配；`schema` 若填的是 `schemas/` 里没有的名字，则该文件必须导出 `default class` 承载它
- [ ] 展开了 `...SchemaMetadata`（而不是手抄引擎默认值），只额外写与默认不同的部分
- [ ] `category` 的每个 key 在站点内唯一，value 与站点真实分类一致
- [ ] 所有选择器/接口路径都有真实依据，没有猜测值
- [ ] `node .dsh/skills/ptd-site-definition/scripts/check-site-definition.mjs <file>` 通过
- [ ] `pnpm check` 通过
- [ ] 若覆写了类方法，确认签名与基类一致（`override` 关键字、参数个数与类型）
