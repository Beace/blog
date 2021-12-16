---
title: 阿里云域名解析，Nginx二级域名的配置
date: 2016-09-12T20:53:23
updated: Sun Sep 18 2016 16:37:25 GMT+0800 (CST)
comments: 1
categories:
tags:
  - JavaScript
permalink: aliyun-domain-nginx
---

#### 开发环境
本地环境 OS X  ECS CentOS7
#### 需求描述
我需要在`node`环境下开发微信。我的`node`项目跑在`1234`端口上，但是购买的阿里云`ECS`有`apace`和`nginx`服务支持`80`端口。我可以这样访问我的项目，`beacelee.com:1234`，但是哪里有见过域名后面加端口的，而且微信只支持`80`和`443`端口。既然要装逼起来就要懂写服务器配置。因此，将`1234`端口映射到`80`上。

<!--more-->
#### 解决方案1：
你可以在你项目根目录下建立一个`nginx`的配置文件，然后软链到你的`nginx`配置目录下。

例如：在项目目录下新建文件：`nginx.conf`，有以下内容：

```nginx
server {
    listen 80;
    server_name lab.beacelee.com;
    location / {
        root /var/www/html/beace-blog/node_wechat;
        index index.html index.htm index.php
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Host      $http_host;
        proxy_pass         http://127.0.0.1:1234;
    }
}
```
很容易看出，项目的根目录为
```bash
/var/www/beace-blog/node_wechat
```
而此时映射的node的端口为`1234`，其他的可以忽略先，至少可以从这几个配置项中看出端倪和规律。

另外，`node`项目可以通过全局安装`PM2`，运行命令：
```bash
pm2 start app.js
```
来保持服务开启。

然后通过命令：
```bash
ln -s /var/www/html/beace-blog/node_wechat/nginx.conf /etc/nginx/conf.d/lab.beacelee.com.conf
```
重启`nginx`：
```bash
systemctl restart nginx.service
```
#### 解决方案2：

直接修改`/etc/nginx/conf.d/default.conf`,在最下面添加如下内容：

![alt](/static/upload/201609/l7sj4AmIih5AZBF1gfiDpp10.png)

重启nginx。
