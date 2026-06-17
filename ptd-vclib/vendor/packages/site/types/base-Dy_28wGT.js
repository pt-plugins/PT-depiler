class n extends Error {}
class c extends Error {}
class d extends Error {}
var r = ((o) => (
  (o[(o.unknownError = 0)] = "unknownError"),
  (o[(o.waiting = 1)] = "waiting"),
  (o[(o.working = 2)] = "working"),
  (o[(o.success = 3)] = "success"),
  (o[(o.parseError = 4)] = "parseError"),
  (o[(o.passParse = 5)] = "passParse"),
  (o[(o.CFBlocked = 6)] = "CFBlocked"),
  (o[(o.needLogin = 7)] = "needLogin"),
  (o[(o.noResults = 8)] = "noResults"),
  o
))(r || {});
export { n as C, r as E, c as N, d as a };
