---
title: 如何将公司私有项目做得和开源项目一样优秀
date: 2018-12-16T10:00:23
---

> 我们可能都拥有一颗为开源项目的心，但是却没有贡献的点子。我相信是没有贡献的点子的，至少应该具备贡献的能力。对于一个优秀的程序员来说，不想做开源项目是不合格的，如果大部分时间接触不到开源项目，可以多在公司的私有项目里面进行一些思考，是不是能够尽力地往这方面去靠近。这篇文章就是总结一下我在这方面的经验，并且会有一些实际的例如来演示。

## 文档
文档先行。文档是十分必要的，在别人看到你的项目或者其他同事需要介入项目和你一起开发时，精确的文档，可以让其快速的熟悉项目的来龙去脉，甚至看完之后直接进入开发阶段。

### README.md
首先，你的项目根目录需要有一个 README.md 文件作为项目主要的阐述文件。它至少应该具备以下内容。
#### Title
该项目的名字。项目的名字其实不一定和你的项目功能或者说内容有很大关联。比如我之前经历过一个项目，项目名字叫`SpaceX(即美国太空探索技术公司)`，其实就是一个类似`CMS`系统。但是好的名字会让别人印象深刻。
#### Destription
项目描述。尽量一句话到两句话说明白项目是什么，用来做什么，解决什么问题，是给谁用的（客户还是研发自己）。

> 类似于：**xxx项目**是xxx的。**解决了xxx的，有xxx的特点的**，**系统**。

前面的一句话描述很重要。定语加正确之后，宾语一定要落实到具体客观对象。比如`系统`、`框架`、`组件`等等。这样别人能够立马知道项目的定位是什么。

#### Usage
项目是如何使用的。任何人第一次接触该项目并简单了解它的功能之后，一定最想要知道其是如何使用的，或者说想赶快尝试一下。

这时候，必须要有一个用法来告诉用户和贡献者，改项目是如何使用的，最好的方式，是通过GIF、简短的视频演示，让开发者快速了解。

[asciinema - Record and share your terminal sessions, the right way](https://asciinema.org) 是可以保存和分享终端 session 的工具，[generate by react](https://asciinema.org/a/194047) 这是我对 `react-boilerplate`  的  `npm run generate`  命令的简短录屏。至于GIf的录制工具就有很多了，在此不再一一赘述了。

#### Core/Feature
项目的核心思想或者特性。在开发者学会使用你的东西之后，他可能会和其他类似项目进行对比，或者想要进一步了解你的项目的核心是什么，甚至考虑学你的源代码来进一步丰富自己。这个时候就需要你罗列你的features，直接言明你开发此项目所用到的技术（栈）或者核心的编码思想是什么。

在这里我举个例子。我在实际开发过程中，借用了 [react-boilerplate](https://github.com/react-boilerplate/react-boilerplate) 这个项目，并在其基础上进行了拓展甚至是一些代码的优化和改写。我是这么来罗列我的features的。

- [ ] 包含了 `react-boilerplate#features`  所有优点
- [ ] 支持 `HTTPS`  `npm run start:https` 需要在项目根目录下配置名为 `localhost.pem` 和 `localhost-key.pem` 的公私钥
- [ ] 强制 `eslint` 检查
- [ ] 去除了 `i18n`
- [ ] 去除了 `immutable`，采用了 `immer`
- [ ] 自定义的 `loadable-components`
- [ ] 采用 `CSS in JS` 写法
- [ ] 默认包含  `antd`  样式，默认进行了引用优化  `babel-plugin-import`
- [ ] `redux-actions` 将  `switch case` 转化为 `hash map`

#### Detail
综上所诉，开发者应该对项目有了大致的了解了，并且能够直接上手开发了。但是，除了老手之外，还有一些新手，比方说你的项目用到了 ·`react` ，他可能根本就不知道什么是 `React`, 对于这些开发者，应当给与适当的教程类的东西。

比方说我喜欢写一些开发套路的东西来让他迅速感知应用是怎么搭建的。并且适当的掺杂一些原理上的东西，既进行了实战操作，又有对知识的总结。

#### License/Contributor
这里对于私有项目而言并没有多大的用户，可以通过 git 的 menmber 来了解开发成员等等，在此不再多做讨论。

### Badges
作为一个geek的程序员，这个是必备的。就像一个重大节日的夜晚，需要一些灯光的修饰一样。通过灯光的样式，一眼就可以看出来今天是什么节日，例如圣诞节可能会由于圣诞树，圣诞老人模样的灯光。通过灯光的闪烁程度，可以判断出节日的气氛如何，例如万圣节，灯光一般都不太闪烁。badge 也存在这样的功能。

因为公司用的是 gitlab，曾经花了很久来研究 gitlab 上的 badge 应该怎么绘制。下面来说下对 badge 的总结和在 gitlab 中的使用。

首先 badge 应该与 CI_CD（下面说到）挂钩，也就是说需要一个 badge 来实时显示 CI_CD 的进度， 其次，如果代码中有测试，还需要具备测试覆盖率的 badge，这两个 badge 我个人认为是必须存在的，至于其他的，可以通过具体想项目内容进行选择。

下面介绍在 gitlab 中如何添加  pipline 和 coverage 的 badge.

进入项目后侧边栏 `Settings` -> `General pipelines settings` ,有如下 badge。

![badge](https://imgs.beacelee.com/2018/opensource/1.png)

复制你想要的  badge 可以直接添加到你的 README.md 中，对于一些需要特殊处理的，例如测试覆盖率需要通过正则来匹配的，gitlab 也给出了相应的例子，可以通过正则的方式获取覆盖率。

![badge](https://imgs.beacelee.com/2018/opensource/2.png)

另外，在 gitlab，在项目最开头增加的 badge ，在 `Settings` -> `Badges` 中可以添加自定义的 badge， 你可以通过复制上面的图片url和链接url来添加。

![badge](https://imgs.beacelee.com/2018/opensource/4.png)
![badge](https://imgs.beacelee.com/2018/opensource/3.png)

### CHANGELOG
CHANGE LOG 是及其重要的。大部分的开发者都认为，我已经有 git commit l了，为什么还需要 CHANGE LOG。其实，CHANGE LOG 的好处非常明显，你可以在一个文件里面找到所有的 commit 并且在对 commit 进行简单的分类，`feature`、`bug fix`、`doc` 等等。

我采用了 [standard-version](https://github.com/conventional-changelog/standard-version) 来生成 ChangeLog.如下。

![badge](https://imgs.beacelee.com/2018/opensource/5.png)

## 代码
代码是整个项目的核心，上面的再花里胡哨，代码不过关，也是虚有其表，华而不实。
### 目录结构
首先来看整个目录结构，一般而言。通常会把 app(src) 作为源代码的存放目录，在 app(src) 之外的所有文件，应该是配置文件，静态资源，构建工具的文件，代码规约文件，辅助 app(src) 调试开发文件等。
以一个 react 举例。

```javascript
project
 -- app
    -- containers
       -- HomePage
          -- index.js
          -- saga.js
          -- reducer.js
          -- constants.js
          -- selectors.js
          -- actions
    -- components
       -- common
       -- HomePage
    -- utils
       -- reuqest.js
    -- images
    -- app.js
    -- globalStyles.js
 -- docs
 -- server
 -- internals
 -- .editorconfig
 -- .eslintrc
 -- .eslintignore
 -- .gitignore
 -- .gitattributes
 -- .gitlab-ci.yml
 -- .prettierignore
 -- .prettierrc
 -- .stylelintrc
 -- CHANGELOG.md
 -- README.md
 -- babel.config.js
 -- jest.config.js
 -- package-lock.json
 -- package.json
```

通过以上目录结构，不难了解每个目录在整个应用中所起作用，并且通过目录结构，就可以看出项目所用技术栈。在 app 外层的目录，全部是为 app 服务的。`server` 为 app 调试起了服务，`docs` 为 components 文档，`internals` 其实是各种脚本，以及 webpack 的各种配置。另外，其他文件，有关于 git 的，有关于 CI 的，其他均是对代码的规范和约束，下面做具体讨论。

### 代码标准和规范

项目并不是一个人开发，是团队合作的成果。既然需要合作，难以不免每个人都有自己的个性，在个性中保留共性，在坚持共性的基础上支持个性，是每个架构师应该具备的素质。在代码格式和规范上面，团队需要确定一套方案来共同遵守。

#### lint
对于各种规范的实现，可以在 commit 之前，或者在 dev 环境下的 webpack 进行检查以下分别检查 css 和 js 文件。

在 `npm scripts` 进行检查
- css lint `npm run stylelint`
- js lint `npm run lint:eslint -- .`

在 webpack dev 环境下通过 eslint-loader 对代码进行规范检查。

```javascript
module: {
  rules: [
    {
      enforce: 'pre',
      test: /\.js$/,
      loader: 'eslint-loader',
      exclude: /node_modules/,
    },
    //...
  ]
}
```

#### format
格式化为了书写流畅，通常需要通过使用一些工具来提示。类似的，编辑器中的 Prettier - Code formatter 可以对在保存文件时自动格式化代码，并且很多编辑器支持 eslint 插件，可以在不规范的代码附近增加一些提示，从而来避免很多低级错误。

同样的，eslint 支持 `--fix` 参数，可以在 commit 时，帮助修复一些不符合规范的代码，但是绝对不能依靠 `--fix` 来修复你的代码，应该从书写上就养成良好的习惯。从根本上避免错误，总有一天，你会厌恶这些工具，并且不需要依赖这些工具就可以写出漂亮的代码。


### 单元测试
测试是一个项目中必不可少的一环。可能在前端项目中体现的不是那么淋漓尽致，而且前端业务代码基本不可能写出完美的测试，也不可能有完美的测试解决方案。因为需求的变动，以及功能的耦合性太强，所以无法写出一劳永逸的测试代码。但是，有一个是完全可以实现的，就是手动封装的组件和工具函数是完全可以测试的。

#### 对 props 的测试
首先，通用组件需要进行测试。拿 React Component 来举例，React 官方推荐的组件测试，Test Render，是对组件渲染后的 JavaScript 对象进行的测试，无需关注生成的 DOM 节点。

例如，有一个组件 `<LabelInfo />` ，接收一个 `title` 的 prop, 以下是对其 prop 的测试。

```javascript
import React from 'react';
import renderer from 'react-test-renderer';
import LabelInfo from '../index';

describe('<LabelInfo />', () => {
  it('should match the snapshot', () => {
    const renderedComponent = renderer.create(<LabelInfo />).toJSON();
    expect(renderedComponent).toMatchSnapshot();
  });

  it('should have default props', () => {
    const testInstance = renderer.create(<LabelInfo />);
    expect(testInstance.root.props.title).toBe('label info');
  });

  it('should have spec props', () => {
    const testInstance = renderer.create(<LabelInfo title="detail" />);
    expect(testInstance.root.props.title).toBe('detail');
  });
});
```

快照用于测试组件是否正确的呈现，同时我们测试了 default props 是否生效，并且指定了 props 之后是否生效。

#### 对 CSS 的测试
以下代码是对组件是否具备正确的 css 样式的测试。通过增加 padding 的 prop，通过 `toHaveStyleRule` 方法来验证是否能够匹配 padding。

```javascript
import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';

import Container from '../index';

describe('<Container />', () => {
  it('should have a default padding attribute', () => {
    const tree = renderer.create(<Container />).toJSON();
    expect(tree).toMatchSnapshot();
    expect(tree).toHaveStyleRule('padding', '24px');
  });

  it('should have a spec padding attribute', () => {
    const tree = renderer.create(<Container padding={20} />).toJSON();
    expect(tree).toMatchSnapshot();
    expect(tree).toHaveStyleRule('padding', '20px');
  });
});

```

更多的关于 React 测试案例及方法，可以参考以下链接。

> https://reactjs.org/docs/test-renderer.html
> https://jestjs.io/docs/en/tutorial-react
> https://jestjs.io/docs/en/expect

### CLI
所有人都明白，React 写起来貌似比同类框架复杂，并且重复的代码较多。包括其他框架也存在这样的一个问题。每次新建路由，新建页面，貌似都需要重新新建一些其他的文件，并且从别的地方复制一份代码来修改一下命名空间的变量，然后保存看效果等等。重复的操作难免会造成人工的失误，因此通过 CLI 快速新建路由，新建页面，新建 Container Component 成了应用必须具备的工具。

在 CLI 这方面的探索，可以参考 [generate](https://github.com/react-boilerplate/react-boilerplate/blob/master/package.json#L33) 的 script, 通过 `.hbs` 定义了一系列的模板，并且通过 nodejs CLI 的工具的支持，对模板动态地进行替换，从而生成特定的 Container Component，大大减少了胶水代码的编写，从而提高了开发效率。

## 重构难度
必须要明白，当前版本一定不是最终版本。

无论你多么优秀和项目多么成熟，你始终琢磨不透产品的想法和对自己进步的认知。随着开发人员的不断成长和知识的积累，会逐渐发现有更佳的代码编写方式，并且还有更加优秀的依赖库的选择。况且，有时候产品并不会更迭，代码必须要更迭。

因此，在预先需要埋下重构的种子是非常必要的。想类似一些代码规范和标准的制定，这都是一劳永逸的事情，以及 CI/CD 等等。而对于一些库的引用，代码的组织方式，是会改变的。因此，在迭代时，应细水长流。

例如，某个目录下的模块组织方式可能会发生变化，这个变化可能是破坏性的，毕竟，JavaScript 编辑器并不能识别你的目录变化动态的调整目录，况且你的构建工具如果依赖了这个目录，可能也会发生相应的变化。因此，这个目录应该是”被别名”，避免类似 "../../../xxx" 的路由。

再比如，类似的公共模块，可以抽离成 node_modules 来单独维护，从而迭代不受项目的影响。

再比如，项目完成后需要增加多语言的功能，而项目组件已经层层嵌套各种 Wrapper，不可能再有一个 props 来层层传递。因此，通过 React Context API 可以很好的解决这个问题。从而避免 props 传递的问题。

## 版本管理与工作流
上文说的 CHANGELOG 的生成，都需要依赖 `git commit` 的规范书写，毕竟是通过 `git commit` 来实现的。我们至少需要遵守三种规则。

- feat(filenames): commit message
- fix(filenames): commit message
- chore(filenames): commit message

以上三种规则，分别代表了 新增、修复、重构（配置）等变化。我通常通过 [standard-version](https://github.com/conventional-changelog/standard-version) 来管理版本。[standard-version](https://github.com/conventional-changelog/standard-version) 可以通过分析代码行数来自动帮你生成版本号，并且帮你创建一个 `chore(release): vx.x.x` 的 commit。这样在 push 代码时候会同事 push git tag，从而进行 CI/CD（下文）。

## CI/CD
由于是私有项目，这里以 gitlab CI 为例。通常项目下面需要具备 .gitlab-ci.yml 文件，gitlab 识别此文件，从而进行对项目的构建。下面来描述下该文件的编写。

```yaml
image: node:8.11.1

cache:
  paths:
  - node_modules/

stages:
  - test

npm test:
  stage: test
  before_script:
    - npm set registry https://registry.npm.taobao.org
    - npm set disturl https://npm.taobao.org/dist
    - npm set chromedriver_cdnurl http://cdn.npm.taobao.org/dist/chromedriver
    - npm set operadriver_cdnurl http://cdn.npm.taobao.org/dist/operadriver
    - npm set phantomjs_cdnurl http://cdn.npm.taobao.org/dist/phantomjs
    - npm set fse_binary_host_mirror https://npm.taobao.org/mirrors/fsevents
    - npm set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass
    - npm set electron_mirror http://cdn.npm.taobao.org/dist/electron/
    - npm install
  script:
    - npm test
  tags:
    - gitlab-runner-01
  coverage: /All files[^|]*\|[^|]*\s+([\d\.]+)/
  artifacts:
    paths:
      - coverage
    expire_in: 30 days
```

- 首先，你需要指定基础镜像 `image` 关键字。上面指定了 node 镜像 `node:8.11.1`，由于 gitlab CI 基于 gitlab-runner，gitlab-runner 可以配置执行的环境为 docker。也就是说，在你 CI 开始时，runner 模式帮你起了一个临时的 docker-container。
- cache 指定了缓存，在不同 stage 间可以共享文件，这里缓存了 node_modules，可以避免重复的 npm install
- stages 定义了该 CI 具备的阶段，在 yml 中 “-” 表示的意思往往是数组中的一项，或者可以理解为队列中的一项都可以。这里只有一个 stage。
- npm test 这里定义了一个job。是某个 stage 具体需要做的事情，多个 job 可以在同一个 stage，也就是可以 job 可以并行。
- before_sciprt、script、after_script 都是钩子函数，通过字面意思即可了解其含义。
- tags gitlab-runner 有多个，在注册 gitlab-runner 时，默认必须指定 tag 进行运行，指定 tag 后，gitlab CI 会挑选合适的（往往是空闲的），执行 CI
- coverage 这里指定了覆盖率的正则，只有正则在其 pipeline 中输出时，gitlab 才可以进行捕获。
- artifacts 持久化存储，job 结束时会根据所选 path，并且指定过期时间，在 CI 执行完毕之后可以自行下载。可以与 cache 进行比较，cache 为临时存储。


## 总结
综上所述，已经描述了 文档、代码、CI/CD 等相关知识。都是个人经验和自己的看法积累见解。通过以上标准的建立，我学到了很多细节上的知识，如何组织代码，如何能够更有效率的开发，如何让别人也更有效率的开发，同时，也满足了自己想要 geek 的好奇心。共勉，加油。