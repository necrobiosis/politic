/* 派系公会
 * 注意：派系是境内外观察者、网络上的常用归类，并非官方组织，也不代表当事人自认。
 * 同一人常常同时带多个标签。status 是本站对其「当前版本强度」的戏说评价。
 */
window.CP = window.CP || {};

CP.factions = [
  {
    id: 'zhijiang', name: '之江新军', emoji: '🌊', color: '#0e7c86',
    origin: '习近平 2002–2007 年主政浙江时的部下。名字来自他当年在《浙江日报》开设的专栏「之江新语」。',
    status: '版本之子', statusLevel: 5,
    roast: '当前版本 T0 阵营。入会门槛：2002–2007 年在浙江上过班，且被领导记住了。',
  },
  {
    id: 'fujian', name: '福建帮', emoji: '🍵', color: '#2f7d32',
    origin: '习近平 1985–2002 年在福建工作 17 年间的旧部，地方系与军中系（原 31 集团军）两条线。',
    status: '地方强势 / 军中分舵团灭', statusLevel: 3,
    roast: '地方分舵依旧兴旺；军中分舵（何卫东、苗华等原 31 集团军系）2025 年集体下架，属于「同一个公会，两种结局」。',
  },
  {
    id: 'shaanxi', name: '陕西帮', emoji: '🥖', color: '#b5651d',
    origin: '与习家陕西渊源相关：主政过陕西/延安、或父辈出自西北红军系统。梁家河、富平是关键词。',
    status: '老牌稳健', statusLevel: 4,
    roast: '入会方式之一：在陕西任上把相关纪念地修缮得很好。',
  },
  {
    id: 'shanghai_new', name: '新上海帮', emoji: '🏙️', color: '#3949ab',
    origin: '习近平 2007 年在上海任职 7 个月期间结识的部下，以及后来主政上海的「习系」干部。',
    status: '强势', statusLevel: 4,
    roast: '只用 7 个月就组建起一个公会，效率极高。',
  },
  {
    id: 'jiang', name: '江派 / 老上海帮', emoji: '🐸', color: '#6d4c41',
    origin: '以江泽民为核心、以上海为根据地的老派系，1990–2000 年代统治版本。',
    status: '怀旧服', statusLevel: 1,
    roast: '掌门已于 2022 年仙逝，公会频道只剩怀旧帖。',
  },
  {
    id: 'tuanpai', name: '团派', emoji: '🎒', color: '#c62828',
    origin: '共青团系统出身的干部，代表人物胡锦涛、李克强、汪洋、胡春华。',
    status: '已解散', statusLevel: 0,
    roast: '2022 年二十大后全员退出牌桌，公会大厅改建为「青年大学习」打卡点。',
  },
  {
    id: 'tsinghua', name: '清华帮', emoji: '🎓', color: '#7b1fa2',
    origin: '清华大学出身或在清华任职的干部。习近平、胡锦涛本人都是清华校友。',
    status: '稳定', statusLevel: 3,
    roast: '「自强不息，厚德载物」，以及「又红又专」。',
  },
  {
    id: 'aerospace', name: '军工航天系', emoji: '🚀', color: '#455a64',
    origin: '出身航天、兵器等军工央企的技术官僚，曾被视为最有前途的「技术型接班梯队」。',
    status: '连环爆雷', statusLevel: 1,
    roast: '2025–2026 年：马兴瑞、金壮龙及多名航天央企高管相继下架。发射成功率很高，政治着陆成功率堪忧。',
  },
  {
    id: 'partyschool', name: '党校系', emoji: '📚', color: '#8d6e63',
    origin: '中央党校出身。习近平 2007–2012 年兼任中央党校校长时的同事。',
    status: '稳健', statusLevel: 4,
    roast: '天天给全国干部上课的人，后来去管全国干部了。',
  },
  {
    id: 'secretary', name: '大秘系', emoji: '📝', color: '#546e7a',
    origin: '曾任习近平身边秘书长/办公厅主任一类职务的人，俗称「大秘」。',
    status: '版本之子', statusLevel: 5,
    roast: '离领导最近的人，往往也离未来最近。',
  },
  {
    id: 'princeling', name: '红二代 / 太子党', emoji: '👑', color: '#d4a017',
    origin: '中共开国元勋、高级将领的子女。',
    status: '分化', statusLevel: 2,
    roast: '同一出身，结局横跨「总书记」到「无期徒刑」，方差极大。',
  },
  {
    id: 'security', name: '政法安全系', emoji: '🛡️', color: '#37474f',
    origin: '公安、国安、政法、纪检系统出身的干部。',
    status: '强势', statusLevel: 4,
    roast: '你看不见他们，但他们看得见你。',
  },
  {
    id: 'diplomat', name: '外交系', emoji: '🌐', color: '#00838f',
    origin: '职业外交官出身。',
    status: '高风险', statusLevel: 2,
    roast: '本届外交系岗位离奇空缺两次（外长、中联部长），王毅两度「回锅」救场。',
  },
  {
    id: 'pla', name: '军方', emoji: '🎖️', color: '#33691e',
    origin: '解放军高级将领。',
    status: '大清洗中', statusLevel: 0,
    roast: '本届中央军委编制 7 人，截至 2026 年 10 月仅剩 2 人在岗。',
  },
];

CP.factionById = {};
CP.factions.forEach(function (f) { CP.factionById[f.id] = f; });
