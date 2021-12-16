---
title: React HashHistory url参数问题
date: 2016-06-27T00:00:00
updated: Thu Sep 22 2016 20:31:23 GMT+0800 (CST)
comments: 1
categories:
tags:
  - JavaScript
permalink: react-hashhistory-url
---

### 问题描述
在引用
```js
import {Route,Router,hashHistory,useRouterHistory} from 'react-router'
```
时，浏览器的`url`会自动生成一个`params`，如同：

`localhost:8080/about?_key23423`

这是为了兼容低版本的浏览器不支持`browserhistory`的做法，但是在`url`中会觉得好像`get`或`post`了某个参数。
官方的解释是：
> The URLs in our app right now are built on a hack: the hash. Its the default because it will always work, but there's a better way.（better way说的是browserHistory）

<!--more-->
### 解决方案：

如果要坚持使用`hashHistory`这种做法定义路由又不想要`hash`值，可以自定义`history`把后面的`hash`值去掉，做法如下：
```js
import React from 'react'
import { render } from 'react-dom'

import {Route,Router,hashHistory,useRouterHistory} from 'react-router'

import {createHashHistory} from 'history'
import App from './modules/App'
import About from './modules/About.js'
import Repos from './modules/Repos.js'

const appHashHistory = useRouterHistory(createHashHistory)({queryKey: false});
render((
   <Router history={appHashHistory}>
        <Router path='/' component={App}>
            <Router path='/about' component={About}></Router>
            <Router path='/repos' component={Repos}></Router>
        </Router>
    </Router>
),document.getElementById('app'));
```
> 参考链接

> https://github.com/reactjs/react-router/blob/master/upgrade-guides/v2.0.0.md#using-custom-histories