---
title: div始终位于底部的问题
date: 2017-01-16T17:08:09
updated: Mon Feb 06 2017 10:48:17 GMT+0800 (CST)
comments: 1
categories:
tags:
  - JavaScript
permalink: div-always-on-bottom
---



## 背景
在阅读[Flexbox Patterns](https://www.flexboxpatterns.com/card-group)文章时，发现曾经解决过如下问题。在此作为记录。

## 需求描述
对于常见的列表或者卡片布局时，宽度往往统一，高度参差不齐。如果想要实现风格一致的卡片或者列表，如下图所示，当描述文字高度不一致时，最底的价格始终保持在最下面，每两个对齐。

![](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/css/flex/flex-card-group.jpg)

<!--more-->
## 实现方式

### DOM结构
对于手机端而言，没有太多的 浏览器兼容性问题。整个布局比较简单，`DOM`结构代码如下所示。

```html
<div class="card-container">
        <div class="card card--flexdWidth">
            <div class="card__description">
                <div class="icon fa fa-flask card__descriptionIcon"></div>
                <div class="card_descriptionText">
                    Science potion Science potion Science potion
                </div>
            </div>
            <div class="card__price">Cost $5</div>
        </div>
        <div class="card card--flexdWidth">
            <div class="card__description">
                <div class="icon fa fa-flask card__descriptionIcon"></div>
                <div class="card_descriptionText">Science potion</div>
            </div>
            <div class="card__price">Cost $5</div>
        </div>*4
    </div>
```
这里，我添加了许多5个结构相同的`card`组件,唯一有点区别的是第一个`card`组件的文字内容稍微多些。为了测试我的最终效果。

### STYLE
大体的样式比较简单

- 最外层盒子`display`属性为`flex`，并且`flex-wrap`为`wrap`允许换行，宽度为`100%`
-  每一个card组件宽度为`50%`，基数时盒子右边添加一个边框，这时会将第二个card挤下去，因此为改盒子添加了`box-sizing:border-box`属性。
-  其中每一个card内部，`display`也为`flex`，`flex-direction`为垂直方向。

```css
* {
        margin: 0;
        padding: 0
    }
    html,
    body {
        width: 100%
    }
    .card-container {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
    }
    .card {
        display: flex;
        flex-direction:  column;
        overflow: hidden;
        border-bottom: 1px solid #cad0d2;
        box-sizing: border-box;
    }
    .card:nth-child(odd) {
        border-right: 1px solid #cad0d2;
    }
    .card__description {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 15px 0;
        font-size: 2em;
        margin-bottom: 10px;
    }
    .card_descriptionText {
        color: #57727c;
        font-size: 1em;
        text-align: center;
        max-width: calc(100% - 30px);
    }
    .card__price {
        text-align: center;
        color: #57727c;
        font-size: 1em;
        font-weight: 700;
        padding: 5px 15px;
    }
    .card--flexdWidth {
        width: 50%;
    }
```

到这里，样子大概是这样。

![](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/css/flex/flex-card-group2.jpg)

> 这时候就可以发现问题出现了，当描述内容的字相差不太多时，还可以看到展现方式比较一致，当字数相差许多，盒子被不断撑开时，价格的位置就显得不太一致。

### 解决思路
可以想到，flex布局中，控制子元素属性——`align-self`，如果flex布局中方向为垂直，则其根据父元素自动计算垂直有关属性；同样，如果为水平，根据父元素计算水平有关属性。flex中，有如下常用属性。

| 属性 | 解释 |
| --- | --- |
| center | 垂直/水平居中 |
| flex-start | 始终在flex的开始 |
| flex-end | 始终在flex盒子的底部 |

了解到这里，可以通过设置每一个`card`的中的布局跟最外层`card-container`一致，如下。


```css
.card {
    display: flex;
    flex-direction: row; //由垂直改为水平
    flex-wrap: wrap; //flex 元素 被打断到多个行中
    justify-content: center; //内容水平居中
    overflow: hidden;
    border-bottom: 1px solid #cad0d2;
    box-sizing: border-box; //忽略border
}
.card__price {
   align-self: flex-end; //一直保持在flex box的底部
}
```

### 总结
需要注意的是，其父元素的`flex`属性必须为`row`,且`flex-wrap`属性必须为`wrap`，这样card组件中的价格才能保持在flex盒子中的底部位置。


