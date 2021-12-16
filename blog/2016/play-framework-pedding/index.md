---
title: Play Framework运行阻塞的问题
date: 2016-07-05T00:00:00
updated: Thu Sep 22 2016 19:53:00 GMT+0800 (CST)
comments: 1
categories:
tags:
  - Scala
permalink: playframework-running-hold-on-problem
---

### 问题描述
在命令行中运行
```bash
$ ./activator run
```
出现如下信息：
```log
bogon:play-scala beace$ ./activator run
[info] Loading project definition from /Users/beace/play-scala/project
[info] Updating {file:/Users/beace/play-scala/project/}play-scala-build...
[info] Resolving org.fusesource.jansi#jansi;1.4 ...
[info] Done updating.
[info] Set current project to play-scala (in build file:/Users/beace/play-scala/)
[info] Setting up Play fork run ... (use Ctrl+D to cancel)
[info] Stopping Play fork run ...
[info] Forked Play process did not exit on its own, terminating it
[success] Total time: 98 s, completed 2016-7-4 11:44:03
```

<!--more-->
程序会一只卡在红色那句话，正确编译的效果应该为：
```log
bogon:play-scala beace$ ./activator run
[info] Loading project definition from /Users/beace/play-scala/project
[info] Updating {file:/Users/beace/play-scala/project/}play-scala-build...
[info] Resolving org.fusesource.jansi#jansi;1.4 ...
[info] Done updating.
[info] Set current project to play-scala (in build file:/Users/beace/play-scala/)

--- (Running the application, auto-reloading is enabled) ---

[info] p.c.s.NettyServer - Listening for HTTP on /0:0:0:0:0:0:0:0:9000

(Server started, use Ctrl+D to stop and go back to the console...)
```
### 解决方案：

在根目录下的`build.sbt`文件中，将：
```scala
fork in run := true
```
改为：
```scala
fork in run := false
```