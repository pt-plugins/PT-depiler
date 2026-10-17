# PT-depiler AI Coding Agent Instructions

## Project Overview

PT-depiler is a browser extension (Manifest v3) for enhancing Private Tracker (PT) site usability: multi-site search, torrent / user-info management, and downloader integration. Stack: Vue 3 + TypeScript + Vuetify.

- Toolchain: **pnpm** (>=12), **Node** >=23.7, TypeScript ~6.0, Vite 6.
- ~400 tracker engines' worth of site definitions ship in-tree under `src/packages/site/definitions/`.

## Architecture & Key Components

### Web Extension Structure (`src/entries/`)

- **Background service worker** — `background/main.ts`: owns `chrome.*` side effects (context menus, downloads, cookies, DNR rules, alarms) and the `extStorage` message handlers.
- **Content script** — `content-script/index.ts`: deliberately tiny. It only decides _whether the current page belongs to an added site_, then dynamically imports the real app (`assets/cs-app.js`, a separate multi-page ESM entry, see the `cs-app-entry` plugin in `vite.config.ts`). Keep this bootstrap free of heavy imports (Vue / Vuetify / `@ptd/site`), otherwise every visited page pays for them.
- **Options page** — `options/`: the Vue 3 SPA.
- **Offscreen document** — `offscreen/`: owns IndexedDB and the scanning / social helpers; background and options reach it over messages.
- **Shared** — `shared/`: types and helpers used by several entries.

### Module System (`src/packages/`)

- **Site** `@ptd/site` — site definitions, engine schemas, metadata and scraping
- **Downloader** `@ptd/downloader` — qBittorrent, Transmission, Deluge, Aria2, Flood, ruTorrent, uTorrent, Synology Download Station
- **BackupServer** `@ptd/backupServer` — WebDAV, S3, Backblaze B2, Dropbox, Google Drive, Gist, CookieCloud, OWSS
- **MediaServer** `@ptd/mediaServer` — Jellyfin, Plex, Emby, fnOS
- **Social** `@ptd/social` — Douban, IMDb, TMDb, AniDB, Bangumi, TVmaze lookups

⚠️ Do not import the `@ptd/site` barrel into the service worker or the content-script bootstrap: it pulls the whole definitions graph. Use deep imports (`@ptd/site/utils/html.ts`, `@ptd/site/types/base.ts`, …) there.

### Storage & State Management

- **Extension storage**: `@webext-core/storage`, wrapped by `src/entries/storage.ts`. Keys: `config`, `metadata`, `userInfo`, `searchResultSnapshot`, `keepUploadTask`. Pinia stores persist through `pinia-plugin-state-persistence`.
- **IndexedDB**: `idb`, database `ptd` (v3), created **only** in the offscreen document (`offscreen/adapter/indexdb.ts`): `social_information`, `download_history`, `favicon` (siteId → icon path). Other contexts must go through messages.
- ⚠️ The `metadata` / `userInfo` stores are large. Avoid reading a whole store in per-page code paths (`getExtStorage("metadata")` structured-clones the entire store) and avoid read-modify-write of a whole store when a narrower update is possible.

## Development Patterns

### Path Aliases (tsconfig.json)

```typescript
"~/*": ["src/*"]               // Root source files
"@/*": ["src/entries/*"]       // Extension entries
"@ptd/*": ["src/packages/*"]   // Modular packages
```

### Message Passing

- Declare every message in the `ProtocolMap` in `src/entries/messages.ts`, and register exactly one `onMessage(...)` handler for it — a declared message without a handler fails silently at runtime. Handlers live in `background/utils/*` or `offscreen/utils/*`.
- Pattern: `onMessage("messageType", handler)` / `sendMessage("messageType", data)`.
- Prefer letting the handler answer the question instead of shipping data to the caller: `matchSocialPage` / `matchSitePage` exist so that neither the social package nor the (large) metadata store ever reaches the content-script bootstrap.

### Site Integration

- Engine schemas in `src/packages/site/schemas/`: `AbstractBittorrentSite`, `AbstractPrivateSite`, plus `NexusPHP`, `Unit3D`, `Gazelle`, `GazelleJSONAPI`, `AvistazNetwork`, `Luminance`, `Rartracker`, `TCG`.
- Site definitions in `src/packages/site/definitions/<id>.ts` export `siteMetadata` (types in `site/types/site.ts`). **The file name must equal `siteMetadata.id`** — the loader uses the file name as `siteId`.
- Engine default metadata: every schema exports `SchemaMetadata` typed as `TSchemaMetadata<键集>` (`site/types/site.ts`) — enumerate the keys the engine **always** provides (`Required<Pick<ISiteMetadata, K>>`). Reading those keys then needs no `!`, while their values keep the _declared_ types: definitions legitimately read optional members the engine never sets (`noLoginAssert`, `requestConfig.params`, …), which a narrowed literal type would reject.
- Selector-based scraping: `IElementQuery` (`selector` / `attr` / `filters` / `switchFilters` / `elementProcess`), parsed with Sizzle.
- `filters: [{ name, args }]` names must exist in `definedFilters` (`site/utils/filter.ts`). `runQueryFilters()` **silently skips** unknown names, so a typo yields wrong values and nothing else. Two layers guard this: `filter.ts` declares its table with `satisfies Record<string, TQueryFilterFn>` (so `TDefinedFilterName` stays a real string-literal union and vue-tsc rejects bad names **in typed positions**), and `pnpm check`'s `checkFilters()` catches what the compiler cannot see (names behind an `any` boundary, dynamically built configs).
  - When factoring filters into a reusable const, annotate it (`satisfies IElementQuery` / `TQueryFilter[]`). Without a type annotation `name` widens to `string` and the compile-time half of that guard stops protecting you.
  - Prefer the shared named filters for parsing; site-specific arithmetic is fine as an inline `(query) => …`.
- Adult sites (tags containing 成人 / XXX / Adult) must keep `urls` / `legacyUrls` / `trackerUrls` in **rot13** (restored at load time), and must not repeat their own domain in plaintext anywhere else — derive from `this.url`, or use a local asset.
- **Site icons**: `public/icons/site/<id>.png|.ico|.svg`. An explicit `favicon: "./x"` in the metadata wins; otherwise lookup order is `<id>.png` → `<id>.ico` → `<id>.svg`.
  - **Never rename an icon file.** The resolved path string is cached per siteId in IndexedDB, so renaming 404s for existing users with no automatic recovery.
  - Prefer local assets over remote URLs and inline data URIs; keep icons ≤256×256 (they render at 14–36 px; ≤128 is plenty).
- Overridable hooks live in `AbstractBittorrentSite`: `getSearchResult()`, `transformSearchPage()`, `transformListPage()`, `transformDetailPage()`, `getTorrentDownloadLink()`, `getTorrentDownloadRequestConfig()`, `getFieldData()`, `findElementsBySelectors()`, `parseWholeTorrentFromRow()`, `fixParsedTorrent()`.

### Vue 3 Composition API

- Use `<script setup>` consistently.
- Prefer `ref()` / `reactive()` / `computed()` over the Options API.
- Vuetify 4 components with CSS utility classes; all user-facing strings go through vue-i18n.

## Build & Development

### Key Commands

```bash
pnpm dev                    # Vite dev server (HMR for the options page and cs-app)
pnpm build:dist             # Build Chrome extension  → dist-chrome/
pnpm build:dist-firefox     # Build Firefox addon     → dist-firefox/ (TARGET=firefox)
pnpm build:watch            # Unminified watch build
pnpm check                  # vue-tsc --noEmit && tsx vite/scripts/checkSiteDefinition.ts && tsx vite/scripts/checkMdiIcons.ts
pnpm check:site-definition  # Site-definition checks only (optionally with file paths)
pnpm check:mdi-icons        # MDI icon names used in src/ vs the full font in public/lib/mdi
pnpm format                 # prettier
```

### Manifest & Browser Targets

- There is **no** `manifest.json` file: the manifest is built inline in `vite.config.ts` (`manifest: () => ({ … })`) and consumed by `vite-plugin-web-extension`. Keys prefixed `{{chrome}}.` / `{{firefox}}.` are kept only in the matching build.
- Chrome uses `background.service_worker` → `background/main.ts`; Firefox uses `background.page` → `background/firefox_main.html`. That page entry is deliberate: an IIFE `scripts` entry cannot code-split, would inline the offscreen dependency graph, and would duplicate the options vendor chunk.
- `transformManifest` removes the CSS that the plugin would otherwise push into `content_scripts`.
- Build-time `define`s include `__RESOURCE_SITE_ICONS__` (icon file list) and version/commit metadata; the light site index is generated by `vite/plugin/generateSiteIndex.ts`, web-extension locales by `vite/plugin/generateWebextLocales.ts`.
- Version/commit metadata comes from `vite/utils/gitInfo.ts`, which shells out to `git`. It **degrades instead of failing** when git is missing or the directory has no `.git` (e.g. building from a GitHub source zip): it falls back to `GITHUB_SHA` / `GITHUB_REF_NAME`, then to placeholders (`0.0.6.0`, `unknown`).

## Testing & Quality

- There is **no unit-test framework** in this repository — do not add test files expecting a runner. Verification is `pnpm check` plus a real `pnpm build:dist`.
- `pnpm check` runs `vite/scripts/checkSiteDefinition.ts`, which statically validates every definition and schema:
  1. structure (id ↔ file name, duplicate `category` keys, non-increasing `levelRequirements` ids, non-URL `urls`, …)
  2. every `TPatterns` string compiles as a `RegExp`
  3. filter names (`filters` / `switchFilters` entries must exist in `definedFilters`)
  4. favicon usage (remote/data-URI favicons are flagged, `favicon: "./x"` must resolve, local icons must not exceed 256×256)
  5. the indexed-metadata contract (`INDEXED_METADATA_FIELDS` ↔ `pickSiteMetadataIndexEntry()`)

  Errors fail the command; warnings and notes do not.

- CI (`.github/workflows/action_build.yml`) runs `pnpm check` — **blocking on pull requests**, `continue-on-error` on `push` events. Treat it as your own gate locally rather than relying on CI.
- Prettier: 120 columns, semicolons, trailing commas, LF. Husky + lint-staged run Prettier on staged files.

## Common Patterns

### Adding New Site Support

1. Pick the engine — override hooks on an existing schema, or add a new schema in `src/packages/site/schemas/`.
2. Add `src/packages/site/definitions/<id>.ts` with `siteMetadata` (`id` = file name, `urls`, `version` per the engine convention in `types/site.ts`, `category`, `search`, `userInfo`, `levelRequirements`).
3. Override only what the engine's selectors cannot express.
4. Verify with `pnpm check:site-definition src/packages/site/definitions/<id>.ts` and then `pnpm check`.

### File Downloads

- Export a file with `downloadBlob()` from `@/options/utils.ts`: it wraps the `Blob` in `URL.createObjectURL()` and calls `chrome.downloads.download()` **directly** — options pages are extension pages with the `downloads` permission, so there is no reason to round-trip through `sendMessage("downloadFile")` (and content scripts have no `chrome.downloads` at all). It revokes the object URL once the download reaches `complete` / `interrupted`.
- The downloads API **validates `filename` strictly** (a `:` in a timestamped name is rejected with `Invalid filename`), unlike `<a download>`, which silently sanitizes. So names go through `sanitizeFilename()` (`@ptd/utils/filename.ts`) first. Do not reintroduce `file-saver`.

### Cross-Browser Compatibility

- Use `chrome.*` APIs with feature detection; the Firefox build maps what it can.
- Keep service-worker and background-page entry points separate (see the manifest section).
- Conditional permissions belong in the inline manifest.

### Error Handling

- Degrade gracefully on network failures instead of throwing away a whole page of results.
- Surface user-facing errors through i18n.
- Background job scheduling goes through `@webext-core/job-scheduler`.

## Key Dependencies

- **Vue ecosystem**: Vue 3.5, Vuetify 4, Vue Router 5, Pinia 4 (+ `pinia-plugin-state-persistence`), Vue I18n 11, `@vueuse/core` / `@vueuse/components`
- **Extension framework**: `@webext-core/{messaging,storage,job-scheduler}`, `vite-plugin-web-extension`
- **HTTP & DOM**: axios, sizzle, `parse-torrent`, `search-query-parser`
- **Data**: `idb`, `fflate` (zip — `jszip` is no longer a dependency), `webdav`
- **Charts & graphics**: `echarts` + `vue-echarts`, `konva` + `vue-konva`
- **Crypto & utilities**: `@noble/hashes`, `@noble/ciphers`, `es-toolkit`, `date-fns`, `nanoid`, `p-queue`, `filesize`, `url-join`, `valid-filename`

This is a sophisticated multi-platform extension requiring careful attention to web extension APIs, cross-site scripting, and torrent ecosystem integrations.
