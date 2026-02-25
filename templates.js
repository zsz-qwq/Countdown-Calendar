// 快捷模板功能模块
const templates = {
  // 预设模板
  presets: {
    birthday: {
      name: '生日',
      type: 'countdown',
      timeUnit: 'all',
      icon: '🎂'
    },
    exam: {
      name: '考试',
      type: 'countdown',
      timeUnit: 'all',
      icon: '📚'
    },
    holiday: {
      name: '节日',
      type: 'countdown',
      timeUnit: 'all',
      icon: '🎉'
    },
    meeting: {
      name: '会议',
      type: 'countdown',
      timeUnit: 'all',
      icon: '📅'
    },
    project: {
      name: '项目截止',
      type: 'countdown',
      timeUnit: 'all',
      icon: '📋'
    },
    anniversary: {
      name: '纪念日',
      type: 'countup',
      timeUnit: 'all',
      icon: '💖'
    },
    graduation: {
      name: '毕业',
      type: 'countdown',
      timeUnit: 'all',
      icon: '🎓'
    },
    vacation: {
      name: '假期',
      type: 'countdown',
      timeUnit: 'all',
      icon: '🏖️'
    }
  },
  
  // 生成模板倒计时
  createFromTemplate(templateKey, customName, targetDate) {
    try {
      const template = this.presets[templateKey];
      if (!template) {
        console.error('无效的模板:', templateKey);
        return null;
      }
      
      // 创建倒计时对象
      const countdown = {
        id: Date.now(), // 使用时间戳作为唯一ID
        name: customName || template.name,
        target: targetDate,
        type: template.type,
        timeUnit: template.timeUnit,
        paused: false,
        pausedAt: null,
        notified: false
      };
      
      return countdown;
    } catch (error) {
      console.error('创建模板倒计时失败:', error);
      return null;
    }
  },
  
  // 渲染模板选择器
  renderTemplateSelector(containerId) {
    try {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error('容器不存在:', containerId);
        return;
      }
      
      // 清空容器
      container.innerHTML = '';
      
      // 创建模板标题
      const title = document.createElement('h3');
      title.textContent = window.i18n ? i18n.t('templates') : '快捷模板';
      title.style.marginBottom = '15px';
      title.style.fontSize = '1rem';
      container.appendChild(title);
      
      // 创建模板网格
      const templateGrid = document.createElement('div');
      templateGrid.style.display = 'grid';
      templateGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(80px, 1fr))';
      templateGrid.style.gap = '10px';
      container.appendChild(templateGrid);
      
      // 添加模板按钮
      Object.entries(this.presets).forEach(([key, template]) => {
        const templateBtn = document.createElement('button');
        templateBtn.className = 'template-btn';
        templateBtn.setAttribute('data-template', key);
        templateBtn.style.padding = '10px';
        templateBtn.style.border = '1px solid #ddd';
        templateBtn.style.borderRadius = '8px';
        templateBtn.style.background = '#f8f9fa';
        templateBtn.style.cursor = 'pointer';
        templateBtn.style.transition = 'all 0.3s ease';
        templateBtn.style.display = 'flex';
        templateBtn.style.flexDirection = 'column';
        templateBtn.style.alignItems = 'center';
        templateBtn.style.gap = '5px';
        
        // 添加图标
        const icon = document.createElement('div');
        icon.textContent = template.icon;
        icon.style.fontSize = '1.5rem';
        templateBtn.appendChild(icon);
        
        // 添加名称
        const name = document.createElement('div');
        name.textContent = window.i18n ? i18n.t(template.name) || template.name : template.name;
        name.style.fontSize = '0.8rem';
        name.style.textAlign = 'center';
        templateBtn.appendChild(name);
        
        // 添加悬停效果
        templateBtn.addEventListener('mouseenter', () => {
          templateBtn.style.background = '#e9ecef';
          templateBtn.style.transform = 'translateY(-2px)';
          templateBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        });
        
        templateBtn.addEventListener('mouseleave', () => {
          templateBtn.style.background = '#f8f9fa';
          templateBtn.style.transform = 'translateY(0)';
          templateBtn.style.boxShadow = 'none';
        });
        
        // 添加点击事件
        templateBtn.addEventListener('click', () => {
          this.selectTemplate(key);
        });
        
        templateGrid.appendChild(templateBtn);
      });
    } catch (error) {
      console.error('渲染模板选择器失败:', error);
    }
  },
  
  // 选择模板
  selectTemplate(templateKey) {
    try {
      const template = this.presets[templateKey];
      if (!template) {
        console.error('无效的模板:', templateKey);
        return;
      }
      
      // 提示用户输入名称和日期
      const customName = prompt(window.i18n ? `${i18n.t('enterName')} (${template.name})` : `请输入名称 (${template.name})`);
      if (customName === null) return;
      
      // 设置默认日期
      let defaultDate = new Date();
      if (template.type === 'countdown') {
        // 倒计时默认设置为7天后
        defaultDate.setDate(defaultDate.getDate() + 7);
      } else {
        // 正计时默认设置为7天前
        defaultDate.setDate(defaultDate.getDate() - 7);
      }
      
      // 格式化默认日期
      const year = defaultDate.getFullYear();
      const month = String(defaultDate.getMonth() + 1).padStart(2, '0');
      const day = String(defaultDate.getDate()).padStart(2, '0');
      const hours = String(defaultDate.getHours()).padStart(2, '0');
      const minutes = String(defaultDate.getMinutes()).padStart(2, '0');
      const seconds = String(defaultDate.getSeconds()).padStart(2, '0');
      const defaultDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      
      // 显示日期选择器
      const dateTimeStr = prompt(
        window.i18n ? `${i18n.t('enterDate')}\n${i18n.t('format')}: YYYY-MM-DDTHH:MM:SS` : `请输入日期时间\n格式: YYYY-MM-DDTHH:MM:SS`,
        defaultDateTime
      );
      
      if (dateTimeStr === null) return;
      
      // 验证日期
      const targetDate = new Date(dateTimeStr);
      if (isNaN(targetDate.getTime())) {
        alert(window.i18n ? i18n.t('errorDate') : '日期格式错误，请重新输入！');
        return;
      }
      
      // 创建倒计时
      const countdownObj = this.createFromTemplate(templateKey, customName || template.name, targetDate);
      if (countdownObj && window.countdown) {
        // 添加到倒计时列表
        countdown.countdowns.push(countdownObj);
        countdown.renderCountdown(countdownObj);
        countdown.checkEmptyCountdowns();
        countdown.saveData();
        
        // 启动更新循环
        if (window.updateLoop) {
          window.updateLoop.start();
        }
        
        alert(window.i18n ? i18n.t('successAdd') : '添加计时成功！');
      }
    } catch (error) {
      console.error('选择模板失败:', error);
      alert(window.i18n ? i18n.t('errorStorage') : '操作失败，请重试！');
    }
  }
};

// 导出模块
window.templates = templates;