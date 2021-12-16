---
title: gitlab与 gitlab runner 安装问题
date: 2018-06-27T18:29:48
updated: Wed Jun 27 2018 21:21:47 GMT+0800 (CST)
comments: 1
categories:
tags:
  - GitLab
permalink:  gitlab-gitlab-runner-install
---

## 环境

- 阿里云 ECS（2核4G）
- CentOS 7.x
- Mac


<!--more-->
## 问题

### 问题1

```
Preparing services... Starting services... /opt/gitlab/embedded/bin/runsvdir-start: line 24: ulimit: pending signals: cannot modify limit: Operation not permitted
```
![](https://images-manager.oss-cn-shanghai.aliyuncs.com/2018/gitlab/1.png)

### 解决方案

并不是给那些提示的文件描述权限，而是给以下目录权限

```bash
sudo chmod 2770 /srv/gitlab/data/git-data/repositories
```

参考链接

https://mp.weixin.qq.com/s?__biz=MzI1MTA0OTM0Mw==&mid=2650959269&idx=1&sn=9200a125a392ab758e5eda70cb06f697&chksm=f20e29b5c579a0a3e6dc7f45e4e6687ad2711df9625ba5d0bedfa5f462730c822e716618600e&mpshare=1&scene=1&srcid=08179qwIdJzHhlvrkJRbWonQ&key=3ca3acd7b7e79486ba072b984547bfaa48440387c4a04b42aceb4989f2dfd1e14e5b06a7cb48de54a8593d5f366c554f4396c09ac920fbeaf7df045569c0ea6eaa6395c0839b0902833a950a6a2f9725&ascene=0&uin=MjE4MTczNDcwMA%3D%3D&devicetype=iMac+MacBookAir6%2C1+OSX+OSX+10.12.5+build(16F73)&version=12020


### 问题 2

gitlab runner 独立于 gitlab，安装 gitlab 后需要在 docker 再起一个 contaienr，并且注册时若选择了 spec token 需要再项目里设置。

`gitlab runner install`

```bash
docker run -d --name gitlab-runner --restart always \
  -v /srv/gitlab-runner/config:/etc/gitlab-runner \
  -v /var/run/docker.sock:/var/run/docker.sock \
  gitlab/gitlab-runner:latest
```

![](https://images-manager.oss-cn-shanghai.aliyuncs.com/2018/gitlab/2.png)

### 解决方案

`gitlab runner register`

```
docker exex -it gitlab gitlab register
```
![](https://images-manager.oss-cn-shanghai.aliyuncs.com/2018/gitlab/3.png)

### 问题 3

gitlab 配置好runner之后发现CI还是pedding， 一个是指定runner，一个是共享runner，指定runner需要在项目里面配置，共享runner需要指定tag

![](https://images-manager.oss-cn-shanghai.aliyuncs.com/2018/gitlab/4.png)

### 解决方案
启用untag的runner

![](https://images-manager.oss-cn-shanghai.aliyuncs.com/2018/gitlab/5.png)

顺利构建

![](https://images-manager.oss-cn-shanghai.aliyuncs.com/2018/gitlab/6.png)

### 问题4
`gitlab docker in docker ```

如下错误

```
Warning: failed to get default registry endpoint from daemon (Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?). Using system default: https://index.docker.io/v1/
Not logged in to https://index.docker.io/v1/
```

![](https://images-manager.oss-cn-shanghai.aliyuncs.com/2018/gitlab/7.png)

### 解决方案

增加sock磁盘目录

```
vi /srv/gitlab-runner/config/config.toml
docker restart [imageid]

concurrent = 1
check_interval = 0

[[runners]]
  name = "#####"
  url = "#####"
  token = "#####"
  executor = "docker"
  [runners.docker]
    tls_verify = false
    image = "docker:latest"
    privileged = false
    disable_cache = false
    cache_dir = "cache"
    volumes = ["/var/run/docker.sock:/var/run/docker.sock", "/cache"]
  [runners.cache]
    Insecure = false
```
参考链接： https://gitlab.com/gitlab-org/gitlab-runner/issues/1986
