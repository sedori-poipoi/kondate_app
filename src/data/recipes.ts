export interface Ingredient {
    name: string;
    amount: string;
    unit: string;
    category: '野菜' | '肉' | '魚介' | '豆腐・卵' | '乾物・加工品' | '調味料' | 'その他';
}

export interface Recipe {
    id: string;
    name: string;
    genre: '和食' | '洋食' | '中華' | '韓国';
    category: '主菜' | '副菜' | '汁物';
    protein: string;
    servings: number;
    ingredients: Ingredient[];
    steps: string[];
    prepTime: number;
    cookTime: number;
    tips: string;
    isCustom?: boolean;
    sourceUrl?: string;
    mealType?: ('Breakfast' | 'Lunch' | 'Dinner')[];
    tags?: string[];
}

const _recipes: Recipe[] = [
    // ===== YouTube追加分 (1週間30分献立#198) =====
    {
        id: 'yuri-yt-main-01', name: '肉団子とれんこんの黒酢あん', genre: '和食', category: '主菜', protein: '豚',
        servings: 2,
        mealType: ['Dinner'],
        tags: ['ガッツリ'],
        sourceUrl: 'https://momrecipe.net/recipe/001674/',
        ingredients: [
            { name: '豚ひき肉', amount: '250', unit: 'g', category: '肉' },
            { name: '玉ねぎ', amount: '1/4', unit: '個(50g)', category: '野菜' },
            { name: 'れんこん', amount: '1/2', unit: '節(100g)', category: '野菜' },
            { name: '塩こしょう', amount: '少々', unit: '', category: '調味料' },
            { name: '片栗粉', amount: '小さじ2', unit: '', category: '調味料' },
            { name: 'おろし生姜', amount: '小さじ1/2', unit: '', category: '調味料' },
            { name: 'おろしにんにく', amount: '小さじ1/2', unit: '', category: '調味料' },
            { name: '黒酢', amount: '大さじ3', unit: '', category: '調味料' },
            { name: 'オイスターソース', amount: '大さじ2', unit: '', category: '調味料' },
            { name: '砂糖・酒・みりん', amount: '各大さじ1', unit: '', category: '調味料' },
        ],
        steps: [
            '玉ねぎはみじん切り、れんこんは乱切りにする。',
            'ボウルにひき肉、玉ねぎ、塩こしょう、片栗粉小さじ1、生姜、にんにくを入れてよく練り、丸めて肉団子を作る。',
            'フライパンに多めの油を熱し、肉団子とれんこんを揚げ焼きにする。',
            '火が通ったら、黒酢、オイスターソース、砂糖・酒・みりん、片栗粉小さじ1を混ぜ合わせたタレを加え、とろみがつくまで絡める。'
        ],
        prepTime: 10, cookTime: 15, tips: 'れんこんのシャキシャキ感と黒酢の酸味が食欲をそそります。'
    },
    {
        id: 'yuri-yt-main-02', name: '鍋つゆ不要♪豚バラと千切り野菜のつるつる鍋', genre: '和食', category: '主菜', protein: '豚',
        servings: 2,
        mealType: ['Dinner', 'Lunch'],
        tags: ['アッサリ', '時短・力尽き'],
        sourceUrl: 'https://momrecipe.net/recipe/001677/',
        ingredients: [
            { name: '豚バラ肉しゃぶしゃぶ用', amount: '150', unit: 'g', category: '肉' },
            { name: 'キャベツ', amount: '1/4', unit: '個(300g)', category: '野菜' },
            { name: 'にんじん', amount: '1/2', unit: '本(75g)', category: '野菜' },
            { name: '春雨(乾燥)', amount: '50', unit: 'g', category: '乾物・加工品' },
            { name: '水', amount: '600', unit: 'ml', category: 'その他' },
            { name: '醤油', amount: '大さじ3', unit: '', category: '調味料' },
            { name: '鶏がらスープの素', amount: '大さじ1.5', unit: '', category: '調味料' },
            { name: '酒・みりん', amount: '各大さじ1', unit: '', category: '調味料' },
            { name: 'おろし生姜', amount: '小さじ1', unit: '', category: '調味料' },
            { name: 'ごま油', amount: '少々', unit: '', category: '調味料' }
        ],
        steps: [
            'キャベツとにんじんは千切りにする。',
            '鍋に水と調味料（醤油、鶏がら、酒、みりん、生姜）を入れて火にかける。',
            '沸騰したら野菜と春雨を入れ、豚肉をしゃぶしゃぶしながら一緒に食べる。',
            '最後にごま油を垂らして風味をづけする。'
        ],
        prepTime: 5, cookTime: 10, tips: '千切り野菜がお肉に絡んでたっぷり食べられます！春雨の戻しも不要。'
    },
    {
        id: 'yuri-yt-main-03', name: '鶏と根菜の照り煮', genre: '和食', category: '主菜', protein: '鶏',
        servings: 2,
        mealType: ['Dinner'],
        tags: ['ガッツリ'],
        sourceUrl: 'https://momrecipe.net/recipe/001675/',
        ingredients: [
            { name: '鶏もも肉', amount: '1', unit: '枚(250g)', category: '肉' },
            { name: 'れんこん', amount: '1/2', unit: '節(100g)', category: '野菜' },
            { name: 'にんじん', amount: '1/2', unit: '本(75g)', category: '野菜' },
            { name: 'こんにゃく', amount: '1', unit: '枚', category: '乾物・加工品' },
            { name: '醤油・酒・みりん', amount: '各大さじ2', unit: '', category: '調味料' },
            { name: '砂糖', amount: '大さじ1', unit: '', category: '調味料' },
            { name: '水', amount: '150', unit: 'ml', category: 'その他' }
        ],
        steps: [
            '鶏肉、れんこん、にんじん、こんにゃくは一口大に切る。こんにゃくは手でちぎると味が染みやすい。',
            'フライパンに油を熱し、すべての具材を炒める。',
            '全体に油が回ったら、調味料と水を加え、落とし蓋をして汁気が少なくなるまで煮詰める。'
        ],
        prepTime: 10, cookTime: 15, tips: '根菜たっぷり！ご飯がすすむ甘辛い味付けです。'
    },
    {
        id: 'yuri-yt-main-04', name: '照り焼き豚こまチーズボール', genre: '和食', category: '主菜', protein: '豚',
        servings: 2,
        mealType: ['Dinner'],
        tags: ['ガッツリ'],
        sourceUrl: 'https://momrecipe.net/recipe/001676/',
        ingredients: [
            { name: '豚こま肉', amount: '250', unit: 'g', category: '肉' },
            { name: '酒', amount: '大さじ1', unit: '', category: '調味料' },
            { name: '塩こしょう', amount: '少々', unit: '', category: '調味料' },
            { name: '片栗粉', amount: '大さじ2', unit: '', category: '調味料' },
            { name: 'ピザ用チーズ', amount: '50', unit: 'g', category: 'その他' },
            { name: '醤油・酒・みりん・砂糖', amount: '各大さじ1', unit: '', category: '調味料' }
        ],
        steps: [
            '豚こま肉に酒、塩こしょうを揉み込み、片栗粉をまぶす。',
            'チーズを豚肉で包むようにして丸める。',
            'フライパンに油を熱し、丸めたチーズボールを転がしながらこんがり焼く。',
            '火が通ったら、醤油・酒・みりん・砂糖を合わせて回し入れ、全体に絡める。'
        ],
        prepTime: 10, cookTime: 10, tips: '中からチーズがとろ〜り！お弁当にもピッタリのおかずです。'
    },

    // ===== 和食・主菜 =====
    {
        id: 'yuri-main-01', name: '鶏じゃが', genre: '和食', category: '主菜', protein: '鶏',
        servings: 4,
        ingredients: [
            { name: '鶏もも肉', amount: '2', unit: '枚(500g)', category: '肉' },
            { name: 'じゃがいも', amount: '4', unit: '個', category: '野菜' },
            { name: 'にんじん', amount: '1', unit: '本', category: '野菜' },
            { name: '玉ねぎ', amount: '1', unit: '個', category: '野菜' },
            { name: '醤油', amount: '大さじ3', unit: '', category: '調味料' },
            { name: 'みりん', amount: '大さじ2', unit: '', category: '調味料' },
            { name: '砂糖', amount: '大さじ1.5', unit: '', category: '調味料' },
            { name: 'サラダ油', amount: '大さじ1', unit: '', category: '調味料' },
        ],
        steps: [
            'じゃがいもは一口大に切り、レンジ600Wで5分加熱して時短する',
            '【並行】玉ねぎはくし切り、にんじんは乱切り、鶏肉は一口大に切る',
            'フライパンに油を熱し、鶏肉の皮目を下にして焼く。焼き色がついたら野菜を加えて炒める',
            '水200mlと調味料を全て加え、落とし蓋をして中火で15分煮込む',
        ],
        prepTime: 10, cookTime: 20, tips: 'じゃがいもの事前加熱と、煮込み中の余熱活用で味が染み込みます。'
    },
    {
        id: 'yuri-main-02', name: '長芋豚バラガーリック炒め', genre: '和食', category: '主菜', protein: '豚',
        servings: 4,
        ingredients: [
            { name: '豚バラ薄切り肉', amount: '300', unit: 'g', category: '肉' },
            { name: '長芋', amount: '300', unit: 'g', category: '野菜' },
            { name: 'にんにく', amount: '1', unit: '片', category: '野菜' },
            { name: '小ねぎ', amount: '適量', unit: '', category: '野菜' },
            { name: '醤油', amount: '大さじ2', unit: '', category: '調味料' },
            { name: '酒', amount: '大さじ1', unit: '', category: '調味料' },
            { name: 'みりん', amount: '大さじ1', unit: '', category: '調味料' },
            { name: 'ごま油', amount: '大さじ1', unit: '', category: '調味料' },
        ],
        steps: [
            '長芋は皮をむいて1cm厚の半月切りにする。にんにくはスライスする',
            '【並行】豚バラ肉は5cm幅に切る',
            'フライパンにごま油とにんにくを入れて弱火で香り出しし、豚肉を炒める',
            '肉の色が変わったら長芋を加え、両面に焼き色がつくまで炒める',
            '調味料を加えて全体に絡め、器に盛って小ねぎを散らす',
        ],
        prepTime: 10, cookTime: 10, tips: '長芋はホクホク感を残すために炒めすぎないのがポイントです。'
    },
    {
        id: 'yuri-main-03', name: '鶏肉みぞれ煮', genre: '和食', category: '主菜', protein: '鶏',
        servings: 4,
        ingredients: [
            { name: '鶏もも肉', amount: '2', unit: '枚(500g)', category: '肉' },
            { name: '大根', amount: '1/3', unit: '本', category: '野菜' },
            { name: '片栗粉', amount: '大さじ2', unit: '', category: '調味料' },
            { name: 'ポン酢', amount: '大さじ4', unit: '', category: '調味料' },
            { name: 'みりん', amount: '大さじ1', unit: '', category: '調味料' },
            { name: 'サラダ油', amount: '大さじ1', unit: '', category: '調味料' },
            { name: '大葉', amount: '4', unit: '枚', category: '野菜' },
        ],
        steps: [
            '大根はすりおろし、軽く水気を切っておく',
            '【並行】鶏肉は一口大に切り、塩こしょう(少々)をして片栗粉をまぶす',
            'フライパンに油を熱し、鶏肉を皮目から両面こんがり焼く',
            '余分な油を拭き取り、ポン酢、みりん、大根おろしを加えてサッと煮絡める',
            '器に盛り、千切りにした大葉をのせる',
        ],
        prepTime: 10, cookTime: 15, tips: '片栗粉をまぶすことで鶏肉がしっとりし、味がよく絡みます。'
    },
    {
        id: 'yuri-main-04', name: '鮭ときのこのホイル焼き', genre: '和食', category: '主菜', protein: '魚',
        servings: 4,
        ingredients: [
            { name: '生鮭切り身', amount: '4', unit: '切れ', category: '魚介' },
            { name: 'しめじ', amount: '1', unit: 'パック', category: '野菜' },
            { name: 'えのき', amount: '1', unit: 'パック', category: '野菜' },
            { name: '玉ねぎ', amount: '1/2', unit: '個', category: '野菜' },
            { name: 'バター', amount: '20', unit: 'g', category: '調味料' },
            { name: '醤油', amount: '適量', unit: '', category: '調味料' },
            { name: '塩こしょう', amount: '少々', unit: '', category: '調味料' },
        ],
        steps: [
            '鮭に塩こしょうを振っておく。しめじとえのきは石づきを取ってほぐし、玉ねぎは薄切りにする',
            'アルミホイルを広げ、玉ねぎ、鮭、きのこ類の順に重ねる',
            '上にバターをのせ、ホイルの隙間がないようにしっかり包む',
            'フライパンに並べて蓋をし、中火で3分、弱火にして10分蒸し焼きにする',
            '食べる直前にポン酢や醤油をかける',
        ],
        prepTime: 10, cookTime: 15, tips: 'ホイル焼きは洗い物が減り、ほったらかしでできる最高の時短メニュー。'
    },
    {
        id: 'yuri-main-05', name: 'ブリときのこのバター醤油炒め', genre: '和食', category: '主菜', protein: '魚',
        servings: 4,
        ingredients: [
            { name: 'ブリ切り身', amount: '4', unit: '切れ', category: '魚介' },
            { name: 'エリンギ', amount: '1', unit: 'パック', category: '野菜' },
            { name: 'しめじ', amount: '1/2', unit: 'パック', category: '野菜' },
            { name: 'バター', amount: '15', unit: 'g', category: '調味料' },
            { name: '醤油', amount: '大さじ2', unit: '', category: '調味料' },
            { name: 'みりん', amount: '大さじ1', unit: '', category: '調味料' },
            { name: '小麦粉', amount: '大さじ2', unit: '', category: '調味料' },
        ],
        steps: [
            'ブリは3等分に切り、軽く塩を振って5分置き、水気を拭き取って小麦粉をまぶす',
            '【並行】エリンギは短冊切り、しめじはほぐしておく',
            'フライパンにサラダ油(大さじ1)を熱し、ブリを両面焼いて一度取り出す',
            'きのこ類を炒め、しんなりしたらブリを戻す',
            'バター、醤油、みりんを加えて手早く絡める',
        ],
        prepTime: 10, cookTime: 10, tips: 'ブリは小麦粉をまぶすことで、パサつかずタレがよく絡みます。'
    },

    // ===== 洋食・主菜 =====
    {
        id: 'yuri-main-06', name: 'ひとくちごぼうハンバーグ', genre: '洋食', category: '主菜', protein: '豚',
        servings: 4,
        ingredients: [
            { name: '合いびき肉', amount: '400', unit: 'g', category: '肉' },
            { name: 'ごぼう', amount: '1/2', unit: '本', category: '野菜' },
            { name: '玉ねぎ', amount: '1/2', unit: '個', category: '野菜' },
            { name: 'パン粉', amount: '大さじ4', unit: '', category: 'その他' },
            { name: '牛乳', amount: '大さじ2', unit: '', category: 'その他' },
            { name: '卵', amount: '1', unit: '個', category: '豆腐・卵' },
            { name: 'ケチャップ', amount: '大さじ4', unit: '', category: '調味料' },
            { name: 'ウスターソース', amount: '大さじ2', unit: '', category: '調味料' },
            { name: 'みりん', amount: '大さじ1', unit: '', category: '調味料' },
        ],
        steps: [
            'ごぼうはささがきにして水にさらし、水気を切る。玉ねぎはみじん切りにしてレンジで2分加熱して冷ます',
            'ボウルにひき肉、ごぼう、玉ねぎ、パン粉、牛乳、卵、塩こしょう(少々)を入れてよく練る',
            '一口大に丸め、油を引いたフライパンで両面こんがり焼く',
            'ケチャップ、ウスターソース、みりんを合わせたソースを加え、絡めながら少し煮詰める',
        ],
        prepTime: 15, cookTime: 12, tips: 'ごぼうの食感がアクセントになり、満足感がアップします。ソースにみりんを入れるとご飯に合う味に。'
    },
    {
        id: 'yuri-main-07', name: '鮭とさつまいものチーズ焼き', genre: '洋食', category: '主菜', protein: '魚',
        servings: 4,
        ingredients: [
            { name: '生鮭切り身', amount: '4', unit: '切れ', category: '魚介' },
            { name: 'さつまいも', amount: '1', unit: '本', category: '野菜' },
            { name: 'ブロッコリー', amount: '1/2', unit: '株', category: '野菜' },
            { name: 'ピザ用チーズ', amount: '80', unit: 'g', category: 'その他' },
            { name: 'マヨネーズ', amount: '大さじ2', unit: '', category: '調味料' },
            { name: '塩こしょう', amount: '少々', unit: '', category: '調味料' },
        ],
        steps: [
            'さつまいもは1cm厚の半月切りにして水にさらし、レンジ600Wで4分加熱。ブロッコリーは小房に分けレンジで2分加熱',
            '鮭は一口大に切り、塩こしょうをして小麦粉を薄くまぶす',
            'フライパンで鮭を焼き、火が通ったら耐熱皿に鮭、さつまいも、ブロッコリーを並べる',
            'マヨネーズを線がけし、チーズをのせてトースターで5分ほど焼き目がつくまで焼く',
        ],
        prepTime: 12, cookTime: 15, tips: 'さつまいもの甘さとチーズの塩気が相性抜群。魚が苦手なお子様にもおすすめ。'
    },
    {
        id: 'yuri-main-08', name: 'ごろごろ野菜のトマト煮', genre: '洋食', category: '主菜', protein: '鶏',
        servings: 4,
        ingredients: [
            { name: '鶏もも肉', amount: '2', unit: '枚(500g)', category: '肉' },
            { name: 'なす', amount: '2', unit: '本', category: '野菜' },
            { name: '玉ねぎ', amount: '1', unit: '個', category: '野菜' },
            { name: 'トマト缶', amount: '1', unit: '缶(400g)', category: '乾物・加工品' },
            { name: 'コンソメ', amount: '2', unit: '個', category: '調味料' },
            { name: 'ケチャップ', amount: '大さじ1', unit: '', category: '調味料' },
            { name: 'にんにく', amount: '1', unit: '片', category: '野菜' },
            { name: 'オリーブオイル', amount: '大さじ1', unit: '', category: '調味料' },
        ],
        steps: [
            '鶏肉は大きめの一口大に切る。なすは乱切り、玉ねぎはくし切り、にんにくはみじん切りにする',
            '鍋にオリーブオイルとにんにくを熱し、香りが立ったら鶏肉を焼く',
            '玉ねぎとなすを加えてさらに炒める',
            'トマト缶、水100ml、コンソメ、ケチャップを加え、蓋をして15分煮込む',
        ],
        prepTime: 10, cookTime: 20, tips: '隠し味のケチャップでトマトの酸味がまろやかになり、食べやすくなります。'
    },

    // ===== 中華・韓国・主菜 =====
    {
        id: 'yuri-main-09', name: '麻婆厚揚げ', genre: '中華', category: '主菜', protein: '豆腐',
        servings: 4,
        ingredients: [
            { name: '厚揚げ', amount: '2', unit: '枚', category: '豆腐・卵' },
            { name: '豚ひき肉', amount: '200', unit: 'g', category: '肉' },
            { name: '長ねぎ', amount: '1/2', unit: '本', category: '野菜' },
            { name: '豆板醤', amount: '小さじ1', unit: '', category: '調味料' },
            { name: '甜麺醤', amount: '大さじ1', unit: '', category: '調味料' },
            { name: '鶏がらスープ', amount: '200', unit: 'ml', category: '調味料' },
            { name: '片栗粉', amount: '大さじ1', unit: '', category: '調味料' },
            { name: 'ごま油', amount: '大さじ1', unit: '', category: '調味料' },
        ],
        steps: [
            '厚揚げは熱湯をかけて油抜きし、一口大に切る。長ねぎはみじん切りにする',
            'フライパンにごま油を熱し、ひき肉を炒める。色が変わったら長ねぎ、豆板醤、甜麺醤を加えて炒める',
            '鶏がらスープ(水200ml＋鶏がらスープの素小さじ2)と厚揚げを加え、3分煮る',
            '一旦火を止め、水溶き片栗粉を回し入れてから再度加熱してとろみをつける',
        ],
        prepTime: 10, cookTime: 10, tips: '豆腐の代わりに厚揚げを使うと水切り不要でボリュームアップし、崩れにくくて時短になります！'
    },
    {
        id: 'yuri-main-10', name: '鶏肉と厚揚げのヤンニョム風', genre: '韓国', category: '主菜', protein: '鶏',
        servings: 4,
        ingredients: [
            { name: '鶏もも肉', amount: '1', unit: '枚(250g)', category: '肉' },
            { name: '厚揚げ', amount: '1', unit: '枚', category: '豆腐・卵' },
            { name: '片栗粉', amount: '大さじ2', unit: '', category: '調味料' },
            { name: 'ケチャップ', amount: '大さじ2', unit: '', category: '調味料' },
            { name: 'コチュジャン', amount: '大さじ1', unit: '', category: '調味料' },
            { name: '醤油', amount: '大さじ1', unit: '', category: '調味料' },
            { name: '砂糖', amount: '大さじ1', unit: '', category: '調味料' },
            { name: '白ごま', amount: '大さじ1', unit: '', category: '調味料' },
        ],
        steps: [
            '調味料（ケチャップ、コチュジャン、醤油、砂糖）を合わせておく',
            '【並行】鶏肉と厚揚げは一口大に切り、ポリ袋に入れて片栗粉をまぶす',
            'フライパンに多めの油を熱し、鶏肉と厚揚げをカリッとするまで揚げ焼きにする',
            '余分な油を拭き取り、合わせたタレを加えてサッと絡める。最後に白ごまを振る',
        ],
        prepTime: 10, cookTime: 12, tips: '少なめのお肉でも厚揚げでカサ増し。甘辛いタレでご飯がすすむ最強の節約おかずです。'
    },
    {
        id: 'yuri-main-11', name: '豚肉と豆苗のコチュジャン炒め', genre: '韓国', category: '主菜', protein: '豚',
        servings: 4,
        ingredients: [
            { name: '豚こま切れ肉', amount: '300', unit: 'g', category: '肉' },
            { name: '豆苗', amount: '1', unit: '袋', category: '野菜' },
            { name: '玉ねぎ', amount: '1/2', unit: '個', category: '野菜' },
            { name: 'コチュジャン', amount: '大さじ1', unit: '', category: '調味料' },
            { name: '醤油', amount: '大さじ1', unit: '', category: '調味料' },
            { name: '酒', amount: '大さじ1', unit: '', category: '調味料' },
            { name: 'ごま油', amount: '大さじ1', unit: '', category: '調味料' },
        ],
        steps: [
            '豆苗は根元を切り落として半分の長さに切る。玉ねぎは薄切りにする',
            '豚肉に塩こしょう(少々)と片栗粉(小さじ1)をまぶしておく',
            'フライパンにごま油を熱し、豚肉と玉ねぎを炒める',
            '肉に火が通ったら豆苗を加え、合わせた調味料(コチュジャン、醤油、酒)を一気に加えて強火でサッと炒め合わせる',
        ],
        prepTime: 8, cookTime: 7, tips: '豆苗は火を通しすぎないのがシャキシャキ感を残すコツです。'
    },

    // ===== 副菜 =====
    {
        id: 'yuri-side-01', name: 'もやし入り豚ひき肉と春雨の甘辛炒め', genre: '中華', category: '副菜', protein: '',
        servings: 4,
        ingredients: [
            { name: 'もやし', amount: '1', unit: '袋', category: '野菜' },
            { name: '緑豆春雨', amount: '40', unit: 'g', category: '乾物・加工品' },
            { name: '豚ひき肉', amount: '100', unit: 'g', category: '肉' },
            { name: '醤油', amount: '大さじ2', unit: '', category: '調味料' },
            { name: '砂糖', amount: '大さじ1', unit: '', category: '調味料' },
            { name: 'みりん', amount: '大さじ1', unit: '', category: '調味料' },
            { name: 'ごま油', amount: '大さじ1', unit: '', category: '調味料' },
        ],
        steps: [
            '春雨は熱湯で戻し、食べやすい長さに切っておく',
            'フライパンにごま油を熱し、豚ひき肉を炒める',
            '肉の色が変わったらもやしと春雨を加えてサッと炒める',
            '醤油、砂糖、みりんを加え、汁気が飛ぶまで炒め合わせる',
        ],
        prepTime: 5, cookTime: 8, tips: '主菜並みの満足感がある節約副菜。お弁当のおかずにも最適です。'
    },
    {
        id: 'yuri-side-02', name: 'レンジで簡単♪マッシュポテトグラタン', genre: '洋食', category: '副菜', protein: '',
        servings: 4,
        ingredients: [
            { name: 'じゃがいも', amount: '3', unit: '個', category: '野菜' },
            { name: '牛乳', amount: '大さじ3', unit: '', category: 'その他' },
            { name: 'バター', amount: '10', unit: 'g', category: '調味料' },
            { name: '塩こしょう', amount: '少々', unit: '', category: '調味料' },
            { name: 'ピザ用チーズ', amount: '適量', unit: '', category: 'その他' },
        ],
        steps: [
            'じゃがいもは皮をむいて一口大に切り、耐熱ボウルに入れてふんわりラップをし、600Wで6分加熱する',
            '熱いうちにマッシャー等で潰し、バター、牛乳、塩こしょうを混ぜ合わせる',
            'グラタン皿に敷き詰め、上にピザ用チーズをのせる',
            'トースターでチーズに焼き色がつくまで4〜5分焼く',
        ],
        prepTime: 8, cookTime: 5, tips: 'マヨネーズを少し足すとコクが出ます。洋食の献立にぴったりの一品。'
    },
    {
        id: 'yuri-side-03', name: 'ピーマンとちくわのきんぴら', genre: '和食', category: '副菜', protein: '',
        servings: 4,
        ingredients: [
            { name: 'ピーマン', amount: '4', unit: '個', category: '野菜' },
            { name: 'ちくわ', amount: '3', unit: '本', category: '乾物・加工品' },
            { name: 'ごま油', amount: '小さじ2', unit: '', category: '調味料' },
            { name: '醤油', amount: '大さじ1', unit: '', category: '調味料' },
            { name: 'みりん', amount: '大さじ1', unit: '', category: '調味料' },
            { name: '白ごま', amount: '大さじ1', unit: '', category: '調味料' },
        ],
        steps: [
            'ピーマンとちくわは全て細切りにする',
            'フライパンにごま油を熱し、ピーマンとちくわを中火で炒める',
            'ピーマンがしんなりしたら、醤油とみりんを加えて炒め絡める',
            '火を止め、白ごまを振って完成',
        ],
        prepTime: 5, cookTime: 5, tips: 'ちくわの旨味でピーマンの苦味が和らぎます。お弁当の隙間埋めにも。'
    },
    {
        id: 'yuri-side-04', name: 'ジャーマンポテト', genre: '洋食', category: '副菜', protein: '',
        servings: 4,
        ingredients: [
            { name: 'じゃがいも', amount: '3', unit: '個', category: '野菜' },
            { name: 'ウインナー', amount: '4', unit: '本', category: '肉' },
            { name: '玉ねぎ', amount: '1/2', unit: '個', category: '野菜' },
            { name: 'オリーブオイル', amount: '大さじ1', unit: '', category: '調味料' },
            { name: 'コンソメ', amount: '小さじ1', unit: '', category: '調味料' },
            { name: '塩こしょう', amount: '少々', unit: '', category: '調味料' },
            { name: '粒マスタード', amount: '小さじ1', unit: '', category: '調味料' },
        ],
        steps: [
            'じゃがいもは一口大に切り、レンジ600Wで5分加熱しておく',
            '【並行】玉ねぎは薄切り、ウインナーは斜め切りにする',
            'フライパンにオリーブオイルを熱し、玉ねぎとウインナーを炒める',
            '加熱したじゃがいもを加え、コンソメ、塩こしょう、粒マスタードで味を調える',
        ],
        prepTime: 8, cookTime: 5, tips: 'レンジ加熱を使うことで、ホクホクのジャーマンポテトがあっという間に！'
    },
    {
        id: 'yuri-side-05', name: '長芋の梅肉和え', genre: '和食', category: '副菜', protein: '',
        servings: 4,
        ingredients: [
            { name: '長芋', amount: '200', unit: 'g', category: '野菜' },
            { name: '梅干し', amount: '2', unit: '個', category: '乾物・加工品' },
            { name: '醤油', amount: '小さじ1', unit: '', category: '調味料' },
            { name: 'かつお節', amount: '1', unit: 'パック', category: '乾物・加工品' },
            { name: '大葉', amount: '3', unit: '枚', category: '野菜' },
        ],
        steps: [
            '長芋は皮をむき、ポリ袋に入れてめん棒などで粗く叩き割る',
            '梅干しは種を取って包丁で叩き、ペースト状にする',
            'ボウルで叩いた長芋、梅肉、醤油、かつお節を和える',
            '器に盛り、千切りの大葉をトッピングする',
        ],
        prepTime: 5, cookTime: 0, tips: '長芋は叩くことで味がよく絡み、シャキシャキの美味しい食感になります。'
    },
    {
        id: 'yuri-side-06', name: '豚こまキムチーズ', genre: '韓国', category: '副菜', protein: '豚',
        servings: 4,
        ingredients: [
            { name: '豚こま切れ肉', amount: '150', unit: 'g', category: '肉' },
            { name: 'キムチ', amount: '100', unit: 'g', category: '野菜' },
            { name: 'ピザ用チーズ', amount: '50', unit: 'g', category: 'その他' },
            { name: 'ごま油', amount: '大さじ1', unit: '', category: '調味料' },
            { name: '醤油', amount: '小さじ1', unit: '', category: '調味料' },
        ],
        steps: [
            'フライパンにごま油を熱し、豚こま肉を炒める',
            '肉の色が変わったらキムチを加えてサッと炒め、醤油を回し入れる',
            '全体が混ざったらチーズをのせ、蓋をして1〜2分チーズが溶けるまで待つ',
        ],
        prepTime: 3, cookTime: 5, tips: 'あと一品！という時に爆速でできる、ご飯もお酒もすすむおかず。'
    },
    {
        id: 'yuri-side-07', name: 'やみつき無限キャベツ', genre: '和食', category: '副菜', protein: '',
        servings: 4,
        tags: ['時短・力尽き', 'アッサリ'],
        ingredients: [
            { name: 'キャベツ', amount: '1/4', unit: '玉', category: '野菜' },
            { name: 'ツナ缶', amount: '1', unit: '缶', category: '乾物・加工品' },
            { name: '鶏がらスープの素', amount: '小さじ1', unit: '', category: '調味料' },
            { name: 'ごま油', amount: '大さじ1', unit: '', category: '調味料' },
            { name: '塩こんぶ', amount: 'ひとつまみ', unit: '', category: '調味料' }
        ],
        steps: [
            'キャベツは千切りにする',
            '耐熱ボウルにキャベツを入れ、ふんわりラップをしてレンジ600Wで3分加熱',
            '水気をしっかり絞り、油を切ったツナとすべての調味料を和える'
        ],
        prepTime: 2, cookTime: 3, tips: 'キャベツの大量消費にぴったり！水気をしっかり絞るのがポイントです。'
    },
    {
        id: 'yuri-side-08', name: 'ほうれん草とベーコンのバターソテー', genre: '洋食', category: '副菜', protein: '豚',
        servings: 4,
        tags: ['時短・力尽き', 'ガッツリ'],
        ingredients: [
            { name: 'ほうれん草', amount: '1', unit: '束', category: '野菜' },
            { name: 'ハーフベーコン', amount: '4', unit: '枚', category: '肉' },
            { name: 'バター', amount: '10', unit: 'g', category: '調味料' },
            { name: '醤油', amount: '小さじ1', unit: '', category: '調味料' }
        ],
        steps: [
            'ほうれん草は3cm幅に切り、ベーコンは1cm幅に切る',
            'フライパンにバターを熱し、ベーコンを炒める',
            'ほうれん草を加えてサッと炒め、醤油を回し入れて香りを立たせる'
        ],
        prepTime: 3, cookTime: 5, tips: 'ほうれん草は炒めすぎず、シャキッと仕上げると美味。'
    },
    {
        id: 'yuri-side-09', name: 'たたききゅうりの塩昆布和え', genre: '和食', category: '副菜', protein: '',
        servings: 4,
        tags: ['時短・力尽き', 'アッサリ'],
        ingredients: [
            { name: 'きゅうり', amount: '2', unit: '本', category: '野菜' },
            { name: '塩昆布', amount: '大さじ1', unit: '', category: '乾物・加工品' },
            { name: 'ごま油', amount: '大さじ1', unit: '', category: '調味料' },
            { name: '白ごま', amount: '適量', unit: '', category: '調味料' }
        ],
        steps: [
            'きゅうりは麺棒で軽くたたき、手で一口大に割る（味が染みやすくなります）',
            'ボウルにきゅうり、塩昆布、ごま油を入れてよく和える',
            '器に盛り、白ごまを振る'
        ],
        prepTime: 3, cookTime: 0, tips: '包丁を使わずに作れる、居酒屋風の王道おつまみ副菜。'
    },
    {
        id: 'yuri-side-10', name: 'トマトとモッツァレラのカプレーゼ風', genre: '洋食', category: '副菜', protein: '',
        servings: 4,
        tags: ['アッサリ'],
        ingredients: [
            { name: 'トマト', amount: '2', unit: '個', category: '野菜' },
            { name: 'モッツァレラチーズ', amount: '1', unit: '個', category: 'その他' },
            { name: 'オリーブオイル', amount: '大さじ2', unit: '', category: '調味料' },
            { name: '塩こしょう', amount: '少々', unit: '', category: '調味料' }
        ],
        steps: [
            'トマトとモッツァレラチーズを一口大に切る',
            '器に盛り付け、オリーブオイルと塩こしょうをかける'
        ],
        prepTime: 3, cookTime: 0, tips: '切って並べるだけ。おもてなしにも使える万能副菜です。'
    },
    {
        id: 'yuri-yt-side-01', name: 'もやしのごま和え', genre: '和食', category: '副菜', protein: '',
        servings: 2,
        mealType: ['Dinner', 'Lunch', 'Breakfast'],
        tags: ['時短・力尽き', 'アッサリ'],
        sourceUrl: 'https://momrecipe.net/recipe/001504/',
        ingredients: [
            { name: 'もやし', amount: '1', unit: '袋(200g)', category: '野菜' },
            { name: '醤油', amount: '大さじ1', unit: '', category: '調味料' },
            { name: '砂糖', amount: '小さじ1', unit: '', category: '調味料' },
            { name: '白すりごま', amount: '大さじ2', unit: '', category: '調味料' },
            { name: 'ごま油', amount: '少々', unit: '', category: '調味料' }
        ],
        steps: [
            'もやしは耐熱容器に入れ、ふんわりラップをしてレンジ(600W)で2〜3分加熱する。',
            '水気をしっかり絞り、調味料（醤油、砂糖、すりごま、ごま油）で和える。'
        ],
        prepTime: 2, cookTime: 3, tips: 'レンジでチンするだけの超時短副菜。水気はしっかり絞るのがコツです。'
    },
    {
        id: 'yuri-yt-side-02', name: 'レンジで簡単♪豆苗のお浸し', genre: '和食', category: '副菜', protein: '',
        servings: 2,
        mealType: ['Dinner', 'Lunch', 'Breakfast'],
        tags: ['時短・力尽き', 'アッサリ'],
        sourceUrl: 'https://momrecipe.net/recipe/001171/',
        ingredients: [
            { name: '豆苗', amount: '1', unit: '袋(100g)', category: '野菜' },
            { name: 'めんつゆ(2倍濃縮)', amount: '大さじ1', unit: '', category: '調味料' },
            { name: '水', amount: '大さじ1', unit: '', category: 'その他' },
            { name: '削り節', amount: '適量', unit: '', category: '乾物・加工品' }
        ],
        steps: [
            '豆苗は根元を落として長さを半分に切り、耐熱容器に入れる。',
            'ふんわりラップをしてレンジ(600W)で1分〜1分半加熱する。',
            '水気を絞り、めんつゆ、水で和え、仕上げに削り節を乗せる。'
        ],
        prepTime: 2, cookTime: 2, tips: '豆苗は火が通りやすいのでレンジ加熱のしすぎに注意。'
    },
    {
        id: 'yuri-yt-side-03', name: 'きゅうりとわかめの中華サラダ', genre: '中華', category: '副菜', protein: '',
        servings: 2,
        mealType: ['Dinner', 'Lunch'],
        tags: ['アッサリ'],
        sourceUrl: 'https://momrecipe.net/recipe/001563/',
        ingredients: [
            { name: 'きゅうり', amount: '1', unit: '本', category: '野菜' },
            { name: '乾燥わかめ', amount: '2', unit: 'g', category: '乾物・加工品' },
            { name: 'ごま油・酢', amount: '各大さじ1', unit: '', category: '調味料' },
            { name: 'しょうゆ・白ごま・鶏がらスープの素', amount: '各小さじ1', unit: '', category: '調味料' }
        ],
        steps: [
            'きゅうりは輪切りまたは細切りにする。乾燥わかめは水で戻して水気を切る。',
            'ボウルに調味料をすべて合わせて混ぜる。',
            'きゅうり、わかめを加えて全体をよく和える。'
        ],
        prepTime: 5, cookTime: 0, tips: 'さっぱりしていて、箸休めにぴったりの一品です。'
    },
    {
        id: 'yuri-yt-side-04', name: 'きゅうりのやみつきピリ辛ポン酢', genre: '和食', category: '副菜', protein: '',
        servings: 2,
        mealType: ['Dinner', 'Lunch'],
        tags: ['アッサリ', '時短・力尽き'],
        sourceUrl: 'https://momrecipe.net/recipe/001678/',
        ingredients: [
            { name: 'きゅうり', amount: '1', unit: '本', category: '野菜' },
            { name: 'ポン酢', amount: '大さじ2', unit: '', category: '調味料' },
            { name: '砂糖', amount: '小さじ1', unit: '', category: '調味料' },
            { name: '削り節', amount: '1/2〜1', unit: 'P', category: '乾物・加工品' },
            { name: '鷹の爪(輪切り)', amount: '1/2', unit: '本分', category: '調味料' }
        ],
        steps: [
            'きゅうりは麺棒などでポロポロになるように軽く叩き、食べやすい大きさに割る。',
            'ボウルにきゅうり、ポン酢、砂糖、削り節、鷹の爪をすべて入れ、よく和える。'
        ],
        prepTime: 3, cookTime: 0, tips: '叩くことできゅうりに味が馴染みやすくなります。ピリ辛でお酒も進む味！'
    },
    {
        id: 'yuri-yt-soup-01', name: 'なめことわかめの味噌汁', genre: '和食', category: '汁物', protein: '',
        servings: 2,
        mealType: ['Dinner', 'Breakfast'],
        tags: ['時短・力尽き', 'アッサリ'],
        sourceUrl: 'https://momrecipe.net/recipe/001604/',
        ingredients: [
            { name: 'なめこ', amount: '1', unit: '袋', category: '野菜' },
            { name: '乾燥わかめ', amount: '3', unit: 'g', category: '乾物・加工品' },
            { name: '水', amount: '600', unit: 'ml', category: 'その他' },
            { name: 'パックだし', amount: '1', unit: '袋', category: '調味料' },
            { name: '味噌', amount: '大さじ2', unit: '', category: '調味料' }
        ],
        steps: [
            '鍋に水とパックだしを入れて火にかけ、だしをとる。',
            'なめこをザルで軽く洗い、鍋に加える。',
            '火を止めて味噌を溶き入れ、乾燥わかめを加える。'
        ],
        prepTime: 1, cookTime: 5, tips: 'なめこのとろみとだしの香りがホッとするお味噌汁です。'
    },
    {
        id: 'yuri-yt-soup-02', name: '玉ねぎとわかめの中華スープ', genre: '中華', category: '汁物', protein: '',
        servings: 2,
        mealType: ['Dinner', 'Lunch'],
        tags: ['アッサリ', '時短・力尽き'],
        sourceUrl: 'https://momrecipe.net/recipe/001543/',
        ingredients: [
            { name: '玉ねぎ', amount: '1/4', unit: '個(50g)', category: '野菜' },
            { name: '乾燥わかめ', amount: '2〜3', unit: 'g', category: '乾物・加工品' },
            { name: '水', amount: '400', unit: 'ml', category: 'その他' },
            { name: '鶏ガラスープの素', amount: '小さじ2', unit: '', category: '調味料' },
            { name: 'しょうゆ', amount: '小さじ1', unit: '', category: '調味料' },
            { name: 'ごま油', amount: '少々', unit: '', category: '調味料' },
            { name: '白いりごま', amount: '小さじ1', unit: '', category: '調味料' }
        ],
        steps: [
            '玉ねぎは薄切りにする。',
            '鍋に水と鶏ガラスープの素、しょうゆ、玉ねぎを入れて火にかける。',
            '玉ねぎが柔らかくなったらわかめを加え、ひと煮立ちさせる。',
            '火を止め、ごま油と白いりごまを加える。'
        ],
        prepTime: 2, cookTime: 5, tips: 'ごま油の香りが食欲をそそる、あっさりした中華スープです。'
    },
    {
        id: 'yuri-yt-soup-03', name: '玉ねぎとわかめの味噌汁', genre: '和食', category: '汁物', protein: '',
        servings: 2,
        mealType: ['Dinner', 'Breakfast'],
        tags: ['アッサリ', '時短・力尽き'],
        sourceUrl: 'https://momrecipe.net/recipe/001392/',
        ingredients: [
            { name: '水', amount: '600', unit: 'ml', category: 'その他' },
            { name: 'パックだし', amount: '1', unit: '袋', category: '調味料' },
            { name: '玉ねぎ', amount: '1/2', unit: '個(100g)', category: '野菜' },
            { name: '乾燥わかめ', amount: '2〜3', unit: 'g', category: '乾物・加工品' },
            { name: '味噌', amount: '大さじ2〜3', unit: '', category: '調味料' }
        ],
        steps: [
            '玉ねぎはくし切りまたは薄切りにする。',
            '鍋に水、パックだし、玉ねぎを入れて火にかけ、だしをとりながら玉ねぎに火を通す。',
            '玉ねぎが柔らかくなったら火を止め、味噌を溶き入れてわかめを加える。'
        ],
        prepTime: 2, cookTime: 5, tips: '玉ねぎの甘みが優しい、定番のお味噌汁です。'
    },
    {
        id: 'yuri-soup-01', name: '豆腐とえのきの味噌汁', genre: '和食', category: '汁物', protein: '',
        servings: 4,
        ingredients: [
            { name: '絹ごし豆腐', amount: '1/2', unit: '丁', category: '豆腐・卵' },
            { name: 'えのき', amount: '1/2', unit: '袋', category: '野菜' },
            { name: 'だし汁', amount: '600', unit: 'ml', category: '調味料' },
            { name: '味噌', amount: '大さじ2.5', unit: '', category: '調味料' },
            { name: '小ねぎ', amount: '適量', unit: '', category: '野菜' },
        ],
        steps: [
            'えのきは根元を切り落とし半分に切る。豆腐はさいの目に切る',
            '鍋にだし汁を沸かし、えのきと豆腐を入れてひと煮立ちさせる',
            '火を止めて味噌を溶き入れ、小ねぎを散らす',
        ],
        prepTime: 3, cookTime: 5, tips: 'えのきから良い出汁が出るので、ホッとする味わいになります。'
    },
    {
        id: 'yuri-soup-02', name: 'ふんわり卵とトマトの中華スープ', genre: '中華', category: '汁物', protein: '',
        servings: 4,
        ingredients: [
            { name: 'トマト', amount: '1', unit: '個', category: '野菜' },
            { name: '卵', amount: '1', unit: '個', category: '豆腐・卵' },
            { name: '水', amount: '600', unit: 'ml', category: 'その他' },
            { name: '鶏がらスープの素', amount: '小さじ2', unit: '', category: '調味料' },
            { name: 'ごま油', amount: '小さじ1', unit: '', category: '調味料' },
            { name: '塩こしょう', amount: '少々', unit: '', category: '調味料' },
        ],
        steps: [
            'トマトはくし切りにし、さらに長さを半分に切る',
            '鍋に水と鶏がらスープの素を入れて沸かし、トマトを加える',
            '軽く煮立ったら、溶き卵を細く回し入れる',
            '卵がふんわり浮いてきたら火を止め、ごま油と塩こしょうで味を調える',
        ],
        prepTime: 3, cookTime: 5, tips: 'トマトの酸っぱさが食欲をそそる、中華の定番スピードスープ。'
    },
    {
        id: 'yuri-soup-03', name: '玉ねぎとワカメの味噌汁', genre: '和食', category: '汁物', protein: '',
        servings: 4,
        ingredients: [
            { name: '玉ねぎ', amount: '1/2', unit: '個', category: '野菜' },
            { name: 'わかめ(乾燥)', amount: '大さじ1', unit: '', category: '乾物・加工品' },
            { name: 'だし汁', amount: '600', unit: 'ml', category: '調味料' },
            { name: '味噌', amount: '大さじ2.5', unit: '', category: '調味料' },
        ],
        steps: [
            '玉ねぎはくし切りにする',
            '鍋にだし汁と玉ねぎを入れて火にかけ、玉ねぎが柔らかくなるまで煮る',
            '乾燥わかめを加え、火を止めて味噌を溶き入れる',
        ],
        prepTime: 2, cookTime: 7, tips: '玉ねぎは最初から水から煮ると甘みが増します。'
    },
    {
        id: 'yuri-soup-04', name: 'キャベツとベーコンのコンソメスープ', genre: '洋食', category: '汁物', protein: '',
        servings: 4,
        ingredients: [
            { name: 'キャベツ', amount: '2', unit: '枚', category: '野菜' },
            { name: 'ハーフベーコン', amount: '2', unit: '枚', category: '肉' },
            { name: '水', amount: '600', unit: 'ml', category: 'その他' },
            { name: 'コンソメ', amount: '小さじ2', unit: '', category: '調味料' },
            { name: '塩こしょう', amount: '少々', unit: '', category: '調味料' },
        ],
        steps: [
            'キャベツはざく切り、ベーコンは1cm幅に切る',
            '鍋に水、コンソメ、キャベツ、ベーコンを入れて火にかける',
            'キャベツがしんなりするまで5〜6分煮て、塩こしょうで味を調える',
        ],
        prepTime: 2, cookTime: 7, tips: '冷蔵庫の余り野菜なんでもOKなお助けスープです。'
    },
    {
        id: 'yuri-soup-05', name: 'ふんわり卵の中華スープ', genre: '中華', category: '汁物', protein: '卵',
        servings: 4,
        tags: ['時短・力尽き', 'アッサリ'],
        ingredients: [
            { name: '卵', amount: '2', unit: '個', category: '豆腐・卵' },
            { name: '長ねぎ', amount: '10', unit: 'cm', category: '野菜' },
            { name: '水', amount: '600', unit: 'ml', category: 'その他' },
            { name: '鶏がらスープの素', amount: '大さじ1', unit: '', category: '調味料' },
            { name: 'ごま油', amount: '小さじ1', unit: '', category: '調味料' }
        ],
        steps: [
            '長ねぎは小口切りにする',
            '鍋に水と鶏がらスープの素を入れて沸かす',
            '沸騰したら溶き卵を回し入れ、ふわっと浮いてきたら火を止める',
            '長ねぎとごま油を加えて香りを立たせる'
        ],
        prepTime: 2, cookTime: 5, tips: '卵を入れるときはスープがしっかり沸騰してから！ふわふわになります。'
    },
    {
        id: 'yuri-soup-06', name: 'ゴロゴロ野菜のミネストローネ', genre: '洋食', category: '汁物', protein: '豚',
        servings: 4,
        tags: ['アッサリ'],
        ingredients: [
            { name: '玉ねぎ', amount: '1/2', unit: '個', category: '野菜' },
            { name: 'にんじん', amount: '1/2', unit: '本', category: '野菜' },
            { name: 'じゃがいも', amount: '1', unit: '個', category: '野菜' },
            { name: 'ハーフベーコン', amount: '2', unit: '枚', category: '肉' },
            { name: 'カットトマト缶', amount: '1/2', unit: '缶', category: '乾物・加工品' },
            { name: 'コンソメ', amount: '大さじ1', unit: '', category: '調味料' },
            { name: '水', amount: '400', unit: 'ml', category: 'その他' }
        ],
        steps: [
            '野菜とベーコンは全て1cm角に切る',
            '鍋に油を熱し、ベーコンと野菜を炒める',
            '全体に油が回ったら、トマト缶、水、コンソメを加える',
            '野菜が柔らかくなるまで中火で15分ほど煮込む'
        ],
        prepTime: 5, cookTime: 20, tips: '野菜の甘みがたっぷり溶け込んだ、栄養満点の食べるスープです。多めに作って翌日の朝食にも。'
    },
    // ===== 新規追加: 朝食 =====
    {
        id: 'yuri-bf-01', name: '目玉焼きとチーズトースト', genre: '洋食', category: '主菜', protein: '卵',
        servings: 1,
        mealType: ['Breakfast'],
        tags: ['時短・力尽き'],
        ingredients: [
            { name: '食パン', amount: '1', unit: '枚', category: '乾物・加工品' },
            { name: '卵', amount: '1', unit: '個', category: '豆腐・卵' },
            { name: 'スライスチーズ', amount: '1', unit: '枚', category: 'その他' },
            { name: '塩こしょう', amount: '少々', unit: '', category: '調味料' },
        ],
        steps: [
            '食パンにチーズをのせてトースターで3分焼く',
            'フライパンに油をひき、目玉焼きを作る',
            '焼き上がったトーストに目玉焼きをのせ、塩こしょうを振る',
        ],
        prepTime: 2, cookTime: 3, tips: '忙しい朝の定番！洗い物も少なくて助かります。'
    },
    {
        id: 'yuri-bf-02', name: 'ふかふかおにぎりと簡単味噌汁', genre: '和食', category: '主菜', protein: '魚',
        servings: 1,
        mealType: ['Breakfast'],
        tags: ['アッサリ'],
        ingredients: [
            { name: 'ご飯', amount: '150', unit: 'g', category: 'その他' },
            { name: '鮭フレーク', amount: '大さじ1', unit: '', category: '乾物・加工品' },
            { name: '海苔', amount: '1', unit: '枚', category: '乾物・加工品' },
            { name: 'インスタント味噌汁', amount: '1', unit: '袋', category: 'その他' }
        ],
        steps: [
            'ご飯に鮭フレークを混ぜてふんわりとおにぎりを握る',
            '海苔を巻く',
            'お湯を沸かしてインスタント味噌汁を作る'
        ],
        prepTime: 3, cookTime: 2, tips: '朝は無理せずインスタントで汁物を補給！'
    },
    // ===== 新規追加: 昼食 =====
    {
        id: 'yuri-lunch-01', name: 'パラパラ黄金チャーハン', genre: '中華', category: '主菜', protein: '卵',
        servings: 1,
        mealType: ['Lunch'],
        tags: ['時短・力尽き', 'ガッツリ'],
        ingredients: [
            { name: 'ご飯', amount: '200', unit: 'g', category: 'その他' },
            { name: '卵', amount: '1', unit: '個', category: '豆腐・卵' },
            { name: 'ネギ', amount: '5', unit: 'cm', category: '野菜' },
            { name: '鶏がらスープの素', amount: '小さじ1', unit: '', category: '調味料' },
            { name: '醤油', amount: '小さじ1', unit: '', category: '調味料' }
        ],
        steps: [
            'ネギはみじん切りにする。卵はボウルで溶いておく',
            '温かいご飯に卵を半分混ぜ合わせておく（パラパラの秘訣！）',
            'フライパンに油を熟し、残りの卵を炒めてからご飯を入れて強火で炒める',
            'ネギ、鶏がらスープの素を加え、最後に鍋肌から醤油を入れて香りを立てる'
        ],
        prepTime: 5, cookTime: 5, tips: 'ご飯に先に卵をコーティングしておくと失敗知らず！'
    },
    {
        id: 'yuri-lunch-02', name: 'ツナと塩昆布の和風パスタ', genre: '和食', category: '主菜', protein: '魚',
        servings: 1,
        mealType: ['Lunch', 'Dinner'],
        tags: ['時短・力尽き', 'アッサリ'],
        ingredients: [
            { name: 'パスタ', amount: '100', unit: 'g', category: '乾物・加工品' },
            { name: 'ツナ缶', amount: '1/2', unit: '缶', category: '乾物・加工品' },
            { name: '塩昆布', amount: 'ふたつまみ', unit: '', category: '乾物・加工品' },
            { name: 'ごま油', amount: '大さじ1', unit: '', category: '調味料' }
        ],
        steps: [
            'パスタを規定の時間通りに茹でる（レンジ調理器でもOK）',
            'ボウルに油を切ったツナ、塩昆布、ごま油を入れておく',
            '湯切りしたパスタをボウルに入れてよく和える'
        ],
        prepTime: 2, cookTime: 10, tips: '包丁も火も使わない（レンジの場合）最強のズボラ飯！'
    },
    // ===== 新規追加: 夕食 (時短丼) =====
    {
        id: 'yuri-dinner-quick-01', name: '豚こまと玉ねぎのスタミナ丼', genre: '和食', category: '主菜', protein: '豚',
        servings: 2,
        mealType: ['Lunch', 'Dinner'],
        tags: ['時短・力尽き', 'ガッツリ'],
        ingredients: [
            { name: '豚こま切れ肉', amount: '200', unit: 'g', category: '肉' },
            { name: '玉ねぎ', amount: '1/2', unit: '個', category: '野菜' },
            { name: 'ご飯', amount: '2', unit: '杯', category: 'その他' },
            { name: '焼肉のタレ', amount: '大さじ3', unit: '', category: '調味料' }
        ],
        steps: [
            '玉ねぎは薄切りにする',
            'フライパンに油を熱し、豚肉と玉ねぎを炒める',
            '火が通ったら焼肉のタレを絡める',
            'ご飯の上にたっぷりのせる'
        ],
        prepTime: 5, cookTime: 10, tips: '味付けは焼肉のタレにお任せで絶対失敗しません！'
    }
];

export const recipes: Recipe[] = _recipes.map(r => ({
    ...r,
    mealType: r.mealType || ['Dinner'],
    tags: r.tags || (r.prepTime + r.cookTime <= 15 ? ['時短・力尽き'] : [])
}));
