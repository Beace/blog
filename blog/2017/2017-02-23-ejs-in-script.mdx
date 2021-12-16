---
title: EJS在script标签中混合JavaScript代码的问题
date: 2017-02-23T23:45:05
updated: Mon Feb 27 2017 15:06:55 GMT+0800 (CST)
comments: 1
categories:
tags:
  - JavaScript
permalink: ejs-script-tag-object-not-working
---

## 背景

我在`node+express`项目中定义了一个全局变量`CONFIG`：

```js
global.CONFIG = {
  userName: ‘beace',
  userID: '98SDAF99QRWEQ9'
}
```

<!--more-->
在`render`的时候传入ejs页面中，

```js
module.exports = function(app) {
  app.all('*', function(req, res) {
    console.log(CONFIG)
    res.render('index', {
      title: “xxx",
      CONFIG: CONFIG
    })
  })
}
```
传入完成后，在ejs中想要保留在js代码中，结果发现，每次浏览器都报这个错误
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title><%= title %></title>
    <link rel="stylesheet" href="/static/dist/stylesheets/main.min.css">
    <script>
       window.CONFIG = <%-CONFIG%>
    </script>
  </head>
  <body>
    <div id="container"></div>
    <script type="text/javascript" src="/static/dist/javascripts/main.min.js"></script>
  </body>
</html>
```
![](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/ejs/26291FEB-F820-4CCA-9D92-CC963AFF1F2F.png)

## 解决方案

最终，在http://stackoverflow.com/questions/11289793/accessing-ejs-variable-in-javascript-logic中找到了答案。

如果是单个值，可以这样直接赋值，如果是object类型的变量，需要JSON.stringify(CONFIG)来进行一道处理。

```js
var a = {name: "beace", id: "23423"}
JSON.stringify(a)
"{"name":"beace","id":"23423"}"
```

### 具体原因如此：

`EJS`需要解析`HTML`，`CSS`，`JavaScript`，因此应该避免在`<%%>`中出现原生的`tag`。

![](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/ejs/E7C882B1-6BF4-4CE3-B5EE-27559A4F5B45.png)