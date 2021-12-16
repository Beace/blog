---
title: display:inline-block不对齐问题
date: 2016-09-10T20:49:02
updated: Wed Sep 21 2016 13:59:17 GMT+0800 (CST)
comments: 1
categories:
tags:
  - JavaScript
permalink: display-inline-block
---

#### 需求描述：

书写一个导航栏，使用`display`的`inline-block`属性进行布局。
导航栏内容：`<h1>title</h1>`和
```html
<ul>
    <li>item1</li>
    <li>item2</li>
    ...
<ul>
```
构成。
提示：使用最简单的`DOM`结构,拒绝一切多余嵌套`<div></div>`。

<!--more-->
展现形式，如下图：
![alt](/static/upload/201609/f_vFCxklQE92EyZzdKHQx4RO.png)

#### 实现方式

建立简单的`DOM`结构如下代码：(忽略其中的`<NavLink/>`，此为`react`实现的`router`).
```html
<ul role="nav" className="nav">
    <li><h1>React Router Tutorial</h1></li>
    <li><NavLink to="/" onlyActiveOnIndex>Home</NavLink></li>
    <li><NavLink to="/about">About</NavLink></li>
    <li><NavLink to="/repos">Repos</NavLink></li>
    <li><NavLink to="/checkbox">checkbox</NavLink></li>
</ul>
```
添加相应的css代码如下。
```css
.nav{
    width: 100%;
    height: 60px;
    background: #333333;
}
.nav li h1{
    display: inline-block;
    color: #fff;
    margin: 0 30px 0 30px;
}
.nav li{
    display: inline-block;
    height: 60px;
    line-height: 60px;
    text-align: center;
}
.nav li a {
    color: #aaaaaa;
    display: block;
    text-decoration: none;
    padding: 0 10px;
    cursor: pointer;
}
.nav li a.active {
    color: #fff;
    background: #555;
}
```
展示效果如下。

![alt](/static/upload/201609/he2YNRU8L5gS64ECviAggoMX.png)

可以看到，`nav`中没有和`h1`中的内容对齐，反而往下移动了一部分。其实，是和`h1`对齐的，只不过在不同标签中，对齐的方式有所区别，可以看到，`nav`中的文字内容，是和h1中的文字内容底部是对齐的。如果在该`ul`的`li`中，没有`h1`，只有`a`，则不用进行以下内容。如果有，请看below。
解决方案

需要在li中添加，`vertical-align: center`属性进行垂直居中。由此可见，`vertical-align`属性是相对于父容器的，而不是像`text-align`相对于本身。
完整`CSS`代码
```css
.nav{
    width: 100%;
    height: 60px;
    background: #333333;

}
.nav li h1{
    display: inline-block;
    color: #fff;
    margin: 0 30px 0 30px;
}
.nav li{
    display: inline-block;
    height: 60px;
    line-height: 60px;
    text-align: center;
    vertical-align: middle; /*垂直居中*/
}
.nav li a {
    color: #aaaaaa;
    display: block;
    text-decoration: none;
    padding: 0 10px;
    cursor: pointer;
}
.nav li a.active {
    color: #fff;
    background: #555;
}
```
### 最终展示结果

![alt](/static/upload/201609/vg1FaSYlLAZx5ZJR5auh5lN_.png)

### Tips

可以在Chrome中的控制台进行CSS代码的调试，取消`line-height`或者`vertical-align`,有惊喜 !