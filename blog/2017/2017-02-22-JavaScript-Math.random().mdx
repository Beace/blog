---
title: JavaScript-Math.random()
date: 2017-02-22T11:58:00
updated: Wed Feb 22 2017 11:59:01 GMT+0800 (CST)
comments: 1
categories:
tags:
  - JavaScript
permalink: javascript-math.random
---

# Math.random()

## 伪随机
`Math.random()`返回的是一个**左闭右开** `[0,1)`的伪随机浮点数。之所以称作伪随机，是因为整个过程看起来像是最随机的，如下图，我们也看到了随机数的分布。但是实际上并不是。不是的原因是——我们是借助一个固定的方法来获取数据。并且数据最终是可控的，因为我们固定了它的区间。

<!--more-->
虽然我们借助了原生的API来进行随机数的选取，但是，函数本身具有`round-to-nearest-even`的特性，所以严格意义上来说并不精确。

还有一个原因也会导致不精确的问题就是计算机是以二进制的移位、取反、进位等操作来计算，尤其是浮点数之间的计算，不可能保证百分之百的精确，例如下面这段代码，就能够解释这一问题。

```javascript
2.3/10 //0.22999999999999998
```

> 在计算伪随机数时假如使用的开始值不变的话，那么伪随机数的数序也不变。伪随机数的随机性可以用它的统计特性来衡量，其主要特征是每个数出现的可能性和它出现时与数序中其它数的关系。伪随机数的优点是它的计算比较简单，而且只使用少数数值很难推算出计算它的算法。一般人们使用一个假的随机数，比如电脑上的时间作为计算伪随机数的开始值。
>——[维基百科-伪随机性](https://zh.wikipedia.org/wiki/%E4%BC%AA%E9%9A%8F%E6%9C%BA%E6%80%A7)

![Math.random()](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/Math.random/math.random.png)

假设选取区间足够大，随机性就比较高，可靠性也比较强。就可以**忽略边界值**的问题。

## 随机数

了解了随机数原理，我们可以尝试来进行随机数的选取。可以简单的通过`Math.random() * n`的方式来进行定义随机数的区间范围。

- `[0, n)`随机数选取

下图是选取了`[0,5)`范围内的随机浮点数。

![Math.random() * n](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/Math.random/math.random*n.png)

- `[m, n]`随机数选取

下图是选取了`[m, n]`范围内的随机浮点数。

```javascript
//m n 为整形
function getM2NRandom(m, n) {
  return Math.random() * (n - m) + m;
}
```
![Math.random() * (m -n) + m](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/Math.random/math.random.mn.png)

## 取整数

在实际的`JavaScript`开发当中，往往讨论不到或者说用不到这么高深的问题。并且经常会选取随机整数来进行计算。可以借助`JavaScript`的函数来解决这样的场景。不过在这之前，先来回顾下取整函数。

- `Math.ceil()`

如果是浮点数，直接取浮点数的`整数+1`，可以看做是向上取整，或向后取整。如果是整数，或者小数位全是`0`,就是其本身

```javascript
Math.ceil(2.44444) // 3
Math.ceil(2.99944) // 3
Math.ceil(2) // 2
```

- `Math.floor()`

如果是浮点数，直接取浮点数的`整数部分`，可以看做是向下取整，或者是向前取整。如果是整数,或者小数位全是`0`,就是其本身。

```javascript
Math.floor(2.44444) // 2
Math.floor(2.99944) // 2
Math.floor(2) //2
```

## 随机整数

- `[0, n)随机取整`

在了解随机数和取整之后，就可以进行随机取整了。例如如下代码。

```javascript
function getIntRandom(n) {
  console.log(Math.ceil(Math.random() * n));
  console.log(Math.floor(Math.random() * n));
}
getIntRandom(10);
```
![math.random.int](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/Math.random/math.random.int.png)

- `[m, n]`随机取整

```javascript
function getIntM2NRandom(m , n) {
  return Math.floor(Math.random() * (n - m + 1) + n)
}
getIntM2NRandom(2, 5);
```

![math.random.int.mn](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/Math.random/math.random.int.mn.png)

这样的随机取整方式，也解决了取不到n的问题。


## 实际应用

从n个人中随机抽取m个人（m < n）,抽奖代码。以下代码截取自`月影博客`的`5分钟现场撸代码——谈总结会抽奖程序`（https://www.h5jun.com/post/luckey-draw-in-5-minutes.html）

```javascript
//初始化一个 1~62 的数组
const cards = Array(62).fill().map((_,i)=>i+1);
// 一次抽取 n 个，默认一次 1 个
function draw(n = 1){
    var ret = [];
    for(var i = 0; i < n; i++){
        let idx = Math.floor(cards.length * Math.random());
        ret.push(...cards.splice(idx, 1));
    }
    return ret;
}
//抽取一次，10个中奖者
console.log(draw(10));
```
