---
title: JavaScript Not defined or Undefined
date: 2016-10-31T20:16:31
updated: Mon Oct 31 2016 22:17:59 GMT+0800 (CST)
comments: 1
categories:
tags:
  - JavaScript
permalink: javascript-not-defined-or-undefined
---

> 何为浏览器报错，何为程序报错？

浏览器报错往往会阻止之后程序运行，比如，浏览器在出现问题后报错该页面其他依赖于该程序的都不会正常执行，程序往往会阻塞在报错的那一处；
程序报错如果对上下文不产生依赖，往往可以继续执行，不影响其他代码运行。

<!--more-->
### 举例

定义一个变量`a`,不进行初始化，对`a`进行下一步操作。
```js
var a;
console.log("a:" + a);
```
控制台没有报错，只是输出了：
```js
a:undefined
```
如果`a`,没有进行定义，直接输出：
```js
console.log(a);
```
浏览器会抛出这样的异常：
```js
Uncaught ReferenceError: a is not defined(…)
```

这里的`not defined`和`undefined`可不是同样的意思。
> `not defined`是没有找到变量，是内存中没有定义，也没有为`a`变量开辟区间,编译器找不到`a`引用，所以报错

> `undefined`是`a`已经定义，存在这样的一个引用，只不过该变量的值为`undefined`

我们经常有这样的写法来判断`a`中的值来对数据进行处理。

```js
a ? a : 0
```
这样的三元运算符在`javascript`数据处理中非常常见，尤其是在`react`这种数据需要预定义的库中，更有很大的应用。

### 复杂的数据结构

其实在实际项目中，数据结构是非常复杂的，常常包含着数据的嵌套，往往需要处理一个`object`类型的数据。例如需要提交这样数据结构的表单数据：
```json
{
    model: {
        title: "javascript object",
        content: "object content",
        author: ["Dan", "Jerry"],
        ...
        time: null
    }
}
```
进行数据提交的时候还好，因为初始值都为空，不需要对一些表单进行赋值。如果是对于修改操作呢？好像直接赋予值就好了。但是这里存在着一点点的基础数据处理的操作，往往基础不牢靠的人会犯这样的错误。例如下面一段代码：

```js
let model = this.props.model;
this.state = {
    model: {
        title: model.title ? model.title : null,
        content: model.content ? model.content : null,
        author: model.author ? model.author : [],
        ···
        time: model.time ? model.time : null
    }
}
```
这是`React`进入一个修改页面时，传入`input`中的值。这样的数据结构和判断，好像看起来没有什么问题。也用了三元运算符去解决数据没有定义的问题。但是`model`呢，假如一开始`model`就没有定义，直接去判断`model.title`,是否就复现了浏览器报错这一问题？答案是肯定的。

> 当数据比较复杂，层级嵌套比较多，需要一层一层去判断，上述这样的情况，只会满足`model`已经定义并且是`object`类型，再去获取其属性，如果`model`还未定义或者不是`object`类型，直接获取，浏览器当然会报出找不到该`model`的错误。

例如下面代码`model`不为`object`类型的错误示例：
```js
var model;
model.a = "I am a property of model!"
console.log(model.a);
//Uncaught TypeError: Cannot set property 'a' of undefined(…)
```
*那用什么方式可以避免呢？*

别着急，再看另一种做法。

```jsx
let model = this.props.model;
this.state = {
    model: {
        title: model && model.title ? model.title : null,
        content: model && model.content ? model.content : null,
        author: model && model.author ? model.author : [],
        ···
        time: model && model.time ? model.time : null
    }
}
```
这样的做法是合理的。但不是最佳的，为了代码简洁，我们可以这样写。

```jsx
let model = this.props.model ? this.props.model : {};
this.state = {
    model: {
        title: model.title ? model.title : null,
        content: model.content ? model.content : null,
        author: model.author ? model.author : [],
        ···
        time: model.time ? model.time : null
    }
}
```
**我们假设`model`是一定存在的这样的做法(因为`model`是父组件传递到子组件中-`react`的数据传递方式)**。提供了一个简单的判断，这里检查了`model`中是否有值，如果为`undefined`或者`null`则赋予其`{}`，然后再为其添加属性。

> 这里我们保证了`model`无论如何是一个`object`

**这里很容易发现，如果我们没有定义一个变量`a`，直接使用，就会出现not defind的错误，如果model是一个对象，里面没有a这个属性，我们model.a却不会报错。**

*这是为什么呢？*

我猜想，这是`javascript` `object`类型的特性。`javascript`中可以动态添加并且设置属性，例如我们想生成上述数据结构，直接定义就可以，想要重置某个属性的值，直接书写
```js
model.a = "a has been rewrited"
```
> **去请求`model.a`是否有值，其实是同时定义了`model.a`这个属性，只是其没有被赋值而已。**

> 所以，在复杂数据处理中，非常需要注意`not defined`和`undefined`的错误原理，才能够写出容错率更强的代码。