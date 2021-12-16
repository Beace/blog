---
title: Clean Blog by Node && React 2
date: 2016-12-14T11:18:55
updated: Wed Dec 14 2016 11:19:13 GMT+0800 (CST)
comments: 1
categories:
tags:
  - JavaScript
permalink: clean-blog-react-node-2
---


## 前言

- 此记录接上次记录 [Clean Blog by Node && React](https://beacelee.com/post/node-react-1.html)

- 主要任务为记录静态页面的构造（`react-router`）

- [clean-blog](https://startbootstrap.com/template-overviews/clean-blog/)的应用，在这里放出其地址（https://startbootstrap.com/template-overviews/clean-blog/）

<!--more-->
## 开始实战

### `Express`中`app.js`中的路由整理

了解`expressjs`的开发者都知道，在`routes`文件中，每一个文件都表示一个路由，于是有这样的写法。

```js
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
```

每一次新建一个文件，都要引入`express`，利用其中的`router`方法，去实现路由的渲染，不仅如此，并且在`app.js`文件中，还需要进行引入，例如这样的写法。

```js
var routes = require('./routes/index');
var users = require('./routes/users');
app.use('/', routes);
app.use('/users', users);
```

这样极大的降低了开发的效率，因此，我将路由放在一个文件夹内`/routes/index.js`。如下代码：
```js
// /routes/index.js
module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index', {
            title: 'Article'
        });
    });

    app.get('/about', function(req, res) {
        res.render('index', {
            title: 'About'
        });
    });

    app.get('/contact', function(req, res) {
        res.render('index', {
            title: 'Contact'
        });
    });

    app.get('/article/:id', function(req, res) {
        res.render('index', {
            title: 'Article Detail'
        });
    });
};
```

在`/routes/index.js`中，我将所有路由和渲染方法放在了一起，来管理服务器路由以及API的请求（下次解释）。并且，在`/app.js`中还需要将此方法引入。
```js
var routes = require('./routes/index');
var app = express();

routes(app);
```

**至此，服务器端的路由以及API请求的路由已配置好，下面将利用`react-router`来配置前端路由**

## 组件与前端路由

### 页面构思

在配置前端路由之前，先来想象一下我们的项目是什么样子。
大概结构如下：

- 文章列表页（首页）
- 文章详情页（文章列表点击后显示的详情）
- 关于我
- 联系我
- 404

大概需要五个页面。

### 文件的创建

我们的目录结构应该是这样的，在`/src`目录下面，分为如下组件

- Nav
- Header
- Content
- Footer
- About
- contact

ok, 新建如下文件

```
/src
    - /components
        - Nav.js              //导航组件
        - Header.js           //头组件
        - Footer.js           //底部组件
        - Post.js             //文章详情组件
        - About.js            //关于组件
        - Contacts.js         //联系我组件
```

**也许你觉得还缺一个`列表组件`，由于列表组件涉及到循环输出，暂且作为`html`元素存放。没关系，先从简单入手。**

### 组件代码编写

有了上述组件之后，需要对一一为组件编写代码。先让我们浏览下组件所呈现的内容的模样如何。

#### 首页（文章列表页）

![文章列表页](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/node-react/node-react2/node-react2-1.png)

#### 首页（footer）

![底部](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/node-react/node-react2/node-react2-2.png)

#### 文章详情页

![底部](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/node-react/node-react2/node-react2-3.png)

#### About页

![about](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/node-react/node-react2/node-react2-6.png)


#### Contact页

![contact](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/node-react/node-react2/node-react2-5.png)

#### 404页

![404](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/node-react/node-react2/node-react2-4.png)

### 同志，醒醒，该写代码了（组件编写）

ok, 浏览完高大上的页面之后，到了写组件的时间了。

对于组件不过多解释，你可以定制化你的组件，添加各类的`html`和`css`组件。在这里，只写出大体的框架(只有`html`标签，省略`className`)，并且只列出三段代码（导航、头、尾）。等该记录完全完成，我会将源码开放。以下是部分组件的`html`代码。

```jsx
// /src/components/Nav.js
import React, {Component} from "react";
import {Route, IndexRoute, Link} from "react-router"
export default class Nav extends Component {
    render() {
        return (
            <nav>
                <div>
                    <button type="button">
                        <span>Toggle navigation</span>
                        Menu <i></i>
                    </button>
                    <Link className="navbar-brand" to = "/">HOME</Link>
                </div>
                <div>
                    <ul>
                        <li><Link to = "/">HOME</Link></li>
                        <li><Link to = "/about">about</Link></li>
                        <li><Link to = "/work">work</Link></li>
                        <li><Link to = "/contact">contact</Link></li>
                    </ul>
                </div>
            </nav>
        )
    }
}

```

```jsx
// /src/components/Header.js
import React, {Component} from 'react';
import {render} from "react-dom";

export default class Header extends Component {
    render() {
        return (
            <header>
                <div>
                    <h1>React Clean Blog</h1>
                    <hr/>
                    <span>A Clean Blog Theme by React Bootstrap</span>
                </div>
            </header>
        )
    }
}

```

```jsx
// /src/components/Footer.js
import React, {Component} from "react";

export default class Footer extends Component {
    render () {
        return (
            <footer>
                <div>
                    <ul>
                        <li><a href="#"></a></li>
                        <li><a href="#"></a></li>
                        <li><a href="#"></a></li>
                    </ul>
                    <p>Copyright &copy; Your Website 2016</p>
                </div>
            </footer>
        )
    }
}
```
```jsx
// /src/components/Post.js
import React, {Component} from "react";

export default class Footer extends Component {
    render () {
        return (
            <div>
                <header>
                    <div>
                        <h1>{model.title}</h1>
                        <h2></h2>
                        <span className="meta">Posted by <a href="#"></a></span>
                    </div>
                </header>
                <article>
                    <div>
                        <div></div>
                    </div>
                </article>
            </div>
        )
    }
}
```

## react-router(前端路由)

新建文件`/routes/routes.js`，用来管理各个组件的路由配置。我们搭建一个总的框架`App.js`，配置好头部与底部内容。首先需要引入组件，如下代码：

```jsx
//  /src/routes.js
import React , {Component} from "react"
import {Route, IndexRoute, Link, browserHistory} from "react-router"
import Nav from "./components/Nav.js"
import Header from "./components/Header.js"
import Footer from "./components/Footer.js"
import Contacts from "./components/Contacts.js"
import Post from "./components/Post.js"
import Abouts from "./components/About.js"
class App extends Component {
    render() {
        return (
            <div>
                <Nav/>
                {this.props.children}
                <hr/>
                <Footer/>
            </div>
        )
    }
}
```

并在`routes.js`中定义路由并暴露出去。
```jsx
export default (
    <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="article">
            <Route path=":id" component={Post}/>
        </Route>
        <Route path="about" component={About}/>
        <Route path="contact" component={Contact}/>
        <Route path="*" component={NoMatch}/>
    </Route>
)
```
这样，我们所有的前端路由已经定义完成。可以看到，所有的页面都是基于`App Component`完成。
最终，在主文件`/src/index.js`中，获取`DOM`,写入`render`方法中。

```jsx
// /src/index.js
import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import routes from './routes'

const Routes = (
  <Router history={browserHistory}>
    { routes }
  </Router>
)
const app = document.getElementById('app')
render(Routes, app)
```

> 这样，所有的静态部分就大工告成。回想一下以上两篇的内容。首先，由`express`和`node`作为服务器端的编程工具，搭建了后端的路由和静态资源配置。其次，利用`react\react-router`，进行了前端路由的配置，并且使用`webpack`进行了`ES6->ES5`的代码转化。