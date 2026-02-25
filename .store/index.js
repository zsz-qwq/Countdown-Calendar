class Store {
    constructor() {
        this.state = {
            countdowns: [],
            countdownId: 0,
            language: 'zh',
            theme: 'light',
            currentTimezone: 'local',
            reminderSettings: {
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
            },
            cloudSyncSettings: {
                enabled: false,
                provider: 'github',
                github: { token: '', gistId: '' },
                netlify: { endpoint: '', apiKey: '' },
                custom: { endpoint: '', apiKey: '' },
                lastSync: null,
                autoSync: true,
                syncInterval: 3600000
            }
        };
        this.loadFromLocalStorage();
    }

    getState() {
        return { ...this.state };
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.saveToLocalStorage();
    }

    getNextCountdownId() {
        const newId = this.state.countdownId + 1;
        this.setState({ countdownId: newId });
        return newId;
    }

    setLanguage(language) {
        this.setState({ language });
    }

    setTheme(theme) {
        this.setState({ theme });
    }

    setTimezone(timezone) {
        this.setState({ currentTimezone: timezone });
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('countdownCalendarState', JSON.stringify(this.state));
        } catch (error) {
            console.error('保存状态到本地存储失败:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const savedState = localStorage.getItem('countdownCalendarState');
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                this.state = { ...this.state, ...parsedState };
            }
        } catch (error) {
            console.error('从本地存储加载状态失败:', error);
        }
    }
}

const store = new Store();
window.store = store;
export default store;