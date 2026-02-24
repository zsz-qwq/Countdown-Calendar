(function() {
    /**
     * 倒计时模块
     * 负责管理倒计时/正计时的添加、编辑、删除和更新
     */
    
    // 倒计时列表，存储所有计时项
    let countdowns = [];
    // 倒计时ID计数器，确保每个计时项有唯一ID
    let countdownId = 0;
    // DOM节点缓存，提高性能
    const domCache = {};
    // 本地存储键名
    const STORAGE_KEY = 'countdownCalendarData';

    /**
     * 添加计时项
     * @returns {void}
     */
    function addCountdown() {
        try {
            console.log('开始添加计时项...');
            
            // 获取用户输入
            const name = document.getElementById('countdownName').value || `计时 ${countdownId + 1}`;
            const type = document.getElementById('countdownType').value;
            const timeUnit = document.getElementById('timeUnit').value;
            
            console.log('用户输入:', { name, type, timeUnit });
            
            // 验证日期时间输入
            const dateTimeStr = document.getElementById('targetDateTime').value;
            if (!dateTimeStr) {
                alert('请选择目标日期和时间');
                return;
            }
            
            // 创建日期对象
            const targetDateTime = new Date(dateTimeStr);
            
            // 验证日期有效性
            if (isNaN(targetDateTime.getTime())) {
                alert('日期格式错误，请重新选择！');
                return;
            }
            
            console.log('目标日期:', targetDateTime);
            
            // 验证日期是否符合计时类型要求
            const now = new Date();
            if (type === 'countdown' && targetDateTime <= now) {
                if (!confirm('倒计时需要选择未来的日期，是否继续添加？')) {
                    return;
                }
            } else if (type === 'countup' && targetDateTime >= now) {
                if (!confirm('正计时需要选择过去的日期，是否继续添加？')) {
                    return;
                }
            }
            
            // 创建计时对象
            const countdown = {
                id: countdownId++,
                name: name,
                target: targetDateTime,
                type: type,
                timeUnit: timeUnit,
                notified: false // 标记是否已提醒
            };
            
            console.log('创建的计时对象:', countdown);
            
            // 添加到列表并渲染
            countdowns.push(countdown);
            console.log('添加到列表后:', countdowns);
            
            renderCountdown(countdown);
            checkEmptyCountdowns();
            
            // 清空输入
            document.getElementById('countdownName').value = '';
            
            // 保存数据到本地存储
            saveData();
            
            console.log('添加计时项成功！');
        } catch (error) {
            console.error('添加计时失败:', error);
            alert('添加计时失败，请重试！');
        }
    }

    /**
     * 渲染计时项
     * @param {Object} countdown - 计时对象
     * @returns {void}
     */
    function renderCountdown(countdown) {
        try {
            const countdownsList = document.getElementById('countdownsList');
            if (!countdownsList) return;
            
            // 创建计时项元素
            const countdownItem = document.createElement('div');
            countdownItem.id = `countdown-${countdown.id}`;
            countdownItem.classList.add('countdown-item');
            
            // 根据时间单位生成不同的HTML结构
            let timerHTML = '';
            if (countdown.timeUnit === 'all' || countdown.timeUnit === 'day') {
                timerHTML += `
                    <div class="time-box">
                        <div class="time-value days">00</div>
                        <div class="time-label">天</div>
                    </div>
                `;
            }
            if (countdown.timeUnit === 'all' || countdown.timeUnit === 'hour') {
                timerHTML += `
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
                `;
            }
            
            // 设置计时项内容
            countdownItem.innerHTML = `
                <h3>${countdown.name}</h3>
                <div class="countdown-timer">
                    ${timerHTML}
                </div>
                <div class="countdown-message"></div>
                <div class="countdown-actions">
                    <button class="edit-btn" onclick="countdown.editCountdown(${countdown.id})">编辑</button>
                    <button class="delete-btn" onclick="countdown.deleteCountdown(${countdown.id})">删除</button>
                </div>
            `;
            
            // 添加到列表并更新
            countdownsList.appendChild(countdownItem);
            updateSingleCountdown(countdown);
        } catch (error) {
            console.error('渲染计时失败:', error);
        }
    }

    /**
     * 编辑计时项
     * @param {number} id - 计时项ID
     * @returns {void}
     */
    function editCountdown(id) {
        try {
            // 查找计时项
            const countdown = countdowns.find(c => c.id === id);
            if (!countdown) {
                console.error('未找到指定计时项:', id);
                return;
            }
            
            // 获取用户输入
            const name = prompt('请输入新的计时名称：', countdown.name);
            if (name === null) return;
            
            // 获取新的目标日期时间
            const dateStr = prompt('请输入新的目标日期时间（格式：YYYY-MM-DD HH:MM:SS）：', countdown.target.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).replace(/\//g, '-').replace(/\s+/, ' '));
            
            if (dateStr === null) return;
            
            // 验证日期有效性
            const newTarget = new Date(dateStr);
            if (isNaN(newTarget.getTime())) {
                alert('日期格式错误，请重新输入！');
                return;
            }
            
            // 更新计时项
            countdown.name = name;
            countdown.target = newTarget;
            countdown.notified = false; // 重置提醒状态
            
            // 重新渲染
            const element = document.getElementById(`countdown-${id}`);
            if (element) {
                element.remove();
                // 清理缓存
                clearElementCache(id);
            }
            renderCountdown(countdown);
            
            // 保存数据到本地存储
            saveData();
        } catch (error) {
            console.error('编辑计时失败:', error);
            alert('编辑计时失败，请重试！');
        }
    }

    /**
     * 检查倒计时是否结束并提醒
     * @returns {void}
     */
    function checkCountdownEnd() {
        try {
            const now = new Date();
            countdowns.forEach(countdown => {
                if (countdown.type === 'countdown' && countdown.target <= now && !countdown.notified) {
                    countdown.notified = true;
                    alert(`倒计时 "${countdown.name}" 已结束！`);
                }
            });
        } catch (error) {
            console.error('检查计时结束失败:', error);
        }
    }

    /**
     * 删除计时项
     * @param {number} id - 计时项ID
     * @returns {void}
     */
    function deleteCountdown(id) {
        try {
            // 从列表中移除
            countdowns = countdowns.filter(c => c.id !== id);
            
            // 移除DOM元素
            const elementId = `countdown-${id}`;
            const element = document.getElementById(elementId);
            if (element) {
                element.remove();
            }
            
            // 清理DOM缓存
            clearElementCache(id);
            
            // 检查是否为空
            checkEmptyCountdowns();
            
            // 保存数据到本地存储
            saveData();
        } catch (error) {
            console.error('删除计时失败:', error);
            alert('删除计时失败，请重试！');
        }
    }

    /**
     * 检查倒计时列表是否为空
     * @returns {void}
     */
    function checkEmptyCountdowns() {
        try {
            const countdownsList = document.getElementById('countdownsList');
            const emptyMessage = document.getElementById('emptyMessage');
            
            if (countdowns.length === 0) {
                // 如果为空且没有空提示，则创建
                if (!emptyMessage) {
                    const emptyDiv = document.createElement('div');
                    emptyDiv.id = 'emptyMessage';
                    emptyDiv.style.cssText = `
                        text-align: center;
                        color: #666;
                        padding: 40px 20px;
                    `;
                    emptyDiv.textContent = '还没有添加计时，点击左侧添加按钮创建第一个计时吧！';
                    countdownsList.appendChild(emptyDiv);
                }
            } else {
                // 如果不为空且有空提示，则移除
                if (emptyMessage) {
                    emptyMessage.remove();
                }
            }
        } catch (error) {
            console.error('检查空列表失败:', error);
        }
    }

    /**
     * 清理元素缓存
     * @param {number} id - 计时项ID
     * @returns {void}
     */
    function clearElementCache(id) {
        const elementId = `countdown-${id}`;
        Object.keys(domCache).forEach(key => {
            if (key.startsWith(`${elementId}:`)) {
                delete domCache[key];
            }
        });
    }

    /**
     * 获取缓存的DOM节点
     * @param {string} id - 元素ID
     * @param {string} selector - 选择器
     * @returns {HTMLElement|null}
     */
    function getCachedElement(id, selector) {
        const key = `${id}:${selector}`;
        if (!domCache[key]) {
            const element = document.getElementById(id);
            if (element) {
                domCache[key] = element.querySelector(selector);
            }
        }
        return domCache[key];
    }

    /**
     * 更新单个计时项
     * @param {Object} countdown - 计时对象
     * @returns {void}
     */
    function updateSingleCountdown(countdown) {
        try {
            const elementId = `countdown-${countdown.id}`;
            const element = document.getElementById(elementId);
            if (!element) return;
            
            // 计算时间差
            const now = new Date();
            let diff;
            if (countdown.type === 'countdown') {
                diff = countdown.target - now;
            } else {
                diff = now - countdown.target;
            }
            
            // 获取DOM元素
            const daysElement = getCachedElement(elementId, '.days');
            const hoursElement = getCachedElement(elementId, '.hours');
            const minutesElement = getCachedElement(elementId, '.minutes');
            const secondsElement = getCachedElement(elementId, '.seconds');
            const messageElement = getCachedElement(elementId, '.countdown-message');
            
            // 处理倒计时结束
            if (countdown.type === 'countdown' && diff <= 0) {
                if (daysElement) daysElement.textContent = '00';
                if (hoursElement) hoursElement.textContent = '00';
                if (minutesElement) minutesElement.textContent = '00';
                if (secondsElement) secondsElement.textContent = '00';
                if (messageElement) messageElement.textContent = '目标时间已过！';
                return;
            }
            
            // 计算时间组件
            const absDiff = Math.abs(diff);
            const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);
            
            // 更新显示
            if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
            if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
            if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
            
            // 更新消息
            if (messageElement) {
                const targetOptions = {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                };
                if (countdown.type === 'countdown') {
                    messageElement.textContent = `距离 ${countdown.target.toLocaleString('zh-CN', targetOptions)} 还有`;
                } else {
                    // 确保正计时消息显示正确，移除多余文字
                    const targetStr = countdown.target.toLocaleString('zh-CN', targetOptions);
                    messageElement.textContent = `${targetStr} 至今已过`;
                }
            }
        } catch (error) {
            console.error('更新计时失败:', error);
        }
    }

    /**
     * 更新所有计时项
     * @returns {void}
     */
    function updateCountdowns() {
        try {
            countdowns.forEach(countdown => {
                updateSingleCountdown(countdown);
            });
        } catch (error) {
            console.error('更新所有计时失败:', error);
        }
    }

    /**
     * 保存数据到本地存储
     * @returns {void}
     */
    function saveData() {
        try {
            const data = {
                countdowns: countdowns,
                countdownId: countdownId
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('保存数据失败:', error);
        }
    }

    /**
     * 从本地存储加载数据
     * @returns {void}
     */
    function loadData() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                const parsedData = JSON.parse(data);
                countdowns = parsedData.countdowns || [];
                countdownId = parsedData.countdownId || 0;
                
                // 将存储的字符串转换回 Date 对象
                countdowns.forEach(countdown => {
                    if (typeof countdown.target === 'string') {
                        countdown.target = new Date(countdown.target);
                    }
                });
                
                // 重新渲染所有计时项
                countdowns.forEach(countdown => {
                    renderCountdown(countdown);
                });
                
                checkEmptyCountdowns();
            }
        } catch (error) {
            console.error('加载数据失败:', error);
        }
    }

    // 导出函数
    window.countdown = {
        addCountdown: addCountdown,
        deleteCountdown: deleteCountdown,
        editCountdown: editCountdown,
        checkEmptyCountdowns: checkEmptyCountdowns,
        updateSingleCountdown: updateSingleCountdown,
        updateCountdowns: updateCountdowns,
        checkCountdownEnd: checkCountdownEnd,
        countdowns: countdowns,
        countdownId: countdownId,
        saveData: saveData,
        loadData: loadData,
        // 测试函数
        testAddCountdown: function() {
            console.log('测试添加倒计时功能...');
            // 创建一个测试倒计时
            const testCountdown = {
                id: countdownId++,
                name: '测试倒计时',
                target: new Date(Date.now() + 86400000), // 1天后
                type: 'countdown',
                timeUnit: 'all',
                notified: false
            };
            countdowns.push(testCountdown);
            renderCountdown(testCountdown);
            checkEmptyCountdowns();
            saveData();
            console.log('测试倒计时添加成功！');
        }
    };
})();