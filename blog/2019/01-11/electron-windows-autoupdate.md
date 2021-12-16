---
title: 有关Electron 在 Windows平台下的自动更新方案
date: 2019-01-10T23:00:23
---


## 背景
- 使用 [electron-builder](https://www.electron.build) 打包 Electron 应用程序
- 使用了 [electron-simple-updater](https://github.com/megahertz/electron-simple-updater) 协助自动更新

## 问题

electron-simple-updater 不支持 NSIS 安装包自动更新。

- Windows 下无法触发自动更新
- NSIS 与 Squirrel.Windows 互相纠缠不清

## Windows 下两种安装包

## NSIS

[NSIS](https://nsis.sourceforge.io/Main_Page) 是目前比较提倡的，electron-builder 默认选用的安装包方式。对于 NSIS 的安装包来说，如果直接用 electron-build 提供的 `electron-autoupdater` 自动更新是没有问题的，并且提供了更加友好的解决方案，例如[下载进度](https://www.electron.build/auto-update#differences-between-electron-updater-and-built-in-autoupdater)等等。

但是由于我错误地选用了 [electron-simple-updater](https://github.com/megahertz/electron-simple-updater)，为了节省时间，这种几乎 0 配置的方式立马得到了我的青睐。于是乎就这么上去了。至今才发现，[它只支持 Squirrel 不支持 NSIS 在 Windows 下的自动更新](https://github.com/megahertz/electron-simple-publisher/issues/22#issuecomment-310549821)。

这也印证了我之前一直好奇这个库的例子给的 Windows 下 [update 字段的地址](https://github.com/megahertz/electron-simple-updater/blob/master/example/updates.json)为什么不是一个文件的问题，原来它会去你指定的这个目录下找相应版本的 `.unpkg` 文件。

由于 NSIS 和 Squirrel 不能够相互转化，也就是说，之前用了 NSIS 的应用程序，我再用 Squirrel 包去更新，是不可行的。强行的话会报这样的错误。

![20190108172704](https://imgs.beacelee.com/2019/electron/WX20190112-213305%402x.png)

> Simplified auto-update is supported on Windows if you use the default NSIS target, but is not supported for Squirrel.Windows. You can easily migrate to NSIS.

相反，你如果之前用的是 Squirrel, [就可以顺利过渡到 NSIS](https://github.com/electron-userland/electron-builder/issues/837#issuecomment-355698368)。到这里可以得出一个结论，之前用 NSIS 的用户，需要其切换到 Squirrel 的方式。

## Squirrel

Squirrel 是在 Electron 旧版本中最提倡的打包方式，但是官方已经说要抛弃它了。

> Squirrel.Windows target is maintained, but deprecated. Please use nsis instead.

但是它还是会在目前阶段进行保留。它的更新是通过类似这样的文件来实现`keymanager-0.21.2-full.nupkg` 。那我们之前图省事选用的自动更新库 electron-simple-updater 帮我们做得事情，其实就是来也只支持 Squirrel 这种方式。

## 效果

经过反复测试，Squirrel 在 Windows 下的安装体验较差。几乎没有过程（可能我还没找到相应配置）。安装过程不用手动操作，双击后自动安装打开。效果如下。不过，可以生成 MSI 等格式的安装包，默认都是 .exe。

![20190108232257](https://images-manager.oss-cn-shanghai.aliyuncs.com/2019/electron/WX20190112-213353%402x.png)

中间绿色的图片 GIF, 默认是`build/install-spinner.gif` 其实就是 Electron.exe 安装的场景，安装完之后立即启动。更新效果如下。

![20190109022548](https://images-manager.oss-cn-shanghai.aliyuncs.com/2019/electron/WX20190112-213428%402x.png)


## 结论

NSIS 到 Squirrel 没有更好的方式过渡，只能强行覆盖版本。这是我一次技术选型的失误和对 Windows 平台研究不透彻导致的错误，上面也是 Windows 下更新不了的主要原因。所以还是代码（配置）的原因。

还是需要像上面那样解决去引导之前 Windows 用户。

还有另外一个解决方案，但是也少不了之前的破坏性更新。就是更新这块代码我们自己来写，这样就可以和最新的 NSIS 安装包方式保持一致，也跟 Electron 在之后的愿景一致，以及在体验上可以增加进度，更多友好的提示等等。

最后附上 NSIS 和 Squirrel 的打包配置。

## Squirrel

```json
"win": {
  "target": [
    "squirrel"
  ],
  "certificateSha1": "xxx",
  "rfc3161TimeStampServer": "http://timestamp.xxx.com/rfc3161TimeStampServer",
  "timeStampServer": "http://timestamp.xxx.com/timeStampServer.dll"
},
"squirrelWindows": {
  "iconUrl": "https://xxx/icon.ico",
  "artifactName": "${productName}-Setup-${version}.${ext}"
},
```

## NSIS

```json
"win": {
  "target": ["nsis"],
  "certificateSha1": "xxx",
  "rfc3161TimeStampServer": "http://timestamp.xxx.com/rfc3161TimeStampServer",
  "timeStampServer": "http://timestamp.xxx.com/timeStampServer.dll"
},
"nsis": {
  "oneClick": false,
  "allowToChangeInstallationDirectory": true,
  "artifactName": "${productName}-Setup-${version}.${ext}"
},

```