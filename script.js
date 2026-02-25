function init() {
    console.log('初始化脚本开始执行...');
    
    // 初始化多语言支持
    if (window.i18n) {
        i18n.init();
        
        // 语言选择器事件监听
        const languageSelector = document.getElementById('languageSelector');
        if (languageSelector) {
            // 设置当前语言
            languageSelector.value = i18n.currentLanguage;
            
            // 添加事件监听器
            languageSelector.addEventListener('change', function() {
                i18n.setLanguage(this.value);
            });
        }
    }
    
    // 调用工具函数和模块函数
    utils.generateRandomBackground();
    const savedTimezone = localStorage.getItem('countdownTimezone') || 'local';
    utils.updateCurrentTime(savedTimezone);
    calendar.generateCalendar(calendar.currentYear, calendar.currentMonth);
    countdown.loadData();
    countdown.checkEmptyCountdowns();
    
    // 初始化拖拽排序功能
    initDragAndDrop();
    
    // 从分享链接加载倒计时
    if (window.share) {
        const sharedCountdown = share.loadSharedCountdown();
        if (sharedCountdown) {
            // 添加分享的倒计时
            countdown.countdowns.push(sharedCountdown);
            countdown.renderCountdown(sharedCountdown);
            countdown.checkEmptyCountdowns();
            countdown.saveData();
            // 启动更新循环
            if (window.updateLoop) {
                window.updateLoop.start();
            }
            console.log('成功加载分享的倒计时:', sharedCountdown);
        }
    }
    
    console.log('初始化脚本执行完成！');
    console.log('countdown对象:', countdown);
    console.log('countdown.addCountdown:', countdown.addCountdown);
    
    // 设置默认日期时间（包含秒级精度）
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const defaultDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    document.getElementById('targetDateTime').value = defaultDateTime;
    
    // 页面加载完成后默认聚焦到目标日期输入框
    document.getElementById('targetDateTime').focus();
    
    // 日期快捷选择功能
    const dateShortcuts = document.querySelectorAll('.date-shortcut');
    dateShortcuts.forEach(button => {
        button.addEventListener('click', function() {
            const daysToAdd = parseInt(this.getAttribute('data-days'));
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + daysToAdd);
            
            const year = targetDate.getFullYear();
            const month = String(targetDate.getMonth() + 1).padStart(2, '0');
            const day = String(targetDate.getDate()).padStart(2, '0');
            const hours = String(targetDate.getHours()).padStart(2, '0');
            const minutes = String(targetDate.getMinutes()).padStart(2, '0');
            const seconds = String(targetDate.getSeconds()).padStart(2, '0');
            
            const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            document.getElementById('targetDateTime').value = dateTimeString;
        });
    });
    
    // 事件监听
    document.getElementById('addCountdown').addEventListener('click', countdown.addCountdown);
    
    // 导出/导入/清空按钮事件监听
    if (document.getElementById('exportConfig')) {
        document.getElementById('exportConfig').addEventListener('click', countdown.exportConfig);
    }
    if (document.getElementById('importConfig')) {
        document.getElementById('importConfig').addEventListener('click', countdown.importConfig);
    }
    if (document.getElementById('clearAll')) {
        document.getElementById('clearAll').addEventListener('click', countdown.clearAll);
    }
    
    // 计时类型切换时自动调整日期选择器默认值
    document.getElementById('countdownType').addEventListener('change', function() {
        const now = new Date();
        const type = this.value;
        
        // 根据计时类型设置默认日期
        let targetDate;
        if (type === 'countdown') {
            // 倒计时：默认设置为当前时间加上1天
            targetDate = new Date(now.getTime() + 86400000);
        } else {
            // 正计时：默认设置为当前时间减去1天
            targetDate = new Date(now.getTime() - 86400000);
        }
        
        // 格式化日期时间
        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');
        const hours = String(targetDate.getHours()).padStart(2, '0');
        const minutes = String(targetDate.getMinutes()).padStart(2, '0');
        const seconds = String(targetDate.getSeconds()).padStart(2, '0');
        const defaultDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        
        // 更新日期选择器值
        document.getElementById('targetDateTime').value = defaultDateTime;
        document.getElementById('targetDateTime').focus();
    });
    
    // 时区选择事件监听
    if (document.getElementById('timezone')) {
        document.getElementById('timezone').addEventListener('change', function() {
            countdown.setTimezone(this.value);
        });
        // 加载保存的时区设置
        const savedTimezone = localStorage.getItem('countdownTimezone');
        if (savedTimezone && document.getElementById('timezone')) {
            document.getElementById('timezone').value = savedTimezone;
        }
    }
    
    // 暗黑模式切换
    const themeToggle = document.getElementById('themeToggle');
    
    // 应用主题
    function applyTheme(isDarkMode) {
        const body = document.body;
        if (isDarkMode) {
            body.classList.add('dark-mode');
            themeToggle.textContent = '☀️ 浅色模式';
            themeToggle.style.background = 'rgba(40,40,40,0.9)';
            themeToggle.style.color = '#f0f0f0';
            // 优化暗黑模式下的背景
            updateDarkModeBackground();
        } else {
            body.classList.remove('dark-mode');
            themeToggle.textContent = '🌙 暗黑模式';
            themeToggle.style.background = 'rgba(255,255,255,0.9)';
            themeToggle.style.color = '#333';
            // 恢复正常背景
            utils.generateRandomBackground();
        }
        
        // 更新 favicon
        updateFavicon(isDarkMode);
        
        // 保存主题设置到localStorage
        localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
    }
    
    // 优化暗黑模式下的背景
    function updateDarkModeBackground() {
        // 生成适合暗黑模式的背景
        const darkColors = ['#1a1a2e', '#16213e', '#0f3460', '#191919', '#2c3e50', '#34495e'];
        const color1 = darkColors[Math.floor(Math.random() * darkColors.length)];
        const color2 = darkColors[Math.floor(Math.random() * darkColors.length)];
        const angle = Math.floor(Math.random() * 360);
        document.body.style.background = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    }
    
    // 主题切换事件
    themeToggle.addEventListener('click', function() {
        const body = document.body;
        const isDarkMode = !body.classList.contains('dark-mode');
        applyTheme(isDarkMode);
    });
    
    // 检查系统主题偏好
    function checkSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true; // 系统偏好暗黑模式
        }
        return false; // 系统偏好浅色模式
    }
    
    // 加载主题设置
    function loadTheme() {
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode !== null) {
            // 使用保存的主题设置
            applyTheme(savedDarkMode === 'true');
        } else {
            // 跟随系统主题
            applyTheme(checkSystemTheme());
        }
    }
    
    // 监听系统主题变化
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            const savedDarkMode = localStorage.getItem('darkMode');
            if (savedDarkMode === null) {
                // 只有在没有手动设置主题时才跟随系统变化
                applyTheme(e.matches);
            }
        });
    }
    
    // 动态 favicon 处理
    function updateFavicon(isDarkMode) {
        const faviconLink = document.querySelector('link[rel="icon"]');
        if (faviconLink) {
            // 这里我们可以使用不同的 favicon URL 来区分暗黑模式和浅色模式
            // 由于我们只有一个 favicon.png，我们可以通过添加查询参数来强制浏览器重新加载
            // 在实际应用中，你可以创建一个专门的暗黑模式 favicon
            faviconLink.href = isDarkMode 
                ? 'favicon.png?theme=dark' 
                : 'favicon.png?theme=light';
        }
    }
    
    // 加载主题
    loadTheme();
    
    // 添加防抖动处理
    let isGenerating = false;
    
    function navigateMonthWithDebounce(delta) {
        if (isGenerating) return;
        isGenerating = true;
        
        calendar.navigateMonth(delta);
        
        // 短暂延迟后允许再次导航
        setTimeout(() => {
            isGenerating = false;
        }, 100);
    }
    
    document.getElementById('prevMonth').addEventListener('click', function() {
        navigateMonthWithDebounce(-1);
    });
    
    document.getElementById('nextMonth').addEventListener('click', function() {
        navigateMonthWithDebounce(1);
    });
    
    // 自动更新 - 使用requestAnimationFrame替代setInterval
    let lastUpdateTime = 0;
    let animationFrameId = null;
    let isRunning = false;
    
    function updateWithRAF(timestamp) {
        if (!lastUpdateTime || timestamp - lastUpdateTime >= 1000) {
            const currentTimezone = localStorage.getItem('countdownTimezone') || 'local';
            utils.updateCurrentTime(currentTimezone);
            countdown.updateCountdowns();
            countdown.checkCountdownEnd();
            countdown.checkReminders();
            lastUpdateTime = timestamp;
        }
        
        // 检查是否有倒计时项，决定是否继续循环
        if (countdown.countdowns && countdown.countdowns.length > 0) {
            animationFrameId = requestAnimationFrame(updateWithRAF);
        } else {
            // 无倒计时项时停止循环
            stopUpdateLoop();
        }
    }
    
    function startUpdateLoop() {
        if (!isRunning) {
            isRunning = true;
            animationFrameId = requestAnimationFrame(updateWithRAF);
        }
    }
    
    function stopUpdateLoop() {
        if (isRunning) {
            isRunning = false;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }
    }
    
    // 导出函数，以便在添加/删除倒计时时控制循环
    window.updateLoop = {
        start: startUpdateLoop,
        stop: stopUpdateLoop
    };
    
    // 初始启动循环
    startUpdateLoop();
    
    // 拖拽排序功能
    function initDragAndDrop() {
        const dragContainer = document.getElementById('countdownsList');
        if (!dragContainer) return;
        
        let draggedElement = null;
        
        // 为所有现有和新创建的倒计时项添加拖拽事件
        const addDragEvents = (element) => {
            if (!element) return;
            
            element.addEventListener('dragstart', (e) => {
                draggedElement = element;
                setTimeout(() => {
                    element.style.opacity = '0.5';
                }, 0);
            });
            
            element.addEventListener('dragend', () => {
                draggedElement = null;
                element.style.opacity = '1';
            });
            
            element.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            
            element.addEventListener('dragenter', (e) => {
                e.preventDefault();
                if (element !== draggedElement) {
                    element.style.transform = 'scale(1.05)';
                }
            });
            
            element.addEventListener('dragleave', () => {
                element.style.transform = 'scale(1)';
            });
            
            element.addEventListener('drop', (e) => {
                e.preventDefault();
                element.style.transform = 'scale(1)';
                
                if (element !== draggedElement) {
                    const dragContainer = document.getElementById('countdownsList');
                    const draggedId = parseInt(draggedElement.getAttribute('data-id'));
                    const targetId = parseInt(element.getAttribute('data-id'));
                    
                    // 找到拖拽元素和目标元素在数组中的位置
                    const draggedIndex = countdown.countdowns.findIndex(c => c.id === draggedId);
                    const targetIndex = countdown.countdowns.findIndex(c => c.id === targetId);
                    
                    if (draggedIndex !== -1 && targetIndex !== -1) {
                        // 重新排序数组
                        const [draggedCountdown] = countdown.countdowns.splice(draggedIndex, 1);
                        countdown.countdowns.splice(targetIndex, 0, draggedCountdown);
                        
                        // 保存新的顺序
                        countdown.saveData();
                        
                        // 重新渲染列表
                        dragContainer.innerHTML = '';
                        countdown.countdowns.forEach(c => countdown.renderCountdown(c));
                        countdown.checkEmptyCountdowns();
                    }
                }
            });
        };
        
        // 为容器添加事件，以便在空白区域放置
        dragContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        dragContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedElement) {
                dragContainer.appendChild(draggedElement);
                
                // 重新排序数组
                const draggedId = parseInt(draggedElement.getAttribute('data-id'));
                const draggedIndex = countdown.countdowns.findIndex(c => c.id === draggedId);
                
                if (draggedIndex !== -1) {
                    const [draggedCountdown] = countdown.countdowns.splice(draggedIndex, 1);
                    countdown.countdowns.push(draggedCountdown);
                    countdown.saveData();
                }
            }
        });
        
        // 导出添加拖拽事件的函数，以便在添加新倒计时时调用
        window.addDragEvents = addDragEvents;
    }
    
    requestAnimationFrame(updateWithRAF);
}

// 全局错误处理
window.addEventListener('error', (event) => {
  console.error('全局错误:', event.error);
  // 显示友好的错误提示，避免页面崩溃
  if (!event.error.message.includes('ResizeObserver')) { // 忽略 ResizeObserver 错误
    alert(window.i18n ? i18n.t('errorGeneral') : '应用遇到了一些问题，请刷新页面重试！');
  }
  // 阻止默认错误处理
  event.preventDefault();
});

// 全局未捕获的 Promise 拒绝处理
window.addEventListener('unhandledrejection', (event) => {
  console.error('未捕获的 Promise 拒绝:', event.reason);
  // 显示友好的错误提示
  alert(window.i18n ? i18n.t('errorPromise') : '操作未能完成，请重试！');
  // 阻止默认处理
  event.preventDefault();
});

// 注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker 注册成功:', registration.scope);
      })
      .catch((error) => {
        console.log('Service Worker 注册失败:', error);
      });
  });
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);