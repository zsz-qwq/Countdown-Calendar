(function() {
    const today = new Date();

    function generateRandomBackground() {
        function getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        const angle = Math.floor(Math.random() * 360);
        const color1 = getRandomColor();
        const color2 = getRandomColor();
        document.body.style.background = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    }

    function updateCurrentTime(timezone = 'local') {
        let now;
        
        if (timezone === 'local') {
            now = new Date();
        } else if (timezone === 'UTC') {
            const current = new Date();
            now = new Date(Date.UTC(
                current.getUTCFullYear(),
                current.getUTCMonth(),
                current.getUTCDate(),
                current.getUTCHours(),
                current.getUTCMinutes(),
                current.getUTCSeconds()
            ));
        } else if (timezone.startsWith('UTC')) {
            const offsetMatch = timezone.match(/UTC([+-]\d+)/);
            if (offsetMatch) {
                const offsetHours = parseInt(offsetMatch[1]);
                const current = new Date();
                const utcTimestamp = current.getTime() + current.getTimezoneOffset() * 60 * 1000;
                const targetTimestamp = utcTimestamp + offsetHours * 60 * 60 * 1000;
                now = new Date(targetTimestamp);
            } else {
                now = new Date();
            }
        } else {
            now = new Date();
        }
        
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        document.getElementById('currentTime').innerHTML = `<div class="current-date">${year}年${month}月${day}日</div><div class="current-clock">${hours}:${minutes}:${seconds}</div>`;
    }

    /**
     * 防抖函数
     * @param {Function} func - 要执行的函数
     * @param {number} wait - 等待时间（毫秒）
     * @returns {Function} 防抖处理后的函数
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * 节流函数
     * @param {Function} func - 要执行的函数
     * @param {number} limit - 时间限制（毫秒）
     * @returns {Function} 节流处理后的函数
     */
    function throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * 平滑滚动到指定元素
     * @param {string} elementId - 元素ID
     */
    function scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * 播放通知声音
     */
    function playNotificationSound() {
        // 这里可以添加声音播放逻辑
        // 由于浏览器限制，通常需要用户交互后才能播放声音
        console.log('播放通知声音');
    }

    /**
     * 发送通知
     * @param {string} title - 通知标题
     * @param {string} body - 通知内容
     */
    function sendNotification(title, body) {
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification(title, { body: body });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification(title, { body: body });
                    }
                });
            }
        }
    }

    window.utils = {
        today: today,
        generateRandomBackground: generateRandomBackground,
        updateCurrentTime: updateCurrentTime,
        debounce: debounce,
        throttle: throttle,
        scrollToElement: scrollToElement,
        playNotificationSound: playNotificationSound,
        sendNotification: sendNotification
    };
})();
