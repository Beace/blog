---
title: 在AntPro 2.0中本地开发开启HTTPS
date: 2018-09-27T13:27:23
permalink: ant-pro-2-https
---

## 需求

在使用定制化框架Antd-Pro开发前端项目时，在客户端需要与硬件交互的情况下，需要在本地开发开启HTTPS，例如二次验证U2F。

## 问题描述

antd-pro 本身就是一个隔离的沙盒，虽然脚手架本身的服务基于webpack-dev-server来启动，但是高度的封装导致一些webpack的options不能够定制化。但是webpack-dev-server本身是提供本地SSL证书以及HTTPS配置的。因此，这就需要去修改antd-pro的源码，这又引申出另一个问题，如果ant-pro更新，自己修改的代码势必会被覆盖，所以最好的方式是发起pr来让项目的开发者来合并，这样一劳永逸。

## 解决方案

### 本地测试

首先webpack-dev-server开启HTTPS的配置如下

```javascript
module.exports = {
  //...
  devServer: {
    https: {
      key: fs.readFileSync('/path/to/server.key'),
      cert: fs.readFileSync('/path/to/server.crt'),
      ca: fs.readFileSync('/path/to/ca.pem'),
    }
  }
};
```

其次，在webpack-dev-server对config对读取如下

```javascript
if (argv.https) {
  options.https = true;
}

if (argv.cert) {
  options.cert = fs.readFileSync(
    path.resolve(argv.cert)
  );
}

if (argv.key) {
  options.key = fs.readFileSync(
    path.resolve(argv.key)
  );
}

if (argv.cacert) {
  options.ca = fs.readFileSync(
    path.resolve(argv.cacert)
  );
}
```


最后可以查看 umi 的源码来看下具体做了哪些封装。以下是代码的部分截取，这里定义了一系列的serverConfig。可以看到是有HTTPS的配置，但是webpack-dev-server的子签名（self-signed）证书本地并不可信。

```javascript
const serverConfig = {
  disableHostCheck: true,
  compress: true,
  clientLogLevel: 'none',
  hot: true,
  quiet: true,
  headers: {
    'access-control-allow-origin': '*',
  },
  publicPath: webpackConfig.output.publicPath,
  watchOptions: {
    ignored: /node_modules/,
  },
  https: !!process.env.HTTPS,
  historyApiFallback: false,
  overlay: false,
  host: HOST,
  proxy,
  contentBase: contentBase || process.env.CONTENT_BASE,
};
const server = new WebpackDevServer(compiler, serverConfig);
```

因此只需要在serverConfig中加入有关HTTPS的配置即可。在这里可以不必配置CA，可以使用[mkcert](https://github.com/FiloSottile/mkcert)来签发一张本机系统可信的证书即可。

```javascript
const serverConfig = {
  //...
  https: true,
  key: '/your/path/key.pem',
  cert: '/your/path/cert.pem',
}
```

### PR

由于有这个[feature](https://github.com/umijs/umi/issues/748)，所以向 umi 项目提了 [pr](https://github.com/umijs/umi/pull/759)，具体实现通过环境变量的方式。

```javascript
import fs from 'fs';
// ...
const CERT = process.env.HTTPS && process.env.CERT ? fs.readFileSync(process.env.CERT) : '';
const KEY = process.env.HTTPS && process.env.KEY ? fs.readFileSync(process.env.KEY) : '';
// ...
const serverConfig = {
  //...
  cert: CERT,
  key: KEY,
  //...
}
```

接下来就是直接通过在npm script里进行对环境变量的定义了。

```json
"script" {
  "start": "APP_TYPE=site HTTPS=true CERT=/Users/beace/Documents/cert/localhost+1.pem KEY=/Users/beace/Documents/cert/localhost+1-key.pem umi dev"
}
```

![](https://imgs.beacelee.com/2018/umi/https.jpg)

证书如下

![](https://imgs.beacelee.com/2018/umi/QQ20180927-141825.png)

## 总结

这里其实有一个问题，就是可以看到上面webpack中devserver的配置其实是一个object或boolean。

> This object is passed straight to Node.js HTTPS module, so see the HTTPS documentation for more information.

但是由于umi其实是基于webpack-dev-server封装，所以这里直接传递HTTPS中的内容，写法略有差异，本质上一样。

