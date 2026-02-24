// 倒计时列表
let countdowns = [];
let countdownId = 0;

// 添加倒计时
function addCountdown() {
    const name = document.getElementById('countdownName').value || `倒计时 ${countdownId + 1}`;
    const type = document.getElementById('countdownType').value;
    let targetDateTime;
    
    if (type === 'datetime') {
        const dateTimeStr = document.getElementById('targetDateTime').value;
        if (!dateTimeStr) {
            alert('请选择目标日期和时间');
            return;
        }
        targetDateTime = new Date(dateTimeStr);
    } else {
        const hours = parseInt(document.getElementById('hours').value) || 0;
        const minutes = parseInt(document.getElementById('minutes').value) || 0;
        const seconds = parseInt(document.getElementById('seconds').value) || 0;
        
        if (hours === 0 && minutes === 0 && seconds === 0) {
            alert('请输入有效的时分秒');
            return;
        }
        
        targetDateTime = new Date();
        targetDateTime.setHours(targetDateTime.getHours() + hours);
        targetDateTime.setMinutes(targetDateTime.getMinutes() + minutes);
        targetDateTime.setSeconds(targetDateTime.getSeconds() + seconds);
    }
    
    const countdown = {
        id: countdownId++,
        name: name,
        target: targetDateTime
    };
    
    countdowns.push(countdown);
    renderCountdown(countdown);
    checkEmptyCountdowns();
    
    // 清空输入
    document.getElementById('countdownName').value = '';
    if (type === 'hms') {
        document.getElementById('hours').value = '';
        document.getElementById('minutes').value = '';
        document.getElementById('seconds').value = '';
    }
}

// 渲染倒计时
function renderCountdown(countdown) {
    const countdownsList = document.getElementById('countdownsList');
    
    const countdownItem = document.createElement('div');
    countdownItem.id = `countdown-${countdown.id}`;
    countdownItem.classList.add('countdown-item');
    
    countdownItem.innerHTML = `
        <h3>${countdown.name}</h3>
        <div class="countdown-timer">
            <div class="time-box">
                <div class="time-value days">00</div>
                <div class="time-label">天</div>
            </div>
            <div class="time-box">
                <div class="time-value hours">00</div>
                <div class="time-label">时</div>
            </div>
            <div class="time-box">
                <div class="time-value minutes">00</div>
                <div class="time-label">分</div>
            </div>
            <div class="time-box">
                <div class="time-value seconds">00</div>
                <div class="time-label">秒</div>
            </div>
        </div>
        <div class="countdown-message"></div>
        <button class="delete-btn" onclick="deleteCountdown(${countdown.id})">删除</button>
    `;
    
    countdownsList.appendChild(countdownItem);
    updateSingleCountdown(countdown);
}

// 删除倒计时
function deleteCountdown(id) {
    countdowns = countdowns.filter(c => c.id !== id);
    const element = document.getElementById(`countdown-${id}`);
    if (element) {
        element.remove();
    }
    checkEmptyCountdowns();
}

// 检查倒计时列表是否为空
function checkEmptyCountdowns() {
    const countdownsList = document.getElementById('countdownsList');
    const emptyMessage = document.getElementById('emptyMessage');
    
    if (countdowns.length === 0) {
        if (!emptyMessage) {
            const emptyDiv = document.createElement('div');
            emptyDiv.id = 'emptyMessage';
            emptyDiv.style.cssText = `
                text-align: center;
                color: #666;
                padding: 40px 20px;
            `;
            emptyDiv.textContent = '还没有添加倒计时，点击左侧添加按钮创建第一个倒计时吧！';
            countdownsList.appendChild(emptyDiv);
        }
    } else {
        if (emptyMessage) {
            emptyMessage.remove();
        }
    }
}

// 更新单个倒计时
function updateSingleCountdown(countdown) {
    const element = document.getElementById(`countdown-${countdown.id}`);
    if (!element) return;
    
    const now = new Date();
    const diff = countdown.target - now;
    
    const daysElement = element.querySelector('.days');
    const hoursElement = element.querySelector('.hours');
    const minutesElement = element.querySelector('.minutes');
    const secondsElement = element.querySelector('.seconds');
    const messageElement = element.querySelector('.countdown-message');
    
    if (diff <= 0) {
        daysElement.textContent = '00';
        hoursElement.textContent = '00';
        minutesElement.textContent = '00';
        secondsElement.textContent = '00';
        messageElement.textContent = '目标时间已过！';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    daysElement.textContent = days.toString().padStart(2, '0');
    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');
    
    const targetOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    messageElement.textContent = `距离 ${countdown.target.toLocaleString('zh-CN', targetOptions)} 还有`;
}

// 更新所有倒计时
function updateCountdowns() {
    countdowns.forEach(countdown => {
        updateSingleCountdown(countdown);
    });
}

// 导出函数
window.addCountdown = addCountdown;
window.deleteCountdown = deleteCountdown;
window.checkEmptyCountdowns = checkEmptyCountdowns;
window.updateSingleCountdown = updateSingleCountdown;
window.updateCountdowns = updateCountdowns;
window.countdowns = countdowns;
window.countdownId = countdownId;