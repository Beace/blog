---
title: 圣诞节快到了，你还在网上买圣诞彩灯吗，骚年，WS2812了解一下
date: 2018-12-21T19:00:23
---

圣诞节快到了，来一起做一个炫酷的灯带装饰你的家。

![](https://imgs.beacelee.com/2018/12-21/GIF2.gif)

## 前言
想必大家在初识嵌入式开发的时候，第一节课或者说第一个实验，往往都是点亮一个 LED，当初我也是。但是想想那个 LED，没有颜色，亮度不够，并且最多也只是闪烁的效果。如果我想要像下面这样如此炫酷呢。

## 所需硬件设备
- Arduino UNO 开发板及相关调试电源等
- WS2812B 灯带一条
- 杜邦线若干

## 效果
上述的效果是通过 Arduino 控制 WS2812B 灯带实现的。下面进入正文。

## Arduino UNO
下图为 Arduino UNO 平面图

![](
https://imgs.beacelee.com/2018/12-21/D22755E9-09E7-4A67-A786-3002AF2D9014.png
)

这里简单贴出有关 arduino uno 的相关规格。我们将利用它的 5V 电源管脚给 WS2812 供电，同时 ~5 引脚作为数字信号输入。

![](https://imgs.beacelee.com/2018/12-21/2.png)

## WS2812B
通常来讲，普通的LED编程，都为通过数字信号给与控制电流电压来实现 LED 的亮灭的效果。不过，WS2812 就比较强悍。WS2812B是一款智能控制LED光源，控制电路和RGB芯片集成在一个 5050 元件的封装中。

> 5050 是一种电子元件，主要描述了规格。元件长宽 5mm * 5mm，功率 0.2W，光强可以达到5500-6000MCD（纯白光，暖光的稍微小一点），工作电压和普通的led一样，只需要3.2-3.4V，电流也一样，为60MA。

WS2812 LED 具备4个引脚，DI/DO/5V/GND 分别为 数字信号输入（Data IN），数字信号输出(Data Out)，电压 5V，GND。

![](https://imgs.beacelee.com/2018/12-21/3.png)
*图为 WS2812 灯珠*（图片来自 https://www.bilibili.com/video/av20991419/）

我们接下来要使用的是 WS2812B 灯带。从这里可以看出 WS2812 是指一类的 LED，各厂家的规格大不相同。我这里将使用  WS2812B 灯带，本质上是灯珠的另外一种呈现方式。

![](https://imgs.beacelee.com/2018/12-21/4.png)
*灯带*

上图中，每个灯带的 DI、DO、5V 引脚相连，因此，我们就可以通过一个电源，来给这“一串 ”灯珠供电了。这里每一个灯珠，都是可以独立使用的，通过灯珠之间的黑线剪开，就可以独立使用了。

![](https://imgs.beacelee.com/2018/12-21/5.png)


至于购买，可以淘宝搜索 WS2812 就会有各种各样规格的灯带了。不同厂家生产的规格不同，大体有以下几种。

![](https://imgs.beacelee.com/2018/12-21/6.png)

我这里采用的是 **5V 白板裸板 1米/条**。


## 电路连接

![](https://imgs.beacelee.com/2018/12-21/7.png)

通过 PIN5 提供信号输入，5V 提供电压，最后接地，连线很简单。

如下实物图，购买的时候商家提供了接口用于自主开发，为了方便连接 arduino 上的引脚，我这里和三根杜邦线相连。红色、蓝色、白色三根线电源、信号输入、接地。


![](https://imgs.beacelee.com/2018/12-21/8.png)

## 代码编写

这里使用了著名的 arduino led有关库 [fastLED]( https://github.com/FastLED/FastLED) 。在 Arduino IDE 中库管理器中查找 fastled 并 install


![](https://imgs.beacelee.com/2018/12-21/9.png)

安装成功后在 文件 -> 示例 -> fastled 中选择 ColorPalette.


![](https://imgs.beacelee.com/2018/12-21/9.png)

在示例程序中修改以下引脚和LED数量。

```c
#define LED_PIN     5
#define NUM_LEDS    14
```

点击上传后，灯带开始闪烁。可以继续尝试示例中其他的代码或者自己来书写更加炫酷的圣诞灯带吧。

