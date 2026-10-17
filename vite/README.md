# `vite/`

构建期代码。**`vite.config.ts` 必须留在仓库根目录**（Vite 约定），其余按「谁在什么时候跑」分成三类：

| 目录       | 放什么                                                                      | 现有哪些                                                                                                       |
| ---------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `plugin/`  | Vite 插件：在 `vite.config.ts` 里注册，参与打包流程                         | `generateSiteIndex`（站点定义轻量索引）、`generateWebextLocales`（web-extension 语言包）                       |
| `scripts/` | 独立 CLI 入口：由 `package.json` 的 script 或 CI 直接调用，「跑一次就退出」 | `checkSiteDefinition`（`pnpm check` / `check:site-definition`）、`sendToTgChannel`（`action:upload_telegram`） |
| `utils/`   | 上面两类共享的构建期工具（没有 CLI 入口、也不注册成插件）                   | `gitInfo`（版本/提交信息，无 git 环境时退化而不报错）                                                          |

## 约定

- 新增「跑一次的脚本」→ `scripts/`；「被 `vite.config.ts` 引用的插件」→ `plugin/`；两者共用的逻辑 → `utils/`。
- `scripts/` 里的脚本：参数走 `process.argv`，失败用 `process.exit(1)` 报出（CI 依赖退出码判断成败），
  别用 `throw` 收尾（tsx 会打一坨栈但退出码不够明确）。
- 从 `scripts/` 引用 `src/` 是 `../../src/...`，从 `plugin/` 引用是 `../../src/...`（两者深度相同）。
- 这些文件都归 `tsconfig.node.json` 管 —— 注意该配置目前**跑不起来**（缺 `noEmit`、`baseUrl` 在 TS 6 已弃用），
  所以 `vite/**` 实际上没有类型检查覆盖；`pnpm check` 里的 `vue-tsc --noEmit` 只覆盖 `src/**`。
