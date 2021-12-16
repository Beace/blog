---
title: 关于 CI 及测试有关知识工具总结
date: 2018-11-01T17:54:03
---

JavaScript 测试相关工具和库的对比和总结，以及自动化测试以及持续集成的的相关实践。

## 单元测试
### assert 断言
[Assert | Node.js v11.0.0 Documentation](https://nodejs.org/api/assert.html)是 node.js 提供的断言测试的模块。该模块的方法较少，顾名思义，此模块更多是验证boolean是否成立。

assert 又分为两种模式，strict 与 legacy，强烈推荐严格模式，一个是在写法上开启严格模式后不再需要增加额外的 `strict`,并且错误信息会有个 diff 的展示，更重要的是 `任何 assert 函数都会使用严格函数模式的等式`。通常一些优秀的 Node.js 开源项目都会再严格模式下执行。

```javascript
'use strict'

class Controller extends BaseController {
	// ...
}
```

另外需要特别说明的是 assert 的 equal 用来比较实际与预期结果，当实际结果比较复杂，需要深入比较时，assert 提供了 deepStrictEqual 方法，具体比较了`对象的类型、对象的原型等等`。参考 [assert_assert_deepstrictequal_actual_expected_message](https://nodejs.org/api/assert.html#assert_assert_deepstrictequal_actual_expected_message)

### Should.js

[GitHub - shouldjs/should.js: BDD style assertions for node.js — test framework agnostic](https://github.com/shouldjs/should.js) 作为 JavaScript 中的 [行为驱动开发 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/%E8%A1%8C%E4%B8%BA%E9%A9%B1%E5%8A%A8%E5%BC%80%E5%8F%91) 测试工具。其用法相当语义化，在进行书写时像是在和自己的代码对话，这也是 BDD 的优势所在。

should 相对于 assert 具有丰富的 API ，通过链式调用的方式，使得非开发人员可以参与。例如下面的代码

```javascript
// 用户需要有pets属性，并且长度为4
user.should.have.property('pets').with.lengthOf(4);
```

should 还可以和其他模块相结合来使用，例如测试简单的 http 请求，结合immutableJS,jQuery 等。

> 参考 https://github.com/shouldjs/should.js#additional-projects
>
> should-sinon - adds additional assertions for sinon.js
>
> should-immutable - extends different parts of should.js to make immutable.js first-class citizen in should.js
>
> should-http - adds small assertions for assertion on http responses for node only
>
> should-jq - assertions for jq (need maintainer)
>
> karma-should - make more or less easy to work karma with should.js
>
> should-spies - small and dirty simple zero dependencies spies

### Chai.js
与 should 类似， [Chai](https://www.chaijs.com/) 声称是 BDD/TDD 的断言库，兼容node和浏览器平台，由一点重要的是 chai 具有丰富的插件，比如 chai-webdriver, 提供了浏览器端的测试方法，例如以下代码（参考[chai-webdriver - Chai](https://www.chaijs.com/plugins/chai-webdriver/)）

```javascript
// Start with a webdriver instance:
var sw = require('selenium-webdriver');
var driver = new sw.Builder()
  .withCapabilities(sw.Capabilities.chrome())
  .build()

// And then...
var chai = require('chai');
var chaiWebdriver = require('chai-webdriver');
chai.use(chaiWebdriver(driver));

// And you're good to go!
driver.get('http://github.com');
chai.expect('#site-container h1.heading').dom.to.not.contain.text("I'm a kitty!");
```

通过引入 webdriver , chai 可以想 should 一样去操作和测试浏览器。

### Expect.js
基于 should，这里可以看他的Feature, [GitHub - Automattic/expect.js: Minimalistic BDD-style assertions for Node.JS and the browser.](https://github.com/Automattic/expect.js/#features)

- [ ] Cross-browser: works on IE6+, Firefox, Safari, Chrome, Opera.
- [ ] Compatible with all test frameworks.
- [ ] Node.JS ready (require('expect.js')).
- [ ] Standalone. Single global with no prototype extensions or shims.

### Mocha
[Mocha - the fun, simple, flexible JavaScript test framework](https://mochajs.org/) 提供了线性的持续测试。提供了各种生命周期的钩子函数，甚至可以利用上一次的测试用例进行下次的使用。

```javascript
describe('hooks', function() {

  before(function() {
    // runs before all tests in this block
  });

  after(function() {
    // runs after all tests in this block
  });

  beforeEach(function() {
    // runs before each test in this block
  });

  afterEach(function() {
    // runs after each test in this block
  });

  // test cases
});
```

mocha 惊艳到我的是可视化的自动测试以及详细的测试报告。

mocha 可以将测试信息的信息再网页上显示，即使你测试的是nodejs程序，当你保存你的测试用例，mocha会自动进行测试并在网页上输出相应结果。

另外，你可以借助 [nyc  -  npm](https://www.npmjs.com/package/nyc) 帮你生成测试报告

```json
"script": {
	"cover": "nyc --reporter=text --reporter=html npm test",
}
```

这里是 text reporter

![text-reporter](https://imgs.beacelee.com/2018/ci/1.png)

![](https://imgs.beacelee.com/2018/ci/2.png)

这里是 file-repoter


![](https://imgs.beacelee.com/2018/ci/3.png)

打开 index.html 可以查看


![](https://imgs.beacelee.com/2018/ci/4.png)

点到具体的某个函数可以按照行来查看具体哪行没有被覆盖，来继续提高测试的覆盖率


![](https://imgs.beacelee.com/2018/ci/5.png)

## 持续集成（CI）

### Code Quality
[codacy](https://app.codacy.com) 是免费的代码质量工具，可以通过同步你的github代码，选择仓库之后通过相应的配置文件来检查你的代码是否规范，并且给出友好的提示。例如下面的代码没有声明 match 类型，codacy 提示了如下错误和改正方法。
![](https://imgs.beacelee.com/2018/ci/6.png)

通过代码的质量工具可以更好的约束和规范自己的代码，在避免低级的错误之外培养良好的习惯，尤其是在其报错之后引发自己的思考，反复地琢磨更好的是实现方式，从而进一步提高自己的编码水平。

### Travis

代码质量检测是第一步，还是相当低级的一个检测，只会检测语法、类型、风格等等。逻辑的部分就需要交给CI来跑测试代码了。

Travis 是免费的 CI 工具，可以通过其自动构建你的项目，并跑测试最终release 产品。Travis提供了各种监控代码提交的方式 branch、tag等等，提交代码后自动构建，这也是CI 工具必备的技能。

说到CI 工具，必须有平台 platform 在起基础的支撑。每次触发 CI 的时候，travis 默认会基于 linux来构建，目前支持 linux和macos，不支持windows，所以很多electron的项目想要构建windows都会借助另外一个工具 appveyor。

Travis几乎是所有开源项目的必备了，其生命周期有以下几个概念。

> Jobs 可以说是一个最小的单元，负责克隆代码后的编译
> Builds 多个版本的build
> Stages 不同的阶段，例如开始之前你需要发个通知告诉自己CI开始了`start stage`,开始build `build stage`,build 结束之后再发一条通知`end build stage`,build出错了 `build notify stage`等等。

在使用 CI 时，需要了解他的配置文件是如何书写的，travis 通过声明式的yaml文件,在书写时就像在配置一台电脑的环境，参考[Building a JavaScript and Node.js project - Travis CI](https://docs.travis-ci.com/user/languages/javascript-with-nodejs/)

```yaml
language: node_js # 你的语言node
node_js:
  - "8" # 版本 8
before_install:
  - "curl -L https://raw.githubusercontent.com/arunoda/travis-ci-laika/6a3a7afc21be99f1afedbd2856d060a02755de6d/configure.sh | /bin/sh"
services:
  - mongodb # 你需要mongodb服务
env:
  - LAIKA_OPTIONS="-t 5000"
```

### CircleCI
[Continuous Integration and Delivery - CircleCI](https://circleci.com) 具有和Travis相同的功能，不过相对于 Travis 来说支持多语言比较少，而且不支持MacOS平台，不过构建速度很快，而且cache功能可以避免重复的 `npm install`。我最喜欢它的是对每个stage分的很清楚，不像travis只给一个最终结果，下面图片是我测试eggjs项目的stage。


![](https://imgs.beacelee.com/2018/ci/7.png)


## Gitlab
在这里只做个简单的附加餐。作为企业内部来讲，不可能把代码开源。因此需要寻找自主搭建的CI服务，因此 gitlab 可以作为一种选择。

以下是我在github找到的 TDD JavaScript 开源项目 [GitHub - rmurphey/js-assessment: A test-driven approach to assessing JS skills](https://github.com/rmurphey/js-assessment)，我将答案填了上去，并且将其改成了node版本。[Beace / js-assessment · GitLab](https://git.beacelee.com/beace/js-assessment)

可以参考其CI以及相关构建过程 [Pipelines · Beace / js-assessment · GitLab](https://git.beacelee.com/beace/js-assessment/pipelines)

## 总结

还有些其他的测试库有待更新，例如

- [Karma](https://karma-runner.github.io/3.0/index.html)
- [sinonjs](https://sinonjs.org/)

通过对JavaScript的各种测试工具的调研，分析了工具的优势，具体的使用方法还是在相应文档中浏览并且实践比较好。

另外，对于CI的选择，CircleCI具有非常好的性能，并且构建速度非常快，但由于其平台和语言支持的不够多，所以比较适合小项目的构建。Travis 具有强大的功能以及平台支撑，可以用来构建大型的开源项目。gitlab用于企业私有的项目构建，而且gitlab需要gitlab-runner来作为支撑，需要有一定的运维经验。

### 参考文档

> https://hackernoon.com/continuous-integration-circleci-vs-travis-ci-vs-jenkins-41a1c2bd95f5

