import { lonLatToMercator } from '../lib/projection3857';

export type MarkerEffect = 'none' | 'waterfall' | 'smoke' | 'windgust' | 'sandstorm' | 'drizzle' | 'snowfall';

export type PoemMarker = {
  id: string;
  title: string;
  author: string;
  dynasty: string;
  locationName: string;
  lon: number;
  lat: number;
  mercatorX: number;
  mercatorY: number;
  fullText: string;
  summary: string;
  effect?: MarkerEffect;
};

function createPoemMarker(
  base: Omit<PoemMarker, 'mercatorX' | 'mercatorY'>,
): PoemMarker {
  const { x, y } = lonLatToMercator(base.lon, base.lat);
  return { ...base, mercatorX: x, mercatorY: y };
}

export const poems: PoemMarker[] = [
  // ── 视频文案顺序（14 首） ──
  createPoemMarker({
    id: 'waterfall-at-lushan',
    title: '望庐山瀑布',
    author: '李白',
    dynasty: '唐',
    locationName: '江西九江 · 庐山',
    lon: 115.9891,
    lat: 29.5566,
    summary: '作为点位局部特效样本，首版瀑布效果绑定在这里。',
    effect: 'waterfall',
    fullText: `日照香炉生紫烟，遥看瀑布挂前川。
飞流直下三千尺，疑是银河落九天。`,
  }),
  createPoemMarker({
    id: 'yellow-crane-tower',
    title: '黄鹤楼',
    author: '崔颢',
    dynasty: '唐',
    locationName: '湖北武汉 · 黄鹤楼',
    lon: 114.3054,
    lat: 30.5444,
    summary: '长江中游地标，适合作为全图叙事中心点。',
    effect: 'none',
    fullText: `昔人已乘黄鹤去，此地空余黄鹤楼。
黄鹤一去不复返，白云千载空悠悠。
晴川历历汉阳树，芳草萋萋鹦鹉洲。
日暮乡关何处是，烟波江上使人愁。`,
  }),
  createPoemMarker({
    id: 'mizhou-hunting',
    title: '江城子·密州出猎',
    author: '苏轼',
    dynasty: '宋',
    locationName: '山东诸城 · 密州',
    lon: 119.4101,
    lat: 35.9969,
    summary: '苏轼豪放词代表，密州猎场的壮阔气势。',
    effect: 'none',
    fullText: `老夫聊发少年狂，左牵黄，右擎苍，锦帽貂裘，千骑卷平冈。为报倾城随太守，亲射虎，看孙郎。
酒酣胸胆尚开张，鬓微霜，又何妨！持节云中，何日遣冯唐？会挽雕弓如满月，西北望，射天狼。`,
  }),
  createPoemMarker({
    id: 'spring-gazing',
    title: '春望',
    author: '杜甫',
    dynasty: '唐',
    locationName: '陕西西安 · 长安',
    lon: 108.9398,
    lat: 34.3416,
    summary: '安史之乱中的长安，烽火家书的沉痛。',
    effect: 'drizzle',
    fullText: `国破山河在，城春草木深。
感时花溅泪，恨别鸟惊心。
烽火连三月，家书抵万金。
白头搔更短，浑欲不胜簪。`,
  }),
  createPoemMarker({
    id: 'envoy-to-frontier',
    title: '使至塞上',
    author: '王维',
    dynasty: '唐',
    locationName: '甘肃酒泉 · 玉门关',
    lon: 101.0902,
    lat: 41.9556,
    summary: '大漠孤烟直，长河落日圆——边塞壮景。',
    effect: 'smoke',
    fullText: `单车欲问边，属国过居延。
征蓬出汉塞，归雁入胡天。
大漠孤烟直，长河落日圆。
萧关逢候骑，都护在燕然。`,
  }),
  createPoemMarker({
    id: 'like-a-dream',
    title: '如梦令',
    author: '李清照',
    dynasty: '宋',
    locationName: '山东济南 · 大明湖',
    lon: 117.02,
    lat: 36.67,
    summary: '争渡争渡，惊起一滩鸥鹭。',
    effect: 'none',
    fullText: `常记溪亭日暮，沉醉不知归路。
兴尽晚回舟，误入藕花深处。
争渡，争渡，惊起一滩鸥鹭。`,
  }),
  createPoemMarker({
    id: 'chibi-nostalgia',
    title: '念奴娇·赤壁怀古',
    author: '苏轼',
    dynasty: '宋',
    locationName: '湖北黄冈 · 赤壁',
    lon: 114.8789,
    lat: 30.4548,
    summary: '大江东去，千古风流人物的赤壁凭吊。',
    effect: 'none',
    fullText: `大江东去，浪淘尽，千古风流人物。
故垒西边，人道是，三国周郎赤壁。
乱石穿空，惊涛拍岸，卷起千堆雪。
江山如画，一时多少豪杰。
遥想公瑾当年，小乔初嫁了，雄姿英发。
羽扇纶巾，谈笑间，樯橹灰飞烟灭。
故国神游，多情应笑我，早生华发。
人生如梦，一尊还酹江月。`,
  }),
  createPoemMarker({
    id: 'night-mooring-maple-bridge',
    title: '枫桥夜泊',
    author: '张继',
    dynasty: '唐',
    locationName: '江苏苏州 · 枫桥',
    lon: 120.5747,
    lat: 31.2788,
    summary: '江南水乡代表点，天然适合雨夜与河网表达。',
    effect: 'drizzle',
    fullText: `月落乌啼霜满天，江枫渔火对愁眠。
姑苏城外寒山寺，夜半钟声到客船。`,
  }),
  createPoemMarker({
    id: 'road-to-shu',
    title: '蜀道难',
    author: '李白',
    dynasty: '唐',
    locationName: '四川广元 · 剑门关',
    lon: 105.5317,
    lat: 32.2284,
    summary: '蜀道天险，剑门关的雄奇与壮绝。',
    effect: 'none',
    fullText: `噫吁嚱，危乎高哉！
蜀道之难，难于上青天！
蚕丛及鱼凫，开国何茫然！
尔来四万八千岁，不与秦塞通人烟。
西当太白有鸟道，可以横绝峨眉巅。
地崩山摧壮士死，然后天梯石栈相钩连。
上有六龙回日之高标，下有冲波逆折之回川。
黄鹤之飞尚不得过，猿猱欲度愁攀援。
青泥何盘盘，百步九折萦岩峦。
扪参历井仰胁息，以手抚膺坐长叹。
问君西游何时还？畏途巉岩不可攀。
但见悲鸟号古木，雄飞雌从绕林间。
又闻子规啼夜月，愁空山。
蜀道之难，难于上青天，
使人听此凋朱颜！
连峰去天不盈尺，枯松倒挂倚绝壁。
飞湍瀑流争喧豗，砯崖转石万壑雷。
其险也如此，嗟尔远道之人胡为乎来哉！
剑阁峥嵘而崔嵬，一夫当关，万夫莫开。
所守或匪亲，化为狼与豺。
朝避猛虎，夕避长蛇；
磨牙吮血，杀人如麻。
锦城虽云乐，不如早还家。
蜀道之难，难于上青天，
侧身西望长咨嗟！`,
  }),
  createPoemMarker({
    id: 'river-snow',
    title: '江雪',
    author: '柳宗元',
    dynasty: '唐',
    locationName: '湖南永州',
    lon: 111.613,
    lat: 26.42,
    summary: '千山万径的极致孤寂，独钓寒江雪。',
    effect: 'snowfall',
    fullText: `千山鸟飞绝，万径人踪灭。
孤舟蓑笠翁，独钓寒江雪。`,
  }),
  createPoemMarker({
    id: 'youzhou-tower-song',
    title: '登幽州台歌',
    author: '陈子昂',
    dynasty: '唐',
    locationName: '北京 · 幽州台',
    lon: 116.4074,
    lat: 39.9042,
    summary: '念天地之悠悠，独怆然而涕下的千古悲歌。',
    effect: 'windgust',
    fullText: `前不见古人，后不见来者。
念天地之悠悠，独怆然而涕下。`,
  }),
  createPoemMarker({
    id: 'crossing-lingding',
    title: '过零丁洋',
    author: '文天祥',
    dynasty: '宋',
    locationName: '珠江口 · 伶仃洋',
    lon: 113.8,
    lat: 22.23,
    summary: '人生自古谁无死，留取丹心照汗青。',
    effect: 'none',
    fullText: `辛苦遭逢起一经，干戈寥落四周星。
山河破碎风飘絮，身世浮沉雨打萍。
惶恐滩头说惶恐，零丁洋里叹零丁。
人生自古谁无死？留取丹心照汗青。`,
  }),
  createPoemMarker({
    id: 'li-sao',
    title: '离骚',
    author: '屈原',
    dynasty: '战国楚',
    locationName: '湖南汨罗 · 汨罗江',
    lon: 113.0819,
    lat: 28.804,
    summary: '路漫漫其修远兮，吾将上下而求索。',
    effect: 'smoke',
    fullText: `帝高阳之苗裔兮，朕皇考曰伯庸。
摄提贞于孟陬兮，惟庚寅吾以降。
皇览揆余初度兮，肇锡余以嘉名。
名余曰正则兮，字余曰灵均。
纷吾既有此内美兮，又重之以修能。
扈江离与辟芷兮，纫秋兰以为佩。
汩余若将不及兮，恐年岁之不吾与。
朝搴阰之木兰兮，夕揽洲之宿莽。
日月忽其不淹兮，春与秋其代序。
惟草木之零落兮，恐美人之迟暮。
不抚壮而弃秽兮，何不改乎此度？
乘骐骥以驰骋兮，来吾道夫先路！
长太息以掩涕兮，哀民生之多艰。
亦余心之所善兮，虽九死其犹未悔。
路漫漫其修远兮，吾将上下而求索。`,
  }),
  createPoemMarker({
    id: 'yueyang-tower',
    title: '岳阳楼记',
    author: '范仲淹',
    dynasty: '宋',
    locationName: '湖南岳阳 · 岳阳楼',
    lon: 113.0924,
    lat: 29.3784,
    summary: '先天下之忧而忧，后天下之乐而乐。',
    effect: 'none',
    fullText: `庆历四年春，滕子京谪守巴陵郡。越明年，政通人和，百废具兴，乃重修岳阳楼，增其旧制，刻唐贤今人诗赋于其上，属予作文以记之。
予观夫巴陵胜状，在洞庭一湖。衔远山，吞长江，浩浩汤汤，横无际涯，朝晖夕阴，气象万千，此则岳阳楼之大观也。前人之述备矣。
然则北通巫峡，南极潇湘，迁客骚人，多会于此，览物之情，得无异乎？
若夫淫雨霏霏，连月不开，阴风怒号，浊浪排空；日星隐曜，山岳潜形；商旅不行，樯倾楫摧；薄暮冥冥，虎啸猿啼。
登斯楼也，则有去国怀乡，忧谗畏讥，满目萧然，感极而悲者矣。
至若春和景明，波澜不惊，上下天光，一碧万顷；沙鸥翔集，锦鳞游泳；岸芷汀兰，郁郁青青。
而或长烟一空，皓月千里，浮光跃金，静影沉璧，渔歌互答，此乐何极！
登斯楼也，则有心旷神怡，宠辱偕忘，把酒临风，其喜洋洋者矣。
嗟夫！予尝求古仁人之心，或异二者之为，何哉？
不以物喜，不以己悲；居庙堂之高则忧其民；处江湖之远则忧其君。是进亦忧，退亦忧。
然则何时而乐耶？其必曰“先天下之忧而忧，后天下之乐而乐”乎。噫！微斯人，吾谁与归？
`,
  }),
  // ── 视频文案未提及（5 首） ──
  createPoemMarker({
    id: 'liangzhou-ci',
    title: '凉州词',
    author: '王之涣',
    dynasty: '唐',
    locationName: '甘肃武威 · 凉州',
    lon: 102.6347,
    lat: 37.9281,
    summary: '西北边塞锚点，可配合飞沙与强风塑造边地气息。',
    effect: 'sandstorm',
    fullText: `黄河远上白云间，一片孤城万仞山。
羌笛何须怨杨柳，春风不度玉门关。`,
  }),
  createPoemMarker({
    id: 'army-march',
    title: '从军行',
    author: '王昌龄',
    dynasty: '唐',
    locationName: '甘肃酒泉 · 玉门关',
    lon: 101.0902,
    lat: 41.9556,
    summary: '黄沙百战穿金甲，不破楼兰终不还。',
    effect: 'sandstorm',
    fullText: `青海长云暗雪山，孤城遥望玉门关。
黄沙百战穿金甲，不破楼兰终不还。`,
  }),
  createPoemMarker({
    id: 'leaving-white-emperor-town',
    title: '早发白帝城',
    author: '李白',
    dynasty: '唐',
    locationName: '重庆奉节 · 白帝城',
    lon: 109.5629,
    lat: 31.0453,
    summary: '三峡走廊关键点，适合验证长江主线与风向感。',
    effect: 'none',
    fullText: `朝辞白帝彩云间，千里江陵一日还。
两岸猿声啼不住，轻舟已过万重山。`,
  }),
  createPoemMarker({
    id: 'crossing-the-sea',
    title: '六月二十日夜渡海',
    author: '苏轼',
    dynasty: '宋',
    locationName: '海南海口 · 琼州海峡',
    lon: 110.32,
    lat: 20.03,
    summary: '九死南荒吾不恨，兹游奇绝冠平生。',
    effect: 'windgust',
    fullText: `参横斗转欲三更，苦雨终风也解晴。
云散月明谁点缀？天容海色本澄清。
空余鲁叟乘桴意，粗识轩辕奏乐声。
九死南荒吾不恨，兹游奇绝冠平生。`,
  }),
  createPoemMarker({
    id: 'huanxisha',
    title: '浣溪沙',
    author: '晏殊',
    dynasty: '宋',
    locationName: '河南开封 · 汴京',
    lon: 114.3074,
    lat: 34.7972,
    summary: '无可奈何花落去，似曾相识燕归来。',
    effect: 'none',
    fullText: `一曲新词酒一杯，去年天气旧亭台。
夕阳西下几时回？
无可奈何花落去，似曾相识燕归来。
小园香径独徘徊。`,
  }),
  // ── 中考篇目第一批（新增） ──
  createPoemMarker({
    id: 'viewing-the-sea',
    title: '观沧海',
    author: '曹操',
    dynasty: '东汉',
    locationName: '河北秦皇岛 · 碣石山',
    lon: 119.48,
    lat: 39.71,
    summary: '东临碣石，以观沧海，适合作为北方海岸线锚点。',
    effect: 'windgust',
    fullText: `东临碣石，以观沧海。
水何澹澹，山岛竦峙。
树木丛生，百草丰茂。
秋风萧瑟，洪波涌起。
日月之行，若出其中；
星汉灿烂，若出其里。
幸甚至哉，歌以咏志。`,
  }),
  createPoemMarker({
    id: 'under-beigu-mountain',
    title: '次北固山下',
    author: '王湾',
    dynasty: '唐',
    locationName: '江苏镇江 · 北固山',
    lon: 119.43,
    lat: 32.22,
    summary: '潮平两岸阔，风正一帆悬，天然适合长江航路叙事。',
    effect: 'windgust',
    fullText: `客路青山外，行舟绿水前。
潮平两岸阔，风正一帆悬。
海日生残夜，江春入旧年。
乡书何处达？归雁洛阳边。`,
  }),
  createPoemMarker({
    id: 'to-wang-changling',
    title: '闻王昌龄左迁龙标遥有此寄',
    author: '李白',
    dynasty: '唐',
    locationName: '湖南怀化 · 黔阳古城',
    lon: 109.99,
    lat: 27.11,
    summary: '以龙标为锚点，月色与远寄意境适合做夜色叙事。',
    effect: 'drizzle',
    fullText: `杨花落尽子规啼，闻道龙标过五溪。
我寄愁心与明月，随君直到夜郎西。`,
  }),
  createPoemMarker({
    id: 'gazing-at-mount-tai',
    title: '望岳',
    author: '杜甫',
    dynasty: '唐',
    locationName: '山东泰安 · 泰山',
    lon: 117.1025,
    lat: 36.2648,
    summary: '会当凌绝顶，一览众山小，适合作为群山抬升样本。',
    effect: 'windgust',
    fullText: `岱宗夫如何？齐鲁青未了。
造化钟神秀，阴阳割昏晓。
荡胸生曾云，决眦入归鸟。
会当凌绝顶，一览众山小。`,
  }),
  createPoemMarker({
    id: 'white-snow-song',
    title: '白雪歌送武判官归京',
    author: '岑参',
    dynasty: '唐',
    locationName: '新疆巴州 · 轮台',
    lon: 84.2542,
    lat: 41.77,
    summary: '胡天八月即飞雪，适合作为西域雪线与边塞风雪样本。',
    effect: 'snowfall',
    fullText: `北风卷地白草折，胡天八月即飞雪。
忽如一夜春风来，千树万树梨花开。
散入珠帘湿罗幕，狐裘不暖锦衾薄。
将军角弓不得控，都护铁衣冷难着。
瀚海阑干百丈冰，愁云惨淡万里凝。
中军置酒饮归客，胡琴琵琶与羌笛。
纷纷暮雪下辕门，风掣红旗冻不翻。
轮台东门送君去，去时雪满天山路。
山回路转不见君，雪上空留马行处。`,
  }),
  createPoemMarker({
    id: 'spring-walk-west-lake',
    title: '钱塘湖春行',
    author: '白居易',
    dynasty: '唐',
    locationName: '浙江杭州 · 西湖',
    lon: 120.15,
    lat: 30.25,
    summary: '孤山寺北贾亭西，适合作为江南春景与湖面锚点。',
    effect: 'drizzle',
    fullText: `孤山寺北贾亭西，水面初平云脚低。
几处早莺争暖树，谁家新燕啄春泥。
乱花渐欲迷人眼，浅草才能没马蹄。
最爱湖东行不足，绿杨阴里白沙堤。`,
  }),
  createPoemMarker({
    id: 'red-cliff',
    title: '赤壁',
    author: '杜牧',
    dynasty: '唐',
    locationName: '湖北黄冈 · 赤壁',
    lon: 114.8789,
    lat: 30.4548,
    summary: '折戟沉沙铁未销，适合作为赤壁怀古的另一重视角。',
    effect: 'smoke',
    fullText: `折戟沉沙铁未销，自将磨洗认前朝。
东风不与周郎便，铜雀春深锁二乔。`,
  }),
  createPoemMarker({
    id: 'moored-on-qinhuai',
    title: '泊秦淮',
    author: '杜牧',
    dynasty: '唐',
    locationName: '江苏南京 · 秦淮河',
    lon: 118.7892,
    lat: 32.0209,
    summary: '烟笼寒水月笼沙，夜泊秦淮近酒家。',
    effect: 'drizzle',
    fullText: `烟笼寒水月笼沙，夜泊秦淮近酒家。
商女不知亡国恨，隔江犹唱后庭花。`,
  }),
  createPoemMarker({
    id: 'autumn-thoughts-at-frontier',
    title: '渔家傲·秋思',
    author: '范仲淹',
    dynasty: '宋',
    locationName: '宁夏银川 · 贺兰山前',
    lon: 106.2309,
    lat: 38.4872,
    summary: '长烟落日孤城闭，适合作为秋塞黄昏样本。',
    effect: 'sandstorm',
    fullText: `塞下秋来风景异，衡阳雁去无留意。
四面边声连角起，千嶂里，长烟落日孤城闭。
浊酒一杯家万里，燕然未勒归无计。
羌管悠悠霜满地，人不寐，将军白发征夫泪。`,
  }),
  createPoemMarker({
    id: 'climbing-flying-peak',
    title: '登飞来峰',
    author: '王安石',
    dynasty: '宋',
    locationName: '浙江杭州 · 飞来峰',
    lon: 120.1017,
    lat: 30.2431,
    summary: '不畏浮云遮望眼，自缘身在最高层。',
    effect: 'windgust',
    fullText: `飞来山上千寻塔，闻说鸡鸣见日升。
不畏浮云遮望眼，自缘身在最高层。`,
  }),
  createPoemMarker({
    id: 'north-fort-pavilion',
    title: '南乡子·登京口北固亭有怀',
    author: '辛弃疾',
    dynasty: '宋',
    locationName: '江苏镇江 · 北固亭',
    lon: 119.43,
    lat: 32.22,
    summary: '何处望神州？满眼风光北固楼。',
    effect: 'windgust',
    fullText: `何处望神州？满眼风光北固楼。
千古兴亡多少事？悠悠。不尽长江滚滚流。
年少万兜鍪，坐断东南战未休。
天下英雄谁敌手？曹刘。生子当如孙仲谋。`,
  }),
  createPoemMarker({
    id: 'tong-pass-nostalgia',
    title: '山坡羊·潼关怀古',
    author: '张养浩',
    dynasty: '元',
    locationName: '陕西渭南 · 潼关',
    lon: 110.2861,
    lat: 34.6061,
    summary: '峰峦如聚，波涛如怒，适合作为关隘怀古锚点。',
    effect: 'smoke',
    fullText: `峰峦如聚，波涛如怒，山河表里潼关路。
望西都，意踌躇。
伤心秦汉经行处，宫阙万间都做了土。
兴，百姓苦；亡，百姓苦。`,
  }),
  // ── 中考篇目第二批（新增） ──
  createPoemMarker({
    id: 'guanju',
    title: '关雎',
    author: '诗经',
    dynasty: '先秦',
    locationName: '河南三门峡 · 河洲',
    lon: 111.19,
    lat: 34.77,
    summary: '以河洲意象落点，保留《诗经》水边起兴的场景感。',
    effect: 'drizzle',
    fullText: `关关雎鸠，在河之洲。
窈窕淑女，君子好逑。
参差荇菜，左右流之。
窈窕淑女，寤寐求之。
求之不得，寤寐思服。
悠哉悠哉，辗转反侧。
参差荇菜，左右采之。
窈窕淑女，琴瑟友之。
参差荇菜，左右芼之。
窈窕淑女，钟鼓乐之。`,
  }),
  createPoemMarker({
    id: 'jianjia',
    title: '蒹葭',
    author: '诗经',
    dynasty: '先秦',
    locationName: '陕西西安 · 灞水',
    lon: 109.02,
    lat: 34.33,
    summary: '以蒹葭苍苍的水岸意象落在灞水，保留秦地风貌。',
    effect: 'drizzle',
    fullText: `蒹葭苍苍，白露为霜。
所谓伊人，在水一方。
溯洄从之，道阻且长。
溯游从之，宛在水中央。
蒹葭萋萋，白露未晞。
所谓伊人，在水之湄。
溯洄从之，道阻且跻。
溯游从之，宛在水中坻。
蒹葭采采，白露未已。
所谓伊人，在水之涘。
溯洄从之，道阻且右。
溯游从之，宛在水中沚。`,
  }),
  createPoemMarker({
    id: 'fifteen-campaign',
    title: '十五从军征',
    author: '乐府诗集',
    dynasty: '汉魏',
    locationName: '河南洛阳 · 汉家故里',
    lon: 112.454,
    lat: 34.6197,
    summary: '以归乡视角落在汉家故地，强化征人返里的苍凉感。',
    effect: 'smoke',
    fullText: `十五从军征，八十始得归。
道逢乡里人：“家中有阿谁？”
“遥看是君家，松柏冢累累。”
兔从狗窦入，雉从梁上飞。
中庭生旅谷，井上生旅葵。
舂谷持作饭，采葵持作羹。
羹饭一时熟，不知饴阿谁。
出门东向看，泪落沾我衣。`,
  }),
  createPoemMarker({
    id: 'mulan-ballad',
    title: '木兰诗',
    author: '乐府诗集',
    dynasty: '北朝',
    locationName: '河南商丘 · 木兰祠',
    lon: 115.65,
    lat: 34.45,
    summary: '以木兰祠为锚点，保证这首叙事长诗有稳定入口。',
    effect: 'windgust',
    fullText: `唧唧复唧唧，木兰当户织。
不闻机杼声，唯闻女叹息。
问女何所思，问女何所忆。女亦无所思，女亦无所忆。
昨夜见军帖，可汗大点兵，军书十二卷，卷卷有爷名。
阿爷无大儿，木兰无长兄，愿为市鞍马，从此替爷征。
东市买骏马，西市买鞍鞯，南市买辔头，北市买长鞭。
旦辞爷娘去，暮宿黄河边，不闻爷娘唤女声，但闻黄河流水鸣溅溅。
旦辞黄河去，暮至黑山头，不闻爷娘唤女声，但闻燕山胡骑鸣啾啾。
万里赴戎机，关山度若飞。朔气传金柝，寒光照铁衣。将军百战死，壮士十年归。
归来见天子，天子坐明堂。策勋十二转，赏赐百千强。
可汗问所欲，木兰不用尚书郎，愿驰千里足，送儿还故乡。
爷娘闻女来，出郭相扶将；阿姊闻妹来，当户理红妆；
小弟闻姊来，磨刀霍霍向猪羊。开我东阁门，坐我西阁床，
脱我战时袍，著我旧时裳。当窗理云鬓，对镜帖花黄。
出门看火伴，火伴皆惊忙：同行十二年，不知木兰是女郎。
雄兔脚扑朔，雌兔眼迷离；
双兔傍地走，安能辨我是雄雌？`,
  }),
  createPoemMarker({
    id: 'drinking-wine',
    title: '饮酒',
    author: '陶渊明',
    dynasty: '东晋',
    locationName: '江西九江 · 庐山南麓',
    lon: 115.94,
    lat: 29.53,
    summary: '采菊东篱下，悠然见南山，适合作为田园山居锚点。',
    effect: 'none',
    fullText: `结庐在人境，而无车马喧。
问君何能尔？心远地自偏。
采菊东篱下，悠然见南山。
山气日夕佳，飞鸟相与还。
此中有真意，欲辨已忘言。`,
  }),
  createPoemMarker({
    id: 'farewell-du-shaofu',
    title: '送杜少府之任蜀州',
    author: '王勃',
    dynasty: '唐',
    locationName: '陕西西安 · 长安',
    lon: 108.9398,
    lat: 34.3416,
    summary: '以长安送别为入口，保留三秦与五津的路途感。',
    effect: 'windgust',
    fullText: `城阙辅三秦，风烟望五津。
与君离别意，同是宦游人。
海内存知己，天涯若比邻。
无为在歧路，儿女共沾巾。`,
  }),
  createPoemMarker({
    id: 'hard-is-the-way',
    title: '行路难',
    author: '李白',
    dynasty: '唐',
    locationName: '陕西西安 · 长安',
    lon: 108.9398,
    lat: 34.3416,
    summary: '长风破浪会有时，仍以长安仕途起伏为锚点。',
    effect: 'windgust',
    fullText: `金樽清酒斗十千，玉盘珍羞直万钱。
停杯投箸不能食，拔剑四顾心茫然。
欲渡黄河冰塞川，将登太行雪满山。
闲来垂钓碧溪上，忽复乘舟梦日边。
行路难，行路难，多歧路，今安在？
长风破浪会有时，直挂云帆济沧海。`,
  }),
  createPoemMarker({
    id: 'charcoal-seller',
    title: '卖炭翁',
    author: '白居易',
    dynasty: '唐',
    locationName: '陕西西安 · 终南山',
    lon: 108.95,
    lat: 34.18,
    summary: '伐薪烧炭南山中，落点放在终南山一带最顺。',
    effect: 'smoke',
    fullText: `卖炭翁，伐薪烧炭南山中。
满面尘灰烟火色，两鬓苍苍十指黑。
卖炭得钱何所营？身上衣裳口中食。
可怜身上衣正单，心忧炭贱愿天寒。
夜来城外一尺雪，晓驾炭车辗冰辙。
牛困人饥日已高，市南门外泥中歇。
翩翩两骑来是谁？黄衣使者白衫儿。
手把文书口称敕，回车叱牛牵向北。
一车炭，千余斤，宫使驱将惜不得。
半匹红纱一丈绫，系向牛头充炭直。`,
  }),
  createPoemMarker({
    id: 'thatched-hut-song',
    title: '茅屋为秋风所破歌',
    author: '杜甫',
    dynasty: '唐',
    locationName: '四川成都 · 杜甫草堂',
    lon: 104.22,
    lat: 30.7000,
    summary: '八月秋高风怒号，最适合落在杜甫草堂。',
    effect: 'windgust',
    fullText: `八月秋高风怒号，卷我屋上三重茅。
茅飞渡江洒江郊，
高者挂罥长林梢，
下者飘转沉塘坳。
南村群童欺我老无力，
忍能对面为盗贼。
公然抱茅入竹去，
唇焦口燥呼不得，
归来倚杖自叹息。
俄顷风定云墨色，秋天漠漠向昏黑。
布衾多年冷似铁，
娇儿恶卧踏里裂。
床头屋漏无干处，
雨脚如麻未断绝。
自经丧乱少睡眠，长夜沾湿何由彻！
安得广厦千万间，大庇天下寒士俱欢颜！
风雨不动安如山。
呜呼！
何时眼前突兀见此屋，
吾庐独破受冻死亦足！`,
  }),
  createPoemMarker({
    id: 'yanmen-guard',
    title: '雁门太守行',
    author: '李贺',
    dynasty: '唐',
    locationName: '山西忻州 · 雁门关',
    lon: 112.863,
    lat: 39.1803,
    summary: '黑云压城城欲摧，边关战意最适合落在雁门关。',
    effect: 'sandstorm',
    fullText: `黑云压城城欲摧，甲光向日金鳞开。
角声满天秋色里，塞上燕脂凝夜紫。
半卷红旗临易水，霜重鼓寒声不起。
报君黄金台上意，提携玉龙为君死。`,
  }),
  createPoemMarker({
    id: 'night-rain-to-north',
    title: '夜雨寄北',
    author: '李商隐',
    dynasty: '唐',
    locationName: '重庆巫山 · 巴山',
    lon: 109.8794,
    lat: 31.0748,
    summary: '巴山夜雨涨秋池，锚在巴山最符合题面意象。',
    effect: 'drizzle',
    fullText: `君问归期未有期，巴山夜雨涨秋池。
何当共剪西窗烛，却话巴山夜雨时。`,
  }),
  createPoemMarker({
    id: 'untitled',
    title: '无题',
    author: '李商隐',
    dynasty: '唐',
    locationName: '陕西西安 · 长安',
    lon: 108.9398,
    lat: 34.3416,
    summary: '相见时难别亦难，先落在晚唐都城语境更稳妥。',
    effect: 'none',
    fullText: `相见时难别亦难，东风无力百花残。
春蚕到死丝方尽，蜡炬成灰泪始干。
晓镜但愁云鬓改，夜吟应觉月光寒。
蓬山此去无多路，青鸟殷勤为探看。`,
  }),
  createPoemMarker({
    id: 'meeting-in-joy',
    title: '相见欢',
    author: '李煜',
    dynasty: '五代',
    locationName: '江苏南京 · 金陵西楼',
    lon: 118.78,
    lat: 32.04,
    summary: '无言独上西楼，适合落在金陵宫苑旧地语境。',
    effect: 'none',
    fullText: `无言独上西楼，月如钩。
寂寞梧桐深院锁清秋。
剪不断，理还乱，是离愁，
别是一般滋味在心头。`,
  }),
  createPoemMarker({
    id: 'mid-autumn',
    title: '水调歌头',
    author: '苏轼',
    dynasty: '宋',
    locationName: '山东诸城 · 密州',
    lon: 119.4101,
    lat: 35.9969,
    summary: '明月几时有，此篇本就作于密州。',
    effect: 'none',
    fullText: `丙辰中秋，欢饮达旦，大醉，作此篇，兼怀子由。明月几时有？把酒问青天。不知天上宫阙，今夕是何年。
我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。
转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆？
人有悲欢离合，月有阴晴圆缺，此事古难全。
但愿人长久，千里共婵娟。`,
  }),
  createPoemMarker({
    id: 'visit-west-village',
    title: '游山西村',
    author: '陆游',
    dynasty: '宋',
    locationName: '浙江绍兴 · 山阴',
    lon: 120.58,
    lat: 30.01,
    summary: '山重水复疑无路，柳暗花明又一村。',
    effect: 'none',
    fullText: `莫笑农家腊酒浑，丰年留客足鸡豚。
山重水复疑无路，柳暗花明又一村。
箫鼓追随春社近，衣冠简朴古风存。
从今若许闲乘月，拄杖无时夜叩门。`,
  }),
  createPoemMarker({
    id: 'dream-like-fisherman',
    title: '渔家傲·天接云涛连晓雾',
    author: '李清照',
    dynasty: '宋',
    locationName: '山东济南 · 大明湖',
    lon: 117.02,
    lat: 36.67,
    summary: '星河欲转千帆舞，先与李清照济南意象体系并置。',
    effect: 'windgust',
    fullText: `天接云涛连晓雾，星河欲转千帆舞。
仿佛梦魂归帝所。闻天语，殷勤问我归何处。
我报路长嗟日暮，学诗谩有惊人句。
九万里风鹏正举。风休住，蓬舟吹取三山去！`,
  }),
  createPoemMarker({
    id: 'sky-autumn-thoughts',
    title: '天净沙·秋思',
    author: '马致远',
    dynasty: '元',
    locationName: '北京昌平 · 古道',
    lon: 116.23,
    lat: 40.22,
    summary: '古道西风瘦马，以北地古道意象锚定这首小令。',
    effect: 'windgust',
    fullText: `枯藤老树昏鸦，小桥流水人家，古道西风瘦马。
夕阳西下，断肠人在天涯。`,
  }),
  createPoemMarker({
    id: 'ji-hai-misc',
    title: '己亥杂诗',
    author: '龚自珍',
    dynasty: '清',
    locationName: '北京 · 都门',
    lon: 116.4074,
    lat: 39.9042,
    summary: '浩荡离愁白日斜，先以都门南返的出京语境落点。',
    effect: 'windgust',
    fullText: `浩荡离愁白日斜，吟鞭东指即天涯。
落红不是无情物，化作春泥更护花。`,
  }),
  createPoemMarker({
    id: 'manjianghong-qiujin',
    title: '满江红',
    author: '秋瑾',
    dynasty: '清',
    locationName: '浙江绍兴 · 秋瑾故里',
    lon: 120.58,
    lat: 30.01,
    summary: '身不得，男儿列，心却比，男儿烈。',
    effect: 'windgust',
    fullText: `小住京华，早又是，中秋佳节。
为篱下，黄花开遍，秋容如拭。
身不得，男儿列，心却比，男儿烈。
算平生肝胆，因人常热。`,
  }),
  // ── 刘禹锡专题 ──
  createPoemMarker({
    id: 'autumn-song',
    title: '秋词',
    author: '刘禹锡',
    dynasty: '唐',
    locationName: '湖南常德 · 朗州',
    lon: 111.6985,
    lat: 29.0316,
    summary: '自古逢秋悲寂寥，我言秋日胜春朝。',
    effect: 'windgust',
    fullText: `自古逢秋悲寂寥，我言秋日胜春朝。
晴空一鹤排云上，便引诗情到碧霄。`,
  }),
  createPoemMarker({
    id: 'wuyi-lane',
    title: '乌衣巷',
    author: '刘禹锡',
    dynasty: '唐',
    locationName: '江苏南京 · 秦淮乌衣巷',
    lon: 118.7892,
    lat: 32.0209,
    summary: '旧时王谢堂前燕，飞入寻常百姓家。',
    effect: 'none',
    fullText: `朱雀桥边野草花，乌衣巷口夕阳斜。
旧时王谢堂前燕，飞入寻常百姓家。`,
  }),
  createPoemMarker({
    id: 'dongting-lake',
    title: '望洞庭',
    author: '刘禹锡',
    dynasty: '唐',
    locationName: '湖南岳阳 · 洞庭湖',
    lon: 113.0924,
    lat: 29.3784,
    summary: '湖光秋月两相和，潭面无风镜未磨。',
    effect: 'none',
    fullText: `湖光秋月两相和，潭面无风镜未磨。
遥望洞庭山水翠，白银盘里一青螺。`,
  }),
  createPoemMarker({
    id: 'bamboo-branch',
    title: '竹枝词',
    author: '刘禹锡',
    dynasty: '唐',
    locationName: '重庆奉节 · 夔州',
    lon: 109.5629,
    lat: 31.0453,
    summary: '东边日出西边雨，道是无晴却有晴。',
    effect: 'drizzle',
    fullText: `杨柳青青江水平，闻郎江上踏歌声。
东边日出西边雨，道是无晴却有晴。`,
  }),
  createPoemMarker({
    id: 'west-fort-hill',
    title: '西塞山怀古',
    author: '刘禹锡',
    dynasty: '唐',
    locationName: '湖北黄石 · 西塞山',
    lon: 115.0878,
    lat: 30.2052,
    summary: '人世几回伤往事，山形依旧枕寒流。',
    effect: 'smoke',
    fullText: `王濬楼船下益州，金陵王气黯然收。
千寻铁锁沉江底，一片降幡出石头。
人世几回伤往事，山形依旧枕寒流。
今逢四海为家日，故垒萧萧芦荻秋。`,
  }),
  createPoemMarker({
    id: 'rewarding-letian',
    title: '酬乐天扬州初逢席上见赠',
    author: '刘禹锡',
    dynasty: '唐',
    locationName: '江苏扬州',
    lon: 119.4127,
    lat: 32.3932,
    summary: '沉舟侧畔千帆过，病树前头万木春。',
    effect: 'none',
    fullText: `巴山楚水凄凉地，二十三年弃置身。
怀旧空吟闻笛赋，到乡翻似烂柯人。
沉舟侧畔千帆过，病树前头万木春。
今日听君歌一曲，暂凭杯酒长精神。`,
  }),

  // ── 四川专题 ──
  createPoemMarker({
    id: 'spring-rain-chengdu',
    title: '春夜喜雨',
    author: '杜甫',
    dynasty: '唐',
    locationName: '四川成都 · 锦官城',
    lon: 104.0700,
    lat: 30.7800,
    summary: '好雨知时节——杜甫寓居成都草堂时写下的喜悦之作。',
    effect: 'drizzle',
    fullText: `好雨知时节，当春乃发生。
随风潜入夜，润物细无声。
野径云俱黑，江船火独明。
晓看红湿处，花重锦官城。`,
  }),
  createPoemMarker({
    id: 'two-orioles',
    title: '绝句',
    author: '杜甫',
    dynasty: '唐',
    locationName: '四川成都 · 西岭雪山',
    lon: 103.1754,
    lat: 30.6825,
    summary: '窗含西岭千秋雪——草堂窗外望西岭雪山，明快而开阔。',
    effect: 'none',
    fullText: `两个黄鹂鸣翠柳，一行白鹭上青天。
窗含西岭千秋雪，门泊东吴万里船。`,
  }),
  createPoemMarker({
    id: 'shu-xiang',
    title: '蜀相',
    author: '杜甫',
    dynasty: '唐',
    locationName: '四川成都 · 武侯祠',
    lon: 104.0400,
    lat: 30.5600,
    summary: '出师未捷身先死——凭吊诸葛亮，千古遗憾与敬仰。',
    effect: 'none',
    fullText: `丞相祠堂何处寻，锦官城外柏森森。
映阶碧草自春色，隔叶黄鹂空好音。
三顾频烦天下计，两朝开济老臣心。
出师未捷身先死，长使英雄泪满襟。`,
  }),
  createPoemMarker({
    id: 'chu-shi-biao',
    title: '出师表',
    author: '诸葛亮',
    dynasty: '三国蜀汉',
    locationName: '四川成都 · 武侯祠',
    lon: 104.0400,
    lat: 30.5600,
    summary: '成都武侯祠承载诸葛亮记忆，以《出师表》接续“鞠躬尽瘁”的忠贞气象。',
    effect: 'none',
    fullText: `先帝创业未半，而中道崩殂。
今天下三分，益州疲弊，
此诚危急存亡之秋也。
然侍卫之臣不懈于内，
忠志之士忘身于外者，
盖追先帝之殊遇，
欲报之于陛下也。
诚宜开张圣听，
以光先帝遗德，
恢弘志士之气。
不宜妄自菲薄，
引喻失义，
以塞忠谏之路也。
宫中府中，俱为一体；
陟罚臧否，不宜异同。
若有作奸犯科及为忠善者，
宜付有司论其刑赏，
以昭陛下平明之理；
不宜偏私，使内外异法也。
侍中、侍郎郭攸之、费祎、董允等，
此皆良实，志虑忠纯，
是以先帝简拔，以遗陛下。
愚以为宫中之事，事无大小，
悉以咨之，然后施行，
必能裨补阙漏，有所广益。
将军向宠，性行淑均，
晓畅军事，试用于昔日，
先帝称之曰能，
是以众议举宠为督。
愚以为营中之事，悉以咨之，
必能使行阵和睦，优劣得所。
亲贤臣，远小人，
此先汉所以兴隆也；
亲小人，远贤臣，
此后汉所以倾颓也。
先帝在时，每与臣论此事，
未尝不叹息痛恨于桓、灵也。
侍中、尚书、长史、参军，
此悉贞良死节之臣，
愿陛下亲之信之，
则汉室之隆，可计日而待也。
臣本布衣，躬耕于南阳，
苟全性命于乱世，
不求闻达于诸侯。
先帝不以臣卑鄙，
猥自枉屈，
三顾臣于草庐之中，
咨臣以当世之事。
由是感激，
遂许先帝以驱驰。
后值倾覆，
受任于败军之际，
奉命于危难之间，
尔来二十有一年矣。
先帝知臣谨慎，
故临崩寄臣以大事也。
受命以来，夙夜忧叹，
恐托付不效，
以伤先帝之明。
故五月渡泸，深入不毛。
今南方已定，兵甲已足，
当奖率三军，北定中原，
庶竭驽钝，攘除奸凶，
兴复汉室，还于旧都。
此臣所以报先帝，
而忠陛下之职分也。
至于斟酌损益，
进尽忠言，
则攸之、祎、允之任也。
愿陛下托臣以讨贼兴复之效；
不效，则治臣之罪，
以告先帝之灵。
若无兴德之言，
则责攸之、祎、允等之慢，
以彰其咎。
陛下亦宜自谋，
以咨诹善道，
察纳雅言，
深追先帝遗诏。
臣不胜受恩感激。
今当远离，
临表涕零，
不知所言。`,
  }),
  createPoemMarker({
    id: 'dengao',
    title: '登高',
    author: '杜甫',
    dynasty: '唐',
    locationName: '四川奉节 · 夔州',
    lon: 109.5100,
    lat: 31.0100,
    summary: '无边落木萧萧下——杜甫晚年夔州登高，被誉为七律之冠。',
    effect: 'windgust',
    fullText: `风急天高猿啸哀，渚清沙白鸟飞回。
无边落木萧萧下，不尽长江滚滚来。
万里悲秋常作客，百年多病独登台。
艰难苦恨繁霜鬓，潦倒新停浊酒杯。`,
  }),
  createPoemMarker({
    id: 'emei-moon',
    title: '峨眉山月歌',
    author: '李白',
    dynasty: '唐',
    locationName: '四川乐山 · 峨眉山',
    lon: 103.3248,
    lat: 29.5997,
    summary: '峨眉山月半轮秋——李白少年出蜀前夜，月映平羌江的离愁。',
    effect: 'none',
    fullText: `峨眉山月半轮秋，影入平羌江水流。
夜发清溪向三峡，思君不见下渝州。`,
  }),
  createPoemMarker({
    id: 'gift-to-huaqing',
    title: '赠花卿',
    author: '杜甫',
    dynasty: '唐',
    locationName: '四川成都 · 锦江',
    lon: 104.1800,
    lat: 30.6400,
    summary: '此曲只应天上有——成都乐声入诗，短小好记。',
    effect: 'none',
    fullText: `锦城丝管日纷纷，半入江风半入云。
此曲只应天上有，人间能得几回闻。`,
  }),
  createPoemMarker({
    id: 'walk-by-river-flowers',
    title: '江畔独步寻花',
    author: '杜甫',
    dynasty: '唐',
    locationName: '四川成都 · 浣花溪',
    lon: 103.9300,
    lat: 30.6500,
    summary: '黄四娘家花满蹊——成都春日花气最鲜明的一首。',
    effect: 'none',
    fullText: `黄四娘家花满蹊，千朵万朵压枝低。
留连戏蝶时时舞，自在娇莺恰恰啼。`,
  }),
  createPoemMarker({
    id: 'hearing-army-recover',
    title: '闻官军收河南河北',
    author: '杜甫',
    dynasty: '唐',
    locationName: '四川绵阳 · 梓州',
    lon: 105.0946,
    lat: 31.0956,
    summary: '白日放歌须纵酒——杜甫在蜀中听闻捷报后的开怀之作。',
    effect: 'windgust',
    fullText: `剑外忽传收蓟北，初闻涕泪满衣裳。
却看妻子愁何在，漫卷诗书喜欲狂。
白日放歌须纵酒，青春作伴好还乡。
即从巴峡穿巫峡，便下襄阳向洛阳。`,
  }),
  createPoemMarker({
    id: 'chengdu-song',
    title: '成都曲',
    author: '张籍',
    dynasty: '唐',
    locationName: '四川成都 · 万里桥',
    lon: 104.1100,
    lat: 30.5900,
    summary: '锦江近西烟水绿——一句点出成都水色与蜀地物候。',
    effect: 'drizzle',
    fullText: `锦江近西烟水绿，新雨山头荔枝熟。
万里桥边多酒家，游人爱向谁家宿。`,
  }),
  createPoemMarker({
    id: 'climbing-tower',
    title: '登楼',
    author: '杜甫',
    dynasty: '唐',
    locationName: '四川都江堰 · 玉垒山',
    lon: 103.6196,
    lat: 31.0069,
    summary: '锦江春色来天地，玉垒浮云变古今——川西山色与成都春色同入一联。',
    effect: 'windgust',
    fullText: `花近高楼伤客心，万方多难此登临。
锦江春色来天地，玉垒浮云变古今。
北极朝廷终不改，西山寇盗莫相侵。
可怜后主还祠庙，日暮聊为梁甫吟。`,
  }),
  createPoemMarker({
    id: 'friend-to-shu',
    title: '送友人入蜀',
    author: '李白',
    dynasty: '唐',
    locationName: '四川都江堰 · 青城山',
    lon: 103.5668,
    lat: 30.9053,
    summary: '见说蚕丛路，崎岖不易行——入蜀路途的山势与云气。',
    effect: 'windgust',
    fullText: `见说蚕丛路，崎岖不易行。
山从人面起，云傍马头生。
芳树笼秦栈，春流绕蜀城。
升沉应已定，不必问君平。`,
  }),
  createPoemMarker({
    id: 'long-march',
    title: '七律·长征',
    author: '毛泽东',
    dynasty: '近现代',
    locationName: '四川阿坝 · 岷山',
    lon: 103.73,
    lat: 32.65,
    summary: '更喜岷山千里雪——把长征过川的视线拉到川西北雪山。',
    effect: 'snowfall',
    fullText: `红军不怕远征难，万水千山只等闲。
五岭逶迤腾细浪，乌蒙磅礴走泥丸。
金沙水拍云崖暖，大渡桥横铁索寒。
更喜岷山千里雪，三军过后尽开颜。`,
  }),

  // ── 川西专题：甘孜 + 阿坝核心地标 ──
  createPoemMarker({
    id: 'west-sichuan-yading-crane',
    title: '山中',
    author: '王维',
    dynasty: '唐',
    locationName: '四川甘孜 · 稻城亚丁',
    lon: 100.72,
    lat: 28.86,
    summary: '以空翠、寒山、红叶写亚丁山谷的清冷净土感。',
    effect: 'none',
    fullText: `荆溪白石出，天寒红叶稀。
山路元无雨，空翠湿人衣。`,
  }),
  createPoemMarker({
    id: 'west-sichuan-kangding-shudao',
    title: '蜀道难',
    author: '李白',
    dynasty: '唐',
    locationName: '四川甘孜 · 康定折多山',
    lon: 101.964,
    lat: 30.05,
    summary: '蜀道天险移入康巴门户，适配折多山与贡嘎东麓的高峻。',
    effect: 'windgust',
    fullText: `噫吁嚱，危乎高哉！
蜀道之难，难于上青天！
蚕丛及鱼凫，开国何茫然！
尔来四万八千岁，不与秦塞通人烟。
西当太白有鸟道，可以横绝峨眉巅。
地崩山摧壮士死，然后天梯石栈相钩连。
上有六龙回日之高标，下有冲波逆折之回川。
黄鹤之飞尚不得过，猿猱欲度愁攀援。
青泥何盘盘，百步九折萦岩峦。
扪参历井仰胁息，以手抚膺坐长叹。
问君西游何时还？畏途巉岩不可攀。
但见悲鸟号古木，雄飞雌从绕林间。
又闻子规啼夜月，愁空山。
蜀道之难，难于上青天，
使人听此凋朱颜！
连峰去天不盈尺，枯松倒挂倚绝壁。
飞湍瀑流争喧豗，砯崖转石万壑雷。
其险也如此，嗟尔远道之人胡为乎来哉！
剑阁峥嵘而崔嵬，一夫当关，万夫莫开。
所守或匪亲，化为狼与豺。
朝避猛虎，夕避长蛇；
磨牙吮血，杀人如麻。
锦城虽云乐，不如早还家。
蜀道之难，难于上青天，
侧身西望长咨嗟！`,
  }),
  createPoemMarker({
    id: 'west-sichuan-xinduqiao-frontier',
    title: '使至塞上',
    author: '王维',
    dynasty: '唐',
    locationName: '四川甘孜 · 新都桥',
    lon: 101.5,
    lat: 30.05,
    summary: '新都桥河谷开阔，适合“大漠孤烟直，长河落日圆”的辽远构图。',
    effect: 'smoke',
    fullText: `单车欲问边，属国过居延。
征蓬出汉塞，归雁入胡天。
大漠孤烟直，长河落日圆。
萧关逢候骑，都护在燕然。`,
  }),
  createPoemMarker({
    id: 'west-sichuan-litang-crane',
    title: '仙鹤',
    author: '仓央嘉措',
    dynasty: '清',
    locationName: '四川甘孜 · 理塘',
    lon: 100.269,
    lat: 29.996,
    summary: '“只到理塘就回”直接点出理塘，适合世界高城的雪域传说感。',
    effect: 'snowfall',
    fullText: `洁白的仙鹤，
请把双翅借我。
不飞遥远的地方，
到理塘转转就回。`,
  }),
  createPoemMarker({
    id: 'west-sichuan-seda-temple',
    title: '过香积寺',
    author: '王维',
    dynasty: '唐',
    locationName: '四川甘孜 · 色达',
    lon: 100.332,
    lat: 32.268,
    summary: '古寺钟声、深山禅意，贴合色达佛学院与红房子山谷。',
    effect: 'smoke',
    fullText: `不知香积寺，数里入云峰。
古木无人径，深山何处钟。
泉声咽危石，日色冷青松。
薄暮空潭曲，安禅制毒龙。`,
  }),
  createPoemMarker({
    id: 'west-sichuan-ganzi-qizhong',
    title: '碛中作',
    author: '岑参',
    dynasty: '唐',
    locationName: '四川甘孜 · 甘孜县',
    lon: 99.992,
    lat: 31.622,
    summary: '康巴腹地与雅砻江谷地，适合边地行旅的苍凉口吻。',
    effect: 'sandstorm',
    fullText: `走马西来欲到天，辞家见月两回圆。
今夜不知何处宿，平沙万里绝人烟。`,
  }),
  createPoemMarker({
    id: 'west-sichuan-tagong-liangzhou',
    title: '凉州词',
    author: '王之涣',
    dynasty: '唐',
    locationName: '四川甘孜 · 塔公草原',
    lon: 101.507,
    lat: 30.32,
    summary: '草原、雪山、羌笛之声相接，适合塔公寺前的辽阔视野。',
    effect: 'windgust',
    fullText: `黄河远上白云间，一片孤城万仞山。
羌笛何须怨杨柳，春风不度玉门关。`,
  }),
  createPoemMarker({
    id: 'west-sichuan-gongga-wangyue',
    title: '望岳',
    author: '杜甫',
    dynasty: '唐',
    locationName: '四川甘孜 · 贡嘎雪山',
    lon: 101.878,
    lat: 29.596,
    summary: '蜀山之王拔地而起，适合“会当凌绝顶”的登临气象。',
    effect: 'snowfall',
    fullText: `岱宗夫如何？齐鲁青未了。
造化钟神秀，阴阳割昏晓。
荡胸生曾云，决眦入归鸟。
会当凌绝顶，一览众山小。`,
  }),
  createPoemMarker({
    id: 'west-sichuan-moshi-zoumachuan',
    title: '走马川行奉送出师西征',
    author: '岑参',
    dynasty: '唐',
    locationName: '四川甘孜 · 墨石公园',
    lon: 101.49,
    lat: 30.41,
    summary: '异域石林与风声碎石，适合岑参边塞诗的奇崛力度。',
    effect: 'sandstorm',
    fullText: `君不见走马川行雪海边，平沙莽莽黄入天。
轮台九月风夜吼，一川碎石大如斗，随风满地石乱走。
匈奴草黄马正肥，金山西见烟尘飞，汉家大将西出师。
将军金甲夜不脱，半夜军行戈相拨，风头如刀面如割。
马毛带雪汗气蒸，五花连钱旋作冰，幕中草檄砚水凝。
虏骑闻之应胆慑，料知短兵不敢接，车师西门伫献捷。`,
  }),
  createPoemMarker({
    id: 'west-sichuan-dege-reading',
    title: '观书有感',
    author: '朱熹',
    dynasty: '宋',
    locationName: '四川甘孜 · 德格印经院',
    lon: 99.18,
    lat: 31.62,
    summary: '以书卷活水之喻，承接德格印经院的经版与文脉。',
    effect: 'none',
    fullText: `半亩方塘一鉴开，天光云影共徘徊。
问渠那得清如许？为有源头活水来。`,
  }),
  createPoemMarker({
    id: 'west-sichuan-huanglong-snow',
    title: '白雪歌送武判官归京',
    author: '岑参',
    dynasty: '唐',
    locationName: '四川阿坝 · 黄龙',
    lon: 103.835,
    lat: 32.754,
    summary: '黄龙钙化池层叠如玉，借边塞雪色写出冷艳奇观。',
    effect: 'snowfall',
    fullText: `北风卷地白草折，胡天八月即飞雪。
忽如一夜春风来，千树万树梨花开。
散入珠帘湿罗幕，狐裘不暖锦衾薄。
将军角弓不得控，都护铁衣冷难着。
瀚海阑干百丈冰，愁云惨淡万里凝。
中军置酒饮归客，胡琴琵琶与羌笛。
纷纷暮雪下辕门，风掣红旗冻不翻。
轮台东门送君去，去时雪满天山路。
山回路转不见君，雪上空留马行处。`,
  }),
  createPoemMarker({
    id: 'west-sichuan-siguniang-jingting',
    title: '独坐敬亭山',
    author: '李白',
    dynasty: '唐',
    locationName: '四川阿坝 · 四姑娘山',
    lon: 102.9,
    lat: 31.1,
    summary: '群峰沉默对坐，贴合四姑娘山的清峭与孤高。',
    effect: 'windgust',
    fullText: `众鸟高飞尽，孤云独去闲。
相看两不厌，只有敬亭山。`,
  }),
  createPoemMarker({
    id: 'west-sichuan-ruoergai-night',
    title: '旅夜书怀',
    author: '杜甫',
    dynasty: '唐',
    locationName: '四川阿坝 · 若尔盖草原',
    lon: 102.96,
    lat: 33.58,
    summary: '黄河九曲与草原夜色，适合星垂平野的开阔格局。',
    effect: 'windgust',
    fullText: `细草微风岸，危樯独夜舟。
星垂平野阔，月涌大江流。
名岂文章著，官应老病休。
飘飘何所似，天地一沙鸥。`,
  }),
  createPoemMarker({
    id: 'west-sichuan-hongyuan-congjun',
    title: '从军行',
    author: '王昌龄',
    dynasty: '唐',
    locationName: '四川阿坝 · 红原大草原',
    lon: 102.54,
    lat: 32.79,
    summary: '红原草原承载长征记忆，借边塞战诗写远征之气。',
    effect: 'sandstorm',
    fullText: `青海长云暗雪山，孤城遥望玉门关。
黄沙百战穿金甲，不破楼兰终不还。`,
  }),
  createPoemMarker({
    id: 'west-sichuan-dagu-river-snow',
    title: '江雪',
    author: '柳宗元',
    dynasty: '唐',
    locationName: '四川阿坝 · 达古冰川',
    lon: 102.83,
    lat: 32.21,
    summary: '冰川云端之巅，适合千山万径的极寒孤寂。',
    effect: 'snowfall',
    fullText: `千山鸟飞绝，万径人踪灭。
孤舟蓑笠翁，独钓寒江雪。`,
  }),
  createPoemMarker({
    id: 'west-sichuan-bipenggou-dongda',
    title: '别董大',
    author: '高适',
    dynasty: '唐',
    locationName: '四川阿坝 · 毕棚沟',
    lon: 102.99,
    lat: 31.43,
    summary: '雪山湖泊与红石滩之间，借送别诗写云寒日暮。',
    effect: 'snowfall',
    fullText: `千里黄云白日曛，北风吹雁雪纷纷。
莫愁前路无知己，天下谁人不识君。`,
  }),
  createPoemMarker({
    id: 'west-sichuan-danba-qiangcun',
    title: '羌村',
    author: '杜甫',
    dynasty: '唐',
    locationName: '四川甘孜 · 丹巴藏寨',
    lon: 101.89,
    lat: 30.88,
    summary: '藏寨碉楼依山而立，借杜甫村居诗写乱后人间烟火。',
    effect: 'none',
    fullText: `峥嵘赤云西，日脚下平地。
柴门鸟雀噪，归客千里至。
妻孥怪我在，惊定还拭泪。
世乱遭飘荡，生还偶然遂。
邻人满墙头，感叹亦歔欷。
夜阑更秉烛，相对如梦寐。`,
  }),
  createPoemMarker({
    id: 'west-sichuan-zheduo-pass',
    title: '送友人入蜀',
    author: '李白',
    dynasty: '唐',
    locationName: '四川甘孜 · 折多山',
    lon: 101.8,
    lat: 30.05,
    summary: '翻越折多山入康巴，贴合山从人面起、云傍马头生的山路体验。',
    effect: 'windgust',
    fullText: `见说蚕丛路，崎岖不易行。
山从人面起，云傍马头生。
芳树笼秦栈，春流绕蜀城。
升沉应已定，不必问君平。`,
  }),
  createPoemMarker({
    id: 'west-sichuan-luding-longmarch',
    title: '七律·长征',
    author: '毛泽东',
    dynasty: '近现代',
    locationName: '四川甘孜 · 泸定桥',
    lon: 102.234,
    lat: 29.914,
    summary: '大渡桥横铁索寒，泸定桥点位直接承接长征历史。',
    effect: 'windgust',
    fullText: `红军不怕远征难，万水千山只等闲。
五岭逶迤腾细浪，乌蒙磅礴走泥丸。
金沙水拍云崖暖，大渡桥横铁索寒。
更喜岷山千里雪，三军过后尽开颜。`,
  }),
];
