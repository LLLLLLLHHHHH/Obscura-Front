# Obscura Front

一个轻量的前端模板工程，保留主题切换、语言切换、视觉特效、虚拟键盘和占位工具页，方便继续扩展新的前端功能。

## 功能

- 亮色 / 暗色主题切换
- 简体中文 / 英文国际化
- 响应式布局
- 首页工具卡片网格
- `#placeholder1`、`#placeholder2`、`#placeholder3` 三个占位工具页
- Header 视觉特效与虚拟键盘组件

## 技术栈

- HTML5
- CSS3
- JavaScript ES Modules

## 快速开始

1. 克隆仓库：

    ```bash
    git clone https://github.com/LLLLLLLHHHHH/Obscura-Front.git
    ```

2. 进入目录：

    ```bash
    cd Obscura-Front
    ```

3. 启动本地静态服务，例如：

    ```bash
    python -m http.server
    ```

4. 在浏览器访问：

    ```text
    http://localhost:8000
    ```

也可以使用 VS Code Live Server 直接打开 `index.html`。

## 项目结构

```text
Obscura-Front/
├── assets/
│   ├── css/
│   │   ├── common/       # 基础样式与变量
│   │   ├── components/   # 通用组件样式
│   │   ├── layout/       # 布局样式
│   │   ├── pages/        # 页面样式
│   │   └── style.css     # 样式入口
│   └── js/
│       ├── core/         # 主题、路由、特效与组件逻辑
│       ├── i18n/         # 国际化模块与语言包
│       └── pages/        # 页面入口脚本与模板
├── index.html            # 主页
├── .editorconfig         # 编辑器格式约定
├── .gitattributes        # Git 换行约定
├── .gitignore
└── README.md
```

## 许可

MIT License
