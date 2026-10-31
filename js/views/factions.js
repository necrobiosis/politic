(function () {
  var CP = window.CP, esc = CP.esc;
  CP.views = CP.views || {};

  CP.views.factions = function (el, params) {
    var focus = params && params[0];
    var list = CP.factions.slice().sort(function (a, b) { return b.statusLevel - a.statusLevel || b.members.length - a.members.length; });
    var egoCandidates = CP.sortPeople(CP.people.filter(function (p) { return CP.linksOf(p.id).length >= 2; }));
    var egoId = (focus && CP.byId[focus]) ? focus : 'xijinping';

    el.innerHTML =
      '<div class="page-head"><h1>派系公会</h1>' +
      '<p class="muted">⚠️ 派系是境内外观察者与网络上的常用归类，<b>并非官方组织</b>，当事人也不会承认。一个人常同时挂多个标签。「版本强度」为本站戏说评价。</p></div>' +
      '<div class="faction-grid">' + list.map(function (f) {
        var active = CP.sortPeople(f.members.filter(function (p) { return p.isActive; }));
        var gone = CP.sortPeople(f.members.filter(function (p) { return !p.isActive; }));
        return '<article class="faction-card' + (focus === f.id ? ' focus' : '') + '" id="f-' + f.id + '" style="--c:' + f.color + '">' +
          '<header><span class="f-emoji" aria-hidden="true">' + f.emoji + '</span><div><h2>' + esc(f.name) + '</h2>' +
          '<div class="f-status"><span class="pips">' + pips(f.statusLevel, f.color) + '</span>' + esc(f.status) + '</div></div></header>' +
          '<p class="f-origin">' + esc(f.origin) + '</p>' +
          '<p class="f-roast">💬 ' + esc(f.roast) + '</p>' +
          (active.length ? '<div class="f-sec">在场成员 ' + active.length + '</div><div class="chip-wrap">' + active.map(function (p) { return CP.ui.personChip(p); }).join('') + '</div>' : '') +
          (gone.length ? '<div class="f-sec">已离场 ' + gone.length + '</div><div class="chip-wrap">' + gone.map(function (p) { return CP.ui.personChip(p, CP.STATUS[p.status].label); }).join('') + '</div>' : '') +
          '</article>';
      }).join('') + '</div>' +

      '<section class="section panel" id="ego">' +
        '<div class="section-head"><h2>🕸️ 羁绊关系图</h2>' +
        '<select class="select" aria-label="选择人物">' + egoCandidates.map(function (p) {
          return '<option value="' + p.id + '"' + (p.id === egoId ? ' selected' : '') + '>' + esc(p.name) + ' · ' + esc(p.short || '') + '</option>';
        }).join('') + '</select></div>' +
        '<p class="muted small">以所选人物为中心，展示其老部下、老领导、同窗、交接等关系。点击节点跳转人物档案。</p>' +
        '<div class="ego-wrap"></div>' +
      '</section>';

    var wrap = el.querySelector('.ego-wrap');
    function draw(id) { wrap.innerHTML = CP.ui.egoGraph(CP.byId[id]); }
    el.querySelector('#ego select').addEventListener('change', function (e) { draw(e.target.value); });
    draw(egoId);

    if (focus && CP.factionById[focus]) {
      setTimeout(function () { var n = document.getElementById('f-' + focus); if (n) n.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
    }

    function pips(n, c) { var s = ''; for (var i = 0; i < 5; i++) s += '<i style="' + (i < n ? 'background:' + c : '') + '"></i>'; return s; }
  };
})();
