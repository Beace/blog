---
title: 记一次阿里云服务器ECS迁移导致的nginx和node有关问题
date: 2017-09-23T00:03:55
updated: Sat Sep 23 2017 00:05:14 GMT+0800 (CST)
comments: 1
categories: node
tags:
  - JavaScript
permalink: aliyun-ecs-qianyi-nginx-node
---

阿里云的产品提醒还是很友好的，一快到付费节点，那短信提醒简直比移动联通欠话费还来得勤快。


![](https://beimg.oss-cn-beijing.aliyuncs.com/Aliyun/aliyun-xin.png!ace)

不过重要的消息通知还是很及时。近几天部分服务器迁移，虽迁移顺利，但是由于后台为[Node.js](https://nodejs.org/en/)起的服务，需要手动重启，下面记录下该过程。

<!--more-->

> 以下环境为阿里云ECS, OS: CentOS7。


1. 服务重启，[Node.js](https://nodejs.org/en/)更新

更新nodejs有多种方法，你可以重新下载源文件解压，覆盖之前的，或者通过brew/nvm来更新，我用的最简便的方式，通过npm来更新。

```bash
$ npm cache clean -f
$ npm install -g n
$ n stable
```

很明显，从语义上就可理解，[n](https://github.com/tj/n)是[Node.js](https://nodejs.org/en/)的版本管理工具，完全没有复杂的多余配置，可以通过其安装不同版本的[Node.js](https://nodejs.org/en/)，在这里获取了[Node.js](https://nodejs.org/en/)的最新稳定版本。

![](https://beimg.oss-cn-beijing.aliyuncs.com/Aliyun/node-upgrade.png!ace)

1. 安装[GitHub - Unitech/pm2](https://github.com/Unitech/pm2)帮助node服务常作用

```bash
$ npm install -g pm2
$ cd /path/to/myproject
$ pm2 npm start --start
```

1. 由于node服务不再映射到80端口，nginx自己找到了其默认配置下的conf文件，将网站指向了一个index.html文件中。因此，需要解决端口的占用问题。

下图是由下面命令重启nginx的报错，明显看到，端口报错。当然，报错信息不会如此全面，需要`status`
命令去查看详细的报错信息。

```bash
$ systemctl start nginx.service
$ systemctl status nginx.service
```

![](https://beimg.oss-cn-beijing.aliyuncs.com/Aliyun/nginx-address.png!ace)

通过以下命令读取占用端口的进程，并杀死他们。居然有这么多。

```
$ fuser -n tcp 80
$ kill -9 791  1095  1096  1097  1098  1099  1148  1150  1216  1218  1763
# 再次检查
$ fuser -n tcp 80
# 最后重启nginx
$ systemctl start nginx.service
```

![](https://beimg.oss-cn-beijing.aliyuncs.com/Aliyun/kill-process.png!ace)

