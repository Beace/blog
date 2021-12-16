---
title: 快学Scala+Playframework之增删改查—— 数据库操作（三）
date: 2016-11-01T23:23:14
updated: Tue Nov 01 2016 23:31:40 GMT+0800 (CST)
comments: 1
categories:
tags:
  - Scala
permalink: scala-playframework-database-mysql
---

## 目标

- 接上一篇[快学Scala+Playframework之增删改查——路由与静态页面（二）](https://beacelee.com/post/router-static-page.html),完成其他页面路由的配置

- 后端`API`的书写 列表数据请求

## 知识点

- 路由配置

- `playframework`第三方库的安装（`mysql`操作库）

- 数据库操作

- `API`请求 列表数据请求实现

<!--more-->

---

## 静态页面和`API`路由的配置

在`/conf/routes`文件中定义静态页面和`API`的路由。

```scala
GET           /users                   controllers.UserController.list   //列表
GET           /users/add               controllers.UserController.add  //添加
GET           /users/detail/:id        controllers.UserController.detail(id: Int)  //详情
GET           /users/:id               controllers.UserController.edit(id: Int)  //修改
GET           /users/:id/delete        controllers.UserController.delete(id: Int)  //删除
#API
GET           /api/users               controllers.Application.list
POST          /api/users               controllers.Application.add
GET           /api/users/:id           controllers.Application.detail(id:Int)
POST          /api/users/search        controllers.Application.search
POST          /api/users/:id           controllers.Application.edit(id:Int)
DELETE        /api/users/:id           controllers.Application.delete(id:Int)
```

## 数据库操作

### 数据库、表的创建

数据库采用`mysql`,在OS X下，为了加快速度，我使用了`mysql`的可视化工具——[Sequel Pro](https://www.sequelpro.com/)进行数据库的创建，表的建立和数据的插入。

`Sequel Pro`是一款非常强大的数据库管理工具。支持标准的用户名密码登录、`SSH`登录、`Socket`登录。先在本地启动`mysql`服务。

```sh
$ mysql.server start
```
![命令行mysql](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/play-scala-userlist/mysql.png)

启动`mysql`之后，需要通过`sequel pro`连接本地服务，通过如下图配置：

![sequel pro](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/play-scala-userlist/sequel.png)

点击`connect`，建立如下所示表`test`

```sql
CREATE TABLE `test` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(30) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  `description` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
```

可以通过书写sql语句或者手动添加字段。并且插入一些数据如下：
![sql insert](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/play-scala-userlist/sql.png)

### 配置、连接数据库

play中需要连接mysql需要在`build.sbt`中添加mysql驱动，并且这里我添加了mysql的操作函数库来高效率的查询数据库。

```scala
"com.typesafe.play" %% "anorm" % "2.5.0"
"mysql" % "mysql-connector-java" % "5.1.36"
```

接着需要在/conf/application.conf中配置数据库的名称、地址、密码等。

```
db{
  default.driver=com.mysql.jdbc.Driver
  default.url="jdbc:mysql://localhost/play"
  default.username= root
  default.password= ""
}
```

接下来进行在/models中创建一个名为`UserInfo`的类：

```scala
case class Userinfo (id: Int, username: String, description: String, password: String)
```
根据上述定义的路由，我们需要在Controllers中新建Application.scala作为后端API的控制器。

> **我们期望，返回一个json array的数据类型给前端接收，并且前端根据约定好的规则去获取并渲染.虽然在后面的处理中，又将`json`类型转化为了`Seq`，这是为了单纯搞明白play中的页面传值的写法。但是对于json格式的数据返回是必须掌握的，利于`AJAX`请求等进阶的学习。**

### scala操作数据库
在play的高版本中，controller中的类，依赖注入。写法如下，这里可以参考play-anorm的API
```scala
class Application @Inject()(db: Database,ws: WSClient) extends Controller {
    def list = Action { implicit request =>
    val parser: RowParser[Userinfo] = Macro.namedParser[Userinfo]
    db.withConnection { implicit c =>
      val result = SQL("SELECT * FROM test").as(parser.*)
      Ok(Json.toJson(result))
    }
  }
}
```
这里，我们通过注入db来进行数据库的连接，查询数据库后获取result，并且返回了JSON格式的数据，这个时候可以刷新下页面，可以看到控制台报出这样的错误。

```
No Json serializer found for type List[models.Userinfo]. Try to implement an implicit Writes or Format for this type.
```

可以看出数据库的连接没有出错，出错在于我们没有Userinfo这样JSON类型，需要隐式声明。解决办法如下：

```scala
  implicit val userWrites = Writes[Userinfo] {
    case Userinfo(id: Int, username: String, description: String, password: String) =>
      Json.obj(
        "id" -> id,
        "username" -> username,
        "description" -> description,
        "password" -> password
      )
  }
```
在这里我创建了Userinfo类型下的序列化Json。可以通过postman来请求下我们事先定义好的url [http://localhost:9000/api/users](http://localhost:9000/api/users)，postman帮我们输出了请求到的数据，

![json](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/play-scala-userlist/json.png)

> 整个过程大体是这样。postman请求服务器的/api/users路由，play接收到请求，去执行controller下的list方法，`list`方法通过查询数据库后，再将查询到的数据List类型处理为`json`，并返回给postman。

那接收就比较容易了。

> 同样，UserController中的list方法，*就是充当了postman*。不同于postman的是它比较"智能"，不是打印数据，而是将数据填充到html中，返回html文件，浏览器经过渲染，生成了html页面。


#### 列表数据的获取

```scala
//UserController中的list方法
class UserController @Inject()(ws: WSClient) extends Controller {
  def list = Action.async {
    val url = s"http://localhost:9001/api/users"
    ws.url(url).get().map {
      response =>
        val json = Json.parse(response.body)
        val jsonSeq = json.as[Seq[Userinfo]]
        Ok(views.html.users("User list", jsonSeq))
    }
  }
}
```
我这里使用了play的`ws`方法，来请求一个url获取数据。细节内容可以参考play的`WSClient`内容。这里请求到json数据后，由于没有用到`AJAX`，所以还是转化成了`play`页面传值能够识别的`Seq`类型。

可以看下`/views/users.scala.html`中的内容，就是遍历了所有的数据。

```html
@for(user <- users) {
    <tr>
        <td>@user.id</td>
        <td>@user.username</td>
        <td>@user.description</td>
        <td>@user.password</td>
        <td><a href="@routes.UserController.detail(user.id)">详情</a>
            <span style="margin: 0 10px;">|</span>
            <a href="@routes.UserController.edit(user.id)">修改</a>
            <span style="margin: 0 10px;">|</span>
            <a href="@routes.UserController.delete(user.id)">删除</a>
        </td>
    </tr>
}
```

最终生成的html截图如下:

![userlist](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/userlist.png)

#### 详情的获取

同样的详情（details）页面的API写法也非常简单了,除了sql语句不同，其他都类似。

```scala
//Application.scala
def detail(id: Int) = Action { implicit request =>
    val parser: RowParser[Userinfo] = Macro.namedParser[Userinfo]
    db.withConnection { implicit c =>
      val result = SQL(s"SELECT * FROM test WHERE id=$id").as(parser.*)
      Ok(Json.toJson(result))
    }
  }
```

同样的前端请求并渲染数据。

```scala
//UserController.scala
def detail(id: Int) = Action.async {
    val url = s"http://localhost:9001/api/users/$id"
    ws.url(url).get().map {
      response =>
        val json = Json.parse(response.body)
        val jsonSeq = json.as[Seq[Userinfo]]
        Ok(views.html.details("user details",jsonSeq))
    }
  }
```

```html
<div class="panel panel-default">
    <div class="panel-heading">
        <h4>@d.username 的信息</h4>
    </div>
    <div class="panel-body">
         <dl class="dl-horizontal">
             <dt>User name</dt>
             <dd>@d.username</dd>
             <dt>Description</dt>
             <dd>@d.description</dd>
             <dt>Password</dt>
             <dd>@d.password</dd>
         </dl>
    </div>
</div>
```

截图如下:

![details](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/userdetail.png)