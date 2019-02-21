# lin-cms-koa

> 以 koa 实现的 lin-cms 后台部分，支持 javasript 和 typescript 双语言版本

## 提示

**lin-cms-koa 目前仅作为个人项目进行开发，强烈不建议用于实际项目**

lin-cms 的[前端仓库](https://github.com/TaleLin/lin-cms-vue)

## 开始

请确保你拥有 mysql 数据库和 node.js 的运行环境，并创建名为`lin-cms2`的数据库。

如果你使用 typescript 运行，那么请在`ts/app/config/secure.ts`中修改你自己的 mysql 配置。

如果你使用 javascript 运行，那么请在`js/app/config/secure.js`中修改你自己的 mysql 配置。

修改好后，请运行下面的命令，它会在数据库中添加一个超级管理员。

```bash
npx jest tests/app/dao/addSuper.test.ts
```

接下来，请选择一个方式运行你的程序。

**以 typescript 的方式运行**

```bash
npm run start:dev
```

**将 typescript 编译成 javascript 的方式运行**

```bash
npm run tsc:prod && npm run start:prod
```

**通过 javascript 的方式直接运行**

```bash
node js/app/starter.js
```

## TODO LIST

- [x] 全局异常处理
- [x] 参数检验
- [x] 多级路由，路由分层，路由前缀
- [x] JWT 支持
- [x] json 数据返回扩展
- [x] 日志记录中间件
- [x] ORM(typeorm)框架集成
- [x] 配置文件驱动
- [x] 业务
- [x] 插件(推送)
- [x] 将数据库操作抽象成 dto 层
- [ ] 细节优化
