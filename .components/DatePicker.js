class DatePicker {
    constructor(inputId, options = {}) {
        this.input = document.getElementById(inputId);
        this.options = {
            showShortcuts: false,
            onFocus: null,
            onBlur: null,
            ...options
        };
        this.init();
    }

    init() {
        if (!this.input) return;

        // 添加事件监听
        this.input.addEventListener('focus', () => {
            if (this.options.onFocus) {
                this.options.onFocus();
            }
            this.showShortcuts();
        });

        this.input.addEventListener('blur', () => {
            if (this.options.onBlur) {
                this.options.onBlur();
            }
            this.hideShortcuts();
        });

        // 设置默认值为当前时间
        if (!this.input.value) {
            this.setDefaultValue();
        }
    }

    setDefaultValue() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const defaultValue = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        this.input.value = defaultValue;
    }

    showShortcuts() {
        if (!this.options.showShortcuts) return;

        // 创建快捷方式容器
        let shortcutContainer = document.getElementById('datePickerShortcuts');
        if (!shortcutContainer) {
            shortcutContainer = document.createElement('div');
            shortcutContainer.id = 'datePickerShortcuts';
            shortcutContainer.style.cssText = `
                position: absolute;
                background: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                z-index: 1000;
                margin-top: 4px;
            `;

            // 添加快捷选项
            const shortcuts = [
                { label: '今天', days: 0 },
                { label: '明天', days: 1 },
                { label: '后天', days: 2 },
                { label: '一周后', days: 7 },
                { label: '一月后', days: 30 }
            ];

            shortcuts.forEach(shortcut => {
                const button = document.createElement('button');
                button.textContent = shortcut.label;
                button.style.cssText = `
                    display: block;
                    width: 100%;
                    text-align: left;
                    padding: 4px 8px;
                    margin: 2px 0;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    border-radius: 2px;
                `;
                button.addEventListener('mouseover', () => {
                    button.style.background = '#f0f0f0';
                });
                button.addEventListener('mouseout', () => {
                    button.style.background = 'transparent';
                });
                button.addEventListener('click', () => {
                    this.setDateFromDays(shortcut.days);
                });
                shortcutContainer.appendChild(button);
            });

            this.input.parentNode.appendChild(shortcutContainer);
            
            // 定位
            const rect = this.input.getBoundingClientRect();
            const parentRect = this.input.parentNode.getBoundingClientRect();
            shortcutContainer.style.left = `${rect.left - parentRect.left}px`;
            shortcutContainer.style.top = `${rect.bottom - parentRect.top}px`;
        }
        shortcutContainer.style.display = 'block';
    }

    hideShortcuts() {
        const shortcutContainer = document.getElementById('datePickerShortcuts');
        if (shortcutContainer) {
            shortcutContainer.style.display = 'none';
        }
    }

    setDateFromDays(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const value = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        this.input.value = value;
    }

    getValue() {
        return this.input ? this.input.value : '';
    }

    setValue(value) {
        if (this.input) {
            this.input.value = value;
        }
    }
}

window.DatePicker = DatePicker;
export default DatePicker;