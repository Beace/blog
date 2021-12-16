---
title: ECMASCRIPT6 -- 碎片化记忆
date: 2017-08-24T16:11:35
updated: Mon Apr 24 2017 16:11:48 GMT+0800 (CST)
comments: 1
categories: js
tags:
  - JavaScript
permalink: ecmascript6-feature
---

## 变量交换

交换`x`,`y`值

```javascript
let x = 1, y = 2;
[x, y] = [y, x]; // x = 2, y = 1
```

<!--more-->
## 术语

-  模板字符串 （template string)

```javascript
let greeting = `hello, ${name}`;
```

- 扩展运算符 (...)

## 定义原生方法

例如：`Number`对象，具有`toString(),parseInt(),parseFloat()`等方法，如果我们想定义一个全局、或者模块化的方法该如何定义呢？



```Javascript
Object.defineProperty(Number, 'lager30', {value: function lager30(value) {
  return typeof value === 'number' && value > 30;
}});
// 此时Number对象具有了large30属性，可以像如下方式调用
Number.lager30(20); // false
Number.lager30(50); // true
```



## Math对象新增的方法

#### Math.trunc()

- ` 用于获取Number`类型数据的整数部分，也可以进行`parseInt()`浮点数转整数的操作****

兼容写法

```javascript
Math.trunc = Math.trunc || function(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
}
```

#### Math.sign()

- 用于判断正负数和0

| 返回值  | 解释                |
| ---- | ----------------- |
| +1   | 表示正数              |
| -1   | 表示负数              |
| 0    | 表示0               |
| -0   | 表示-0              |
| NaN  | 表示参数非Number类型或未传参 |

*技巧*：字符串转整数

```javascript
let a = "123";
a = +a; // 123
```

## 运算符

#### 指数运算符

```Javascript
let a = 2 ** 3; // 8
```



> 注意，在 V8 引擎中，指数运算符与`Math.pow`的实现不相同，对于特别大的运算结果，两者会有细微的差异。

#### 扩展运算符

所谓类似数组的对象，本质特征只有一点，即必须有`length`属性。因此，任何有`length`属性的对象，都可以通过`Array.from`方法转为数组，而此时扩展运算符就无法转换。

```javascript
foo() {
  console.log(arguments);
  console.log(...arguments)
  console.log([...arguments]);
  // || Array.from(arguments) || [].slice.call(arguments);
}
foo(1,2,3);
```

![](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/arguments/arguments.png)

## Array

- `Array.from(arrayLike[, callback])`

  类数组的转化，同上例子。callback是一个迭代器，可以对得到的数组进行二次处理，下面获取了元素的二次方。

  *注意*： `Array.from()`与扩展运算符（...）都会讲数组中的空位转为`undefined`。

```javascript
Array.from(arrayLike, function(item) {
  return item ** 2
});
// ES6
Array.from(arrayLike, item => item ** 2);
```

- 将字符串转化为数组

  ```javascript
  Array.from('123456') // ['1','2','3','4','5','6'];
  ```

- `Array.fill()`

  填充数组，覆盖掉原数组中的原值

```javascript
['1'].fill(2); // [2]
new Array(2).fill(3) // [3, 3]
```

- `Array.includes()`

  检测数组中是否包含某个元素

```Javascript
[1,2,3].includes(1); // true
//与indexOf的区别
[NaN].includes(NaN) // true
[NaN].indexOf(NaN)  // false
```

- `forEach()`, `filter()`, `every()` 和`some()`都会跳过空位。
- `map()`会跳过空位，但会保留这个值
- `join()`和`toString()`会将空位视为`undefined`，而`undefined`和`null`会被处理成空字符串。
- `entries()`、`keys()`、`values()`、`find()`和`findIndex()`会将空位处理成`undefined`。

