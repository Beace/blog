---
title: Clean Blog by Node && React
date: 2016-12-12T20:54:03
updated: Mon Dec 12 2016 21:07:48 GMT+0800 (CST)
comments: 1
categories:
tags: ['JavaScript', 'Webpack']
permalink: node-react-1
---

## 前言

介于最近一直在维护公司的业务没有真正自我提高，因此，每天吃饭睡觉上厕所的时候都会想之前都会想等公司业务结束之后的事情。终于，经过半个多月的思考，准备把公司的`scala+palyframework` “恶心组合”换成`Node`，不过先要从尝试做起。接下来的七天，我会着手用`Node`和`react`去完成一个前后端的博客系统。虽然对这种以内容居多的网页很多人不建议搞成`SPA` ，但是为了学习着想我还是愿意去踩着个坑。



<!--more-->
### 下面便是整个架构的搭建。

所用到的技术

- Node   			v6.2.2
  - express.js  	   v4.13.4
- React
  - react-router
- Webpack
- Babel
- EJS
- Bootstrap Clean Blog

其他版本请关注`/package.json`

## 开始实战

### 目录结构的生成

首先，要全局安装`express`

```bash
 npm install -g express

```

在命令行中切换到你想要的的本地目录，生成`express`，` -e` 表示使用`ejs`的模板引擎，并安装依赖
```bash
    express -e express-react-2
    cd express-react-2
    npm install
```
![node-express](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/node-react/node-react-1.png)

安装完成之后先不急着运行，可以先看看目录结构
```
    express-react-2
    /bin
    /node_modules
    /public
    	|- stylesheets
    	|- JavaScripts
    	|- images
    /routes
    	|- index.js
    	|- users.js
    /views
    	|- index.ejs
    	|- error.ejs
    app.js
    package.json
 ```



### 添加`React/webpack/babel`依赖

`package.json`文件如下：
```json
    {
      "name": "express-react-2",
      "version": "0.0.0",
      "private": true,
      "scripts": {
        "webpack": "webpack --process --colors --watch",
        "start": "node ./bin/www"
      },
      "dependencies": {
        "body-parser": "~1.15.1",
        "cookie-parser": "~1.4.3",
        "debug": "~2.2.0",
        "ejs": "~2.4.1",
        "express": "~4.13.4",
        "morgan": "~1.7.0",
        "react": "^15.4.1",
        "react-dom": "^15.4.1",
        "react-router": "^3.0.0",
        "serve-favicon": "~2.3.0",
        "webpack": "^1.14.0",
        "babel-core": "^6.10.4",
        "babel-loader": "^6.2.4",
        "babel-polyfill": "^6.16.0",
        "babel-preset-es2015": "^6.6.0",
        "babel-preset-react": "^6.5.0",
        "babel-preset-stage-2": "^6.17.0",
        "babel-preset-stage-3": "^6.17.0"
      }
    }
```
通过如下命令，来进行依赖的安装。

```bash
    npm install
```


安装完成之后，在项目根目录下新建wepack.config.js文件，为了使用ES6的语法，写入如下内容：
```jsx
    var path = require('path')
    var webpack = require('webpack')

    module.exports = {
        entry: './src/index.js',
        output: {
            path: 'public/javascripts/local/dist',
            filename: 'bundle.js'
        },
        module: {
            loaders: [{
                test: /.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }]
        }
    };
```
#### 解释如下
| key        |value           | explain  |
| ------------- |:-------------|:-----|
| entry      | ./src/index.js | 可以理解为需要转语法的文件(react项目虽然有无数个jsx文件，但是，由于层层引用，因此这里只需要对index.js作为入口文件即可) |
| path      |public/javascripts/local/dist      |   生成的目标文件，最终将在index.html中引用 |
| filename |bundle.js    |  生成的文件名，即最终在index.html中引用bundle.js文件  |
 | module |Array    |  	添加babel对ES5-ES6的设置 |

<br/>
除此之外，还需要新建`.babelrc`文件，写入以下内容

```js
{
    presets: ['es2015', 'react', 'stage-2']
}
```
> 到此为止，所有的项目配置已经完成。当你设置路由并且写入`react`代码时，就可以发现有输出了。这里，我将`wepack`命令，写入到了`npm`的脚本当中。


```json
    "scripts": {
        "webpack": "webpack --process --colors --watch",
        "start": "node ./bin/www"
    }
```
通过运行第一行命令，可以执行`webpack`有关内容，通过第二行命令，可以启动`node`服务，刻意做到了前后分离的效果。

```bash
    npm run webpack
    npm start
```
### 测试webpack

在项目根目录下新建`src/index.js`，键入最基本的`ES6`代码。
```jsx
    let a = 1;
    let b = 2;
    console.log( a + b );
```
可以看到控制台有`webpack`的输出

![node-express-webpack](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/node-react/node-react-2.png)

并且看到`/public/javascripts/local/dist/index.js`中内容已经转化为ES5语法

![node-express-webpack](https://images-manager.oss-cn-shanghai.aliyuncs.com/static/node-react/node-react-3.png)


### 总结

项目至此前端与服务器部分已搭建完成，当然，还有一些基本的`express`路由和`react`路由没有配置。这不是本次记录主要涉及的内容，后续会依次进行记录。项目的开发会跑在开发之前。至今为止，已经搭建好了前端路由以及后端服务器路由。一些基本的样式已经写好，并且借用用了`bootstrap clean blog`主题，可以先一睹`SPA`的风采。




