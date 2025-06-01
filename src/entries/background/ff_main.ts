/**
 * Firefox 的 Manifest 仍然支持 background script, 这意味着我们不需要像 Chrome 一样拆分为 server worker + offscreen
 * 这是一个中转的脚本，将 Chrome 中分别注册的方法，统一注册到 Firefox 的 background script 中
 *
 * 在绝大多数情况下，你不需要编辑这个文件
 */
import "./main.ts";
import "../offscreen/offscreen.ts";
