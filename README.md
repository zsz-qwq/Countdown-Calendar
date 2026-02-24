# 倒计时日历工具

一个功能强大、界面美观的简易倒计时工具，支持多倒计时项管理、正计时功能和暗黑模式。

## ✨ 功能特性

### 核心功能
- **倒计时/正计时**：支持设置倒计时目标日期，也可记录某件事已过去多久
- **多倒计时项管理**：支持添加、编辑、删除多个倒计时目标
- **时间单位自定义**：可选择显示完整的天/时/分/秒，或仅显示天，或仅显示时/分/秒
- **日期选择器**：使用浏览器内置的日期时间选择器，避免手动输入错误
- **倒计时结束提醒**：目标时间到达后弹出提醒

### 交互体验
- **响应式布局**：适配桌面端和移动端设备
- **暗黑模式**：支持浅色/暗黑主题切换，自动保存主题设置
- **实时时钟**：显示当前日期和时间
- **随机渐变背景**：每次加载页面时生成随机渐变背景
- **流畅动画**：倒计时数字平滑更新，按钮有点击反馈

### 技术特点
- **模块化设计**：代码结构清晰，使用IIFE避免全局变量污染
- **性能优化**：使用requestAnimationFrame替代setInterval，缓存DOM节点减少查询
- **数据持久化**：主题设置自动保存到localStorage
- **浏览器兼容**：支持现代浏览器（Chrome 80+/Firefox 75+）

## 🚀 快速开始

### 本地运行
1. **克隆仓库**
   ```bash
   git clone <仓库地址>
   cd Countdown-Calendar
   ```

2. **直接打开**
   - 在浏览器中直接打开 `index.html` 文件即可使用
   - 无需安装任何依赖

### 基本使用
1. **添加倒计时**
   - 在「计时类型」中选择「倒计时」或「正计时」
   - 在「时间单位」中选择显示方式
   - 点击日期选择器选择目标日期和时间
   - 点击「添加」按钮创建倒计时

2. **管理倒计时**
   - 点击「编辑」按钮修改倒计时名称和目标时间
   - 点击「删除」按钮移除不需要的倒计时

3. **切换主题**
   - 点击页面顶部的「🌙 暗黑模式」按钮切换主题
   - 主题设置会自动保存，下次打开时保持上次选择

## 📷 功能截图

### 浅色模式
![浅色模式](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20countdown%20calendar%20web%20app%20in%20light%20mode%20with%20gradient%20background%2C%20showing%20multiple%20countdown%20items%20and%20calendar%20view%2C%20clean%20UI%20design&image_size=landscape_16_9)

### 暗黑模式
![暗黑模式](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20countdown%20calendar%20web%20app%20in%20dark%20mode%20with%20dark%20background%2C%20showing%20multiple%20countdown%20items%20and%20calendar%20view%2C%20clean%20UI%20design&image_size=landscape_16_9)

### 移动端适配
![移动端适配](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=countdown%20calendar%20web%20app%20on%20mobile%20phone%2C%20responsive%20design%2C%20showing%20countdown%20items%20and%20calendar%20view&image_size=portrait_16_9)

## 📁 项目结构

```
Countdown-Calendar/
├── index.html          # 主页面
├── style.css           # 样式文件
├── utils.js            # 工具函数
├── calendar.js         # 日历功能
├── countdown.js        # 倒计时核心逻辑
├── script.js           # 页面交互
├── favicon.png         # 网站图标
└── README.md           # 项目说明
```

## ⚠️ 已知问题/限制

- **时区适配**：当前仅适配本地时区，可能存在跨时区显示差异
- **闰秒支持**：暂不支持闰秒处理
- **数据备份**：倒计时配置未持久化，页面刷新后会丢失（除主题设置外）
- **浏览器兼容性**：不支持IE11等旧版浏览器

## 🤝 贡献指南

欢迎提交Issue和Pull Request来帮助改进这个项目！

1. **Fork 仓库**
2. **创建分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **打开Pull Request**

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- **开发者**：张思哲
- **项目地址**：<仓库地址>

---

⭐ 如果这个项目对你有帮助，请给它点个星吧！