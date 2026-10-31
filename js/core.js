/* 核心：派生数据、工具函数、头像生成 */
(function () {
  var CP = window.CP;
  CP.DATA_DATE = '2026-10-31';
  CP.NEXT_CONGRESS = { year: 2027, month: 10 };

  // ---------- 基础工具 ----------
  CP.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  CP.hash = function (s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };
  CP.store = {
    get: function (k, d) { try { var v = localStorage.getItem('hqtj:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('hqtj:' + k, JSON.stringify(v)); } catch (e) { /* 无痕模式等 */ } },
  };

  // ---------- 稀有度 ----------
  CP.RARITY = {
    UR: { label: 'UR', name: '核心', order: 0 },
    SSR: { label: 'SSR', name: '常委', order: 1 },
    SR: { label: 'SR', name: '政治局', order: 2 },
    R: { label: 'R', name: '部长/诸侯', order: 3 },
    LEG: { label: '传说', name: '退休/已故', order: 4 },
    X: { label: '已下架', name: '落马', order: 5 },
  };
  var TIER_RARITY = { core: 'UR', psc: 'SSR', pb: 'SR', state: 'R', prov: 'R', legend: 'LEG', fallen: 'X' };

  CP.STATUS = {
    active: { label: '在任', cls: 'ok' },
    retired: { label: '已退休', cls: 'muted' },
    dead: { label: '已故', cls: 'muted' },
    expelled: { label: '已开除党籍', cls: 'bad' },
    investigated: { label: '审查中', cls: 'bad' },
    sentenced: { label: '已判刑', cls: 'bad' },
    removed: { label: '已免职', cls: 'bad' },
  };

  // ---------- 派生人物数据 ----------
  CP.byId = {};
  CP.people.forEach(function (p, i) {
    p.idx = i;
    p.rarity = p.rarity || TIER_RARITY[p.tier] || 'R';
    if (p.tier === 'fallen') p.rarity = 'X';
    if (p.tier === 'legend') p.rarity = 'LEG';
    p.factions = p.factions || [];
    p.aliases = p.aliases || [];
    p.career = p.career || [];
    p.skills = p.skills || [];
    p.memes = p.memes || [];
    p.links = p.links || [];
    p.isFallen = p.tier === 'fallen';
    p.isActive = p.status === 'active';
    p.isPB = p.isActive && (p.tier === 'core' || p.tier === 'psc' || p.tier === 'pb');
    // 默认娱乐数值
    if (p.atk == null) p.atk = p.tier === 'prov' ? 38 : 40;
    if (p.def == null) p.def = p.tier === 'prov' ? 50 : 50;
    if (p.isFallen) p.def = 0;
    CP.byId[p.id] = p;
  });

  // 迁徙值：履历走过的不同地点数
  // career 第 5 项为 'edu' 表示求学经历：显示在时间线上，但不计入迁徙值与「曾在此任职」
  CP.isEdu = function (c) { return c[4] === 'edu'; };
  CP.places_of = function (p) {
    var seen = {}, list = [];
    p.career.forEach(function (c) { if (!CP.isEdu(c) && !seen[c[2]]) { seen[c[2]] = 1; list.push(c[2]); } });
    return list;
  };
  CP.people.forEach(function (p) { p.mov = CP.places_of(p).length; });

  // 年龄 & 七上八下
  CP.parseBorn = function (p) {
    if (!p.born) return null;
    var a = String(p.born).split('-');
    return { y: +a[0], m: a[1] ? +a[1] : 6 };
  };
  CP.ageAt = function (p, y, m) {
    var b = CP.parseBorn(p); if (!b) return null;
    return y - b.y - (m < b.m ? 1 : 0);
  };
  CP.ageNow = function (p) { var d = CP.DATA_DATE.split('-'); return CP.ageAt(p, +d[0], +d[1]); };
  CP.sevenEight = function (p) {
    if (!p.isPB) return null;
    var age = CP.ageAt(p, CP.NEXT_CONGRESS.year, CP.NEXT_CONGRESS.month);
    if (age == null) return null;
    if (p.tier === 'core') return { age: age, code: 'exempt', label: '规则豁免' };
    if (age >= 68) return { age: age, code: 'out', label: '按惯例到点' };
    if (age === 67) return { age: age, code: 'edge', label: '踩线可留' };
    return { age: age, code: 'stay', label: '年龄可续' };
  };

  // 关系（双向）
  CP.linksOf = function (id) {
    var out = [];
    var me = CP.byId[id];
    if (me) me.links.forEach(function (l) { if (CP.byId[l[0]]) out.push({ other: CP.byId[l[0]], rel: l[1], note: l[2] || '', dir: 'out' }); });
    CP.people.forEach(function (p) {
      if (p.id === id) return;
      p.links.forEach(function (l) {
        if (l[0] === id) out.push({ other: p, rel: CP.reverseRel(l[1]), note: l[2] || '', dir: 'in' });
      });
    });
    return out;
  };
  var REV = { '老部下': '老领导', '大秘': '老领导', '首席智囊': '服务对象', '提携': '被提携者', '老同事': '老同事', '同窗': '同窗',
    '老友': '老友', '世交': '世交', '渊源': '渊源', '党校同事': '党校同事', '对调': '对调', '交接': '交接', '同出一门': '同出一门',
    '福建渊源': '福建渊源', '团派战友': '团派战友', '团派传人': '团派前辈', '江派': '江派', '上海帮': '上海帮', '对手': '对手', '表态': '被表态对象', '同案': '同案' };
  CP.reverseRel = function (r) { return REV[r] || r; };

  // 派系成员
  CP.factions.forEach(function (f) { f.members = []; });
  CP.people.forEach(function (p) { p.factions.forEach(function (fid) { if (CP.factionById[fid]) CP.factionById[fid].members.push(p); }); });

  // 地点 → 曾在此任职的人
  CP.peopleInPlace = function (code) {
    return CP.people.filter(function (p) { return p.career.some(function (c) { return c[2] === code && !CP.isEdu(c); }); });
  };

  // 部门关系
  CP.deptsOf = function (id) {
    return CP.departments.filter(function (d) { return d.head === id || (d.members || []).indexOf(id) >= 0; });
  };
  CP.patchesOf = function (id) {
    return CP.changelog.filter(function (c) { return (c.who || []).indexOf(id) >= 0; });
  };

  // 排序（更新公告按日期倒序，未来条目置顶）
  CP.changelog.sort(function (a, b) {
    if (a.future !== b.future) return a.future ? -1 : 1;
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  });

  // 人物排序：稀有度 → rank → 原始顺序
  CP.sortPeople = function (list, key) {
    key = key || 'rank';
    var arr = list.slice();
    var cmp = {
      rank: function (a, b) {
        var ra = CP.RARITY[a.rarity].order, rb = CP.RARITY[b.rarity].order;
        if (ra !== rb) return ra - rb;
        return (a.rank || 999) - (b.rank || 999) || a.idx - b.idx;
      },
      atk: function (a, b) { return b.atk - a.atk || a.idx - b.idx; },
      def: function (a, b) { return b.def - a.def || a.idx - b.idx; },
      mov: function (a, b) { return b.mov - a.mov || a.idx - b.idx; },
      age: function (a, b) {
        var x = CP.parseBorn(a), y = CP.parseBorn(b);
        return (x ? x.y * 12 + x.m : 1e9) - (y ? y.y * 12 + y.m : 1e9);
      },
    }[key] || function () { return 0; };
    return arr.sort(cmp);
  };

  // ---------- 文本 ----------
  CP.mode = CP.store.get('mode', 'fun'); // fun 戏说 / serious 正经
  CP.isFun = function () { return CP.mode === 'fun'; };
  CP.deptName = function (d) { return CP.isFun() ? d.joke : d.name; };
  CP.personTitle = function (p) { return CP.isFun() && p.joke ? p.joke : (p.short || p.title); };
  CP.yearRange = function (c) {
    var a = c[0], b = c[1];
    if (b === null) return a + '–至今';
    if (a === b) return String(a);
    return a + '–' + b;
  };

  // ---------- 头像（风格化 SVG，不使用真实照片） ----------
  CP.primaryColor = function (p) {
    var f = p.factions.map(function (id) { return CP.factionById[id]; }).filter(Boolean)[0];
    if (p.tier === 'core') return '#b71c1c';
    return f ? f.color : '#5d6d7e';
  };

  CP.avatar = function (p, opts) {
    opts = opts || {};
    var h = CP.hash(p.id);
    var col = CP.primaryColor(p);
    var uid = 'av' + p.id + (opts.uid || '');
    var female = p.gender === 'f';
    var mil = !!p.military;
    var hairVar = h % 4;
    var skin = ['#f2cfae', '#ecc29c', '#f5d6b8', '#e9bd93'][(h >>> 3) % 4];
    var hair = '#141414'; // 统一纯黑
    var suit = mil ? '#3f5a2b' : ['#1f2a44', '#232b38', '#2b2f3a', '#1b2533'][(h >>> 5) % 4];
    var tie = mil ? '#2e4320' : '#b71c1c';
    var surname = p.name.charAt(0);
    var hairPath;
    if (female) {
      hairPath = '<path d="M30 52 C28 28 44 18 60 18 C76 18 92 28 90 52 L92 70 C86 60 84 50 84 44 C74 40 56 36 40 40 C36 50 34 60 28 70 Z" fill="' + hair + '"/>';
    } else if (hairVar === 0) {
      hairPath = '<path d="M36 44 C34 26 48 18 62 19 C78 20 88 30 85 46 C80 38 70 33 58 33 C48 33 40 37 36 44 Z" fill="' + hair + '"/>';
    } else if (hairVar === 1) {
      hairPath = '<path d="M35 46 C33 27 47 17 61 18 C77 19 89 29 86 47 C83 40 78 34 72 32 C62 36 46 36 35 46 Z" fill="' + hair + '"/>';
    } else if (hairVar === 2) {
      hairPath = '<path d="M36 45 C35 29 45 20 60 19 C76 19 87 29 85 45 C80 35 64 30 52 31 C46 32 40 37 36 45 Z" fill="' + hair + '"/>';
    } else {
      hairPath = '<path d="M37 47 C36 28 48 20 61 20 C75 20 86 28 84 47 C80 40 76 36 70 35 L60 30 L50 35 C44 37 40 41 37 47 Z" fill="' + hair + '"/>';
    }
    var body = female
      ? '<path d="M22 120 C24 96 38 86 60 86 C82 86 96 96 98 120 Z" fill="' + suit + '"/><path d="M50 86 L60 100 L70 86 Z" fill="#f4f4f4"/>'
      : '<path d="M14 120 C16 94 34 84 60 84 C86 84 104 94 106 120 Z" fill="' + suit + '"/>' +
        (mil
          ? '<path d="M48 84 L60 100 L72 84 Z" fill="#c8b98a"/><path d="M60 92 L57 120 L63 120 Z" fill="' + tie + '"/><circle cx="38" cy="98" r="3" fill="#e6c34a"/><circle cx="82" cy="98" r="3" fill="#e6c34a"/>'
          : '<path d="M46 84 L60 106 L74 84 Z" fill="#f4f4f4"/><path d="M57 88 L63 88 L65 96 L60 118 L55 96 Z" fill="' + tie + '"/>');
    var svg =
      '<svg class="avatar-svg" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + CP.esc(p.name) + ' 风格化头像" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><radialGradient id="' + uid + 'g" cx="50%" cy="35%" r="75%"><stop offset="0%" stop-color="' + col + '" stop-opacity="0.55"/><stop offset="100%" stop-color="' + col + '" stop-opacity="1"/></radialGradient></defs>' +
      '<rect width="120" height="120" fill="url(#' + uid + 'g)"/>' +
      '<text x="104" y="30" text-anchor="end" font-size="26" font-weight="700" fill="#fff" fill-opacity="0.22" font-family="serif">' + CP.esc(surname) + '</text>' +
      body +
      '<rect x="53" y="70" width="14" height="18" rx="5" fill="' + skin + '"/>' +
      '<ellipse cx="60" cy="52" rx="23" ry="27" fill="' + skin + '"/>' +
      hairPath +
      '<ellipse cx="51" cy="54" rx="2.2" ry="2.6" fill="#2a2a2a"/><ellipse cx="69" cy="54" rx="2.2" ry="2.6" fill="#2a2a2a"/>' +
      '<path d="M53 66 Q60 ' + (p.isFallen ? '62' : '70') + ' 67 66" stroke="#8a5a44" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '</svg>';
    if (p.photo) svg = '<img class="avatar-img" src="' + CP.esc(p.photo) + '" alt="' + CP.esc(p.name) + '">';
    return svg;
  };

  // ---------- 搜索 ----------
  CP.search = function (q) {
    q = (q || '').trim().toLowerCase();
    if (!q) return [];
    var res = [];
    function hit(s) { return s && String(s).toLowerCase().indexOf(q) >= 0; }
    CP.people.forEach(function (p) {
      var score = 0;
      if (p.name === q) score = 100;
      else if (hit(p.name)) score = 80;
      else if (hit(p.py) || hit((p.py || '').replace(/\s/g, ''))) score = 70;
      else if (p.aliases.some(hit)) score = 60;
      else if (hit(p.title) || hit(p.short) || hit(p.joke)) score = 40;
      else if (p.factions.some(function (f) { return hit(CP.factionById[f] && CP.factionById[f].name); })) score = 30;
      else if (p.career.some(function (c) { return hit(c[3]) || hit(CP.placeByCode[c[2]] && CP.placeByCode[c[2]].name); })) score = 20;
      if (score) res.push({ kind: 'person', item: p, score: score + (p.isActive ? 5 : 0) - CP.RARITY[p.rarity].order });
    });
    CP.departments.forEach(function (d) {
      if (hit(d.name) || hit(d.joke)) res.push({ kind: 'dept', item: d, score: 50 });
    });
    CP.factions.forEach(function (f) {
      if (hit(f.name)) res.push({ kind: 'faction', item: f, score: 55 });
    });
    CP.places.forEach(function (pl) {
      if (!pl.special && (hit(pl.name) || pl.short === q)) res.push({ kind: 'place', item: pl, score: 45 });
    });
    return res.sort(function (a, b) { return b.score - a.score; }).slice(0, 12);
  };
})();
