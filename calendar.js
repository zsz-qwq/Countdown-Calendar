(function() {
    // 当前显示的月份和年份
    let currentMonth;
    let currentYear;

    // 生成日历
    function generateCalendar(year, month) {
        const calendarGrid = document.querySelector('.calendar-grid');
        if (!calendarGrid) {
            console.error('日历网格元素未找到');
            return;
        }
        // 清空日历（保留星期标题）
        const days = calendarGrid.querySelectorAll('.day');
        days.forEach(day => day.remove());
        
        // 更新标题
        const calendarTitle = document.getElementById('calendarTitle');
        if (calendarTitle) {
            calendarTitle.textContent = `日历 ${year}年${month + 1}月`;
        }
        
        // 计算当月第一天是星期几
        const firstDay = new Date(year, month, 1);
        const startDay = firstDay.getDay();
        
        // 计算当月有多少天
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // 计算上月剩余天数
        const prevDays = new Date(year, month, 0).getDate();
        
        // 生成日历
        // 上月剩余天数
        for (let i = startDay - 1; i >= 0; i--) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day', 'other-month');
            dayElement.textContent = prevDays - i;
            calendarGrid.appendChild(dayElement);
        }
        
        // 当月天数
        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            dayElement.textContent = i;
            
            // 标记今天
            const today = new Date();
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayElement.classList.add('today');
            }
            
            // 添加点击事件
            dayElement.addEventListener('click', function() {
                const selectedDate = new Date(year, month, i);
                const currentTime = new Date(); // 获取当前时间
                // 生成包含秒的日期时间字符串
                const selYear = selectedDate.getFullYear();
                const selMonth = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const selDay = String(selectedDate.getDate()).padStart(2, '0');
                const selHours = String(currentTime.getHours()).padStart(2, '0');
                const selMinutes = String(currentTime.getMinutes()).padStart(2, '0');
                const selSeconds = String(currentTime.getSeconds()).padStart(2, '0');
                const dateStr = `${selYear}-${selMonth}-${selDay}T${selHours}:${selMinutes}:${selSeconds}`;
                const targetDateTime = document.getElementById('targetDateTime');
                if (targetDateTime) {
                    targetDateTime.value = dateStr;
                }
            });
            
            calendarGrid.appendChild(dayElement);
        }
        
        // 下月填充天数
        const remainingDays = 42 - (startDay + daysInMonth); // 6行7列共42个格子
        for (let i = 1; i <= remainingDays; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day', 'other-month');
            dayElement.textContent = i;
            calendarGrid.appendChild(dayElement);
        }
    }

    // 导航月份
    function navigateMonth(delta) {
        currentMonth += delta;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        
        generateCalendar(currentYear, currentMonth);
    }

    // 初始化
    function init() {
        const today = new Date();
        currentMonth = today.getMonth();
        currentYear = today.getFullYear();
    }

    // 导出函数和变量
    window.calendar = {
        generateCalendar: generateCalendar,
        navigateMonth: navigateMonth,
        currentMonth: currentMonth,
        currentYear: currentYear,
        init: init
    };
})();