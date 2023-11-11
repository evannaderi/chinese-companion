import { useState, useEffect } from 'react';
import styles from "./ChineseSegment.module.css"

const localTranslations = {
    // "爱": { English: "love", Pinyin: "ài" },
    // "爱好": { English: "hobby", Pinyin: "ài hào" },
    // "八": { English: "eight", Pinyin: "bā" },
    // "爸爸": { English: "dad", Pinyin: "bàba" },
    // "吧": { English: "(interjection particle)", Pinyin: "ba" },
    // "白": { English: "white", Pinyin: "bái" },
    // "白天": { English: "day", Pinyin: "bái tiān" },
    // "百": { English: "hundred", Pinyin: "bǎi" },
    // "班": { English: "class", Pinyin: "bān" },
    // "半": { English: "half", Pinyin: "bàn" },
    // "半年": { English: "half a year", Pinyin: "bàn nián" },
    // "半天": { English: "half day", Pinyin: "bàn tiān" },
    // "帮": { English: "help", Pinyin: "bāng" },
    // "帮忙": { English: "help", Pinyin: "bāng máng" },
    // "包": { English: "package", Pinyin: "bāo" },
    // "包子": { English: "bun", Pinyin: "bāo zi" },
    // "杯": { English: "cup", Pinyin: "bēi" },
    // "杯子": { English: "cup", Pinyin: "bēi zi" },
    // "北": { English: "north", Pinyin: "běi" },
    // "北边": { English: "North side", Pinyin: "běi biān" },
    // "北京": { English: "Beijing", Pinyin: "běi jīng" },
    // "本": { English: "(measure word for books or volumes)", Pinyin: "běn" },
    // "本子": { English: "book", Pinyin: "běn zi" },
    // "比": { English: "particle used for comparison", Pinyin: "bǐ" },
    // "别": { English: "Don’t", Pinyin: "bié" },
    // "别的": { English: "other", Pinyin: "bié de" },
    // "别人": { English: "other people", Pinyin: "bié·rén" },
    // "病": { English: "disease", Pinyin: "bìng" },
    // "病人": { English: "patient", Pinyin: "bìng rén" },
    // "不大": { English: "not big", Pinyin: "bú dà" },
    // "不对": { English: "wrong", Pinyin: "bú duì" },
    // "不客气": { English: "You’re welcome", Pinyin: "bú kè qì" },
    // "不用": { English: "No need to", Pinyin: "bú yòng" },
    // "不": { English: "No", Pinyin: "bù" },
    // "菜": { English: "dish", Pinyin: "cài" },
    // "茶": { English: "tea", Pinyin: "chá" },
    // "差": { English: "differ from; bad; short of", Pinyin: "chà" },
    // "常": { English: "often", Pinyin: "cháng" },
    // "常常": { English: "often", Pinyin: "cháng cháng" },
    // "唱": { English: "sing", Pinyin: "chàng" },
    // "唱歌": { English: "sing", Pinyin: "chàng gē" },
    // "车": { English: "car", Pinyin: "chē" },
    // "车票": { English: "ticket", Pinyin: "chē piào" },
    // "车上": { English: "in the car", Pinyin: "chē shàng" },
    // "车站": { English: "station", Pinyin: "chē zhàn" },
    // "吃": { English: "eat", Pinyin: "chī" },
    // "吃饭": { English: "have meal", Pinyin: "chī fàn" },
    // "出": { English: "out", Pinyin: "chū" },
    // "出来": { English: "come", Pinyin: "chū lái" },
    // "出去": { English: "go out", Pinyin: "chū qù" },
    // "穿": { English: "wear", Pinyin: "chuān" },
    // "床": { English: "bed", Pinyin: "chuáng" },
    // "次": { English: "(measure word for times, frequency)", Pinyin: "cì" },
    // "从": { English: "from", Pinyin: "cóng" },
    // "错": { English: "wrong", Pinyin: "cuò" },
    // "打": { English: "hit, take", Pinyin: "dǎ" },
    // "打车": { English: "take a taxi", Pinyin: "dǎ chē" },
    // "打电话": { English: "make a phonecall", Pinyin: "dǎ diàn huà" },
    // "打开": { English: "turn on", Pinyin: "dǎ kāi" },
    // "打球": { English: "play ball", Pinyin: "dǎ qiú" },
    // "大": { English: "large, big", Pinyin: "dà" },
    // "大学": { English: "university", Pinyin: "dà xué" },
    // "大学生": { English: "university student", Pinyin: "dà xué shēng" },
    // "到": { English: "reach", Pinyin: "dào" },
    // "得到": { English: "get", Pinyin: "dé dào" },
    // "地": { English: "ground", Pinyin: "dì" },
    // "的": { English: "(aux.)", Pinyin: "de" },
    // "等": { English: "wait", Pinyin: "děng" },
    // "地": { English: "ground", Pinyin: "dì" },
    // "地点": { English: "location", Pinyin: "dìdiǎn" },
    // "地方": { English: "local", Pinyin: "dìfang" },
    // "地上": { English: "on the ground", Pinyin: "dì shàng" },
    // "地图": { English: "Map", Pinyin: "dìtú" },
    // "弟弟": { English: "younger brother", Pinyin: "dì di" },
    // "第": { English: "auxiliary word for ordinal numbers (second)", Pinyin: "dì" },
    // "点": { English: "spot", Pinyin: "diǎn" },
    // "电": { English: "electricity", Pinyin: "diàn" },
    // "电话": { English: "phone", Pinyin: "diàn huà" },
    // "电脑": { English: "Computer", Pinyin: "diànnǎo" },
    // "电视": { English: "television", Pinyin: "diànshì" },
    // "电视机": { English: "television", Pinyin: "diàn shì jī" },
    // "电影": { English: "Film", Pinyin: "diànyǐng" },
    // "电影院": { English: "cinema; movie theater", Pinyin: "diàn yǐng yuàn" },
    // "东": { English: "east", Pinyin: "dōng" },
    // "东边": { English: "east side", Pinyin: "dōng biān" },
    // "东西": { English: "thing", Pinyin: "dōngxi" },
    // "动": { English: "move", Pinyin: "dòng" },
    // "动作": { English: "action", Pinyin: "dòngzuò" },
    // "都": { English: "all", Pinyin: "dōu" },
    // "读": { English: "read", Pinyin: "dú" },
    // "读书": { English: "reading; study", Pinyin: "dú shū" },
    // "对": { English: "right", Pinyin: "duì" },
    // "对不起": { English: "I’m sorry.", Pinyin: "duìbuqǐ" },
    // "多": { English: "many; much; more", Pinyin: "duō" },
    // "多少": { English: "how much", Pinyin: "duōshao" },
    // "饿": { English: "hungry", Pinyin: "è" },
    // "儿子": { English: "son", Pinyin: "érzi" },
    // "二": { English: "Two", Pinyin: "èr" },
    // "饭": { English: "rice; meal", Pinyin: "fàn" },
    // "饭店": { English: "restaurant", Pinyin: "fàndiàn" },
    // "房间": { English: "Room", Pinyin: "fángjiān" },
    // "房子": { English: "house; building", Pinyin: "fáng zi" },
    // "放": { English: "discharge", Pinyin: "fàng" },
    // "放假": { English: "holiday; have a holiday", Pinyin: "fàng jià" },
    // "放学": { English: "off school", Pinyin: "fàng xué" },
    // "飞": { English: "fly", Pinyin: "fēi" },
    // "飞机": { English: "aircraft", Pinyin: "fēijī" },
    // "非常": { English: "very", Pinyin: "fēicháng" },
    // "分": { English: "minute; point; part; (measure word)", Pinyin: "fēn" },
    // "风": { English: "wind", Pinyin: "fēng" },
    // "干": { English: "dry", Pinyin: "gān" },
    // "干净": { English: "clean", Pinyin: "gānjìng" },
    // "干": { English: "do", Pinyin: "gàn" },
    // "干什么": { English: "What to do", Pinyin: "gàn shén me" },
    // "高": { English: "high", Pinyin: "gāo" },
    // "高兴": { English: "happy", Pinyin: "gāoxìng" },
    // "告诉": { English: "tell", Pinyin: "gàosu" },
    // "哥哥": { English: "elder brother", Pinyin: "gē ge" },
    // "歌": { English: "song", Pinyin: "gē" },
    // "个": { English: "individual", Pinyin: "gè" },
    // "给": { English: "give", Pinyin: "gěi" },
    // "跟": { English: "with", Pinyin: "gēn" },
    // "工人": { English: "Worker", Pinyin: "gōngrén" },
    // "工作": { English: "work", Pinyin: "gōngzuò" },
    // "关": { English: "shut; close; turn off", Pinyin: "guān" },
    // "关上": { English: "close; shut to; turn off", Pinyin: "guān shàng" },
    // "贵": { English: "noble", Pinyin: "guì" },
    // "国": { English: "country; state; nation", Pinyin: "guó" },
    // "国家": { English: "Country", Pinyin: "guójiā" },
    // "国外": { English: "foreign; overseas; abroad", Pinyin: "guó wài" },
    // "过": { English: "pass", Pinyin: "guò" },
    // "还": { English: "also; still; yet", Pinyin: "hái" },
    // "还是": { English: "still", Pinyin: "háishi" },
    // "还有": { English: "also; in addition; besides", Pinyin: "hái yǒu" },
    // "孩子": { English: "Children", Pinyin: "háizi" },
    // "汉语": { English: "Chinese", Pinyin: "hànyǔ" },
    // "汉字": { English: "Chinese character", Pinyin: "hàn zì" },
    // "好": { English: "good", Pinyin: "hǎo" },
    // "好吃": { English: "Yummy", Pinyin: "hǎochī" },
    // "好看": { English: "good looking", Pinyin: "hǎo kàn" },
    // "好听": { English: "pleasant to hear", Pinyin: "hǎo tīng" },
    // "好玩儿": { English: "fun; interesting", Pinyin: "hǎo wánr" },
    // "号": { English: "Number/date", Pinyin: "hào" },
    // "喝": { English: "drink", Pinyin: "hē" },
    // "和": { English: "and", Pinyin: "hé" },
    // "很": { English: "very", Pinyin: "hěn" },
    // "后": { English: "back; behind; after; later", Pinyin: "hòu" },
    // "后边": { English: "behind; back", Pinyin: "hòu biān" },
    // "后天": { English: "day after tomorrow", Pinyin: "hòu tiān" },
    // "花": { English: "flower", Pinyin: "huā" },
    // "话": { English: "word; words", Pinyin: "huà" },
    // "坏": { English: "bad", Pinyin: "huài" },
    // "还": { English: "return; pay back", Pinyin: "huán" },
    // "回": { English: "go back; return", Pinyin: "huí" },
    // "回答": { English: "Answer", Pinyin: "huídá" },
    // "回到": { English: "back to", Pinyin: "huí dào" },
    // "回家": { English: "go home; return home", Pinyin: "huí jiā" },
    // "回来": { English: "come back; return", Pinyin: "huí lái" },
    // "回去": { English: "go back", Pinyin: "huí qù" },
    // "会": { English: "can; be able to", Pinyin: "huì" },
    // "火车": { English: "train", Pinyin: "huǒ chē" },
    // "机场": { English: "Airport", Pinyin: "jīchǎng" },
    // "机票": { English: "air ticket", Pinyin: "jī piào" },
    // "鸡蛋": { English: "Egg", Pinyin: "jīdàn" },
    // "几": { English: "several", Pinyin: "jǐ" },
    // "记": { English: "remember", Pinyin: "jì" },
    // "记得": { English: "remember", Pinyin: "jìdé" },
    // "记住": { English: "remember; keep in mind", Pinyin: "jì zhù" },
    // "家": { English: "home", Pinyin: "jiā" },
    // "家里": { English: "In the home", Pinyin: "jiā lǐ" },
    // "家人": { English: "family", Pinyin: "jiā rén" },
    // "间": { English: "between; measure word for rooms", Pinyin: "jiān" },
    // "见": { English: "see; meet", Pinyin: "jiàn" },
    // "见面": { English: "meet", Pinyin: "jiànmiàn" },
    // "教": { English: "teach", Pinyin: "jiāo" },
    // "叫": { English: "call; be called", Pinyin: "jiào" },
    // "教学楼": { English: "teaching building", Pinyin: "jiào xué lóu" },
    // "姐姐": { English: "elder sister", Pinyin: "jiě jie" },
    // "介绍": { English: "introduce", Pinyin: "jièshào" },
    // "今年": { English: "this year", Pinyin: "jīn nián" },
    // "今天": { English: "Today", Pinyin: "jīntiān" },
    // "进": { English: "enter", Pinyin: "jìn" },
    // "进来": { English: "come in", Pinyin: "jìn lái" },
    // "进去": { English: "go in", Pinyin: "jìn qù" },
    // "九": { English: "Nine", Pinyin: "jiǔ" },
    // "就": { English: "as soon as; right away; then", Pinyin: "jiù" },
    // "觉得": { English: "Think", Pinyin: "juéde" },
    // "开": { English: "open", Pinyin: "kāi" },
    // "开车": { English: "drive; drive a car", Pinyin: "kāi chē" },
    // "开会": { English: "have a meeting", Pinyin: "kāi huì" },
    // "开玩笑": { English: "Make fun of", Pinyin: "kāiwánxiào" },
    // "看": { English: "see", Pinyin: "kàn" },
    // "看病": { English: "see a doctor", Pinyin: "kàn bìng" },
    // "看到": { English: "see", Pinyin: "kàn dào" },
    // "看见": { English: "seeing", Pinyin: "kànjiàn" },
    // "考": { English: "test; examine", Pinyin: "kǎo" },
    // "考试": { English: "Examination", Pinyin: "kǎoshì" },
    // "渴": { English: "thirsty", Pinyin: "kě" },
    // "课": { English: "course", Pinyin: "kè" },
    // "课文": { English: "text", Pinyin: "kè wén" },
    // "口": { English: "mouth", Pinyin: "kǒu" },
    // "块": { English: "block", Pinyin: "kuài" },
    // "快": { English: "fast", Pinyin: "kuài" },
    // "来": { English: "come", Pinyin: "lái" },
    // "来到": { English: "come; arrive", Pinyin: "lái dào" },
    // "老": { English: "old; aged", Pinyin: "lǎo" },
    // "老人": { English: "old people; the aged", Pinyin: "lǎo rén" },
    // "老师": { English: "Teacher", Pinyin: "lǎoshī" },
    // "了": { English: "past tense marker", Pinyin: "le" },
    // "累": { English: "tired", Pinyin: "lèi" },
    // "冷": { English: "cold", Pinyin: "lěng" },
    // "里": { English: "in", Pinyin: "lǐ" },
    // "里边": { English: "inside", Pinyin: "lǐ biān" },
    // "两": { English: "two", Pinyin: "liǎng" },
    // "零": { English: "zero", Pinyin: "líng" },
    // "六": { English: "Six", Pinyin: "liù" },
    // "楼": { English: "floor", Pinyin: "lóu" },
    // "楼上": { English: "upstairs", Pinyin: "lóu shàng" },
    // "楼下": { English: "downstairs", Pinyin: "lóu xià" },
    // "路": { English: "road", Pinyin: "lù" },
    // "路口": { English: "intersection; crossing", Pinyin: "lù kǒu" },
    // "路上": { English: "on the road", Pinyin: "lù shàng" },
    // "妈妈": { English: "mom; mother", Pinyin: "mā ma" },
    // "马路": { English: "road; street", Pinyin: "mǎ lù" },
    // "马上": { English: "Right off", Pinyin: "mǎshàng" },
    // "吗": { English: "auxiliary word", Pinyin: "ma" },
    // "买": { English: "buy", Pinyin: "mǎi" },
    // "慢": { English: "slow", Pinyin: "màn" },
    // "忙": { English: "busy", Pinyin: "máng" },
    // "毛": { English: "a fractional unit of money in China (measure word)", Pinyin: "máo" },
    // "没": { English: "no", Pinyin: "méi" },
    // "没关系": { English: "No problem", Pinyin: "méiguānxi" },
    // "没什么": { English: "It’s nothing", Pinyin: "méi shén me" },
    // "没事儿": { English: "It’s okay", Pinyin: "méi shìr" },
    // "没有": { English: "have not; no", Pinyin: "méi yǒu" },
    // "妹妹": { English: "younger sister", Pinyin: "mèi mei" },
    // "门": { English: "door", Pinyin: "mén" },
    // "门口": { English: "doorway", Pinyin: "mén kǒu" },
    // "门票": { English: "tickets", Pinyin: "mén piào" },
    // "们": { English: "plural marker for pronouns and a few animate nouns (friends)", Pinyin: "men" },
    // "米饭": { English: "Steamed Rice", Pinyin: "mǐfàn" },
    // "面包": { English: "Bread", Pinyin: "miànbāo" },
    // "面条": { English: "noodles", Pinyin: "miàn tiáor" },
    // "名字": { English: "Name", Pinyin: "míngzi" },
    // "明白": { English: "clear", Pinyin: "míngbai" },
    // "明年": { English: "next year", Pinyin: "míng nián" },
    // "明天": { English: "Tomorrow", Pinyin: "míngtiān" },
    // "拿": { English: "take", Pinyin: "ná" },
    // "哪": { English: "which", Pinyin: "nǎ" },
    // "哪里": { English: "where", Pinyin: "nǎ lǐ" },
    // "哪儿": { English: "where", Pinyin: "nǎr" },
    // "哪些": { English: "which", Pinyin: "nǎ xiē" },
    // "那": { English: "that", Pinyin: "nà" },
    // "那边": { English: "there", Pinyin: "nà biān" },
    // "那里": { English: "there", Pinyin: "nà lǐ" },
    // "那儿": { English: "there", Pinyin: "nàr" },
    // "那些": { English: "those", Pinyin: "nà xiē" },
    // "奶": { English: "milk", Pinyin: "nǎi" },
    // "奶奶": { English: "grandma", Pinyin: "nǎinai" },
    // "男": { English: "Man", Pinyin: "nán" },
    // "男孩儿": { English: "boy", Pinyin: "nán háir" },
    // "男朋友": { English: "boyfriend", Pinyin: "nán péng yǒu" },
    // "男人": { English: "man", Pinyin: "nán ren" },
    // "男生": { English: "boy", Pinyin: "nán shēng" },
    // "南": { English: "south", Pinyin: "nán" },
    // "南边": { English: "south; south side", Pinyin: "nán biān" },
    // "难": { English: "hard, difficult", Pinyin: "nán" },
    // "呢": { English: "auxiliary word", Pinyin: "ne" },
    // "能": { English: "can", Pinyin: "néng" },
    // "你": { English: "you", Pinyin: "nǐ" },
    // "你们": { English: "you", Pinyin: "nǐ men" },
    // "年": { English: "year", Pinyin: "nián" },
    // "您": { English: "you", Pinyin: "nín" },
    // "牛奶": { English: "milk", Pinyin: "niúnǎi" },
    // "女": { English: "woman", Pinyin: "nǚ" },
    // "女儿": { English: "daughter", Pinyin: "nǚ’ér" },
    // "女孩儿": { English: "girl", Pinyin: "nǚ háir" },
    // "女朋友": { English: "girlfriend", Pinyin: "nǚ péng yǒu" },
    // "女人": { English: "woman", Pinyin: "nǚ ren" },
    // "女生": { English: "girl", Pinyin: "nǚ shēng" },
    // "旁边": { English: "Side", Pinyin: "pángbiān" },
    // "跑": { English: "run", Pinyin: "pǎo" },
    // "朋友": { English: "Friend", Pinyin: "péngyou" },
    // "票": { English: "ticket", Pinyin: "piào" },
    // "七": { English: "Seven", Pinyin: "qī" },
    // "起": { English: "get up; start; rise", Pinyin: "qǐ" },
    // "起床": { English: "Get up", Pinyin: "qǐchuáng" },
    // "起来": { English: "get up", Pinyin: "qǐlái" },
    // "汽车": { English: "car", Pinyin: "qì chē" },
    // "前": { English: "front", Pinyin: "qián" },
    // "前边": { English: "in front", Pinyin: "qián biān" },
    // "前天": { English: "the day before yesterday", Pinyin: "qián tiān" },
    // "钱": { English: "money", Pinyin: "qián" },
    // "钱包": { English: "wallet", Pinyin: "qián bāo" },
    // "请": { English: "please", Pinyin: "qǐng" },
    // "请假": { English: "ask for leave", Pinyin: "qǐngjià" },
    // "请进": { English: "please come in", Pinyin: "qǐng jìn" },
    // "请问": { English: "excuse me", Pinyin: "qǐng wèn" },
    // "请坐": { English: "please have a seat", Pinyin: "qǐng zuò" },
    // "球": { English: "ball", Pinyin: "qiú" },
    // "去": { English: "go", Pinyin: "qù" },
    // "去年": { English: "Last year", Pinyin: "qùnián" },
    // "热": { English: "heat", Pinyin: "rè" },
    // "人": { English: "people", Pinyin: "rén" },
    // "认识": { English: "know", Pinyin: "rènshi" },
    // "认真": { English: "earnest", Pinyin: "rènzhēn" },
    // "日": { English: "date", Pinyin: "rì" },
    // "日期": { English: "Date", Pinyin: "rìqī" },
    // "肉": { English: "meat", Pinyin: "ròu" },
    // "三": { English: "Three", Pinyin: "sān" },
    // "山": { English: "mountain", Pinyin: "shān" },
    // "商场": { English: "mall; shopping mall", Pinyin: "shāng chǎng" },
    // "商店": { English: "Shop", Pinyin: "shāngdiàn" },
    // "上": { English: "upper", Pinyin: "shàng" },
    // "上班": { English: "go to work", Pinyin: "shàngbān" },
    // "上边": { English: "above; on", Pinyin: "shàng biān" },
    // "上车": { English: "get on", Pinyin: "shàng chē" },
    // "上次": { English: "last time", Pinyin: "shàng cì" },
    // "上课": { English: "attend class; have a class", Pinyin: "shàng kè" },
    // "上网": { English: "Surf the Internet", Pinyin: "shàngwǎng" },
    // "上午": { English: "morning", Pinyin: "shàngwǔ" },
    // "上学": { English: "go to school", Pinyin: "shàng xué" },
    // "少": { English: "less", Pinyin: "shǎo" },
    // "谁": { English: "who", Pinyin: "shéi" },
    // "身上": { English: "body; on one’s body", Pinyin: "shēn shàng" },
    // "身体": { English: "body", Pinyin: "shēntǐ" },
    // "什么": { English: "What", Pinyin: "shénme" },
    // "生病": { English: "Fall ill", Pinyin: "shēngbìng" },
    // "生气": { English: "get angry", Pinyin: "shēngqì" },
    // "生日": { English: "Birthday", Pinyin: "shēngrì" },
    // "十": { English: "Ten", Pinyin: "shí" },
    // "时候": { English: "time", Pinyin: "shíhou" },
    // "时间": { English: "time", Pinyin: "shíjiān" },
    // "事": { English: "thing", Pinyin: "shì" },
    // "试": { English: "try", Pinyin: "shì" },
    // "是": { English: "yes", Pinyin: "shì" },
    // "是不是": { English: "isn’t it?", Pinyin: "shì bú shì" },
    // "手": { English: "hand", Pinyin: "shǒu" },
    // "手机": { English: "Mobile phone", Pinyin: "shǒujī" },
    // "书": { English: "book", Pinyin: "shū" },
    // "书包": { English: "school bag", Pinyin: "shū bāo" },
    // "书店": { English: "bookstore", Pinyin: "shū diàn" },
    // "树": { English: "tree", Pinyin: "shù" },
    // "水": { English: "water", Pinyin: "shuǐ" },
    // "水果": { English: "Fruits", Pinyin: "shuǐguǒ" },
    // "睡": { English: "sleep", Pinyin: "shuì" },
    // "睡觉": { English: "sleep", Pinyin: "shuìjiào" },
    // "说": { English: "speak", Pinyin: "shuō" },
    // "说话": { English: "talk", Pinyin: "shuōhuà" },
    // "四": { English: "Four", Pinyin: "sì" },
    // "送": { English: "give", Pinyin: "sòng" },
    // "岁": { English: "year, age", Pinyin: "suì" },
    // "他": { English: "he", Pinyin: "tā" },
    // "他们": { English: "they", Pinyin: "tā men" },
    // "她": { English: "she", Pinyin: "tā" },
    // "她们": { English: "they", Pinyin: "tā men" },
    // "太": { English: "too", Pinyin: "tài" },
    // "天": { English: "day", Pinyin: "tiān" },
    // "天气": { English: "weather", Pinyin: "tiānqì" },
    // "听": { English: "hear", Pinyin: "tīng" },
    // "听到": { English: "hear", Pinyin: "tīng dào" },
    // "听见": { English: "hear", Pinyin: "tīng jiàn" },
    // "听写": { English: "dictation; dictate", Pinyin: "tīng xiě" },
    // "同学": { English: "Classmate", Pinyin: "tóngxué" },
    // "图书馆": { English: "Library", Pinyin: "túshūguǎn" },
    // "外": { English: "abroad, outside", Pinyin: "wài" },
    // "外边": { English: "outside", Pinyin: "wài biān" },
    // "外国": { English: "foreign country", Pinyin: "wài guó" },
    // "外语": { English: "foreign language", Pinyin: "wài yǔ" },
    // "玩儿": { English: "play", Pinyin: "wánr" },
    // "晚": { English: "late", Pinyin: "wǎn" },
    // "晚饭": { English: "dinner", Pinyin: "wǎn fàn" },
    // "晚上": { English: "Night", Pinyin: "wǎnshang" },
    // "网上": { English: "online", Pinyin: "wǎng shàng" },
    // "网友": { English: "net friend", Pinyin: "wǎng yǒu" },
    // "忘": { English: "forget", Pinyin: "wàng" },
    // "忘记": { English: "forget", Pinyin: "wàngjì" },
    // "问": { English: "ask", Pinyin: "wèn" },
    // "我": { English: "I", Pinyin: "wǒ" },
    // "我们": { English: "We", Pinyin: "wǒmen" },
    // "五": { English: "Five", Pinyin: "wǔ" },
    // "午饭": { English: "lunch", Pinyin: "wǔ fàn" },
    // "西": { English: "west", Pinyin: "xī" },
    // "西边": { English: "west; west side", Pinyin: "xī biān" },
    // "洗": { English: "wash", Pinyin: "xǐ" },
    // "洗手间": { English: "Restroom", Pinyin: "xǐshǒujiān" },
    // "喜欢": { English: "like", Pinyin: "xǐhuan" },
    // "下（名、动）": { English: "below; under; next; go down; get off", Pinyin: "xià" },
    // "下班": { English: "get off work", Pinyin: "xià bān" },
    // "下边": { English: "below; under", Pinyin: "xià biān" },
    // "下车": { English: "get off", Pinyin: "xià chē" },
    // "下次": { English: "next time", Pinyin: "xià cì" },
    // "下课": { English: "finish class", Pinyin: "xià kè" },
    // "下午": { English: "Afternoon", Pinyin: "xiàwǔ" },
    // "下雨": { English: "rain", Pinyin: "xiàyǔ" },
    // "先": { English: "before", Pinyin: "xiān" },
    // "先生": { English: "Sir", Pinyin: "xiānsheng" },
    // "现在": { English: "Now", Pinyin: "xiànzài" },
    // "想": { English: "think", Pinyin: "xiǎng" },
    // "小": { English: "Small", Pinyin: "xiǎo" },
    // "小孩儿": { English: "child; kid", Pinyin: "xiǎo háir" },
    // "小姐": { English: "Miss", Pinyin: "xiǎojiě" },
    // "小朋友": { English: "child; kid", Pinyin: "xiǎo péng yǒu" },
    // "小时": { English: "hour", Pinyin: "xiǎoshí" },
    // "小学": { English: "primary school; elementary school", Pinyin: "xiǎo xué" },
    // "小学生": { English: "elementary school student", Pinyin: "xiǎo xué shēng" },
    // "笑": { English: "laugh", Pinyin: "xiào" },
    // "写": { English: "write", Pinyin: "xiě" },
    // "谢谢": { English: "Thank you", Pinyin: "xièxie" },
    // "新": { English: "new", Pinyin: "xīn" },
    // "新年": { English: "New Year", Pinyin: "xīn nián" },
    // "星期": { English: "week", Pinyin: "xīngqī" },
    // "星期日": { English: "Sunday", Pinyin: "xīng qī rì" },
    // "星期天": { English: "Sunday", Pinyin: "xīng qī tiān" },
    // "行": { English: "That’s ok", Pinyin: "xíng" },
    // "休息": { English: "Rest", Pinyin: "xiūxi" },
    // "学": { English: "learn; study", Pinyin: "xué" },
    // "学生": { English: "Student", Pinyin: "xuésheng" },
    // "学习": { English: "Study", Pinyin: "xuéxí" },
    // "学校": { English: "School", Pinyin: "xuéxiào" },
    // "学院": { English: "college; academy", Pinyin: "xué yuàn" },
    // "要（动）": { English: "want", Pinyin: "yào" },
    // "爷爷": { English: "grandpa", Pinyin: "yéye" },
    // "也": { English: "also", Pinyin: "yě" },
    // "页": { English: "page", Pinyin: "yè" },
    // "一": { English: "One", Pinyin: "yī" },
    // "衣服": { English: "clothes", Pinyin: "yīfu" },
    // "医生": { English: "Doctor", Pinyin: "yīshēng" },
    // "医院": { English: "Hospital", Pinyin: "yīyuàn" },
    // "一半": { English: "half", Pinyin: "yí bàn" },
    // "一会儿": { English: "A little while", Pinyin: "yíhuìr" },
    // "一块儿": { English: "together", Pinyin: "yí kuàir" },
    // "一下儿": { English: "a little bit", Pinyin: "yí xiàr" },
    // "一样": { English: "equally", Pinyin: "yíyàng" },
    // "一边": { English: "One side", Pinyin: "yìbiān" },
    // "一点儿": { English: "a little bit", Pinyin: "yīdiǎnr" },
    // "一起": { English: "together", Pinyin: "yìqǐ" },
    // "一些": { English: "some", Pinyin: "yì xiē" },
    // "用": { English: "use", Pinyin: "yòng" },
    // "有": { English: "have", Pinyin: "yǒu" },
    // "有的": { English: "some", Pinyin: "yǒu de" },
    // "有名": { English: "Famous", Pinyin: "yǒumíng" },
    // "有时候｜有时": { English: "sometimes", Pinyin: "yǒu shí hòu ｜ yǒu shí" },
    // "有（一）些": { English: "some", Pinyin: "yǒu （ yì ） xiē" },
    // "有用": { English: "useful", Pinyin: "yǒu yòng" },
    // "右": { English: "right", Pinyin: "yòu" },
    // "右边": { English: "Right", Pinyin: "yòubian" },
    // "雨": { English: "rain", Pinyin: "yǔ" },
    // "元": { English: "element; Yuan", Pinyin: "yuán" },
    // "远": { English: "far", Pinyin: "yuǎn" },
    // "月": { English: "month", Pinyin: "yuè" },
    // "再": { English: "again", Pinyin: "zài" },
    // "再见": { English: "Bye", Pinyin: "zàijiàn" },
    // "在": { English: "stay; in process of", Pinyin: "zài" },
    // "在家": { English: "at home", Pinyin: "zài jiā" },
    // "早": { English: "early", Pinyin: "zǎo" },
    // "早饭": { English: "breakfast", Pinyin: "zǎo fàn" },
    // "早上": { English: "Morning", Pinyin: "zǎoshang" },
    // "怎么": { English: "How", Pinyin: "zěnme" },
    // "站（名）": { English: "station", Pinyin: "zhàn" },
    // "找": { English: "look for", Pinyin: "zhǎo" },
    // "找到": { English: "find", Pinyin: "zhǎo dào" },
    // "这": { English: "Here (here)", Pinyin: "zhè" },
    // "这边": { English: "here", Pinyin: "zhè biān" },
    // "这里": { English: "here", Pinyin: "zhè lǐ" },
    // "这儿": { English: "here", Pinyin: "zhèr" },
    // "这些": { English: "these", Pinyin: "zhè xiē" },
    // "着": { English: "in process of", Pinyin: "zhe" },
    // "真": { English: "really", Pinyin: "zhēn" },
    // "真的": { English: "really", Pinyin: "zhēn de" },
    // "正（副）": { English: "just; exactly", Pinyin: "zhèng" },
    // "正在": { English: "in process of", Pinyin: "zhèngzài" },
    // "知道": { English: "know", Pinyin: "zhīdào" },
    // "知识": { English: "knowledge", Pinyin: "zhīshi" },
    // "中": { English: "middle; in", Pinyin: "zhōng" },
    // "中国": { English: "China", Pinyin: "zhōngguó" },
    // "中间": { English: "Middle", Pinyin: "zhōngjiān" },
    // "中文": { English: "Chinese", Pinyin: "zhōngwén" },
    // "中午": { English: "Noon", Pinyin: "zhōngwǔ" },
    // "中学": { English: "middle school", Pinyin: "zhōng xué" },
    // "中学生": { English: "middle School student", Pinyin: "zhōng xué shēng" },
    // "重": { English: "heavy", Pinyin: "zhòng" },
    // "重要": { English: "important", Pinyin: "zhòngyào" },
    // "住": { English: "live", Pinyin: "zhù" },
    // "准备": { English: "Get ready", Pinyin: "zhǔnbèi" },
    // "桌子": { English: "Table", Pinyin: "zhuōzi" },
    // "字": { English: "word, character", Pinyin: "zì" },
    // "子（桌子）": { English: "noun suffix (table)", Pinyin: "zi （ zhuō zi ）" },
    // "走": { English: "go, walk", Pinyin: "zǒu" },
    // "走路": { English: "walk", Pinyin: "zǒu lù" },
    // "最": { English: "most", Pinyin: "zuì" },
    // "最好": { English: "Best", Pinyin: "zuìhǎo" },
    // "最后": { English: "Last", Pinyin: "zuìhòu" },
    // "昨天": { English: "Yesterday", Pinyin: "zuótiān" },
    // "左": { English: "left", Pinyin: "zuǒ" },
    // "左边": { English: "left", Pinyin: "zuǒbian" },
    // "坐": { English: "sit", Pinyin: "zuò" },
    // "坐下": { English: "sit down", Pinyin: "zuò xià" },
    // "做": { English: "do", Pinyin: "zuò" },
  };
  // Link:

function ChineseSegment({ text, saveWord }) {
    const [segmentedText, setSegmentedText] = useState([]);
    const [segmentMapping, setSegmentMapping] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentWord, setCurrentWord] = useState("");

    useEffect(() => {
        const loadJieba = async () => {
            await loadScript("https://pulipulichen.github.io/jieba-js/jquery.js");
            await loadScript("https://pulipulichen.github.io/jieba-js/require-jieba-js.js");
            
            if (window.call_jieba_cut) {
                window.call_jieba_cut(text, async (result) => {
                    const newTranslations = await getTranslations(result);
                    setSegmentedText(result);
                    setSegmentMapping(prevMapping => ({ ...prevMapping, ...newTranslations }));
                });
            }
        };
        
        loadJieba();
    }, [text]);

    async function callTranslate(text) {
        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: text }),
            });
    
            const data = await response.json();
    
            if (response.status !== 200 || !data.result) {
                throw new Error(`Request failed with status ${response.status}`);
            }
    
            return data;
    
        } catch (error) {
            console.error(error);
            // If there's an error, return a default value
            return {
                result: "Translation Error"
            };
        }
    }
    

    
      async function getTranslations(segments) {
          
        
        
    
        const results = {};
    
        for (const segment of segments) {
            if (/^[a-zA-Z\s]+$/.test(segment) || /^[.,!?;]$/.test(segment)) {
                continue;
            }
            if (/^[^\u4e00-\u9fa5]+$/.test(segment)) { // This regex checks for non-Chinese characters
                continue;
            }
            let result;
            if (localTranslations[segment]) {
                results[segment] = localTranslations[segment].Pinyin + " " + localTranslations[segment].English;
            } else {
                // Fetch from the API for segments not in local translations.
                //results[segment] = (await callTranslate(segment)).result;
                result = (await callDictTranslate(segment)).result;
                localTranslations[segment] = result;
                results[segment] = result;
            }
        }
        return results;
    }

    const handleWordClick = (word) => {
        setCurrentWord(word);
        setIsModalOpen(true);
    };

    const handleSaveWord = () => {
        let wordTranslation = {
            "character": currentWord,
            "translation": localTranslations[currentWord]
        }
        saveWord(wordTranslation);
        setIsModalOpen(false); // Close the modal after saving
    };

    const WordModal = ({ isOpen, word, onSave }) => {
        if (!isOpen) return null;

        return (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                    <p>{word}</p> {/* Display the current word here */}
                    <p>{localTranslations[word]}</p>
                    <button onClick={onSave}>Save Word</button>
                </div>
            </div>
        );
    };
    

    return (
        <>
            <WordModal isOpen={isModalOpen} word={currentWord} onSave={handleSaveWord} />
            <span className={styles.segmentedText}>
                {segmentedText.map((segment, idx) => (
                    <span 
                        key={idx} 
                        className={styles.character} 
                        onClick={() => handleWordClick(segment)}
                        data-tooltip={segmentMapping[segment]}
                    >
                        {segment}
                    </span>
                ))}
            </span>
        </>
    );
}


function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

async function callDictTranslate(text) {
    try {
        console.log("Calling API")
        const response = await fetch("/api/lookup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: text }),
        });

        const data = await response.json();

        if (response.status !== 200 || !data.result) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return data;

    } catch (error) {
        console.error(error);
        // If there's an error, return a default value
        return {
            result: "Translation Error"
        };
    }
}


export default ChineseSegment;
