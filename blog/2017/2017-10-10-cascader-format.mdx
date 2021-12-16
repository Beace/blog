---
title: Cascader Format
date: 2017-10-10T17:43:20
updated: Mon Nov 20 2017 18:18:48 GMT+0800 (CST)
comments: 1
categories: js
tags:
  - JavaScript
permalink: Cascader-format
---

### 功能

将无序的`[Object Array]`类型转化为级联选择（Cascader）的数组

<!--more-->

### 数据结构

```js
const a = [{
  id: 1000,
  value: 'IT-123'
}, {
  id: 1001,
  value: 'IT-456'
}, {
  id: 1002,
  value: 'IT-789'
}, {
  id: 1003,
  value: 'EC-000'
}, {
  id: 1005,
  value: 'EC-111'
}, {
  id: 1006,
  value: 'EC111',
}];
```

### 原理

通过寻找数组的相同点，构造哈希匹配来实现，减少复杂度和寻址效率。这里之所以这样做，是因为数据的灵活性，既可级联，又可作为长列表。

```js
const b = {};
for (let i = 0; i < a.length; i++) {
  const id = a[i].value.split('-');
  if (!b[id[0]]) b[id[0]] = [];
  b[id[0]].push({
    value: id[1] || id[0],
    label: a[i].id,
  });;
}
// 构造级联
const cascader = Object.keys(b).map(item => ({
  label: item,
  value: item,
  children: b[item],
}));
```

### Screenshot

![](https://beimg.oss-cn-beijing.aliyuncs.com/cascader.jpg!ace)