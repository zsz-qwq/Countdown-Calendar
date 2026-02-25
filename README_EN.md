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
├── index.html          # Main page
├── style.css           # Style file
├── utils.js            # Utility functions
├── calendar.js         # Calendar functionality
├── countdown.js        # Core countdown logic
├── script.js           # Page interactions
└── favicon.png         # Website icon
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
