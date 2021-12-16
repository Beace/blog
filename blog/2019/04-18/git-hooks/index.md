---
title: 如何通过 githooks 强制规范 git commit message
date: 2019-04-18T12:00:23
tags:
  - git
---

git commit 不仅能体现你对工作（编码）内容的概括能力，而且能够在书写完代码后做一个完美的总结。我极力推崇**详细**的 git commit message 来描述编码内容。这里强调了“详细”二字。之所以做这个强调，是因为大部分人都不太想去写 git commit message 了。这样会导致一下几个严重的问题。

- 管理者和项目参与者只能花费大量的时间成本来阅读相关开发人员的源代码，从来得知做了哪些修改，进而无法实时跟进任务的状态以及后续的安排。
- 同时若某个模块可以共用，但是开发者没有做相应的说明，那他的协作者只能默默再造一遍轮子。
- 若在某个开发阶段解决过某个问题，之后的开发又遇到，也没办法通过搜索 message 来立即定位到之前的解决方案。
- 更重要的是，无法管理版本，做出某些修改后，只能通过再写一遍详细描述告知相关测试和运营人员做了哪些调整，导致开发流程的效率低下。

然而好的 commit 不仅可以解决以上的问题，还能有效地帮助到开发者。
- 好的 git commit 可以直接让管理者在评审代码和检查工作时知道团队成员现状，从而更好地进行指导和安排。
- 而且，在项目的版本迭代中，可以通过一些工具来讲 commit message 分类输出，这样，不仅仅从技术 leader，业务、产品和测试相关人员也能看到良好的迭代反馈。
- 好的 commit message 是对某个 feature 或者 bugfix 的完美总结，是积累经验、反复反思的过程，在书写 message 的过程中，你可能会再次快速梳理整个业务和所用到的技术手段，利于开发人员的个人成长。在基于 git 的 workflow 中，可以直接通过 activity 来观察其他开发者所做的事情和所解决的问题，作为自己的参考，从而不断的自我成长。
- 好的 commit message 可以直接作为你的日报、周报、季度总结、年度总结的素材。
- 好的 commit message 可以增加团队协作的效率，避免重复地造轮子，当然也要合理地分工来加持。

## 现状
上面已经说到，很多开发者不喜欢写 message，一般都用几个字或者一句没有意义的话来描述。大概可以归为一下几种。

- 太笼统
  - 增加了一些样式
  - 调整了一些样式和布局
  - 完成了一个页面
  - 调整xxx页面的一些细节
  - 对接了一个接口
  - 增加了查询功能
- 字面意思
  - 增加/删除/修改/更新 了一个文件
- 以为了不起
  - 优化了代码
  - 删除了一些冗余的代码
- 随意的 commit message，为了应付差事
  - test
- 为了解决冲突
  - 解决冲突
- 重复的 commit message
  - 完成了一个页面 (第一个 commit message)
  - 完成了一个页面 (第二个 commit message)
  - 完成了一个页面 (第三个 commit message)

## 约定

为了强制地规范 git commit, 完全避免上述 commit message 的提交。我们可以先来制定一下 message 的标准，有了一个规范的标准，就可以按照标准进行实施。

> 约定：完全按照 [conventionalcommits](https://www.conventionalcommits.org/en/v1.0.0-beta.3/) 中所制定的规范来提交。

上述标准可以具体参考链接中的说明。

## 可分类的 git commit message
有了约定之后，首先 message 会变成如下这样。

- feat(style.css): 增加了一些样式
- feat(index.html): 完成了一个页面
- feat(index.js): 对接了一个接口
- fix(index.js): 删除了一些冗余的代码
- fix: test
- chore: 优化了代码

可以看到，会有些预定义的 keywords 存在，是否更加一目了然了。这个时候我们已经可以通过一些 changelog 工具来根据 keywords 的分类来生成清晰的版本迭代日志了。

但是仍然存在关键字后面描述不够具体的问题。如果某个人想要偷懒，可以利用现成的工具来生成关键字而不书写后面具体的变更信息。因此，就是下面要开始的利用 git-hooks 来更加具体地限制描述信息了。

## git hooks

git-hooks 是 git 工作流的钩子，可以在某些关键节点预先执行一些脚本，从而阻止 commit 和 push 等操作。在某些编辑器下 `.git` 目录被隐藏，可以通过相关设置让其显示。显示后找到 `.git/hooks/commit-msg.sample` 文件，默认的情况下都是不生效的，将 `.sample` 去掉之后，在执行 git 相关操作时这些钩子就会起作用。我们将 `.git/hooks/commit-msg.sample` 的 `.sample` 去掉，在行首增加 `#!/usr/bin/env node`，通过书写 JavaScript 的方式，在 node 环境中运行它。别忘记 `chmod 777 .git/hooks/commit-msg` 给该文件增加相应的权限。下面就开始书写脚本了。

### 被限制的 branch
在限制 git commit 之前，我们首先限制当前 commit 的分支。如果分支都不符合规范，我们可以直接拒绝 commit。

采用最简单的方式通过正则表达式，拟定一个规则：必须以 `feature|hotfix|chore|docs|refactor` 这些关键字开头, `-` 分割，后面是具体的分支名称。用正则表达式表达就是

```js
const BRANCH_NAME = /^(feature|hotfix|chore|docs|refactor)-\w+/;
```

规则制定完毕之后需要来获取分支名称进行比对，如下代码获取分支名

```js
const childProcessExec = require('child_process').exec;
const exec = util.promisify(childProcessExec);

// 获取当前分支名
async function getCurrentBranch() {
  const branchesOutput = await exec('git branch');
  if (branchesOutput.stderr) {
    throw new Error(stderr);
  }
  const branches = branchesOutput.stdout;
  return branches
    .split('\n')
    .find(b => b.trim().charAt(0) === '*')
    .trim()
    .substring(2);
}
```

获取分支名后我们来执行项目中的主要代码，如果分支名通过检查，那就允许进行下一步，如果未通过，打印一行提示。

```js
async function checkCommitMessage() {
  const branchName = await getCurrentBranch();
  if (!BRANCH_NAME.test(branchName)) {
    console.log('bad branch name');
    process.exit(1);
  }
}
```

### 被限制的 commit
显示分支后，还需要做的是限制 commit message。按照上面描述的标准，我们再增加几条标准。

- message 最少 20 个字符
- 必须以 (feat|fix|docs|chore|refactor) 这些关键字开头，紧跟冒号和空格 `: `，之后再是具体的描述信息

首先来获取 git commit message。

```js
const fs = require('fs');
const message = fs.readFileSync(process.argv[2], 'utf8').trim();
```

取得 message 后，做最初始的长度校验。一般来说，长度校验就已经能够迫使开发者写更详细的描述了。

```js
const COMMIT_MESSAGE_LIMIT_LENGTH = 20;
if (message.length < COMMIT_MESSAGE_LIMIT_LENGTH) {
  console.log('message length was to short.');
  process.exit(1);
}
```

长度校验成功后，紧接着校验关键字的书写格式。

```js
const CODE_CONTRACT = /^(feat|fix|docs|chore|refactor)\(\w+\)?:\s(\S|\w)+/;
if (!CODE_CONTRACT.test(message)) {
  console.log('message is invalid');
  process.exit(1);
}
```

## 总结
到这里，基本的限制已经做完了。如果还要做更加细化的限制，比方说不能出现某种描述词或语句，按照你想要的制定规则来继续校验就可以了。
