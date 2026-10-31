(function () {
  var CP = window.CP, esc = CP.esc;
  CP.views = CP.views || {};

  var mode = 'sec'; // sec 现任书记 / heat 跳板热度 / route 迁徙路线
  var routeId = 'xijinping';

  CP.views.map = function (el, params) {
    var selected = params && params[0] && CP.placeByCode[params[0]] ? params[0] : null;
    var pb = CP.people.filter(function (p) { return p.isPB; });
    var heat = {};
    pb.forEach(function (p) { CP.places_of(p).forEach(function (c) { heat[c] = (heat[c] || 0) + 1; }); });
    var maxHeat = Math.max.apply(null, Object.keys(heat).filter(function (k) { return k !== 'C'; }).map(function (k) { return heat[k]; }));
    var routeList = CP.sortPeople(CP.people.filter(function (p) { return CP.ui.routeCodes(p).length >= 3; }));

    el.innerHTML =
      '<div class="page-head"><h1>迁徙地图</h1>' +
      '<p class="muted">方块地图只保留大致方位：每个省级单位一格，便于看清「谁在哪」和「从哪调到哪」。</p></div>' +
      '<div class="toolbar">' +
        '<div class="seg" role="group" aria-label="地图模式">' +
          '<button data-m="sec">现任书记</button><button data-m="heat">升迁跳板热度</button><button data-m="route">迁徙路线</button>' +
        '</div>' +
        '<select class="select route-select" aria-label="选择人物">' + routeList.map(function (p) {
          return '<option value="' + p.id + '">' + esc(p.name) + '（' + CP.ui.routeCodes(p).length + ' 站）</option>';
        }).join('') + '</select>' +
      '</div>' +
      '<div class="map-layout"><div class="map-box"></div><aside class="map-side panel"></aside></div>';

    var box = el.querySelector('.map-box'), side = el.querySelector('.map-side');
    var sel = el.querySelector('.route-select');
    sel.value = routeId;

    function heatColor(n) {
      if (!n) return null;
      var t = n / maxHeat;
      return 'color-mix(in srgb, var(--red) ' + Math.round(18 + t * 72) + '%, var(--surface))';
    }

    function render() {
      el.querySelectorAll('[data-m]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-m') === mode); });
      sel.style.display = mode === 'route' ? '' : 'none';
      var labels = {}, fills = {}, route = null;
      CP.places.forEach(function (pl) {
        if (pl.special) { labels[pl.code] = pl.code === 'C' ? '中南海' : '驻外'; return; }
        var s = CP.byId[pl.sec];
        if (mode === 'heat') { labels[pl.code] = heat[pl.code] ? heat[pl.code] + ' 人' : ''; fills[pl.code] = heatColor(heat[pl.code]); }
        else labels[pl.code] = s ? s.name : '';
        if (mode === 'sec' && s && s.isPB) fills[pl.code] = 'color-mix(in srgb, var(--gold) 45%, var(--surface))';
      });
      if (mode === 'route') {
        route = CP.ui.routeCodes(CP.byId[routeId]);
        var p = CP.byId[routeId];
        p.career.forEach(function (c) { labels[c[2]] = String(c[0]); });
      }
      box.innerHTML = CP.ui.tileMap({ labels: labels, fills: fills, route: route, selected: selected }) +
        '<div class="map-legend small muted">' +
          (mode === 'sec' ? '<span><i class="lg lg-gold"></i>政治局委员坐镇</span><span>格内为现任党委书记（港澳为特首）</span>' : '') +
          (mode === 'heat' ? '<span><i class="lg lg-red"></i>颜色越深 = 越多现任政治局成员曾在此任职</span>' : '') +
          (mode === 'route' ? '<span>数字 = 第几站；格内年份 = 到任年份</span>' : '') +
        '</div>';
      renderSide();
    }

    function renderSide() {
      if (mode === 'route' && !selected) {
        var p = CP.byId[routeId];
        side.innerHTML = '<h2>' + esc(p.name) + ' 的迁徙路线</h2>' + CP.ui.routeLine(p) +
          '<ol class="timeline compact">' + p.career.map(function (c) {
            var pl = CP.placeByCode[c[2]];
            return '<li><span class="tl-year">' + CP.yearRange(c) + '</span><span class="tl-place">' + esc(pl ? pl.name : c[2]) + '</span><span class="tl-role">' + (CP.isEdu(c) ? '🎓 ' : '') + esc(c[3]) + '</span></li>';
          }).join('') + '</ol>' +
          '<p><a class="link" href="#/p/' + p.id + '">查看 ' + esc(p.name) + ' 的完整档案 →</a></p>';
        return;
      }
      if (!selected) {
        side.innerHTML = '<h2>点一个省看看</h2><p class="muted">点击任意方块，查看现任书记，以及哪些大佬曾在这里任职。</p>' +
          '<h3 class="small-h">现任书记中由政治局委员担任的</h3><div class="chip-wrap">' +
          CP.places.filter(function (pl) { return pl.sec && CP.byId[pl.sec] && CP.byId[pl.sec].isPB; }).map(function (pl) { return CP.ui.personChip(CP.byId[pl.sec], pl.name); }).join('') + '</div>';
        return;
      }
      var pl = CP.placeByCode[selected];
      var sec = pl.sec ? CP.byId[pl.sec] : null;
      var alumni = CP.sortPeople(CP.peopleInPlace(selected).filter(function (p) { return p.id !== pl.sec; }));
      var alumniActive = alumni.filter(function (p) { return p.isActive; });
      var alumniGone = alumni.filter(function (p) { return !p.isActive; });
      side.innerHTML = '<h2>' + esc(pl.name) + '</h2>' +
        (pl.note ? '<p class="muted">' + esc(pl.note) + '</p>' : '') +
        (sec ? '<h3 class="small-h">' + (pl.sar ? '现任行政长官' : '现任党委书记') + '</h3>' + CP.ui.card(sec, { small: true }) : '') +
        '<h3 class="small-h">曾在此任职 · 在任 ' + alumniActive.length + ' 人</h3><div class="chip-wrap">' + (alumniActive.map(function (p) { return CP.ui.personChip(p); }).join('') || '<span class="muted small">暂无</span>') + '</div>' +
        (alumniGone.length ? '<h3 class="small-h">曾在此任职 · 已离场 ' + alumniGone.length + ' 人</h3><div class="chip-wrap">' + alumniGone.map(function (p) { return CP.ui.personChip(p, CP.STATUS[p.status].label); }).join('') + '</div>' : '') +
        '<p><button class="btn btn-sm" data-clear>清除选择</button></p>';
      var c = side.querySelector('[data-clear]');
      if (c) c.addEventListener('click', function () { selected = null; history.replaceState(null, '', '#/map'); render(); });
    }

    el.querySelectorAll('[data-m]').forEach(function (b) {
      b.addEventListener('click', function () { mode = b.getAttribute('data-m'); selected = null; render(); });
    });
    sel.addEventListener('change', function () { routeId = sel.value; selected = null; render(); });
    box.addEventListener('click', function (e) {
      var g = e.target.closest('.tile'); if (!g) return;
      selected = g.getAttribute('data-code');
      if (mode === 'route') mode = 'sec';
      history.replaceState(null, '', '#/map/' + selected);
      render();
      if (window.innerWidth < 900) side.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.classList.contains('tile')) e.target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    if (params && params[0] === 'route' && params[1] && CP.byId[params[1]]) { mode = 'route'; routeId = params[1]; sel.value = routeId; selected = null; }
    render();
  };
})();
