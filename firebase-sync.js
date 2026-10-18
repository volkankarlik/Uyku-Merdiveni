import cfg from './config.js';

const FB = '10.12.2';
const KEY = 'uyku-merdiveni-aile';
const box = document.getElementById('sync');
let done;
const ready = new Promise(function (r) { done = r; });
window.sleepSync = { ready: ready };

function getCode() { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } }
function setCode(c) { try { localStorage.setItem(KEY, c); } catch (e) {} }
function clearCode() { try { localStorage.removeItem(KEY); } catch (e) {} }
function makeCode() {
  var a = 'abcdefghjkmnpqrstuvwxyz23456789', s = '', b = crypto.getRandomValues(new Uint8Array(12));
  for (var i = 0; i < b.length; i++) s += a[b[i] % a.length];
  return s.slice(0, 4) + '-' + s.slice(4, 8) + '-' + s.slice(8, 12);
}
function clean(v) { return String(v || '').toLowerCase().replace(/[^a-z0-9-]/g, ''); }
function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function toast(t) {
  var el = document.getElementById('toast'); if (!el) return;
  el.textContent = t; el.hidden = false;
  setTimeout(function () { el.hidden = true; }, 2500);
}

function head(t) { return '<h2 style="margin-bottom:8px">Ortak kayıt</h2>' + t; }

function showLocal(msg) {
  box.innerHTML = head('<p class="sub" style="margin:0">' + msg + '</p>');
}

function showSetup() {
  box.innerHTML = head(
    '<p class="sub" style="margin:0 0 12px">Siz ve eşiniz aynı kaydı görmek için aynı aile kodunu kullanır. Kod bir kez oluşturulur, diğer telefona yazılır.</p>' +
    '<div class="row2"><button class="btn" id="sy-new" type="button">Yeni kod oluştur</button></div>' +
    '<div class="field" style="margin:16px 0 0"><label for="sy-in">Eşimin verdiği kod</label>' +
    '<div class="row2" style="margin:0"><input id="sy-in" type="text" placeholder="abcd-efgh-jkmn" autocomplete="off" autocapitalize="off" spellcheck="false">' +
    '<button class="btn sec" id="sy-join" type="button">Bağlan</button></div></div>');
  document.getElementById('sy-new').onclick = function () { setCode(makeCode()); location.reload(); };
  document.getElementById('sy-join').onclick = function () {
    var v = clean(document.getElementById('sy-in').value);
    if (v.length < 12) { toast('Kod en az 12 karakter olmalı'); return; }
    setCode(v); location.reload();
  };
}

function showConnected(code, state) {
  var label = state === 'ok' ? '<span class="ok">Bağlı</span>' : '<span class="bad">' + esc(state) + '</span>';
  box.innerHTML = head(
    '<p class="state-line">' + label + '<span class="sub">' + (state === 'ok' ? 'Kayıtlar eşinizle ortak.' : '') + '</span></p>' +
    '<div class="code" id="sy-code">' + esc(code) + '</div>' +
    '<p class="sub" style="margin:8px 0 0;font-size:13px">Bu kodu eşinizin telefonuna yazın. Kodu bilen herkes kayıtları görür, başkasıyla paylaşmayın.</p>' +
    '<div class="row2"><button class="btn sec small" id="sy-copy" type="button">Kodu kopyala</button>' +
    '<button class="btn sec small" id="sy-change" type="button">Kodu değiştir</button></div>');
  document.getElementById('sy-copy').onclick = function () {
    var done = function () { toast('Kod kopyalandı'); };
    try { navigator.clipboard.writeText(code).then(done, function () { selectCode(); }); } catch (e) { selectCode(); }
  };
  document.getElementById('sy-change').onclick = function () { clearCode(); location.reload(); };
}
function selectCode() {
  var el = document.getElementById('sy-code'); if (!el) return;
  var r = document.createRange(); r.selectNodeContents(el);
  var s = getSelection(); s.removeAllRanges(); s.addRange(r);
  toast('Kodu seçili, kopyalayın');
}

(async function () {
  var configured = cfg && cfg.apiKey && cfg.projectId;
  if (!configured) {
    showLocal('Kayıtlar yalnızca bu telefonda tutuluyor. Eşinizle ortak kayıt için Firebase bilgilerini <b>config.js</b> dosyasına girin (README.md).');
    done(null); return;
  }
  var code = getCode();
  if (!code) { showSetup(); done(null); return; }
  try {
    var base = 'https://www.gstatic.com/firebasejs/' + FB + '/';
    var mods = await Promise.all([import(base + 'firebase-app.js'), import(base + 'firebase-auth.js'), import(base + 'firebase-firestore.js')]);
    var app = mods[0].initializeApp(cfg);
    var auth = mods[1].getAuth(app);
    var fs = mods[2];
    var db;
    try {
      db = fs.initializeFirestore(app, { localCache: fs.persistentLocalCache({ tabManager: fs.persistentMultipleTabManager() }) });
    } catch (e) { db = fs.getFirestore(app); }
    try {
      if (auth.authStateReady) await auth.authStateReady();
      if (!auth.currentUser) await mods[1].signInAnonymously(auth);
    } catch (e) { /* çevrimdışı: önbellekteki oturumla devam */ }
    var path = 'families/' + code + '/sleep';
    var colRef = fs.collection(db, path);
    var col = {
      add: function (data) { return fs.addDoc(colRef, data); },
      doc: function (id) {
        var ref = fs.doc(db, path, id);
        return { update: function (p) { return fs.updateDoc(ref, p); }, delete: function () { return fs.deleteDoc(ref); } };
      },
      orderBy: function (f, dir) {
        return { limit: function (n) {
          return { onSnapshot: function (next, err) {
            var q = fs.query(colRef, fs.orderBy(f, dir || 'asc'), fs.limit(n));
            return fs.onSnapshot(q, function (s) {
              showConnected(code, 'ok');
              next({ docs: s.docs.map(function (d) { return { id: d.id, data: function () { return d.data(); } }; }), empty: s.empty });
            }, function (e) {
              showConnected(code, e && e.code === 'permission-denied' ? 'İzin yok (Firestore kurallarını kontrol edin)' : 'Bağlanamadı');
              if (err) err(e);
            });
          } };
        } };
      }
    };
    showConnected(code, 'Bağlanıyor');
    done(col);
  } catch (e) {
    showConnected(code, 'Bağlanamadı, kayıtlar bu telefonda');
    done(null);
  }
})();
