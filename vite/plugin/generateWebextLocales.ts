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
        const localeName = path.basename(file, ".json");
        const localeFilePath = path.join(localesDir, file);
        const localeOutputDir = path.join(publicLocalesDir, localeName);

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
          const messages = {};
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
          const outputFilePath = path.join(localeOutputDir, "messages.json");
          fs.writeFileSync(outputFilePath, JSON.stringify(messages, null, 2));
          console.log(`Generated ${outputFilePath}`);
        } catch (error) {
          console.error(`Error processing ${file}:`, error);
        }
      });
    },
  };
}
