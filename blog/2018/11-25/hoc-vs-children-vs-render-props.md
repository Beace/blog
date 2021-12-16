---
title: HOC VS Children VS Render Props
date: 2018-11-25T19:00:23
---

## 简介
- [ ] HOC(Higher-Order Components) 是react中通过高阶组件来抽象逻辑的用法。它并不是React提供的API，而是一种通过在JavaScript函数传参的形式来减少代码逻辑。
- [ ] Children 是 React 通过  props 向下暴露的 API，可以简单的理解为在任何被JSX标签包裹的组件都是其外层组件的孩子（children）。
- [ ] Render Props 是通过函数的形式来传递 props 达到组件共享数据的一种方式。

## 共同的作用
其实，这三种在 React 中的组件构建方式最核心的目的只有两个，要么是组件间相互通信，要么是将公共的逻辑抽象。

我们都知道 React 通过组件作为单位来整合最基础的Page。除了直接书写html元素之外，组件（Component）可以理解为 React 应用中的最小单位了。有时候为了更加友好的书写组件的测试，拆分业务逻辑，最大可能得复用组件，就不得不需要将组件间拆分的很细，与此同时，由于 React 中单向数据流的特性，以上的设计未免带来许多困扰。

这篇文章，用来梳理一下在不同场景中，通过 props 进行通信的三种选择。会提到一些优劣势的问题和取舍关系。

## Children
在 React 中，可以将除根节点以外的任何JSX元素理解为是某个元素的children，同样，只要不是叶子节点，任何元素也可以理解为某个元素的parent。

可以通过`this.props.children`拿到当前元素都孩子节点，children 的存在就像一个插槽，你可以在父元素的某个具体位置，插入任何 React Element。例如，在web页面经典的三栏布局中，需要有`PageHeader`,`Sidebar`始终保持在页面固定位置，而`Content`需要动态的变化，因此产生了类似如下的代码。

```jsx
// LayoutComponent
<Layout>
  <Header></Header>
	<div>
    <Sidebar></Sidebar>
    <Content>{this.props.children}</Content>
	</div>
</Layout>
```

通过引用`LayoutComponent`，具体的内容便显示在`Content`组件中间

```jsx
import LayoutComponent from 'LayoutComponent';
// in render return
<LayoutComponent>
  hello, I'm content in LayoutComponent!
</LayoutComponent>
```

通过以上的方式动态的插入 children ，在任何页面只需被`LayoutComponent` 包裹，就可以使用该布局，达到了复用Layout的目的。

这其实是一个很简单的操作，类似一些模板引擎也可以做到类似的效果。更重要的是，假如 Layout 需要向 children 动态传入一些数据，类似的，Layout 可能有一些全局配置，是通过路由来改变，而 content 中如何接收到路由的信息呢？可能没有太好的办法，`this.props.children` 毕竟不是一个可以传递参数的函数。

还好，React 中的静态方法可以帮助我们。 Class  Component 的写法，本质上是通过React.CreateElement 来实现的，React 还提供了CloneElement的方法，来克隆一个组件。对于次场景，可以通过CloneElement的第二个参数来实现对 children 的传参。

```javascript
React.cloneElement(this.props.children, { routes: routes })
```

上面我们通过cloneElement 将 routes 信息传递给了 children,在children中可以通过 `this.props.routes` 的方式获取到路由信息。

## Render Props
顾名思义，`render props`的实现原理就是根据名为`render`的props，通过改变`render`，来改变自身的渲染逻辑。

Render中接受一个函数，通过函数方式返回一个新的组件，只要有函数就可以通过传递参数的方式动态传递变量。例如如下代码通过传递`count props`来传递初始化的值。

```jsx
import RenderProps from './components/RenderProps';
<RenderProps render={count => <Hello onClick={this.onClick} />}/>

import React from 'react';
class RenderProps extends React.Component {
  state = {}
  render() {
    return (
      <div>{this.props.render(10)}</div>
    )
  }
}

export default RenderProps;
```

可以看到render props的方式每次都创建一个function，若参数中的值频繁变化，可以采用这种方式，类似于`react-motion`、`react-router`的库都会采用这种方式。

其实在children props也支持这种方式，类似如下写法。

```jsx
import RenderProps from './components/RenderProps';
<RenderProps>
	{count => <Hello onClick={this.onClick} />}
</RenderProps>

import React from 'react';
class RenderProps extends React.Component {
  state = {}
  render() {
    return (
      <div>{this.props.children(10)}</div>
    )
  }
}

export default RenderProps;
```

在 react 中也提提到了这一特点。

> It’s important to remember that just because the pattern is called “render props” you don’t have to use a prop named render to use this pattern. In fact, any prop that is a function that a component uses to know what to render is technically a “render prop”.

也就是说任何的props影响到渲染的props都可以这样去实现，并不局限于render。

总之，render props 通过指定了children的props，来进行通信，所以，对于改变的props，父组件是有绝对知情权的，也就是说父组件需要知道子组件用 props 来具体做什么。因此，render props 通常使用在对 props 经常变化，并且对子元素严格把控的场景下。

## HOC
HOC其实来源于HOF，high-order function。高阶函数的本质是将其他函数作为自己的参数或者返回值为函数。

在React中，_其他函数_指的就是component。HOC有点像mixin，react 通过这种方式让 mixin 支持了class。作为一种抽象方式，HOC方式不仅仅可以传递children，还可以传递事件、数据等等。

例如，假设有一组类似的计数组件都包含onClick这样的逻辑，但是并不确定组件如何构成，但是知道组件肯定需要这样一种业务逻辑。这就是HOC的关键。

你是知道组件需要做什么事的，表单提交还是公共逻辑的提取。但是具体长什么样子，由谁来做并不是你的重点。重点只需要拥有该方法。

```jsx
import React from 'react';
function Wrapper(WrapperedComponent) {
  return class extends React.Component {
    onClick = count => {
      console.log('hoc count', count);
    }
    render() {
      return (
        <div>
          <WrapperedComponent onClick={this.onClick} />
        </div>
      )
    }
  }
}
export default Wrapper;


import HOCComponent from './components/HOC';
const Hoc = HOCComponent(Hello);
<Hoc />
```
