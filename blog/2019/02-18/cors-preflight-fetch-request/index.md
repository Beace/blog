---
title: CORS-preflight fetch(request)
date: 2019-02-18T10:00:23
tags:
  - JavaScript
---

跨域预检请求，术语为 CORS-preflight fetch 或 CORS-preflight requst。**浏览器**默认有不得跨域请求资源的限制，因此服务端往往在 response header 中加入相应的允许跨域请求的请求头，允许前端对 API 进行跨域请求。浏览器识别服务器是否允许跨域请求资源，是通过预检来完成。这篇文章，主要是来记录跨域的预检请求。

## CORS-safelisted method
在服务端设置 `Access-Control-Allow-Origin` 为相应域名后，浏览器就允许按照下面这三中方法来跨域请求资源了。

- GET
- HEAD
- POST

也就是说，在服务端设置 `Access-Control-Allow-Origin`，资源就允许通过以上三种方法进行跨域访问。

以下示例。

```bash
touch server.js server2.js index.html
```

在 `server.js` 中起一个基础的服务，为 `3000` 端口，作为服务端来提供资源

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001')
  res.end('123');
});

server.listen(3000, () => {
  console.log('server is listening on port: 3000...');
});
```

在 `server2.js` 中再起一个基础的服务，为 `3001` 端口，作为客户端渲染 `HTML`，并且请求 `3000` 端口资源。

```javascript
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const html = fs.readFileSync('./index.html', 'utf-8');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001')
  res.end(html);
});

server.listen(3001, () => {
  console.log('server is listening on port: 3001...');
});
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>CORS-preflight</title>
  </head>
  <body>
    <h1>CORS-preflight</h1>
    <script>
      fetch('http://localhost:3000', {
        method: 'POST', // OR GET HEAD
      })
        .then(res => res.text())
        .then(data => console.log(data));
    </script>
  </body>
</html>
```

启动服务后进入 http://localhost:3001 可以看到，可以正常访问到 `3000` 端口的资源。


![](https://imgs.beacelee.com/2019/cors-preflight/1.png)

可以尝试将方法改为 `GET` 和 `HEAD`。

浏览器认为如果不是以上的安全请求方法，都会在实际请求 API 时会发出 method 为 `OPTIONS` 的预检请求。并且，对请求的方法有如下限制，以下称为 CORS 安全方法。

我们来修改下 `index.html` 中 fetch API 中的 method，这里改为 `PUT`.

```javascript
fetch('http://localhost:3000', {
	method: 'POST',
})
	.then(res => res.text())
	.then(data => console.log(data));
```

刷新页面，可以看到浏览器抛出了错误。

![](https://imgs.beacelee.com/2019/cors-preflight/2.png)

并且 devtool 中也可以看出事先发出了 `OPTIONS` 请求，虽然在 response 中可以看到数据，但是在代码中，获取不到实际的数据。

![](https://imgs.beacelee.com/2019/cors-preflight/3.png)


浏览器明确地提示，`Method PUT` 是不被允许的。或者更加明确地说，浏览器的预检（preflight）请求中没有接受到服务器返回的 `Access-Control-Allow-Methods` 中包含该方法。

修改 `server.js` 中的代码，在增加 header

```javascript
res.setHeader('Access-Control-Allow-Methods', 'PUT')
```

重启服务器后可以看到，有两个请求发送，一个还是浏览器的预检请求，另外，则是 `PUT`,并成功返回了数据。


![](https://imgs.beacelee.com/2019/cors-preflight/4.png)

除了`PUT`之外，通常来讲，还有 `DELETE` 等方法，在实际开发中，会一并加上。

## CORS-safelisted request-header
除了 method 之外，CORS 还对请求头有一些限制。其中除以下请求头之外，其他的都会被block掉。

```
accept
accept-language
conent-languate
content-type
```

### Content-Type
对于 `content-type`  而言，也有以下限制。只允许以下三种。

- text/plain
- multipart/form-data
- application/x-www-form-urlencoded

我们来修改 `index.html` ，在 fetch 的 headers 中加入 content-type

```javascript
fetch('http://localhost:3000', {
	method: 'PUT',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		hello: 'world'
	})
})
```

刷新浏览器，可以看到浏览器明确指出请求头 `content-type`  是不被允许的。

![](https://imgs.beacelee.com/2019/cors-preflight/5.png)

我们来修改下 `server.js` ，增加 `content-type` 为 `application/json` 的请求头。

```javascript
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

重启服务，刷新浏览器，可以看到 `Content-Type` 为 `application/json`的可以成功接收到返回。

![](https://imgs.beacelee.com/2019/cors-preflight/6.png)

### Custom-header
如果是自定义的 header 呢，比如我们需要传递给服务器一个 token 来标识用户身份，修改 index.html

```javascript
fetch('http://localhost:3000', {
	method: 'PUT',
	headers: {
		'Content-Type': 'application/json',
		'X-Auth-Token': 'auth-token',
	},
	body: JSON.stringify({
		hello: 'world'
	})
})
```

刷新浏览器，发现，会有上面同样的错误：不允许 `x-auth-token`。同样，修改 server.js 在，setHeader中追加

```javascript
res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Auth-Token');
```

如果以上设置太麻烦，可以通过`*`来设置。

```javascript
res.setHeader('Access-Control-Allow-Headers', '*');
```

## Access-Control-Max-Age
如此重复地去发送预检请求，并不是一个好的方式。可以通过设置过期时间的方式，在保证安全的情况下在固定时间避免重复地检查。

修改 `server.js` ,在 header 中设置 `Access-Control-Max-Age`

```javascript
res.setHeader('Access-Control-Max-Age', 10);
```

我们约定，在10s内不再检查。重启服务，刷新浏览器。

![](https://imgs.beacelee.com/2019/cors-preflight/7.png)

可以看到，第一次还是进行了预检请求，10s内刷新浏览器，直接请求了 API，10s后再次刷新，预检之后发起了请求。

