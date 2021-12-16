---
title: 【译文】如何在 React 中渲染模态框
date: 2019-01-01T23:00:23
---


> 翻译自： [How to render modals in React](https://medium.freecodecamp.org/how-to-render-modals-in-react-bbe9685e947e)

由于 React 构造 DOM 的方式，模态框可能是一个比较棘手的问题。如果你熟悉 React 基础，你就知道整个 App 通常是一个叫做 <App /> 的组件，这个组件被当做一个叫  `#root`的 `<div>`装载到（append）页面的根节点上。

```html
<body>
	<noscript>你需要开启JavaScript运行这个app</noscript>
	<div id="root"></div>
</body>
```

一旦 `<App />` 组件渲染到 DOM 节点上，整个 React 应用将会渲染到真实带有 id “#root” 的 HTML 元素 `<div></div>` 中。

所以，显而易见 React App 组件有着非常深层次的嵌套。我们正在讨论几十个层次，甚至更多。因此，如果这些深层次的组件的任意一个想要展示一个模态框（Modal）,将会面临很大的 CSS 问题。

模态框（Modals）将会在屏幕上延时显示，因此需要在所有元素上占有最高的显示权。如果你不得不增加一个 `z-index`属性来提升它的层次，你必须让它是页面所有元素最大的那个。但是，如果它的嵌套很深，它的父元素在整个 DOM 树上需要采用 CSS 优先级。

与其破坏整个的 APP 的 CSS 布局，不如我们找另一个方式来渲染——在深层嵌套的元素之外。

## 解决方案 React Portals
一种解决方式是通过 ReactDOM protals，将 modal 放到一个div中，作为 “#root” `<div></div>` 的子元素。这样做之后，CSS 样式就作用于包裹 modal 的 div ，仅仅和它的同级(兄弟)元素（`root` div）相关，并且不会破坏 `root` 本身。

我们需要 ReactDOM 的 `createPortal` API 来这样做。一个 protal  非常有效地作为兄弟 div，`<div id=”root”>` 中必须包含所有的 React 组件。

1. 在 index.html 中，body 标签中

```html
<body>
    <noscript>
      You need to enable JavaScript to run this app.
    </noscript>

    <div id="root"></div>

    <div id="modal"></div> .   //ADD THIS

  </body>
</html>
```

2. 创建一个 Modal.js 组件（样式名来自semantic-UI）：

```jsx
import React from "react";
import ReactDOM from "react-dom";

const JSX_MODAL = (
  <div className="ui dimmer modals visible active">
    <div className="ui standard modal visible active">
      THIS IS SOME TEXT IN THE MODAL // add some UI features here
    </div>
  </div>
);

function Modal(props) {
  return ReactDOM.createPortal(JSX_MODAL, document.querySelector("#modal"));
}

export default Modal;
```

可以看到，`createPortal` 接收两个参数：需要被渲染的jsx，和类似 ReactDOM.render 方法，在被渲染的 jsx 的外层目标元素。

如果你渲染了组件并且触发了它，你会看到它展示的很完美。你现在需要添加适当的`onClick()`处理程序来处理 Modal UI 中的 click 事件，以及如果用户在 Modal UI 外部单击，则模态框应该隐藏。

你希望通过监听右侧区域中的点击事件然后停止传播来实现此目的，以便根据用户点击的区域产生正确的行为。

## 复用性
上面的例子是非常基础的，还不能够作为一个代码块来使用。但是，这是解决模态框的方案。你应该根据你的需要来定制组件。利用 React 复用原则，在 Modal 中，数据不能够使用硬编码，通过传递内容，甚至按照需要传递组件。

例如，在我的一个项目中，当用户将要从数据库中删除一些东西的时候，我弹出一个模态框。因此我的组件被称为 `<DeleteThis />`。它渲染了一个`<Modal />`，这是使基础 `<DeleteThis />` 页面变暗的叠加层。

在 `<Modal />` 中的组件被称为 `<InnerModal />`，这是一个拥有真正交互能力的组件，包含头部(headers)、内容(content)和文本(text)。

因此我的 `<DeleteThis />` 组件创建了一个 `props` 传递给 `<Modal />` ，再传递给 `<InnerModal />`，因此 `<DeleteThis />` 的 render 方法应该长这样:

```jsx
render() {
    return (
      <div>
        <Modal
          content={this.renderContentProp()}
          header="Delete this?"
          actions={this.renderActionButtons()}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }

  renderActionButtons = () => {
    //return JSX that renders action buttons...
    return (
      <div>
        <div className="ui button primary">Delete</div>
        <div className="ui button">Cancel</div>
      </div>
    );
  };
```

实际的 Modal Component 长这样:

```jsx
import React from "react";
import ReactDOM from "react-dom";
import ModalInner from './modal-inner'

function Modal(props) {
  return ReactDOM
    .createPortal(
       <ModalInner {...props} />,
       document.querySelector("#modal")                      //target DOM element
     );
}
export default Modal;
```

最终，它成功的渲染了。

模态框，使用React Portal！希望你喜欢这个😃 并希望它能为你节省一些时间…