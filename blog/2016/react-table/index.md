---
title: React表格处理
date: 2016-07-01T00:00:00
updated: Thu Sep 22 2016 19:58:52 GMT+0800 (CST)
comments: 1
categories:
tags:
  - JavaScript
permalink: react-table-tbody-thead-colspan
---

### 问题描述
`react`中在`render`的`return`中直接输入类似以下的代码：
```html
<tr>
    <td><input type="checkbox"/></td>
    <td>趣分期</td>
    <td>A2102</td>
    <td>小王</td>
    <td>18817834467</td>
    <td>2016-06-01 19:00</td>
    <td>IOS9.3</td>
    <td>V1.0.0</td>
    <td><a href="#">回复</a></td>
</tr>
```

<!--more-->
### 解决方案：
在渲染的过程当中浏览器不会自动添加`thead`和`tbody`这样的标签，因此需要在手动添加，如下：

```html
<tbody>
<thead>
    <tr>
        <th><input type="checkbox"/></th>
        <th>客户名称</th>
        <th>客户ID</th>
        <th>反馈人</th>
        <th>手机号</th>
        <th>反馈时间</th>
        <th>平台</th>
        <th>版本</th>
        <th>操作</th>
    </tr>
</thead>
    <tr>
        <td><input type="checkbox"/></td>
        <td>趣分期</td>
        <td>A2102</td>
        <td>小王</td>
        <td>18817834467</td>
        <td>2016-06-01 19:00</td>
        <td>IOS9.3</td>
        <td>V1.0.0</td>
        <td><a href="#">回复</a></td>
    </tr>
</tbody>
```

** `td`中如果想要合并单元格的功能，需要大写`S`,例如：`colSpan`，示例代码如下：**
```html
<tr>
    <td> </td>
    <td style={{border:"0"}}>反馈内容</td>
        <td style={{border:"0"}} colSpan="7">
            <p>显示反馈的内容</p>
            <p><span>分贝通</span><section>分贝通回复的内容</section></p>
            <input type="text" className="form-control" placeholder="输入回复的内容"/>
        </td>
</tr>
```