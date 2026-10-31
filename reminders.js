(function () {
  var C = window.Capacitor;
  var LN = C && C.Plugins && C.Plugins.LocalNotifications;
  var native = !!(C && C.isNativePlatform && C.isNativePlatform() && LN);
  var box = document.getElementById('remind');
  window.sleepRemind = function () {};
  if (!native || !box) return;

  var KEY = 'uyku-hatirlat';
  var cfg = { on: true, before: 10, closing: true, bedBefore: 30 };
  try { var s = JSON.parse(localStorage.getItem(KEY)); if (s) for (var k in s) cfg[k] = s[k]; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (e) {} }
  function toast(t) {
    var el = document.getElementById('toast'); if (!el) return;
    el.textContent = t; el.hidden = false;
    clearTimeout(toast.h); toast.h = setTimeout(function () { el.hidden = true; }, 3000);
  }
  function hhmm(ms) { var d = new Date(ms); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }

  var last = null, lastKey = '', channelOK = false;

  function ensureChannel() {
    if (channelOK) return Promise.resolve();
    return Promise.resolve(LN.createChannel({ id: 'uyku', name: 'Uyku hatırlatıcıları', description: 'Uyku vakti bildirimleri', importance: 4, visibility: 1, vibration: true }))
      .then(function () { channelOK = true; }, function () { channelOK = true; });
  }
  function ensurePermission() {
    return LN.checkPermissions().then(function (p) {
      if (p.display === 'granted') return true;
      return LN.requestPermissions().then(function (r) { return r.display === 'granted'; });
    });
  }
  function cancelAll() { lastKey = ''; return LN.cancel({ notifications: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 5 }] }).catch(function () {}); }

  function apply(nx) {
    last = nx;
    if (!cfg.on || !nx) { cancelAll(); return; }
    var now = Date.now(), items = [];
    var t1 = nx.ws - cfg.before * 60000;
    if (t1 > now) items.push({ id: 1, at: t1, title: nx.night ? 'Yatış vakti yaklaşıyor' : 'Uyku vakti yaklaşıyor',
      body: 'Uyku penceresi ' + hhmm(nx.ws) + '’te açılıyor. Ortamı hazırlayın.' });
    if (cfg.closing) {
      var t3 = nx.we - 15 * 60000;
      if (t3 > now) items.push({ id: 3, at: t3, title: 'Uyku penceresi kapanıyor',
        body: '15 dakika içinde kapanıyor (' + hhmm(nx.we) + '). Şimdi yatırmayı deneyin.' });
    }
    var who = nx.who || 'Bebeğiniz';
    if (cfg.closing && nx.we > now) items.push({ id: 5, at: nx.we, title: 'Uyku penceresi kapandı',
      body: who + ' yorulmuş olabilir. Şimdi yatırmayı deneyin ❤️' });
    if (nx.night) {
      var t2 = nx.bed - cfg.bedBefore * 60000;
      if (t2 > now) items.push({ id: 2, at: t2, title: 'Hedef yatışa ' + cfg.bedBefore + ' dk var',
        body: 'Hedef yatış saati ' + hhmm(nx.bed) + '. Akşam rutinini başlatın.' });
    }
    var key = items.map(function (i) { return i.id + ':' + i.at; }).join('|');
    if (key === lastKey) return;
    lastKey = key;
    cancelAll().then(function () { lastKey = key; });
    if (!items.length) return;
    ensureChannel().then(function () {
      return LN.schedule({ notifications: items.map(function (i) {
        return { id: i.id, title: i.title, body: i.body, channelId: 'uyku', schedule: { at: new Date(i.at), allowWhileIdle: true } };
      }) });
    }).catch(function () { lastKey = ''; });
  }
  window.sleepRemind = apply;

  // Uyku bağlama hatırlatıcısı: gündüz uykusunda belirli dakikada bebeğin yanına gitmeyi hatırlatır (id 4)
  var lastCheck = '';
  window.sleepCheck = function (c) {
    if (!cfg.on || !c || c.at <= Date.now()) {
      if (lastCheck !== 'none') { lastCheck = 'none'; LN.cancel({ notifications: [{ id: 4 }] }).catch(function () {}); }
      return;
    }
    var key = c.at + '|' + c.title;
    if (key === lastCheck) return;
    lastCheck = key;
    ensureChannel().then(function () {
      return LN.cancel({ notifications: [{ id: 4 }] }).catch(function () {});
    }).then(function () {
      return LN.schedule({ notifications: [{ id: 4, title: c.title, body: c.body, channelId: 'uyku', schedule: { at: new Date(c.at), allowWhileIdle: true } }] });
    }).catch(function () { lastCheck = ''; });
  };

  function chip(label, pressed, fn) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.textContent = label;
    b.setAttribute('aria-pressed', pressed ? 'true' : 'false'); b.onclick = fn; return b;
  }
  function row(title, opts, key) {
    var f = document.createElement('div'); f.className = 'field'; f.style.margin = '14px 0 0';
    var l = document.createElement('span'); l.className = 'lb'; l.textContent = title; f.appendChild(l);
    var c = document.createElement('div'); c.className = 'chips';
    opts.forEach(function (m) {
      c.appendChild(chip(m + ' dk', cfg[key] === m, function () { cfg[key] = m; save(); lastKey = ''; render(); apply(last); }));
    });
    f.appendChild(c); return f;
  }

  function render() {
    box.hidden = false; box.textContent = '';
    var h = document.createElement('h2'); h.style.marginBottom = '8px'; h.textContent = 'Hatırlatıcılar'; box.appendChild(h);
    var lab = document.createElement('label'); lab.className = 'chk';
    var cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = cfg.on;
    cb.onchange = function () {
      if (cb.checked) {
        ensurePermission().then(function (ok) {
          if (!ok) { cb.checked = false; cfg.on = false; save(); toast('Bildirim izni verilmedi. Telefon ayarlarından açın.'); return; }
          cfg.on = true; save(); lastKey = ''; apply(last); toast('Hatırlatıcılar açıldı');
        });
      } else { cfg.on = false; save(); cancelAll(); }
    };
    lab.appendChild(cb); lab.appendChild(document.createTextNode(' Uyku vakti bildirimleri')); box.appendChild(lab);
    var p = document.createElement('p'); p.className = 'sub'; p.style.cssText = 'font-size:13px;margin:6px 0 0';
    p.textContent = 'Son uyanış saatinden hesaplanır. Uyudu diye işaretleyince bekleyen bildirimler iptal olur.'; box.appendChild(p);
    box.appendChild(row('Uyku penceresinden önce', [5, 10, 15], 'before'));
    box.appendChild(row('Hedef yatıştan önce', [15, 30, 60], 'bedBefore'));
    var a = document.createElement('div'); a.className = 'actions'; a.style.marginTop = '14px';
    var t = document.createElement('button'); t.type = 'button'; t.className = 'btn sec small'; t.textContent = 'Deneme bildirimi (5 sn)';
    t.onclick = function () {
      ensurePermission().then(function (ok) {
        if (!ok) { toast('Bildirim izni verilmedi'); return; }
        return ensureChannel().then(function () {
          return LN.schedule({ notifications: [{ id: 9, title: 'Uyku Merdiveni', body: 'Bildirimler çalışıyor.', channelId: 'uyku', schedule: { at: new Date(Date.now() + 5000), allowWhileIdle: true } }] });
        }).then(function () { toast('5 saniye sonra bildirim gelecek. Ekranı kapatabilirsiniz.'); });
      }).catch(function () { toast('Bildirim kurulamadı'); });
    };
    a.appendChild(t); box.appendChild(a);
  }
  render();
  if (cfg.on) ensurePermission().catch(function () {});
})();
