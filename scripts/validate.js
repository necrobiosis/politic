#!/usr/bin/env node
/* 数据完整性校验：node scripts/validate.js */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const ctx = { console };
ctx.window = ctx; // 浏览器里 window 即全局对象
vm.createContext(ctx);
['places', 'factions', 'departments', 'people', 'changelog', 'glossary'].forEach((f) => {
  vm.runInContext(fs.readFileSync(path.join(root, 'js/data', f + '.js'), 'utf8'), ctx, { filename: f + '.js' });
});
const CP = ctx.window.CP;
const errors = [];
const warn = [];
const ids = new Set();
const TIERS = ['core', 'psc', 'pb', 'state', 'prov', 'legend', 'fallen'];
const STATUS = ['active', 'retired', 'dead', 'expelled', 'investigated', 'sentenced', 'removed'];

CP.people.forEach((p) => {
  if (!p.id || !p.name) errors.push('人物缺少 id/name: ' + JSON.stringify(p).slice(0, 80));
  if (ids.has(p.id)) errors.push('重复 id: ' + p.id);
  ids.add(p.id);
  if (!TIERS.includes(p.tier)) errors.push(p.id + ': 非法 tier ' + p.tier);
  if (!STATUS.includes(p.status)) errors.push(p.id + ': 非法 status ' + p.status);
  if (p.born && !/^\d{4}(-\d{2})?$/.test(p.born)) errors.push(p.id + ': born 格式应为 YYYY 或 YYYY-MM');
  (p.factions || []).forEach((f) => { if (!CP.factionById[f]) errors.push(p.id + ': 未知派系 ' + f); });
  (p.career || []).forEach((c, i) => {
    if (c.length !== 4 && !(c.length === 5 && c[4] === 'edu')) errors.push(p.id + ': career[' + i + '] 应为 4 项（求学经历可加第 5 项 \'edu\'）');
    if (!CP.placeByCode[c[2]]) errors.push(p.id + ': career[' + i + '] 未知地点 ' + c[2]);
    if (typeof c[0] !== 'number' || (c[1] !== null && typeof c[1] !== 'number')) errors.push(p.id + ': career[' + i + '] 年份格式错误');
    if (c[1] !== null && c[1] < c[0]) errors.push(p.id + ': career[' + i + '] 结束早于开始');
  });
  if (p.tier === 'fallen' && !p.statusNote) warn.push(p.id + ': 已下架人物建议填写 statusNote');
  if (!p.bio) warn.push(p.id + ': 缺少 bio');
  if (!(p.career || []).length) warn.push(p.id + ': 缺少 career');
});
CP.people.forEach((p) => (p.links || []).forEach((l) => { if (!ids.has(l[0])) errors.push(p.id + ': 关系指向未知人物 ' + l[0]); }));
CP.departments.forEach((d) => {
  if (d.head && !ids.has(d.head)) errors.push('部门 ' + d.id + ': 未知一把手 ' + d.head);
  (d.members || []).forEach((m) => { if (!ids.has(m)) errors.push('部门 ' + d.id + ': 未知成员 ' + m); });
  if (d.under && d.under !== 'local' && !ids.has(d.under)) errors.push('部门 ' + d.id + ': 未知 under ' + d.under);
});
CP.places.forEach((pl) => {
  if (pl.sec && !ids.has(pl.sec)) errors.push('地点 ' + pl.code + ': 未知书记 ' + pl.sec);
  if (!pl.special && !pl.sec) warn.push('地点 ' + pl.code + ': 未填写现任书记');
});
const cells = new Set();
CP.places.forEach((pl) => { const k = pl.x + ',' + pl.y; if (cells.has(k)) errors.push('方块地图坐标重叠: ' + pl.code + ' @ ' + k); cells.add(k); });
CP.changelog.forEach((c) => (c.who || []).forEach((w) => { if (!ids.has(w)) errors.push('公告 ' + c.date + ' ' + c.title + ': 未知人物 ' + w); }));

const active = CP.people.filter((p) => p.status === 'active' && ['core', 'psc', 'pb'].includes(p.tier));
console.log('人物 %d · 派系 %d · 部门 %d · 公告 %d · 现任政治局 %d 人', CP.people.length, CP.factions.length, CP.departments.length, CP.changelog.length, active.length);
warn.forEach((w) => console.log('  ⚠ ' + w));
if (errors.length) { errors.forEach((e) => console.error('  ✗ ' + e)); console.error('校验失败：%d 个错误', errors.length); process.exit(1); }
console.log('✓ 数据校验通过');
