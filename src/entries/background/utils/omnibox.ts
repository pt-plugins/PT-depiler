import { stringify } from "urlencode";

import { extStorage } from "@/storage.ts";
import type { IMetadataPiniaStorageSchema } from "@/shared/types.ts";

const splitString = " → ";

interface ISearchSolution {
  name: string;
  value: string;
}

const allSolution = {
  name: chrome.i18n.getMessage("searchPlanAll"),
  value: "all",
};

async function getSearchSolution(getAll = false) {
  const { defaultSolutionId = "default", solutions = {} } = ((await extStorage.getItem("metadata")) ??
    {}) as IMetadataPiniaStorageSchema;

  let solutionsList: ISearchSolution[] = Object.values(solutions)
    .filter((x) => !!x.enabled) // 过滤掉未启用的搜索方案
    .sort((a, b) => b.sort - a.sort) // 按照 sort 降序排序
    .map((x) => ({
      name: x.name,
      value: x.id,
    }));

  if (getAll || defaultSolutionId !== "default") {
    solutionsList = [allSolution, ...solutionsList];
  }

  if (!getAll) {
    solutionsList = solutionsList.slice(0, 5); // 只显示前 5 个搜索方案
  }

  return solutionsList;
}

chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  if (!text) return;

  const solutions = await getSearchSolution();
  let result: chrome.omnibox.SuggestResult[] = solutions.map((x) => ({
    content: `${x.name}${splitString}${text}`,
    description: chrome.i18n.getMessage("omniboxSearch", [x.name, text]),
  }));

  suggest(result);
});

// 当用户接收关键字建议时触发
chrome.omnibox.onInputEntered.addListener(async (text) => {
  let solutionName = "";
  let solutionId = "default";
  let key = "";

  if (text.indexOf(splitString) != -1) {
    const solutions = await getSearchSolution(true);

    [solutionName, key] = text.split(splitString);

    let solution = solutions.find((item: ISearchSolution) => {
      return item.name == solutionName;
    });
    if (solution) {
      solutionId = solution.value;
    }
  } else {
    key = text;
  }

  // 按关键字进行搜索
  // noinspection ES6MissingAwait
  chrome.tabs.create({
    url:
      "/src/entries/options/index.html#/search-entity?" +
      stringify({
        search: key,
        plan: solutionId,
        flush: 1,
      }),
  });
});
