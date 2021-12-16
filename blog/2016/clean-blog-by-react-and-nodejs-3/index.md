---
title: Clean Blog by Node && React 3
date: 2016-12-16T15:19:25
updated: Fri Dec 16 2016 15:19:37 GMT+0800 (CST)
comments: 1
categories:
tags:
  - JavaScript
permalink: clean-blog-react-node-3
---

## 前言

- 此次记录承接上篇[Clean Blog by Node && React 2](https://beacelee.com/post/clean-blog-react-node-2.html)

- `Node`连接`MongoDB`数据库(`mongoose`的使用）

- `express`书写`API`

<!--more-->
## 开始实战

### 后端路由规划

[上一次记录](https://beacelee.com/post/clean-blog-react-node-2.html)提到了路由规划，在这里回顾一下。简单定义了如下路由。

```jsx
// /routes/index.js
module.exports = function(app) {
    app.get("/", function(req, res) {
        res.render("index", {
            title: "Article"
        });
    });

    app.get("/about", function(req, res) {
        res.render("index", {
            title: "About"
        });
    });

    app.get("/contact", function(req, res) {
        res.render("index", {
            title: "Contact"
        });
    });

    app.get("/article/:id", function(req, res) {
        res.render("index", {
            title: "Article Detail"
        });
    });
};

```
以上代码段，是对于**前端页面请求服务器时的路由定义**，可以看到所有的路由都指向了`index`。之所谓`单页面应用（SPA）`,特点就体现在这里。具体内部的实现，还是要依靠`react-router`。但是，如果没有服务器对应路由，刷新页面或者输入`url`请求页面时，就会出现`404`的效果。所以，**前端页面的路由必须和服务器路由相匹配**，才能得到正确的相应（`200 ok`）。

#### API路由

按照惯例，我统一将后端路由前面添加了一个`api`，便于与前端区分。凡是涉及到后端路由的，均在`URL`中添加`/api`作为区分。如下代码分别定义了*文章列表*，*文章详情*，*添加文章*三个接口。

```js
// /routes/index.js

//API    文章列表
app.get('/api/post', function(req, res) {
    res.send()
})

//API    文章详情
app.get('/api/post/:id', function(req, res) {
    res.send()
})

//API    添加文章
app.post('/api/post', function(req, res) {
    res.send()
})
```

### 连接MongoDB

#### 添加`mongoose`库的添加

切换到根目录下，执行命令。

```bash
npm install --save mongoose
```

#### 连接数据库

根目录下新建文件`mongo.js`。引入`mongoose`模块，创建连接。

```js
/mongo.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/article');
module.exports = mongoose;
```

> 这样做的原因，一是因为随时要用到这两句话，将其独立出来，直接引用暴露出来的模块更为方便；更加重要的原因是，如果每次请求都去创建连接，会造成去`open`一个已经`open`的连接，造成异常的情况出现（如下错误提示），与其每次要关闭连接，不如每次去复用。

```html
<h1>Trying to open unclosed connection.</h1>
<h2></h2>
<div>Error: Trying to open unclosed connection.
    at NativeConnection.Connection.open (/Users/beace/Documents/beace/react-blog/express-react/node_modules/mongoose/lib/connection.js:237:15)
.........
</div>
```

#### 数据库查询

上述步骤已经连接到了数据库，但是，还要去请求数据，按照`mongoose`的[官方文档](http://mongoosejs.com/docs/)，我们先来定义一个`Schema`。

新建`/src/models/schema.js`，加入如下代码。

```js
var mongoose = require('../../mongo.js');
var Schema = mongoose.Schema;
var articleSchema = new Schema({
    author: {
        type: String,
        default: 'beace'
    },
    title: {
        type: String
    },
    abstract: {
        type: String
    },
    content: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    collection: "articles"
});

module.exports = articleSchema;
```
这里，创建了一个`Schema`实例，并且添加了一些默认值。将来的数据库也大概具有这些字段。在文章列表里，书写请求的代码。

```js
app.get('/articles', function(req, res) {
    var db = mongoose.createConnection('localhost', 'article'); //名为article的数据库
    db.once('open', function() {
        var Article = mongoose.model('articles', articleSchema); // 名为articles的collection
        Article.find({
            author: "Beace"
        }, function(err, docs) {
            if (err) console.log(err);
            else {
                res.send(docs);
            }
        })
    });
})
```
在这里，我们进行了数据库连接的创建，并且查询了一次数据库。大可不必在乎这些写法，我最初在学习的时候就使用的最基本的查询方式，当然，在这里我使用了`mongoose`，遵照它的写法去查询数据库。最终返回给前端`json`的数据格式。

> 进行到这里，好像任务就已经结束了。但是好像有个事情遗漏掉了，我们好像没有创建数据库。因此需要对数据库进行创建、添加字段等操作。

### 数据库的创建

在这里，为了操作简单。我使用了`Robomongo`这个软件来进行可视化的操作。如下图，我创建了一个名为`article`的数据库，并且有一个名为`articles`的`collection`，在上段代码注释中有所体现。

![robomongo](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/node-react/node-react3/node-react-3.jpg)

到这里，数据库的创建已经完毕了。可以到测试工具`postman`中测试下代码的正确性。这里请求到了一个对象数组的数据，如下部分截图。

![robomongo](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/node-react/node-react3/react-node3-2.jpg)


## 总结

这一篇内容，大概记录了从后端路由开始，到`API`的书写，再到数据库的连接和创建。其中，多少会有坑的存在。例如，把连接数据库这个操作放在每个`API`请求里。下一篇的内容，将着重从前端渲染，包括`markdown`形式如何处理，以及开源`markdown`编辑器的引入等方面进行记录。

暂且先预览一下最终效果。

### 列表页

![robomongo](http://images-manager.oss-cn-shanghai.aliyuncs.com/static/node-react/node-react3/node-react3-3.jpg)

### 详情页

![robomongo](http://images-manager.oss-cn-shanghai.aliyuncs.com/static/node-react/node-react3/node-react3-4.jpg)

### 发表页

![robomongo](http://images-manager.oss-cn-shanghai.aliyuncs.com/static/node-react/node-react3/node-react3-6.jpg)
