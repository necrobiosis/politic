/* 省级单位 + 方块地图坐标（8 列 x 8 行，非真实地理形状，只保留大致方位）
 * code：履历中 place 字段使用的代码
 * x/y ：方块地图坐标
 * sec ：现任党委书记（港澳为行政长官）对应的人物 id
 * 特殊代码：C = 中央机关（北京）；FOREIGN = 驻外
 */
window.CP = window.CP || {};

CP.places = [
  { code: 'C',  short: '中央', name: '中央机关', x: 5, y: 0, special: true, note: '中南海、各部委、军委等中央单位' },
  { code: 'FOREIGN', short: '海外', name: '驻外/海外', x: 0, y: 0, special: true, note: '驻外使领馆等' },

  { code: 'HL', short: '黑', name: '黑龙江', x: 7, y: 0, sec: 'xuqin' },
  { code: 'NM', short: '蒙', name: '内蒙古', x: 4, y: 1, sec: 'wangweizhong' },
  { code: 'BJ', short: '京', name: '北京',   x: 5, y: 1, sec: 'yinli' },
  { code: 'JL', short: '吉', name: '吉林',   x: 7, y: 1, sec: 'huangqiang' },

  { code: 'XJ', short: '新', name: '新疆',   x: 1, y: 2, sec: 'chenxiaojiang' },
  { code: 'GS', short: '甘', name: '甘肃',   x: 2, y: 2, sec: 'wuxiaojun' },
  { code: 'NX', short: '宁', name: '宁夏',   x: 3, y: 2, sec: 'liyifei' },
  { code: 'SX', short: '晋', name: '山西',   x: 4, y: 2, sec: 'tangdengjie' },
  { code: 'HE', short: '冀', name: '河北',   x: 5, y: 2, sec: 'luowen' },
  { code: 'TJ', short: '津', name: '天津',   x: 6, y: 2, sec: 'chenminer' },
  { code: 'LN', short: '辽', name: '辽宁',   x: 7, y: 2, sec: 'xukunlin' },

  { code: 'QH', short: '青', name: '青海',   x: 2, y: 3, sec: 'luodongchuan' },
  { code: 'SN', short: '陕', name: '陕西',   x: 3, y: 3, sec: 'zhaoyide' },
  { code: 'HA', short: '豫', name: '河南',   x: 4, y: 3, sec: 'zhouzuyi' },
  { code: 'SD', short: '鲁', name: '山东',   x: 5, y: 3, sec: 'linwu' },

  { code: 'XZ', short: '藏', name: '西藏',   x: 1, y: 4, sec: 'huchangsheng' },
  { code: 'SC', short: '川', name: '四川',   x: 2, y: 4, sec: 'wangxiaohui' },
  { code: 'CQ', short: '渝', name: '重庆',   x: 3, y: 4, sec: 'yuanjiajun' },
  { code: 'HB', short: '鄂', name: '湖北',   x: 4, y: 4, sec: 'guanzhiou' },
  { code: 'AH', short: '皖', name: '安徽',   x: 5, y: 4, sec: 'lilecheng' },
  { code: 'JS', short: '苏', name: '江苏',   x: 6, y: 4, sec: 'xinchangxing' },
  { code: 'SH', short: '沪', name: '上海',   x: 7, y: 4, sec: 'chenjining' },

  { code: 'YN', short: '云', name: '云南',   x: 2, y: 5, sec: 'mogaoyi' },
  { code: 'GZ', short: '黔', name: '贵州',   x: 3, y: 5, sec: 'xulin' },
  { code: 'HN', short: '湘', name: '湖南',   x: 4, y: 5, sec: 'wangzhijun' },
  { code: 'JX', short: '赣', name: '江西',   x: 5, y: 5, sec: 'yinhong' },
  { code: 'ZJ', short: '浙', name: '浙江',   x: 6, y: 5, sec: 'wanghao' },

  { code: 'GX', short: '桂', name: '广西',   x: 3, y: 6, sec: 'chengang' },
  { code: 'GD', short: '粤', name: '广东',   x: 4, y: 6, sec: 'huangkunming' },
  { code: 'FJ', short: '闽', name: '福建',   x: 5, y: 6, sec: 'zhaolong' },

  { code: 'HI', short: '琼', name: '海南',   x: 3, y: 7, sec: 'fengfei' },
  { code: 'MO', short: '澳', name: '澳门',   x: 4, y: 7, sec: 'samhoifai', sar: true },
  { code: 'HK', short: '港', name: '香港',   x: 5, y: 7, sec: 'johnlee', sar: true },
];

CP.placeByCode = {};
CP.places.forEach(function (p) { CP.placeByCode[p.code] = p; });
