self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
// 설치 조건을 채우는 빈 fetch 처리
self.addEventListener('fetch', () => {});

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data.json(); } catch (err) { d = { title: '현장 알림', body: e.data ? e.data.text() : '' }; }
  const url = './?t=' + encodeURIComponent(d.title || '') + '&b=' + encodeURIComponent(d.body || '');
  e.waitUntil(self.registration.showNotification(d.title || '현장 알림', {
    body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png', data: { url }
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL(e.notification.data.url, self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('navigate' in c) return c.navigate(url).then(w => w && w.focus()); }
    return self.clients.openWindow(url);
  }));
});
