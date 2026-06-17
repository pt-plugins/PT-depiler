function t(e) {
  var g = [];
  if (e.length === 0) return "";
  if (typeof e[0] != "string") throw new TypeError("Url must be a string. Received " + e[0]);
  if (e[0].match(/^[^/:]+:\/*$/) && e.length > 1) {
    var h = e.shift();
    e[0] = h + e[0];
  }
  e[0].match(/^file:\/\/\//)
    ? (e[0] = e[0].replace(/^([^/:]+):\/*/, "$1:///"))
    : (e[0] = e[0].replace(/^([^/:]+):\/*/, "$1://"));
  for (var l = 0; l < e.length; l++) {
    var i = e[l];
    if (typeof i != "string") throw new TypeError("Url must be a string. Received " + i);
    i !== "" &&
      (l > 0 && (i = i.replace(/^[\/]+/, "")),
      l < e.length - 1 ? (i = i.replace(/[\/]+$/, "")) : (i = i.replace(/[\/]+$/, "/")),
      g.push(i));
  }
  var f = g.join("/");
  f = f.replace(/\/(\?|&|#[^!])/g, "$1");
  var u = f.split("?");
  return ((f = u.shift() + (u.length > 0 ? "?" : "") + u.join("&")), f);
}
function a() {
  var e;
  return (typeof arguments[0] == "object" ? (e = arguments[0]) : (e = [].slice.call(arguments)), t(e));
}
export { a as u };
