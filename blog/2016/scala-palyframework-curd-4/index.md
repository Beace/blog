---
title: 快学Scala+Playframework之增删改查—— 数据库操作（四）
date: 2016-11-14T17:53:28
updated: Mon Nov 14 2016 21:38:08 GMT+0800 (CST)
comments: 1
categories:
tags:
  - Scala
permalink: scala-playframework-database-mysql-delete-update
---

## 目标
- 接上一篇[快学Scala+Playframework之增删改查—— 数据库操作（三）](https://beacelee.com/post/scala-playframework-database-mysql.html),完成其他(添加、查询、修改、删除)等API的操作

## 知识点

- 数据库操作

- 列表添加、查询、删除、修改 API的实现

- 查询关键词高亮


<!--more-->


---

## 添加（新建）的实现

在`/view`中新建`userForm.scala.html`,写入基本的表单代码：

```html
<form role="form" action="@routes.Application.add()" method="post">
      <div class="form-group">
             <label>User name</label>
             <input type="text" class="form-control" name="username" placeholder="username">
       </div>
       <div class="form-group">
             <label>Description</label>
              <input type="text" class="form-control" name="description" placeholder="description"/>
       </div>
       <div class="form-group">
             <label>Password</label>
             <input type="password" class="form-control" name="password" placeholder="Password">
       </div>
        <button type="submit" class="btn btn-primary">Submit</button>
        <a href="/users" class="btn btn-info" class="btn btn-primary">Return</a>
</form>
```

在`/controllers/Application.scala`中直接处理来自表单的`POST`请求。

```scala
def add = Action { implicit request =>
    //获取表单中用户填写 (要 POST) 的数据
    val (username, description, password) = form.bindFromRequest.get
    db.withConnection { implicit c =>
    //执行插入操作
      val result = SQL"INSERT INTO test(id,username,description,password) VALUES (null,$username,$description,$password)".executeInsert()
      Ok(Json.obj(
        "code" -> 0,
        "result" -> result
      ))
      Redirect("/users")
    }
  }
```

效果如下所示

![add](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/play-scala-userlist/a.gif)

---
## 查询的实现

在页面的头部加入一段查询的`html`代码

```html
<form action="@routes.Application.search()" method="POST">
       <input type="search" class="form-control pull-left search padding" name="username" placeholder="查询">
</form>
```

在`/controllers/Application.scala`中书写`search`请求方法

```scala
def search = Action { implicit request =>
    val body = request.body
    val jsonBody: Option[JsValue] = body.asJson
    val name: Option[String] = request.body.asFormUrlEncoded.flatMap(m => m.get("username").flatMap(_.headOption))
    val username = name.getOrElse(0)
    db.withConnection { implicit c =>
      val parser: RowParser[Userinfo] = Macro.namedParser[Userinfo]
      val result = SQL(s"SELECT * FROM test WHERE username LIKE '%$username%' OR description LIKE '%$username%'").as(parser.*)
      **val json = Json.toJson(result)**
      **val jsonSeq = json.as[Seq[Userinfo]]**
      Ok(views.html.search("User query", jsonSeq, username))
    }
  }
```
这里通过获取`body`中的内容，进而查询数据库，可以看到加粗的代码中，先将查询结构转化为`JSON`，进而又转化为`Seq`。这样的做法是为了适配分离。如果需要返回`json`的数据，在前端做请求，可去掉第二行。我这里直接将数据返回给了`html`页面。

效果如下图所示：

![add](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/play-scala-userlist/f.gif)

### 页面传值

```scala
@(messages: String, users: Seq[Userinfo], keyword: Any)
```
在这里，我不仅传入了查找到的结果，还讲`keyword`查询的关键字返回。为了显示的方便。并且如果直接在`html`代码中拼接`scala`中的变量，会直接渲染字符而不是我们期待的结果，因此`PLAY`提供了如下方法输出浏览器可解析的`html`.

```html
@for(user <- users) {
            <tr>
                <td>@user.id</td>
                @if(user.username.indexOf(keyword) < 0) {
                    //输出html
                    <td>@Html(user.username.replaceAll(keyword.toString, "<span class='keyword'>" + keyword + "</span>"))</td>
                } else {
                    <td>@user.username</td>
                }
                @if(user.description.indexOf(keyword) < 0) {
                    <td>@Html(user.description.replaceAll(keyword.toString, "<span class='keyword'>" + keyword + "</span>"))</td>
                } else {
                    <td>@user.description</td>
                }
                <td>@user.password</td>
                <td><a href="@routes.UserController.detail(user.id)">详情</a>
                    <span style="margin: 0 10px;">|</span>
                    <a href="@routes.UserController.edit(user.id)">修改</a>
                    <span style="margin: 0 10px;">|</span>
                    <a href="@routes.UserController.delete(user.id)">删除</a></td>
            </tr>
        }
```

---

删除和修改的实现

较为简单，这里只记录代码的内容。
#### 修改(同添加)
```scala
def edit(id: Int) = Action { implicit request =>
    val (username, description, password) = form.bindFromRequest.get
    db.withConnection { implicit c =>
      val result = SQL"UPDATE test SET username=$username,description=$description,password=$password WHERE id=$id".executeUpdate()
      Ok(Json.obj(
        "result" -> result
      ))
      Redirect("/users")
    }
  }
```

效果如下图所示

![add](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/play-scala-userlist/e.gif)

#### 删除

```
  def delete(id: Int) = Action {
    db.withConnection { implicit c =>
      val result = SQL(s"DELETE FROM test WHERE id=$id").executeUpdate()
      //这里返回了json串标志着删除成功
      Ok(Json.obj(
        "code" -> 0,
        "result" -> result
      ))
    }
    Redirect("/users")
  }
```

## 总结
这里算是`playframework`的增删该查的完结篇。通过四篇内容，完整的记录了这个小项目的增删改查的全过程。涵盖了如下知识点：

- `playframework` 有关知识——框架的搭建、配置、库的安装、数据库的交互、静态页面、API等等

- `API`的认识和写法

- `scala`的基本语法（方法、数据类型、类）

- `mysql`数据库的增删改查操作

## 写在后面（未完待续...）

> 在后续的过程中，我会陆续搭建更为复杂和完善的应用，比如企业管理系统，数据可视化、注册登录、权限分配、信息导出、导入等操作，并且在前端交互和前后端分离上下大工夫，以及纯`scala`的高级应用。`play`如其名，只是一个玩具框架，更重要的是`scala`语言本身。
