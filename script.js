function init() {
    console.log('初始化脚本开始执行...');
    
    // 调用工具函数和模块函数
    utils.generateRandomBackground();
    utils.updateCurrentTime();
    calendar.generateCalendar(calendar.currentYear, calendar.currentMonth);
    countdown.loadData();
    countdown.checkEmptyCountdowns();
    
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
    
    // 事件监听
    document.getElementById('addCountdown').addEventListener('click', countdown.addCountdown);
    
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
    
    // 暗黑模式切换
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', function() {
        const body = document.body;
        const isDarkMode = body.classList.toggle('dark-mode');
        
        if (isDarkMode) {
            themeToggle.textContent = '☀️ 浅色模式';
            themeToggle.style.background = 'rgba(40,40,40,0.9)';
            themeToggle.style.color = '#f0f0f0';
        } else {
            themeToggle.textContent = '🌙 暗黑模式';
            themeToggle.style.background = 'rgba(255,255,255,0.9)';
            themeToggle.style.color = '#333';
        }
        
        // 保存主题设置到localStorage
        localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
    });
    
    // 加载保存的主题设置
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️ 浅色模式';
        themeToggle.style.background = 'rgba(40,40,40,0.9)';
        themeToggle.style.color = '#f0f0f0';
    }
    
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
    
    function updateWithRAF(timestamp) {
        if (!lastUpdateTime || timestamp - lastUpdateTime >= 1000) {
            utils.updateCurrentTime();
            countdown.updateCountdowns();
            countdown.checkCountdownEnd();
            lastUpdateTime = timestamp;
        }
        requestAnimationFrame(updateWithRAF);
    }
    
    requestAnimationFrame(updateWithRAF);
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);