(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.uodule = factory());
})(this, (function () { 'use strict';

    require("fs");
    function subPackPlugin(include, exclude) {
        return {
            name: "subPackPlugin",
            generateBundle: function (options, bundle) {
                if (!include || !Array.isArray(include) || include.length === 0) {
                    return;
                }
                var appJson;
                var appJsonFile = bundle["app.json"];
                if (appJsonFile && typeof appJsonFile.source === "string") {
                    appJson = JSON.parse(appJsonFile.source);
                    include.forEach(function (item) {
                        var insertPage = "";
                        for (var fileName in bundle) {
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
                            }
                            else {
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
                var _loop_1 = function (fileName) {
                    if (exclude && exclude.length > 0 && exclude.some(function (item) { return fileName.startsWith(item); })) {
                        return "continue";
                    }
                    var bundleFile = bundle[fileName];
                    if (fileName.endsWith(".json") && typeof bundleFile.source === "string") {
                        console.log(bundleFile.fileName);
                        var json = JSON.parse(bundleFile.source);
                        if (json.usingComponents) {
                            json.componentPlaceholder = JSON.parse(JSON.stringify(json.usingComponents));
                            for (var key in json.componentPlaceholder) {
                                json.componentPlaceholder[key] = "view";
                            }
                        }
                        bundleFile.source = JSON.stringify(json);
                    }
                };
                for (var fileName in bundle) {
                    _loop_1(fileName);
                }
            },
        };
    }

    return subPackPlugin;

}));
