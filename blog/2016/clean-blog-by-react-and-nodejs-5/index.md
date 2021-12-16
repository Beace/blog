---
title: Clean Blog by Node && React 5
date: 2016-12-21T18:20:49
updated: Wed Dec 21 2016 18:26:35 GMT+0800 (CST)
comments: 1
categories:
tags:
  - JavaScript
permalink: clean-blog-react-node-5
---

## 前言
- 此篇接上篇[Clean Blog by Node && React 4](https://beacelee.com/post/clean-blog-react-node-4.html)
- 服务端 `markdown2html`
- `react`中解析`html`字符串，浏览器渲染

<!--more-->
## 过渡
在[上篇](https://beacelee.com/post/clean-blog-react-node-4.html#toc-5ce)已经完成了文章详情接口的书写，但是，由于我们提交带服务器，服务器保存到数据库中的字符串是`markdown`格式的，浏览器不认识，因此，在`res.send(doc)`之前，需要把`doc`中保存的字符串解析为`html`格式，暴露给前端。下面，着重记录这个过程。

## 开始实战
### markdown库的选择
https://github.com 上有许多可供选择的库。下面列出两个解析内容比较正确的库。

- [markdown](https://www.npmjs.com/package/markdown)
- [marked](https://github.com/chjj/marked)

我个人比较喜欢`marked`这个库，相对比较准确一点。下面我将着重记录`marked`这个库的使用。两者的安装方式都是一个套路。如果需要代码高亮显示，还需要安装`highlight.js`，并且引入其[css](https://highlightjs.org/).

```
npm install highlight.js
npm install markdown
npm install marked
```
### marked
来到详情接口的文件中`/routes/index.js`.添加依赖。

```javascript
var marked = require('marked');
var highlightjs = require('highlight.js');
```
在查询到数据库数据之后返回数据之前，使用`marked()`方法，将`markdown`的字符串解析成`html`字符串。

```js
if(doc) {
    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      highlight: function (code) {
        return highlightjs.highlightAuto(code).value;
      }
    });
    doc.content = marked(doc.content);
}
res.send(doc);
```
这里的`setOption`，是最基本的配置（默认配置），其中，`highlight`属性是一个回调函数，主要作用就是代码高亮。

在这里，我使用的主题为`tomorrow`。

```html
<link rel="stylesheet" href="/styles/tomorrow.css">
```
效果如下（背景图片仿照的[mozilla](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)）

![code preivew](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/node-react/node-react5/node-react5-1.png)

### markdown
使用markdown的话，可以只需要一行代码就可以实现。

```js
doc.content = markdown.toHTML(doc.content);
```
但是他的解析不是很准确，生成的标签样式也很难控制，所以决定弃用它。

### react中html字符串
现在我们获取到了解析后的`html`字符串，但是不可以在`react`的`component`中直接输出，如果直接在`component`中当做一个变量去使用，就会发现你的`tag`都没有被浏览器解析，当做普通的字符串去处理了。`react`不支持这个是[有一定道理的](https://facebook.github.io/react/docs/dom-elements.html#dangerouslysetinnerhtml)，包括`angular`中类似拼接`html`的方式也会得到警告。

> 一般来说，从脚本拼接`HTML`是有风险的，因为很容易无意中受到[cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting)攻击。

但是作为一个静态博客而言，没有用户信息，一般也不会有这方面的影响，因此我们使用`dangerouslySetInnerHTML`这个属性。

```jsx
{
    model.content ?
    <div dangerouslySetInnerHTML={{__html: model.content}}></div> :
    <div><Loading/></div>
}
```
这样浏览器就可以正常解析`HTML`代码了。

### Loading
可以看到，上面我使用了一个`<Loading/>`组件，该组件为数据还未请求到时显示。用法很简单，每次在输出内容是检查该内容是否为空（即是否请求到），如果没有，则显示改组件，否则显示内容。效果如下。

![](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/node-react/node-react5/node-react5-2.png)

我这里在三元表达式中判断完成后，返回组件的时，并没有使用`return`。这是因为在`react`中，组件——其实是一种表达式的存在。可以观察`babel`转义后的代码，`react`调用了`createElement`这个方法去生成它的虚拟DOM。

如果直接看`babel`简单来演示转义后的代码就可以很明白的看到这个原理。这里我在babel/repl中简单演示下。

#### 表达式 ？== 组件  （原理演示）

浏览器打开 https://babeljs.io/repl，建立两个`components`

```javascript
import React, {Component} from "react";
class Loading extends Component {
  render() {
    return (
      <div>Loading...</div>
    )
  }
}

export default class App extends Component {
  render() {
    let a = -1;
    return (
        a > 0 ? "data ready" : <Loading/>
    )
  }
}
```
假设以变量`a`为数据请求的标志

- `a > 0`表示数据请求完成，显示内容
- `a < 0` 表示数据还未请求到，显示`Loading`

这时，看右边实时转义后的代码。

```
...
var App = function (_Component2) {
  _inherits(App, _Component2);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      var a = -1;
      return a > 0 ? "data ready" : _react2.default.createElement(Loading, null);
    }
  }]);

  return App;
}(_react.Component);
...
```
这是`App Component`中的内容，注意这几行代码

```
 _createClass(App, [{
    key: "render",
    value: function render() {
      var a = -1;
      return a > 0 ? "data ready" : _react2.default.createElement(Loading, null);
    }
  }]);
```
`react`在引入`<Loading/>`组件时，创建了一个叫`loading`的元素。这样就可以理解，为什么不需要`return`一串`html`。

## 总结

以上内容，包括前4次的记录，总计5篇内容，已经将项目的所有基础内容涵盖。目前已经在 https://beace.tech 上发布。

- [Clean Blog by Node && React 1](https://beacelee.com/post/node-react-1.html)
- [Clean Blog by Node && React 2](https://beacelee.com/post/clean-blog-react-node-2.html)
- [Clean Blog by Node && React 3](https://beacelee.com/post/clean-blog-react-node-3.html)
- [Clean Blog by Node && React 4](https://beacelee.com/post/clean-blog-react-node-4.html)
- [Clean Blog by Node && React 5](https://beacelee.com/post/clean-blog-react-node-5.html)

**有以下几个关键知识点**

- `node/expressjs` 后端项目结构的构建
- `react/webpack` 前端项目结构的构建
- 上述两者结合的项目整体架构
- `expressjs + mongodb`的增、删、改、查（其实获取详情也是一种查的基础体现）的实现
- `expressjs`增、删、改、查API 的书写
- `markdown`的使用
    - 编辑器的使用
    - `markdown to html`
    - `react/browser string to html`
- 以及一些细节
    - `loading`的实现
    - 部分原理的讲解

