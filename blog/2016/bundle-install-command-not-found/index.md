---
title: bundle install command not found
date: 2016-10-10T10:29:14
updated: Mon Oct 10 2016 10:37:53 GMT+0800 (CST)
comments: 1
categories:
tags:
  - JavaScript
permalink: bundle-install-command-not-found
---

### 背景描述

如果想用`github page`来生成你的静态站点，并且使用`Jekyll`来生成静态模板，但是苦于不懂`ruby`,对其运行环境的了解很欠缺，根据`github page`上的[教程](https://help.github.com/articles/using-jekyll-as-a-static-site-generator-with-github-pages/)来对环境进行搭建时，执行命令：
```bash
$ bundle install
```
出现 `command not found`的错误

<!--more-->
### 解决方案

有极大可能是因为`ruby`版本的问题导致了。可以通过`brew`重装，键入命令:

```bash
$ brew install ruby
```
![alt](https://beacelee.com/static/upload/201610/eyC6ZYuzazBWPfNIKUhSFkGk.png)

安装成功之后，

![alt](https://beacelee.com/static/upload/201610/FSyATQzcEXEJSmU_frKTXfte.png)

执行：
```bash
$ sudo gem install bundler
```
![alt](https://beacelee.com/static/upload/201610/SMoXCTQc7pycmMhH0N5dXDyR.png)

再次执行：

```bash
$ bundle install
```
可以看到如下安装提示：

![alt](https://beacelee.com/static/upload/201610/ku6KcV9_ml9tNkd5jsZsmecR.png)

[查看我的github博客地址](https://beace.github.io)

[静态模板地址](https://github.com/renyuanz/leonids/)

> 其他错误可以从[jekyll的官网](http://jekyllrb.com/docs/troubleshooting/#jekyll-amp-mac-os-x-1011)进行排查。

