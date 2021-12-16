---
title: Github中passport的应用（github登录接口）
date: 2016-09-12T17:11:07
updated: Sun Sep 18 2016 16:44:36 GMT+0800 (CST)
comments: 1
categories:
tags:
  - JavaScript
permalink: github-login-passport
---

1、点击头像下拉三角形按钮，进入`settings`

![alt](/static/upload/201609/3xazQProopGfFmwFvHPxJJb9.jpg)
<!--more-->
2、点击左侧列表按钮中的`oAuth applications`

![alt](/static/upload/201609/8wrAeCtemdk_e9A_Yp8osbI6.jpg)

3、左侧默认显示的你曾经用`github`账号登录过的网站，点击`developer application`，作为开发者应用使用。
4、依次按照表单提示填写内容，最终会生成`Client ID `和 `Client Secret`。

![alt](/static/upload/201609/9zx-WatjFPDiuJ5t3QCeBDzJ.jpg)

5、在项目中安装两个模块
```bash
npm install：

"passport": "*",
"passport-github": "*"
```
6、在入口文件中（app.js） 引入模块：
```js
//创建用户使用github登录
var passport = require('passport'),
    GithubStrategy = require('passport-github').Strategy;
app.use(passport.initialize());//初始化
// YOUR ClientID/Secret
passport.use(new GithubStrategy({
    clientID: "ClientID",
    clientSecret: "ClientSecret",
    callbackURL: "http://localhost:3000/login/github/callback"
}, function(accessToken, refreshToken, profile, done) {
    done(null, profile);
}));
```
7、在网络请求中，分配路由，并且把github所登录的账户写入session（默认会在user中）
```js
//github login
    app.get("/login/github", passport.authenticate("github", {session: false}));
    app.get("/login/github/callback", passport.authenticate("github", {
        session: false,
        failureRedirect: '/login',
        successFlash: '登陆成功！'
    }), function (req, res) {
        req.session.user = {name: req.user.username, head: "https://gravatar.com/avatar/" + req.user._json.gravatar_id + "?s=48"};
        res.redirect('/');
    });
```
8、在模板引擎`ejs`文件中加入`github`登录的链接进行测试：

```html
<a href="/login/github">使用 GitHub 登录</a>
```

![alt](/static/upload/201609/kFSFiwtkb7Euc9n9QjPX0oMp.jpg)