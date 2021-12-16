---
title: 快学Scala+Playframework之增删改查——项目搭建（一）
date: 2016-10-25T15:51:03
updated: Fri Oct 28 2016 00:45:06 GMT+0800 (CST)
comments: 1
categories:
tags:
  - Scala
permalink: play-framework-scala-userlist
---

## 需求
- 为了更好更快更有趣味地学习`scala`这门编程语言，结合`play framework`在实际开发场景中的运用，目标建立一个简单的用户列表的`RSAD`（read，search，add，delete）系统。特别记录此次学习过程。

- [代码托管](https://github.com/BeAce/scala-and-playframework-userlist)

<!--more-->
### 效果
![img](https://camo.githubusercontent.com/5ee38df9cb5155b2d6f2bad5207b65482de1929a/687474703a2f2f696d616765732d6d616e616765722e6f73732d636e2d7368616e676861692e616c6979756e63732e636f6d2f7374617469632f757365726c6973742e706e67)

[更多效果](https://github.com/BeAce/scala-and-playframework-userlist)

## 前提
- 必须具有`java`开发环境

- `eclipse`或`intellij`IDE

- `mysql 5.6`版本

- 该项目所有操作均是在`MAC OSX`上操作，不同操作系统本质相同，操作会略有差异


包含以下知识点：


- 下载`Activator`

- 配置环境变量

- 命令行中生成第一个`Play`项目


## 下载`Activator`

可以通过，`playframework`[官网下载离线环境](https://playframework.com/download),点击`offline distribution`下载。

## 环境变量

在`$HOME/.profile`中写入`activator`路径,并写入权限

```
export PATH=/path/to/activator-x.x.x/bin:$PATH
```

## 生成第一个`Play`项目

通过命令，分别指定了项目名称，与项目模板。

```
$ activator new my-first-app play-scala
```
在此我用的是`play`的`scala`模板，也可以使用`play-java`.当使用命令：

```
$ activator new
```
`play`会让你选择你想要的模板，模板列表如下：

![img](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/play-scala-userlist/play-scala-1.jpg)

项目搭建完成后，可以通过命令，来运行项目：
```
$ run
```

如果没有全局中的`activator`没有生效，或者没有权限，可以将`activator`中的`activator`复制到项目根目录下，通过命令来运行项目：
```
$ ./actiator run
```

## 运行结果
项目运行成功后，在浏览器中打开[http://localhost:9000](http://localhost:9000)。运行结果如下图。可以从浏览器中获取基本的版本信息以及相应的文档。
![run](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/play-scala-userlist/runresult.jpg)


如果想要修改端口，可以通过如下命令，让服务启动在自定义端口：
```
$ ./activator run -Dhttp.port=9001
```
控制台日志显示

![result](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/play-scala-userlist/run.jpg)
