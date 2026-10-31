(function () {
  var CP = window.CP, esc = CP.esc;
  CP.views = CP.views || {};

  CP.views.org = function (el) {
    var fun = CP.isFun();
    var xi = CP.byId.xijinping;
    var pscOrder = ['liqiang', 'zhaoleji', 'wanghuning', 'caiqi', 'dingxuexiang', 'lixi'];
    var LOCAL = ['BJ', 'SH', 'TJ', 'CQ', 'GD'];

    function deptBox(d) {
      var head = d.head ? CP.byId[d.head] : null;
      var mem = (d.members || []).map(function (id) { return CP.byId[id]; }).filter(Boolean);
      return '<div class="org-dept k-' + d.kind + '">' +
        '<a class="od-name" href="#/depts/' + d.id + '">' + esc(CP.deptName(d)) + '</a>' +
        (fun ? '<div class="od-sub">' + esc(d.name) + '</div>' : '') +
        '<div class="od-people">' +
          (head ? CP.ui.personChip(head, '一把手') : (d.headName ? '<span class="name-only">一把手：' + esc(d.headName) + '</span>' : '')) +
          mem.map(function (p) { return CP.ui.personChip(p); }).join('') +
        '</div></div>';
    }
    function bigNode(p, label) {
      return '<a class="org-node r-' + p.rarity + '" href="#/p/' + p.id + '">' +
        '<span class="on-av">' + CP.avatar(p, { uid: 'org' }) + '</span>' +
        '<span class="on-text"><small>' + esc(label) + '</small><b>' + esc(p.name) + '</b><span>' + esc(fun ? (p.joke || p.short) : p.title) + '</span></span></a>';
    }

    var direct = CP.departments.filter(function (d) { return d.under === 'xijinping'; });

    var cols = pscOrder.map(function (id) {
      var p = CP.byId[id];
      var depts = CP.departments.filter(function (d) { return d.under === id; });
      return '<div class="org-col">' + bigNode(p, '常委 No.' + p.rank) +
        '<div class="org-col-depts">' + depts.map(deptBox).join('') + '</div></div>';
    }).join('');

    var locals = LOCAL.map(function (code) {
      var pl = CP.placeByCode[code], p = CP.byId[pl.sec];
      return '<div class="org-local"><span class="ol-place">' + esc(pl.name) + (fun ? '分公司' : '') + '</span>' + CP.ui.personChip(p, fun ? '总经理' : p.short) + '</div>';
    }).join('');

    var pbOthers = CP.sortPeople(CP.people.filter(function (p) { return p.isPB && p.tier === 'pb'; }));

    el.innerHTML =
      '<div class="page-head"><h1>' + (fun ? '中国有限公司 · 组织架构图' : '中共中央与国家机构 · 组织架构') + '</h1>' +
      '<p class="muted">自上而下：' + (fun ? '董事长 → 董事会常委 → 各事业部 → 分公司' : '总书记 → 政治局常委 → 分管系统 → 地方') + '。点击任意人名或部门查看详情。右上角可切换「正经 / 戏说」模式。</p></div>' +

      '<div class="org-tree">' +
        '<div class="org-top">' + bigNode(xi, fun ? '董事长' : '总书记 · 国家主席 · 军委主席') + '</div>' +
        '<div class="org-connector" aria-hidden="true"></div>' +
        '<div class="org-direct"><div class="org-band-title">' + (fun ? '董事长直管' : '总书记直接领导') + '</div><div class="org-direct-row">' + direct.map(deptBox).join('') + '</div></div>' +
        '<div class="org-connector" aria-hidden="true"></div>' +
        '<div class="org-band-title center">' + (fun ? '董事会常务委员会（7 人群聊）' : '中央政治局常务委员会') + '</div>' +
        '<div class="org-cols">' + cols + '</div>' +
        '<div class="org-connector" aria-hidden="true"></div>' +
        '<div class="org-band"><div class="org-band-title">' + (fun ? '重点分公司（政治局委员坐镇）' : '由政治局委员担任书记的省级单位') + '</div>' +
          '<div class="org-locals">' + locals + '</div>' +
          '<p class="muted small">其余 26 个省区和港澳，见 <a class="link" href="#/map">迁徙地图</a>。</p></div>' +
        '<div class="org-band"><div class="org-band-title">' + (fun ? '董事会成员一览（非常委）' : '其他政治局委员') + '</div>' +
          '<div class="chip-wrap">' + pbOthers.map(function (p) { return CP.ui.personChip(p); }).join('') + '</div></div>' +
      '</div>';
  };
})();
