---
title: React 动态添加一行数据（包括一行表格或者非表格）
date: 2016-09-01T16:39:36
updated: Tue Sep 20 2016 08:03:08 GMT+0800 (CST)
comments: 1
categories:
tags:
  - JavaScript
permalink: react-dynamic-add-rows
---

#### React 在`return`中添加`table`不可以直接嵌套多个`tr`

在`react`中的`return`函数添加表格，代码如下：
```html
<table className="table table-striped table-hover table-bordered">
    <tr>
        <th>姓名</th>
        <th>手机号</th>
    </tr>
    <tr>
        <td>item1</td>
        <td>item2</td>
    </tr>
</table>
```
<!--more-->
浏览器会报这样的错误；
![alt](/static/upload/201609/GAsDi4y2t25z0AzoWjiigpn9.png)

> react不会把DOM解析成thead和tbody这样的方式,

#### 解决方式为手动添加，完整代码为：
```js
export default React.createClass({
    render: function() {
        return(
            <div>
                <table className="table table-striped table-hover table-bordered">
                    <thead>
                    <tr>
                        <th>姓名</th>
                        <th>手机号</th>
                        <th>部门</th>
                        <th>角色</th>
                        <th>状态</th>
                        <th>证件类型</th>
                        <th>证件号</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>item1</td>
                        <td>item2</td>
                        <td>item3</td>
                        <td>item4</td>
                        <td>item5</td>
                        <td>item6</td>
                        <td>item7</td>
                        <td><a href="javascript:;">修改</a> | <a href="javascript:;">删除</a></td>
                    </tr>
                    </tbody>
                </table>
            </div>

        )
    }
})
```
### 但是遇到必须要添加一行的时候如何是好,或者更加奇怪但是很常见到的例子：

![alt](/static/upload/201609/jyJCyGqL7_L0msH0bqpQaCPt.png)

这样问题不是经常见到，会看到它共同点很多，都是添加一行数据，但是保持在表格的结构里，却有一个非共同点，第一列的数据不发生改变，并且随着一行表格的增多，一直保持垂直居中。

#### 解决方法

`table`中垂直方向合并单元格，除此单元格外，动态添加删除行
做法如下：
- 合并第一个单元格，垂直方向；
- 将其后的单元格全部合并，图片中合并了三个，水平方向
- 根据bootstrap的栅格系统，可以讲其分为三组
代码如下，表示其中一行，放在一个`td`里面，这样`react`就不会报语法错误了：
```html
<div className="row row-padding">
    <div className="col-xs-7 row-height">
        <div className="col-xs-3 no-padding">
            <FormField.Number className="form-control"
                              decimalDigits={2}
                              value={model.start}
                              onChange={this.props.onChangeField("start",viewId).bind(this)}
                              disabled
            />
        </div>
        {
            models.indexOf(model) == 0 ?
                <span className="col-xs-3 no-padding">元(包含)到</span> :
                <span className="col-xs-3 no-padding">元(不包含)到</span>
        }
        <div className="col-xs-3 no-padding">
            <FormField.Number className="form-control"
                              decimalDigits={2}
                              value={model.end}
                              onChange={this.props.onChangeField("end",viewId).bind(this)}
            />
        </div>
        <span className="col-xs-3 no-padding">元(包含)</span>
    </div>
    <div className="col-xs-2 no-padding">
        <FormField.Number className="form-control"
                          decimalDigits={2}
                          value={model.addition}
                          onChange={this.props.onChangeField("addition",viewId).bind(this)}
        />
    </div>
    <div className="col-xs-3 row-height">
        {
            models.indexOf(model) == 0 ?
                <a href="javascript:;" onClick={this.addRow.bind(this, model)}>增加分级</a> :
                <a href="javascript:;" onClick={this.removeThis.bind(this, model)}>删除分级</a>
        }

    </div>
</div>
```
