---
title: 【译文】理解 JavaScript 中的 for…of 循环
date: 2018-12-23T17:00:23
---
> 原文链接： [Understanding the For…of Loop In JavaScript](https://blog.bitsrc.io/understanding-the-for-of-loop-in-javascript-8aded97d7ef8)

在  JavaScript 中，我们有很多循环语句。

- `while` 语句
- `do...while` 语句
- `for` 语句
- `for...in` 语句
- `for...of` 语句

所有这些语句都有一个最基础的共同功能：他们会一直重复，直到到达某个条件。

在这篇文章，我们将研究 `for…of` 表达式来查看它是如何工作的并且如何在 JavaScript 应用中利用它书写更好的代码。

技巧：使用 [Bit](https://github.com/teambit/bit)  构造一个 js 应用是非常快速的。使用 Bit 可以快速的在不同项目中分享和复用公共组件，可以在团队中分享，就像玩乐高那样简单。你可以免费使用它。

## for…of
`for…of` 是 `for` 语句的一种循环 `iterables(iterable objects)`（可迭代对象） ，直到它到达它的终止条件的一种形式。

下面是一个简答的例子。

```javascript
let arr = [2,4,6,8,10]
for(let a of arr) {
    log(a)
}
// It logs:
// 2
// 4
// 6
// 8
// 10
```

我们可以用比 `for` 语句更少的代码来迭代数组 `arr`。

```javascript
let myname = "Nnamdi Chidume"
for (let a of myname) {
    log(a)
}
// It logs:
// N
// n
// a
// m
// d
// i
//
// C
// h
// i
// d
// u
// m
// e
```

你应该直到，如果使用循环，我们不得不使用相关的数学知识和逻辑来计算到达循环 `myname` 的终点并推出程序。但是 `for…of` 语句帮我们解决了这个头疼的问题。

正如我们看到的，`for..of`  一般有以下定义：

```javascript
for ( variable of iterable) {
    //...
}
```

- `variable` 保存了每次迭代的 iterable 中对象的值
- `iterable` 是要被迭代的对象

## Iterables and Iterator (迭代对象和迭代器)

在 `for…of` 循环的定义中，我们说它“循环遍历可迭代对象（iterable objects）”。因此有了上述定义就意味着 `for...of` 只能被用于可迭代的对象，否则不能使用 `for...of` 循环。

那么，什么是可迭代对象（Iterables）呢？

简单的说，可迭代对象是可以执行迭代的对象。在 ECMASCRIPT 2015  中加入了一个 `coupla `。这些新增内容是新协议。协议中包括Iterator协议和Iterable协议。

根据 Mozilla 开发者说，“iterable 协议允许 JavaScript 对象去定义或者自定义迭代行为，例如在 `for..of` 构造中循环的值。” 并且，“为了可迭代，对象必须实现 `@@iterator` 方法，意味着对象必须包含（或者在其原型链中包含）一个 `@@interator` 的属性，这个属性可以通过常量`Symbol.iterator`获得”

这实际上意味着，如果想要你的对象可以使用 `for…of` 进行迭代，它必须是可迭代对象（interables），换言之，必须具有 `@@iterator` 属性。这样才符合可迭代协议（iterable protocol）。

因此，当对对象具有 `@@iterator` 时，它就可以被 `for…of` ，`@@interator` 方法由 `for...of` 调用。`@@interator` 返回一个迭代器（interator）。

现在，可迭代协议定义了一种可以从对象中返回值的流的方式。迭代器必须实现 `next` 方法。`next` 方法需要遵守以下几个规则。

- 必须返回一个带有 `done` 属性的对象。类似`value {done, value}`
- `done` 属性是一个布尔值，表示是否到达流的末尾
- `value` 属性 保存当前周期的值

举个例子：

```javascript
const createIterator = function () {
    var array = ['Nnamdi','Chidume']
    return  {
        next: function() {
            if(this.index == 0) {
                this.index++
                return { value: array[this.index], done: false }
            }
            if(this.index == 1) {
                return { value: array[this.index], done: true }
            }
        },
        index: 0
    }
}
const iterator = createIterator()
log(iterator.next()) // Nnamdi
log(iterator.next()) // Chidume
```

基本上，`@@iterator` 返回了一个迭代器（interator），`for…of` 用来循环对象并且获取其值。因此，如果一个对象不包含`@@interator` 方法并且（或者）返回的不是一个迭代器（interator），`for…of` 语句不能正常迭代。

```javascript
const nonIterable = //...
 for( let a of nonIterable) {
     // ...
 }
for( let a of nonIterable) {
               ^
TypeError: nonIterable is not iterable
```

例如有一些可迭代对象：

- String
- Map
- TypedArray
- Array
- Set
- Generator

注意这里少了 `Object`。`Object`不是一个可迭代对象。如果我们尝试使用 `for…of` 循环去遍历 `Object` 中的属性:

```javascript
let obj {
    firstname: "Nnamdi",
    surname: "Chidume"
}
for(const a of obj) {
    log(a)
}
```

它将会抛出以下错误：

```javascript
for(const a of obj) {
               ^
TypeError: obj is not iterable
```

我们可以通过以下方式来检查一个对象是否为可迭代对象

```javascript
const str = new String('Chidume');
log(typeof str[Symbol.iterator]);
function
```

可以看到，它打印出了 `function`，这表明在 `String` 存在`@@iterator` 属性。如果我们尝试 `Object`:

```javascript
const obj = {
    surname: "Chidume"
}
log(typeof obj[Symbol.iterator]);
undefined
```

Woo!!  `undefined` 意味着不存在。

## for…of: Array
数组是可迭代对象。

```javascript
log(typeof new Array("Nnamdi", "Chidume")[Symbol.iterator]);
// function
```

这也是为什么我们可以使用 `for…of` 来遍历它的原因。

```javascript
const arr = ["Chidume", "Nnamdi", "loves", "JS"]
for(const a of arr) {
    log(a)
}
// It logs:
// Chidume
// Nnamdi
// loves
// JS
const arr = new Array("Chidume", "Nnamdi", "loves", "JS")
for(const a of arr) {
    log(a)
}
// It logs:
// Chidume
// Nnamdi
// loves
// JS
```

## for…of: String
`String` 也是可迭代对象。

```javascript
const myname = "Chidume Nnamdi"
for(const a of myname) {
    log(a)
}
// It logs:
// C
// h
// i
// d
// u
// m
// e
//
// N
// n
// a
// m
// d
// i
const str = new String("The Young")
for(const a of str) {
    log(a)
}
// It logs:
// T
// h
// e
//
// Y
// o
// u
// n
// g
```


## for…of: Map

```javascript
const map = new Map([["surname", "Chidume"],["firstname","Nnamdi"]])
for(const a of map) {
    log(a)
}
// It logs:
// ["surname", "Chidume"]
// ["firstname","Nnamdi"]
for(const [key, value] of map) {
    log(`key: ${key}, value: ${value}`)
}
// It logs:
// key: surname, value: Chidume
// key: firstname, value: Nnamdi
```

## for…of: Set
```javascript
const set = new Set(["Chidume","Nnamdi"])
for(const a of set) {
    log(a)
}
// It logs:
// Chidume
// Nnamdi
```

## for…of: TypedArray

```javascript
const typedarray = new Uint8Array([0xe8, 0xb4, 0xf8, 0xaa]);
for (const a of typedarray) {
  log(a);
}
// It logs:
// 232
// 180
// 248
// 170
```

## for…of: arguments
`arguments` 是可迭代对象吗？让我们来检验一下：

```javascript
// testFunc.js
function testFunc(arg) {
    log(typeof arguments[Symbol.iterator])
}
testFunc()
$ node testFunc
function
```

事实证明，它是的。如果我们更进一步调查，`arguments` 实际上是`IArguments`类型，并且实现`IArguments`接口的类具有`@@iterator`属性，该属性使参数可迭代。

```javascript
// testFunc.js
function testFunc(arg) {
    log(typeof arguments[Symbol.iterator])
    for(const a of arguments) {
        log(a)
    }
}
testFunc("Chidume")
// It:
// Chidume
```

## for…of: Custom Iterables
正如我们上面所说的，我们创建一个自定义的可迭代对象使得 `for…of` 可以遍历它。

```javascript
var obj = {}
obj[Symbol.iterator] = function() {
    var array = ["Chidume", "Nnamdi"]
    return {
        next: function() {
            let value = null
            if (this.index == 0) {
                value = array[this.index]
                this.index++
                    return { value, done: false }
            }
            if (this.index == 1) {
                value = array[this.index]
                this.index++
                    return { value, done: false }
            }
            if (this.index == 2) {
                return { done: true }
            }
        },
        index: 0
    }
};
```


我创建了一个对象 `obj`并且使他可迭代，我通过 `[Symbol.iterator]` 增加了`@@interator` 属性。然后， `function` 最终返回一个迭代器（interator）。

```javascript
//...
return {
    next: function() {...}
}
//...
```

记住，一个迭代器需要有一个 `next` 函数。

在 `next` 函数中，我定义的值将在迭代执行期间返回给 `for…of `。看上面的代码，你可以清楚的看到我做了什么。

让我们来测试一下 是用 `for...of` 遍历 `obj` 会得到什么：

```javascript
// customIterableTest.js
//...
for (let a of obj) {
    log(a)
}
$ node customIterableTest
Chidume
Nnamdi
```

是的，它正确执行了：）！

## 使对象和普通对象可迭代
普通对象(Plain objects)不可迭代，而且`Object`中的对象也不可迭代。

我们可以通过使用自定义迭代器将 `@@iterator` 添加到Object.prototype来实现。

```javascript
Object.prototype[Symbol.iterator] = function() {
    let properties = Object.keys(this)
    let count = 0
    let isdone = false
    let next = () => {
        let value = this[properties[count]]
        if (count == properties.length) {
            isdone = true
        }
        count++
        return { done: isdone, value }
    }
    return { next }
}
```


`properties` 变量保存使用 `Object.keys()` 获取的对象的属性。在 `next` 函数中，我们简单地返回了从 `properties` 中获取的每一个值并且更新了 `count`，从而使用 `count`作为索引从属性中获取下一个值。
当 `count` 等于`properties` 长度时，迭代就会停止。

通过 `Object` 来进行测试：

```javascript
let o = new Object()
o.s = "SK"
o.me = 'SKODA'
for (let a of o) {
    log(a)
}
SK
SKODA
```

成功执行了！

对于普通对象：

```javascript
let dd = {
    shit: 900,
    opp: 800
}
for (let a of dd) {
    log(a)
}
900
800
```

这样我们就可以将它添加为 polyfill ，在应用中使用 `for..of`。

## Using for…of on ES6 classes
我们可以使用 `for..of` 来遍历类实例中的数据列表。

```javascript
class Profiles {
    constructor(profiles) {
        this.profiles = profiles
    }
}
const profiles = new Profiles([
    {
        firstname: "Nnamdi",
        surname: "Chidume"
    },
    {
        firstname: "Philip",
        surname: "David"
    }
])
```

类 `Profiles` 具有一个 `profile` 属性包含一个数组 `users` 。我们可能需要在应用程序中使用 `for...of`展示此数据。如果我们这样做：

```javascript
//...
for(const a of profiles) {
    log(a)
}
```

显然，它不能正常工作。

```javascript
for(const a of profiles) {
               ^
TypeError: profiles is not iterable
```

需要让 `profiles` 迭代对象具有以下规则

- 对象必须包含 `@@iterator` 属性
- `@@iterator` 必须返回一个迭代器 `interator`
- `iterator` 迭代器必须有 `next`  方法的实现

我们通过 `[Symbol.iterator]` 来定义了 `@@interator`。

```javascript
class Profiles {
    constructor(profiles) {
            this.profiles = profiles
        }
        [Symbol.iterator]() {
            let props = this.profiles
            let propsLen = this.profiles.length
            let count = 0
            return {
                next: function() {
                    if (count < propsLen) {
                        return { value: props[count++], done: false }
                    }
                    if (count == propsLen) {
                        return { done: true }
                    }
                }
            }
        }
}
```

然后我们执行以下代码：

```javascript
//...
for(const a of profiles) {
    log(a)
}
$ node profile.js
{ firstname: 'Nnamdi', surname: 'Chidume' }
{ firstname: 'Philip', surname: 'David' }
```

`profiles` 属性正确展示了。

## 异步迭代器（Async Iterator）
ECMAScript 2018引入了一个新的构造，以便能够遍历Promises数组，这个新构造是 `for-await-of` 和一个新的 `Symbol` `Symbol.asyncIterator`。

`Symbol.asyncIterator` 函数是一个可以返回 `promise` 迭代器的可迭代对象。

```javascript
const f = {
    [Symbol.asyncIterator]() {
        return new Promise(...)
    }
}
```


`[Symbol.iterator]` 与 `[Symbol.asyncIterator]` 的区别在于前者返回 `{ value, done }`, 后者返回 promise resolve `{ value, done }`。

上面的`f` 函数类似下面这样：

```javascript
const f = {
    [Symbol.asyncIterator]() {
        return {
            next: function() {
                if (this.index == 0) {
                    this.index++
                        return new Promise(res => res({ value: 900, done: false }))
                }
                return new Promise(res => res({ value: 1900, done: true }))
            },
            index: 0
        }
    }
}
```

`f` 是异步可迭代的对象。你可以看到它返回了一个 `promise`, Promise  的 `resolve` 方法在每一个迭代中都返回了 `value`。

要迭代`f`，我们将不会使用 `for..of` 而是我们将使用新的 `for-await-of`这样：

```javascript
// ...
async function fAsyncLoop(){
    for await (const _f of f) {
        log(_f)
    }
}
fAsyncLoop()
$ node fAsyncLoop.js
900
```

我们可以使用 `for-await-of` 来循环一个 Promise 数组。

```javascript
const arrayOfPromises = [
    new Promise(res => res("Nnamdi")),
    new Promise(res => res("Chidume"))
]
async function arrayOfPromisesLoop(){
    for await (const p of arrayOfPromises) {
        log(p)
    }
}
arrayOfPromisesLoop()
$ node arrayOfPromisesLoop.js
Nnamdi
Chidume
```

## 总结
在这篇文章中，我们深入挖掘了`for... of`循环。我们首先定义`for..of`是什么，然后继续看看是什么使得可迭代。然后，我们查看了JS中完整的可迭代列表，并浏览了它们中的每一个，以了解如何使用它们的循环。

就像我在开始时说的那样，`for..of` 为我们节省了许多复杂性和逻辑，并有助于使我们的代码看起来更清晰，更易读。如果您还没有尝试过这种令人敬畏的`for`循环变异，我认为现在是时候这样做了。

如果您对此或我应该添加，更正或删除的任何问题有任何疑问，请随时在下面发表评论，以及任何事情或DM我。谢谢阅读！ :)
