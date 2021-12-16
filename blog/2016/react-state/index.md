---
title: react中state变化导致的问题
date: 2016-10-10T11:58:23
updated: 2016-10-10T11:58:23
comments: 1
categories:
tags:
  - JavaScript
permalink: react-state-change-problem
---

### 问题描述

假设，有这样两个`jsx`文件

- `form.jsx`（具体描述的表单文件，包含具体的`html`代码：`input`和`button`等，一下称为子文件）
-  `page.jsx`（引用上一个文件，可简单称为上一个`component`的父亲，包含需要执行事件的具体逻辑，以下称为父文件）

父文件通过这样的代码来引用子文件：
```jsx
<Form companyList={companyList} ref="form"/>
```
并且通过`ref`的属性来获取子文件中填写的数据，然后进行提交。事件则通过`props`传递到子文件的`button`上。

<!--more-->
假设提交之前，需要对某些数据进行一些处理，比如`%`需要进行除以`100`的操作，在函数`submitHandler()`中添加了如下代码：
```jsx
//model为用户填写的数据
model.rate = (model.rate / 100).toFixed(5);
```
提交之后，某个字段在数据库中已经存在并且不能重复，此时，后端抛出异常，在前端捕获到后提示用户，该字段输入错误。此时，页面没有进行任何的`500`错误跳转，当再次修改此字段，触发该输入框的`onChange`事件时，发现输入框中`rate`却发生了变化，自动执行上述代码，而第二次改动并没有执行`submitHandler()`。

**用简单的语言描述就是：**

当我想在`input`中填写的数据跟提交的真实数据不相同时，会产生上述问题。

### 问题原因

主要是触发`submitHandler()`方法，此时的state已经被重置为计算后的值，由于页面还没有`re-render`，所以看不到直观的变化。当`onChange`触发后，`state`又一次更新，触发`render `，使得`UI update`。

**所以出现了改变当前字段而其他字段发生变化的假象！**

> 可以从这里找到[react的建议](https://facebook.github.io/react/docs/interactivity-and-dynamic-uis.html#what-should-go-in-state)。`state`中应该保持最原始的数据记录，不应该包含太多复杂的逻辑，如果需要对`state`二次加工，大可放到`render()`中进行。而这个建议好像不太符合问题的描述，但该建议至少可以提醒我们应该在合适的地方对`state`进行`simple computed`。

### 解决办法

既然不能显式的改变`state`，那么利用原始数据处理后再覆盖掉原始数据的做法，进行提交操作就变得不可行。

因此，可以可以定义一个变量来存储改变后的值，而不是直接用`state`，通过`lodash`中的`_.assigin()`方法，可以对数据进行整合和覆盖，此方法是`ES6`中`Object.assigin`的一个扩展，写法如下：
```js
_.assign(object, [sources])
```
> 参数含义：
- `object (Object)`: The destination object.
- `[sources] (...Object)`: The source objects.

>返回值：

> `(Object)`: Returns object.

**具体代码**
```jsx
let data;
data = _.assign({}, model, {
        rate: (model.rate / 100).toFixed(5)
});
```
该方法为从右向左的计算方式，如果`model`中含有`rate`,则将`model.rate`覆盖，如果不含有则添加`rate`属性，以此类推。

### 总结

> 上述情况，数据处理时，通过定义变量保存`state`中的数据，可以有效避免`state`因为其他事件触发而导致`UI`显示的问题。比起粗暴地将`state`直接覆盖，更加地严谨。


