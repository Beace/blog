---
title: 在nginx服务器下配置和安装阿里云购买的SSL证书
date: "2016-09-18T17:46:40"
updated: Thu Sep 22 2016 22:57:47 GMT+0800 (CST)
comments: 1
categories:
tags:
  - JavaScript
permalink: aliyun-ecs-nginx-ssl-certificate-config
---

### 实现是简单的，动手是可怕的
当我习惯了`letsencrypt`一个命令无需配置就可以实现一切的时候，终于需求满足不了我了。由于博客的改版，服务由`Apache`切换到了`Nginx`，再次安装`letsencrypt`的时候总是提示已经安装过，没有办法去区分服务器类型，纠结了很长时间，查阅了很多文档都找不到方法。习惯于自动化运维的我现在只能去默默学习手动安装。也许`letsencrypt`提供了更简单的命令去自动安装，只是我暂时没有找到，但是，我还是硬着头皮去手动体验了一次，而且花了很短的时间，借助阿里云提供的申请证书的平台，至少省去了填一堆表单的时间。详细记录一下这个过程。

<!--more-->
### 环境描述：
- 阿里云ECS
- CentOS 7
<hr/>
### 购买证书
1. 进入阿里云控制台，在左侧导航栏上点击**CA证书服务**，进入证书申请和购买页面。

![alt](https://beacelee.com/static/upload/201609/EzxAaHBR6RPmMZ5iierrfZFt.png)

2. 点击右上角，**购买证书**按钮，进入证书的选择页面，选择你想要的配置，个人网站的话建议免费版的可以配置多个域名，例如：`beacelee.com`,`demo.beacelee.com`。

![alt](https://beacelee.com/static/upload/201609/65sE13RTi1DF_BH0mHKf-BrD.png)

3. 支付成功后返回**证书控制台**。

![alt](https://beacelee.com/static/upload/201609/nQj9TvBMtIgr3TD-TXJT8dDu.png)

4. 在证书控制台下可以看到你购买的证书列表。

![alt](https://beacelee.com/static/upload/201609/5BQtVgoelZOWxRJ4OK3qYDB6.png)

5. 点击**信息补全**按钮绑定你的域名,根据提示，进行下一步的操作部分截图如下。

![alt](https://beacelee.com/static/upload/201609/dipFuDG5er6qA7tQU7Sc_X33.png)

![alt](https://beacelee.com/static/upload/201609/WMAkCAYZFrShiQ-6vLomXm70.jpg)

6. 信息补全后会发送一封邮件到你的邮箱里，点击邮箱中的链接，填写提示相关信息。在此操作中会有第二封邮件发送，此为验证码。

![alt](https://beacelee.com/static/upload/201609/P3Nxw_1PmKPTE8ppMem-R-4n.png)

7. 上一步邮件中的链接也可以查看证书的状态，例如证书颁发成功之后，出现如下提示。

![alt](https://beacelee.com/static/upload/201609/iSusjpJT0ZlciPnaR2peCBK9.png)

同样在阿里云的证书控制台页面，也会出现如下提示。
![alt](https://beacelee.com/static/upload/201609/oN2IK3ohhni8B6aBdPaSeIPk.png)

购买成功后到此结束，可以将证书下载下来，以便服务器配置。下载下来是两个文件，扩展名分别为`.pme`和`.key`。接下来是服务器的配置。

### Nginx服务器配置
各个版本的操作系统默认nginx的配置文件目录不同，在Centos7下nginx的默认配置目录为：
```bash
/etc/nginx/conf.d
```
需要配置以下内容
- 证书文件
- HTTPS跳转

- 证书文件比较容易，在你容易记住的目录下新建文件夹，将刚才下载的证书文件传到服务器上。

![alt](https://beacelee.com/static/upload/201609/j_V3wny7Tjc_X8GVrhm6_GpL.png)

在这里，我将两个证书文件依次放在了`/etc/nginx/ssl/cert`目录下。

并且将证书文件的目录写在你的`nginx.conf`中。
![alt](https://beacelee.com/static/upload/201609/8t1coznLD2--bJ6yEM1qPXk5.png)

> 值得注意的是，目录千万不要写错。

> 默认配置需要删除，或者保留的话注释要添加完整。

这时候可以重启服务器试下效果：
```bash
systemctl restart nginx.service
```
如果重启服务器失败，可以通过命令：
```bash
systemctl status nginx.service -l
```
来检查错误来源。下图是证书路径没有添加对，重启服务器报出的错误：

![alt](https://beacelee.com/static/upload/201609/kHgV1Y4ysO7cifWvjTw-E4B2.png)

- HTTPS跳转比较容易，只需如下配置即可，通过正则匹配来重写`url`的。

![alt](https://beacelee.com/static/upload/201609/uls2ZpMDlA9_6Sxt_9M0aGyV.png)

### 激动人心的时刻到了
再次重启服务器，在`Chrome`浏览器下地址栏可以明显看到，`url`已经变成了你想要的`小绿锁`。

![alt](https://beacelee.com/static/upload/201609/dPS8WI6UEKHDz6f_hXNSBeKW.png)

通过点击`小绿锁`查看证书信息，可以看到已经有了刚刚安装的证书详细信息。
![alt](https://beacelee.com/static/upload/201609/Pd6Cu2RmI8bWoY1yEOHyZItj.png)

> 有时候会出现`https`可以访问，但是浏览器是灰的的模样，不要着急，那是因为你的部分静态资源还是`http`开头的，所以需要将一些绝对路径的`url`替换成相对路径的`url`，就可以愉快的玩耍了。

>  值得注意的是，在阿里云，当同一个域名，申请了两个证书之后，并不会发生冲突，因为你的证书文件不同，日期也不同。不会因为你申请过而申请失败。

> 有意思的是，你可以用将其他类型或者品牌的证书装在不同的服务器，甚至配置在不同的端口下。彼此之间互不影响，和谐工作。
