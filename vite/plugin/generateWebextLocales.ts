import fs from "node:fs";
import path from "node:path";

export function vitePluginGenerateWebextLocales() {
  return {
    name: "vite-plugin-generate-webext-locales",
    buildStart() {
      const localesDir = path.resolve(process.cwd(), "src/locales");
      const publicLocalesDir = path.resolve(process.cwd(), "public/_locales");

      const localeFiles = fs.readdirSync(localesDir).filter((file) => file.endsWith(".json"));

      localeFiles.forEach((file) => {
        // 防御：目录项经 basename 归一后必须匹配白名单（语言代码.json），否则跳过，
        // 确保进入后续 path.join / 文件读写的片段不含路径分隔符或父级引用
        const safeFile = path.basename(file);
        if (!/^[A-Za-z0-9_-]+\.json$/.test(safeFile)) {
          console.warn(`Skip suspicious locale file name: ${file}`);
          return;
        }
        const localeName = path.basename(safeFile, ".json");
        // 路径基底为字面量，动态片段（safeFile / localeName）均已 basename 归一并通过白名单校验
        const localeFilePath = `${localesDir}/${safeFile}`;
        const localeOutputDir = `${publicLocalesDir}/${localeName}`;

        try {
          // 读取 json 文件内容
          const fileContent = fs.readFileSync(localeFilePath, "utf8");
          const jsonData = JSON.parse(fileContent);

          // 提取 manifest 字段
          const manifest = jsonData.manifest;
          if (!manifest) {
            console.warn(`No manifest field found in ${file}.`);
            return;
          }

          // 生成 messages.json 文件内容
          const messages: Record<string, any> = {};
          for (const [key, value] of Object.entries(manifest)) {
            messages[key] = {
              message: value,
            };
          }

          // 创建 public/_locales/<name> 目录
          if (!fs.existsSync(localeOutputDir)) {
            fs.mkdirSync(localeOutputDir, { recursive: true });
          }

          // 写入 messages.json 文件
          const outputFilePath = `${localeOutputDir}/messages.json`;
          fs.writeFileSync(outputFilePath, JSON.stringify(messages, null, 2));
          console.log(`Generated ${outputFilePath}`);
        } catch (error) {
          console.error(`Error processing ${file}:`, error);
        }
      });
    },
  };
}
