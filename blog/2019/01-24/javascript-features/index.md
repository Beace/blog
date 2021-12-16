---
title: 【译文】鲜为人知的JavaScript特性
date: 2019-01-24T16:00:23
tags:
  - JavaScript
---

> 翻译自：[Little known features of JavaScript – Noteworthy - The Journal Blog](https://blog.usejournal.com/little-known-features-of-javascript-901665291387)

JavaScript 经常被认为是一门最容易入门却最难精通的语言。我完全同意这样的说法。这是因为，JavaScript 是一个非常古老有很灵活的语言。它充满了神秘的功能和过时的语法。我已经使用 JavaScript 多年了，迄今为止，仍然是不是地偶然发现一些从未知道的隐藏语法或技巧。

![](https://imgs.beacelee.com/2019/little-know/1.png)


我尝试将这些鲜为人知的特性列出来。尽管一些特性已经在严格模式下不可用了，但是他们仍然是非常合法的 JavaScript 代码。虽然它们非常酷，但是如果你使用它们，你很可能会对你的队友生气。

所有的源代码都在[这里](https://gist.github.com/viral-sh/98813f83f4afe9dce5a74e176f88724f)。编码愉快！

> 注意：不会包括这些知识：Hoisting, Closures, Proxies, Prototypal inheritance, async-await, generators 等。尽管这些特性可能很少人理解，但是他们还是很知名的。

## Void 操作符
JavaScript 有一个一元操作符 `void`。你可能已经看到过`void(0)` 或者 `void 0` 类似的用法 。它的存在只有一个目的——评估它右侧的表达式然后返回 `undefined`。使用 「0」仅仅是一个转化。你没有必要使用「0」，它可以是任何像 `void <expression>` 的合法表达式，并且它任然返回 `undefined`。

![](https://imgs.beacelee.com/2019/little-know/code-1.png)


> 为什么创造一个特殊的关键字来返回 `undefined` 而不是直接 `return undefined`?
> 看起来有些冗余不是么？
>
> 有趣的事实
> 事实证明，在 ES5 之前，大多数的浏览器中，你可以为原始未定义的值分配一个新值，像这样 `undefined = "abc"`。
> 因此，定义（defining）**未定义(undefined)**。（defining the undefined）
> 在那段时间，使用 `void` 是一种可以保证你总是返回原始的 `undefined`的方式。

## 构造函数（constructor）的括号是可选的
是的，我们在调用构造函数时在雷鸣后面增加的括号——是完全可选的！😮 （前提是不需要给构造函数传递任何参数）。

下面的两种编码的方式都是合法的 JS 语法，并且执行的结果一致。

![](https://imgs.beacelee.com/2019/little-know/code-2.png)


## 可以摆脱立即执行函数表达式（IIFE）的括号
IIFE(Immediately Invoked Functional Expression)  的语法对我来说总是有点奇怪。
所有的括号都发生了什么？

事实证明，这些额外的括号是用来告诉 JavaScript 解析器，即将执行的代码是一个函数表达式而不是一个函数。知道了这一点，可以想象，有很多方法来摆脱这些括号并且仍然保持一个合法的 IIFE。

![](https://imgs.beacelee.com/2019/little-know/code-3.png)


`void` 关键字告诉解析器这些代码是一个函数表达式（functional expression）。因此，我们可以摆脱 `function` 定义周围的括号。猜猜会发生什么？我们可以使用任何的一元表达式 **（void，+，！，-，等等）**，仍然会正常执行。

这很酷！

然而，如果你是一个敏锐的观察者，你可能会想：

*一元运算符不会影响IIFE返回的结果吗？*

是的，它会影响结果。但是好消息是，如果你担心结果并将其存储在某个变量中，那么不需要在第一个位置写额外的括号。

这是真的！

![](https://imgs.beacelee.com/2019/little-know/code-4.png)

我们添加这些括号只是为了更好的可读性。

*想要更深入地了解IIFE，请查看[Chandra Gundamaraju](https://medium.com/@vvkchandra)的[这篇很酷的文章](https://medium.com/@vvkchandra/essential-javascript-mastering-immediately-invoked-function-expressions-67791338ddc6)。*


## With 语句
你知道 JavaScript 有一个 `with` 语句块吗？`with` 是 JS 的一个关键字。书写一个`with`块的语法像下面这样：

![](https://imgs.beacelee.com/2019/little-know/code-5.png)

`with` 添加传递的「对象（object）」的所有属性，在作用域链中被用来作为取值语句。

![](https://imgs.beacelee.com/2019/little-know/code-6.png)


> 🚩 有趣的事实
> `With` 块听起来非常酷，不是吗？它甚至比 对象解构（[object destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring)）更好。
> 好吧，并不是。
> 通常并不推荐使用 `with` 语句，因为它被弃用了。它在严格模式下是被完全禁止的。因为`with` 块有着严重的性能和安全问题。

## Function 构造器（The Function constructor）
函数（function）声明不是声明一个新的函数的唯一方法；还可以通过定义 `Function()` 构造器和一个 `new` 操作符。

![](https://imgs.beacelee.com/2019/little-know/code-7.png)

构造器的最后一个参数是被字符串化的代码，在其之前的参数都是该函数的参数。

> 🚩 有趣的事实
> 在 JavaScript 中，`Function` 构造器是所有构造器之母。甚至 `Object` 的构造器也是一个 `Function` 构造器。并且，`Function`的自身构造器也是 `Function` 自己。因此，在 JavaScript 中，在任何 `object` 上调用 `object.constructor.constructor...` 多少次也会返回 `Function`的构造器。

## 函数属性（ Function Properties）
我们都知道函数是 JavaScript 中的第一类对象。因此，没有人能够阻止我们给函数增加属性。这是一个非常合法的 JavaScript 操作。但是，它很少被使用。

因此，什么时候我们该用它？

这里有很多使用它的案例。例如：

### 可配置的函数（Configurable Functions）
假设有一个 `greet` 函数。我们想要这个方法根据不同地域来打印不同的问候语。这个地域应该是可以配置的。我们可以维护一个 `local` 的全局变量或者使用如下所示的函数的属性来完成该功能

![](https://imgs.beacelee.com/2019/little-know/code-8.png)

### 带有静态变量的函数
另外一个简单的例子。假设你想要实现一个可以生成有序队列数字的数字生成（Number Generator）函数，你将使用带有一个静态变量的**Class** 或者 **IIFE** 来跟踪最后一个值。这样我们就可以限制对计数器的访问，并避免使用额外的变量来污染全局空间。

但是，如果我们希望灵活地读取甚至修改计数器并且不污染全球空间，那该怎么办呢？

我们仍然应该创建一个 Class，带有一个计数器变量和一些读取它的额外方法；或者我们可以偷懒直接在函数上使用它的属性。

![](https://imgs.beacelee.com/2019/little-know/code-9.png)

---

这是一个很长的清单，我们才到了一半。如果你想休息一下，现在是个好时机。如果不想，你是一个勇敢的战士，我向你致敬。

 我们继续吧！

## 参数属性（Arguments Properties）
我相信大多数人都知道函数内的参数对象`arguments`。它是个在所有函数内都可以使用的类数组对象（array like object）。当函数被调用的时候，它有传递给函数的参数列表。但是它也有其他一些有趣的属性：

- **arguments.callee** : 指的是当前调用的函数
- **arguments.callee.caller**:  指的是已调用当前函数的函数

![](https://imgs.beacelee.com/2019/little-know/code-10.png)

> 提示：尽管在严格模式下 ES5 禁止使用 `calee` 和 `caller`，仍然可以在很多编译库中找到它的使用。因此，它值得我们学习。

## 标记性模板字符串（Tagged Template Literals）
除非你一直生活在岩石之下，不然你肯定听说过[模板字符串](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)。模板字符串是 ES6 新增的很多炫酷的特性之一。然而，你知道**被标记的**（Tagged）模板字符串么？

![](https://imgs.beacelee.com/2019/little-know/code-11.png)

*标记性模板字符串* 允许你更好地控制将模板文字解析为字符串，通过在模板字符串中增加一个自定义的标记。标记（Tag）只是一个解析函数，它获取字符串模板解释的所有字符串和值的数组。标记函数返回最终的字符串。

在下面的例子，有一个自定义的标记——*hightlight*，解释模板文字的值，并使用`<mark>`元素将结果字符串中的解释值包装起来以突出显示。

![](https://imgs.beacelee.com/2019/little-know/code-12.png)

> 在很多库都有这些有趣的用例来利用这一功能。下面的这些很酷的例子，
> - [GitHub - styled-components/styled-components: Visual primitives for the component age. Use the best bits of ES6 and CSS to style your apps without stress 💅](https://github.com/styled-components/styled-components)for React
> - [es2015-i18n-tag](https://github.com/skolmer/es2015-i18n-tag) 用来翻译和国际化
> - [GitHub - chalk/chalk: 🖍 Terminal string styling done right](https://github.com/chalk/chalk) 用来美化日志

## Getters & Setters
对于大部分来说，JavaScript 对象很简单。假设我们有一个 `user` 对象，尝试通过 `user.age` 获取它的属性 `age`，如果有定义将获取 `age` 的值，如果没有则会得到 `undefined`。就这么简单。

但是，它不一定非常简单。JavaScript 对象有 **Getters** 和 **Setters** 的概念。除了直接返回对象上的值，还可以自定义 **Getter** 函数来返回我们想要的。同样也适用于设置一个值。

这允许我们有很强大的概念在设置和获取一个字段的时候，像：**虚拟字段**（virtual fields），**字段验证**(field validations)，**副作用**(side-effects)。

![](https://imgs.beacelee.com/2019/little-know/code-13.png)

Getters 和 Setters 不是 ES5 的新增内容；它们之前已经存在了。ES5只是为现有功能添加了方便的语法。可以通过[这篇文章](https://www.hongkiat.com/blog/getters-setters-javascript/)来学习关于 Getters 和 Setters 相关知识。


> [colors](https://github.com/Marak/colors.js)，一个非常流行的 node.js 库，是一个利用 Getters 非常典型的例子。
>
> 这个库[继承了 String 类](https://github.com/Marak/colors.js/blob/master/lib/extendStringPrototype.js) 并且增加了一系列的 Getter 方法。这允许我们通过简单地访问其上的属性，将任何字符串转换为其彩色的样式以便于日志记录。

## 逗号运算符（Comma operator）
JavaScript 有一个逗号运算符（common operator）。它允许我们在一行代码中书写多个用逗号分隔的表达式，并返回最后一个表达式的结果。

![](https://imgs.beacelee.com/2019/little-know/code-14.png)

在这里，将评估所有表达式，并为 result 变量赋予 expressionN 返回的值。

你可以能已经在一个循环中使用逗号运算符了。

![](https://imgs.beacelee.com/2019/little-know/code-15.png)

它在一行中书写多个表达式的时候很有帮助。

![](https://imgs.beacelee.com/2019/little-know/code-16.png)

或者写短的lamda函数

![](https://imgs.beacelee.com/2019/little-know/code-17.png)

## + 加号运算符（+ Plus Operator）
想要快速地将一个 `string` 转化为 `number` 吗？

仅仅需要给字符串加一个 `+` 的前缀。
加号运算符也可以作用于 *负（negative），八进制（octal），十六进制（hexadecimal），指数（exponential）*类型的值。

更重要的是，它甚至可以将Date或Moment.js对象转换为时间戳！

![](https://imgs.beacelee.com/2019/little-know/code-18.png)

## !! 运算符（!! Bang Bang Operator）
好吧，从技术上讲，它不是一个单独的JavaScript运算符。它仅仅是使用了两次的 JavaScript 的取反运算符。

但是 **!!** 看起来太酷了！**!!**  是一个使代码整洁的技巧，可以将任意的表达式转化为 *Boolean* 值。

如果表达式是一个**真**值，它返回 *true*；反之，返回 *false*。

![](https://imgs.beacelee.com/2019/little-know/code-19.png)

## ~ 波浪线操作符（~ Tilde Operator）
让我们来面对它——没有人关心位运算符（Bitwise operators）。
我们什么时候才能使用它！

好吧，**~** 或 位运算符有一个日常用例。

我们可以通过将 `〜` 放在 `indexOf（…` 函数前面来进行布尔检查，一个项是否存在于 String 或 Array 中。

![](https://imgs.beacelee.com/2019/little-know/code-20.png)

> 提示：ES6 和 ES6  在 String  和 Array 分别中增加了一个新的 `.includes()` 方法。很明显，检查一个数组或字符串中是否存在某个项目它比波浪线 `~` 更加地语义化。

## 标记语句（Labelled statements）
JavaScript 有标记语句的概念（Labelled statements）。它允许我们在 JavaScript 中定义循环和代码块。当使用 `break` 或 `continue` 时，我们使用标记来引用代码。

标记语句在嵌套循环中特别方便。但我们也可以使用它们来简单地将代码组织成块或创建一个可跳出的块。

![](https://imgs.beacelee.com/2019/little-know/code-21.png)

> 提示：不像其他的语言，JavaScript 并没有 **goto** 语句。因此，我们只能使用带有 `break` 和 `continue` 的标签。

*如果您对此类JavaScript怪癖有所了解，或者已经找到了有趣的用例来利用这些功能，请在下面分享您的经验。我很乐意听到它！*

我❤️ JavaScript 并喜欢写关于它的文章。但他们确实需要花费大量的时间和精力。如果您喜欢这篇文章，请分享并推荐它。

Coding 愉快！