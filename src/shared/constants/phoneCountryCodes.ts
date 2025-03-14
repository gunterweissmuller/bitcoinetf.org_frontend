const countries = [
  ['Афганистан', 'af', '93'],
  ['Албания', 'al', '355'],
  ['Алжир', 'dz', '213'],
  ['Американское', 'as', '1684'],
  ['Андорра', 'ad', '376'],
  ['Ангола', 'ao', '244'],
  ['Ангилья', 'ai', '1264'],
  ['Антигуа и Барбуда', 'ag', '1268'],
  ['Аргентина', 'ar', '54'],
  ['Армения', 'am', '374'],
  ['Аруба', 'aw', '297'],
  ['Австралия', 'au', '61', 0],
  ['Австрия', 'at', '43'],
  ['Азербайджан', 'az', '994'],
  ['Багамские острова', 'bs', '1242'],
  ['Бахрейн', 'bh', '973'],
  ['Бангладеш', 'bd', '880'],
  ['Барбадос', 'bb', '1246'],
  ['Беларусь', 'by', '375'],
  ['Бельгия', 'be', '32'],
  ['Белиз', 'bz', '501'],
  ['Бенин', 'bj', '229'],
  ['Бермудский', 'bm', '1441'],
  ['Бутан', 'bt', '975'],
  ['Боливия', 'bo', '591'],
  ['Босния и Герцеговина', 'ba', '387'],
  ['Ботсвана', 'bw', '267'],
  ['Бразилия', 'br', '55'],
  ['Британская Территория в Индийском Океане', 'io', '246'],
  ['Британские Виргинские Острова', 'vg', '1284'],
  ['Бруней', 'bn', '673'],
  ['Болгария', 'bg', '359'],
  ['Буркина Фасо', 'bf', '226'],
  ['Бурунди', 'bi', '257'],
  ['Камбоджа', 'kh', '855'],
  ['Камерун', 'cm', '237'],
  [
    'Канада',
    'ca',
    '1',
    1,
    [
      '204',
      '226',
      '236',
      '249',
      '250',
      '289',
      '306',
      '343',
      '365',
      '387',
      '403',
      '416',
      '418',
      '431',
      '437',
      '438',
      '450',
      '506',
      '514',
      '519',
      '548',
      '579',
      '581',
      '587',
      '604',
      '613',
      '639',
      '647',
      '672',
      '705',
      '709',
      '742',
      '778',
      '780',
      '782',
      '807',
      '819',
      '825',
      '867',
      '873',
      '902',
      '905',
    ],
  ],
  ['Кабо-Верде', 'cv', '238'],
  ['Карибские Нидерланды', 'bq', '599', 1],
  ['Каймановы острова', 'ky', '1345'],
  ['Центральноафриканская Республика', 'cf', '236'],
  ['Чад', 'td', '235'],
  ['Чили', 'cl', '56'],
  ['Китай', 'cn', '86'],
  ['остров Рождества', 'cx', '61', 2],
  ['Кокосовые Острова', 'cc', '61', 1],
  ['Колумбия', 'co', '57'],
  ['Коморские острова', 'km', '269'],
  ['Конго', 'cd', '243'],
  ['Республика Конго', 'cg', '242'],
  ['Острова Кука', 'ck', '682'],
  ['Коста Рика', 'cr', '506'],
  ["Кот-д'Ивуар", 'ci', '225'],
  ['Хорватия', 'hr', '385'],
  ['Куба', 'cu', '53'],
  ['Курасао', 'cw', '599', 0],
  ['Кипр', 'cy', '357'],
  ['Чешская Республика', 'cz', '420'],
  ['Дания', 'dk', '45'],
  ['Джибути', 'dj', '253'],
  ['Доминика', 'dm', '1767'],
  ['Доминиканская Республика', 'do', '1', 2, ['809', '829', '849']],
  ['Эквадор', 'ec', '593'],
  ['Египет', 'eg', '20'],
  ['Сальвадор', 'sv', '503'],
  ['Экваториальная Гвинея', 'gq', '240'],
  ['Эритрея', 'er', '291'],
  ['Эстония', 'ee', '372'],
  ['Эфиопия', 'et', '251'],
  ['Фолклендские острова', 'fk', '500'],
  ['Фарерские острова', 'fo', '298'],
  ['Фиджи', 'fj', '679'],
  ['Финляндия', 'fi', '358', 0],
  ['Франция', 'fr', '33'],
  ['Французская Гвиана', 'gf', '594'],
  ['Французская Полинезия', 'pf', '689'],
  ['Габон', 'ga', '241'],
  ['Гамбия', 'gm', '220'],
  ['Грузия', 'ge', '995'],
  ['Германия', 'de', '49'],
  ['Гана', 'gh', '233'],
  ['Гибралтар', 'gi', '350'],
  ['Греция', 'gr', '30'],
  ['Гренландия', 'gl', '299'],
  ['Гренада', 'gd', '1473'],
  ['Гваделупа', 'gp', '590', 0],
  ['Гуам', 'gu', '1671'],
  ['Гватемала', 'gt', '502'],
  ['Гернси', 'gg', '44', 1],
  ['Гвинея', 'gn', '224'],
  ['Гвинея Бисау', 'gw', '245'],
  ['Гайана', 'gy', '592'],
  ['Гаити', 'ht', '509'],
  ['Гондурас', 'hn', '504'],
  ['Гонконг', 'hk', '852'],
  ['Венгрия', 'hu', '36'],
  ['Исландия', 'is', '354'],
  ['Индия', 'in', '91'],
  ['Индонезия', 'id', '62'],
  ['Иран', 'ir', '98'],
  ['Ирак', 'iq', '964'],
  ['Ирландия', 'ie', '353'],
  ['Остров Мэн', 'im', '44', 2],
  ['Израиль', 'il', '972'],
  ['Италия', 'it', '39', 0],
  ['Ямайка', 'jm', '1876'],
  ['Япония', 'jp', '81'],
  ['Джерси', 'je', '44', 3],
  ['Иордания', 'jo', '962'],
  ['Казахстан', 'kz', '7', 1],
  ['Кения', 'ke', '254'],
  ['Кирибати', 'ki', '686'],
  ['Косово', 'xk', '383'],
  ['Кувейт', 'kw', '965'],
  ['Кыргызстан', 'kg', '996'],
  ['Лаос', 'la', '856'],
  ['Латвия', 'lv', '371'],
  ['Ливан', 'lb', '961'],
  ['Лесото', 'ls', '266'],
  ['Либерия', 'lr', '231'],
  ['Ливия', 'ly', '218'],
  ['Лихтенштейн', 'li', '423'],
  ['Литва', 'lt', '370'],
  ['Люксембург', 'lu', '352'],
  ['Макао', 'mo', '853'],
  ['Македония', 'mk', '389'],
  ['Мадагаскар', 'mg', '261'],
  ['Малави', 'mw', '265'],
  ['Малайзия', 'my', '60'],
  ['Мальдивы', 'mv', '960'],
  ['Мали', 'ml', '223'],
  ['Мальта', 'mt', '356'],
  ['Маршалловы острова', 'mh', '692'],
  ['Мартиника', 'mq', '596'],
  ['Мавритания', 'mr', '222'],
  ['Маврикий', 'mu', '230'],
  ['Майотта', 'yt', '262', 1],
  ['Мексика', 'mx', '52'],
  ['Микронезия', 'fm', '691'],
  ['Молдова', 'md', '373'],
  ['Монако', 'mc', '377'],
  ['Монголия', 'mn', '976'],
  ['Черногория', 'me', '382'],
  ['Монтсеррат', 'ms', '1664'],
  ['Марокко', 'ma', '212', 0],
  ['Мозамбик', 'mz', '258'],
  ['Мьянма', 'mm', '95'],
  ['Намибия', 'na', '264'],
  ['Науру', 'nr', '674'],
  ['Непал', 'np', '977'],
  ['Нидерланды', 'nl', '31'],
  ['Новая Каледония', 'nc', '687'],
  ['Новая Зеландия', 'nz', '64'],
  ['Никарагуа', 'ni', '505'],
  ['Нигер', 'ne', '227'],
  ['Нигерия', 'ng', '234'],
  ['Ниуэ', 'nu', '683'],
  ['Остров Норфолк', 'nf', '672'],
  ['Северная Корея', 'kp', '850'],
  ['Северные Марианские острова', 'mp', '1670'],
  ['Норвегия', 'no', '47', 0],
  ['Оман', 'om', '968'],
  ['Пакистан', 'pk', '92'],
  ['Палау', 'pw', '680'],
  ['Палестина', 'ps', '970'],
  ['Панама', 'pa', '507'],
  ['Папуа Новая Гвинея', 'pg', '675'],
  ['Парагвай', 'py', '595'],
  ['Перу', 'pe', '51'],
  ['Филиппины', 'ph', '63'],
  ['Польша', 'pl', '48'],
  ['Португалия', 'pt', '351'],
  ['Пуэрто Рико', 'pr', '1', 3, ['787', '939']],
  ['Катар', 'qa', '974'],
  ['Реюньон', 're', '262', 0],
  ['Румыния', 'ro', '40'],
  ['Россия', 'ru', '7', 0],
  ['Руанда', 'rw', '250'],
  ['Сен-Бартелеми', 'bl', '590', 1],
  ['Остров Святой Елены', 'sh', '290'],
  ['Сент-Китс и Невис', 'kn', '1869'],
  ['Сент-Люсия', 'lc', '1758'],
  ['Сен-Мартен', 'mf', '590', 2],
  ['Сен-Пьер и Микелон', 'pm', '508'],
  ['Сент-Винсент и Гренадины', 'vc', '1784'],
  ['Самоа', 'ws', '685'],
  ['Сан Марино', 'sm', '378'],
  ['Сан-Томе и Принсипи', 'st', '239'],
  ['Саудовская Аравия', 'sa', '966'],
  ['Сенегал', 'sn', '221'],
  ['Сербия', 'rs', '381'],
  ['Сейшельские острова', 'sc', '248'],
  ['Сьерра Леоне', 'sl', '232'],
  ['Сингапур', 'sg', '65'],
  ['Синт-Мартен', 'sx', '1721'],
  ['Словакия', 'sk', '421'],
  ['Словения', 'si', '386'],
  ['Соломоновы острова', 'sb', '677'],
  ['Сомали', 'so', '252'],
  ['Южная Африка', 'za', '27'],
  ['Южная Корея', 'kr', '82'],
  ['Южный Судан', 'ss', '211'],
  ['Испания', 'es', '34'],
  ['Шри-Ланка', 'lk', '94'],
  ['Судан', 'sd', '249'],
  ['Суринам', 'sr', '597'],
  ['Шпицберген и Ян Майен', 'sj', '47', 1],
  ['Свазиленд', 'sz', '268'],
  ['Швеция', 'se', '46'],
  ['Швейцария', 'ch', '41'],
  ['Сирия', 'sy', '963'],
  ['Тайвань', 'tw', '886'],
  ['Таджикистан', 'tj', '992'],
  ['Танзания', 'tz', '255'],
  ['Таиланд', 'th', '66'],
  ['Восточный Тимор', 'tl', '670'],
  ['Того', 'tg', '228'],
  ['Токелау', 'tk', '690'],
  ['Тонга', 'to', '676'],
  ['Тринидад и Тобаго', 'tt', '1868'],
  ['Тунис', 'tn', '216'],
  ['Турция', 'tr', '90'],
  ['Туркменистан', 'tm', '993'],
  ['Острова Теркс и Кайкос', 'tc', '1649'],
  ['Тувалу', 'tv', '688'],
  ['Виргинские острова США', 'vi', '1340'],
  ['Уганда', 'ug', '256'],
  ['Украина', 'ua', '380'],
  ['Объединенные Арабские Эмираты', 'ae', '971'],
  ['Великобритания', 'gb', '44', 0],
  ['Соединенные Штаты', 'us', '1', 0],
  ['Уругвай', 'uy', '598'],
  ['Узбекистан', 'uz', '998'],
  ['Вануату', 'vu', '678'],
  ['Ватикан', 'va', '39', 1],
  ['Венесуэла', 've', '58'],
  ['Вьетнам', 'vn', '84'],
  ['Уоллис и Футуна', 'wf', '681'],
  ['Западная Сахара', 'eh', '212', 1],
  ['Йемен', 'ye', '967'],
  ['Замбия', 'zm', '260'],
  ['Зимбабве', 'zw', '263'],
  ['Аландские острова', 'ax', '358', 1],
]

const countriesObj = countries
  .map((country: any) => ({
    name: country[0],
    iso: country[1].toUpperCase(),
    code: `+${country[2]}`,
    priority: country[3] || 0,
  }))
  .sort((a, b) => {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()
    if (nameA < nameB) {
      return -1
    }
    if (nameA > nameB) {
      return 1
    }
    return 0
  })

export default countriesObj

export function findCountryByParams(params: object) {
  return useNuxtApp().$app.filters.find(countriesObj, { ...params })
}
