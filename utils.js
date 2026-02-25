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

    window.utils = {
        today: today,
        generateRandomBackground: generateRandomBackground,
        updateCurrentTime: updateCurrentTime
    };
})();
