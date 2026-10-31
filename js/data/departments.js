/* 部门图鉴
 * name   ：官方名称          joke ：「中国有限公司」戏称
 * duty   ：正经职能          roast：戏说解读
 * head   ：一把手（人物 id）；headName：无人物卡时直接写名字
 * under  ：在架构图里挂在谁下面（人物 id），'local' 表示地方分公司
 * kind   ：party 党 / state 政 / military 军 / npc 人大 / cppcc 政协
 */
window.CP = window.CP || {};

CP.departments = [
  // ===== 顶层 =====
  {
    id: 'pbsc', kind: 'party', name: '中央政治局常务委员会', joke: '董事会常务委员会（7 人群聊）',
    head: 'xijinping', members: ['liqiang', 'zhaoleji', 'wanghuning', 'caiqi', 'dingxuexiang', 'lixi'],
    duty: '中央政治局闭会期间行使其职权，是中国实际上的最高决策机构。成员排名即权力顺位。',
    roast: '全中国最小、最重要的群聊。群成员从 2002 年的 9 人（「九龙治水」）精简到 2012 年后的 7 人。群主发言后，其余成员通常回复「坚决拥护」。',
  },
  {
    id: 'pb', kind: 'party', name: '中央政治局', joke: '董事会（编制 24 席，现坐 22 人）',
    head: 'xijinping',
    duty: '由中央委员会全体会议选举产生，在中央委员会闭会期间行使其职权。成员为「副国级」。',
    roast: '本届董事会开局 24 席，先后有 3 位董事被请出会议室（何卫东、马兴瑞、张又侠），2026 年五中全会补进 1 位（张升民），这是 2012 年以来首次中途增补。',
  },
  {
    id: 'cc', kind: 'party', name: '中央委员会', joke: '股东代表大会（205 名中央委员 + 171 名候补）',
    head: 'xijinping',
    duty: '党代会闭会期间的领导机关，每年召开一次左右全体会议（「X 中全会」），选举政治局、追认重大人事处分。',
    roast: '每次开全会都要先「递补」——候补委员转正，因为又有人空出位置了。2026 年五中全会一次性追认开除 33 人，创历史纪录。',
  },

  // ===== 习近平直管 =====
  {
    id: 'cmc', kind: 'military', name: '中央军事委员会', joke: '安保部（编制 7 人，现存 2 人）',
    head: 'xijinping', members: ['zhangshengmin'], under: 'xijinping',
    duty: '领导全国武装力量。实行主席负责制，党的军委与国家军委「一个机构两块牌子」。',
    roast: '本届开局 7 人：主席 + 2 副主席 + 4 委员。截至 2026 年 10 月，除主席外仅剩副主席张升民一人，其余 5 席全部「已下架」。这大概是全世界最难保住的工位。',
  },
  {
    id: 'waiban', kind: 'party', name: '中央外事工作委员会办公室 / 外交部', joke: '国际业务部（兼「战狼」公关）',
    head: 'wangyi', under: 'xijinping',
    duty: '中央外事工作委员会的办事机构，统筹外交政策；外交部负责具体外交事务。王毅身兼两职。',
    roast: '外交部长岗位本届出现过「上任 207 天即消失」的奇观（秦刚），由老部长王毅回锅救场。发言人每天下午 3 点准时营业，金句频出。',
  },

  // ===== 李强：国务院 =====
  {
    id: 'gwy', kind: 'state', name: '国务院', joke: '运营中心（职业经理人团队）',
    head: 'liqiang', under: 'liqiang',
    members: ['dingxuexiang', 'helifeng', 'zhangguoqing', 'liuguozhong', 'wangxiaohong', 'wuzhenglong', 'shenyiqin'],
    duty: '中央人民政府，最高国家行政机关。总理领导，下设副总理 4 人、国务委员若干、26 个组成部门。',
    roast: 'CEO 李强带队，负责「把董事会的战略落地」。近年许多经济议题由党中央各「委员会」直接拍板，运营中心更像执行层。',
  },
  {
    id: 'fgw', kind: 'state', name: '国家发展和改革委员会', joke: '战略规划部（人称「小国务院」）',
    headName: '郑栅洁', under: 'liqiang',
    duty: '拟定五年规划、审批重大项目、管理价格与产业政策。',
    roast: '五年规划的执笔人。以前全国各地的项目都要来这里盖章，素有「跑部钱进」之说。',
  },
  {
    id: 'pboc', kind: 'state', name: '中国人民银行', joke: '货币政策部（不是印钞厂，印钞厂是它下属）',
    headName: '潘功胜', under: 'liqiang',
    duty: '中央银行，制定和执行货币政策，防范系统性金融风险。',
    roast: '每次降准降息前，全国股民都会集体变成「行长微表情分析师」。',
  },
  {
    id: 'nfra', kind: 'state', name: '国家金融监督管理总局', joke: '金融风控部（一把手岗位本身风险偏高）',
    headName: '丁向群', under: 'liqiang',
    duty: '2023 年在原银保监会基础上组建，统一监管银行、保险等除证券业外的金融业。',
    roast: '首任局长李云泽 2026 年 4 月被免职，此后被撤销党内职务；继任者丁向群是该局首位女性局长。负责风控的部门先出了风险事件。',
  },
  {
    id: 'mps', kind: 'state', name: '公安部', joke: '治安运维部',
    head: 'wangxiaohong', under: 'liqiang',
    duty: '主管全国公安工作。部长王小洪兼任国务委员。',
    roast: '部长是习近平在福州时期的老部下，信任度满格。',
  },
  {
    id: 'mss', kind: 'state', name: '国家安全部', joke: '反间谍部（兼最会整活的公众号）',
    head: 'chenyixin', under: 'liqiang',
    duty: '负责反间谍、国家安全情报工作。',
    roast: '长期神秘低调，2023 年开通微信公众号后画风突变，文案活泼、梗多，被网友称为「最有网感的部委」。',
  },
  {
    id: 'mnd', kind: 'state', name: '国防部', joke: '对外发言窗口（部长不进军委）',
    head: 'dongjun', under: 'liqiang',
    duty: '国务院组成部门，主要负责军事外交与对外发言；实际指挥权在中央军委。',
    roast: '前两任部长魏凤和、李尚福相继被开除党籍。现任部长董军至今未进入中央军委，在军委都快空了的情况下尤显微妙。',
  },
  {
    id: 'caijing', kind: 'party', name: '中央财经委员会办公室 / 中央金融委员会办公室', joke: '战略财务部',
    head: 'helifeng', under: 'liqiang',
    duty: '中央财经、金融两个委员会的办事机构，经济与金融重大决策的「操盘手」。何立峰兼两办主任。',
    roast: '中美贸易谈判桌对面坐着的那位，就是这里的主任。',
  },

  // ===== 赵乐际：人大 =====
  {
    id: 'npc', kind: 'npc', name: '全国人民代表大会常务委员会', joke: '股东大会常设机构（举手表决部）',
    head: 'zhaoleji', under: 'zhaoleji', members: ['lihongzhong'],
    duty: '宪法规定的最高国家权力机关的常设机关，负责立法、任免国务院组成人员、罢免人大代表等。',
    roast: '重要法律和人事案以高票通过为常态，外媒常称「橡皮图章」。不过「罢免人大代表」这项业务近年相当繁忙。',
  },

  // ===== 王沪宁：政协 + 统战 =====
  {
    id: 'cppcc', kind: 'cppcc', name: '中国人民政治协商会议全国委员会', joke: '顾问委员会（茶话会）',
    head: 'wanghuning', under: 'wanghuning', members: ['shitaifeng', 'huchunhua'],
    duty: '统一战线组织，各民主党派、无党派人士、各界代表协商议政的机构，没有立法权。',
    roast: '「政治落脚点」的代名词。曾被视为隔代接班人的胡春华，2022 年后就在这里任副主席。',
  },
  {
    id: 'tzb', kind: 'party', name: '中央统一战线工作部', joke: '外联 BD 部（朋友圈运营）',
    head: 'liganjie', under: 'wanghuning',
    duty: '负责与民主党派、无党派人士、民族宗教、港澳台及海外华人等方面的「统一战线」工作。',
    roast: '朋友圈最广的部门：民主党派、宗教界、民营企业家、海外侨胞……都在它的好友列表里。2025 年与中组部「对调」部长，罕见。',
  },

  // ===== 蔡奇：书记处 + 中办 + 党务部门 =====
  {
    id: 'sjc', kind: 'party', name: '中央书记处', joke: '董事会秘书处',
    head: 'caiqi', under: 'caiqi', members: ['shitaifeng', 'lishulei', 'liganjie', 'chenwenqing'],
    duty: '中央政治局和常委会的办事机构，负责处理党中央日常工作。',
    roast: '组织、宣传、统战、政法几大部门的一把手都在这里「打卡」，蔡奇是值班经理。',
  },
  {
    id: 'zb', kind: 'party', name: '中共中央办公厅', joke: '总裁办（大内总管）',
    head: 'caiqi', under: 'caiqi',
    duty: '负责中央领导的文件、会议、安全保卫、日常运转。主任通常是总书记最信任的人。',
    roast: '离权力中心物理距离最近的部门。前主任丁薛祥升任常委，现主任蔡奇同时管着书记处——「总裁办主任兼董秘」。',
  },
  {
    id: 'zzb', kind: 'party', name: '中央组织部', joke: '人力资源部（全国 1 亿党员的 HR）',
    head: 'shitaifeng', under: 'caiqi',
    duty: '管理干部的选拔、任用、考核，尤其是「中管干部」（约 3000 名副部级以上官员）。',
    roast: '全世界最大的 HR 部门。它发一纸通知，就是一位省委书记的「工作调动」。2025 年 4 月部长从李干杰换成石泰峰。',
  },
  {
    id: 'xcb', kind: 'party', name: '中央宣传部', joke: '品牌公关部（兼内容审核）',
    head: 'lishulei', under: 'caiqi',
    duty: '主管意识形态、新闻出版、电影、舆论引导。',
    roast: '管着新闻、出版、电影和「正能量」。热搜上什么能出现、什么不能出现，最终都和这里有关。',
  },
  {
    id: 'llb', kind: 'party', name: '中央对外联络部', joke: '国际友商关系部（专跟外国政党交朋友）',
    head: 'liuhaixing', under: 'caiqi',
    duty: '负责中共与世界各国政党的交往。',
    roast: '前部长刘建超 2025 年夏天出访回国后再未露面，曾被视为外长热门人选。',
  },
  {
    id: 'zfw', kind: 'party', name: '中央政法委员会', joke: '法务与安保统筹中心',
    head: 'chenwenqing', under: 'caiqi',
    duty: '领导公安、检察院、法院、司法行政、国安等政法工作。',
    roast: '周永康时代曾是「第二权力中心」，2012 年后被降级——书记不再由常委担任。',
  },
  {
    id: 'shgzb', kind: 'party', name: '中央社会工作部', joke: '社区与群众工作部（2023 新设）',
    under: 'caiqi',
    duty: '2023 年机构改革新设，统筹信访、基层治理、「两新」组织（新经济、新社会组织）党建等。',
    roast: '把信访局收编了进来。外卖小哥、快递员的党建，也归这里管。',
  },
  {
    id: 'wxb', kind: 'party', name: '中央网络安全和信息化委员会办公室', joke: '防火墙运维部 / 网络风控部',
    under: 'caiqi',
    duty: '负责互联网信息内容管理、网络安全、数据安全。',
    roast: '你打开某个网站转圈圈的时候，可以想想这个部门。',
  },
  {
    id: 'dx', kind: 'party', name: '中共中央党校（国家行政学院）', joke: '企业大学 / 管培生训练营',
    under: 'caiqi',
    duty: '轮训全国中高级干部的最高学府。',
    roast: '习近平 2007–2012 年曾兼任校长。石泰峰、李书磊都从这里出发——「讲师逆袭」。',
  },
  {
    id: 'zys', kind: 'party', name: '中央政策研究室', joke: '首席思想官办公室（智库）',
    under: 'caiqi',
    duty: '为中央起草重要文件、研究理论与政策。',
    roast: '王沪宁的「老巢」，他在这里当了 18 年主任。「三个代表」「科学发展观」「中国梦」的文字工作都与此有关。',
  },

  // ===== 丁薛祥 =====
  {
    id: 'kjw', kind: 'party', name: '中央科技委员会', joke: '研发中心（2023 新设）',
    head: 'dingxuexiang', under: 'dingxuexiang',
    duty: '2023 年机构改革新设，统筹科技体制改革与关键核心技术攻关（芯片等「卡脖子」领域）。',
    roast: '专治「卡脖子」。一位材料工程师出身的常务副总理在这里正好对口。',
  },

  // ===== 李希 =====
  {
    id: 'zjw', kind: 'party', name: '中央纪律检查委员会 / 国家监察委员会', joke: '内审合规部（俗称「喝茶部」）',
    head: 'lixi', under: 'lixi',
    duty: '党的纪律检查机关与国家监察机关合署办公，负责查处违纪违法，可对公职人员采取「留置」措施。',
    roast: '本站「已下架」区的主要供货商。被它请去「喝茶」的人，回来时大多换了卡面。',
  },

  // ===== 国家副主席 =====
  {
    id: 'vp', kind: 'state', name: '国家副主席', joke: '副董事长（礼宾专员）',
    head: 'hanzheng', under: 'xijinping',
    duty: '协助国家主席工作，受主席委托代行部分职权，常出席外事礼仪活动。',
    roast: '韩正以「退休常委」身份出任，不在政治局，属于「荣誉返聘」。',
  },
];

CP.deptById = {};
CP.departments.forEach(function (d) { CP.deptById[d.id] = d; });
