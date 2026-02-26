[中文](/README.md) | EN

# Countdown Calendar
A powerful countdown and count-up tool that supports multiple time units, custom styles, multilingual support, and cloud synchronization functionality.

## Features

- **Multiple Timing Types**: Supports countdown (remaining time) and count-up (elapsed time)
- **Flexible Time Units**: Days/hours/minutes/seconds/milliseconds
- **Custom Styles**: Supports custom fonts, text colors, and background colors
- **Multilingual Support**: Supports Chinese and English
- **Responsive Design**: Adapts to different screen sizes
- **Cloud Synchronization**: Supports synchronization services such as GitHub Gist and Netlify Functions
- **Reminder Functionality**: Supports multi-level reminders and third-party notifications
- **Data Import & Export**: Supports importing and exporting configurations
- **Dark Mode**: Supports light and dark themes
- **Calendar Picker**: Facilitates selection of target dates
- **Statistics Panel**: Displays countdown statistical information

## Installation and Usage

### Method 1: Direct Access
Visit [https://zsz-qwq.github.io/Countdown-Calendar](https://zsz-qwq.github.io/Countdown-Calendar) to use the online version.

### Method 2: Local Run
1. Clone the project to your local machine:
   ```bash
   git clone https://github.com/zsz-qwq/Countdown-Calendar.git
   cd Countdown-Calendar
   ```

2. Start the local server:
   ```bash
   # Using npm
   npm install
   npm run dev
   
   # Or use other HTTP servers
   npx http-server
   ```

3. Open `http://localhost:8000` in your browser to access the tool.

## User Guide

### Add a Countdown
1. Enter the countdown name in the "Add Countdown" panel
2. Select the timing type (countdown or count-up)
3. Choose time units
4. Select the time zone
5. Customize styles (optional)
6. Select the target date and time
7. Click the "Add" button

### Manage Countdowns
- **Edit**: Click the edit button on the countdown item
- **Delete**: Click the delete button on the countdown item
- **Pin**: Click the pin button to fix important countdowns to the top
- **Archive**: Click the archive button to archive completed countdowns
- **Share**: Click the share button to generate a shareable link

### Cloud Synchronization
1. Enable cloud synchronization in the "Reminder & Sync Settings" panel
2. Select the synchronization service provider
3. Configure relevant parameters for the synchronization service
4. Click the "Sync Now" button

### Import & Export Configurations
- **Export**: Click the "Export Configuration" button to download the configuration file
- **Import**: Click the "Import Configuration" button to select the configuration file

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Local Storage**: localStorage
- **Cloud Synchronization**: GitHub Gist API
- **Build Tool**: No build required, pure static files

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

### Project Structure

```
Countdown-Calendar/
├── .components/          # Component files
│   ├── CloudSyncSettings.js
│   ├── DatePicker.js
│   └── ReminderSettings.js
├── .store/               # State management
│   └── index.js
├── .github/              # GitHub Actions configuration
│   └── workflows/
│       └── gh-pages.yml
├── calendar.js           # Calendar functionality
├── countdown.js          # Core countdown functionality
├── i18n.js               # Multilingual support
├── script.js             # Main script
├── share.js              # Sharing functionality
├── style.css             # Style file
├── templates.js          # Template functionality
├── utils.js              # Utility functions
├── index.html            # Main page
├── package.json          # Project configuration
└── README.md             # Project documentation
```

### Development Commands

- `npm run dev`: Start the local development server
- `npm run lint`: Run code linting
- `npm run format`: Format code

## Contribution

Contributions, issues, and feature requests are welcome! Please check the [CONTRIBUTING.md](CONTRIBUTING.md) file for contribution guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Zhang Sizhe - [zsz-qwq](https://github.com/zsz-qwq)

## Acknowledgments

Thanks to all developers and users who have contributed to this project!
