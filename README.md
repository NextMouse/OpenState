# react-openstate  ![License](https://img.shields.io/badge/license-MIT-yellow) ![React](https://img.shields.io/badge/React->=16.8.0-red) ![TypeScript](https://img.shields.io/badge/TypeScript->=3.2.0-blue)

一个React对象通信工具类，使用简单Get/Set方式解决React状态管理。
![Visitor Count](https://profile-counter.glitch.me/NextMouse/count.svg)

## 安装方法

```bash
npm install react-openstate --save
```

## 使用方法

### 1. useOpenState

在要暴露状态的组件上使用useOpenState完成状态初始化
> 状态初始化完全等同于React.useState方法

```TypeScript
useOpenState = <S>(initialState: S | (() => S), name: string): [S, Dispatch<SetStateAction<S>>]
```

- 参数1：当前字段的状态初始值
- 参数2：当前字段对外暴露的ID名称，要求在同一Store下保持唯一。(*见下多模块*)
- 返回值：变量及Set方法组成的数组

```JavaScript
import { useOpenState } from "react-openstate";

const App: React.FC = () => {

  const [consoleSwitch] = useOpenState(true, "consoleSwitch");
  const [gameConsole, setGameConsole] = useOpenState("Xbox Series X", "gameConsole");
  const [playGameName] = useOpenState("Outlast: Bundle of Terror", "playGameName");

  const changeGameConsoleHandle = () => {
    setGameConsole("PlayStation 5");
  }

  return (
    <div>
      <span>{gameConsole} - {consoleSwitch ? "启动" : "关闭"} : {playGameName} </span>
      <button type="button" onClick={changeGameConsoleHandle}>切换</button>
    </div>
  )
}
export default App;
```

### 2. callState

在要改变目标组件状态的类中使用

```TypeScript
callState = <S>(name: string): Function
```

- 参数1：已经对外暴露的字段ID名称
- 返回值：该字段set方法的执行器

```JavaScript
import { callState } from "react-openstate";

const GameSwitchButton: React.FC = () => {

  const swicthGameHandle = () => {
    // 使用方式一：执行函数，直接对原始值转换
    callState("gameConsole")((e: boolean) => !e);
  }

  const swicthGameConsoleHandle = () => {
    // 使用方式二: 执行函数，对原始值提取
    callState("consoleSwitch")((val:string)=>{
        console.log("当前游戏机是：" + val);
        return "Nintendo Switch";
    });
  }

  const swicthPlayGameHandle = () => {
    // 使用方式三：直接覆盖原始值
    callState("playGameName")("Outlast2");
  }

  return (
    <div>
      <button type="button" onClick={swicthGameHandle}>开关</button>
      <button type="button" onClick={swicthGameConsoleHandle}>升级游戏机</button>
      <button type="button" onClick={swicthPlayGameHandle}>切换游戏</button>
    </div>
  )
}
export default GameSwitchButton;
```

## 多模块

> 组件默认给出了一个Store实例，实例的namespace="__default"

```JavaScript
import { Store } from "react-openstate";

const store = new Store("__default");
export default store;
export const useOpenState = store.useOpenState;
export const callState = store.callState;
```

- 多Stroe使用不同namespace隔离

```JavaScript
const store1 = new Store("store1");
const store2 = new Store("store2");
const store3 = new Store("store3");

store1.useOpenState()
store1.callState()

store2.useOpenState()
store2.callState()

store3.useOpenState()
store3.callState()

```

![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=NextMouse&hide_progress=true)
