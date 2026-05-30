# Hot Media Recommendations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a topbar hot media recommendation menu that fetches Douban movie/TV and Bangumi anime recommendations, then directly starts an existing search when a user clicks an item.

**Architecture:** Keep recommendation collection separate from torrent search. `src/packages/social/recommendations.ts` owns source URLs, parsing, normalization, and cache; offscreen registers a single `getSocialRecommendations` message; `Topbar.vue` only renders the menu and reuses `startSearchEntity()` to trigger current search behavior.

**Tech Stack:** Vue 3, Vuetify 3, TypeScript, axios, existing `@webext-core/messaging`, existing `@ptd/social` page parsers.

---

## File Structure

- Create `src/packages/social/recommendations.ts`: source definitions, type definitions, parser selection, in-memory cache, fetch/refresh API.
- Modify `src/packages/social/index.ts`: export the recommendation helper and types.
- Modify `src/entries/messages.ts`: add `getSocialRecommendations` protocol type.
- Create `src/entries/offscreen/utils/socialRecommendations.ts`: register the offscreen message and delegate to `@ptd/social`.
- Modify `src/entries/offscreen/offscreen.ts`: import the new offscreen utility.
- Modify `src/entries/options/views/Layout/Topbar.vue`: render hot recommendation menu and trigger existing search route on item click.
- Modify `src/locales/zh_CN.json` and `src/locales/en.json`: add menu labels, state labels, and refresh text.

## Task 1: Social Recommendation Helper

**Files:**
- Create: `src/packages/social/recommendations.ts`
- Modify: `src/packages/social/index.ts`

- [ ] **Step 1: Add recommendation types, source list, cache, and fetch API**

Create `src/packages/social/recommendations.ts` with:

```ts
import axios from "axios";

import type { ISocialSitePageInformation, TSupportSocialSite } from "./types.ts";
import { socialPageParserMatchesMap } from "./index.ts";

export type TSocialRecommendationCategory = "movie" | "tv" | "anime";

export interface ISocialRecommendationItem {
  id: string;
  site: Extract<TSupportSocialSite, "douban" | "bangumi">;
  category: TSocialRecommendationCategory;
  title: string;
  titles: string[];
  sourceUrl: string;
}

interface ISocialRecommendationSource {
  site: ISocialRecommendationItem["site"];
  category: TSocialRecommendationCategory;
  url: string;
  limit: number;
}

export interface IGetSocialRecommendationsOptions {
  flush?: boolean;
}

const RECOMMENDATION_CACHE_TTL = 6 * 60 * 60 * 1000;

const recommendationSources: ISocialRecommendationSource[] = [
  { site: "douban", category: "movie", url: "https://movie.douban.com/chart", limit: 12 },
  { site: "douban", category: "tv", url: "https://movie.douban.com/tv", limit: 12 },
  { site: "bangumi", category: "anime", url: "https://bgm.tv/anime/browser", limit: 12 },
];

let recommendationCache:
  | {
      createAt: number;
      items: ISocialRecommendationItem[];
    }
  | undefined;

function normalizeParsedItems(
  parsed: ISocialSitePageInformation | ISocialSitePageInformation[],
  source: ISocialRecommendationSource,
): ISocialRecommendationItem[] {
  const parsedItems = Array.isArray(parsed) ? parsed : [parsed];
  const existingIds = new Set<string>();

  return parsedItems
    .map((item) => {
      const titles = item.titles.map((title) => title.trim()).filter(Boolean);
      const title = titles[0];

      if (!item.id || !title) {
        return undefined;
      }

      const uniqueId = `${source.category}:${item.site}:${item.id}`;
      if (existingIds.has(uniqueId)) {
        return undefined;
      }
      existingIds.add(uniqueId);

      return {
        id: item.id,
        site: source.site,
        category: source.category,
        title,
        titles,
        sourceUrl: source.url,
      } satisfies ISocialRecommendationItem;
    })
    .filter((item): item is ISocialRecommendationItem => !!item)
    .slice(0, source.limit);
}

async function fetchRecommendationSource(source: ISocialRecommendationSource): Promise<ISocialRecommendationItem[]> {
  const parserEntry = socialPageParserMatchesMap[source.site]?.find(([pattern]) => {
    if (typeof pattern === "string") {
      return source.url.includes(pattern);
    }

    return pattern.test(source.url);
  });

  if (!parserEntry) {
    console.warn(`No social recommendation parser found for ${source.url}`);
    return [];
  }

  const [, parser] = parserEntry;
  const { data } = await axios.get<Document>(source.url, {
    responseType: "document",
    timeout: 10e3,
  });

  Object.defineProperty(data, "URL", {
    value: source.url,
    configurable: true,
  });

  return normalizeParsedItems(parser(data), source);
}

export async function getSocialRecommendations(
  options: IGetSocialRecommendationsOptions = {},
): Promise<ISocialRecommendationItem[]> {
  if (
    !options.flush &&
    recommendationCache &&
    recommendationCache.createAt > Date.now() - RECOMMENDATION_CACHE_TTL
  ) {
    return recommendationCache.items;
  }

  const settledResults = await Promise.allSettled(recommendationSources.map((source) => fetchRecommendationSource(source)));
  const items = settledResults.flatMap((result) => {
    if (result.status === "fulfilled") {
      return result.value;
    }

    console.warn("Failed to fetch social recommendations", result.reason);
    return [];
  });

  recommendationCache = {
    createAt: Date.now(),
    items,
  };

  return items;
}
```

- [ ] **Step 2: Export the helper from the social package**

Append this export in `src/packages/social/index.ts` near the existing `export * from "./types.ts";`:

```ts
export * from "./recommendations.ts";
```

- [ ] **Step 3: Run TypeScript check for this task**

Run: `pnpm run check`

Expected: PASS. If it fails with a type error in `recommendations.ts`, fix only that file before continuing.

- [ ] **Step 4: Commit**

```bash
git add src/packages/social/recommendations.ts src/packages/social/index.ts
git commit -m "feat(social): add hot media recommendations helper"
```

## Task 2: Offscreen Message

**Files:**
- Modify: `src/entries/messages.ts`
- Create: `src/entries/offscreen/utils/socialRecommendations.ts`
- Modify: `src/entries/offscreen/offscreen.ts`

- [ ] **Step 1: Add the protocol type**

In `src/entries/messages.ts`, update the `@ptd/social` import:

```ts
import type { ISocialInformation, ISocialRecommendationItem, TSupportSocialSite$1 } from "@ptd/social";
```

Then add this protocol entry near the existing social information message:

```ts
  getSocialRecommendations(data?: { flush?: boolean }): ISocialRecommendationItem[];
```

- [ ] **Step 2: Register the offscreen message**

Create `src/entries/offscreen/utils/socialRecommendations.ts`:

```ts
import { getSocialRecommendations } from "@ptd/social";

import { onMessage } from "@/messages.ts";
import { logger } from "./logger.ts";

onMessage("getSocialRecommendations", async ({ data }) => {
  const recommendations = await getSocialRecommendations(data ?? {});
  logger({ msg: "getSocialRecommendations", data: { count: recommendations.length, flush: data?.flush ?? false } });
  return recommendations;
});
```

- [ ] **Step 3: Load the offscreen handler**

In `src/entries/offscreen/offscreen.ts`, add:

```ts
import "./utils/socialRecommendations.ts";
```

Place it next to `import "./utils/socialInformation.ts";`.

- [ ] **Step 4: Run TypeScript check for this task**

Run: `pnpm run check`

Expected: PASS. If it fails with message typing errors, fix `src/entries/messages.ts` or `src/entries/offscreen/utils/socialRecommendations.ts`.

- [ ] **Step 5: Commit**

```bash
git add src/entries/messages.ts src/entries/offscreen/utils/socialRecommendations.ts src/entries/offscreen/offscreen.ts
git commit -m "feat(offscreen): expose hot media recommendations"
```

## Task 3: Topbar UI and Direct Search

**Files:**
- Modify: `src/entries/options/views/Layout/Topbar.vue`
- Modify: `src/locales/zh_CN.json`
- Modify: `src/locales/en.json`

- [ ] **Step 1: Add imports and state to `Topbar.vue`**

Update imports:

```ts
import { computed, ref, watch } from "vue";
import type { ISocialRecommendationItem, TSocialRecommendationCategory } from "@ptd/social";
import { sendMessage } from "@/messages.ts";
```

Keep the existing imports and add these near the current search state:

```ts
const isRecommendationMenuOpen = ref(false);
const isLoadingRecommendations = ref(false);
const recommendationError = ref("");
const recommendationItems = ref<ISocialRecommendationItem[]>([]);

const recommendationCategories: TSocialRecommendationCategory[] = ["movie", "tv", "anime"];

const groupedRecommendationItems = computed(() =>
  recommendationCategories.map((category) => ({
    category,
    items: recommendationItems.value.filter((item) => item.category === category),
  })),
);
```

- [ ] **Step 2: Add loading and click handlers**

Add these functions below `startSearchEntity()`:

```ts
async function loadRecommendations(flush = false) {
  if (isLoadingRecommendations.value) {
    return;
  }

  if (!flush && recommendationItems.value.length > 0) {
    return;
  }

  isLoadingRecommendations.value = true;
  recommendationError.value = "";

  try {
    recommendationItems.value = await sendMessage("getSocialRecommendations", { flush });
  } catch (error) {
    console.error("Failed to load social recommendations", error);
    recommendationError.value = t("layout.header.hotRecommendations.loadFailed");
  } finally {
    isLoadingRecommendations.value = false;
  }
}

function searchRecommendation(item: ISocialRecommendationItem) {
  searchKey.value = item.title;
  isRecommendationMenuOpen.value = false;
  startSearchEntity();
}
```

Add this watcher after the existing route watcher:

```ts
watch(isRecommendationMenuOpen, (isOpen) => {
  if (isOpen) {
    loadRecommendations();
  }
});
```

- [ ] **Step 3: Add the hot menu next to the search button**

Inside the `v-combobox` `#append` template, before the existing magnify search button, add:

```vue
        <v-menu v-model="isRecommendationMenuOpen" :close-on-content-click="false" location="bottom end">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              :disabled="runtimeStore.search.isSearching"
              icon="mdi-fire"
              :title="t('layout.header.hotRecommendations.title')"
            />
          </template>

          <v-card min-width="320" max-width="420">
            <v-card-title class="d-flex align-center py-2">
              <v-icon icon="mdi-fire" class="mr-2" />
              <span class="text-subtitle-1">{{ t("layout.header.hotRecommendations.title") }}</span>
              <v-spacer />
              <v-btn
                :loading="isLoadingRecommendations"
                icon="mdi-refresh"
                size="small"
                variant="text"
                :title="t('layout.header.hotRecommendations.refresh')"
                @click="() => loadRecommendations(true)"
              />
            </v-card-title>

            <v-divider />

            <v-card-text v-if="isLoadingRecommendations && recommendationItems.length === 0" class="py-4">
              <div class="d-flex align-center text-medium-emphasis">
                <v-progress-circular indeterminate size="18" width="2" class="mr-2" />
                {{ t("layout.header.hotRecommendations.loading") }}
              </div>
            </v-card-text>

            <v-card-text v-else-if="recommendationError" class="py-4">
              <div class="text-error">{{ recommendationError }}</div>
            </v-card-text>

            <v-card-text v-else-if="recommendationItems.length === 0" class="py-4 text-medium-emphasis">
              {{ t("layout.header.hotRecommendations.empty") }}
            </v-card-text>

            <v-list v-else density="compact" class="py-0">
              <template v-for="group in groupedRecommendationItems" :key="group.category">
                <v-list-subheader v-if="group.items.length > 0">
                  {{ t(`layout.header.hotRecommendations.category.${group.category}`) }}
                </v-list-subheader>

                <v-list-item
                  v-for="item in group.items"
                  :key="`${item.category}:${item.site}:${item.id}`"
                  :title="item.title"
                  :subtitle="item.site === 'douban' ? 'Douban' : 'Bangumi'"
                  @click="() => searchRecommendation(item)"
                >
                  <template #prepend>
                    <v-icon :icon="item.category === 'anime' ? 'mdi-television-classic' : 'mdi-movie-open'" />
                  </template>
                </v-list-item>
              </template>
            </v-list>
          </v-card>
        </v-menu>
```

- [ ] **Step 4: Add i18n strings**

In `src/locales/zh_CN.json`, under `layout.header`, add:

```json
      "hotRecommendations": {
        "title": "热门推荐",
        "refresh": "刷新热门推荐",
        "loading": "正在加载热门推荐...",
        "empty": "暂无热门推荐",
        "loadFailed": "热门推荐加载失败，请稍后重试",
        "category": {
          "movie": "电影",
          "tv": "剧集",
          "anime": "动画"
        }
      },
```

In `src/locales/en.json`, under `layout.header`, add:

```json
      "hotRecommendations": {
        "title": "Hot Recommendations",
        "refresh": "Refresh hot recommendations",
        "loading": "Loading hot recommendations...",
        "empty": "No hot recommendations",
        "loadFailed": "Failed to load hot recommendations. Please try again later.",
        "category": {
          "movie": "Movies",
          "tv": "TV",
          "anime": "Anime"
        }
      },
```

- [ ] **Step 5: Run TypeScript check for this task**

Run: `pnpm run check`

Expected: PASS. If Vue template type checking fails, fix `Topbar.vue`.

- [ ] **Step 6: Commit**

```bash
git add src/entries/options/views/Layout/Topbar.vue src/locales/zh_CN.json src/locales/en.json
git commit -m "feat(options): add hot recommendations menu"
```

## Task 4: Final Verification

**Files:**
- No new files.

- [ ] **Step 1: Run full TypeScript check**

Run: `pnpm run check`

Expected: PASS.

- [ ] **Step 2: Run production build**

Run: `pnpm run build:dist`

Expected: PASS and `dist-chrome` is generated.

- [ ] **Step 3: Manual behavior check**

Run: `pnpm run dev`

Expected: Vite starts. Open the extension options page in the dev browser context, then verify:

- The topbar search input still accepts manual input.
- The new fire button opens a menu.
- Menu loading, empty, or failure state is visible.
- If recommendations load, clicking one navigates to `SearchEntity` with `search=<title>`, `plan=<current plan>`, and `flush=1`.
- Existing magnify button still starts manual search.

- [ ] **Step 4: Commit any final fixes**

If Task 4 required changes:

```bash
git add <changed-files>
git commit -m "fix(options): polish hot recommendations behavior"
```

If no changes were required, do not create an empty commit.

## Self-Review

- Spec coverage: covered independent topbar button, movie/TV/anime categories, Douban/Bangumi sources, direct search behavior, cache, failure state, and non-goals.
- Placeholder scan: no placeholder red flags are present.
- Type consistency: `ISocialRecommendationItem`, `TSocialRecommendationCategory`, and `getSocialRecommendations` are defined before use and referenced consistently.
