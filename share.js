// 计时分享功能模块
const share = {
  // 生成分享链接
  generateShareLink(countdown) {
    try {
      // 创建分享数据
      const shareData = {
        id: countdown.id,
        name: countdown.name,
        target: countdown.target.toISOString(),
        type: countdown.type,
        timeUnit: countdown.timeUnit
      };
      
      // 编码为 URL 参数
      const params = new URLSearchParams();
      params.set('share', btoa(JSON.stringify(shareData)));
      
      // 生成完整链接
      const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
      return shareUrl;
    } catch (error) {
      console.error('生成分享链接失败:', error);
      return null;
    }
  },
  
  // 生成分享图片
  async generateShareImage(countdown) {
    try {
      // 创建画布
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      
      // 绘制背景
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#8a9aff');
      gradient.addColorStop(1, '#667eea');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 绘制标题
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(countdown.name, canvas.width / 2, 80);
      
      // 计算时间差
      const now = new Date();
      let diff, label;
      if (countdown.type === 'countdown') {
        diff = countdown.target - now;
        label = window.i18n ? i18n.t('daysUntil') : '还有';
      } else {
        diff = now - countdown.target;
        label = window.i18n ? i18n.t('timeElapsedSince') : '已过';
      }
      
      // 计算时间组件
      const absDiff = Math.abs(diff);
      const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);
      
      // 绘制时间
      ctx.font = 'bold 48px Arial';
      let timeText;
      if (countdown.timeUnit === 'all' || countdown.timeUnit === 'day') {
        timeText = `${days} ${window.i18n ? i18n.t('days') : '天'}`;
        if (countdown.timeUnit === 'all') {
          timeText += ` ${hours} ${window.i18n ? i18n.t('hours') : '时'} ${minutes} ${window.i18n ? i18n.t('minutes') : '分'} ${seconds} ${window.i18n ? i18n.t('seconds') : '秒'}`;
        }
      } else {
        timeText = `${hours} ${window.i18n ? i18n.t('hours') : '时'} ${minutes} ${window.i18n ? i18n.t('minutes') : '分'} ${seconds} ${window.i18n ? i18n.t('seconds') : '秒'}`;
      }
      ctx.fillText(timeText, canvas.width / 2, 200);
      
      // 绘制标签
      ctx.font = '24px Arial';
      ctx.fillText(label, canvas.width / 2, 260);
      
      // 绘制目标日期
      const targetOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      const targetStr = countdown.target.toLocaleString(window.i18n && window.i18n.currentLanguage === 'zh' ? 'zh-CN' : 'en-US', targetOptions);
      ctx.font = '18px Arial';
      ctx.fillText(targetStr, canvas.width / 2, 320);
      
      // 绘制水印
      ctx.font = '14px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('Countdown Calendar', canvas.width / 2, 370);
      
      // 转换为图片 URL
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('生成分享图片失败:', error);
      return null;
    }
  },
  
  // 分享倒计时
  async shareCountdown(countdown) {
    try {
      // 生成分享链接
      const shareUrl = this.generateShareLink(countdown);
      
      // 检查是否支持 Web Share API
      if (navigator.share) {
        await navigator.share({
          title: countdown.name,
          text: window.i18n ? `${countdown.name} - ${i18n.t('countdown')}` : `${countdown.name} - 倒计时`,
          url: shareUrl
        });
      } else {
        //  fallback: 生成图片并提示用户保存
        const imageUrl = await this.generateShareImage(countdown);
        if (imageUrl) {
          // 创建临时链接并下载
          const link = document.createElement('a');
          link.href = imageUrl;
          link.download = `${countdown.name}-countdown.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // 同时复制链接到剪贴板
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(shareUrl);
            alert(window.i18n ? i18n.t('successShare') : '分享链接已复制到剪贴板！');
          }
        }
      }
    } catch (error) {
      console.error('分享失败:', error);
      // 忽略用户取消分享的错误
      if (error.name !== 'AbortError') {
        alert(window.i18n ? i18n.t('errorShare') : '分享失败，请重试！');
      }
    }
  },
  
  // 从分享链接加载倒计时
  loadSharedCountdown() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const shareParam = urlParams.get('share');
      
      if (shareParam) {
        // 解码分享数据
        const shareData = JSON.parse(atob(shareParam));
        
        // 创建倒计时对象
        const countdown = {
          id: Date.now(), // 使用时间戳作为唯一ID
          name: shareData.name,
          target: new Date(shareData.target),
          type: shareData.type,
          timeUnit: shareData.timeUnit,
          paused: false,
          pausedAt: null,
          notified: false
        };
        
        return countdown;
      }
      return null;
    } catch (error) {
      console.error('加载分享倒计时失败:', error);
      return null;
    }
  }
};

// 导出模块
window.share = share;