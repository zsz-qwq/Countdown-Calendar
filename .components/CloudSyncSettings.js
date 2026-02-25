class CloudSyncSettings {
    constructor() {
        this.settings = {
            enabled: false,
            provider: 'github',
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
            syncInterval: 3600000
        };
        this.loadSettings();
        this.initUI();
    }

    loadSettings() {
        if (window.store) {
            const state = store.getState();
            if (state.cloudSyncSettings) {
                this.settings = { ...this.settings, ...state.cloudSyncSettings };
            }
        }
    }

    saveSettings() {
        if (window.store) {
            store.setState({ cloudSyncSettings: this.settings });
        } else {
            localStorage.setItem('cloudSyncSettings', JSON.stringify(this.settings));
        }
    }

    initUI() {
        const syncSection = document.querySelector('.sync-section');
        if (!syncSection) return;

        // 创建云同步设置UI
        const settingsHTML = `
            <h3>云同步设置</h3>
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="syncEnabled" ${this.settings.enabled ? 'checked' : ''}>
                    启用云同步
                </label>
            </div>
            <div class="setting-item">
                <label>同步服务提供商：</label>
                <select id="syncProvider">
                    <option value="github" ${this.settings.provider === 'github' ? 'selected' : ''}>GitHub Gist</option>
                    <option value="netlify" ${this.settings.provider === 'netlify' ? 'selected' : ''}>Netlify</option>
                    <option value="custom" ${this.settings.provider === 'custom' ? 'selected' : ''}>自定义API</option>
                </select>
            </div>
            
            <!-- GitHub 设置 -->
            <div id="githubSettings" class="provider-settings" ${this.settings.provider === 'github' ? '' : 'style="display: none;"'}>
                <div class="setting-item">
                    <label>GitHub Token：</label>
                    <input type="password" id="githubToken" value="${this.settings.github.token}" placeholder="GitHub Personal Access Token">
                </div>
                <div class="setting-item">
                    <label>Gist ID：</label>
                    <input type="text" id="githubGistId" value="${this.settings.github.gistId}" placeholder="Gist ID">
                </div>
            </div>
            
            <!-- Netlify 设置 -->
            <div id="netlifySettings" class="provider-settings" ${this.settings.provider === 'netlify' ? '' : 'style="display: none;"'}>
                <div class="setting-item">
                    <label>API Endpoint：</label>
                    <input type="url" id="netlifyEndpoint" value="${this.settings.netlify.endpoint}" placeholder="Netlify Function URL">
                </div>
                <div class="setting-item">
                    <label>API Key：</label>
                    <input type="password" id="netlifyApiKey" value="${this.settings.netlify.apiKey}" placeholder="API Key">
                </div>
            </div>
            
            <!-- 自定义API设置 -->
            <div id="customSettings" class="provider-settings" ${this.settings.provider === 'custom' ? '' : 'style="display: none;"'}>
                <div class="setting-item">
                    <label>API Endpoint：</label>
                    <input type="url" id="customEndpoint" value="${this.settings.custom.endpoint}" placeholder="API URL">
                </div>
                <div class="setting-item">
                    <label>API Key：</label>
                    <input type="password" id="customApiKey" value="${this.settings.custom.apiKey}" placeholder="API Key">
                </div>
            </div>
            
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="autoSync" ${this.settings.autoSync ? 'checked' : ''}>
                    自动同步
                </label>
            </div>
            <div class="setting-item">
                <label>同步间隔（分钟）：</label>
                <input type="number" id="syncInterval" value="${this.settings.syncInterval / 60000}" min="1" max="1440">
            </div>
            <div class="setting-item">
                <button id="syncNow" class="btn">立即同步</button>
                <button id="saveSyncSettings" class="btn">保存设置</button>
            </div>
            <div class="sync-status">
                <p>上次同步：${this.settings.lastSync ? new Date(this.settings.lastSync).toLocaleString() : '从未'}</p>
            </div>
        `;

        syncSection.innerHTML = settingsHTML;
        this.bindEvents();
    }

    bindEvents() {
        // 启用/禁用同步
        document.getElementById('syncEnabled').addEventListener('change', (e) => {
            this.settings.enabled = e.target.checked;
        });

        // 服务提供商选择
        document.getElementById('syncProvider').addEventListener('change', (e) => {
            this.settings.provider = e.target.value;
            this.toggleProviderSettings();
        });

        // GitHub设置
        document.getElementById('githubToken').addEventListener('input', (e) => {
            this.settings.github.token = e.target.value;
        });
        document.getElementById('githubGistId').addEventListener('input', (e) => {
            this.settings.github.gistId = e.target.value;
        });

        // Netlify设置
        document.getElementById('netlifyEndpoint').addEventListener('input', (e) => {
            this.settings.netlify.endpoint = e.target.value;
        });
        document.getElementById('netlifyApiKey').addEventListener('input', (e) => {
            this.settings.netlify.apiKey = e.target.value;
        });

        // 自定义API设置
        document.getElementById('customEndpoint').addEventListener('input', (e) => {
            this.settings.custom.endpoint = e.target.value;
        });
        document.getElementById('customApiKey').addEventListener('input', (e) => {
            this.settings.custom.apiKey = e.target.value;
        });

        // 自动同步
        document.getElementById('autoSync').addEventListener('change', (e) => {
            this.settings.autoSync = e.target.checked;
        });

        // 同步间隔
        document.getElementById('syncInterval').addEventListener('input', (e) => {
            const minutes = parseInt(e.target.value) || 60;
            this.settings.syncInterval = minutes * 60000;
        });

        // 立即同步
        document.getElementById('syncNow').addEventListener('click', () => {
            this.syncNow();
        });

        // 保存设置
        document.getElementById('saveSyncSettings').addEventListener('click', () => {
            this.saveSettings();
            alert('云同步设置已保存！');
        });
    }

    toggleProviderSettings() {
        // 隐藏所有提供商设置
        document.querySelectorAll('.provider-settings').forEach(el => {
            el.style.display = 'none';
        });
        // 显示当前提供商设置
        document.getElementById(`${this.settings.provider}Settings`).style.display = 'block';
    }

    async syncNow() {
        if (!this.settings.enabled) {
            alert('请先启用云同步！');
            return;
        }

        try {
            // 这里只是模拟同步过程
            console.log('开始同步...');
            // 实际同步逻辑
            this.settings.lastSync = new Date().getTime();
            this.saveSettings();
            alert('同步成功！');
            // 更新UI
            this.initUI();
        } catch (error) {
            console.error('同步失败:', error);
            alert('同步失败，请检查设置！');
        }
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

window.CloudSyncSettings = CloudSyncSettings;
export default CloudSyncSettings;