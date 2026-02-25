// 多语言支持模块
const i18n = {
  // 语言包
  languages: {
    zh: {
      title: '倒计时日历',
      addCountdown: '添加倒计时',
      countdownType: '计时类型：',
      countdown: '倒计时',
      countup: '正计时',
      timeUnit: '时间单位：',
      timeUnitAll: '天/时/分/秒',
      timeUnitDay: '仅天',
      timeUnitHour: '仅时/分/秒',
      timezone: '时区：',
      localTimezone: '本地时区',
      targetDateTime: '目标日期时间',
      add: '添加',
      calendar: '日历',
      countdownsList: '倒计时列表',
      exportConfig: '导出配置',
      importConfig: '导入配置',
      clearAll: '清空所有',
      days: '天',
      hours: '时',
      minutes: '分',
      seconds: '秒',
      targetTimePassed: '目标时间已过！',
      distanceTo: '距离',
      daysUntil: '还有',
      timeElapsedSince: '至今已过',
      edit: '编辑',
      delete: '删除',
      emptyMessage: '还没有添加计时，点击左侧添加按钮创建第一个计时吧！',
      darkMode: '🌙 暗黑模式',
      lightMode: '☀️ 浅色模式',
      today: '今天',
      tomorrow: '明天',
      nextWeek: '下周',
      countdownEnded: '倒计时已结束',
      errorDate: '日期格式错误，请重新选择！',
      errorTime: '时间处理错误，请重试！',
      errorStorage: '保存数据失败，请重试！',
      errorStorageQuota: '本地存储空间不足，请删除一些倒计时项后再试！',
      errorLoadData: '加载数据失败，将使用默认设置！',
      errorGeneral: '应用遇到了一些问题，请刷新页面重试！',
      errorPromise: '操作未能完成，请重试！',
      confirmCountdownPast: '倒计时需要选择未来的日期，是否继续添加？',
      confirmCountupFuture: '正计时需要选择过去的日期，是否继续添加？',
      confirmClearAll: '确定要清空所有倒计时吗？此操作不可恢复！',
      confirmImport: '确定要导入配置吗？这将替换当前所有倒计时项。',
      successAdd: '添加计时成功！',
      successEdit: '编辑计时成功！',
      successDelete: '删除计时成功！',
      successClear: '所有倒计时已清空！',
      successExport: '配置导出成功！',
      successImport: '配置导入成功！',
      successPause: '计时已暂停！',
      successResume: '计时已恢复！',
      successShare: '分享链接已复制到剪贴板！',
      errorShare: '分享失败，请重试！',
      share: '分享',
      templates: '快捷模板',
      enterName: '请输入名称',
      enterDate: '请输入日期时间',
      format: '格式',
      statistics: '统计面板',
      totalCountdowns: '总计时项',
      activeCountdowns: '活跃计时',
      completedCountdowns: '已完成',
      closestCountdown: '最近目标',
      fontFamily: '字体：',
      textColor: '文字颜色：',
      bgColor: '背景颜色：',
      footer: 'Developed by 张思哲\n2026 , © zsz-qwq\nAll rights reserved.'
    },
    en: {
      title: 'Countdown Calendar',
      addCountdown: 'Add Countdown',
      countdownType: 'Countdown Type:',
      countdown: 'Countdown',
      countup: 'Countup',
      timeUnit: 'Time Unit:',
      timeUnitAll: 'Days/Hours/Minutes/Seconds',
      timeUnitDay: 'Days Only',
      timeUnitHour: 'Hours/Minutes/Seconds Only',
      timezone: 'Timezone:',
      localTimezone: 'Local Timezone',
      targetDateTime: 'Target Date & Time',
      add: 'Add',
      calendar: 'Calendar',
      countdownsList: 'Countdown List',
      exportConfig: 'Export Config',
      importConfig: 'Import Config',
      clearAll: 'Clear All',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
      targetTimePassed: 'Target time has passed!',
      distanceTo: 'Distance to',
      daysUntil: 'is',
      timeElapsedSince: 'Time elapsed since',
      edit: 'Edit',
      delete: 'Delete',
      emptyMessage: 'No countdowns added yet. Click the add button on the left to create your first countdown!',
      darkMode: '🌙 Dark Mode',
      lightMode: '☀️ Light Mode',
      today: 'Today',
      tomorrow: 'Tomorrow',
      nextWeek: 'Next Week',
      countdownEnded: 'Countdown Ended',
      errorDate: 'Invalid date format, please reselect!',
      errorTime: 'Time processing error, please try again!',
      errorStorage: 'Failed to save data, please try again!',
      errorStorageQuota: 'Local storage is full, please delete some countdowns and try again!',
      errorLoadData: 'Failed to load data, default settings will be used!',
      errorGeneral: 'The application encountered some issues, please refresh the page and try again!',
      errorPromise: 'Operation failed to complete, please try again!',
      confirmCountdownPast: 'Countdown requires a future date, do you want to continue?',
      confirmCountupFuture: 'Countup requires a past date, do you want to continue?',
      confirmClearAll: 'Are you sure you want to clear all countdowns? This action cannot be undone!',
      confirmImport: 'Are you sure you want to import config? This will replace all current countdowns.',
      successAdd: 'Countdown added successfully!',
      successEdit: 'Countdown edited successfully!',
      successDelete: 'Countdown deleted successfully!',
      successClear: 'All countdowns have been cleared!',
      successExport: 'Config exported successfully!',
      successImport: 'Config imported successfully!',
      successPause: 'Countdown paused!',
      successResume: 'Countdown resumed!',
      successShare: 'Share link copied to clipboard!',
      errorShare: 'Sharing failed, please try again!',
      share: 'Share',
      templates: 'Quick Templates',
      enterName: 'Please enter name',
      enterDate: 'Please enter date and time',
      format: 'Format',
      statistics: 'Statistics',
      totalCountdowns: 'Total Countdowns',
      activeCountdowns: 'Active Countdowns',
      completedCountdowns: 'Completed',
      closestCountdown: 'Closest Target',
      fontFamily: 'Font Family:',
      textColor: 'Text Color:',
      bgColor: 'Background Color:',
      footer: 'Developed by Zhang Sizhe\n2026 , © zsz-qwq\nAll rights reserved.'
    }
  },
  
  // 当前语言
  currentLanguage: 'zh',
  
  // 初始化语言
  init() {
    // 从本地存储加载语言设置
    const savedLang = localStorage.getItem('countdownLanguage');
    if (savedLang && this.languages[savedLang]) {
      this.currentLanguage = savedLang;
    } else {
      // 自动检测浏览器语言
      const browserLang = navigator.language.split('-')[0];
      if (this.languages[browserLang]) {
        this.currentLanguage = browserLang;
      }
    }
    this.applyLanguage();
  },
  
  // 切换语言
  setLanguage(lang) {
    if (this.languages[lang]) {
      this.currentLanguage = lang;
      localStorage.setItem('countdownLanguage', lang);
      this.applyLanguage();
    }
  },
  
  // 获取翻译
  t(key) {
    return this.languages[this.currentLanguage][key] || key;
  },
  
  // 应用语言到页面
  applyLanguage() {
    // 更新标题
    document.title = this.t('title');
    
    // 更新所有可翻译元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        element.textContent = this.t(key);
      }
    });
    
    // 更新按钮文本
    const addBtn = document.getElementById('addCountdown');
    if (addBtn) addBtn.textContent = this.t('add');
    
    const exportBtn = document.getElementById('exportConfig');
    if (exportBtn) exportBtn.textContent = this.t('exportConfig');
    
    const importBtn = document.getElementById('importConfig');
    if (importBtn) importBtn.textContent = this.t('importConfig');
    
    const clearBtn = document.getElementById('clearAll');
    if (clearBtn) clearBtn.textContent = this.t('clearAll');
    
    // 更新主题切换按钮
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      const isDarkMode = document.body.classList.contains('dark-mode');
      themeToggle.textContent = isDarkMode ? this.t('lightMode') : this.t('darkMode');
    }
    
    // 更新日期快捷按钮
    const dateShortcuts = document.querySelectorAll('.date-shortcut');
    dateShortcuts.forEach(button => {
      const days = button.getAttribute('data-days');
      if (days === '0') button.textContent = this.t('today');
      else if (days === '1') button.textContent = this.t('tomorrow');
      else if (days === '7') button.textContent = this.t('nextWeek');
    });
    
    // 更新倒计时项
    const countdowns = document.querySelectorAll('.countdown-item');
    countdowns.forEach(item => {
      const editBtn = item.querySelector('.edit-btn');
      if (editBtn) editBtn.textContent = this.t('edit');
      
      const deleteBtn = item.querySelector('.delete-btn');
      if (deleteBtn) deleteBtn.textContent = this.t('delete');
    });
    
    // 更新空状态消息
    const emptyMessage = document.getElementById('emptyMessage');
    if (emptyMessage) emptyMessage.textContent = this.t('emptyMessage');
    
    // 更新页脚
    const footer = document.querySelector('footer');
    if (footer) footer.innerHTML = this.t('footer').replace(/\n/g, '<br>');
    
    // 更新自定义样式选项
    const fontFamilyLabel = document.querySelector('label[for="fontFamily"]');
    if (fontFamilyLabel) fontFamilyLabel.textContent = this.t('fontFamily');
    
    const textColorLabel = document.querySelector('label[for="textColor"]');
    if (textColorLabel) textColorLabel.textContent = this.t('textColor');
    
    const bgColorLabel = document.querySelector('label[for="bgColor"]');
    if (bgColorLabel) bgColorLabel.textContent = this.t('bgColor');
  }
};

// 导出模块
window.i18n = i18n;