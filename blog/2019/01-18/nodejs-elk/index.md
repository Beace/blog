---
title: NodeJS ELK 日志系统搭建入门
date: 2019-01-18T16:00:23
---

## 背景介绍
通常情况下，开发过程中日志会直接在控制台打印方便查看，生产环境下应该保存为文件，以便以后查阅。越来越大的项目规模会导致日志数据累计巨大，想要快速从文件中找到几乎是不可能的。因此，搭建日志系统，通过UI组织所有和查阅日志，通过表单查询和定位日志的方式显得尤为重要。下面所记录的就是有关这种类型的日志系统在NodeJS环境下的搭建和演示demo。这一篇仅仅记录过程。

## 前提
### 什么是 ELK

> "ELK" is the acronym for three open source projects: `Elasticsearch`, `Logstash`, and `Kibana`.

`ELK` 是三个开源项目的缩写，分别是：`Elasticsearch`, `Logstash`,`Kibana`。是集中式日志管理系统的解决方案。三个项目分别起了查询与存储、日志输入转化、日志输出的作用。

开发人员代码中加入日志记录 -> `Logstas` 同时从多个源中提取数据，对其进行转换  -> 发送到 `Elasticsearch` -> `Kibana` 从  `Elasticsearch` 中查询数据进行可视化展示 <- 开发人员查询日志

### 环境准备

- Docker
- Node

## 开始
### 通过Node TypeScript 搭建一个基础的服务

下面我们首先利用 TypeScript 和 Node 搭建一个基础的服务，这个服务会跑在本地的`3000`端口， 有一个基础的路由用来测试生成日志。项目地址 [GitHub - BeAce/elk-demo: Node EKL demo](https://github.com/BeAce/elk-demo)

首先，初始化项目

```bash
mkdir elk_demo && cd elk_demo
npm init -y
npm install express --save
npm install @types/express log4js nodemon tslint typescript
```

由于使用了 TypeScript ，我们需要在项目根目录下新建两个 ts 的配置文件，`tsconfig.json`和 `tslint.json` 。这里直接参考了 [GitHub - Microsoft/TypeScript-Node-Starter: A starter template for TypeScript and Node with a detailed README describing how to use the two together.](https://github.com/Microsoft/TypeScript-Node-Starter)

// tsconfig.json

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "esModuleInterop": true,
    "target": "es6",
    "noImplicitAny": true,
    "moduleResolution": "node",
    "sourceMap": true,
    "outDir": "dist",
    "baseUrl": ".",
    "paths": {
      "*": ["node_modules/*", "src/types/*"]
    }
  },
  "include": ["src/**/*"]
}
```

// tslint.json

```json
{
  "rules": {
    "class-name": true,
    "comment-format": [true, "check-space"],
    "indent": [true, "spaces"],
    "one-line": [true, "check-open-brace", "check-whitespace"],
    "no-var-keyword": true,
    "quotemark": [true, "double", "avoid-escape"],
    "semicolon": [true, "always", "ignore-bound-class-methods"],
    "whitespace": [
      true,
      "check-branch",
      "check-decl",
      "check-operator",
      "check-module",
      "check-separator",
      "check-type"
    ],
    "typedef-whitespace": [
      true,
      {
        "call-signature": "nospace",
        "index-signature": "nospace",
        "parameter": "nospace",
        "property-declaration": "nospace",
        "variable-declaration": "nospace"
      },
      {
        "call-signature": "onespace",
        "index-signature": "onespace",
        "parameter": "onespace",
        "property-declaration": "onespace",
        "variable-declaration": "onespace"
      }
    ],
    "no-internal-module": true,
    "no-trailing-whitespace": true,
    "no-null-keyword": true,
    "prefer-const": true,
    "jsdoc-format": true
  }
}
```

新建`src/index.ts`，作为服务的入口文件

```typescript
import express from "express";
import log4js from "log4js";
import * as homeController from "./controllers/home";

const app = express();

const logger = log4js.getLogger();
logger.level = "debug";

app.get("/", homeController.index);

const server = app.listen(3000, () => {
  logger.info("App is running at http://localhost:3000");
  logger.info("Press CTRL-C to stop\n");
});

export default server;
```


新建 `src/controllers/home.ts` 用来处理 `/` 根路由的返回。

```typescript
import { Request, Response } from "express";

export const index = (req: Request, res: Response) => {
  res.send("<h1>Hello ELK</h1>");
};
```

这时候，我们的代码基本完成了。但是运行还需要将 TS 编译为 JS。为了方便以后开发，可以在 `package.json` 中增加以下的 `script`

```json
{
  "scripts": {
    "start": "nodemon dist/index.js",
    "build:watch": "npm run watch-ts",
    "build": "npm run build-ts && npm run tslint",
    "build-ts": "tsc",
    "watch-ts": "tsc -w",
    "tslint": "tslint -c tslint.json -p tsconfig.json",
  },
}
```

在一个 bash 窗口中运行 `npm run build:watch` 会在 `/dist` 目录下生成 JS 文件，另一个 bash 窗口中运行 `npm start` 会看到服务已经在 `3000`端口跑起来，并且可以看到服务启动时输出的日志。

```bash
[nodemon] starting `node dist/index.js`
[2019-01-18T14:17:36.333] [INFO] default - App is running at http://localhost:3000 in development mode
[2019-01-18T14:17:36.335] [INFO] default - Press CTRL-C to stop
```

如果访问  http://localhost:3000 可以看到 `hello elk` 说明第一步已经成功了。


### 搭建 ELK

由于我们采用了docker，所以可以通过docker的编排文件来一起将这三个服务跑起来。[docker-elk](https://github.com/deviantony/docker-elk ) 这里提供了所需编排文件。

```bash
$ git clone https://github.com/deviantony/docker-elk.git
$ docker-compose up [-d]
```

成功执行后可以访问 http://localhost:5601 可以 kibana 的 UI 界面。

![](https://imgs.beacelee.com/2019/elk/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-01-18%20%E4%B8%8B%E5%8D%886.18.47.png)

默认的话，其他服务的端口如下:

> 5000: Logstash TCP input.
> 9200: Elasticsearch HTTP
> 9300: Elasticsearch TCP transport
> 5601: Kibana

默认 Kibana 没有创建任何的 `pattern `,你可以通过UI界面或者通过命令行，这里我通过命令行来创建一个默认的。

```bash
$ curl -XPOST -D- 'http://localhost:5601/api/saved_objects/index-pattern' \
    -H 'Content-Type: application/json' \
    -H 'kbn-version: 6.5.4' \
    -d '{"attributes":{"title":"logstash-*","timeFieldName":"@timestamp"}}'
```

到这里，ELK 平台就搭建完成了，接下来的任务，我们需要将刚刚 Node 应用中的控制台打印的日志，通过 tcp 的方式发送到 `Logstash` 来接收。默认的话是在 localhost 的 5000 端口。

### 记录日志

在 `src/index.ts` 文件中对 `log4js` 进行配置

```javascript
log4js.configure({
  appenders: {
    console: { type: "console" },
    // https://github.com/Aigent/log4js-logstash-tcp
    elk_learn: {
      type: "log4js-logstash-tcp",
      host: "127.0.0.1",
      port: 5000
    }
  },
  categories: {
    default: { appenders: ["elk_learn"], level: "debug" }
  }
});
```

这里需要 `npm install log4js-logstash-tcp --save-dev`。

至此，我们就可以来记录日志了。在不断修改 Node 代码的过程当中，`nodemon` 会帮助我们重启服务，每次都会输出日志。现在，打开 http://localhost:5601，就可以看到服务重启输出的日志了。在页面最上方的搜索框中输入 `APP`,会查到所有包含 `APP` 的日志记录。

![](https://imgs.beacelee.com/2019/elk/767CEE44-F570-4A9D-A5C4-858547D30187.png)

我们再来定义一个 json 的输出会是怎么样的呢

```javascript
app.get("/json", (req, res) => {
  logger.error("{code: 0, data: 1000}");
  res.json("Oh data error");
});
```

访问 http://localhost:3000/json，搜索后看到如下输出

![](https://imgs.beacelee.com/2019/elk/7A7F0E8A-17D1-41B6-A291-8F97FEABA566.png)

## 总结
这一次的记录主要包含了以下内容

- TypeScript Node Express 起一个简单的服务
- ELK 平台的搭建
- 通过上面的服务记录和查询日志

没试过的同学，赶快去试试吧~