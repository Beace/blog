---
title: react的缺点（一）：react中多个component的问题记录
date: 2016-09-12T16:53:48
updated: Mon Sep 12 2016 16:54:26 GMT+0800 (CST)
comments: 1
categories:
tags:
  - JavaScript
permalink: react-bad-condition
---

在使用｀react｀创建多个component的过程中，
`React.createClass();`
该方法创建的`component`在使用上注意以下几个方面：

- `return()`方法中加入多个的`component`会报错。

<!--more-->
因此，需要在`return`中最外层加入一个标签，具体代码如下：

//正确书写如下：
```js
const Page = React.createClass({
   render: function() {
       return (
           <div>
               <Nav/>
               <Container hello={this.props.hello}/>
           </div>
       )
   }
});
```

//错误书写如下：
```js
const Page = React.createClass({
   render: function() {
       return (

               <Nav/>
               <Container hello={this.props.hello}/>

       )
   }
});
```
错误原因：

[官方解释](https://facebook.github.io/react/tips/maximum-number-of-jsx-root-nodes.html)
https://facebook.github.io/react/tips/maximum-number-of-jsx-root-nodes.html

> Maximum Number of JSX Root Nodes

> Currently, in a component's render, you can only return one node; if you have, say, a list ofdivs to return, you must wrap your components within a div, span or any other component.

> Don't forget that JSX compiles into regular JS; returning two functions doesn't really make syntactic sense. Likewise, don't put more than one child in a ternary.

### 缺点描述以及合理的解决方案
在一个组件的render函数中，只能返回一个节点，如果多个组件（节点）罗列，是不允许的。因此如果想返回多个，需要添加额外的`div`，当你的组件越来越多，越来越细化的时候，会生成许多无用的`div`标签。因此，应在最外层引用组件的时候，减少`<div></div>`的使用，使用恰当的布局来规避这个问题。




