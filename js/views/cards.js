(function () {
  var CP = window.CP, esc = CP.esc;
  CP.views = CP.views || {};

  var state = { q: '', rarity: 'all', faction: 'all', group: 'all', sort: 'rank' };
  var GROUPS = {
    all: '全部',
    central: '中央',
    local: '地方诸侯',
    military: '军方',
  };
  var WEIGHT = { UR: 0.6, SSR: 2, SR: 4, R: 7, LEG: 4, X: 5 };

  function match(p) {
    if (state.rarity !== 'all' && p.rarity !== state.rarity) return false;
    if (state.faction !== 'all') {
      if (state.faction === 'none' ? p.factions.length : p.factions.indexOf(state.faction) < 0) return false;
    }
    if (state.group === 'military' && !p.military) return false;
    if (state.group === 'local') {
      var last = p.career[p.career.length - 1];
      if (!(p.isActive && last && last[1] === null && last[2] !== 'C')) return false;
    }
    if (state.group === 'central') {
      var l2 = p.career[p.career.length - 1];
      if (!(p.isActive && l2 && l2[2] === 'C')) return false;
    }
    if (state.q) {
      var q = state.q.toLowerCase();
      var hay = [p.name, p.py, p.title, p.short, p.joke, p.bio].concat(p.aliases).concat(p.factions.map(function (f) { return CP.factionById[f] ? CP.factionById[f].name : ''; }))
        .concat(p.career.map(function (c) { return c[3] + (CP.placeByCode[c[2]] ? CP.placeByCode[c[2]].name : ''); })).join(' ').toLowerCase();
      if (hay.indexOf(q) < 0) return false;
    }
    return true;
  }

  function weightedPick(pool) {
    var total = pool.reduce(function (s, p) { return s + WEIGHT[p.rarity]; }, 0);
    var r = Math.random() * total;
    for (var i = 0; i < pool.length; i++) { r -= WEIGHT[pool[i].rarity]; if (r <= 0) return pool[i]; }
    return pool[pool.length - 1];
  }

  CP.gacha = function (n) {
    var pool = CP.people;
    var got = [];
    for (var i = 0; i < n; i++) got.push(weightedPick(pool));
    if (n >= 10 && !got.some(function (p) { return ['UR', 'SSR', 'SR'].indexOf(p.rarity) >= 0; })) {
      var hi = pool.filter(function (p) { return p.rarity === 'SR' || p.rarity === 'SSR'; });
      got[n - 1] = hi[Math.floor(Math.random() * hi.length)];
    }
    var html = got.map(function (p, i) {
      var isNew = CP.collection.add(p.id);
      return '<div class="gacha-slot" style="animation-delay:' + (i * 0.12) + 's">' + (isNew ? '<span class="new-badge">NEW</span>' : '') + CP.ui.card(p, { small: true, uid: 'g' + i }) + '</div>';
    }).join('');
    var best = got.slice().sort(function (a, b) { return CP.RARITY[a.rarity].order - CP.RARITY[b.rarity].order; })[0];
    var quip = {
      UR: '🎉 出货了！全服唯一的 UR，建议截图发朋友圈（但别发微博）。',
      SSR: '✨ SSR！恭喜抽到一位常委。',
      SR: '👍 SR 政治局委员，董事会成员到手。',
      R: '📋 都是 R 卡——地方诸侯也是诸侯。',
      LEG: '📼 抽到了怀旧服传说卡。',
      X: '🚫 抽到的是「已下架」卡……这张卡已被中纪委回收。',
    }[best.rarity];
    var m = CP.ui.modal(
      '<h2 class="gacha-title">' + (n > 1 ? '十连结果' : '单抽结果') + '</h2>' +
      '<p class="gacha-quip">' + quip + '</p>' +
      '<div class="gacha-grid n' + n + '">' + html + '</div>' +
      '<div class="gacha-foot"><span>图鉴进度：<b>' + CP.collection.count() + '</b> / ' + CP.people.length + '</span>' +
      '<span class="gacha-btns"><button class="btn" data-g="1">再来一抽</button><button class="btn btn-primary" data-g="10">十连</button></span></div>',
      'gacha-modal');
    m.el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-g]');
      if (b) { m.close(); CP.gacha(+b.getAttribute('data-g')); }
    });
    m.el.addEventListener('click', function () { refreshProgress(); });
    refreshProgress();
  };

  function refreshProgress() {
    var bar = document.querySelector('.collect-bar span');
    var txt = document.querySelector('.collect-num');
    if (bar) bar.style.width = (CP.collection.count() / CP.people.length * 100) + '%';
    if (txt) txt.textContent = CP.collection.count() + ' / ' + CP.people.length;
    document.querySelectorAll('.cards-grid .card').forEach(function (c) {
      if (CP.collection.has(c.getAttribute('data-id')) && !c.querySelector('.owned')) {
        var top = c.querySelector('.card-top');
        if (top) top.insertAdjacentHTML('beforeend', '<span class="owned" title="已收集">✓</span>');
      }
    });
  }

  CP.views.cards = function (el, params) {
    var rarities = ['all', 'UR', 'SSR', 'SR', 'R', 'LEG', 'X'];
    el.innerHTML =
      '<div class="page-head"><h1>卡牌图鉴</h1><p class="muted">共 ' + CP.people.length + ' 张。点击卡片翻面，看背面的履历与技能；「查看完整档案」进入人物详情。</p></div>' +
      '<div class="gacha-box panel">' +
        '<div><b>🎰 抽卡</b><span class="muted small">按稀有度加权随机，十连保底一张 SR 以上。抽到的卡自动收入图鉴（保存在本浏览器）。</span></div>' +
        '<div class="collect"><span class="collect-bar"><span></span></span><span class="collect-num"></span></div>' +
        '<div class="gacha-btns"><button class="btn" data-g="1">单抽</button><button class="btn btn-primary" data-g="10">十连</button></div>' +
      '</div>' +
      '<div class="toolbar" role="search">' +
        '<input class="input" type="search" placeholder="搜姓名 / 拼音 / 职务 / 省份 / 派系…" value="' + esc(state.q) + '" aria-label="筛选卡牌">' +
        '<div class="seg" role="group" aria-label="稀有度">' + rarities.map(function (r) {
          return '<button data-r="' + r + '" class="' + (state.rarity === r ? 'on' : '') + '">' + (r === 'all' ? '全部' : CP.RARITY[r].label) + '</button>';
        }).join('') + '</div>' +
        '<select class="select" data-f aria-label="派系"><option value="all">全部派系</option>' + CP.factions.map(function (f) {
          return '<option value="' + f.id + '"' + (state.faction === f.id ? ' selected' : '') + '>' + f.emoji + ' ' + esc(f.name) + '</option>';
        }).join('') + '<option value="none"' + (state.faction === 'none' ? ' selected' : '') + '>无明显派系</option></select>' +
        '<select class="select" data-grp aria-label="范围">' + Object.keys(GROUPS).map(function (k) {
          return '<option value="' + k + '"' + (state.group === k ? ' selected' : '') + '>' + GROUPS[k] + '</option>';
        }).join('') + '</select>' +
        '<select class="select" data-s aria-label="排序">' +
          [['rank', '按职级'], ['atk', '按攻击力'], ['def', '按防御力'], ['mov', '按迁徙值'], ['age', '按年龄（长者优先）']].map(function (o) {
            return '<option value="' + o[0] + '"' + (state.sort === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
          }).join('') + '</select>' +
      '</div>' +
      '<div class="result-count muted small"></div>' +
      '<div class="cards-grid"></div>';

    var grid = el.querySelector('.cards-grid');
    var count = el.querySelector('.result-count');
    function render() {
      var list = CP.sortPeople(CP.people.filter(match), state.sort);
      count.textContent = '显示 ' + list.length + ' 张';
      grid.innerHTML = list.length ? list.map(function (p) { return CP.ui.card(p); }).join('') : '<p class="empty">没有符合条件的卡。换个关键词试试？</p>';
    }
    el.querySelector('.input').addEventListener('input', function (e) { state.q = e.target.value; render(); });
    el.querySelectorAll('.seg button').forEach(function (b) {
      b.addEventListener('click', function () {
        state.rarity = b.getAttribute('data-r');
        el.querySelectorAll('.seg button').forEach(function (x) { x.classList.toggle('on', x === b); });
        render();
      });
    });
    el.querySelector('[data-f]').addEventListener('change', function (e) { state.faction = e.target.value; render(); });
    el.querySelector('[data-grp]').addEventListener('change', function (e) { state.group = e.target.value; render(); });
    el.querySelector('[data-s]').addEventListener('change', function (e) { state.sort = e.target.value; render(); });
    el.querySelectorAll('.gacha-box [data-g]').forEach(function (b) {
      b.addEventListener('click', function () { CP.gacha(+b.getAttribute('data-g')); });
    });
    render();
    refreshProgress();
    if (params && params[0] === 'gacha') setTimeout(function () { CP.gacha(1); }, 250);
  };
})();
