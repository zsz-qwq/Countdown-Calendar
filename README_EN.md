[中文](/README.md) | EN

# Countdown Calendar Tool

A powerful and visually appealing simple countdown tool that supports multiple countdown item management, count-up functionality, and dark mode.

## ✨ Features

### Core Features
- **Countdown/Count-up**: Support setting target dates for countdowns, and record how long an event has passed
- **Multiple Countdown Management**: Add, edit, and delete multiple countdown targets
- **Custom Time Units**: Choose to display complete days/hours/minutes/seconds, only days, or only hours/minutes/seconds
- **Date Picker**: Use the browser's built-in date and time picker to avoid manual input errors
- **Countdown Completion Reminder**: Pop-up reminder when the target time is reached

### User Experience
- **Responsive Layout**: Adapted for desktop and mobile devices
- **Dark Mode**: Support light/dark theme switching with automatic theme setting saving
- **Real-time Clock**: Display current date and time
- **Random Gradient Background**: Generate a random gradient background each time the page loads
- **Smooth Animations**: Countdown numbers update smoothly with click feedback on buttons

### Technical Features
- **Modular Design**: Clear code structure using IIFEs to avoid global variable pollution
- **Performance Optimization**: Use requestAnimationFrame instead of setInterval, cache DOM nodes to reduce queries
- **Data Persistence**: Theme settings are automatically saved to localStorage
- **Browser Compatibility**: Support modern browsers (Chrome 80+/Firefox 75+)

## 🚀 Quick Start

### Local Run
1. **Clone the Repository**
   ```bash
   git clone <Repository URL>
   cd Countdown-Calendar
   ```

2. **Open Directly**
   - Open the `index.html` file directly in your browser to use the tool
   - No dependencies need to be installed

### Basic Usage
1. **Add a Countdown**
   - Select "Countdown" or "Count-up" in the "Timer Type" section
   - Choose the display format in the "Time Units" section
   - Click the date picker to select the target date and time
   - Click the "Add" button to create the countdown

2. **Manage Countdowns**
   - Click the "Edit" button to modify the countdown name and target time
   - Click the "Delete" button to remove unwanted countdowns

3. **Switch Themes**
   - Click the "🌙 Dark Mode" button at the top of the page to switch themes
   - Theme settings are saved automatically and persist on next visit

## 📁 Project Structure

```
Countdown-Calendar/
├── Core Business Files
│   ├── index.html                # Project main page (entry file), including page layout and DOM structure
│   ├── style.css                 # Global style file, covering responsive layout, dark mode styles, and animation effects
│   ├── script.js                 # Page interaction logic (button clicks, theme switching, DOM operations, etc.)
│   ├── countdown.js              # Core countdown logic (time calculation, count-up/countdown switching, end reminders, etc.)
│   ├── calendar.js               # Calendar function module (date picker, date formatting, time zone adaptation, etc.)
│   ├── utils.js                  # Utility functions (time formatting, local storage, DOM node caching, etc.)
│   ├── templates.js              # Template rendering (dynamic generation of countdown items, edit popup templates, etc.)
│   └── i18n.js                   # Internationalization configuration (multilingual text, internationalized date formats, etc.)
├── Static Resources & Configuration
│   ├── favicon.png               # Website icon
│   ├── manifest.json             # PWA configuration (offline access, desktop icon, etc.)
│   ├── package.json              # Project dependencies/script configuration (if managed by npm)
│   └── service-worker.js         # PWA service worker (caches static resources, offline functionality)
├── Documentation Files
│   ├── README.md                 # Chinese project documentation (features, usage, contribution guidelines)
│   ├── README_EN.md              # English project documentation
│   ├── LICENSE                   # MIT license file
│   ├── CODE_OF_CONDUCT.md        # Code of Conduct
│   ├── CONTRIBUTING.md           # Chinese contribution guidelines
│   └── CONTRIBUTING_EN.md        # English contribution guidelines
├── Engineering Configuration
│   └── .github/
│       └── workflows/            # GitHub Actions workflow configuration (CI/CD, automated testing, etc.)
└── Extended Function Files
    └── share.js                  # Sharing function module (countdown result sharing, screenshots, etc.)
```

## ⚠️ Known Issues/Limitations

- **Time Zone Adaptation**: Currently only adapted to local time zones, may have display differences across time zones
- **Leap Second Support**: Leap second handling is not supported temporarily
- **Data Backup**: Countdown configurations are not persisted and will be lost after page refresh (except theme settings)
- **Browser Compatibility**: Does not support older browsers such as IE11

## 🤝 Contribution Guidelines

Issues and Pull Requests are welcome to help improve this project!

1. **Fork the Repository**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details

---

⭐ If this project helps you, please give it a star!
