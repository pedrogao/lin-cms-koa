"use strict";

exports.default = {
  salary: 50000,
  countDefault: 10,
  pageDefault: 0,
  // 指定当前的语言为js，默认为ts
  scriptType: "js",
  pluginPath: {
    // plugin name
    oss: {
      // determine a plugin work or not
      enable: true,
      // path of the plugin that relatived the workdir
      path: "js/app/plugins/oss",
      // other config
      limit: 100000
    },
    notify: {
      enable: true,
      path: "js/app/plugins/notify",
      retry: 2000
    }
  }
};