/**
 * fontverter 没有自带类型声明（package.json 无 `types` 字段，社区也没有 @types/fontverter）。
 * 只声明本项目用到的那个函数：在 sfnt / woff / woff2 之间互转字体 buffer。
 */
declare module "fontverter" {
  export function convert(font: Buffer, targetFormat: "sfnt" | "woff" | "woff2"): Promise<Buffer>;
}
