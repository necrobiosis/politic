(function () {
  var CP = window.CP, esc = CP.esc;
  CP.views = CP.views || {};

  CP.views.person = function (el, params) {
    var p = CP.byId[params[0]];
    if (!p) { el.innerHTML = '<div class="page-head"><h1>查无此人</h1><p class="muted">可能已被「下架」，也可能是还没录入。<a class="link" href="#/cards">回到卡牌图鉴</a></p></div>'; return; }
    CP.collection.add(p.id);
    var se = CP.sevenEight(p);
    var links = CP.linksOf(p.id);
    var depts = CP.deptsOf(p.id);
    var patches = CP.patchesOf(p.id);
    var b = CP.parseBorn(p);
    var ordered = CP.sortPeople(CP.people);
    var i = ordered.indexOf(p), prev = ordered[i - 1], next = ordered[i + 1];
    var wasR = p.wasTier ? { core: 'UR', psc: 'SSR', pb: 'SR', state: 'R', prov: 'R' }[p.wasTier] : null;

    el.innerHTML =
      '<nav class="crumbs small"><a href="#/cards">卡牌图鉴</a> / ' + esc(p.name) + '</nav>' +
      '<div class="person-page">' +
        '<div class="pp-card">' + CP.ui.card(p, { uid: 'pp' }) + '<p class="muted small center">点击卡片翻面</p></div>' +
        '<div class="pp-main">' +
          '<div class="pp-badges">' + CP.ui.rarityBadge(p) + CP.ui.statusBadge(p) + (wasR ? '<span class="muted small">下架前：' + wasR + ' 卡</span>' : '') + '</div>' +
          '<h1 class="pp-name">' + esc(p.name) + ' <small>' + esc(p.py || '') + '</small></h1>' +
          '<p class="pp-title">' + esc(p.title) + '</p>' +
          (p.joke ? '<p class="pp-joke">🎭 戏称：' + esc(p.joke) + '</p>' : '') +
          (p.statusNote ? '<div class="alert">📌 ' + esc(p.statusNote) + '</div>' : '') +
          '<p class="pp-bio">' + esc(p.bio || '') + '</p>' +
          '<div class="pp-meta small">' +
            (b ? '<span>出生：' + b.y + (String(p.born).length > 4 ? ' 年 ' + b.m + ' 月' : ' 年') + '</span>' : '') +
            (p.birthplace ? '<span>籍贯/出生地：' + esc(p.birthplace) + '</span>' : '') +
            (p.died ? '<span>逝世：' + esc(p.died) + '</span>' : (CP.ageNow(p) ? '<span>现年约 ' + CP.ageNow(p) + ' 岁</span>' : '')) +
          '</div>' +
          '<div class="pp-stats">' +
            CP.ui.statBar('攻击力', '⚔️', p.atk, 100) +
            CP.ui.statBar('防御力', '🛡️', p.def, 100, p.isFallen ? '<small>（已破防）</small>' : '') +
            CP.ui.statBar('迁徙值', '🧭', p.mov, 10) +
            (se ? '<div class="se-box se-' + se.code + '">⏳ <b>七上八下倒计时</b>：2027 年二十一大时约 <b>' + se.age + '</b> 岁 → ' + se.label + '</div>' : '') +
          '</div>' +
          '<div class="pp-factions">' + (p.factions.length ? p.factions.map(function (f) { return CP.ui.factionChip(f); }).join('') + '<span class="muted small">（坊间标签）</span>' : '<span class="muted small">无明显派系标签</span>') + '</div>' +
        '</div>' +
      '</div>' +

      '<section class="section two-col">' +
        '<div class="panel"><h2>📍 履历时间线</h2>' +
          (p.early ? '<p class="muted small">早年：' + esc(p.early) + '</p>' : '') +
          '<ol class="timeline">' + p.career.map(function (c) {
            var pl = CP.placeByCode[c[2]];
            return '<li class="' + (c[1] === null ? 'now' : '') + '"><span class="tl-year">' + CP.yearRange(c) + '</span>' +
              '<span class="tl-place"><a href="#/map/' + c[2] + '">' + esc(pl ? pl.name : c[2]) + '</a></span><span class="tl-role">' + (CP.isEdu(c) ? '🎓 ' : '') + esc(c[3]) + '</span></li>';
          }).join('') + '</ol></div>' +
        '<div class="panel"><h2>🧭 迁徙路线</h2>' + CP.ui.routeLine(p) +
          '<div class="mini-map">' + CP.ui.tileMap({ route: CP.ui.routeCodes(p), labels: {} }) + '</div>' +
          '<p class="small"><a class="link" href="#/map/route/' + p.id + '">在大地图上查看 →</a></p></div>' +
      '</section>' +

      ((p.skills.length || p.memes.length) ? '<section class="section two-col">' +
        '<div class="panel"><h2>✨ 技能</h2>' + (p.skills.length ? '<ul class="skill-list">' + p.skills.map(function (s) { return '<li><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></li>'; }).join('') + '</ul>' : '<p class="muted">暂无</p>') + '</div>' +
        '<div class="panel"><h2>😏 梗与外号</h2>' +
          (p.aliases.length ? '<p>外号：' + p.aliases.map(function (a) { return '<span class="chip">' + esc(a) + '</span>'; }).join('') + '</p>' : '') +
          (p.memes.length ? '<ul class="meme-list">' + p.memes.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' : '<p class="muted">暂无</p>') +
        '</div></section>' : '') +

      (links.length ? '<section class="section panel"><h2>🕸️ 羁绊</h2>' +
        '<div class="link-list">' + links.map(function (l) {
          return '<div class="link-item"><span class="rel">' + esc(l.rel) + '</span>' + CP.ui.personChip(l.other) + (l.note ? '<span class="muted small">' + esc(l.note) + '</span>' : '') + '</div>';
        }).join('') + '</div>' +
        '<div class="ego-wrap">' + CP.ui.egoGraph(p) + '</div></section>' : '') +

      ((depts.length || patches.length) ? '<section class="section two-col">' +
        '<div class="panel"><h2>🏛️ 所在部门</h2>' + (depts.length ? '<ul class="plain-list">' + depts.map(function (d) {
          return '<li><a class="link" href="#/depts/' + d.id + '">' + esc(CP.deptName(d)) + '</a>' + (d.head === p.id ? ' <span class="chip">一把手</span>' : '') + '</li>';
        }).join('') + '</ul>' : '<p class="muted">—</p>') + '</div>' +
        '<div class="panel"><h2>📜 相关补丁</h2>' + (patches.length ? '<ul class="plain-list">' + patches.map(function (c) {
          return '<li><time class="muted small">' + esc(c.date) + '</time> ' + esc(c.title) + '</li>';
        }).join('') + '</ul><a class="link small" href="#/news">全部更新公告 →</a>' : '<p class="muted">—</p>') + '</div>' +
      '</section>' : '') +

      '<nav class="pager">' +
        (prev ? '<a class="btn" href="#/p/' + prev.id + '">← ' + esc(prev.name) + '</a>' : '<span></span>') +
        (next ? '<a class="btn" href="#/p/' + next.id + '">' + esc(next.name) + ' →</a>' : '<span></span>') +
      '</nav>';
  };

  // ---------------- 关于 ----------------
  CP.views.about = function (el) {
    el.innerHTML =
      '<div class="page-head"><h1>关于本站</h1></div>' +
      '<section class="panel prose">' +
        '<h2>这是什么</h2>' +
        '<p>「红墙图鉴」是一个<b>非官方、非营利的娱乐科普网站</b>，用卡牌游戏和公司架构图的方式，帮助读者快速理解中国政治的人事格局：谁在什么位置、从哪里来、和谁有渊源、各个部门负责什么。</p>' +
        '<h2>⚠️ 免责声明</h2>' +
        '<ul>' +
          '<li><b>事实部分</b>（职务、任免时间、官方通报的处分）依据官方公开信息与主流媒体报道整理，数据截至 <b>' + CP.DATA_DATE + '</b>。人事变动频繁，请以新华社、中国政府网等官方发布为准。</li>' +
          '<li><b>派系标签</b>是境内外观察者与网络上的常用归类，不是官方组织，也不代表当事人自认。</li>' +
          '<li><b>攻击力、防御力、技能、戏称</b>纯属娱乐化演绎，不构成任何评价或预测。</li>' +
          '<li>头像为程序生成的风格化剪影，<b>不是本人照片</b>。</li>' +
          '<li>发现错误？欢迎在仓库提 Issue 或 PR，附上来源链接。</li>' +
        '</ul>' +
        '<h2>📐 数值算法（娱乐版）</h2>' +
        '<table class="tbl"><thead><tr><th>数值</th><th>含义</th><th>怎么来的</th></tr></thead><tbody>' +
          '<tr><td>⚔️ 攻击力</td><td>权力</td><td>编辑部依据党内排名、分管领域实权（组织、纪检、宣传、军队、政法、财经、中办）和兼职数量主观估算，0–100。核心为 ∞。</td></tr>' +
          '<tr><td>🛡️ 防御力</td><td>稳固度</td><td>依据与核心的共事渊源、年龄余量、所在派系当前强弱主观估算。已下架卡一律为 0。</td></tr>' +
          '<tr><td>🧭 迁徙值</td><td>调动广度</td><td><b>自动计算</b>：履历中任职过多少个不同的省级单位（中央机关、驻外各算 1 个；求学经历不计）。</td></tr>' +
          '<tr><td>⏳ 七上八下</td><td>年龄红线</td><td><b>自动计算</b>：按出生年月推算 2027 年 10 月二十一大时的年龄，≥68 岁标「按惯例到点」，67 岁标「踩线可留」。</td></tr>' +
        '</tbody></table>' +
        '<h2>🃏 稀有度</h2>' +
        '<p>UR = 总书记；SSR = 政治局常委；SR = 政治局委员 / 国家副主席；R = 国务委员、部长、省级书记、特首；传说 = 退休或已故的前任领导人；已下架 = 落马、被免职或开除党籍。</p>' +
      '</section>' +
      '<section class="section panel"><h2>📖 黑话词典</h2><dl class="glossary">' +
        CP.glossary.map(function (g) { return '<dt>' + esc(g[0]) + '</dt><dd>' + esc(g[1]) + '</dd>'; }).join('') +
      '</dl></section>' +
      '<section class="section panel prose"><h2>🔧 如何更新数据</h2>' +
        '<p>所有数据都在 <code>js/data/</code> 下的几个文件里，与页面代码分离：<code>people.js</code>（人物）、<code>factions.js</code>（派系）、<code>departments.js</code>（部门）、<code>changelog.js</code>（更新公告）、<code>places.js</code>（省份与现任书记）、<code>glossary.js</code>（黑话词典）。改完运行 <code>node scripts/validate.js</code> 检查引用是否完整。</p>' +
      '</section>';
  };
})();
