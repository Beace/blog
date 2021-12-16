---
title: 快学Scala+Playframework之增删改查——路由与静态页面（二）
date: 2016-10-28T00:52:46
updated: Fri Oct 28 2016 00:56:43 GMT+0800 (CST)
comments: 1
categories:
tags:
  - Scala
permalink: router-static-page
---

## 需求
- 将项目导入IDE（Intellij）

- 理解静态页面与服务器请求发生的原理

- 完成增删改查的静态页面

<!--more-->
## 主要知识点

- 项目目录的理解

- 路由配置，请求静态页面的过程

- 页面传参原理

- 静态页面代码书写

---
### 导入IDE
导入时不要选择`Open`，选择`New`->`Project from Existing Sources...`，然后选择`SBT`导入。

![img](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/play-scala-userlist/IDE.png)

导入成功后的项目截图如下：

![img](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/play-scala-userlist/project-sreenshoot.png)

### 目录含义

**常用的以下文件**

- `/app` 源代码文件，标准的MVC目录结构。

- `/conf `配置文件，包含路由、日志的配置

- `/lib` 库文件

- `/target` 目标代码

- `/built.sbt` 运行环境所用到的库以及驱动配置文件

### 路由配置

在具体解释路由配置之前，可以先查看一下`/app/views`,这里存放了静态页面（`.html`）文件，尝试修改`main.scala.html`中的代码,将`main`中的字符串随便修改一下，如下：

```scala
@main("Welcome to Play，hello play 2") {

    @*
     * Get an `Html` object by calling the built-in Play welcome
     * template and passing a `String` message.
     *@
    @play20.welcome(message, style = "Scala")

}
```

回到浏览器刷新页面，可以观察到，`title`发生了变化。恭喜你，到此，说明你的项目是正常的，环境终于搭建完成了。

#### 我们来简单浏览下`/app`和`/conf`里面的内容
可以看到，最为明显的是`play`的`MVC`结构。`view`中存放了各种`html`静态文件，那首页是如何请求并且渲染出来的呢?

这要归功于`play`中清晰的路由配置。打开`/conf`中的的`/routes`文件，可以看到，有这样的路由配置：

```scala
GET           /                        controllers.HomeController.index
GET           /assets/*file            controllers.Assets.versioned(path="/public", file: Asset)
```

很明显，这里请求了`/`根路径，并且对应执行了`HomeController`中的`index`方法。可以在`/controllers`中查看`HomeController`，有如下代码：

```scala
def index = Action {
   Ok(views.html.index("My new Play & Scala application is ready."))
}
```
可以看到，`Action`中通过`Ok`方法，返回了一个/view中的一个`html`页面。值得注意的是，这里包含了静态资源的路径的配置。指向/public目录。

这里发现了`/view/index`，其实这里引用的即是`/view/index.scala.html`文件，并且为这个文件传入了一个字符串参数，这样就不难理解`index.scala.html`中变量`message`和`main.scala.html`中的`title`的作用了——当然是接收实参。你也可以自定义很多有用的参数来进行传递，但是唯一要注意的是，对于强类型的语言来说，数据类型一定要相同。

**请求的过程大概是这样的**

> 用户从浏览器中输入URL,浏览器向play发出请求，`Play`在`routes`文件中寻找相应的请求`URL`,找到之后，去执行`Controllers`中的方法,返回一个静态的`html`文件。

但细心可以发现，`index.scala.html`中还包括一个参数。`{}`中的内容。这个可以在`main.scala.html`中找到答案。

```html
//main.scala.html

@(title: String)(content: Html)
<!DOCTYPE html>
<html lang="en">
    <head>
        @* Here's where we render the page title `String`. *@
        <title>@title</title>
        <link rel="stylesheet" media="screen" href="@routes.Assets.versioned("stylesheets/main.css")">
        <link rel="shortcut icon" type="image/png" href="@routes.Assets.versioned("images/favicon.png")">
        <script src="@routes.Assets.versioned("javascripts/hello.js")" type="text/javascript"></script>
    </head>
    <body>
        @* And here's where we render the `Html` object containing
         * the page content. *@
        @content
    </body>
</html>
```
可以看到，除了`title`之外，还有`content`。在这里`content`的作用很明显，而且它的类型为`Html`，可以看出，这里是允许用户写入一段`html`来作为`content`的实参，并且在浏览器会解析`body`中的内容，不会当做`play`的字符串直接处理。这样对代码的模块化很有帮助，比如亘古不变的`sidebar`、`nav`等。

---

### 实战

通过以上的了解，我相信已经对路由的配置，以及静态页面渲染的过程，包括页面传参有了一个大体的了解。既然这样，我们就先来做一个静态页面吧。

#### layout.scala.html

可以仿照`main.scala.html`中的内容，来写一个`layout.scala.html`页面，效果像第一篇内容中的截图一样。

```html
//layout.scala.html

@(title: String)(content: Html)
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="@routes.Assets.versioned("stylesheets/bootstrap.min.css")">
        <link rel="stylesheet" href="@routes.Assets.versioned("stylesheets/main.css")">
        <title>@title</title>
    </head>
    <body>
        <div class="container">
            <h1 class="h1 h1-margin">@title</h1>
            <hr/>
            @content
        </div>
    </body>
</html>
```

值得一提的是，这里引用了两个`css`文件。`play`通过`@`来表示是一个`scala`中的变量或者表达式，可以直接通过调用路由中的方法来设置文件的路径和`a`链接中的`href`属性值。

### users.scala.html

可以引用`layout.scala.html`文件作为整个`html`的大体结构，创建`users.scala.html`文件来展示用户列表。

```html
//users.scala.html

@(messages: String)
@layout("Users List") {

   	<div>
        <form action="" method="POST">
            <input type="search" class="form-control pull-left search padding" name="username" placeholder="查询">
        </form>
        <a href="" class="btn btn-primary pull-left padding">添加</a>
    </div>
    <table id="table" class="table table-bordered table-hover table-striped container">
        <tr class="info">
            <th>#</th>
            <th>用户名</th>
            <th>描述</th>
            <th>密码</th>
            <th>操作</th>
        </tr>
		<tr>
			<td></td>
            ···
        </tr>
    </table>
}

```
这样，静态页面就完成了。

### routes

在`routes`文件中，设置页面的路由。

```
GET           /users                   controllers.UserController.list
```

### UsersController.scala

新建`UsersController.scala`,添加`list`方法：

```scala
def list = Action {
   Ok(views.html.users("User list"))
}
```
### 结果

打开浏览器，访问[http://localhost:9000/users](http://localhost:9000/users),查看页面如下图。

![img](https://camo.githubusercontent.com/5ee38df9cb5155b2d6f2bad5207b65482de1929a/687474703a2f2f696d616765732d6d616e616765722e6f73732d636e2d7368616e676861692e616c6979756e63732e636f6d2f7374617469632f757365726c6973742e706e67)

***增删该查页面同列表页。***




