import { Plugin } from "vite";
import { OutputOptions, OutputBundle, OutputAsset } from "rollup";
const fs = require("fs");
export default function subPackPlugin(include: Array<string>, exclude?: Array<string>): Plugin {
  return {
    name: "subPackPlugin",
    generateBundle(options: OutputOptions, bundle: OutputBundle) {
      if (!include || !Array.isArray(include) || include.length === 0) {
        return;
      }
      let appJson: Record<string, any>;
      const appJsonFile = bundle["app.json"] as OutputAsset;
      if (appJsonFile && typeof appJsonFile.source === "string") {
        appJson = JSON.parse(appJsonFile.source);
        include.forEach((item) => {
          let insertPage = "";
          for (let fileName in bundle) {
            if (fileName.endsWith(".wxml") && fileName.startsWith(item)) {
              insertPage = fileName.replace(item + "/", "").replace(".wxml", "");
              break;
            }
          }
          if (insertPage !== "") {
            if (appJson.subPackages) {
              appJson.subPackages.push({
                root: item,
                pages: [insertPage],
              });
            } else {
              appJson.subPackages = [
                {
                  root: item,
                  pages: [insertPage],
                },
              ];
            }
          }
        });
        appJsonFile.source = JSON.stringify(appJson);
      }

      for (const fileName in bundle) {
        if (exclude && exclude.length > 0 && exclude.some((item) => fileName.startsWith(item))) {
          continue;
        }

        const bundleFile = bundle[fileName] as OutputAsset;
        if (fileName.endsWith(".json") && typeof bundleFile.source === "string") {
          console.log(bundleFile.fileName);
          const json = JSON.parse(bundleFile.source);
          if (json.usingComponents) {
            json.componentPlaceholder = JSON.parse(JSON.stringify(json.usingComponents));
            for (const key in json.componentPlaceholder) {
              json.componentPlaceholder[key] = "view";
            }
          }
          bundleFile.source = JSON.stringify(json);
        }
      }
    },
  };
}
