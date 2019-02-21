export default {
  salary: 50000,
  countDefault: 10,
  pageDefault: 0,
  // 指定当前的语言为js，默认为ts
  scriptType: "ts",
  pluginPath:
    process.env.NODE_ENV !== "production"
      ? {
          // plugin name
        oss: {
            // determine a plugin work or not
          enable: true,
            // path of the plugin that relatived the workdir
          path: "ts/app/plugins/oss",
            // other config
          limit: 100000
        },
        notify: {
          enable: true,
          path: "ts/app/plugins/notify",
          retry: 2000
        }
      }
      : {
        oss: {
          enable: true,
          path: "dist/app/plugins/oss",
          limit: 100000
        },
        notify: {
          enable: true,
          path: "dist/app/plugins/notify",
          retry: 2000
        }
      }
};
