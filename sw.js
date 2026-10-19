var V = 'uyku-v2';
var SHELL = ['./', 'index.html', 'config.js', 'firebase-sync.js', 'player.js', 'sounds/beyaz.m4a', 'sounds/fan.m4a', 'sounds/yagmur.m4a', 'sounds/kalp.m4a', 'sounds/muzik.m4a', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
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
  if (u.origin === location.origin && /\/sounds\//.test(u.pathname)) {
    // sesler: önce önbellek; iPhone'un istediği Range (parça) isteklerine 206 ile yanıt ver
    e.respondWith(caches.open(V).then(function (c) {
      return c.match(u.href).then(function (hit) { return hit || fetch(u.href).then(function (r) { c.put(u.href, r.clone()); return r; }); });
    }).then(function (r) {
      var rg = e.request.headers.get('range');
      if (!rg) return r;
      return r.arrayBuffer().then(function (buf) {
        var m = /bytes=(\d*)-(\d*)/.exec(rg), n = buf.byteLength;
        var s = m && m[1] ? +m[1] : 0, en = m && m[2] ? Math.min(+m[2], n - 1) : n - 1;
        return new Response(buf.slice(s, en + 1), { status: 206, statusText: 'Partial Content', headers: {
          'Content-Type': r.headers.get('Content-Type') || 'audio/mp4', 'Content-Range': 'bytes ' + s + '-' + en + '/' + n,
          'Content-Length': String(en - s + 1), 'Accept-Ranges': 'bytes' } });
      });
    }));
  } else if (u.origin === location.origin) {
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
