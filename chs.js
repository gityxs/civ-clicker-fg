/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com
 @idle games : http://www.gityx.com
 @QQ Group : 627141737

*/

//1.汉化杂项
var cnItems = {
    _OTHER_: [],

    //未分类：
    'Save': '保存',
    'Export': '导出',
    'Import': '导入',
    'Settings': '设置',
    'Achievements': '成就',
    'Statistics': '统计',
    'Changelog': '更新日志',
    'Hotkeys': '快捷键',
    'ALL': '全部',
    'Default': '默认',
    'AUTO': '自动',
    'default': '默认',
    "points": "点数",
    "Reset for +": "重置得到 + ",
    "Currently": "当前",
    "Effect": "效果",
    "Cost": "成本",
    "Goal:": "目标:",
    "Reward": "奖励",
    "Start": "开始",
    "Exit Early": "提前退出",
    "Finish": "完成",
    "Milestone Gotten!": "获得里程碑！",
    "Milestones": "里程碑",
    "Completed": "已完成",
    "Achievement Gotten!": "成就达成！",
    "to reset\n                                            to get them all), your old deities and some of their upgrades \n                                            (the Pantheon Upgrades section lists the permanent ones), your \n                                            wonders, and your cats.": "重置\n 以获得全部）、你的旧神和他们的一些升级\n（万神殿升级部分列出了永久的）、你的\n奇迹和你的猫。",
    "A Feast for Crows": "乌鸦的盛宴",
    "Abide No Waste": "坚持不浪费",
    "Administration": "行政",
    "Aesthetics": "美学",
    "Allows 1 Blacksmith": "允许 1 铁匠",
    "Allows 1 Cleric": "允许 1 名牧师",
    "Allows 1 Healer": "允许 1 个治疗者",
    "Allows 1 Tanner": "允许 1 个制革商",
    "Allows 10 Cavalry": "允许 10 骑兵",
    "Allows 10 Soldiers": "允许 10 名士兵",
    "and build another": "并建造另一个",
    "Angry": "生气",
    "Apothecaries": "药剂师",
    "Architecture": "建筑学",
    "Army": "军队",
    "Automatically cut Wood": "自动砍伐木材",
    "Automatically harvest Food": "自动收获食物",
    "Automatically mine Stone": "自动开采石头",
    "Autosave": "自动保存",
    "Autosaved": "自动保存",
    "Bandits": "土匪",
    "Barbarians": "野蛮人",
    "Barns": "谷仓",
    "Barns store double the amount of Food": "谷仓储存双倍数量的食物",
    "Barracks": "兵营",
    "Basic Shields": "基本盾牌",
    "Basic Weaponry": "基础武器",
    "Battle": "战斗",
    "Battle Standard": "战旗",
    "Begin worshipping a deity": "开始崇拜神",
    "Blacksmiths": "铁匠",
    "Blessing of Abundance": "丰盛的祝福",
    "Blissful": "幸福",
    "Boost Food production by sacrificing 1 Worker/sec": "通过牺牲 1 名工人/秒来提高粮食产量",
    "Build 1 Siege Engine": "建造 1 个攻城引擎",
    "Build 1 Wonder": "建造 1 个奇迹",
    "Build 1 Wonder and gain manually less than 23 resources": "建造 1 个奇迹并手动获得少于 23 个资源",
    "Build 7 Wonder": "建造 7 奇迹",
    "Build Altar": "建造祭坛",
    "Build Mills": "建造工厂",
    "Build Stables": "建造马厩",
    "Building Temples increases happiness": "建造寺庙增加幸福感",
    "Buildings": "建筑物",
    "Burn Wicker Man": "烧柳条人",
    "But if I reset, don't I lose everything?": "但是如果我重置，我不会失去一切吗？",
    "Butchering": "屠宰",
    "Buy Resources for": "购买资源",
    "by low": "由低",
    "by low resources": "由于资源不足",
    "Can I buy bonuses for old deities?": "我可以为老神购买奖金吗？",
    "Can I play my save games on later versions?": "我可以在更高版本上玩我保存的游戏吗？",
    "Cat!": "猫！",
    "Cats": "猫",
    "Cats help heal the Sick": "猫帮助治愈病人",
    "Cavalry": "骑兵",
    "Cease Walking": "停止行走",
    "CivClicker by FG": "文明点击FG",
    "CivClicker was originally built by": "CivClicker 最初由",
    "Civil Service": "公务员",
    "Clerics": "神职人员",
    "Clowder": "克劳德",
    "Code of Laws": "法典",
    "Collect Ore more frequently": "更频繁地收集矿石",
    "Collect Skins more frequently": "更频繁地收集皮肤",
    "Comfort of the Hearthfires": "炉火的舒适",
    "Commerce": "商业",
    "Conquer more lands from your neighbors": "从你的邻居那里征服更多的土地",
    "Conquest": "征服",
    "Construction": "建造",
    "Contains 100 Graves": "包含 100 个坟墓",
    "Content": "满足",
    "Convert Ore to Metal": "将矿石转化为金属",
    "Convert Skins to Leather": "将皮肤转换为皮革",
    "Cookie Clicker": "无尽的饼干",
    "corpse": "尸体",
    "corpse are less likely to cause illness": "尸体不太可能引起疾病",
    "Cottages": "小屋",
    "Create Siege Engines": "创建攻城引擎",
    "Crop Rotation": "轮作",
    "Cure Sick Workers": "治愈生病的工人",
    "Currency": "货币",
    "Current Deity": "现任神祇",
    "Current Wonder": "当前奇迹",
    "cut": "砍伐",
    "Defending enemy troops": "保卫敌军",
    "Deity": "神",
    "Delete Save File": "删除保存文件",
    "Destroy enemy fortifications": "摧毁敌人的防御工事",
    "Destroy your Fortifications": "摧毁你的防御工事",
    "Devotion": "奉献",
    "Discord": "Discord",
    "Domestication": "驯化",
    "Domination": "统治",
    "Eat your Workers": "吃掉你的工人",
    "Empire": "帝国",
    "Enemies do less damage": "敌人造成的伤害更少",
    "Enemies Slain": "消灭敌人",
    "Engineer": "工程师",
    "Events": "事件",
    "Extraction": "萃取",
    "Farmers": "农民",
    "Farmers can collect Skins": "农民可以收集皮肤",
    "Fertilisers": "肥料",
    "Feudalism": "封建",
    "Fields": "田地",
    "Finding out is part of the fun!": "发现是乐趣的一部分！",
    "Flensing": "弗伦辛",
    "Food": "食物",
    "For Glory!": "为了荣耀！",
    "If you want people, you'll need to have enough food to support \n                                            them, and they will need to have a place to live. Make sure you \n                                            have enough food and at least a tent or wooden hut to start with.": "如果你想要人，你需要有足够的食物来养活他们，他们需要有住的地方。 确保您\n 有足够的食物和至少一个帐篷或木屋开始。",
    "for part of 2014.\n                                                Since then no new updates have been made to the": "2014 年的部分时间。\n 从那时起，没有对",
    "For the moment, happiness is boosted by victorious raids, or \n                                            if you have Aesthetics, by building lots of temples.": "目前，胜利的突袭会增加幸福感，或者\n如果你有美学，则可以通过建造大量的神殿来提升幸福感。",
    "for the next": " 下一个",
    "forked it on": "fork它在",
    "Fortifications": "工事",
    "Freddec": "Freddec",
    "Freddec Games": "Freddec游戏",
    "Frederic Deconinck": "Frederic Deconinck",
    "Free lands": "空闲土地",
    "Full House": "客满",
    "Further increase basic resources from clicking": "进一步增加点击基础资源",
    "gain piety with deaths": "用死亡获得虔诚",
    "Gardening": "园艺",
    "Generate Piety, bury Corpses": "产生虔诚，埋葬尸体",
    "Getting Started": "入门",
    "Ghost Town": "鬼城",
    "Github": "Github",
    "GitHub": "GitHub",
    "Give temporary boost to food production": "暂时促进粮食生产",
    "Glaring": "刺眼",
    "Glory:": "荣耀：",
    "Gold": "黄金",
    "Grace": "优雅",
    "Granaries": "粮仓",
    "Graveyards": "墓地",
    "graveyards increase cleric piety generation": "墓地增加牧师虔诚生成",
    "Guilds": "公会",
    "Hamlet": "小村庄",
    "Happiness": "幸福",
    "Happy": "快乐",
    "harvest": "收获",
    "Harvesting": "收获",
    "Hated": "讨厌",
    "Have an happiness equals to 'Angry'": "幸福等于“生气”",
    "Have an happiness equals to 'Blissful'": "拥有幸福等于“幸福”",
    "Have more sick Workers than healthy Workers": "患病工人多于健康工人",
    "Have no worker with 1000 housing": "1000套住房无工人",
    "Healers": "治疗师",
    "Help": "帮助",
    "Helps protect against attack": "帮助防御攻击",
    "Herbs": "草药",
    "History": "历史",
    "Home": "首页",
    "Horseback Riding": "骑马",
    "Houses": "房屋",
    "Houses support +2 Worker": "房屋支持 +2 工人",
    "How do I get gold?": "我如何获得黄金？",
    "How do I get more cats?": "如何获得更多的猫？",
    "How do I get more deities?": "怎么获得更多神器？",
    "How do I get started?": "我该如何开始？",
    "I don't seem to be making any progress on my wonder. \n                                            Am I doing it right?": "我的奇迹似乎没有任何进展。 \n 我做得对吗？",
    "I made a worker, but they died straight away!": "我做了一个工人，但他们直接死了！",
    "Iconoclasm": "偶像破坏",
    "Idle workers": "空闲工人",
    "Idle Workers increase resources from clicking": "Idle Workers 通过点击增加资源",
    "Import / Export Save Data": "导入/导出保存数据",
    "Improve Soldiers": "提升士兵",
    "Improves Farmers": "改善农民",
    "in 2013-14. She stated she didn't intend\n                                                to develop it further, so it was then maintained by": "2013-14 年。她说她不打算进一步开发它，所以它由",
    "In 2022,": "2022年，",
    "In pre-industrial society, farmers operated at barely above subsistence level, so the numbers aren't actually too far off real life. With lots of upgrades and mills, the efficiency of farmers improves significantly.": "在前工业社会中，农民的经营仅略高于自给水平，因此这些数字实际上与现实生活相差不远。通过大量升级和磨坊，农民的效率显着提高。",
    "Increase basic resources from clicking": "点击增加基础资源",
    "Increase chance to get Cats": "增加获得猫的机会",
    "Increase Cleric Piety generation": "增加牧师虔诚生成",
    "Increase Farmer Food output": "增加农民粮食产量",
    "Increase happiness": "增加幸福感",
    "Increase land gained from raiding": "增加从掠夺中获得的土地",
    "Increase special resources from clicking": "通过点击增加特殊资源",
    "Increase wonder progress": "增加奇迹进度",
    "Insubstantial spirits": "虚幻的精神",
    "Irrigation": "灌溉",
    "It is a mystery.": "这是一个谜。",
    "Katherine Stark": "Katherine Stark",
    "Labourers": "劳工",
    "Lament of the Defeated": "战败者的哀叹",
    "Large City": "大城市",
    "Large Nation": "大国",
    "Large Town": "大城镇",
    "Later versions will probably have to break savegame compatibility, in order\n                                            to add new features.": "以后的版本可能不得不破坏存档游戏的兼容性，以便\n 添加新功能。",
    "Leather": "皮革",
    "Lets you build an army": "让你建立一支军队",
    "Limited": "有限的",
    "Loaded saved game from local storage": "从本地存储加载保存的游戏",
    "Loved": "喜欢",
    "Luke Nickerson": "Luke Nickerson",
    "Lure of Civilisation": "文明的诱惑",
    "Macerating": "浸渍",
    "made in a remake of the Luke's version on": "重制 Luke 的版本",
    "Mansions": "豪宅",
    "Manual Save": "手动保存",
    "Masonry": "石工",
    "Mathematics": "数学",
    "Max": "最大",
    "Merchant": "商人",
    "Metal": "金属",
    "Metropolis": "大都会",
    "Mills": "磨坊",
    "mine": "开采",
    "Miners": "矿工",
    "Miners can collect Ore": "矿工可以收集矿石",
    "More Farmers collect more Skins": "更多农民收集更多皮肤",
    "More Miners collect more Ore": "更多矿工收集更多矿石",
    "More Woodcutters collect more Herbs": "更多的伐木工人收集更多的草药",
    "My people hate me! How can I fix this?": "我的人恨我！我怎样才能解决这个问题？",
    "Naming": "命名",
    "Nation": "国家",
    "Nationalism": "民族主义",
    "need": "需要",
    "Never click": "从不点击",
    "New Release!": "新版本！",
    "New Worker": "新工人",
    "No trader visiting": "没有交易者来访",
    "of": "of",
    "Open the trading post": "打开交易站",
    "Ore": "矿石",
    "Our feline companions": "我们的猫科伙伴",
    "Palisade": "栅栏",
    "Pantheon": "万神殿",
    "Pantheon Upgrades": "万神殿升级",
    "Per invader killed": "每杀死一个入侵者",
    "Pest Control": "除害虫",
    "Piety": "虔诚",
    "Piety to raise the next zombie": "虔诚培养下一个僵尸",
    "Plagued": "困扰",
    "Playing idle games": "在玩 Git游戏：gityx.com",
    "Ploughshares": "犁头",
    "Plunder Resources": "掠夺资源",
    "Prestige": "声望",
    "Progress": "进步",
    "Prospecting": "勘探",
    "Protect from attack": "保护免受攻击",
    "Purchased Upgrades": "购买的升级",
    "Raider": "掠夺者",
    "Raise Dead": "复活",
    "Reduce enemy casualties": "减少敌人伤亡",
    "Reduce unhappiness caused by overcrowding": "减少人满为患带来的不愉快",
    "Remove an old deity to gain gold": "移除旧神以获得金币",
    "Rename Civilisation": "重命名文明",
    "Rename Current Deity": "重命名当前神",
    "Rename Yourself": "重命名自己",
    "repo,\n                                                so": "回购，\n 所以",
    "Reset Game": "重置游戏",
    "Resetting": "重置",
    "Resetting allows you to gain another": "重置可以让你获得另一个",
    "Resource clicks": "资源点击",
    "Riddle of Steel": "钢铁之谜",
    "Ruled by": "统治者 ",
    "Rush 1 wonder": "冲击 1 奇迹",
    "Rushed": "冲",
    "Sacrifice 1 Worker to gain a random bonus to a resource": "牺牲 1 名工人以获得资源的随机奖励",
    "Saving": "保存",
    "Scott Colcord": "Scott Colcord",
    "seconds remain": "还剩几秒",
    "Secrets of the Tombs": "坟墓的秘密",
    "Select All": "全选",
    "Select all deities": "选择所有神",
    "Select the Battle deity": "选择战神",
    "Select the Cats deity": "选择猫神",
    "Select the Fields deity": "选择田野神",
    "Select the Underworld deity": "选择冥界神",
    "Selective Breeding": "选择性育种",
    "Serfs": "农奴",
    "Seven!": "七！",
    "Shades": "阴影",
    "Sick workers": "生病的工人",
    "Siege engines": "攻城引擎",
    "Skinning": "剥皮",
    "Skins": "兽皮",
    "Slaughter, plunder, and burn": "屠杀、掠夺和焚烧",
    "Slaying enemies creates Temples": "杀死敌人创造神殿",
    "Slums": "贫民窟",
    "Small City": "小城市",
    "Small Nation": "小国",
    "Small Town": "小镇",
    "Smite Invaders": "惩击入侵者",
    "Smithies": "铁匠铺",
    "Soldiers": "士兵",
    "Soldiers increase basic resources from clicking": "士兵通过点击增加基础资源",
    "Souls of the defeated rise to fight for you": "战败者的灵魂起来为你而战",
    "SourceForge": "源锻造",
    "Speed Wonder": "速度奇迹",
    "Stables": "马厩",
    "Start Building Wonder": "开始建造奇迹",
    "Stay With Us": "和我们在一起",
    "Steal your resources": "窃取你的资源",
    "Stone": "石头",
    "Stone stockpiles": "石头库存",
    "Successful raids delay future invasions": "成功的突袭延迟了未来的入侵",
    "Summon Shades": "召唤阴影",
    "Tanneries": "制革厂",
    "Tanners": "制革商",
    "Temples": "寺庙",
    "Temporarily makes raids more difficult, increases rewards": "暂时使突袭变得更加困难，增加奖励",
    "Tenements": "物业单位",
    "Tents": "帐篷",
    "The Book of the Dead": "死者之书",
    "The game was strongly inspired by": "游戏受到了强烈的启发",
    "The Wheel": "轮",
    "Thorp": "小乡镇",
    "Throne of Skulls": "骷髅王座",
    "to make some\n                                                improvements and potentially inspire others to contribute.": "做出一些改进并可能激励其他人做出贡献。",
    "To War!": "战争！",
    "too.\n                                                His goal is to make UI changes, and to improve the interface, styling, and fix some bugs. Please feel free to contribute by submitting improvements on his": "\n 他的目标是进行 UI 更改，改进界面、样式和修复一些错误。请随时通过提交对他的改进做出贡献",
    "Total Buildings": "建筑总数",
    "Total Workers": "工人总数",
    "Trade": "交易",
    "Trader offers 1 Gold for": "交易者提供 1 黄金",
    "Traders arrive more frequently, stay longer": "交易员到达更频繁，停留时间更长",
    "Traders marginally more frequent": "交易者稍微频繁",
    "Traders stay longer": "交易者停留时间更长",
    "Underworld": "地狱",
    "Under­world": "黑道",
    "Unfilled Graves": "未填满的坟墓",
    "Unhappy": "不开心",
    "Unlock more buildings and upgrades": "解锁更多建筑和升级",
    "Upgrades": "升级",
    "Use Healers and Herbs to cure them": "使用治疗师和草药来治愈他们",
    "Use resources to build Wonder": "使用资源建造奇迹",
    "v0.018": "v0.018",
    "Victory!": "胜利！",
    "Village": "村庄",
    "Walk Behind the Rows": "走在行后面",
    "Walk:": "走：",
    "Warmth of the Companion": "同伴的温暖",
    "What are all the achievements? How do I get them?": "所有的成就是什么？我如何得到它们？",
    "What was the inspiration for CivClicker?": "CivClicker 的灵感是什么？",
    "Who made this wonderful game?": "谁创造了这个精彩的游戏？",
    "Why do you need so many farmers?": "为什么需要这么多农民？",
    "Win 1 raid": "赢得 1 次突袭",
    "Win 1 raid against all neighbors": "对所有邻居赢得 1 次突袭",
    "Wolves": "狼队",
    "Wonder": "想知道",
    "Wonder Completed! Choose Your Bonus": "奇迹完成！选择您的奖金",
    "Wonders": "奇迹",
    "Wood": "木头",
    "Wood stockpiles": "木材库存",
    "Woodcutters": "伐木工人",
    "Woodcutters can collect Herbs": "伐木工人可以收集草药",
    "Wooden huts": "木屋",
    "Workers": "工作人员",
    "Workers eat food. Do you have enough spare?": "工人们吃东西。你有足够的备用吗？",
    "workers per second": "每秒工人数",
    "Workers will eat Corpses if there is no Food left": "如果没有食物，工人将吃尸体",
    "Worship": "崇拜",
    "Writing": "写作",
    "You can only buy upgrades for your current deity. You'll be \n                                            able to do more stuff with old deities in the future.": "您只能为您当前的神购买升级。将来您将能够\n 与旧神一起做更多的事情。",
    "You cannot command an army yet because you don't own a battle standard.\n                                                            Try building a barracks first.": "你还不能指挥军队，因为你没有战旗。\n 试着先建一个兵营。",
    "You do not yet own a trading post.\n                                                            Try trading with a trader when they randomly appear.": "您还没有交易站。\n 尝试与随机出现的交易员进行交易。",
    "You get to keep your achievements (you": "你可以保持你的成就（你",
    "You may select only one domain for your deity": "你只能为你的神选择一个领域",
    "You need a lot of labourers and a lot of every kind of resource. \n                                            Really a lot.": "你需要大量的劳动力和大量的各种资源。 \n 真的很多。",
    "You need to trade for it with the traders who show up randomly.": "您需要与随机出现的交易者进行交易。",
    "You'll need to reset your game; you get one deity per \n                                            playthrough (collect them all!).": "您需要重置游戏；每次 \n 通关你都会获得一位神灵（全部收集！）。",
    "Your civilization does not yet worship a deity. \n                                                                            You need to increase piety by assigning clerics at a temple.": "你们的文明还没有崇拜神。 \n 你需要通过在寺庙分配牧师来增加虔诚。",
    "Your mounted raiders": "你的骑兵袭击者",
    "Your raiding party": "你的突击队",
    "Your underworld raiding party": "你的黑道突袭队",
    "Zombie": "僵尸",
    "Found Skin while harvesting": "收获时发现兽皮",
    "Imported saved game": "存档已导入",
    "Skin": "兽皮",
    "Zombies": "僵尸",
    "Corpse": "尸体",
    "A Worker starved to death": "一个工人饿死了",
    "HINT:": "提示：",
    "Close": "关闭",
    "Farmer eaten by Wolf": "农夫被狼吃掉了",
    "Farmer eaten by Wolves": "农夫被狼群吃掉了",
    "A sick Farmer dies": "一个生病的农民死了",
    "Miner eaten by Wolf": "矿工被狼吃掉了",
    "Miner eaten by Wolves": "矿工被狼群吃掉了",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    // 图标代码，不能汉化
    "Jacorb's Games": "Jacorb's Games",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "By Jacorb90": "By Jacorb90",
    "content_copy": "content_copy",
    "library_books": "library_books",
    "discord": "discord",
    "drag_handle": "drag_handle",
    "edit": "edit",
    "forum": "forum",
    "content_paste": "content_paste",
    "delete": "delete",
    "info": "info",
    "settings": "settings",

    //树游戏
    'Loading...': '加载中...',
    'ALWAYS': '一直',
    'HARD RESET': '硬重置',
    'Export to clipboard': '导出到剪切板',
    'INCOMPLETE': '不完整',
    'HIDDEN': '隐藏',
    'AUTOMATION': '自动',
    'NEVER': '从不',
    'ON': '打开',
    'OFF': '关闭',
    'SHOWN': '显示',
    'Play Again': '再次游戏',
    'Keep Going': '继续',
    'The Modding Tree Discord': '模型树Discord',
    'You have': '你有',
    'It took you {{formatTime(player.timePlayed)}} to beat the game.': '花费了 {{formatTime(player.timePlayed)}} 时间去通关游戏.',
    'Congratulations! You have reached the end and beaten this game, but for now...': '恭喜你！ 您已经结束并通关了本游戏，但就目前而言...',
    'Main Prestige Tree server': '主声望树服务器',
    'Reach {{formatWhole(ENDGAME)}} to beat the game!': '达到 {{formatWhole(ENDGAME)}} 去通关游戏!',
    "Loading... (If this takes too long it means there was a serious error!": "正在加载...（如果这花费的时间太长，则表示存在严重错误！",
    'Loading... (If this takes too long it means there was a serious error!)←': '正在加载...（如果时间太长，则表示存在严重错误！）←',
    'Main\n\t\t\t\tPrestige Tree server': '主\n\t\t\t\t声望树服务器',
    'The Modding Tree\n\t\t\t\t\t\t\tDiscord': '模型树\n\t\t\t\t\t\t\tDiscord',
    'Please check the Discord to see if there are new content updates!': '请检查 Discord 以查看是否有新的内容更新！',
    'aqua': '水色',
    'AUTOMATION, INCOMPLETE': '自动化，不完整',
    'LAST, AUTO, INCOMPLETE': '最后，自动，不完整',
    'NONE': '无',
    'P: Reset for': 'P: 重置获得',
    'Git游戏': 'Git游戏',
    'QQ群号': 'QQ群号',
    'x': 'x',
    'QQ群号:': 'QQ群号:',
    '* 启用后台游戏': '* 启用后台游戏',
    '更多同类游戏:': '更多同类游戏:',
    '': '',
    '': '',
    '': '',

}


//需处理的前缀
var cnPrefix = {
    "\n": "\n",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": "",
    //树游戏
    "\t\t\t": "\t\t\t",
    "\n\n\t\t": "\n\n\t\t",
    "\n\t\t": "\n\t\t",
    "\t": "\t",
    "Show Milestones: ": "显示里程碑：",
    "Autosave: ": "自动保存: ",
    "Offline Prod: ": "离线生产: ",
    "Completed Challenges: ": "完成的挑战: ",
    "High-Quality Tree: ": "高质量树贴图: ",
    "Offline Time: ": "离线时间: ",
    "Theme: ": "主题: ",
    "Anti-Epilepsy Mode: ": "抗癫痫模式：",
    "In-line Exponent: ": "直列指数：",
    "Single-Tab Mode: ": "单标签模式：",
    "Time Played: ": "已玩时长：",
    "Shift-Click to Toggle Tooltips: ": "Shift-单击以切换工具提示：",
    "Achievement Unlocked: ": "成就解锁：",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需处理的后缀
var cnPostfix = {
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "  ",
    " ": " ",
    "\n": "\n",
    "\n\t\t\t": "\n\t\t\t",
    "\t\t\n\t\t": "\t\t\n\t\t",
    "\t\t\t\t": "\t\t\t\t",
    "\n\t\t": "\n\t\t",
    "\t": "\t",
    "This is this version you are playing.": "这是你正在玩的这个版本。",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^(\d+)$/,
    /^\s*$/, //纯空格
    /^([\d\.]+):([\d\.]+)$/,
    /^([\d\.]+):([\d\.]+):([\d\.]+)$/,
    /^([\d\.]+)\-([\d\.]+)\-([\d\.]+)$/,
    /^([\d\.]+)e(\d+)$/,
    /^([\d\.]+)$/,
    /^\(([\d\.]+)\)$/,
    /^([\d\.]+)\%$/,
    /^([\d\.]+)\/([\d\.]+)$/,
    /^\(([\d\.]+)\/([\d\.]+)\)$/,
    /^成本(.+)$/,
    /^\(([\d\.]+)\%\)$/,
    /^([\d\.]+):([\d\.]+):([\d\.]+)$/,
    /^([\d\.]+)K$/,
    /^([\d\.]+)M$/,
    /^([\d\.]+)B$/,
    /^([\d\.]+) K$/,
    /^([\d\.]+) M$/,
    /^([\d\.]+) B$/,
    /^\+([\d\.]+) \/s$/,
    /^\-([\d\.]+) \/s$/,
    /^([\d\.]+)s$/,
    /^([\d\.]+)x$/,
    /^x([\d\.]+)$/,
    /^([\d\.,]+)$/,
    /^\/([\d\.,]+)$/,
    /^\+([\d\.,]+)$/,
    /^\-([\d\.,]+)$/,
    /^([\d\.,]+)x$/,
    /^x([\d\.,]+)$/,
    /^([\d\.,]+) \/ ([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+)$/,
    /^e([\d\.]+)e([\d\.,]+)$/,
    /^x([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+)x$/,
    /^[\u4E00-\u9FA5]+$/
];
var cnExcludePostfix = [
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
//换行加空格：\n(.+)
var cnRegReplace = new Map([
    [/^([\d\.]+) hours ([\d\.]+) minutes ([\d\.]+) seconds$/, '$1 小时 $2 分钟 $3 秒'],
    [/^You are gaining (.+) elves per second$/, '你每秒获得 $1 精灵'],
    [/^You have (.+) points$/, '你有 $1 点数'],
    [/^Next at (.+) points$/, '下一个在 $1 点数'],
    [/^Have (.+) Cat$/, '拥有 $1 猫'],
    [/^Have (.+) Cats$/, '拥有 $1 猫'],
    [/^Have (.+) Workers$/, '拥有 $1 工人'],
    [/^Have (.+) Gold$/, '拥有 $1 黄金'],
	[/^([\d\.]+)\/sec$/, '$1\/秒'],
	[/^([\d\.,]+)\/sec$/, '$1\/秒'],
	[/^([\d\.,]+) OOMs\/sec$/, '$1 OOMs\/秒'],
	[/^([\d\.]+) OOMs\/sec$/, '$1 OOMs\/秒'],
	[/^([\d\.]+)e([\d\.,]+)\/sec$/, '$1e$2\/秒'],
    [/^requires ([\d\.]+) more research points$/, '需要$1个研究点'],
    [/^([\d\.]+)e([\d\.,]+) points$/, '$1e$2 点数'],
    [/^([\d\.]+) elves$/, '$1 精灵'],
    [/^([\d\.]+)d ([\d\.]+)h ([\d\.]+)m$/, '$1天 $2小时 $3分'],
    [/^([\d\.]+)e([\d\.,]+) elves$/, '$1e$2 精灵'],
    [/^([\d\.,]+) Workers got sick$/, '$1 工人生病了'],
    [/^([\d\.,]+) Wolf attacked$/, '$1 只狼来袭'],
    [/^([\d\.,]+) Wolves attacked$/, '$1 只狼来袭'],
    [/^([\d\.,]+) Herbs$/, '$1 草药'],
    [/^([\d\.,]+) Wood$/, '$1 木头'],
    [/^([\d\.,]+) Stone$/, '$1 石头'],
    [/^([\d\.,]+) Food$/, '$1 食物'],
    [/^([\d\.,]+) Ore$/, '$1 矿石'],
    [/^([\d\.,]+) Metal$/, '$1 金属'],
    [/^([\d\.,]+) second$/, '$1 秒'],
    [/^([\d\.,]+) seconds$/, '$1 秒'],
    [/^([\d\.,]+) Leather$/, '$1 皮革'],
    [/^([\d\.,]+) Skins$/, '$1 兽皮'],
    [/^([\d\.,]+) elves$/, '$1 精灵'],
    [/^\+([\d\.,]+) Devotion$/, '\+$1 奉献'],
    [/^\+([\d\.,]+) max Worker$/, '\+$1 工人上限'],
    [/^\+([\d\.,]+) Wood storage$/, '\+$1 木头存储上限'],
    [/^\+([\d\.,]+) Stone storage$/, '\+$1 石头存储上限'],
    [/^\+([\d\.,]+) Food storage$/, '\+$1 食物存储上限'],
    [/^\*(.+) to electricity gain$/, '\*$1 到电力增益'],
    [/^Cost: (.+) points$/, '成本：$1 点数'],
    [/^Req: (.+) elves$/, '要求：$1 精灵'],
    [/^Req: (.+) \/ (.+) elves$/, '要求：$1 \/ $2 精灵'],
    [/^Usages: (\d+)\/$/, '用途：$1\/'],
    [/^workers: (\d+)\/$/, '工人：$1\/'],

]);