(function () {
  var CP = window.CP, esc = CP.esc;
  CP.views = CP.views || {};

  var KIND = [
    ['party', '🏮 党的机构', '决策与管人：真正的权力中枢'],
    ['state', '🏛️ 国家机构', '执行与运营：政府这一侧'],
    ['military', '🎖️ 军队', '枪杆子'],
    ['npc', '🗳️ 人大', '立法与任免'],
    ['cppcc', '🍵 政协', '协商与统战'],
  ];

  CP.views.depts = function (el, params) {
    var focus = params && params[0];
    var fun = CP.isFun();
    el.innerHTML =
      '<div class="page-head"><h1>部门图鉴：这个部门是干嘛的？</h1>' +
      '<p class="muted">每个部门两种读法：<b>正经职能</b>（官方怎么说）和 <b>戏说解读</b>（网友怎么理解）。右上角切换模式会改变部门的显示名称。</p></div>' +
      '<div class="dept-quick">' +
        '<div class="panel tip"><b>一句话看懂「党政关系」</b><p>党的机构负责<b>定方向、管干部</b>，国家机构负责<b>执行</b>。所以中组部（党）管的干部，比人社部（政府）多得多；省委书记（党）排在省长（政府）前面。</p></div>' +
      '</div>' +
      KIND.map(function (k) {
        var list = CP.departments.filter(function (d) { return d.kind === k[0]; });
        if (!list.length) return '';
        return '<section class="section"><div class="section-head"><h2>' + k[1] + '</h2><span class="muted small">' + k[2] + '</span></div>' +
          '<div class="dept-grid">' + list.map(function (d) {
            var head = d.head ? CP.byId[d.head] : null;
            var mem = (d.members || []).map(function (id) { return CP.byId[id]; }).filter(Boolean);
            return '<article class="dept-card' + (focus === d.id ? ' focus' : '') + '" id="d-' + d.id + '">' +
              '<h3>' + esc(fun ? d.joke : d.name) + '</h3><div class="dept-alt muted small">' + esc(fun ? d.name : d.joke) + '</div>' +
              '<div class="dept-two"><div><span class="lbl">正经职能</span><p>' + esc(d.duty) + '</p></div>' +
              '<div><span class="lbl lbl-fun">戏说解读</span><p>' + esc(d.roast) + '</p></div></div>' +
              '<div class="chip-wrap">' + (head ? CP.ui.personChip(head, '一把手') : (d.headName ? '<span class="name-only">一把手：' + esc(d.headName) + '</span>' : '')) +
              mem.map(function (p) { return CP.ui.personChip(p); }).join('') + '</div>' +
              '</article>';
          }).join('') + '</div></section>';
      }).join('');
    if (focus) setTimeout(function () { var n = document.getElementById('d-' + focus); if (n) n.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
  };

  // ---------------- 更新公告 ----------------
  var TYPE = {
    major: ['大版本', 't-major'], new: ['上新', 't-new'], ban: ['下架', 't-ban'],
    move: ['调岗', 't-move'], buff: ['平衡性调整', 't-buff'], rip: ['纪念', 't-rip'],
  };
  var newsFilter = 'all';
  CP.views.news = function (el) {
    el.innerHTML =
      '<div class="page-head"><h1>版本更新公告</h1>' +
      '<p class="muted">把人事变动写成游戏补丁说明。v20.x = 二十届中央委员会的第 x 次全会。官方通报原文以新华社等权威发布为准。</p></div>' +
      '<div class="toolbar"><div class="seg" role="group" aria-label="类型">' +
        '<button data-t="all">全部</button>' + Object.keys(TYPE).map(function (k) { return '<button data-t="' + k + '">' + TYPE[k][0] + '</button>'; }).join('') +
      '</div></div>' +
      '<ol class="patch-list"></ol>';
    var ol = el.querySelector('.patch-list');
    function render() {
      el.querySelectorAll('[data-t]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-t') === newsFilter); });
      var lastYear = null;
      ol.innerHTML = CP.changelog.filter(function (c) { return newsFilter === 'all' || c.type === newsFilter; }).map(function (c) {
        var y = c.date.slice(0, 4), head = '';
        if (y !== lastYear) { head = '<li class="patch-year">' + y + '</li>'; lastYear = y; }
        var t = TYPE[c.type] || ['公告', ''];
        return head + '<li class="patch' + (c.future ? ' future' : '') + '">' +
          '<div class="patch-meta"><span class="ptype ' + t[1] + '">' + t[0] + '</span>' + (c.ver ? '<span class="pver">' + esc(c.ver) + '</span>' : '') + '<time>' + esc(c.date) + '</time></div>' +
          '<div class="patch-body"><h3>' + esc(c.title) + '</h3><p>' + esc(c.text) + '</p>' +
          (c.who && c.who.length ? '<div class="chip-wrap">' + c.who.map(function (id) { return CP.ui.personChip(id); }).join('') + '</div>' : '') +
          '</div></li>';
      }).join('');
    }
    el.querySelectorAll('[data-t]').forEach(function (b) { b.addEventListener('click', function () { newsFilter = b.getAttribute('data-t'); render(); }); });
    render();
  };
})();
