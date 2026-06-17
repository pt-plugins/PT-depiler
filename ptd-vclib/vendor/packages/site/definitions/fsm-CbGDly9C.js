const e = [
    { id: 1, name: "封禁用户", privilege: "无法解封，感谢曾经来过" },
    { id: 3, name: "注册成员", privilege: "投票中拥有1票权" },
    { id: 4, name: "特殊贡献成员", groupType: "vip", privilege: "投票中拥有3票权，不计下载量" },
    { id: 5, name: "自制委员会", groupType: "manager", privilege: "投票中拥有10票权" },
  ],
  i = {
    isDead: !0,
    favicon: "./fsm.jpg",
    version: 1,
    id: "fsm",
    name: "FSM",
    aka: ["飞天拉面神教"],
    description: "FSM（飞天拉面神教）是一家专注于R18内容的PT站点，需要配置搜索入口才可搜索",
    tags: ["成人"],
    timezoneOffset: "+0800",
    collaborator: [],
    type: "private",
    schema: "FSM",
    urls: ["uggcf://sfz.anzr/"],
    levelRequirements: e,
  };
export { i as siteMetadata };
