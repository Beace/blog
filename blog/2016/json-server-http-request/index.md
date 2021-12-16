---
title: JSON-Server and XMLHttpRequest
date: 2016-10-29T11:53:06
updated: Sat Oct 29 2016 11:53:31 GMT+0800 (CST)
comments: 1
categories:
tags:
  - JavaScript
permalink: json-server-and-xmlhttprequest
---

## 前提
在很多时候，前端程序员往往较早一步实现页面逻辑，后端程序员由于需要联调、掌握业务逻辑，消耗的时间比较长一点。那前端为了等后端程序员开发完成之后，`API`能够通过直接修改`URL`来对接，就需要伪造一些数据，但是，大部分情况而言，伪造的数据都是不变的。前端脚本不可能用来实现对数据的增删该查。但是，昨天意外发现一个工具——[json-server](https://github.com/typicode/json-server),可以帮助前端程序员来解决页面逻辑控制的痛点。下面我通过一个简单的增删改查的例子来进行记录。

<!--more-->
## 知识点

- [json-server](https://github.com/typicode/json-server)的安装和使用

- POSTMAN的简单使用

- `XMLHttpRequest`对象的用法

- `http-server`

---

## 具体实现

###  [json-server](https://github.com/typicode/json-server)的安装

可以直接去`github`中查询其`API`。通过`npm`安装在全局中：

```bash
$ npm install -g json-server
```

### [json-server](https://github.com/typicode/json-server)的启动

在启动之前，先来伪造一些数据。新建一个`json`文件，命名为`/db.json`,添加以下数据：
```json
{
  "getArticle": [
    {
      "id": 2,
      "title": "json-1",
      "content": "beace2"
    },
    {
      "id": 3,
      "title": "json-2",
      "content": "beace3"
    }
  ],
  "postArticle": [
    {
      "id": 1,
      "title": "json-server",
      "content": "typicode"
    }
  ]
}
```
在命令行中，键入:
```bash
$ json-server /path/to/db.json
```
可以观察到，服务启动在了本地的`3000`端口，截图如下：

![img](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/json-server/json-server-start.png)

我们可以访问[http://localhost:3000/getArticle](http://localhost:3000/getArticle),来看到服务返回的`json`信息。(当然，可也以访问[http://localhost:3000/postArticle](http://localhost:3000/postArticle)，总之既定规则由你来决定)

![json-server-return](http://images-manager.oss-cn-shanghai.aliyuncs.com/static/json-server/json-server-get.png)

### POSTMAN测试

其实，这样的功能并不能够证明其有多么遍历，我们随便伪造一个`json`文件也可以通过这样请求来获取数据，其实便利在于我们可以改变数据，而且是真实发生。

可以通过POSTMAN来进行测试,效果如下诸多截图。

获取数据

![img](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/json-server/json-server-postman.png)

通过`id`获取数据

![img](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/json-server/json-server-postman-delete.png)


`POST`数据

![img](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/json-server/json-server-postman-post.png)


`DELETE`数据

![img](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/json-server/json-server-postman-delete.png)

一系列操作之后 ，回到`/db.json`中会发现数据发生了改变。


### XMLHttpRequest

通过一个简单的请求来获取数据并展示在网页上：

```js
getJSON('http://localhost:3000/getArticle', function(response) {
	console.log(response);
})
function getJSON(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onreadystatechange = function () {
    //为了排版优美，省略了状态判断
        if (callback) {
            callback(JSON.parse(request.responseText));
        }
    };
    request.send(null);
}
```

`XMLHttpRequest`的使用必须通过`http`协议，在这里介绍一个轻量级的`web server`——`http-server`.

通过npm全局安装：

```bash
$ npm install -g http-server
```
在项目根目录中运行：
```bash
$ http-server
```
打开浏览器，进入[http://localhost:8080](http://localhost:8080).



