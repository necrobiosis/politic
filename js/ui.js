/* UI 组件：卡牌、标签、方块地图、关系图、弹窗 */
(function () {
  var CP = window.CP, esc = CP.esc;

  CP.ui = {};

  CP.ui.factionChip = function (fid, opts) {
    var f = CP.factionById[fid]; if (!f) return '';
    opts = opts || {};
    return '<a class="chip faction-chip" href="#/factions/' + f.id + '" style="--c:' + f.color + '" title="' + esc(f.origin) + '">' +
      '<span aria-hidden="true">' + f.emoji + '</span>' + esc(f.name) + '</a>';
  };

  CP.ui.statusBadge = function (p) {
    var s = CP.STATUS[p.status] || CP.STATUS.active;
    return '<span class="status-badge s-' + s.cls + '">' + s.label + '</span>';
  };

  CP.ui.rarityBadge = function (p) {
    return '<span class="rarity-badge rb-' + p.rarity + '">' + CP.RARITY[p.rarity].label + '</span>';
  };

  CP.ui.personChip = function (p, extra) {
    if (typeof p === 'string') p = CP.byId[p];
    if (!p) return '';
    return '<a class="person-chip r-' + p.rarity + (p.isFallen ? ' is-fallen' : '') + '" href="#/p/' + p.id + '">' +
      '<span class="pc-av">' + CP.avatar(p, { uid: 'pc' + Math.random().toString(36).slice(2, 7) }) + '</span>' +
      '<span class="pc-text"><b>' + esc(p.name) + '</b><small>' + esc(extra || p.short || '') + '</small></span></a>';
  };

  CP.ui.placeChip = function (code) {
    var pl = CP.placeByCode[code]; if (!pl) return esc(code);
    return '<a class="chip place-chip" href="#/map/' + code + '">' + esc(pl.name) + '</a>';
  };

  // 迁徙路线（压缩连续重复地点）
  CP.ui.routeCodes = function (p) {
    var out = [];
    p.career.forEach(function (c) { if (out[out.length - 1] !== c[2]) out.push(c[2]); });
    return out;
  };
  CP.ui.routeLine = function (p) {
    var codes = CP.ui.routeCodes(p);
    if (!codes.length) return '';
    return '<div class="route-line">' + codes.map(function (c) {
      var pl = CP.placeByCode[c];
      return '<span class="route-stop' + (pl && pl.special ? ' sp' : '') + '">' + esc(pl ? pl.short : c) + '</span>';
    }).join('<span class="route-arrow" aria-hidden="true">→</span>') + '</div>';
  };

  CP.ui.statBar = function (label, icon, val, max, extra) {
    var shown = val >= 999 ? '∞' : val;
    var pct = Math.max(0, Math.min(100, (val / max) * 100));
    return '<div class="stat-row"><span class="stat-label">' + icon + ' ' + label + '</span>' +
      '<span class="stat-bar"><span style="width:' + pct + '%"></span></span><span class="stat-val">' + shown + (extra || '') + '</span></div>';
  };

  CP.ui.ageLine = function (p) {
    var se = CP.sevenEight(p);
    if (!se) {
      var a = CP.ageNow(p);
      if (p.status === 'dead') return '<div class="age-line muted">已故' + (p.died ? '（' + esc(p.died.slice(0, 4)) + '）' : '') + '</div>';
      return a ? '<div class="age-line muted">现年约 ' + a + ' 岁</div>' : '';
    }
    return '<div class="age-line se-' + se.code + '">⏳ 2027 年 ' + se.age + ' 岁 · ' + se.label + '</div>';
  };

  // ---------- 卡牌 ----------
  CP.ui.card = function (p, opts) {
    opts = opts || {};
    var uid = (opts.uid || '') + Math.random().toString(36).slice(2, 7);
    var owned = CP.collection && CP.collection.has(p.id);
    var fChips = p.factions.slice(0, 3).map(function (f) { var x = CP.factionById[f]; return x ? '<span class="mini-chip" style="--c:' + x.color + '">' + x.emoji + esc(x.name) + '</span>' : ''; }).join('');
    if (!p.factions.length) fChips = '<span class="mini-chip muted-chip">无明显派系</span>';
    var skills = p.skills.slice(0, 2).map(function (s) { return '<li><b>' + esc(s[0]) + '</b>' + esc(s[1]) + '</li>'; }).join('');
    var stamp = p.isFallen ? '<div class="stamp">已下架</div>' : (p.tier === 'legend' ? '<div class="stamp stamp-leg">' + (p.status === 'dead' ? '已故' : '已退休') + '</div>' : '');
    return '' +
      '<div class="card r-' + p.rarity + (p.isFallen ? ' is-fallen' : '') + (p.tier === 'legend' ? ' is-legend' : '') + (opts.small ? ' card-sm' : '') + '" data-id="' + p.id + '" tabindex="0" role="button" aria-label="' + esc(p.name) + ' 卡牌，点击翻面">' +
      '<div class="card-inner">' +
        '<div class="card-face card-front">' +
          '<div class="card-top">' + CP.ui.rarityBadge(p) + (p.rank && p.rank <= 7 ? '<span class="card-rank">No.' + p.rank + '</span>' : '') + (owned ? '<span class="owned" title="已收集">✓</span>' : '') + '</div>' +
          '<div class="portrait">' + CP.avatar(p, { uid: uid }) + stamp + '</div>' +
          '<div class="card-name">' + esc(p.name) + '</div>' +
          '<div class="card-title">' + esc(CP.personTitle(p)) + '</div>' +
          '<div class="card-factions">' + fChips + '</div>' +
          '<div class="card-stats">' +
            '<span title="攻击力（权力）">⚔️<b>' + (p.atk >= 999 ? '∞' : p.atk) + '</b></span>' +
            '<span title="防御力（稳固度）">🛡️<b>' + (p.def >= 999 ? '∞' : p.def) + '</b></span>' +
            '<span title="迁徙值（走过的省级单位数）">🧭<b>' + p.mov + '</b></span>' +
          '</div>' +
        '</div>' +
        '<div class="card-face card-back">' +
          '<div class="cb-head"><b>' + esc(p.name) + '</b>' + CP.ui.statusBadge(p) + '</div>' +
          '<p class="cb-bio">' + esc(p.bio || '') + '</p>' +
          (p.career.length ? '<div class="cb-sec">迁徙路线</div>' + CP.ui.routeLine(p) : '') +
          (skills ? '<div class="cb-sec">技能</div><ul class="cb-skills">' + skills + '</ul>' : '') +
          CP.ui.ageLine(p) +
          '<a class="cb-more" href="#/p/' + p.id + '">查看完整档案 →</a>' +
        '</div>' +
      '</div></div>';
  };

  // 卡牌点击翻面（事件委托）
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    var card = e.target.closest('.card');
    if (!card || (a && card.contains(a))) return;
    card.classList.toggle('flipped');
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('card')) {
      e.preventDefault(); e.target.classList.toggle('flipped');
    }
  });

  // ---------- 方块地图 ----------
  var T = 84, G = 8, S = T + G;
  CP.ui.tileCenter = function (code) {
    var pl = CP.placeByCode[code]; if (!pl) return null;
    return { x: pl.x * S + T / 2, y: pl.y * S + T / 2 };
  };
  /* opts: { fills: {code: color}, labels: {code: text}, route: [codes], selected: code, dim: bool } */
  CP.ui.tileMap = function (opts) {
    opts = opts || {};
    var W = 8 * S - G, H = 8 * S - G;
    var tiles = CP.places.map(function (pl) {
      var x = pl.x * S, y = pl.y * S;
      var fill = (opts.fills && opts.fills[pl.code]) || null;
      var onRoute = opts.route && opts.route.indexOf(pl.code) >= 0;
      var cls = 'tile' + (pl.special ? ' tile-sp' : '') + (onRoute ? ' on-route' : '') + (opts.selected === pl.code ? ' selected' : '') + (opts.route && !onRoute ? ' dim' : '');
      var sub = opts.labels && opts.labels[pl.code] != null ? opts.labels[pl.code] : '';
      return '<g class="' + cls + '" data-code="' + pl.code + '" tabindex="0" role="button" aria-label="' + esc(pl.name) + (sub ? '：' + esc(sub) : '') + '">' +
        '<rect x="' + x + '" y="' + y + '" width="' + T + '" height="' + T + '" rx="12"' + (fill ? ' style="fill:' + fill + '"' : '') + '/>' +
        '<text class="t-main" x="' + (x + T / 2) + '" y="' + (y + 40) + '">' + esc(pl.special ? pl.short : pl.short) + '</text>' +
        '<text class="t-sub" x="' + (x + T / 2) + '" y="' + (y + 64) + '">' + esc(sub) + '</text>' +
        '</g>';
    }).join('');
    var route = '';
    if (opts.route && opts.route.length) {
      var pts = opts.route.map(CP.ui.tileCenter).filter(Boolean);
      var segs = '';
      for (var i = 1; i < pts.length; i++) {
        var a0 = pts[i - 1], b0 = pts[i];
        var dx = b0.x - a0.x, dy = b0.y - a0.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
        // 两端各收缩一段，让箭头停在方块边缘，不压住文字
        var trim = Math.min(34, len / 3);
        var a = { x: a0.x + dx / len * trim, y: a0.y + dy / len * trim };
        var b = { x: b0.x - dx / len * trim, y: b0.y - dy / len * trim };
        // 轻微弯曲，避免往返线重叠
        var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        var off = 18 * (i % 2 ? 1 : -1);
        var cx = mx - dy / len * off, cy = my + dx / len * off;
        segs += '<path class="route-seg" d="M' + a.x + ' ' + a.y + ' Q' + cx + ' ' + cy + ' ' + b.x + ' ' + b.y + '" marker-end="url(#arrowhead)"/>';
      }
      var dots = pts.map(function (p, i) {
        var jitter = (i % 3) * 6 - 6;
        return '<g class="route-dot"><circle cx="' + (p.x + 26 + jitter) + '" cy="' + (p.y - 26) + '" r="11"/><text x="' + (p.x + 26 + jitter) + '" y="' + (p.y - 22) + '">' + (i + 1) + '</text></g>';
      }).join('');
      route = '<g class="route">' + segs + dots + '</g>';
    }
    return '<svg class="tile-map" viewBox="-6 -6 ' + (W + 12) + ' ' + (H + 12) + '" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="arrow-fill"/></marker></defs>' +
      tiles + route + '</svg>';
  };

  // ---------- 关系图（以某人为中心的放射图） ----------
  CP.ui.egoGraph = function (p) {
    var links = CP.linksOf(p.id);
    // 同派系的在任者也作为弱关系补充
    var seen = {}; links.forEach(function (l) { seen[l.other.id] = 1; });
    var W = 640, H = 460, cx = W / 2, cy = H / 2;
    var n = links.length;
    if (!n) return '<p class="muted">暂无录入的羁绊关系。</p>';
    var R = Math.min(190, 110 + n * 8);
    var nodes = links.map(function (l, i) {
      var ang = -Math.PI / 2 + (i / n) * Math.PI * 2;
      return { l: l, x: cx + Math.cos(ang) * R * 1.25, y: cy + Math.sin(ang) * R * 0.9 };
    });
    var edges = nodes.map(function (nd) {
      var mx = (cx + nd.x) / 2, my = (cy + nd.y) / 2;
      return '<line class="eg-edge" x1="' + cx + '" y1="' + cy + '" x2="' + nd.x + '" y2="' + nd.y + '"/>' +
        '<text class="eg-rel" x="' + mx + '" y="' + (my - 4) + '">' + esc(nd.l.rel) + '</text>';
    }).join('');
    function node(person, x, y, r, center) {
      var col = CP.primaryColor(person);
      return '<a href="#/p/' + person.id + '" class="eg-node' + (person.isFallen ? ' is-fallen' : '') + (center ? ' center' : '') + '">' +
        '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:' + col + '"/>' +
        '<text class="eg-char" x="' + x + '" y="' + (y + r * 0.36) + '" style="font-size:' + (r * 0.95) + 'px">' + esc(person.name.charAt(0)) + '</text>' +
        '<text class="eg-name" x="' + x + '" y="' + (y + r + 16) + '">' + esc(person.name) + (person.isFallen ? '（已下架）' : '') + '</text></a>';
    }
    var nodeSvg = nodes.map(function (nd) { return node(nd.l.other, nd.x, nd.y, 24, false); }).join('');
    return '<svg class="ego-graph" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg">' + edges + nodeSvg + node(p, cx, cy, 36, true) + '</svg>';
  };

  // ---------- 弹窗 ----------
  CP.ui.modal = function (html, cls) {
    var wrap = document.createElement('div');
    wrap.className = 'modal-wrap ' + (cls || '');
    wrap.innerHTML = '<div class="modal" role="dialog" aria-modal="true"><button class="modal-close" aria-label="关闭">×</button>' + html + '</div>';
    function close() { wrap.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    wrap.addEventListener('click', function (e) { if (e.target === wrap || e.target.classList.contains('modal-close') || e.target.closest('a')) close(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(wrap);
    return { el: wrap, close: close };
  };

  CP.ui.toast = function (msg) {
    var t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('show'); }, 10);
    setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 300); }, 2200);
  };

  // ---------- 收集 ----------
  CP.collection = {
    _set: null,
    load: function () { if (!this._set) this._set = new Set(CP.store.get('collection', [])); return this._set; },
    has: function (id) { return this.load().has(id); },
    add: function (id) { var isNew = !this.has(id); this.load().add(id); CP.store.set('collection', Array.from(this._set)); return isNew; },
    count: function () { return this.load().size; },
    reset: function () { this._set = new Set(); CP.store.set('collection', []); },
  };
})();
