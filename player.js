(function () {
  var box = document.getElementById('music');
  if (!box) return;

  var BUILTIN = [
    { id: 'beyaz', n: 'Beyaz gürültü', src: 'sounds/beyaz.m4a' },
    { id: 'fan', n: 'Fan', src: 'sounds/fan.m4a' },
    { id: 'yagmur', n: 'Yağmur', src: 'sounds/yagmur.m4a' },
    { id: 'kalp', n: 'Kalp atışı', src: 'sounds/kalp.m4a' },
    { id: 'muzik', n: 'Müzik kutusu', src: 'sounds/muzik.m4a' }
  ];
  var TIMERS = [{ m: 30, t: '30 dk' }, { m: 60, t: '1 saat' }, { m: 90, t: '1,5 saat' }, { m: 0, t: 'Sürekli' }];
  var LS = 'uyku-ses-ayar';

  function load() { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(LS, JSON.stringify({ sel: cur ? cur.key : '', vol: vol, timer: timerMin, wake: wantWake })); } catch (e) {} }
  function toast(t) {
    var el = document.getElementById('toast'); if (!el) return;
    el.textContent = t; el.hidden = false;
    clearTimeout(toast.h); toast.h = setTimeout(function () { el.hidden = true; }, 3000);
  }

  // ---- kendi dosyalar: IndexedDB ----
  var dbp;
  function db() {
    if (!dbp) dbp = new Promise(function (res, rej) {
      var r = indexedDB.open('uyku-ses', 1);
      r.onupgradeneeded = function () { r.result.createObjectStore('files', { keyPath: 'id', autoIncrement: true }); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
    return dbp;
  }
  function tx(mode, fn) {
    return db().then(function (d) {
      return new Promise(function (res, rej) {
        var t = d.transaction('files', mode), out = fn(t.objectStore('files'));
        t.oncomplete = function () { res(out && out.result); };
        t.onerror = t.onabort = function () { rej(t.error); };
      });
    });
  }
  function listFiles() { return tx('readonly', function (s) { return s.getAll(); }); }
  function addFile(rec) { return tx('readwrite', function (s) { return s.add(rec); }); }
  function delFile(id) { return tx('readwrite', function (s) { return s.delete(id); }); }

  // ---- durum ----
  var saved = load();
  var vol = typeof saved.vol === 'number' ? saved.vol : 0.6;
  var timerMin = typeof saved.timer === 'number' ? saved.timer : 60;
  var wantWake = !!saved.wake;
  var files = [];
  var cur = null;          // {key, n, src | blob}
  var loadedKey = '';
  var objUrl = '';
  var playing = false;
  var endAt = 0;
  var wakeLock = null;

  var audio = document.createElement('audio');
  audio.loop = true; audio.preload = 'auto'; audio.setAttribute('playsinline', '');
  box.appendChild(audio);

  // iPhone ses seviyesini koddan değiştirtmez; bunu anla
  var volOK = (function () { try { audio.volume = 0.5; return audio.volume === 0.5; } catch (e) { return false; } })();

  box.innerHTML =
    '<h2 style="margin-bottom:8px">Uyku sesi</h2>' +
    '<div class="chips" id="m-b"></div>' +
    '<p class="sub" style="margin:14px 0 6px;font-size:13px">Kendi dosyalarım (mp3, m4a, wav…)</p>' +
    '<div class="chips" id="m-u"></div>' +
    '<div class="actions" style="margin-top:10px"><button class="btn sec small" id="m-add" type="button">Dosya ekle</button>' +
    '<input id="m-file" type="file" accept="audio/*,.mp3,.m4a,.aac,.wav,.ogg,.flac" multiple hidden></div>' +
    '<div class="actions"><button class="btn" id="m-play" type="button">Çal</button></div>' +
    '<div class="field" id="m-volf" style="margin:14px 0 0"><label for="m-vol">Ses seviyesi</label><input id="m-vol" type="range" min="0" max="100" step="1"></div>' +
    '<div class="field" style="margin:14px 0 0"><span class="lb">Kapanma süresi</span><div class="chips" id="m-t"></div><p class="sub" id="m-left" style="font-size:13px;margin:0"></p></div>' +
    '<label class="chk" id="m-wakel" hidden><input type="checkbox" id="m-wake"> Ekran kendiliğinden kapanmasın</label>' +
    '<p class="sub" id="m-note" style="font-size:13px;margin:12px 0 0"></p>';
  box.appendChild(audio);

  var $ = function (id) { return document.getElementById(id); };
  $('m-note').textContent = 'Başlattıktan sonra ekranı kilitleyebilirsiniz. Android’de ses devam eder. iPhone’da ana ekrana eklenmiş uygulamadan açarsanız genelde devam eder; kesilirse “Ekran kendiliğinden kapanmasın” kutusunu işaretleyip ekranı açık bırakın.';
  if (!volOK) $('m-volf').hidden = true;
  if ('wakeLock' in navigator) $('m-wakel').hidden = false;
  $('m-vol').value = Math.round(vol * 100);
  $('m-wake').checked = wantWake;

  function chip(label, pressed, onclick, extra) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.textContent = label;
    b.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    b.onclick = onclick;
    return b;
  }

  function render() {
    var bb = $('m-b'), ub = $('m-u'), tb = $('m-t');
    bb.textContent = ''; ub.textContent = ''; tb.textContent = '';
    BUILTIN.forEach(function (s) {
      bb.appendChild(chip(s.n, cur && cur.key === 'b:' + s.id, function () { select({ key: 'b:' + s.id, n: s.n, src: s.src }); }));
    });
    if (!files.length) {
      var p = document.createElement('span'); p.className = 'sub'; p.style.fontSize = '13px'; p.textContent = 'Henüz dosya eklenmedi.'; ub.appendChild(p);
    }
    files.forEach(function (f) {
      var w = document.createElement('span'); w.className = 'uchip';
      var key = 'u:' + f.id;
      var c = chip(f.name.replace(/\.[^.]+$/, ''), cur && cur.key === key, function () { select({ key: key, n: f.name.replace(/\.[^.]+$/, ''), blob: f.blob }); });
      var x = document.createElement('button'); x.type = 'button'; x.className = 'chip x'; x.textContent = '×'; x.setAttribute('aria-label', f.name + ' dosyasını sil');
      x.onclick = function () {
        if (!confirm('“' + f.name + '” silinsin mi?')) return;
        if (cur && cur.key === key) stop();
        delFile(f.id).then(refreshFiles, function () { toast('Silinemedi'); });
      };
      w.appendChild(c); w.appendChild(x); ub.appendChild(w);
    });
    TIMERS.forEach(function (t) {
      tb.appendChild(chip(t.t, timerMin === t.m, function () { timerMin = t.m; save(); if (playing) armTimer(); render(); }));
    });
    $('m-play').textContent = playing ? 'Durdur' : 'Çal';
  }

  function refreshFiles() {
    return listFiles().then(function (r) {
      files = r || [];
      if (cur && cur.key.charAt(0) === 'u' && !files.some(function (f) { return 'u:' + f.id === cur.key; })) cur = null;
      if (!cur && saved.sel && saved.sel.charAt(0) === 'u') {
        var f = files.filter(function (x) { return 'u:' + x.id === saved.sel; })[0];
        if (f) cur = { key: saved.sel, n: f.name.replace(/\.[^.]+$/, ''), blob: f.blob };
      }
      render();
    }, function () { render(); });
  }

  function select(item) {
    cur = item; save();
    if (playing) start(); else render();
  }

  function setSource() {
    if (!cur || loadedKey === cur.key) return;
    if (objUrl) { URL.revokeObjectURL(objUrl); objUrl = ''; }
    if (cur.blob) { objUrl = URL.createObjectURL(cur.blob); audio.src = objUrl; } else { audio.src = cur.src; }
    loadedKey = cur.key;
  }

  function start() {
    if (!cur) cur = { key: 'b:' + BUILTIN[0].id, n: BUILTIN[0].n, src: BUILTIN[0].src };
    setSource();
    if (volOK) audio.volume = vol;
    var p = audio.play();
    playing = true; render(); armTimer(); media(); wake();
    if (p && p.catch) p.catch(function () { playing = false; render(); toast('Çalınamadı. Dosya bu telefonda desteklenmiyor olabilir.'); });
  }

  function stop() {
    playing = false; endAt = 0; audio.pause();
    if (volOK) audio.volume = vol;
    $('m-left').textContent = '';
    release();
    if ('mediaSession' in navigator) { try { navigator.mediaSession.playbackState = 'paused'; } catch (e) {} }
    render();
  }

  function armTimer() { endAt = timerMin ? Date.now() + timerMin * 60000 : 0; tick(); }

  function tick() {
    if (!playing) return;
    if (!endAt) { $('m-left').textContent = ''; return; }
    var left = endAt - Date.now();
    if (left <= 0) { stop(); toast('Süre doldu, ses kapandı'); return; }
    if (volOK && left < 12000) audio.volume = Math.max(0, vol * left / 12000);
    var m = Math.ceil(left / 60000);
    $('m-left').textContent = m + ' dk sonra kapanacak';
  }
  setInterval(tick, 1000);
  audio.addEventListener('timeupdate', tick);

  audio.addEventListener('error', function () {
    if (!loadedKey) return;
    playing = false; render(); toast('Bu dosya çalınamadı. mp3 ya da m4a deneyin.');
  });
  // sistem (kilit ekranı, kulaklık) durdurduysa düğmeyi uydur
  audio.addEventListener('pause', function () { if (playing && !audio.ended && document.visibilityState === 'visible') { playing = false; render(); } });

  function media() {
    if (!('mediaSession' in navigator) || !cur) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({ title: cur.n, artist: 'Uyku Merdiveni', artwork: [{ src: 'icon-512.png', sizes: '512x512', type: 'image/png' }] });
      navigator.mediaSession.playbackState = 'playing';
      navigator.mediaSession.setActionHandler('play', function () { start(); });
      navigator.mediaSession.setActionHandler('pause', function () { stop(); });
      navigator.mediaSession.setActionHandler('stop', function () { stop(); });
    } catch (e) {}
  }

  function wake() {
    if (!wantWake || !playing || !('wakeLock' in navigator) || wakeLock) return;
    navigator.wakeLock.request('screen').then(function (l) {
      wakeLock = l; l.addEventListener('release', function () { wakeLock = null; });
    }, function () {});
  }
  function release() { if (wakeLock) { try { wakeLock.release(); } catch (e) {} wakeLock = null; } }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') wake(); });

  // ---- olaylar ----
  $('m-play').onclick = function () { playing ? stop() : start(); };
  $('m-vol').oninput = function () { vol = this.value / 100; if (volOK) audio.volume = vol; save(); };
  $('m-wake').onchange = function () { wantWake = this.checked; save(); wantWake ? wake() : release(); };
  $('m-add').onclick = function () { $('m-file').click(); };
  $('m-file').onchange = function () {
    var list = Array.prototype.slice.call(this.files || []); this.value = '';
    if (!list.length) return;
    var ok = list.filter(function (f) { return /^audio\//.test(f.type) || /\.(mp3|m4a|aac|wav|ogg|flac|opus)$/i.test(f.name); });
    if (ok.length < list.length) toast('Ses olmayan dosyalar atlandı');
    var chain = Promise.resolve();
    ok.forEach(function (f) { chain = chain.then(function () { return addFile({ name: f.name, type: f.type, size: f.size, blob: f, added: Date.now() }); }); });
    chain.then(function () {
      if (ok.length) toast(ok.length + ' dosya eklendi');
      try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
      return refreshFiles();
    }, function () { toast('Dosya kaydedilemedi (yer dolmuş olabilir)'); });
  };

  // ilk seçim
  if (saved.sel && saved.sel.indexOf('b:') === 0) {
    var b = BUILTIN.filter(function (s) { return 'b:' + s.id === saved.sel; })[0];
    if (b) cur = { key: saved.sel, n: b.n, src: b.src };
  }
  render();
  refreshFiles();
})();
