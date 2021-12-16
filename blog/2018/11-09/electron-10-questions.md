---
title: electron 10 问 10 答
date: 2018-11-09T19:00:23
---

1. 如何利用NodeJS 子进程为 electron render 提供 API server，以及维护子进程的状态

可以通过NodeJS 内置模块 child_process spawn 文件，并且watch文件的状态。

```javascript
const node = childProcess.spawn(path.join(dirPath, binariesPath), [], {
  cwd: process.cwd(),
  env: {}
});
node.stdout.on('data', data => {
  console.log(`stdout: ${data}`);
});
```

在 main.js 中引入 child , 保证在渲染之前子进程已经调用。

```javascript
import childProcess from './child';
```

在electron退出时杀死进程，以免造成 API 端口的占用。

```javascript
app.on('before-quit', () => {
  childProcess.kill('SIGINT');
});
```

2. 如何更新时不覆盖用户的登录状态和动态生成的缓存文件

electron 更新时会将 application 中的内容覆盖，导致文件丢失。

不过 electron 提供了获取 `userData` 的 API， 可以根据 `electron.app.getPath('userData')` 获取用户存储信息的位置，在 MacOS 下为 `/Users/username/Library/Application Support/appname`，可以将用户信息存储和缓存问题件存储在这个位置，从而避免更新时覆盖源文件。

3. Windows 如何进行选择目录安装，electron-builder 配置介绍

通过 electron builder 进行 electron 打包时，Windows 环境下添加如下配置

```json
"win": {
  "target": [
    "nsis"
  ]
},
"nsis": {
  "oneClick": false,
  "allowToChangeInstallationDirectory": true
}
```

这样 Windows 用户在安装时会提示用户选择安装位置

4. 如何自动更新（MacOS）

首先需要再Mac下自签发一张代码签名证书。electron-build 在打包签名时会自动匹配当前的可信证书。不同证书打包出来的应用是不可以自动更新的，包括appid不一致也会导致更新不成功。

mac下创建代码签名证书在钥匙串->证书助理中创建，并确保证书可信。创建成功后，双击证书，选择系统信任。

![](https://images-manager.oss-cn-shanghai.aliyuncs.com/2018/11-09/20181109174551.png)

可以采用 [electron-simple-updater/example at master · megahertz/electron-simple-updater · GitHub](https://github.com/megahertz/electron-simple-updater/tree/master/example) 进行更新配置。由于 electron builder 采用的是两个 package.json [Two package.json Structure - electron-builder](https://www.electron.build/tutorials/two-package-structure) 的结构, 即开发依赖和应用依赖。简单理解为根目录下，应该存放打包需要的环境以及工具等依赖，在真正 app 中的依赖是最终打包到 electron 中去的。 因此需要把 electron-simple-updater 放在 `./app/package.json`中，并且在`package.json`中添加`updater`的远程地址。

最终你的配置应该与下面的类似

```json
// ./app/package.json
"updater": {
  "url": "https://update.domain.com/updates.json"
},
"dependencies": {
  "electron-simple-updater": "^1.2.4"
}
```

具体 updates.json 包含如下

```json
{
  "win32-x64-prod": {
    "readme": "Second release",
    "update": "https://github.com/megahertz/electron-simple-updater/releases/download/win32-x64-prod-v0.0.2",
    "install": "https://github.com/megahertz/electron-simple-updater/releases/download/win32-x64-prod-v0.0.2/Simple.Updater.Example.Setup.0.0.2.exe",
    "version": "0.0.2"
  },
  "darwin-x64-prod": {
    "readme": "Second Release",
    "update": "https://github.com/megahertz/electron-simple-updater/releases/download/darwin-x64-prod-v0.0.2/release.json",
    "install": "https://github.com/megahertz/electron-simple-updater/releases/download/darwin-x64-prod-v0.0.2/Simple.Updater.Example-0.0.2.dmg",
    "version": "0.0.2"
  },
  "linux-x64-prod": {
    "update": "https://github.com/megahertz/electron-simple-updater/releases/download/linux-x64-prod-v0.0.2/simple-updater-example-0.0.2-x86_64.AppImage",
    "install": "https://github.com/megahertz/electron-simple-updater/releases/download/linux-x64-prod-v0.0.2/simple-updater-example-0.0.2-x86_64.AppImage",
    "version": "0.0.2"
  }
}
```

5. CI如何在一个平台构建多个平台的安装包

electron 支持在一个平台打包多个平台的安装包，为了和本地开发环境保持一致，可以在ci中通过shell的方式直接在MacOS上进行打包。

6. 如何将额外的文件打包至app/content 中

可以在开发环境下的package.json 文件中增加额外的文件，例如

```json
"build": {
  "extraFiles": [{
    "from": "binaries/${os}",
    "to": "binaries/",
    "filter": [
      "**/*"
    ]
  }]
}
```

可以根据不同的操作系统附加不同的文件，例如上面的配置打包之后会在应用程序的目录下出现 binaries 包文件。

开发过程中可以通过指定环境变量的方式来使用不同文件的包。

7. headless模式下如何自定义关闭按钮

通过 electron 中的事件进行模拟。MacOS下关闭事件并不杀死进程，与Windows和linux进行区分。

```javascript
import { remote } from 'electron';
handleClose = () => {
  if (isWindows() || isLinux()) {
    remote.getCurrentWindow().close();
  } else {
    remote.getCurrentWindow().hide();
  }
};

  handleMinimize = () => {
    remote.getCurrentWindow().minimize();
  };

  handleFullscreen = () => {
    remote
      .getCurrentWindow()
      .setFullScreen(!remote.getCurrentWindow().isFullScreen());
    this.setState({
      fullscreen: remote.getCurrentWindow().isFullScreen()
    });
  };
```

8. electron 图标

可以通过下面的工具将一张图片转换成多张不同尺寸的图片，并且可以导出ico、icns格式的图片。

[ICON CONVERTER: Convert PNG to ICO and ICNS online - iConvert Icons](https://iconverticons.com/online/)

9. 无边窗口的拖动
要使整个窗口可拖拽, 可以直接在body中添加如下样式

```css
body {
  -webkit-app-region: drag;
}
```

同时需要将其中触发点击事件的元素标记为不可拖拽, 不然无法点击

```css
.no-drag {
  -webkit-app-region: no-drag;
}
```

如果只想要自定义的标题栏进行拖拽，则可以使用如下样式
```css
.titlebar {
  -webkit-user-select: none;
  -webkit-app-region: drag;
}
```

10. 主进程与渲染进程的通信

以一个点击菜单为例， 点击菜单后在渲染进程监听动作并执行操作。

```javascript
{
  label: '偏好设置...',
  accelerator: 'Command+,',
  click: (menuItem, currentWindow) => {
    currentWindow.webContents.send('openPreferences');
  }
},
```

```javascript
ipcRenderer.on('getPreferences', () => {
  this.setState(prevState => ({
    isPreferencesOpen: !prevState.isPreferencesOpen
  }));
});
```

webContents 属于主进程，向网页发送消息，接收到后打开『偏好设置』。