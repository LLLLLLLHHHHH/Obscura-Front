# Obscura

一个现代化的、极简风格的开发者工具集合。

## ✨ 特性

- 🎨 **多主题支持**：支持亮色（白/绿）和暗黑（黑/红）主题，自动适应系统偏好。
- 🌍 **国际化**：支持简体中文和英文切换。
- ⚡ **高性能**：基于原生 JavaScript 开发，无庞大依赖，加载速度快。
- 📱 **响应式设计**：完美适配桌面端和移动端设备。
- 🖌️ **视觉特效**：
    - 亮色主题：动态生成的卡通草地效果。
    - 暗色主题：流星雨背景动画。
    - 3D 卡片悬停与光照效果。

## 🛠️ 技术栈

- **HTML5**: 语义化结构。
- **CSS3**: 使用 CSS 变量管理主题，Neumorphism 风格设计。
- **JavaScript (ES6+)**: 模块化开发，包含核心逻辑、动画系统和国际化模块。

## 🚀 快速开始

1.  克隆仓库：
    ```bash
    git clone https://github.com/your-username/Obscura-Front.git
    ```
2.  进入目录：
    ```bash
    cd Obscura-Front
    ```
3.  启动本地服务器（推荐使用 Live Server 或类似工具）：
    - 如果使用 Python: `python -m http.server`
    - 如果使用 Node.js: `npx http-server`
4.  在浏览器中访问：`http://localhost:8000`

## 📂 项目结构

```
Obscura-Front/
├── assets/
│   ├── css/
│   │   ├── common/       # 基础样式与变量
│   │   ├── components/   # 组件样式（按钮、卡片、模态框）
│   │   ├── layout/       # 布局样式
│   │   ├── pages/        # 页面特定样式
│   │   └── style.css     # 样式入口
│   ├── js/
│   │   ├── core/         # 核心逻辑（草地、流星、主题、特效）
│   │   ├── i18n/         # 国际化模块
│   │   └── pages/        # 页面入口脚本
│   └── icons/            # 图标资源
├── index.html            # 主页
└── README.md             # 项目说明
```

## 🤝 贡献

欢迎提交 Issue 或 Pull Request 来改进这个项目！

## 📄 许可证

MIT License
