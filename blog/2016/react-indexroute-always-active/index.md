---
title: React IndexRoute always active
date: 2016-09-10T21:01:20
updated: Sun Sep 18 2016 16:45:17 GMT+0800 (CST)
comments: 1
categories:
tags:
  - JavaScript
permalink: react-indexroute-always-active
---

直接在代码中添加：
```html
<li><NavLink to="/">Home</NavLink></li>
```

这时候`home`标签会一直高亮显示，即一直处于`active`状态不回改变，即使切换路由，如下图所示：

![alt](/static/upload/201609/wtXbg2WD11XXwavjIrXKLaxs.png)

[x] 官方给出的原因时这样的：

<!--more-->

> Now navigate around. Notice anything weird? The link to Home is always active! As we learned earlier, parent routes are active when child routes are active. Unfortunately, / is the parent of everything.

> For this link, we want it to only be active when the index route is active. There are two ways to let the router know you're linking to the "index route" so it only adds the active class (or styles) when the index route is rendered.


####这两段话表明，`／`是所有路由的父亲。

#### 解决方案1:
因此，需要如下代码（解决方案）：

```js
// App.js
import { IndexLink } from 'react-router'

// ...
```
<li><IndexLink to="/" activeClassName="active">Home</IndexLink></li>

来指定这就是首页，如下图可以看到这样直有在首页被点击的时候会有active状态：

![alt](/static/upload/201609/t-nyCYKN9zSaWAyqfrtw07Jy.png)

#### 解决方案2：

还是那句话，如果我非要使用我封装好的`link`（我这里为`<NavLink/>`），使用方法如下，在`component`中添加一个属性

`onlyActiveOnIndex={true}`
这样就会发现，`home`中的路由只有在点击之后出现相应`activeclass`高亮，效果如下图所示：

点击`HOME`,两个都高亮

![alt](/static/upload/201609/avX_sX_aTEf18iCm4XlhN3KH.png)

点击`About`只有`About`高亮

![alt](/static/upload/201609/PEZOSDpT6peUT_loNZhmKe0t.png)

### summary
个人感觉还是方案1比较合适，因为可以直接在标签上区别`Index/Home`(首页)还是其他页面，并且不需要额外添加其他属性！