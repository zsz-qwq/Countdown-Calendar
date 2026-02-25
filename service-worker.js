// 缓存版本，用于更新缓存
const CACHE_VERSION = 'v1';
const CACHE_NAME = `countdown-calendar-${CACHE_VERSION}`;

// 需要缓存的资源列表
const staticAssets = [
  '.',
  'index.html',
  'style.css',
  'utils.js',
  'countdown.js',
  'calendar.js',
  'script.js',
  'favicon.png',
  'manifest.json'
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('缓存已打开');
        return cache.addAll(staticAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName !== CACHE_NAME;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 处理请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果缓存中有请求的资源，则返回缓存的资源
        if (response) {
          return response;
        }
        
        // 否则，发起网络请求
        return fetch(event.request)
          .then((response) => {
            // 检查响应是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 克隆响应，因为响应是一次性使用的
            const responseToCache = response.clone();
            
            // 将响应添加到缓存
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // 如果网络请求失败，尝试返回首页（离线模式）
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
          });
      })
  );
});

// 后台同步功能（用于离线添加倒计时）
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-countdowns') {
    event.waitUntil(syncCountdowns());
  }
});

// 同步倒计时数据
async function syncCountdowns() {
  // 这里可以实现与服务器同步数据的逻辑
  // 例如，将离线添加的倒计时上传到服务器
  console.log('同步倒计时数据');
  // 实际应用中，这里会有更多逻辑
}