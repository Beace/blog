---
title: Clean Blog by Node && React 4
date: 2016-12-17T16:22:23
updated: Sat Dec 17 2016 16:47:29 GMT+0800 (CST)
comments: 1
categories:
tags:
  - JavaScript
permalink: clean-blog-react-node-4
---

## 前言

- 此篇接上篇[Clean Blog by Node && React 3](https://beacelee.com)
- 记录[markdown.md](https://github.com/pandao/editor.md)的使用
- 记录*文章详情API*以及*提交文章API*的书写

<!--more-->
## 开始实战

### markdown富文本编辑器的使用

之前一直在说`api`和`前后端路由`的书写方式，从来没有注重过前端某些样式。这里由于用到了`clean-blog`这个主题，所以在样式上没有太多修改。但是，有些功能该主题不支持的，比如富文本编辑器。为了找一个顺手的`markdown`富文本编辑器，我也是煞费苦心。在此记录下自己折腾后的总结。

**首先来看下最终效果**

![Alt text](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/node-react/node-react4/node-react4-1.png)


#### 如何在项目中引用

1. 通过`bower`下载该开源项目代码和依赖

```bash
bower install --save editormd
```

2. 在`/view/index.ejs`中引用其必要的`css、js`文件
注意： 这里会依赖`jquery`和`bootstrap`的`css`，所以都需要作为前提引入

```html
<link rel="stylesheet" href="/bower_components/editor.md/css/editormd.min.css" />
<script src="/bower_components/editor.md/editormd.min.js"></script>
```

3.  在页面添加一个有`id`的`div`元素，在这里我暂时起名为`myEditor`，在`/views/index.ejs`添加如下代码

```
var testEditor;
testEditor = editormd("myEditor", {
	width   : "100%",
	height  : 640,
	emoji : true,
	path    : "../../bower_components/editor.md/lib/"
});
```

简单解释一下这段代码的用处。该段代码，在`id`为`myEditor`的`div`中插入了一个`className`为`testEditor`的`textarea`,

|属性名|含义|备注|
|-----:|----:|-----:|
|width|textarea的宽度||
|height|textarea的高度||
|emoji|是否开启emoji表情|开启后可以选择输入，但是不翻墙很难加载出来表情|
|path|依赖包所在路径|由于该编辑器依赖requirejs，所以直接输入包的相对路径即可引用其他css/js文件|

这样做就已经万事俱备了吗？ 当然不可能！

如果我们不是单页应用，完全可以在添加博客页面增加这样的代码；但是恰恰我们是单页应用，虽然我们在`/views/index.ejs`都可以当做全局引入来作为依赖（其实我们更应该压缩为一个js文件），但是，由于该插件是动态插入`<textarea></textarea>`，当我们没有切到文章提交页面时，还没有加载改页面的`html`代码，插件找不到id为myEditor的div，所以会抛出myEditor为undefined的错误。那么，如何在文章提交页引入，成为了我们下一步要解决的问题。

其实很简单，我们只需要在页面html加载完成是执行该方法即可。因此我们新建`/beComponents/TextArea`, 在`componentDidMount`方法中加入该段代码即可。如下代码所示。

```javascript
componentDidMount() {
	var testEditor;
	testEditor = editormd("myEditor", {
		width   : "100%",
		height  : 640,
		emoji : true,
		path    : "../../bower_components/editor.md/lib/"
	});
}
render() {
	return (
		<div className="form-group">
			<label htmlFor="content">内容</label>
			<div id="myEditor"></div>
		</div>
	)
}
```

### 后端文章提交API书写

静态页面设置完成后，可以在里面书写一些内容。例如下图所示。

![Alt text](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/node-react/node-react4/node-react4-2.png)

*如何执行提交操作，并且插入数据库呢？*

从先前的例子中都可以看到，我所设计的文档都是通过`Fetch API`去接受`JSON`数据，同样，我也会以`JSON`的形式提交数据。

根据上一篇文章，提交文章的代码如下。

```javascript
app.post('/api/post', function(req, res) {
	let model = req.body;
	var db = mongoose.createConnection('localhost', 'article');
	db.once('open', function(err) {
		var Article = mongoose.model('articles', articleSchema);
		var article = new Article(model);
		article.save(model);
		if(err) {
			return err;
		}
		res.send({
			code : 0,
			msg: "success"
		})
	});
})
```
这里，我通过`req.body`来接收提交的数据，并且，当数据返回时，返回给客户端这样的`JSON`字符串.

```json
{
	code: 0,
	message: "success"
}
```
### 前端文章提交代码的书写

首先要获取数据，并且对数据进行初步校验，即客户端校验。
```javascript
submitHandler(e) {
	e.preventDefault();
	let _this = this,
	model = this.state.model;
	model.content = $('.editormd-markdown-textarea').val();

	for(var i in model) {
	    if(model[i] == "" || model[i].toString().length === 0) {
	        switch (i) {
	            case "author":
	                alert("作者未填写");
	                break;
	            case "abstract":
	                alert("摘要未填写");
	                break;
	            case "title":
	                alert("标题未填写");
	                break;
	            case "content":
	                alert("内容未填写");
	                break;
	            default:
	                // nothing
	        }
	        return false;
	    }
	}
```

校验完成之后，提交数据。依然通过`Fetch API`提交`JSON`数据.提交成功后，弹出确认框，给予提示。

```javascript
fetch('http://localhost:3000/api/post', {
         method: "POST",
         headers: {
             "Content-Type": "application/json"
         },
         body: JSON.stringify(model)
     }).then((res) => {
         if(res.ok) {
             $('#myModal').modal('show');
             $('.editormd-markdown-textarea').text("");
             _this.setState({
                 model: {
                     author: "beace",
                     abstract: "",
                     title: "",
                     content: ""
                 }
             });
         }else if (res.status === 401) {
             alert("Oops! You are not authorized.");
         }
     }, function(e) {
         alert("Error submitting form!");
     })
 }
```


### 文章详情API书写

当完成提交文章的操作之后，数据库中多了一行记录，如何访问该记录呢？这不得不到了了解文章详情的地步。

我们在第三次记录的时候就已经将后端路由书写完成，大概是这样的。

```javascript
app.get('/post/:id', function(req, res) {
	res.send(doc);
})
```
但是，没有定义具体的实现方法，其实，和列表大同小异，只不过，列表中返回的是对象数组的格式(`find()`方法)；在这里，只需要返回一个对象（`findOne()`方法）。

```javascript
app.get('/post/:id', function(req, res) {
   var postId = req.params.id;
   var db = mongoose.createConnection('localhost', 'article');
   db.once('open', function() {
       var Article = mongoose.model('articles', articleSchema);
       Article.findOne({
           _id: postId
       }, function(err, doc) {
           if (err) console.log(err);
           else {
               res.send(doc);
           }
       })
   });
})
```

这样，本篇文章所记录的东西就完成了。

## 总结

本篇文章记录了[开源markdown编辑器](https://github.com/pandao/editor.md)的使用，以及其使用方式。并且，将提交文章和文章详情的后端接口书写完成。下一篇，将着重介绍后端如何处理`markdown`格式的字符串，并且介绍一下`react`中是如何直接输出`html`的。

