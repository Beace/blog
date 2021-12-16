---
title: Electron 十问十答（2）
date: 2019-05-13T09:00:23
tags:
  - electron
---

## 如何关联后缀名打开相应应用程序？
Electron-build 配置中`fileAissociations：ext`  配置可以实现关联后缀名。也可以配置为数组，支持多个文件后缀名。

```json
"fileAssociations": {
   "ext": "kmdb"
}
```

## 如何自定义协议打开 electron
在 main 进程中增加如下代码，即可通过 `myapp://` 的方式打开。

```javascript
app.setAsDefaultProtocolClient('myapp');
```

## 如何针对多页面，多个html进行打包
如果需要多个页面，即多个 window ，需要通过 webpack 创建多页面应用的打包构建环境，在开发环境中，也需要手动指定路径。即在 `.html` 中往往有如下配置。

```javascript
scripts.push(`http://localhost:${port}/dist/renderer.dev.${page}.js`
```

## 如何利用 IPC 优雅升级，升级通知手动升级，升级检查？
自动更新使用 `electron-updater`, 往往在 main 中添加如下代码即可
```js
import { autoUpdater } from 'electron-updater';
export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}
```

如何为了更加自由和主动，需要用户手动触发更新。则需要将自动下载关闭。

```js
function updater(sendStatusToWindow) {
  log.transports.file.level = 'debug';
  autoUpdater.logger = log;
  autoUpdater.autoDownload = false;

  autoUpdater.on('checking-for-update', e => {
    log.warn('Checking for update...');
    sendStatusToWindow({ type: 'checking-for-update', data: e });
  });
  autoUpdater.on('update-available', info => {
    sendStatusToWindow({ type: 'update-available', data: info });
    new Notification({
      title: '更新',
      body: `发现新版本 ${info.version}`
    }).show();
  });
  // autoUpdater.on('update-not-available', (ev, info) => {
  //   log.warn('Update not available.', ev, info);
  //   sendStatusToWindow('Update not available.');
  // });
  // autoUpdater.on('error', (ev, err) => {
  //   log.warn('Error in auto-updater.', ev, err);
  //   sendStatusToWindow('Error in auto-updater.');
  // });
  autoUpdater.on('download-progress', progressObj => {
    sendStatusToWindow({
      type: 'download-progress',
      data: {
        progress: parseInt(progressObj.percent, 10),
        logMessage
      }
    });
  });
  autoUpdater.on('update-downloaded', (ev, info) => {
    sendStatusToWindow({
      type: 'update-downloaded',
      data: {}
    });
  });

  autoUpdater.checkForUpdates();

  ipcMain.on('update-now', (event, text) => {
    autoUpdater.downloadUpdate();
  });

  ipcMain.on('quit-and-install', () => {
    autoUpdater.quitAndInstall();
  });
}

```


## 如何利用 `grpc` 进行通信？`node_grpc` 与 electron 版本该如何选择？
查看 node grpc 中 release 版本信息修复的问题对应的electron版本。或者将electron直接升级到 5.0后使用 grpc 最新版本1.20.3。参考以下链接：
https://github.com/grpc/grpc-node/releases/tag/grpc%401.20.3

## 如何注册右键事件，双击事件，仿navtive事件
利用 window 对象的 `contenxtmenu` 事件
```js
window.addEventListener(
  'contextmenu',
  e => {
    e.preventDefault();
    menu.popup({ window: remote.getCurrentWindow() });
  },
  false
);
```

## 如何阻止实例多开？
```js
const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
   if (mainWindow.isMinimized()) mainWindow.restore();
   mainWindow.show();
   mainWindow.focus();
});

if (shouldQuit) {
  app.quit();
}

```

## IPC sendSync 与 send 的区别？
`sendSync` 同步消息到主进程，会阻塞整个渲染进程，会造成 electron “假死” 现象，应避免使用，使用 send。
> 发送同步消息将会阻塞整个渲染进程，你应该避免使用这种方式 - 除非你知道你在做什么。

## electron 在 OSX/ windows下的打包签名策略？
如何使用 electron-builder 对 electron 打包签名，windows 下需要指定证书的指纹或 cn。考虑到 windows 会出现乱码情况，最佳方式是通过指定证书指纹。

```json
"win": {
  "target": [
    "nsis"
  ],
  "certificateSha1": "EA47125B255A0CD0D37AB4937CFCCE2DBC26D6B1",
},
```

OSX 下，可以将证书 base64 编码后，通过环境变量的方式签名。

```sh
CSC_LINK=$CSC_LINK CSC_KEY_PASSWORD=$CSC_KEY_PASSWORD yarn package
```

## 基于 gitlab-runner 的 electron CI 构建流程？
为了和本地开发环境保持一致，在整个 CI 过程中与本地开发配置一样。

首先安装相应的依赖，同时，借助 electron builder 将证书及相关配置项通过环境变量和配置文件的方式指定。在 gitlab 下，需要通过 shell 对 OSX 和 windows 进行打包。同时会生成 latest.yml (windows), latest-mac.yml(Mac),latest-linux.yml(linux) , 同时对应三个平台的自动更新配置文件。可以上传到 CDN。

## 如何接入 brew cask ?
需要按照 brew cask 给出的提示，进行相应的pr提交，提交之后被 merge ，就可以通过 `brew cask install xxx` 进行按照 dmg 了。brew cask 的脚本如下。

```ruby
cask 'keymanager' do
  version '1.2.16'
  sha256 'f2e200b1da061bf7a53898c4cb41f4f79fe1e89cb49fdbb923f9bffcd08ff2e9'
  # keymanager.trustasia.com was verified as official when first introduced to the cask
  url "https://keymanager.trustasia.com/release/KeyManager-#{version}.dmg"
  name 'KeyManager'
  homepage 'https://keymanager.org/'
  app 'KeyManager.app'
end
```
