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
    // 计算结果缓存，提高性能
    const calculationCache = {};
    // 本地存储键名
    const STORAGE_KEY = 'countdownCalendarData';
    // 状态管理实例
    let store;

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
                alert(window.i18n ? i18n.t('errorDate') : '请选择目标日期和时间');
                return;
            }
            
            // 创建日期对象
            let targetDateTime;
            try {
                targetDateTime = new Date(dateTimeStr);
                
                // 调整目标时间到当前时区
                if (currentTimezone !== 'local') {
                    if (currentTimezone === 'UTC') {
                        // 对于UTC时区，创建UTC时间
                        const dt = new Date(dateTimeStr);
                        targetDateTime = new Date(Date.UTC(
                            dt.getFullYear(),
                            dt.getMonth(),
                            dt.getDate(),
                            dt.getHours(),
                            dt.getMinutes(),
                            dt.getSeconds()
                        ));
                    } else if (currentTimezone.startsWith('UTC')) {
                        // 对于UTC±N时区，调整时间
                        const offsetMatch = currentTimezone.match(/UTC([+-]\d+)/);
                        if (offsetMatch) {
                            const offsetHours = parseInt(offsetMatch[1]);
                            // 获取本地时间的UTC时间戳
                            const dt = new Date(dateTimeStr);
                            const localUtcTimestamp = dt.getTime() + dt.getTimezoneOffset() * 60 * 1000;
                            // 调整到目标时区
                            const targetTimestamp = localUtcTimestamp + offsetHours * 60 * 60 * 1000;
                            targetDateTime = new Date(targetTimestamp);
                        }
                    }
                }
                
                // 验证日期有效性
                if (isNaN(targetDateTime.getTime())) {
                    throw new Error('无效的日期格式');
                }
            } catch (error) {
                console.error('日期处理错误:', error);
                alert(window.i18n ? i18n.t('errorDate') : '日期格式错误，请重新选择！');
                return;
            }
            
            console.log('目标日期:', targetDateTime);
            
            // 验证日期是否符合计时类型要求
            try {
                const now = getCurrentTime();
                if (type === 'countdown' && targetDateTime <= now) {
                    if (!confirm(window.i18n ? i18n.t('confirmCountdownPast') : '倒计时需要选择未来的日期，是否继续添加？')) {
                        return;
                    }
                } else if (type === 'countup' && targetDateTime >= now) {
                    if (!confirm(window.i18n ? i18n.t('confirmCountupFuture') : '正计时需要选择过去的日期，是否继续添加？')) {
                        return;
                    }
                }
            } catch (error) {
                console.error('时间比较错误:', error);
                alert(window.i18n ? i18n.t('errorTime') : '时间处理错误，请重试！');
                return;
            }
            
            // 获取自定义样式
            const fontFamily = document.getElementById('fontFamily').value;
            const textColor = document.getElementById('textColor').value;
            const bgColor = document.getElementById('bgColor').value;
            
            // 获取新的倒计时 ID
            let newId;
            if (window.store) {
                newId = store.getNextCountdownId();
            } else {
                newId = countdownId++;
            }
            
            // 创建计时对象
            const countdown = {
                id: newId,
                name: name,
                target: targetDateTime,
                type: type,
                timeUnit: timeUnit,
                fontFamily: fontFamily,
                textColor: textColor,
                bgColor: bgColor,
                paused: false,
                pausedAt: null,
                notified: false, // 标记是否已提醒
                status: 'active', // 状态：active, archived, hidden
                pinned: false // 是否置顶
            };
            
            console.log('创建的计时对象:', countdown);
            
            // 添加到列表
            countdowns.push(countdown);
            console.log('添加到列表后:', countdowns);
            
            // 清空输入
            document.getElementById('countdownName').value = '';
            
            // 保存数据
            saveData();
            
            // 重新渲染排序后的列表
            const countdownsList = document.getElementById('countdownsList');
            if (countdownsList) {
                countdownsList.innerHTML = '';
                renderCountdownsList();
            }
            
            // 更新统计面板
            updateStatistics();
            
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
            countdownItem.setAttribute('draggable', 'true');
            countdownItem.setAttribute('data-id', countdown.id);
            
            // 应用自定义样式
            if (countdown.fontFamily) {
                countdownItem.style.fontFamily = countdown.fontFamily;
            }
            if (countdown.textColor) {
                countdownItem.style.color = countdown.textColor;
            }
            if (countdown.bgColor) {
                countdownItem.style.backgroundColor = countdown.bgColor;
            }
            
            // 根据时间单位生成不同的HTML结构
            let timerHTML = '';
            if (countdown.timeUnit === 'all' || countdown.timeUnit === 'all-ms' || countdown.timeUnit === 'day') {
                timerHTML += `
                    <div class="time-box">
                        <div class="time-value days">00</div>
                        <div class="time-label">天</div>
                    </div>
                `;
            }
            if (countdown.timeUnit === 'all' || countdown.timeUnit === 'all-ms' || countdown.timeUnit === 'hour') {
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
            if (countdown.timeUnit === 'all-ms') {
                timerHTML += `
                    <div class="time-box">
                        <div class="time-value milliseconds">000</div>
                        <div class="time-label">毫秒</div>
                    </div>
                `;
            }
            
            // 设置计时项内容
            countdownItem.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                    <h3>${countdown.name}</h3>
                    <div style="display: flex; gap: 5px;">
                        ${countdown.pinned ? '<span style="color: #ff9800; font-size: 12px; background: rgba(255,152,0,0.1); padding: 2px 6px; border-radius: 10px;">置顶</span>' : ''}
                        ${countdown.status === 'archived' ? '<span style="color: #9e9e9e; font-size: 12px; background: rgba(158,158,158,0.1); padding: 2px 6px; border-radius: 10px;">已归档</span>' : ''}
                    </div>
                </div>
                <div class="countdown-timer">
                    ${timerHTML}
                </div>
                <div class="countdown-message"></div>
                <div class="countdown-actions">
                    <button class="edit-btn" onclick="countdown.editCountdown(${countdown.id})"></button>
                    <button class="share-btn" onclick="countdown.shareCountdown(${countdown.id})"></button>
                    <button class="${countdown.pinned ? 'unpin-btn' : 'pin-btn'}" onclick="countdown.togglePin(${countdown.id})"></button>
                    <button class="${countdown.status === 'archived' ? 'unarchive-btn' : 'archive-btn'}" onclick="countdown.toggleArchive(${countdown.id})"></button>
                    <button class="${countdown.status === 'hidden' ? 'show-btn' : 'hide-btn'}" onclick="countdown.toggleHide(${countdown.id})"></button>
                    <button class="delete-btn" onclick="countdown.deleteCountdown(${countdown.id})"></button>
                </div>
            `;
            
            // 添加到列表并更新
            countdownsList.appendChild(countdownItem);
            updateSingleCountdown(countdown);
            
            // 为新创建的计时项添加拖拽事件
            if (window.addDragEvents) {
                window.addDragEvents(countdownItem);
            }
            
            // 启动更新循环
            if (window.updateLoop) {
                window.updateLoop.start();
            }
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
            
            // 清理缓存
            clearElementCache(id);
            
            // 保存数据到本地存储
            saveData();
            
            // 重新渲染排序后的列表
            const countdownsList = document.getElementById('countdownsList');
            if (countdownsList) {
                countdownsList.innerHTML = '';
                renderCountdownsList();
            }
            
            // 更新统计面板
            updateStatistics();
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
            const now = getCurrentTime();
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
            
            // 清理DOM缓存
            clearElementCache(id);
            
            // 保存数据
            saveData();
            
            // 重新渲染排序后的列表
            const countdownsList = document.getElementById('countdownsList');
            if (countdownsList) {
                countdownsList.innerHTML = '';
                renderCountdownsList();
            }
            
            // 如果没有倒计时项，停止更新循环
            if (countdowns.length === 0 && window.updateLoop) {
                window.updateLoop.stop();
            }
            
            // 更新统计面板
            updateStatistics();
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
                    emptyDiv.textContent = window.i18n ? i18n.t('emptyMessage') : '还没有添加计时，点击左侧添加按钮创建第一个计时吧！';
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
     * 数字滚动动画
     * @param {HTMLElement} element - 要更新的元素
     * @param {number} newValue - 新值
     */
    function animateNumber(element, newValue) {
        if (!element) return;
        
        const currentValue = parseInt(element.textContent) || 0;
        if (currentValue === newValue) return;
        
        const duration = 500; // 动画持续时间
        const startTime = performance.now();
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数使动画更自然
            const easeOutQuad = 1 - (1 - progress) * (1 - progress);
            const value = Math.round(currentValue + (newValue - currentValue) * easeOutQuad);
            
            element.textContent = value.toString().padStart(2, '0');
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }
        
        requestAnimationFrame(updateNumber);
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
            
            // 获取当前时间
            const now = getCurrentTime();
            
            // 生成缓存键，基于倒计时ID和当前时间（以秒为单位，避免过于频繁的更新）
            const cacheKey = `${countdown.id}_${Math.floor(now.getTime() / 1000)}`;
            
            // 检查缓存中是否有计算结果
            let calculationResult;
            if (calculationCache[cacheKey]) {
                calculationResult = calculationCache[cacheKey];
            } else {
                // 计算时间差
                let diff;
                if (countdown.type === 'countdown') {
                    diff = countdown.target - now;
                } else {
                    diff = now - countdown.target;
                }
                
                // 计算时间组件
                const absDiff = Math.abs(diff);
                const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);
                const milliseconds = Math.floor((absDiff % 1000));
                
                // 计算周数和工作日数
                const weeks = Math.floor(days / 7);
                const weekdays = calculateWeekdays(now, countdown.target, countdown.type);
                
                // 生成消息
                const targetOptions = {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                };
                let message;
                if (countdown.type === 'countdown') {
                    message = window.i18n ? 
                        `${i18n.t('distanceTo')} ${countdown.target.toLocaleString(i18n.currentLanguage === 'zh' ? 'zh-CN' : 'en-US', targetOptions)}` : 
                        `距离 ${countdown.target.toLocaleString('zh-CN', targetOptions)}`;
                    
                    // 添加周数和工作日数信息
                    if (weeks > 0) {
                        message += ` (${weeks}周${days % 7}天`;
                        if (weekdays !== days) {
                            message += `, ${weekdays}工作日`;
                        }
                        message += `)`;
                    } else if (days > 0) {
                        message += ` (${days}天`;
                        if (weekdays !== days) {
                            message += `, ${weekdays}工作日`;
                        }
                        message += `)`;
                    }
                } else {
                    // 确保正计时消息显示正确，移除多余文字
                    const targetStr = countdown.target.toLocaleString(i18n && i18n.currentLanguage === 'zh' ? 'zh-CN' : 'en-US', targetOptions);
                    message = window.i18n ? 
                        `${targetStr} ${i18n.t('timeElapsedSince')}` : 
                        `${targetStr} 至今已过`;
                    
                    // 添加周数和工作日数信息
                    if (weeks > 0) {
                        message += ` (${weeks}周${days % 7}天`;
                        if (weekdays !== days) {
                            message += `, ${weekdays}工作日`;
                        }
                        message += `)`;
                    } else if (days > 0) {
                        message += ` (${days}天`;
                        if (weekdays !== days) {
                            message += `, ${weekdays}工作日`;
                        }
                        message += `)`;
                    }
                }
                
                // 缓存计算结果
                calculationResult = {
                    diff,
                    absDiff,
                    days,
                    hours,
                    minutes,
                    seconds,
                    milliseconds,
                    weeks,
                    weekdays,
                    message
                };
                calculationCache[cacheKey] = calculationResult;
            }
            
            // 获取DOM元素
            const daysElement = getCachedElement(elementId, '.days');
            const hoursElement = getCachedElement(elementId, '.hours');
            const minutesElement = getCachedElement(elementId, '.minutes');
            const secondsElement = getCachedElement(elementId, '.seconds');
            const millisecondsElement = getCachedElement(elementId, '.milliseconds');
            const messageElement = getCachedElement(elementId, '.countdown-message');
            
            // 处理倒计时结束
            if (countdown.type === 'countdown' && calculationResult.diff <= 0) {
                if (daysElement) daysElement.textContent = '00';
                if (hoursElement) hoursElement.textContent = '00';
                if (minutesElement) minutesElement.textContent = '00';
                if (secondsElement) secondsElement.textContent = '00';
                if (millisecondsElement) millisecondsElement.textContent = '000';
                if (messageElement) messageElement.textContent = window.i18n ? i18n.t('targetTimePassed') : '目标时间已过！';
                // 添加已结束状态样式
                element.classList.add('countdown-ended');
                return;
            } else {
                // 移除已结束状态样式（如果存在）
                element.classList.remove('countdown-ended');
            }
            
            // 使用动画更新显示
            animateNumber(daysElement, calculationResult.days);
            animateNumber(hoursElement, calculationResult.hours);
            animateNumber(minutesElement, calculationResult.minutes);
            animateNumber(secondsElement, calculationResult.seconds);
            if (millisecondsElement) {
                animateNumber(millisecondsElement, calculationResult.milliseconds);
            }
            
            // 更新消息
            if (messageElement) {
                messageElement.textContent = calculationResult.message;
            }
        } catch (error) {
            console.error('更新计时失败:', error);
        }
    }
    
    /**
     * 计算工作日数（排除周末）
     * @param {Date} start - 开始日期
     * @param {Date} end - 结束日期
     * @param {string} type - 计时类型 ('countdown' 或 'countup')
     * @returns {number} 工作日数
     */
    function calculateWeekdays(start, end, type) {
        try {
            let count = 0;
            let current = new Date(start);
            const target = new Date(end);
            
            // 确保日期顺序正确
            if (type === 'countdown' && current > target) {
                return 0;
            } else if (type === 'countup' && current < target) {
                return 0;
            }
            
            // 调整日期比较方向
            const isForward = type === 'countdown' ? (a, b) => a <= b : (a, b) => a >= b;
            const increment = type === 'countdown' ? 1 : -1;
            
            // 计算工作日数
            while (isForward(current, target)) {
                const dayOfWeek = current.getDay();
                // 排除周六和周日
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    count++;
                }
                current.setDate(current.getDate() + increment);
            }
            
            return count;
        } catch (error) {
            console.error('计算工作日失败:', error);
            return 0;
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
     * 保存数据到状态管理
     * @returns {void}
     */
    function saveData() {
        try {
            // 确保 store 已初始化
            if (window.store) {
                store = window.store;
                // 使用状态管理保存数据
                store.setState({
                    countdowns: countdowns,
                    countdownId: countdownId
                });
            } else {
                // 降级到本地存储
                const data = {
                    countdowns: countdowns,
                    countdownId: countdownId
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            }
            
            // 每次保存数据后尝试自动备份
            autoBackup();
        } catch (error) {
            console.error('保存数据失败:', error);
            // 显示友好的错误提示
            if (error.name === 'QuotaExceededError') {
                alert(window.i18n ? i18n.t('errorStorageQuota') : '本地存储空间不足，请删除一些倒计时项后再试！');
            } else {
                alert(window.i18n ? i18n.t('errorStorage') : '保存数据失败，请重试！');
            }
        }
    }

    /**
     * 从状态管理加载数据
     * @returns {void}
     */
    function loadData() {
        try {
            // 确保 store 已初始化
            if (window.store) {
                store = window.store;
                const state = store.getState();
                
                // 从 store 中加载数据
                countdowns = state.countdowns || [];
                countdownId = state.countdownId || 0;
                currentTimezone = state.currentTimezone || 'local';
                reminderSettings = state.reminderSettings || reminderSettings;
                cloudSyncSettings = state.cloudSyncSettings || cloudSyncSettings;
                
                // 渲染排序后的倒计时列表
                renderCountdownsList();
                
                // 为所有已加载的计时项添加拖拽事件
                if (window.addDragEvents) {
                    countdowns.forEach(countdown => {
                        if (countdown.status !== 'hidden') {
                            const element = document.getElementById(`countdown-${countdown.id}`);
                            if (element) {
                                window.addDragEvents(element);
                            }
                        }
                    });
                }
                
                // 如果有倒计时项，启动更新循环
                if (countdowns.length > 0 && window.updateLoop) {
                    window.updateLoop.start();
                }
                
                // 更新统计面板
                updateStatistics();
            } else {
                // 降级到本地存储
                const data = localStorage.getItem(STORAGE_KEY);
                if (data) {
                    const parsedData = JSON.parse(data);
                    countdowns = parsedData.countdowns || [];
                    countdownId = parsedData.countdownId || 0;
                    
                    // 将存储的字符串转换回 Date 对象
                    countdowns.forEach(countdown => {
                        if (typeof countdown.target === 'string') {
                            try {
                                countdown.target = new Date(countdown.target);
                                // 验证日期是否有效
                                if (isNaN(countdown.target.getTime())) {
                                    console.warn('无效的日期数据:', countdown.target);
                                    countdown.target = new Date(); // 使用当前时间作为默认值
                                }
                            } catch (dateError) {
                                console.error('日期解析错误:', dateError);
                                countdown.target = new Date(); // 使用当前时间作为默认值
                            }
                        }
                    });
                    
                    // 渲染排序后的倒计时列表
                    renderCountdownsList();
                    
                    // 为所有已加载的计时项添加拖拽事件
                    if (window.addDragEvents) {
                        countdowns.forEach(countdown => {
                            if (countdown.status !== 'hidden') {
                                const element = document.getElementById(`countdown-${countdown.id}`);
                                if (element) {
                                    window.addDragEvents(element);
                                }
                            }
                        });
                    }
                    
                    // 如果有倒计时项，启动更新循环
                    if (countdowns.length > 0 && window.updateLoop) {
                        window.updateLoop.start();
                    }
                    
                    // 更新统计面板
                    updateStatistics();
                }
            }
        } catch (error) {
            console.error('加载数据失败:', error);
            // 显示友好的错误提示
            alert(window.i18n ? i18n.t('errorLoadData') : '加载数据失败，将使用默认设置！');
            // 重置为默认状态
            countdowns = [];
            countdownId = 0;
            checkEmptyCountdowns();
        }
    }

    // 时区设置
    let currentTimezone = localStorage.getItem('countdownTimezone') || 'local';
    
    // 提醒设置
    let reminderSettings = {
        enabled: true,
        advanceTime: 60 * 60 * 1000, // 默认提前1小时
        soundEnabled: true,
        repeatEnabled: false,
        repeatInterval: 5 * 60 * 1000, // 默认每5分钟重复
        muteMode: false, // 全局静音模式
        thirdPartyReminders: {
            email: {
                enabled: false,
                email: ''
            },
            dingtalk: {
                enabled: false,
                webhook: ''
            },
            wechat: {
                enabled: false,
                appId: ''
            }
        },
        reminderRules: [ // 多级提醒规则
            { time: 24 * 60 * 60 * 1000, enabled: true }, // 提前1天
            { time: 60 * 60 * 1000, enabled: true }, // 提前1小时
            { time: 0, enabled: true } // 结束时
        ]
    };
    
    // 云同步设置
    let cloudSyncSettings = {
        enabled: false,
        provider: 'github', // github, netlify, custom
        github: {
            token: '',
            gistId: ''
        },
        netlify: {
            endpoint: '',
            apiKey: ''
        },
        custom: {
            endpoint: '',
            apiKey: ''
        },
        lastSync: null,
        autoSync: true,
        syncInterval: 3600000 // 1小时
    };
    
    /**
     * 导出配置到 JSON 文件
     * @returns {void}
     */
    function exportConfig() {
        try {
            const data = {
                countdowns: countdowns,
                countdownId: countdownId,
                currentTimezone: currentTimezone,
                reminderSettings: reminderSettings
            };
            const jsonStr = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            // 使用新的文件名格式：countdown_backup_20260225.json
            const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('T')[0];
            a.download = `countdown_backup_${timestamp}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log('配置导出成功！');
        } catch (error) {
            console.error('导出配置失败:', error);
            alert(window.i18n ? i18n.t('errorStorage') : '导出配置失败，请重试！');
        }
    }
    
    /**
     * 自动备份配置
     * @returns {void}
     */
    function autoBackup() {
        try {
            const lastBackup = localStorage.getItem('lastBackupTime');
            const now = new Date().getTime();
            const oneDay = 24 * 60 * 60 * 1000;
            
            // 每天自动备份一次
            if (!lastBackup || now - parseInt(lastBackup) >= oneDay) {
                const data = {
                    countdowns: countdowns,
                    countdownId: countdownId,
                    currentTimezone: currentTimezone,
                    reminderSettings: reminderSettings
                };
                const jsonStr = JSON.stringify(data, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                
                // 保存到本地存储作为自动备份
                localStorage.setItem('autoBackup', jsonStr);
                localStorage.setItem('lastBackupTime', now.toString());
                console.log('自动备份完成！');
            }
        } catch (error) {
            console.error('自动备份失败:', error);
        }
    }
    
    /**
     * 导入配置从 JSON 文件
     * @returns {void}
     */
    function importConfig() {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        
                        // 配置恢复校验
                        if (!validateConfig(data)) {
                            alert('配置文件格式错误，请确保文件是有效的倒计时配置！');
                            return;
                        }
                        
                        // 确认导入
                        if (confirm(window.i18n ? i18n.t('confirmImport') : '确定要导入配置吗？这将替换当前所有倒计时项。')) {
                            // 清空当前倒计时
                            countdowns = [];
                            countdownId = data.countdownId || 0;
                            currentTimezone = data.currentTimezone || 'local';
                            reminderSettings = data.reminderSettings || reminderSettings;
                            
                            // 加载新倒计时
                            data.countdowns.forEach(countdown => {
                                // 转换 target 为 Date 对象
                                if (typeof countdown.target === 'string') {
                                    countdown.target = new Date(countdown.target);
                                }
                                // 移除可能存在的 repeatType 属性（如果导入的配置中包含）
                                delete countdown.repeatType;
                                countdowns.push(countdown);
                            });
                            
                            // 重新渲染
                            const countdownsList = document.getElementById('countdownsList');
                            if (countdownsList) {
                                countdownsList.innerHTML = '';
                            }
                            countdowns.forEach(countdown => {
                                renderCountdown(countdown);
                            });
                            checkEmptyCountdowns();
                            saveData();
                            // 保存时区设置
                            localStorage.setItem('countdownTimezone', currentTimezone);
                            alert(window.i18n ? i18n.t('successImport') : '配置导入成功！');
                        }
                    } catch (error) {
                        console.error('解析配置文件失败:', error);
                        alert(window.i18n ? i18n.t('errorStorage') : '解析配置文件失败，请确保文件格式正确！');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        } catch (error) {
            console.error('导入配置失败:', error);
            alert(window.i18n ? i18n.t('errorStorage') : '导入配置失败，请重试！');
        }
    }
    
    /**
     * 验证配置文件格式
     * @param {Object} data - 配置数据
     * @returns {boolean} 是否有效
     */
    function validateConfig(data) {
        try {
            // 检查必要的字段
            if (!data || typeof data !== 'object') {
                return false;
            }
            
            // 检查 countdowns 字段
            if (!Array.isArray(data.countdowns)) {
                return false;
            }
            
            // 检查每个倒计时项
            for (const countdown of data.countdowns) {
                if (!countdown || typeof countdown !== 'object') {
                    return false;
                }
                
                // 检查必要的字段
                if (typeof countdown.id !== 'number' || 
                    typeof countdown.name !== 'string' || 
                    (!countdown.target || isNaN(new Date(countdown.target).getTime())) ||
                    typeof countdown.type !== 'string' || 
                    !['countdown', 'countup'].includes(countdown.type)) {
                    return false;
                }
            }
            
            return true;
        } catch (error) {
            console.error('验证配置失败:', error);
            return false;
        }
    }
    
    /**
     * 清空所有倒计时
     * @returns {void}
     */
    function clearAll() {
        try {
            if (countdowns.length === 0) {
                alert(window.i18n ? i18n.t('errorStorage') : '没有倒计时项可清空！');
                return;
            }
            if (confirm(window.i18n ? i18n.t('confirmClearAll') : '确定要清空所有倒计时吗？此操作不可恢复！')) {
                // 清空列表
                countdowns = [];
                countdownId = 0;
                
                // 清空 DOM
                const countdownsList = document.getElementById('countdownsList');
                if (countdownsList) {
                    countdownsList.innerHTML = '';
                }
                checkEmptyCountdowns();
            saveData();
            
            // 更新统计面板
            updateStatistics();
            
            alert(window.i18n ? i18n.t('successClear') : '所有倒计时已清空！');
            }
        } catch (error) {
            console.error('清空倒计时失败:', error);
            alert(window.i18n ? i18n.t('errorStorage') : '清空倒计时失败，请重试！');
        }
    }
    
    /**
     * 获取当前时间（考虑时区）
     * @returns {Date} 当前时间
     */
    function getCurrentTime() {
        const now = new Date();
        
        if (currentTimezone === 'local') {
            return now;
        } else if (currentTimezone === 'UTC') {
            return new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds()
            ));
        } else if (currentTimezone.startsWith('UTC')) {
            // 处理 UTC±N 格式的时区
            const offsetMatch = currentTimezone.match(/UTC([+-]\d+)/);
            if (offsetMatch) {
                const offsetHours = parseInt(offsetMatch[1]);
                // 获取当前时间的 UTC 时间戳
                const utcTimestamp = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
                // 调整到目标时区
                const targetTimestamp = utcTimestamp + offsetHours * 60 * 60 * 1000;
                return new Date(targetTimestamp);
            }
        }
        return now;
    }
    
    /**
     * 设置时区
     * @param {string} timezone - 时区标识符
     * @returns {void}
     */
    function setTimezone(timezone) {
        currentTimezone = timezone;
        
        // 使用状态管理保存时区设置
        if (window.store) {
            store.setState({ currentTimezone: timezone });
        } else {
            localStorage.setItem('countdownTimezone', timezone);
        }
        
        // 重新渲染所有倒计时
        countdowns.forEach(countdown => {
            updateSingleCountdown(countdown);
        });
    }
    
    /**
     * 更新统计面板
     * @returns {void}
     */
    function updateStatistics() {
        try {
            const now = getCurrentTime();
            
            // 计算总计时项数
            const totalCountdowns = countdowns.length;
            document.getElementById('totalCountdowns').textContent = totalCountdowns;
            
            // 计算活跃计时数（倒计时未结束或正计时）
            let activeCountdowns = 0;
            let completedCountdowns = 0;
            let closestCountdown = null;
            let closestTime = Infinity;
            
            countdowns.forEach(countdown => {
                if (countdown.type === 'countdown') {
                    if (countdown.target > now) {
                        activeCountdowns++;
                        const timeUntil = countdown.target - now;
                        if (timeUntil < closestTime) {
                            closestTime = timeUntil;
                            closestCountdown = countdown;
                        }
                    } else {
                        completedCountdowns++;
                    }
                } else {
                    // 正计时始终活跃
                    activeCountdowns++;
                }
            });
            
            document.getElementById('activeCountdowns').textContent = activeCountdowns;
            document.getElementById('completedCountdowns').textContent = completedCountdowns;
            
            // 更新最近目标
            const closestCountdownElement = document.getElementById('closestCountdown');
            if (closestCountdown) {
                // 计算距离目标的时间
                const days = Math.floor(closestTime / (1000 * 60 * 60 * 24));
                const hours = Math.floor((closestTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                
                if (days > 0) {
                    closestCountdownElement.textContent = `${days}天${hours}时`;
                } else if (hours > 0) {
                    closestCountdownElement.textContent = `${hours}时`;
                } else {
                    const minutes = Math.floor((closestTime % (1000 * 60 * 60)) / (1000 * 60));
                    closestCountdownElement.textContent = `${minutes}分`;
                }
            } else {
                closestCountdownElement.textContent = '-';
            }
        } catch (error) {
            console.error('更新统计面板失败:', error);
        }
    }
    
    /**
     * 检查并发送提前提醒
     * @returns {void}
     */
    function checkReminders() {
        if (!reminderSettings.enabled) return;
        
        try {
            const now = getCurrentTime();
            countdowns.forEach(countdown => {
                if (countdown.type === 'countdown' && countdown.status === 'active') {
                    const timeUntil = countdown.target - now;
                    
                    // 检查是否已过目标时间
                    if (timeUntil <= 0) {
                        // 目标时间已过，检查是否需要提醒
                        if (!countdown.notified) {
                            sendReminders(countdown, 0);
                            countdown.notified = true;
                            saveData();
                        }
                        return;
                    }
                    
                    // 检查多级提醒规则
                    reminderSettings.reminderRules.forEach(rule => {
                        if (rule.enabled) {
                            const reminderTime = countdown.target - rule.time;
                            // 检查是否到达提醒时间（允许1秒的误差）
                            if (Math.abs(now.getTime() - reminderTime.getTime()) < 1000) {
                                // 检查是否已经提醒过这个规则
                                if (!countdown.reminderHistory) {
                                    countdown.reminderHistory = {};
                                }
                                if (!countdown.reminderHistory[rule.time]) {
                                    sendReminders(countdown, rule.time);
                                    countdown.reminderHistory[rule.time] = true;
                                    saveData();
                                }
                            }
                        }
                    });
                }
            });
        } catch (error) {
            console.error('检查提醒失败:', error);
        }
    }
    
    /**
     * 发送提醒
     * @param {Object} countdown - 倒计时对象
     * @param {number} reminderTime - 提醒时间（毫秒）
     * @returns {void}
     */
    function sendReminders(countdown, reminderTime) {
        try {
            // 计算剩余时间
            const now = getCurrentTime();
            const timeUntil = countdown.target - now;
            const minutesUntil = Math.ceil(Math.max(0, timeUntil) / 60000);
            
            // 构建提醒消息
            let message;
            if (reminderTime === 0) {
                message = `倒计时 "${countdown.name}" 已结束！`;
            } else if (reminderTime === 24 * 60 * 60 * 1000) {
                message = `距离 ${countdown.name} 还有 1 天！`;
            } else if (reminderTime === 60 * 60 * 1000) {
                message = `距离 ${countdown.name} 还有 1 小时！`;
            } else {
                message = `距离 ${countdown.name} 还有 ${minutesUntil} 分钟！`;
            }
            
            // 发送浏览器通知
            if (!reminderSettings.muteMode) {
                sendNotification(countdown.name, message);
                if (reminderSettings.soundEnabled) {
                    playNotificationSound();
                }
            }
            
            // 发送第三方提醒
            sendThirdPartyReminders(countdown, message);
        } catch (error) {
            console.error('发送提醒失败:', error);
        }
    }
    
    /**
     * 发送第三方提醒
     * @param {Object} countdown - 倒计时对象
     * @param {string} message - 提醒消息
     * @returns {void}
     */
    function sendThirdPartyReminders(countdown, message) {
        try {
            // 发送邮件提醒
            if (reminderSettings.thirdPartyReminders.email.enabled && reminderSettings.thirdPartyReminders.email.email) {
                // 这里只是模拟，实际需要后端服务
                console.log('发送邮件提醒:', reminderSettings.thirdPartyReminders.email.email, message);
                // 实际实现需要调用后端API
            }
            
            // 发送钉钉提醒
            if (reminderSettings.thirdPartyReminders.dingtalk.enabled && reminderSettings.thirdPartyReminders.dingtalk.webhook) {
                // 这里只是模拟，实际需要后端服务
                console.log('发送钉钉提醒:', reminderSettings.thirdPartyReminders.dingtalk.webhook, message);
                // 实际实现需要调用钉钉Webhook API
            }
            
            // 发送微信提醒
            if (reminderSettings.thirdPartyReminders.wechat.enabled && reminderSettings.thirdPartyReminders.wechat.appId) {
                // 这里只是模拟，实际需要后端服务
                console.log('发送微信提醒:', reminderSettings.thirdPartyReminders.wechat.appId, message);
                // 实际实现需要调用微信公众号API
            }
        } catch (error) {
            console.error('发送第三方提醒失败:', error);
        }
    }
    
    /**
     * 云同步功能
     * @returns {Promise<void>}
     */
    async function syncToCloud() {
        try {
            if (!cloudSyncSettings.enabled) {
                console.log('云同步未启用');
                return;
            }
            
            console.log('开始同步到云端...');
            
            // 准备同步数据
            const syncData = {
                countdowns: countdowns,
                countdownId: countdownId,
                currentTimezone: currentTimezone,
                reminderSettings: reminderSettings,
                timestamp: new Date().toISOString()
            };
            
            // 根据不同的同步服务执行不同的同步逻辑
            switch (cloudSyncSettings.provider) {
                case 'github':
                    await syncToGitHub(syncData);
                    break;
                case 'netlify':
                    await syncToNetlify(syncData);
                    break;
                case 'custom':
                    await syncToCustom(syncData);
                    break;
                default:
                    console.error('未知的同步服务');
                    return;
            }
            
            // 更新最后同步时间
            cloudSyncSettings.lastSync = new Date().toISOString();
            saveCloudSyncSettings();
            
            // 更新UI显示
            updateSyncStatus();
            
            console.log('同步到云端成功！');
        } catch (error) {
            console.error('同步到云端失败:', error);
            alert('同步失败，请检查配置后重试！');
        }
    }
    
    /**
     * 从云端同步
     * @returns {Promise<void>}
     */
    async function syncFromCloud() {
        try {
            if (!cloudSyncSettings.enabled) {
                console.log('云同步未启用');
                return;
            }
            
            console.log('开始从云端同步...');
            
            let syncData;
            
            // 根据不同的同步服务执行不同的同步逻辑
            switch (cloudSyncSettings.provider) {
                case 'github':
                    syncData = await syncFromGitHub();
                    break;
                case 'netlify':
                    syncData = await syncFromNetlify();
                    break;
                case 'custom':
                    syncData = await syncFromCustom();
                    break;
                default:
                    console.error('未知的同步服务');
                    return;
            }
            
            if (syncData) {
                // 验证同步数据
                if (validateConfig(syncData)) {
                    // 更新本地数据
                    countdowns = syncData.countdowns;
                    countdownId = syncData.countdownId || 0;
                    currentTimezone = syncData.currentTimezone || 'local';
                    reminderSettings = syncData.reminderSettings || reminderSettings;
                    
                    // 保存到本地存储
                    saveData();
                    localStorage.setItem('reminderSettings', JSON.stringify(reminderSettings));
                    
                    // 重新渲染
                    const countdownsList = document.getElementById('countdownsList');
                    if (countdownsList) {
                        countdownsList.innerHTML = '';
                        renderCountdownsList();
                    }
                    
                    // 更新统计面板
                    updateStatistics();
                    
                    // 更新最后同步时间
                    cloudSyncSettings.lastSync = new Date().toISOString();
                    saveCloudSyncSettings();
                    
                    // 更新UI显示
                    updateSyncStatus();
                    
                    console.log('从云端同步成功！');
                    alert('同步成功，数据已更新！');
                } else {
                    console.error('同步数据格式错误');
                    alert('同步数据格式错误，请检查云端数据！');
                }
            }
        } catch (error) {
            console.error('从云端同步失败:', error);
            alert('同步失败，请检查网络连接和配置！');
        }
    }
    
    /**
     * 同步到 GitHub Gist
     * @param {Object} data - 同步数据
     * @returns {Promise<void>}
     */
    async function syncToGitHub(data) {
        // 模拟实现，实际需要调用 GitHub API
        console.log('同步到 GitHub Gist:', data);
        // 实际实现需要：
        // 1. 使用 GitHub API 创建或更新 Gist
        // 2. 处理认证和错误
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟
    }
    
    /**
     * 从 GitHub Gist 同步
     * @returns {Promise<Object>}
     */
    async function syncFromGitHub() {
        // 模拟实现，实际需要调用 GitHub API
        console.log('从 GitHub Gist 同步');
        // 实际实现需要：
        // 1. 使用 GitHub API 获取 Gist 内容
        // 2. 处理认证和错误
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟
        return null; // 模拟返回数据
    }
    
    /**
     * 同步到 Netlify Functions
     * @param {Object} data - 同步数据
     * @returns {Promise<void>}
     */
    async function syncToNetlify(data) {
        // 模拟实现，实际需要调用 Netlify Functions
        console.log('同步到 Netlify Functions:', data);
        // 实际实现需要：
        // 1. 调用 Netlify Functions 端点
        // 2. 处理认证和错误
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟
    }
    
    /**
     * 从 Netlify Functions 同步
     * @returns {Promise<Object>}
     */
    async function syncFromNetlify() {
        // 模拟实现，实际需要调用 Netlify Functions
        console.log('从 Netlify Functions 同步');
        // 实际实现需要：
        // 1. 调用 Netlify Functions 端点获取数据
        // 2. 处理认证和错误
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟
        return null; // 模拟返回数据
    }
    
    /**
     * 同步到自定义后端
     * @param {Object} data - 同步数据
     * @returns {Promise<void>}
     */
    async function syncToCustom(data) {
        // 模拟实现，实际需要调用自定义后端API
        console.log('同步到自定义后端:', data);
        // 实际实现需要：
        // 1. 调用自定义后端API
        // 2. 处理认证和错误
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟
    }
    
    /**
     * 从自定义后端同步
     * @returns {Promise<Object>}
     */
    async function syncFromCustom() {
        // 模拟实现，实际需要调用自定义后端API
        console.log('从自定义后端同步');
        // 实际实现需要：
        // 1. 调用自定义后端API获取数据
        // 2. 处理认证和错误
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟
        return null; // 模拟返回数据
    }
    
    /**
     * 保存云同步设置
     * @returns {void}
     */
    function saveCloudSyncSettings() {
        try {
            localStorage.setItem('cloudSyncSettings', JSON.stringify(cloudSyncSettings));
        } catch (error) {
            console.error('保存云同步设置失败:', error);
        }
    }
    
    /**
     * 加载云同步设置
     * @returns {void}
     */
    function loadCloudSyncSettings() {
        try {
            const savedSettings = localStorage.getItem('cloudSyncSettings');
            if (savedSettings) {
                cloudSyncSettings = JSON.parse(savedSettings);
            }
        } catch (error) {
            console.error('加载云同步设置失败:', error);
        }
    }
    
    /**
     * 更新同步状态显示
     * @returns {void}
     */
    function updateSyncStatus() {
        try {
            const lastSyncTimeElement = document.getElementById('lastSyncTime');
            if (lastSyncTimeElement) {
                if (cloudSyncSettings.lastSync) {
                    const date = new Date(cloudSyncSettings.lastSync);
                    lastSyncTimeElement.textContent = date.toLocaleString();
                } else {
                    lastSyncTimeElement.textContent = '从未';
                }
            }
        } catch (error) {
            console.error('更新同步状态失败:', error);
        }
    }
    
    /**
     * 发送浏览器通知
     * @param {string} title - 通知标题
     * @param {string} message - 通知内容
     * @returns {void}
     */
    function sendNotification(title, message) {
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification(title, { body: message, icon: 'favicon.png' });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification(title, { body: message, icon: 'favicon.png' });
                    }
                });
            }
        }
    }
    
    /**
     * 播放通知音效
     * @returns {void}
     */
    function playNotificationSound() {
        // 简单的音效实现
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=');
            audio.play();
        } catch (error) {
            console.error('播放音效失败:', error);
        }
    }
    
    /**
     * 暂停计时
     * @param {number} id - 计时项ID
     * @returns {void}
     */
    function pauseCountdown(id) {
        try {
            const countdown = countdowns.find(c => c.id === id);
            if (!countdown) return;
            
            if (!countdown.paused) {
                countdown.paused = true;
                countdown.pausedAt = new Date();
                saveData();
                alert(window.i18n ? i18n.t('successPause') : `计时 "${countdown.name}" 已暂停！`);
            }
        } catch (error) {
            console.error('暂停计时失败:', error);
            alert(window.i18n ? i18n.t('errorStorage') : '暂停计时失败，请重试！');
        }
    }
    
    /**
     * 恢复计时
     * @param {number} id - 计时项ID
     * @returns {void}
     */
    function resumeCountdown(id) {
        try {
            const countdown = countdowns.find(c => c.id === id);
            if (!countdown) return;
            
            if (countdown.paused && countdown.pausedAt) {
                const pauseDuration = new Date() - countdown.pausedAt;
                if (countdown.type === 'countdown') {
                    countdown.target = new Date(countdown.target.getTime() + pauseDuration);
                } else {
                    countdown.target = new Date(countdown.target.getTime() - pauseDuration);
                }
                countdown.paused = false;
                countdown.pausedAt = null;
                saveData();
                alert(window.i18n ? i18n.t('successResume') : `计时 "${countdown.name}" 已恢复！`);
            }
        } catch (error) {
            console.error('恢复计时失败:', error);
            alert(window.i18n ? i18n.t('errorStorage') : '恢复计时失败，请重试！');
        }
    }
    
    /**
     * 切换置顶状态
     * @param {number} id - 计时项ID
     * @returns {void}
     */
    function togglePin(id) {
        try {
            const countdown = countdowns.find(c => c.id === id);
            if (!countdown) return;
            
            countdown.pinned = !countdown.pinned;
            saveData();
            
            // 重新渲染列表
            const countdownsList = document.getElementById('countdownsList');
            if (countdownsList) {
                countdownsList.innerHTML = '';
                renderCountdownsList();
            }
            
            alert(window.i18n ? 
                (countdown.pinned ? i18n.t('successPin') : i18n.t('successUnpin')) : 
                (countdown.pinned ? `计时 "${countdown.name}" 已置顶！` : `计时 "${countdown.name}" 已取消置顶！`)
            );
        } catch (error) {
            console.error('切换置顶状态失败:', error);
            alert(window.i18n ? i18n.t('errorStorage') : '操作失败，请重试！');
        }
    }
    
    /**
     * 切换归档状态
     * @param {number} id - 计时项ID
     * @returns {void}
     */
    function toggleArchive(id) {
        try {
            const countdown = countdowns.find(c => c.id === id);
            if (!countdown) return;
            
            countdown.status = countdown.status === 'archived' ? 'active' : 'archived';
            saveData();
            
            // 重新渲染列表
            const countdownsList = document.getElementById('countdownsList');
            if (countdownsList) {
                countdownsList.innerHTML = '';
                renderCountdownsList();
            }
            
            alert(window.i18n ? 
                (countdown.status === 'archived' ? i18n.t('successArchive') : i18n.t('successUnarchive')) : 
                (countdown.status === 'archived' ? `计时 "${countdown.name}" 已归档！` : `计时 "${countdown.name}" 已取消归档！`)
            );
        } catch (error) {
            console.error('切换归档状态失败:', error);
            alert(window.i18n ? i18n.t('errorStorage') : '操作失败，请重试！');
        }
    }
    
    /**
     * 切换隐藏状态
     * @param {number} id - 计时项ID
     * @returns {void}
     */
    function toggleHide(id) {
        try {
            const countdown = countdowns.find(c => c.id === id);
            if (!countdown) return;
            
            countdown.status = countdown.status === 'hidden' ? 'active' : 'hidden';
            saveData();
            
            // 重新渲染列表
            const countdownsList = document.getElementById('countdownsList');
            if (countdownsList) {
                countdownsList.innerHTML = '';
                renderCountdownsList();
            }
            
            alert(window.i18n ? 
                (countdown.status === 'hidden' ? i18n.t('successHide') : i18n.t('successShow')) : 
                (countdown.status === 'hidden' ? `计时 "${countdown.name}" 已隐藏！` : `计时 "${countdown.name}" 已显示！`)
            );
        } catch (error) {
            console.error('切换隐藏状态失败:', error);
            alert(window.i18n ? i18n.t('errorStorage') : '操作失败，请重试！');
        }
    }
    
    /**
     * 渲染倒计时列表（按置顶和状态排序）
     * @returns {void}
     */
    function renderCountdownsList() {
        try {
            const countdownsList = document.getElementById('countdownsList');
            if (!countdownsList) return;
            
            // 排序：置顶的在前，然后按状态和时间排序
            const sortedCountdowns = [...countdowns]
                .filter(c => c.status !== 'hidden') // 过滤隐藏的
                .sort((a, b) => {
                    // 置顶优先
                    if (a.pinned && !b.pinned) return -1;
                    if (!a.pinned && b.pinned) return 1;
                    
                    // 状态优先：active > archived
                    if (a.status === 'active' && b.status === 'archived') return -1;
                    if (a.status === 'archived' && b.status === 'active') return 1;
                    
                    // 时间排序：倒计时按目标时间升序，正计时按目标时间降序
                    if (a.type === 'countdown' && b.type === 'countdown') {
                        return a.target - b.target;
                    } else if (a.type === 'countup' && b.type === 'countup') {
                        return b.target - a.target;
                    }
                    
                    return 0;
                });
            
            // 检查是否需要使用虚拟列表
            if (sortedCountdowns.length > 10 && window.updateVirtualList) {
                // 使用虚拟列表
                countdownsList.style.position = 'relative';
                countdownsList.style.overflowY = 'auto';
                countdownsList.style.maxHeight = '800px'; // 可根据需要调整
                window.updateVirtualList(sortedCountdowns);
            } else {
                // 直接渲染所有项
                // 清空容器
                countdownsList.innerHTML = '';
                countdownsList.style.position = 'static';
                countdownsList.style.overflowY = 'visible';
                
                // 渲染排序后的倒计时
                sortedCountdowns.forEach(countdown => {
                    renderCountdown(countdown);
                });
            }
            
            checkEmptyCountdowns();
        } catch (error) {
            console.error('渲染倒计时列表失败:', error);
        }
    }
    

    
    // 分享倒计时
    function shareCountdown(id) {
        try {
            const countdown = countdowns.find(c => c.id === id);
            if (!countdown) {
                console.error('未找到指定计时项:', id);
                return;
            }
            
            if (window.share) {
                share.shareCountdown(countdown);
            } else {
                alert('分享功能暂不可用，请刷新页面重试！');
            }
        } catch (error) {
            console.error('分享计时失败:', error);
            alert('分享失败，请重试！');
        }
    }
    
    // 导出函数
    window.countdown = {
        addCountdown: addCountdown,
        deleteCountdown: deleteCountdown,
        editCountdown: editCountdown,
        shareCountdown: shareCountdown,
        checkEmptyCountdowns: checkEmptyCountdowns,
        updateSingleCountdown: updateSingleCountdown,
        updateCountdowns: updateCountdowns,
        checkCountdownEnd: checkCountdownEnd,
        countdowns: countdowns,
        countdownId: countdownId,
        saveData: saveData,
        loadData: loadData,
        exportConfig: exportConfig,
        importConfig: importConfig,
        clearAll: clearAll,
        setTimezone: setTimezone,
        checkReminders: checkReminders,
        pauseCountdown: pauseCountdown,
        resumeCountdown: resumeCountdown,
        togglePin: togglePin,
        toggleArchive: toggleArchive,
        toggleHide: toggleHide,
        // 云同步相关函数
        syncToCloud: syncToCloud,
        syncFromCloud: syncFromCloud,
        saveCloudSyncSettings: saveCloudSyncSettings,
        loadCloudSyncSettings: loadCloudSyncSettings,
        updateSyncStatus: updateSyncStatus,
        cloudSyncSettings: cloudSyncSettings,
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
                paused: false,
                pausedAt: null,
                notified: false,
                status: 'active',
                pinned: false
            };
            countdowns.push(testCountdown);
            renderCountdownsList();
            saveData();
            console.log('测试倒计时添加成功！');
        }
    };
})();