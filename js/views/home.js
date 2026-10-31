(function () {
  var CP = window.CP, esc = CP.esc;
  CP.views = CP.views || {};

  CP.views.home = function (el) {
    var pb = CP.people.filter(function (p) { return p.isPB; });
    var psc = pb.filter(function (p) { return p.tier === 'psc'; });
    var out27 = psc.filter(function (p) { var s = CP.sevenEight(p); return s && s.code === 'out'; });
    var fallenPB = CP.people.filter(function (p) {
      return p.isFallen && p.wasTier === 'pb' && /^202[3-9]/.test(p.statusNote || '');
    });
    var cmcActive = ['xijinping'].concat(CP.deptById.cmc.members).filter(function (id) { return CP.byId[id] && CP.byId[id].isActive; });
    var latest = CP.changelog.filter(function (c) { return !c.future && c.type === 'major'; })[0];

    // 升迁跳板省：现任政治局成员曾在哪些省任职
    var counts = {};
    pb.forEach(function (p) {
      CP.places_of(p).forEach(function (code) {
        if (code === 'C' || code === 'FOREIGN') return;
        (counts[code] = counts[code] || []).push(p);
      });
    });
    var top = Object.keys(counts).sort(function (a, b) { return counts[b].length - counts[a].length; }).slice(0, 5);

    var lineup = CP.sortPeople(CP.people.filter(function (p) { return p.isActive && (p.tier === 'core' || p.tier === 'psc'); }));

    el.innerHTML =
      '<section class="hero">' +
        '<div class="hero-text">' +
          '<p class="eyebrow">非官方 · 娱乐科普 · 数据截至 ' + CP.DATA_DATE + '</p>' +
          '<h1>红墙图鉴</h1>' +
          '<p class="lead">把中国政治版图做成一套卡牌游戏：<b>谁在顶层、从哪来、去了哪、和谁是一伙、哪个部门管什么</b>——点一张卡就知道。</p>' +
          '<div class="hero-cta">' +
            '<a class="btn btn-primary" href="#/org">🏢 看公司架构图</a>' +
            '<a class="btn" href="#/cards">🃏 翻卡牌图鉴</a>' +
            '<a class="btn" href="#/cards/gacha">🎰 抽一张试试</a>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="kpis" aria-label="版图速读">' +
        kpi(pb.length, '现任政治局委员', '开局 24 席：3 人下架，1 人增补') +
        kpi(cmcActive.length + ' / 7', '军委在岗人数', '本届最难保住的工位') +
        kpi(fallenPB.length, '本届落马政治局委员', fallenPB.map(function (p) { return p.name; }).join('、')) +
        kpi(out27.length + ' / ' + (psc.length + 1), '2027 年「到点」常委', '按七上八下惯例；核心不受此限') +
      '</section>' +

      (latest ? '<section class="panel patch-hero">' +
        '<div class="patch-ver">' + esc(latest.ver || '') + '</div>' +
        '<div><p class="eyebrow">最新版本补丁 · ' + esc(latest.date) + '</p><h2>' + esc(latest.title) + '</h2><p>' + esc(latest.text) + '</p>' +
        '<a class="link" href="#/news">查看全部更新公告 →</a></div></section>' : '') +

      '<section class="section"><div class="section-head"><h2>本届「董事会常委」阵容</h2><a class="link" href="#/org">去架构图 →</a></div>' +
        '<p class="muted">点卡片翻面看履历；卡面数值纯属娱乐。</p>' +
        '<div class="card-row">' + lineup.map(function (p) { return CP.ui.card(p, { small: true }); }).join('') + '</div></section>' +

      '<section class="section two-col">' +
        '<div class="panel"><h3>🧭 升迁跳板省 Top 5</h3><p class="muted">现任 ' + pb.length + ' 名政治局成员中，有多少人曾在该省任职（不计求学）</p><ol class="rank-list">' +
          top.map(function (code) {
            var pl = CP.placeByCode[code];
            return '<li><a href="#/map/' + code + '"><b>' + esc(pl.name) + '</b></a><span class="bar"><span style="width:' + (counts[code].length / counts[top[0]].length * 100) + '%"></span></span><span class="num">' + counts[code].length + ' 人</span>' +
              '<small>' + counts[code].map(function (p) { return esc(p.name); }).join('、') + '</small></li>';
          }).join('') + '</ol></div>' +
        '<div class="panel"><h3>⚔️ 派系版本强度</h3><p class="muted">坊间标签，非官方分类</p><ul class="faction-meter">' +
          CP.factions.slice().sort(function (a, b) { return b.statusLevel - a.statusLevel; }).slice(0, 8).map(function (f) {
            return '<li><a href="#/factions/' + f.id + '">' + f.emoji + ' ' + esc(f.name) + '</a><span class="pips" aria-label="强度 ' + f.statusLevel + '/5">' + pips(f.statusLevel, f.color) + '</span><small>' + esc(f.status) + '</small></li>';
          }).join('') + '</ul><a class="link" href="#/factions">全部派系 →</a></div>' +
      '</section>' +

      '<section class="section"><h2>从哪里开始？</h2><div class="entry-grid">' +
        entry('#/org', '🏢', '架构图', '把党政军翻译成「中国有限公司」，一眼看懂谁管谁。') +
        entry('#/cards', '🃏', '卡牌图鉴', CP.people.length + ' 张人物卡：正面数值、背面履历，支持抽卡收集。') +
        entry('#/factions', '⚔️', '派系公会', '之江新军、福建帮、团派……谁是谁的老部下。') +
        entry('#/map', '🗺️', '迁徙地图', '各省现任书记，以及任意大佬的调动路线。') +
        entry('#/depts', '🏛️', '部门图鉴', '中组部、统战部、政法委……这个部门到底干嘛的？') +
        entry('#/news', '📜', '更新公告', '人事变动 = 游戏补丁：上新、下架、调岗、平衡性调整。') +
      '</div></section>';

    function kpi(v, label, sub) {
      return '<div class="kpi"><div class="kpi-v">' + esc(v) + '</div><div class="kpi-l">' + esc(label) + '</div><div class="kpi-s">' + esc(sub) + '</div></div>';
    }
    function entry(href, icon, t, d) {
      return '<a class="entry" href="' + href + '"><span class="entry-icon" aria-hidden="true">' + icon + '</span><b>' + t + '</b><span>' + d + '</span></a>';
    }
    function pips(n, c) {
      var s = ''; for (var i = 0; i < 5; i++) s += '<i style="' + (i < n ? 'background:' + c : '') + '"></i>'; return s;
    }
  };
})();
