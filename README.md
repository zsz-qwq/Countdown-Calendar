中文 | [EN](/README_EN.md)

# Countdown Calendar

一个功能强大的倒计时和正计时工具，支持多种时间单位、自定义样式、多语言支持和云同步功能。

## 功能特性

- **多种计时类型**：支持倒计时和正计时
- **灵活的时间单位**：天/时/分/秒/毫秒
- **自定义样式**：支持自定义字体、文字颜色和背景颜色
- **多语言支持**：支持中文和英文
- **响应式设计**：适配不同屏幕尺寸
- **云同步**：支持 GitHub Gist、Netlify Functions 等同步服务
- **提醒功能**：支持多级提醒和第三方通知
- **数据导入导出**：支持配置的导入和导出
- **暗黑模式**：支持浅色和暗黑主题
- **日历选择器**：方便选择目标日期
- **统计面板**：显示倒计时统计信息

## 安装和使用

### 方法一：直接访问

访问 [https://zsz-qwq.github.io/Countdown-Calendar](https://zsz-qwq.github.io/Countdown-Calendar) 即可使用在线版本。

### 方法二：本地运行

1. 克隆项目到本地：
   ```bash
   git clone https://github.com/zsz-qwq/Countdown-Calendar.git
   cd Countdown-Calendar
   ```

2. 启动本地服务器：
   ```bash
   # 使用 npm
   npm install
   npm run dev
   
   # 或使用其他 HTTP 服务器
   npx http-server
   ```

3. 在浏览器中打开 `http://localhost:8000` 即可访问。

## 使用指南

### 添加倒计时

1. 在"添加倒计时"面板中输入倒计时名称
2. 选择计时类型（倒计时或正计时）
3. 选择时间单位
4. 选择时区
5. 自定义样式（可选）
6. 选择目标日期和时间
7. 点击"添加"按钮

### 管理倒计时

- **编辑**：点击倒计时项上的编辑按钮
- **删除**：点击倒计时项上的删除按钮
- **置顶**：点击置顶按钮固定重要的倒计时
- **归档**：点击归档按钮将完成的倒计时归档
- **分享**：点击分享按钮生成分享链接

### 云同步

1. 在"提醒与同步设置"面板中启用云同步
2. 选择同步服务提供商
3. 配置同步服务的相关参数
4. 点击"立即同步"按钮

### 导入导出配置

- **导出**：点击"导出配置"按钮下载配置文件
- **导入**：点击"导入配置"按钮选择配置文件

## 技术栈

- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **本地存储**：localStorage
- **云同步**：GitHub Gist API
- **构建工具**：无需构建，纯静态文件

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 开发

### 项目结构

```
Countdown-Calendar/
├── .components/          # 组件文件
│   ├── CloudSyncSettings.js
│   ├── DatePicker.js
│   └── ReminderSettings.js
├── .store/               # 状态管理
│   └── index.js
├── .github/              # GitHub Actions 配置
│   └── workflows/
│       └── gh-pages.yml
├── calendar.js           # 日历功能
├── countdown.js          # 倒计时核心功能
├── i18n.js               # 多语言支持
├── script.js             # 主脚本
├── share.js              # 分享功能
├── style.css             # 样式文件
├── templates.js          # 模板功能
├── utils.js              # 工具函数
├── index.html            # 主页面
├── package.json          # 项目配置
└── README.md             # 项目说明
```

### 开发命令

- `npm run dev`：启动本地开发服务器
- `npm run lint`：运行代码检查
- `npm run format`：格式化代码

## 贡献

欢迎贡献代码、报告问题或提出建议！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 文件了解贡献指南。

## 许可证

本项目使用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。

## 作者

张思哲 - [zsz-qwq](https://github.com/zsz-qwq)

## 致谢

感谢所有为项目做出贡献的开发者和用户！
