// 当前日期
const today = new Date();

// 生成随机背景颜色
function generateRandomBackground() {
    // 生成随机颜色
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    // 生成随机渐变方向
    const angle = Math.floor(Math.random() * 360);
    
    // 生成两个随机颜色
    const color1 = getRandomColor();
    const color2 = getRandomColor();
    
    // 设置背景渐变
    document.body.style.background = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
}

// 更新当前时间
function updateCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('currentTime').innerHTML = `
        <div class="current-date">${year}年${month}月${day}日</div>
        <div class="current-clock">${hours}:${minutes}:${seconds}</div>
    `;
}

// 导出函数
window.generateRandomBackground = generateRandomBackground;
window.updateCurrentTime = updateCurrentTime;
window.today = today;