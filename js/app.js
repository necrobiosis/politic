/* 路由、全局搜索、模式与主题切换 */
(function () {
  var CP = window.CP, esc = CP.esc;
  var ROUTES = { '': 'home', org: 'org', cards: 'cards', factions: 'factions', map: 'map', depts: 'depts', news: 'news', about: 'about', p: 'person' };
  var TITLES = { home: '', org: '架构图', cards: '卡牌图鉴', factions: '派系公会', map: '迁徙地图', depts: '部门图鉴', news: '更新公告', about: '关于', person: '' };
  var main = document.getElementById('main');

  function route() {
    var hash = location.hash.replace(/^#\/?/, '');
    var parts = hash.split('/').filter(Boolean).map(decodeURIComponent);
    var key = ROUTES[parts[0] || ''] ? parts[0] || '' : '';
    var view = ROUTES[key];
    var params = parts.slice(1);
    document.querySelectorAll('.nav a').forEach(function (a) {
      var target = a.getAttribute('href').replace(/^#\/?/, '');
      a.classList.toggle('active', target === key || (key === 'p' && target === 'cards'));
    });
    try {
      CP.views[view](main, params);
    } catch (err) {
      main.innerHTML = '<div class="page-head"><h1>页面出错了</h1><p class="muted">' + esc(err.message) + '</p></div>';
      if (window.console) console.error(err);
    }
    var t = TITLES[view];
    if (view === 'person' && CP.byId[params[0]]) t = CP.byId[params[0]].name;
    document.title = (t ? t + ' · ' : '') + '红墙图鉴';
    if (!/^map/.test(hash) || !params.length) window.scrollTo(0, 0);
    document.body.classList.remove('nav-open');
  }
  CP.rerender = route;
  window.addEventListener('hashchange', route);

  // ---------- 模式切换（戏说 / 正经） ----------
  var modeBtn = document.getElementById('mode-toggle');
  function paintMode() {
    modeBtn.textContent = CP.isFun() ? '🎭 戏说模式' : '📰 正经模式';
    modeBtn.setAttribute('aria-pressed', CP.isFun() ? 'true' : 'false');
    modeBtn.title = '点击切换到' + (CP.isFun() ? '正经' : '戏说') + '模式';
  }
  modeBtn.addEventListener('click', function () {
    CP.mode = CP.isFun() ? 'serious' : 'fun';
    CP.store.set('mode', CP.mode);
    paintMode();
    route();
    CP.ui.toast(CP.isFun() ? '已切换到戏说模式：部门显示为公司化名称' : '已切换到正经模式：显示官方名称');
  });
  paintMode();

  // ---------- 主题 ----------
  var themeBtn = document.getElementById('theme-toggle');
  var root = document.documentElement;
  var savedTheme = CP.store.get('theme', null);
  if (savedTheme) root.setAttribute('data-theme', savedTheme);
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function paintTheme() { themeBtn.textContent = isDark() ? '☀️' : '🌙'; themeBtn.setAttribute('aria-label', isDark() ? '切换到浅色' : '切换到深色'); }
  themeBtn.addEventListener('click', function () {
    var t = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', t); CP.store.set('theme', t); paintTheme();
  });
  paintTheme();

  // ---------- 移动端菜单 ----------
  document.getElementById('nav-toggle').addEventListener('click', function () { document.body.classList.toggle('nav-open'); });

  // ---------- 全局搜索 ----------
  var input = document.getElementById('global-search');
  var box = document.getElementById('search-results');
  var active = -1, results = [];
  function hrefOf(r) {
    return { person: '#/p/' + r.item.id, dept: '#/depts/' + r.item.id, faction: '#/factions/' + r.item.id, place: '#/map/' + r.item.code }[r.kind];
  }
  function renderResults() {
    if (!results.length) {
      box.innerHTML = input.value.trim() ? '<div class="sr-empty">没找到。试试姓名、拼音、外号、省份或部门名。</div>' : '';
      box.hidden = !input.value.trim();
      return;
    }
    box.hidden = false;
    box.innerHTML = results.map(function (r, i) {
      var label, sub, icon;
      if (r.kind === 'person') { icon = '<span class="sr-av">' + CP.avatar(r.item, { uid: 'sr' + i }) + '</span>'; label = r.item.name; sub = (r.item.short || '') + ' · ' + CP.RARITY[r.item.rarity].label; }
      else if (r.kind === 'dept') { icon = '<span class="sr-ic">🏛️</span>'; label = r.item.name; sub = r.item.joke; }
      else if (r.kind === 'faction') { icon = '<span class="sr-ic">' + r.item.emoji + '</span>'; label = r.item.name; sub = '派系 · ' + r.item.status; }
      else { icon = '<span class="sr-ic">📍</span>'; label = r.item.name; sub = '省级单位'; }
      return '<a class="sr-item' + (i === active ? ' on' : '') + '" href="' + hrefOf(r) + '" role="option">' + icon + '<span><b>' + esc(label) + '</b><small>' + esc(sub) + '</small></span></a>';
    }).join('');
  }
  input.addEventListener('input', function () { results = CP.search(input.value); active = -1; renderResults(); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { active = Math.min(results.length - 1, active + 1); renderResults(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { active = Math.max(0, active - 1); renderResults(); e.preventDefault(); }
    else if (e.key === 'Enter' && results.length) { location.hash = hrefOf(results[Math.max(0, active)]); close(); }
    else if (e.key === 'Escape') close();
  });
  function close() { box.hidden = true; input.value = ''; results = []; input.blur(); }
  box.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.search')) box.hidden = true; });
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT') { e.preventDefault(); input.focus(); }
  });

  document.getElementById('data-date').textContent = CP.DATA_DATE;
  route();
})();
