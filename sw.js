var V = 'uyku-v1';
var SHELL = ['./', 'index.html', 'config.js', 'firebase-sync.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(V).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var u = new URL(e.request.url);
  if (u.origin === location.origin) {
    // kendi dosyalarımız: önce ağ, olmazsa önbellek
    e.respondWith(fetch(e.request).then(function (r) {
      var cp = r.clone(); caches.open(V).then(function (c) { c.put(e.request, cp); }); return r;
    }).catch(function () {
      return caches.match(e.request).then(function (r) { return r || caches.match('index.html'); });
    }));
  } else if (/(^|\.)gstatic\.com$|^fonts\.googleapis\.com$/.test(u.host)) {
    // Firebase kütüphanesi ve yazı tipleri: önbellekten hızlı, arkada yenile
    e.respondWith(caches.open(V).then(function (c) {
      return c.match(e.request).then(function (hit) {
        var net = fetch(e.request).then(function (r) { c.put(e.request, r.clone()); return r; }).catch(function () { return hit; });
        return hit || net;
      });
    }));
  }
});
