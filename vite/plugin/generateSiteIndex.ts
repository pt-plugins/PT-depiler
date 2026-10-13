import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build, type Plugin, type ResolvedConfig } from "vite";

import { pickSiteMetadataIndexEntry } from "../../src/packages/site/utils/metadataIndex.ts";
import type { TSiteMetadataIndex } from "../../src/packages/site/types/metadataIndex.ts";

/**
 * 构建期生成「站点定义轻量索引」，以虚拟模块 `virtual:site-metadata-index` 暴露给 app。
 *
 * ## 为什么需要它
 *
 * 站点定义被 `import.meta.glob` 拆成一个个独立 chunk，全仓有十几处（Topbar 的 isDead、
 * MyData 的 type/aka、SetSearchSolution 的 isDead/name/urls、AddDialog / 一键导入的整张列表……）
 * 只为了读固定属性就把完整定义拉起来解析。实测（Node + 真实产物 + DOM 打桩）：
 *
 * | 项 | 数字 |
 * |---|---|
 * | 363 个定义 chunk 顺序加载 | 828 / 839 / 884 ms |
 * | 并发度 8 | 934 ms（**没有收益**——瓶颈是解析 CPU，不是 I/O） |
 * | 模块缓存热了之后 | 5.8 ms |
 * | 本索引（363 个站点） | 约 106 KB |
 *
 * ## 为什么值不会漂移
 *
 * 生成时用 Vite 的 SSR 构建把**真正的** `src/packages/site/index.ts` 打成一个包
 * （`import.meta.glob` 由 Vite 展开），在 Node 里配合一份最小 DOM 打桩求值，然后对每个 id
 * 调 `getDefinedSiteMetadata()` —— 也就是 app 自己走的那条路（含 `restoreSecureLink`
 * 还原 rot13、`tags ??= []`、`timezoneOffset` 补全），再交给 `pickSiteMetadataIndexEntry()`
 * 抽取字段。所以「索引里有什么」只有一处定义。
 *
 * ## 成本
 *
 * 一次生成实测约 5 s（Vite 打包 1.6 s + 求值 3.2 s），因此：
 * - 只在真的有人 import 这个虚拟模块时才生成（`load()` 里惰性触发，没用到就不花钱）；
 * - 进程内 memo，一次 `vite build` 的多个子构建只生成一次；
 * - 结果按「definitions + schemas + 抽取逻辑」的 sha256 缓存到 `node_modules/.cache/`，
 *   命中就直接复用（dev 重启、连续构建都不再重算）。
 */
const VIRTUAL_MODULE_ID = "virtual:site-metadata-index";
const RESOLVED_VIRTUAL_MODULE_ID = "\0" + VIRTUAL_MODULE_ID;

/** 索引格式版本：改了字段集或抽取口径就 +1，用来让磁盘缓存失效 */
const INDEX_FORMAT_VERSION = 1;

const SITE_PACKAGE_DIR = path.join("src", "packages", "site");
const CACHE_FILE = path.join("node_modules", ".cache", "pt-depiler", "site-metadata-index.json");
const BUILD_WORK_DIR = path.join("node_modules", ".cache", "pt-depiler", "site-metadata-index-build");

/** 索引只依赖这些源码，任何一个变了都必须重新生成 */
function collectSourceFiles(root: string): string[] {
  const files: string[] = [];
  for (const subDir of ["definitions", "schemas"]) {
    const dir = path.join(root, SITE_PACKAGE_DIR, subDir);
    for (const name of fs.readdirSync(dir)) {
      if (name.endsWith(".ts")) files.push(path.join(dir, name));
    }
  }
  // 抽取逻辑本身也参与 hash，否则「改了字段集但缓存没失效」。
  // 类型文件也一起算进来：给 ISiteMetadataIndexEntry 加字段却忘了动抽取函数时，
  // 缓存的旧索引会缺字段，而消费方只会静默拿到 undefined
  files.push(path.join(root, SITE_PACKAGE_DIR, "utils", "metadataIndex.ts"));
  files.push(path.join(root, SITE_PACKAGE_DIR, "utils", "helper.ts"));
  files.push(path.join(root, SITE_PACKAGE_DIR, "types", "metadataIndex.ts"));
  return files.sort();
}

function computeSourceHash(root: string): string {
  const hash = crypto.createHash("sha256");
  hash.update(`v${INDEX_FORMAT_VERSION}`);
  for (const file of collectSourceFiles(root)) {
    hash.update(path.relative(root, file).replace(/\\/g, "/"));
    hash.update(fs.readFileSync(file));
  }
  return hash.digest("hex").slice(0, 32);
}

/**
 * 一份最小 DOM 打桩。
 *
 * 站点定义链路上有依赖（`sizzle`）在**模块顶层**就摸 DOM（`setDocument()` 里要 `document.createElement`），
 * 而生成器跑在 Node 里。桩必须「看起来像 document」（`nodeType === 9` 且有 `documentElement`），
 * 否则 sizzle 会早退，后面 `assert()` 里再摸 `document` 就炸。
 *
 * ⚠️ 只补 Node 上**不存在**的键，并在用完立刻删掉：Vite 自己也在同一个进程里跑，
 * 不能让 `window` / `document` 在整个构建期间一直存在 —— 有些库靠
 * `typeof window !== "undefined"` 选分支，留着会把构建带偏。
 */
function installBrowserStubs(): () => void {
  const noop = () => {};
  const createElement = (tag = "div") => {
    const node: Record<string, unknown> = {
      nodeType: 1,
      nodeName: tag.toUpperCase(),
      tagName: tag.toUpperCase(),
      style: {},
      dataset: {},
      attributes: {},
      childNodes: [],
      parentNode: null,
      innerHTML: "",
      setAttribute: noop,
      removeAttribute: noop,
      getAttribute: () => null,
      hasAttribute: () => false,
      appendChild: (child: Record<string, unknown>) => (child.parentNode = node),
      removeChild: noop,
      insertBefore: noop,
      cloneNode: () => createElement(tag),
      compareDocumentPosition: () => 0,
      contains: () => false,
      getElementsByTagName: () => [],
      getElementsByClassName: () => [],
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener: noop,
      removeEventListener: noop,
      matches: () => false,
      getBoundingClientRect: () => ({ top: 0, left: 0, width: 0, height: 0 }),
    };
    return node;
  };

  const htmlElement = createElement("html");
  const documentStub: Record<string, unknown> = {
    ...createElement("#document"),
    nodeType: 9,
    documentElement: htmlElement,
    head: htmlElement,
    body: createElement("body"),
    createElement,
    createElementNS: (_ns: string, tag: string) => createElement(tag),
    createTextNode: (text: string) => ({ nodeType: 3, textContent: text, parentNode: null }),
    createDocumentFragment: () => createElement("#fragment"),
    getElementsByTagName: () => [],
  };
  documentStub.implementation = { createHTMLDocument: () => documentStub };

  const addedKeys: string[] = [];
  const stub = (key: string, value: unknown) => {
    if (key in globalThis) return; // navigator 之类 Node 自带的就别动
    addedKeys.push(key);
    (globalThis as Record<string, unknown>)[key] = value;
  };

  stub("window", globalThis);
  stub("self", globalThis);
  stub("document", documentStub);
  stub("location", {
    href: "chrome-extension://site-index-gen/index.html",
    origin: "chrome-extension://site-index-gen",
  });
  stub("localStorage", { getItem: () => null, setItem: noop, removeItem: noop });
  stub("matchMedia", () => ({ matches: false, addEventListener: noop, removeEventListener: noop }));

  return () => {
    for (const key of addedKeys) delete (globalThis as Record<string, unknown>)[key];
  };
}

/**
 * 用 Vite 的 SSR 构建把整个 `@ptd/site`（含全部站点定义）打成一个包，写到临时目录后
 * 在 Node 里求值，逐个抽出轻量索引。
 */
async function generateSiteMetadataIndex(config: ResolvedConfig): Promise<TSiteMetadataIndex> {
  const root = config.root;
  const workDir = path.join(root, BUILD_WORK_DIR);
  fs.rmSync(workDir, { recursive: true, force: true });
  fs.mkdirSync(workDir, { recursive: true });

  // 这个入口交给 Vite 打包；`import.meta.glob` 由 Vite 展开，所以走的是 app 相同的那条路
  const entryFile = path.join(workDir, "entry.ts");
  const siteIndexPath = path.join(root, SITE_PACKAGE_DIR, "index.ts").replace(/\\/g, "/");
  fs.writeFileSync(
    entryFile,
    `import { definitionList, getDefinedSiteMetadata } from ${JSON.stringify(siteIndexPath)};

export async function buildAllSiteMetadata() {
  const allSiteMetadata = {};
  for (const siteId of definitionList) {
    allSiteMetadata[siteId] = await getDefinedSiteMetadata(siteId);
  }
  return allSiteMetadata;
}
`,
    "utf8",
  );

  // 复用主构建的 alias / define，避免两处各写一份而漂移。
  // configFile: false 保证不会把本插件再加载一遍（否则递归）。
  const buildOutput = await build({
    configFile: false,
    root,
    mode: config.mode,
    logLevel: "error",
    publicDir: false,
    define: config.define,
    resolve: { alias: config.resolve.alias },
    build: {
      ssr: true,
      write: false,
      minify: false,
      target: "esnext",
      emptyOutDir: false,
      rollupOptions: {
        input: entryFile,
        output: { format: "es", entryFileNames: "entry.mjs", chunkFileNames: "chunks/[name]-[hash].mjs" },
      },
    },
  });

  // write: false ⇒ 不会是 RollupWatcher；Vite 的返回类型是三者的联合，这里收窄一下
  const bundle = (Array.isArray(buildOutput) ? buildOutput[0] : buildOutput) as Extract<
    Awaited<ReturnType<typeof build>>,
    { output: unknown }
  >;
  for (const output of bundle.output) {
    const dest = path.join(workDir, output.fileName);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, output.type === "chunk" ? output.code : output.source);
  }

  const restoreStubs = installBrowserStubs();
  try {
    const entryModule = (await import(pathToFileURL(path.join(workDir, "entry.mjs")).href)) as {
      buildAllSiteMetadata: () => Promise<Record<string, Parameters<typeof pickSiteMetadataIndexEntry>[0]>>;
    };
    const allSiteMetadata = await entryModule.buildAllSiteMetadata();
    return Object.fromEntries(
      Object.entries(allSiteMetadata).map(([siteId, metadata]) => [siteId, pickSiteMetadataIndexEntry(metadata)]),
    );
  } finally {
    restoreStubs();
  }
}

function readCachedIndex(cacheFile: string, sourceHash: string): TSiteMetadataIndex | undefined {
  if (!fs.existsSync(cacheFile)) return undefined;
  try {
    const cached = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
    return cached?.sourceHash === sourceHash ? (cached.index as TSiteMetadataIndex) : undefined;
  } catch {
    return undefined; // 缓存坏了就按未命中处理，重新生成即可
  }
}

export function vitePluginGenerateSiteIndex(): Plugin {
  let config: ResolvedConfig;
  let indexPromise: Promise<TSiteMetadataIndex> | undefined;

  const loadIndex = (): Promise<TSiteMetadataIndex> => {
    indexPromise ??= (async () => {
      const sourceHash = computeSourceHash(config.root);
      const cacheFile = path.join(config.root, CACHE_FILE);

      const cached = readCachedIndex(cacheFile, sourceHash);
      if (cached) return cached;

      const index = await generateSiteMetadataIndex(config);
      try {
        fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
        fs.writeFileSync(cacheFile, JSON.stringify({ sourceHash, index }));
      } catch (error) {
        config.logger.warn(`[site-metadata-index] 索引缓存写入失败（不影响本次使用）：${String(error)}`);
      }
      return index;
    })();

    return indexPromise;
  };

  return {
    name: "vite-plugin-generate-site-index",

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID;
      return undefined;
    },

    async load(id) {
      if (id !== RESOLVED_VIRTUAL_MODULE_ID) return undefined;

      let index: TSiteMetadataIndex;
      try {
        index = await loadIndex();
      } catch (error) {
        // 生成失败要让构建红掉，而不是悄悄给一个空索引
        throw new Error(`[site-metadata-index] 站点轻量索引生成失败：${String(error)}`, { cause: error });
      }

      return `export const siteMetadataIndex = ${JSON.stringify(index)};`;
    },

    // dev 下改了站点定义 / schema 要让索引重新生成，否则一直用旧的
    configureServer(server) {
      const watchedDirs = ["definitions", "schemas"].map((subDir) => path.join(config.root, SITE_PACKAGE_DIR, subDir));
      server.watcher.add(watchedDirs);

      const onSourceFileChanged = (file: string) => {
        if (!watchedDirs.some((dir) => file.startsWith(dir))) return;
        indexPromise = undefined;
        const module = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID);
        if (module) server.moduleGraph.invalidateModule(module);
      };

      server.watcher.on("add", onSourceFileChanged);
      server.watcher.on("change", onSourceFileChanged);
      server.watcher.on("unlink", onSourceFileChanged);
    },
  };
}
