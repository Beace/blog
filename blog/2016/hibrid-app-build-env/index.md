---
title: 我是如何搭建HyBrid App开发环境的
date: 2015-12-05T02:00:00
updated: Thu Sep 22 2016 10:27:05 GMT+0800 (CST)
comments: 1
categories:
tags:
  - hybrid
permalink: build-hybridapp
---

> 用web开发app简直耗尽机器的性能和人的体力、精力。
> 不过为了满足我的好奇心，经过一番折腾。我还是去做了。

简单来记录一下这个复杂又简单的过程。

<!--more-->
### step1
我是借助`cordova`来进行打包和模拟的。因此首先安装`cordova`，因为基于`nodejs`，必须安装`nodejs`。版本越高越好，但是一定是稳定版，beta版就算了。
```bash
npm install -g cordova
```
由于网络原因，安装的时候多次崩溃。但是没关系，多试几次就好。安装过程中会提示`warring`：它要求的`nodejs`版本会和你的不符合，但是没关系，这不影响开发。来几张截图。
![alt](https://beacelee.com/static/upload/201609/riVX9JRbn3hijm5jrc04WZir.jpg)

### step2
安装`cordova`成功后,可以进入官网http://cordova.apache.org/#getstarted ，建立一个简单的模板。
![alt](https://beacelee.com/static/upload/201609/Dfpt9n5HWe-EL8vAtRIfR5Dc.jpg)

### step3
运行:

```bash
$  cordova run browser
```
这个时候就可以看到你的空白的模板已经运行在浏览器上了。但是也只有一张图片而已。还没有在真实的环境中运行。

![alt](https://beacelee.com/static/upload/201609/qAaXwKSOxs12wyc1IPFqdK5V.jpg)

### step4
如果想要用模拟器对cordova进行真机模拟或者直接在手机上运行，还需要进行第5步。

### step5
安装Android SDK,http://android-sdk.en.softonic.com/ 下载安装。并配置好环境变量这些东西。

### step6
安装`Ant`。http://ant.apache.org/ ,下载安装。
`Apache Ant`,是一个将软件编译、测试、部署等步骤联系在一起加以自动化的一个工具,大多用于`Java`环境中的软件开发。
需要利用`Ant`将`cordova`和`SDK`联系在一起。不要忘记环境变量。

### step7
到这一步就可以对`cordova`进行真机上的模拟了。
在项目中添加`android`运行环境。

```bash
$ cordova platform add android //1
$ cordova build android //2
$ cordova emulate android //3
```
但是，单纯的我以为一切都已经变得很美好了，可以结束了的时候，会发现，事情不会有那么简单。
当运行到第（2）步的时候，出现了我的`android SDK`版本不符合要求，要求：`API 22`
![api22错误](https://beacelee.com/static/upload/201609/VvwRMK6G9cQPyhqlxpe37vKD.jpg)

**于是乎，我开始对版本帝是android进行更新和下载，尽管我已经找到了代理，但是还是花费了我40多分钟的时间，安装完成了。**

![api下载](https://beacelee.com/static/upload/201609/OxJ_Rrbuiv3MJbFOmMwfAz7N.jpg)

> 好了，我现在可以工作了。已经是凌晨两点钟。

当我再次运行，发现还是版本不符合要求。我受不了了。

但是还是检查了一下报错，突然发现，`cordova`指向的`SDK`并不是我刚刚安装的`SDK`，于是我到环境变量中查看，原来是安装`Android Studio`的时候，它自动配置的环境变量，在C盘的某某地方，结果就是这样。我TM刚刚更新的`API`是另一个`SDK`的。于是乎，我修改了环境变量。

### step8
再次运行，还是报错，说不`API`版本不对。再一次，还`error`。再一次。。。我受不了了，简直忍无可忍。生气的我直接在`Windows`下的命令行输入了`exit`。

但是睡不着。。。。于是我又重新打开命令行，最后运行了一边，竟然成功了。。。这机器没反应过来？！我只能这么解释。

由于`SDK`会带一个模拟器，`AVD`。进行模拟的时候很慢很慢，慢到难以置信，而且这个期间电脑一直没有反应，不会报错，过个五分钟，模拟器出来了。好吧。于是我想起来之前安装的`Genymotion`，于是直接运行：

```bash
$ cordova build android
```
![alt](https://beacelee.com/static/upload/201609/aEXV54-RPea05e_9VLQJhtxg.jpg)

![alt](https://beacelee.com/static/upload/201609/xJu4SvYbc18b58mDh2ukInWz.jpg)

`cordova`会在一个`output`文件夹下生成了一个安装包，直接拖到`Genymotion`中运行。（由于我是`AMD`的处理器，所以没有`Intel`的硬件支持，开发`android`应用的时候只能用`Genymotion`）。
第一次`build`比较慢（特别慢），第二次`3s`。

![alt](https://beacelee.com/static/upload/201609/TR8WNRWm2_3yDPzpsLMuNCih.jpg)

![alt](https://beacelee.com/static/upload/201609/ZNPpWwx1By0Mep82bHjMSYfF.jpg)

最后终于ok。

### step9
下一次说`Ionic`。



