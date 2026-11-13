// Verified aliases and short Chinese summaries for titles whose upstream localization can be incomplete.
// Keys are AniList media IDs, so a translation cannot carry over to a different season or release.
const chineseAnime: Readonly<Partial<Record<number, { title: string; summary: string }>>> = {
  195539: {
    title: "赛博朋克：边缘行者 第二季",
    summary:
      "在夜之城，一名不再使用义体的传奇佣兵试图重拾生活的意义。与此同时，一名游牧者踏上复仇之路，逐步逼近企业不愿公开的秘密。",
  },
  195516: {
    title: "药屋少女的呢喃 第三季",
    summary:
      "动乱平息后，猫猫回到花街继续当药师。后宫的一顿早膳露出疑点，她再次展开调查，壬氏也开始直面自己的身份与责任。",
  },
  // Chinese title used by the broadcaster: https://times.abema.tv/zh/articles/-/10252993
  195604: {
    title: "黑色五叶草 第二季",
    summary:
      "黑色暴牛团为营救被俘的同伴，进攻由漆黑三极性控制的黑桃王国。亚斯塔必须突破自己的极限，阻止恶魔带来的威胁。",
  },
  // Douban 38480705; the Japanese premiere is documented by Crunchyroll.
  212888: {
    title: "装备我最强",
    summary: "申英佑在虚拟游戏《满足》中意外获得传奇铁匠职业。他靠锻造装备扭转困境，也逐渐卷入影响游戏世界的争斗。",
  },
  159042: {
    title: "转生成为魔剑了 第二季",
    summary: "转生成魔剑的师父继续与黑猫族少女芙兰同行。芙兰在新的冒险中磨炼剑技，也一步步向黑猫族进化的目标靠近。",
  },
  205909: {
    title: "萤火虫的婚礼",
    summary: "身患重病的千金桐谷纱都子遭人绑架。为活着回家，她向本该杀掉自己的杀手后藤进平提出结婚。",
  },
  189123: {
    title: "青之箱 第二季",
    summary: "羽毛球选手猪股大喜和篮球选手鹿野千夏继续为全国大赛努力。旧友归来，赛场竞争和彼此的心意都变得更难回避。",
  },
  191656: {
    title: "学生会也有洞！",
    summary: "成绩偏科的一年级学生水之江梅加入藤成学园学生会，在一群个性迥异的成员之间，迎来忙乱又热闹的校园生活。",
  },
  // Series title and stage scope: https://media.netflix.com/en/only-on-netflix/82116553
  210482: {
    title: "飙马野郎 JOJO的奇妙冒险 第二、第三赛段",
    summary:
      "横跨北美的赛马大赛进入第二、第三赛段。乔尼和杰洛在沙漠中继续前进，沿途的异常事件逐渐揭开其他参赛者的目的。",
  },
  207329: {
    title: "被流放的开挂魔术师讴歌随心所欲第二人生",
    summary: "擅长给装备附加强化效果的魔术师被逐出公会。他收回曾分给队友的强化点，带着这项能力重新踏上冒险旅途。",
  },
};

const chineseGenres = new Map([
  ["Action", "动作"],
  ["Adventure", "冒险"],
  ["Comedy", "喜剧"],
  ["Drama", "剧情"],
  ["Ecchi", "轻色情"],
  ["Fantasy", "奇幻"],
  ["Horror", "恐怖"],
  ["Mahou Shoujo", "魔法少女"],
  ["Mecha", "机甲"],
  ["Music", "音乐"],
  ["Mystery", "悬疑"],
  ["Psychological", "心理"],
  ["Romance", "爱情"],
  ["Sci-Fi", "科幻"],
  ["Slice of Life", "日常"],
  ["Sports", "运动"],
  ["Supernatural", "超自然"],
  ["Thriller", "惊悚"],
]);

export function getChineseAnime(id: number) {
  return chineseAnime[id];
}

export function translateAnimeGenres(genres?: string[]) {
  return genres?.map((genre) => chineseGenres.get(genre) ?? genre);
}
