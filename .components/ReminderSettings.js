class ReminderSettings {
    constructor() {
        this.settings = {
            enabled: true,
            advanceTime: 60 * 60 * 1000,
            soundEnabled: true,
            repeatEnabled: false,
            repeatInterval: 5 * 60 * 1000,
            muteMode: false,
            thirdPartyReminders: {
                email: { enabled: false, email: '' },
                dingtalk: { enabled: false, webhook: '' },
                wechat: { enabled: false, appId: '' }
            },
            reminderRules: [
                { time: 24 * 60 * 60 * 1000, enabled: true },
                { time: 60 * 60 * 1000, enabled: true },
                { time: 0, enabled: true }
            ]
        };
        this.loadSettings();
        this.initUI();
    }

    loadSettings() {
        if (window.store) {
            const state = store.getState();
            if (state.reminderSettings) {
                this.settings = { ...this.settings, ...state.reminderSettings };
            }
        }
    }

    saveSettings() {
        if (window.store) {
            store.setState({ reminderSettings: this.settings });
        } else {
            localStorage.setItem('reminderSettings', JSON.stringify(this.settings));
        }
    }

    initUI() {
        const reminderSection = document.querySelector('.reminder-section');
        if (!reminderSection) return;

        // 创建提醒设置UI
        const settingsHTML = `
            <h3>提醒设置</h3>
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="reminderEnabled" ${this.settings.enabled ? 'checked' : ''}>
                    启用提醒
                </label>
            </div>
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="soundEnabled" ${this.settings.soundEnabled ? 'checked' : ''}>
                    启用声音
                </label>
            </div>
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="muteMode" ${this.settings.muteMode ? 'checked' : ''}>
                    全局静音
                </label>
            </div>
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="repeatEnabled" ${this.settings.repeatEnabled ? 'checked' : ''}>
                    重复提醒
                </label>
                <input type="number" id="repeatInterval" value="${this.settings.repeatInterval / 60000}" min="1" max="60" placeholder="分钟">
            </div>
            <div class="setting-item">
                <h4>提醒规则</h4>
                <div class="rule-item">
                    <label>
                        <input type="checkbox" class="rule-enabled" data-time="86400000" ${this.settings.reminderRules[0].enabled ? 'checked' : ''}>
                        提前1天
                    </label>
                </div>
                <div class="rule-item">
                    <label>
                        <input type="checkbox" class="rule-enabled" data-time="3600000" ${this.settings.reminderRules[1].enabled ? 'checked' : ''}>
                        提前1小时
                    </label>
                </div>
                <div class="rule-item">
                    <label>
                        <input type="checkbox" class="rule-enabled" data-time="0" ${this.settings.reminderRules[2].enabled ? 'checked' : ''}>
                        结束时
                    </label>
                </div>
            </div>
            <button id="saveReminderSettings" class="btn">保存设置</button>
        `;

        reminderSection.innerHTML = settingsHTML;
        this.bindEvents();
    }

    bindEvents() {
        // 提醒启用/禁用
        document.getElementById('reminderEnabled').addEventListener('change', (e) => {
            this.settings.enabled = e.target.checked;
        });

        // 声音启用/禁用
        document.getElementById('soundEnabled').addEventListener('change', (e) => {
            this.settings.soundEnabled = e.target.checked;
        });

        // 全局静音
        document.getElementById('muteMode').addEventListener('change', (e) => {
            this.settings.muteMode = e.target.checked;
        });

        // 重复提醒
        document.getElementById('repeatEnabled').addEventListener('change', (e) => {
            this.settings.repeatEnabled = e.target.checked;
        });

        // 重复间隔
        document.getElementById('repeatInterval').addEventListener('input', (e) => {
            const minutes = parseInt(e.target.value) || 5;
            this.settings.repeatInterval = minutes * 60000;
        });

        // 提醒规则
        document.querySelectorAll('.rule-enabled').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const time = parseInt(e.target.dataset.time);
                const rule = this.settings.reminderRules.find(r => r.time === time);
                if (rule) {
                    rule.enabled = e.target.checked;
                }
            });
        });

        // 保存设置
        document.getElementById('saveReminderSettings').addEventListener('click', () => {
            this.saveSettings();
            alert('提醒设置已保存！');
        });
    }

    getSettings() {
        return { ...this.settings };
    }

    setSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
        this.initUI();
    }
}

window.ReminderSettings = ReminderSettings;
export default ReminderSettings;