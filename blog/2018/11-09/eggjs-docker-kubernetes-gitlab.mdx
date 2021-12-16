---
title: 从0到1部署一个eggjs应用
date: 2018-11-16T19:00:23
---

## 环境配置
> 假设已经了解以下应用和服务的使用场景

- [x] 准备一个eggjs应用
- [x] gitlab_github_git…
- [x] Node v8.x.x
- [x] docker
- [x] kubernetes

## egg
### 配置文件config
- [x] config/config.default.js 本地开发环境
- [x] config/config.test.js 测试环境
- [x] config/config.prod.js 生产环境

部署时，根据不同的环境变量的设置启用不同的配置文件，一般本地开发而言，`npm run dev`采用的是`config.default.js`中的配置。在发布时，测试环境中定义的config会覆盖default中的定义，同样，生产环境中也会覆test中的定义。

> 本地开发 config.default.js
> 测试环境 config.test.js -> config.default.js
> 生产环境 config.prod.js -> config.test.js -> config.default.js

例如应用需要msyql，redis等服务配置。一般而言，在本地和测试环境不太考虑性能问题，所以可以将日志开启为`DEBUG`模式，开发环境下数据库应为本地数据库。`config.default.js`如下:

```javascript
'use strict';

module.exports = appInfo => {
  const config = exports = {};
  config.app = {
    name: 'eggjsapp',
  };

  config.sequelize = {
    dialect: 'mysql',
    database: 'eggjsapp',
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: '123123',
  };

  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '',
      db: 0,
    },
  };

  config.session = {
    key: 'eggjsapp', // 承载 Session 的 Cookie 键值对名字
    maxAge: 1000 * 60 * 60, // Session 的最大有效时间
    httpOnly: true,
  };

  config.logger = {
    // disableConsoleAfterReady: false,
    consoleLevel: 'DEBUG',
  };
  return config;
};
```

测试环境和生产环境一般而言是数据库上的区别。因此，不再重复书写。与config.test[prod].js 如下

```javascript
exports.redis = {
  client: {
    port: 6379, // Redis port
    host: '172.1.1.1', // Remote Redis host
    password: 'xxx',
    db: 0,
  },
};

exports.sequelize = {
  dialect: 'mysql',
  database: 'eggjsapp-test[prod]',
  host: 'eggjsapp-test.db.com',
  port: '30000',
  username: 'root',
  password: 'xxxxx',
};
```

### 环境变量
可以通过在npm script 中定义需要的环境变量来加载不同的config文件。从而达到不同环境下使用不同的数据库，日志记录等。
### 日志
对于日志，开发和测试环境下可能不太需要将日志输出到文件，为了方便调试，需要将日志直接打印在控制台上，所以可以通过config.logger的日志等级来达到目的。

## Docker
为了达到，一键发布测试与生产环境的效果，并且便于区分生产环境和开发测试环境的配置，这里独立触两个Dockerfile。

### Dockerfile

```dockerfile
FROM node:8.6.0-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# add npm package
COPY package.json /usr/src/app/package.json
RUN npm i --production
# copy code
COPY . /usr/src/app
EXPOSE 7001
CMD npm start
```

### DEVDockerfile

```dockerfile
FROM node:8.6.0-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# add npm package
COPY package.json /usr/src/app/package.json
RUN npm i --production
# copy code
COPY . /usr/src/app
EXPOSE 7001
CMD npm start:test
```

package.json中npm script定义如下，区分环境变量和端口

```json
{
  "start": "egg-scripts start",
  "start:test": "EGG_SERVER_ENV=test egg-scripts --port=7008",
}
```

## Gitlab
以上的内容这是包括了代码和镜像，只能在本地使用。想象一下如果需要发布，就需要每次手动docker build并push镜像到远程。

我们想把它的做的更加自动化一点，于是有了持续集成和持续交付的概念。因此，在这里以gitlab为例。通过gitlab到ci能够做到自动生成镜像和push到远程。

定义以下的.gitlab.yml，在gitalb stage中定义docker有关，在CI中生成相应代码生产环境之后，进行docker build，同时push到远程，这里涉及到私有docker登录的问题，所以需要docker login, 为了保证安全，docker密码泄露，可以通过文件的方式或者通过在gitlab中设置私密的环境变量获取 [GitLab CI/CD Variables | GitLab](https://docs.gitlab.com/ee/ci/variables/)。

```yaml
docker:
  image: docker:latest
  before_script:
    - docker login -u $DOCKER_USER -p $DOCKER_PASSWORD $DOCKER_REGISTRY
  stage: docker
  script:
    - docker build -t eggjsapp:v1.0.0 .
    - docker push eggjsapp:v1.0.0
  after_script:
    - docker logout $DOCKER_REGISTRY
```

![](https://imgs.beacelee.com/2018/11-16-eggjs-docker-k8s/4.png)

## Kubernetes
如何本地连接远程集群可以参考[容器服务 通过 Kubectl 连接集群 - Kubectl 操作集群 - 文档平台 - 腾讯云](https://cloud.tencent.com/document/product/457/8438)。

需要以下yaml文件

deployment.yaml 文件定义简单的物理环境，以及docker镜像

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  labels:
    qcloud-app: eggjsapp
  name: eggjsapp
  namespace: api
spec:
  replicas: 1
  revisionHistoryLimit: 5
  strategy:
    type: Recreate
  template:
    spec:
      containers:
      - env:
        - name: NPM_CONFIG_LOGLEVEL
          value: info
        - name: NODE_VERSION
          value: 8.6.0
        - name: YARN_VERSION
          value: 1.1.0
        image: xxx.com/eggjsapp-v1.51.0
        imagePullPolicy: Always
        name: shanhushuo
        resources:
          limits:
            cpu: 500m
            memory: 1Gi
          requests:
            cpu: 250m
            memory: 256Mi
      imagePullSecrets:
      - name: dockerregistrykey
      restartPolicy: Always
```

service.yaml 定义为容器的服务，通过NodePort暴露端口

```yaml
apiVersion: v1
kind: Service
metadata:
  name: eggjsapp-service
  namespace: api
spec:
  ports:
  - name: tcp
    nodePort: 30966
    port: 80
    protocol: TCP
    targetPort: 7001
```

最终需要通过ingress暴露至外网，由于我这里采用的是腾讯的私有云，需要在相应ingress直接指向所需服务即可。参考 [容器服务 Ingress转发设置 - 负载均衡 - 文档平台 - 腾讯云](https://cloud.tencent.com/document/product/457/9111)

## 示例：在腾讯云中讲上述所有应用串联起来

1. 首先需要在腾讯云中授权你的代码，通过gitlab的token授权，授权成功后，可以在镜像配置中构建镜像。可以设置镜像的触发时机。
![](https://imgs.beacelee.com/2018/11-16-eggjs-docker-k8s/5.png)

2. 建立自己的私有镜像之后就需要来部署了。首先在腾讯云中创建集群，集群创建完成之后创建一个服务
![](https://imgs.beacelee.com/2018/11-16-eggjs-docker-k8s/6.png)
![](https://imgs.beacelee.com/2018/11-16-eggjs-docker-k8s/7.png)
![](https://imgs.beacelee.com/2018/11-16-eggjs-docker-k8s/8.png)

3. 如果构建的镜像没有问题，服务创建完成之后就可以访问了。可以通过ip+端口进行访问。如果需要进行域名的绑定和端口的映射，可以通过配置ingress来暴露外网。
![](https://imgs.beacelee.com/2018/11-16-eggjs-docker-k8s/10.png)

4. 如果再做的自动化一点，可以在镜像中设置触发器，当镜像构建完成之后，可以通过触发器使集群中的服务自动更新镜像。
![](https://imgs.beacelee.com/2018/11-16-eggjs-docker-k8s/9.png)

## 总结

假如获取pod时报如下错误，可以查看下kubectl版本
![](https://imgs.beacelee.com/2018/11-16-eggjs-docker-k8s/1.png)

以下截图为kubectl版本太高后重新安装1.8版本后成功获取pod
![](https://imgs.beacelee.com/2018/11-16-eggjs-docker-k8s/2.png)

进入容器之后查看具体日志文件
![](https://imgs.beacelee.com/2018/11-16-eggjs-docker-k8s/3.png)
