// 初始化
function init() {
    generateRandomBackground();
    updateCurrentTime();
    generateCalendar(currentYear, currentMonth);
    checkEmptyCountdowns();
    
    // 设置默认日期时间（包含秒级精度）
    const now = new Date();
    // 生成包含秒的日期时间字符串
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const defaultDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    document.getElementById('targetDateTime').value = defaultDateTime;
    
    // 事件监听
    document.getElementById('addCountdown').addEventListener('click', addCountdown);
    
    // 倒计时类型切换
    document.getElementById('countdownType').addEventListener('change', function() {
        const type = this.value;
        if (type === 'datetime') {
            document.getElementById('datetimeInput').style.display = 'flex';
            document.getElementById('hmsInput').style.display = 'none';
        } else {
            document.getElementById('datetimeInput').style.display = 'none';
            document.getElementById('hmsInput').style.display = 'flex';
        }
    });
    
    // 添加防抖动处理
    let isGenerating = false;
    
    function navigateMonthWithDebounce(delta) {
        if (isGenerating) return;
        isGenerating = true;
        
        navigateMonth(delta);
        
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
    
    // 自动更新
    setInterval(updateCurrentTime, 1000);
    setInterval(updateCountdowns, 1000);
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);