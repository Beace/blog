---
title: ES6 在数组方面的扩充
date: 2018-12-13T19:00:23
---

数组可谓是在JavaScript中最常用的数据结构了，下面来盘点一下ES6在数组中新增的功能。

## Array.of
### 背景
在JavaScript中声名一个数组有多种方式，常见的有以下两种

```javascript
const arr = []; // 1
const arr = Array(); // 2
```

第一种往往用的最多，通常直接实例化一个Array，类似于 new Array 的写法，第二种不太常用，直接使用构造器声名一个数组。

### 解决的问题
Array.of 的出现，也是为了解决第二种存在的问题。首先通过构造器声名一个数组可以传递r若干数组元素，如果只有一个数值参数，那么数值的作用确实来定义数组的长度的。例如 `const a = Array(3)`, 这里定义了数组的长度为3，这里存在一个问题，数组`a`的长度的确为3，由于没有进行数据的初始化，所以 a[0],a[1],a[2]都为 `undefined`,但是其实数组内都是空元素。空元素（empty）和 undefined 虽然说表现形式一样，都可以通过for 循环来迭代，但是，部分Array原型链上的函数会跳过空元素。例如map方法。

```javascript
const a = Array(3);
a.map(item => console.log(item)) // [empty * 3]
const b = [undefined, undefined, undefined];
b.map(item => console.log(item)) // 输出3个undefined
```

于是就有了Array.of 方法来避免这个问题。

```javascript
Array.of(1) // [1]
```

### 总结
不过虽然有了这样的方法，但是还是不常用，对于有人说方便传递参数类似这种形式，但是早就已经有其他替代方案去解决。同事也提示我们注意一个问题，**尽量避免在数组中存在空元素**。


## Array.from(iterable, [callback])
### 背景
Array.from 常常被人们用来将“类数组”转化为数组。它首先检查第一个参数是否可迭代。如果可迭代，他会将元素同一的copy到数组中。

```javascript
const obj = {
	length: 2,
	0: 'B',
	1: 'L',
};

Array.from(obj) // ['B', 'L']
```

### 解决的问题
除了能将“类数组”转化为数组之外，还可以避免上面说的空槽位（empty）现象。

```
Array.from({ length: 3 }) // [undefined, undefined, undefined]
```


Array.from 第二个参数为回调函数，可以实现类似map的功能。

```javascript
const a = Array.from(obj, item => {
	return item.toLowerCase(); // ["b", "l"]
})
```


## Array.copyWithin(target, start, end)
### 背景
额…我实在我清楚这个方法到底是为了适应什么场景，对我而言，貌似是为了节省内存？

### Feature
copyWithin(target, start, end) , 顾名思义，是在数组内部进行的copy。copy的是内部的数据，改变的也是内部的数据。也就是说，该方法不会增加数组长度，并且会覆盖原数组。例如在下面的数组a中copy 从第三个元素开始覆盖，并且从第1个元素copy。

```javascript
const a = [1,2,3,4,5];
a.copyWithin(2, 0);
console.log(a); // [1, 2, 1, 2, 3]
```

我们定义数组长度为变量`len`,目标元素和复制的起始位置分别为`target`，`start`。

加入在复制过程当中，`len - start > len - target`,那该过程也会到此为止，不会再继续覆盖。此时看起来好像是从左到右进行一次复制覆盖，当`target - start = 1`时，也就是`a.copyWithin(2, 1);`.此时，看上去会出现这样的情况`[1,2,2,2,2]`。我们来分析下这个过程。

> 1. 数值 3 被选为目标，2 (start = 1 )  被选为开始复制的元素，copy 2 -> cover 3, 数组变为 [1,2,2,4,5]
> 2. 数值 4 被选为目标，2（start = 2）被选为开始复制的元素，copy2 -> cover 4,数组变为[1,2,2,2,5]
> 3. 数值 5 被选为目标，2（start = 3）被选为开始复制的元素，copy2 -> cover 5,数组变为[1,2,2,2,2]

但是事实上运行结果应该是 `[1,2,2,3,4]`。显然，此时复制算法是从右向左进行。

如果上述参数某一个为负值，则是按照数组结束的相对位置进行复制。

## Array.fill(item, start, end)
### 背景
在一开始我们说到数组初始化没有赋值的问题，因此需要有一个可以用来对数组进行赋值，并且相对灵活的方式。例如，第三个到第五个需要赋值，其他都为 `undefined`。

### 解决的问题
Array.fill 字面意思就是填充数组，调用方式如下。

```javascript
Array(3).fill(3) // [3, 3, 3]
```

还可以定义其他两个参数

```javascript
// [undefined, 0, 0, 0, 0]
Array.from({ length: 5 }).fill(0, 1, 5)
```

### 总结
Array.fill 在初始化一些重复的值还是有很大作用。可以设置默认数组携带的元素。

## Array.find()
### 背景
以往我们来寻找数组中的某个元素时，可以通过迭代它，来判断元素是否为目标元素。或者通过indexOf,some方法来找到是否存在当前元素。

### 解决的问题
上述的两种方式分别返回数组的索引和一个布尔值。是否有某个方法直接可以找到该数组的元素值呢？

Array.find 解决了这一问题。通常我们用来寻找比较复杂的数据结构。类似下面这样。

```javascript
const arr = [{ name: 'B', age: 10 }, { name: 'L', age: 24 }];
// {name: 'B', age: 10}
const targetItem = arr.find(item => item.name === 'B');
```

### 总结
在此多说一嘴，Array.some 在查找当前元素是否存在并且我们不需要其他返回的生活，有些性能上的优势。some在找到之后立即停止查找，所以不会多余的迭代数组。

## Array.findIndex()
### 背景
通常取某个数组元素的下标时，都会通过 indexOf,来获取，当数组中元素数据结构比较复杂，在indexOf中强行判断貌似不是一个很好的解决办法。

### 解决的问题
是否可以通过传入函数的方式，类似find 的形式，增加一些其他逻辑，来精确比较某一项。findIndex 方法解决了这一问题。

```javascript
const arr = [{ name: 'B', age: 10 }, { name: 'L', age: 24 }];
// 0
const targetIndex = arr.findIndex(item => item.name === 'B');
```

### 总结
之前经常看到这样的代码，`xxx.indexOf(xxx) > -1`，当然可以，不过上面说过了更好的办法，通过some去寻找更佳。因此findIndex最好也不要这样使用。

## 其他
除上述方法之外，数组还增加了 `entries.values,keys` 等方法。类似于类Object的形式。我们放在Object的ES6 Feature在详细说。
