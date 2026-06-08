// Real Palestinian cities, articles, figures & historical events with stable Wikimedia image URLs.

export type CityRegion = "west_bank" | "gaza" | "48_territories" | "jerusalem";
export type CityStatus = "existing" | "destroyed" | "partially_destroyed" | "occupied";

/** Editorial publish state shared by all content types. */
export type PublishStatus = "published" | "draft" | "archived";

/** Key-value pair from the site_settings table. */
export interface SiteSetting {
  key: string;
  valueAr: string;
  valueEn: string;
}

/** Typed map of all site settings keys returned by useSettings(). */
export type SiteSettingsMap = Record<string, { ar: string; en: string }>;

export interface City {
  id: string;
  name: string;
  nameEn?: string;
  region: CityRegion;
  status: CityStatus;
  /** Editorial status — defaults to "published" for legacy static data. */
  publishStatus?: PublishStatus;
  foundedYear?: string;
  foundedYearEn?: string;
  populationBefore1948?: string;
  shortDesc: string;
  shortDescEn?: string;
  description: string;
  descriptionEn?: string;
  geography: string;
  geographyEn?: string;
  history: string;
  historyEn?: string;
  natives: string;
  nativesEn?: string;
  highlights: string[];
  highlightsEn?: string[];
  naming: string;
  namingEn?: string;
  zionistName: string;
  zionistNameEn?: string;
  brief: string;
  briefEn?: string;
  image: string;
  gallery?: string[];
  date: string;
  dateEn?: string;
}

export interface Article {
  id: string;
  title: string;
  titleEn?: string;
  publishStatus?: PublishStatus;
  excerpt: string;
  excerptEn?: string;
  date: string;
  dateEn?: string;
  image: string;
  category: "dreams" | "alaqsa" | "investigation" | "report";
  author?: string;
  authorEn?: string;
  readingTime?: number;
  body: { heading?: string; paragraph: string }[];
  bodyEn?: { heading?: string; paragraph: string }[];
}

export type FigureField =
  | "politics"
  | "literature"
  | "arts"
  | "science"
  | "resistance"
  | "religion"
  | "sports";

export interface Figure {
  id: string;
  name: string;
  nameEn?: string;
  publishStatus?: PublishStatus;
  birthYear?: number;
  deathYear?: number;
  birthCity?: string;
  field: FigureField;
  bio: string;
  bioEn?: string;
  portrait: string;
}

export type EventType = "nakba" | "war" | "uprising" | "milestone";

export interface HistoryEvent {
  id: string;
  title: string;
  titleEn?: string;
  publishStatus?: PublishStatus;
  eventDate: string;
  eventDateEn?: string;
  isoDate: string;
  eventType: EventType;
  description: string;
  descriptionEn?: string;
  image: string;
  relatedCity?: string;
  sources?: string[];
  sourcesEn?: string[];
}

export const REGION_LABEL: Record<CityRegion, string> = {
  west_bank: "الضفة الغربية",
  gaza: "قطاع غزة",
  "48_territories": "أراضي الـ48",
  jerusalem: "القدس",
};
export const REGION_LABEL_EN: Record<CityRegion, string> = {
  west_bank: "West Bank",
  gaza: "Gaza Strip",
  "48_territories": "1948 Territories",
  jerusalem: "Jerusalem",
};

export const STATUS_LABEL: Record<CityStatus, string> = {
  existing: "قائمة",
  destroyed: "مدمّرة",
  partially_destroyed: "مدمّرة جزئياً",
  occupied: "محتلّة",
};
export const STATUS_LABEL_EN: Record<CityStatus, string> = {
  existing: "Standing",
  destroyed: "Destroyed",
  partially_destroyed: "Partially destroyed",
  occupied: "Occupied",
};

export const FIELD_LABEL: Record<FigureField, string> = {
  politics: "سياسة",
  literature: "أدب وشعر",
  arts: "فنون",
  science: "علوم",
  resistance: "مقاومة",
  religion: "دين",
  sports: "رياضة",
};
export const FIELD_LABEL_EN: Record<FigureField, string> = {
  politics: "Politics",
  literature: "Literature & poetry",
  arts: "Arts",
  science: "Science",
  resistance: "Resistance",
  religion: "Religion",
  sports: "Sports",
};

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  nakba: "نكبة وتهجير",
  war: "حرب وعدوان",
  uprising: "انتفاضة",
  milestone: "محطة تاريخية",
};
export const EVENT_TYPE_LABEL_EN: Record<EventType, string> = {
  nakba: "Nakba & displacement",
  war: "War & aggression",
  uprising: "Uprising",
  milestone: "Historical milestone",
};

const DATE_AR = "2 يونيو 2026";
const DATE_EN = "June 2, 2026";

export const CITIES: City[] = [
  {
    id: "al-quds",
    name: "مدينة القدس",
    nameEn: "Jerusalem",
    region: "jerusalem",
    status: "occupied",
    foundedYear: "الألف الثالث ق.م",
    foundedYearEn: "3rd millennium BCE",
    populationBefore1948: "165,000",
    shortDesc: "مدينة القدس هي واحدة من أقدم وأقدس المدن في العالم.",
    shortDescEn: "Jerusalem is one of the oldest and holiest cities in the world.",
    description:
      "القدس هي إحدى أقدم مدن العالم وأكثرها أهميةً تاريخيًا ودينيًا. تقع في قلب فلسطين. تُعد مركزًا حضاريًا وثقافيًا ودينيًا فريدًا. تحتضن العديد من المعالم التاريخية المقدسة للمسلمين والمسيحيين واليهود.",
    descriptionEn:
      "Jerusalem is one of the oldest and most historically and religiously significant cities in the world. Located in the heart of Palestine, it is a unique civilizational, cultural, and religious center, home to many holy sites sacred to Muslims, Christians, and Jews.",
    geography:
      "تقع مدينة القدس في الجزء الأوسط من فلسطين التاريخية، على سلسلة من الهضاب الجبلية بين البحر الأبيض المتوسط والبحر الميت. ترتفع عن سطح البحر بحوالي 750 مترًا.",
    geographyEn:
      "Jerusalem lies in the central part of historic Palestine, on a chain of mountainous plateaus between the Mediterranean Sea and the Dead Sea, at an elevation of about 750 meters above sea level.",
    history:
      "تُعد القدس من أقدم المدن المأهولة في العالم، إذ يعود تاريخها إلى أكثر من خمسة آلاف عام. شهدت المدينة تعاقب العديد من الحضارات، منها الكنعانية واليبوسية والآشورية والبابلية والفارسية واليونانية والرومانية والإسلامية والعثمانية.",
    historyEn:
      "Jerusalem is among the oldest continuously inhabited cities in the world, with a history spanning more than five thousand years. It witnessed the succession of Canaanite, Jebusite, Assyrian, Babylonian, Persian, Greek, Roman, Islamic, and Ottoman civilizations.",
    natives:
      "يُعتبر اليبوسيون، وهم إحدى القبائل الكنعانية العربية القديمة، السكان الأصليين لمدينة القدس. وقد أسسوا المدينة في الألف الثالث قبل الميلاد وأطلقوا عليها اسم \"يبوس\".",
    nativesEn:
      "The Jebusites, one of the ancient Arab Canaanite tribes, are considered the indigenous inhabitants of Jerusalem. They founded the city in the third millennium BCE and named it \"Jebus\".",
    highlights: [
      "تضم المسجد الأقصى المبارك وقبة الصخرة المشرفة.",
      "تحتوي على كنيسة القيامة، أحد أهم المواقع المقدسة لدى المسيحيين.",
      "تُعد مركزًا تاريخيًا وثقافيًا يضم العديد من المتاحف والمعالم الأثرية.",
      "تتميز بطراز معماري فريد يجمع بين الحضارات المختلفة.",
      "تُعتبر من أهم الوجهات الدينية والسياحية في العالم.",
    ],
    highlightsEn: [
      "Home to the blessed Al-Aqsa Mosque and the Dome of the Rock.",
      "Contains the Church of the Holy Sepulchre, one of the holiest Christian sites.",
      "A historic and cultural center with many museums and archaeological landmarks.",
      "Features unique architecture blending many civilizations.",
      "Considered one of the world's foremost religious and tourist destinations.",
    ],
    naming:
      "يرجع اسم القدس إلى كلمة \"القداسة\" أو \"المدينة المقدسة\"، وذلك لما تتمتع به من مكانة دينية عظيمة لدى أتباع الديانات السماوية.",
    namingEn:
      "The name Al-Quds derives from \"holiness\" or \"the holy city\", reflecting its sacred status to followers of the Abrahamic faiths.",
    zionistName:
      "تُطلق السلطات الإسرائيلية والمصادر العبرية على المدينة اسم \"يروشليم / ‎ירושלים\".",
    zionistNameEn:
      "Israeli authorities and Hebrew sources call the city \"Yerushalayim / ‎ירושלים\".",
    brief: "القدس هي العاصمة التاريخية لفلسطين وأحد أقدس مدن العالم.",
    briefEn:
      "Jerusalem is the historic capital of Palestine and one of the holiest cities in the world.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Dome_of_the_Rock_Temple_Mount.jpg/1280px-Dome_of_the_Rock_Temple_Mount.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Dome_of_the_Rock_Temple_Mount.jpg/640px-Dome_of_the_Rock_Temple_Mount.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Church_of_the_Holy_Sepulchre_2010.jpg/640px-Church_of_the_Holy_Sepulchre_2010.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Jerusalem_Western_Wall_BW_3.JPG/640px-Jerusalem_Western_Wall_BW_3.JPG",
    ],
    date: DATE_AR,
    dateEn: DATE_EN,
  },
  {
    id: "al-khalil",
    name: "مدينة الخليل",
    nameEn: "Hebron",
    region: "west_bank",
    status: "partially_destroyed",
    foundedYear: "3500 ق.م",
    foundedYearEn: "3500 BCE",
    populationBefore1948: "24,000",
    shortDesc: "هي أكبر مدن الضفة الغربية من حيث المساحة وعدد السكان.",
    shortDescEn: "The largest city in the West Bank by area and population.",
    description:
      "الخليل من أقدم المدن الفلسطينية المأهولة، تشتهر بأسواقها التراثية وحرفها اليدوية كصناعة الزجاج والخزف، وتحتضن الحرم الإبراهيمي الشريف.",
    descriptionEn:
      "Hebron is one of the oldest inhabited Palestinian cities, known for its heritage markets and handicrafts such as glassmaking and ceramics, and home to the Ibrahimi Mosque.",
    geography:
      "تقع الخليل في الجزء الجنوبي من الضفة الغربية، على ارتفاع نحو 930 مترًا فوق سطح البحر، مما يجعلها من أعلى المدن الفلسطينية ارتفاعًا.",
    geographyEn:
      "Hebron lies in the southern West Bank at an elevation of about 930 meters above sea level, making it one of the highest Palestinian cities.",
    history:
      "يعود تاريخ الخليل لأكثر من 5500 عام. سُكنت من قِبَل الكنعانيين، وارتبط اسمها بسيدنا إبراهيم الخليل عليه السلام.",
    historyEn:
      "Hebron's history spans more than 5,500 years. It was inhabited by the Canaanites, and its name is associated with the Prophet Abraham.",
    natives:
      "السكان الأصليون من الكنعانيين، ولا يزال الفلسطينيون يشكّلون النسيج السكاني الرئيسي للمدينة.",
    nativesEn:
      "The original inhabitants were Canaanites, and Palestinians remain the main population of the city.",
    highlights: [
      "الحرم الإبراهيمي الشريف.",
      "البلدة القديمة وأسواقها التراثية.",
      "صناعة الزجاج الخليلي والخزف.",
      "كروم العنب والتين المشهورة.",
    ],
    highlightsEn: [
      "The Ibrahimi Mosque.",
      "The Old City and its heritage markets.",
      "Hebron glassmaking and ceramics.",
      "Famous grape and fig orchards.",
    ],
    naming: "سُمّيت بالخليل نسبةً إلى نبي الله إبراهيم الخليل عليه السلام.",
    namingEn: "Named Al-Khalil after the Prophet Abraham, \"Khalil Allah\" (Friend of God).",
    zionistName: "تُسمّى في المصادر العبرية باسم \"حيفرون / ‎חברון\".",
    zionistNameEn: "Called \"Hevron / ‎חברון\" in Hebrew sources.",
    brief: "الخليل مدينة الحرم الإبراهيمي والتراث الفلسطيني الأصيل.",
    briefEn: "Hebron: the city of the Ibrahimi Mosque and authentic Palestinian heritage.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Hebron_old_city_2009.jpg/1280px-Hebron_old_city_2009.jpg",
    date: DATE_AR,
    dateEn: DATE_EN,
  },
  {
    id: "ghazza",
    name: "مدينة غزة",
    nameEn: "Gaza",
    region: "gaza",
    status: "partially_destroyed",
    foundedYear: "3000 ق.م",
    foundedYearEn: "3000 BCE",
    populationBefore1948: "80,000",
    shortDesc: "مدينة فلسطينية ساحلية عريقة تُعد من أقدم مدن العالم.",
    shortDescEn: "An ancient Palestinian coastal city, among the oldest in the world.",
    description:
      "غزة مدينة فلسطينية ساحلية تقع على البحر الأبيض المتوسط، تُعدّ من أقدم المدن المأهولة في العالم، ومركزًا تجاريًا وثقافيًا للشعب الفلسطيني.",
    descriptionEn:
      "Gaza is a Palestinian coastal city on the Mediterranean, one of the oldest inhabited cities in the world, and a commercial and cultural center for the Palestinian people.",
    geography:
      "تقع على الساحل الجنوبي الغربي لفلسطين، تطل على البحر الأبيض المتوسط، وتمتد على شريط ساحلي بطول 41 كيلومترًا.",
    geographyEn:
      "Located on Palestine's southwestern coast, Gaza overlooks the Mediterranean and stretches along a 41-kilometer coastline.",
    history:
      "تاريخها يمتد لأكثر من 4000 سنة. مرّت بها حضارات الكنعانيين والفلستينيين والمصريين والرومان والعرب المسلمين والعثمانيين.",
    historyEn:
      "Its history spans more than 4,000 years, with successive Canaanite, Philistine, Egyptian, Roman, Arab Muslim, and Ottoman civilizations.",
    natives:
      "السكان الأصليون من الكنعانيين والفلستينيين القدماء، ويُشكّل الفلسطينيون اليوم سكانها الكاملين.",
    nativesEn:
      "The original inhabitants were ancient Canaanites and Philistines; today the population is entirely Palestinian.",
    highlights: [
      "ميناء غزة التاريخي.",
      "الجامع العمري الكبير.",
      "كنيسة القديس برفيريوس من أقدم الكنائس في العالم.",
      "البلدة القديمة وأسواقها التراثية.",
    ],
    highlightsEn: [
      "The historic Port of Gaza.",
      "The Great Omari Mosque.",
      "The Church of Saint Porphyrius, one of the world's oldest churches.",
      "The Old City and its heritage markets.",
    ],
    naming: "اسمها مشتق من الكلمة الكنعانية \"هزاتي\" بمعنى القوية، وعُرفت تاريخيًا بـ\"غزة هاشم\".",
    namingEn:
      "Its name derives from the Canaanite \"Hazzati\" meaning \"the strong one\"; historically known as \"Gaza of Hashim\".",
    zionistName: "تُسمّى في المصادر العبرية \"عزة / ‎עזה\".",
    zionistNameEn: "Called \"Azza / ‎עזה\" in Hebrew sources.",
    brief: "غزة هاشم، مدينة الصمود الفلسطيني، وعاصمة الإرادة على ساحل المتوسط.",
    briefEn:
      "Gaza of Hashim: city of Palestinian steadfastness, the capital of willpower on the Mediterranean coast.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Gaza_beach.jpg/1280px-Gaza_beach.jpg",
    date: DATE_AR,
    dateEn: DATE_EN,
  },
  {
    id: "nablus",
    name: "مدينة نابلس",
    nameEn: "Nablus",
    region: "west_bank",
    status: "existing",
    foundedYear: "72م",
    foundedYearEn: "72 CE",
    populationBefore1948: "23,250",
    shortDesc: "إحدى أقدم المدن الفلسطينية، تقع بين جبلي عيبال وجرزيم.",
    shortDescEn: "One of the oldest Palestinian cities, set between Mounts Ebal and Gerizim.",
    description:
      "نابلس من أعرق المدن الفلسطينية، تجمع بين التاريخ والطبيعة، وتشتهر بصناعة الصابون والكنافة النابلسية الشهيرة عالميًا.",
    descriptionEn:
      "Nablus is one of Palestine's most distinguished cities, combining history and nature, and famous for its soap industry and world-renowned knafeh.",
    geography:
      "تقع في شمال الضفة الغربية بين جبلي عيبال وجرزيم، وترتفع نحو 550 مترًا عن سطح البحر.",
    geographyEn:
      "Located in the northern West Bank between Mounts Ebal and Gerizim, at about 550 meters above sea level.",
    history:
      "أسّسها الرومان عام 72م باسم \"نيابوليس\" أي المدينة الجديدة، وقبلها كانت تُعرف بمدينة شكيم الكنعانية.",
    historyEn:
      "Founded by the Romans in 72 CE as \"Neapolis\" (new city); previously known as the Canaanite city of Shechem.",
    natives: "سكانها من العرب الفلسطينيين وامتداد للكنعانيين القدماء.",
    nativesEn:
      "Its population consists of Arab Palestinians, descendants of the ancient Canaanites.",
    highlights: [
      "البلدة القديمة وحاراتها التاريخية.",
      "صناعة الصابون النابلسي التراثي.",
      "الكنافة النابلسية.",
      "بئر يعقوب التاريخي.",
    ],
    highlightsEn: [
      "The Old City and its historic quarters.",
      "Traditional Nabulsi soap industry.",
      "Nabulsi knafeh dessert.",
      "The historic Jacob's Well.",
    ],
    naming: "من الاسم الروماني \"نيابوليس\" أي المدينة الجديدة.",
    namingEn: "From the Roman name \"Neapolis\", meaning \"the new city\".",
    zionistName: "تُسمّى عبريًا \"شخيم / ‎שכם\".",
    zionistNameEn: "Called \"Shechem / ‎שכם\" in Hebrew.",
    brief: "نابلس عاصمة جبل النار، مدينة الصابون والكنافة والصمود.",
    briefEn: "Nablus, the capital of the Mountain of Fire — the city of soap, knafeh, and steadfastness.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Nablus_City2.jpg/1280px-Nablus_City2.jpg",
    date: DATE_AR,
    dateEn: DATE_EN,
  },
  {
    id: "haifa",
    name: "مدينة حيفا",
    nameEn: "Haifa",
    region: "48_territories",
    status: "occupied",
    foundedYear: "القرن الثالث ق.م",
    foundedYearEn: "3rd century BCE",
    populationBefore1948: "75,000",
    shortDesc: "مدينة فلسطينية ساحلية تقع على جبل الكرمل المطل على البحر.",
    shortDescEn: "A Palestinian coastal city on Mount Carmel overlooking the sea.",
    description:
      "حيفا من أجمل المدن الفلسطينية الساحلية، تجمع بين الجبل والبحر، وتشتهر بميناءها الذي يُعد من أهم موانئ شرق المتوسط.",
    descriptionEn:
      "Haifa is one of the most beautiful Palestinian coastal cities, combining mountain and sea, and known for its port — one of the most important in the eastern Mediterranean.",
    geography:
      "تقع على ساحل البحر الأبيض المتوسط شمال فلسطين، عند سفح جبل الكرمل.",
    geographyEn: "Located on the Mediterranean coast of northern Palestine, at the foot of Mount Carmel.",
    history:
      "مدينة كنعانية قديمة، ازدهرت في العصور المختلفة وتعرّضت للتهجير عام 1948.",
    historyEn:
      "An ancient Canaanite city that flourished through the ages and was depopulated in 1948.",
    natives: "كان أغلب سكانها من الفلسطينيين قبل النكبة عام 1948.",
    nativesEn: "Most of its inhabitants were Palestinians before the 1948 Nakba.",
    highlights: ["جبل الكرمل.", "ميناء حيفا.", "المدينة القديمة.", "الحدائق البهائية."],
    highlightsEn: ["Mount Carmel.", "Port of Haifa.", "The Old City.", "The Bahá'í Gardens."],
    naming: "من جذر سامي يعني \"الشاطئ الجميل\" أو \"المرفأ\".",
    namingEn: "From a Semitic root meaning \"the beautiful shore\" or \"harbor\".",
    zionistName: "تحتفظ بنفس الاسم \"حيفا / ‎חיפה\".",
    zionistNameEn: "Retains the same name \"Haifa / ‎חיפה\".",
    brief: "حيفا عروس الكرمل، مدينة البحر والجبل الفلسطيني المهجّر.",
    briefEn: "Haifa, the bride of Carmel — the depopulated Palestinian city of sea and mountain.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Haifa_view_BW_2010-09-08_03.JPG/1280px-Haifa_view_BW_2010-09-08_03.JPG",
    date: DATE_AR,
    dateEn: DATE_EN,
  },
  {
    id: "yaffa",
    name: "مدينة يافا",
    nameEn: "Jaffa",
    region: "48_territories",
    status: "occupied",
    foundedYear: "1800 ق.م",
    foundedYearEn: "1800 BCE",
    populationBefore1948: "100,000",
    shortDesc: "مدينة فلسطينية عريقة على ساحل البحر المتوسط، اشتهرت ببرتقالها.",
    shortDescEn: "An ancient Palestinian Mediterranean coastal city famous for its oranges.",
    description:
      "يافا عروس البحر، من أقدم الموانئ في العالم، وعُرفت ببرتقالها الشهير عالميًا قبل النكبة.",
    descriptionEn:
      "Jaffa, the bride of the sea — among the oldest ports in the world, world-famous for its oranges before the Nakba.",
    geography: "تقع على الساحل الفلسطيني المتوسطي جنوب تل أبيب.",
    geographyEn: "Located on the Palestinian Mediterranean coast south of Tel Aviv.",
    history: "أُسّست قبل أكثر من 4000 عام، وكانت ميناءً تجاريًا عالميًا.",
    historyEn: "Founded over 4,000 years ago and was a global commercial port.",
    natives: "كان سكانها فلسطينيين، هُجّر معظمهم عام 1948.",
    nativesEn: "Its inhabitants were Palestinians, most of whom were displaced in 1948.",
    highlights: ["ميناء يافا.", "البلدة القديمة.", "برج الساعة.", "برتقال يافا الشهير."],
    highlightsEn: ["Port of Jaffa.", "The Old City.", "The Clock Tower.", "The famous Jaffa oranges."],
    naming: "من الاسم الكنعاني \"يافي\" أي الجميل.",
    namingEn: "From the Canaanite name \"Yafi\" meaning \"the beautiful\".",
    zionistName: "تُسمّى عبريًا \"يافو / ‎יפו\".",
    zionistNameEn: "Called \"Yafo / ‎יפו\" in Hebrew.",
    brief: "يافا عروس البحر وميناء فلسطين التاريخي.",
    briefEn: "Jaffa, the bride of the sea and Palestine's historic port.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Jaffa_old_town.jpg/1280px-Jaffa_old_town.jpg",
    date: DATE_AR,
    dateEn: DATE_EN,
  },
  {
    id: "salfit",
    name: "مدينة سلفيت",
    nameEn: "Salfit",
    region: "west_bank",
    status: "existing",
    foundedYear: "القرن السابع",
    foundedYearEn: "7th century",
    shortDesc: "مدينة فلسطينية تقع في شمال الضفة الغربية، تشتهر بطبيعتها.",
    shortDescEn: "A Palestinian city in the northern West Bank, known for its natural beauty.",
    description: "سلفيت مدينة جبلية فلسطينية في وسط الضفة الغربية، تشتهر بزراعة الزيتون.",
    descriptionEn:
      "Salfit is a Palestinian mountain city in the central West Bank, famous for olive cultivation.",
    geography: "تقع في وسط الضفة الغربية بين نابلس ورام الله.",
    geographyEn: "Located in the central West Bank between Nablus and Ramallah.",
    history: "مدينة قديمة سكنها الكنعانيون والرومان.",
    historyEn: "An ancient city inhabited by Canaanites and Romans.",
    natives: "سكانها من الفلسطينيين.",
    nativesEn: "Its inhabitants are Palestinians.",
    highlights: ["كرومة الزيتون.", "وادي قانا الطبيعي.", "البلدة القديمة."],
    highlightsEn: ["Olive groves.", "The natural Wadi Qana.", "The Old City."],
    naming: "اسم يعود لجذور كنعانية بمعنى السلة أو الجبل.",
    namingEn: "A name of Canaanite roots meaning \"basket\" or \"mountain\".",
    zionistName: "تستخدم نفس الاسم في المصادر العبرية.",
    zionistNameEn: "The same name is used in Hebrew sources.",
    brief: "سلفيت مدينة الزيتون والطبيعة الجبلية الفلسطينية.",
    briefEn: "Salfit, the Palestinian city of olives and mountain nature.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Salfit2.jpg/1280px-Salfit2.jpg",
    date: DATE_AR,
    dateEn: DATE_EN,
  },
  {
    id: "ramallah",
    name: "مدينة رام الله",
    nameEn: "Ramallah",
    region: "west_bank",
    status: "existing",
    foundedYear: "القرن السادس عشر",
    foundedYearEn: "16th century",
    populationBefore1948: "5,000",
    shortDesc: "مدينة فلسطينية حديثة نسبيًا تُعد مركزًا إداريًا وثقافيًا مهمًا.",
    shortDescEn: "A relatively modern Palestinian city, an important administrative and cultural center.",
    description: "رام الله مركز ثقافي وإداري للسلطة الفلسطينية، تجمع بين الأصالة والحداثة.",
    descriptionEn:
      "Ramallah is a cultural and administrative center for the Palestinian Authority, blending authenticity and modernity.",
    geography: "تقع في وسط الضفة الغربية شمال القدس بنحو 15 كيلومترًا.",
    geographyEn: "Located in the central West Bank, about 15 kilometers north of Jerusalem.",
    history: "أسّسها المسيحيون الفلسطينيون في القرن السادس عشر.",
    historyEn: "Founded by Palestinian Christians in the 16th century.",
    natives: "خليط من المسلمين والمسيحيين الفلسطينيين.",
    nativesEn: "A mix of Palestinian Muslims and Christians.",
    highlights: ["مقام ياسر عرفات.", "البلدة القديمة.", "مهرجانات ثقافية متعددة."],
    highlightsEn: ["The Yasser Arafat Mausoleum.", "The Old City.", "Numerous cultural festivals."],
    naming: "من \"رام\" بمعنى المرتفع، و\"الله\" دلالة على القداسة.",
    namingEn: "From \"Ram\" meaning \"high\" and \"Allah\" denoting sanctity.",
    zionistName: "تستخدم نفس الاسم.",
    zionistNameEn: "The same name is used.",
    brief: "رام الله العاصمة المؤقتة وقلب فلسطين الثقافي.",
    briefEn: "Ramallah, the interim capital and cultural heart of Palestine.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Ramallah_centre.jpg/1280px-Ramallah_centre.jpg",
    date: DATE_AR,
    dateEn: DATE_EN,
  },
  {
    id: "bisan",
    name: "مدينة بيسان",
    nameEn: "Bisan",
    region: "48_territories",
    status: "destroyed",
    foundedYear: "6000 ق.م",
    foundedYearEn: "6000 BCE",
    populationBefore1948: "5,540",
    shortDesc: "مدينة فلسطينية تاريخية تقع في الأغوار الشمالية، وعُرفت بمعالمها.",
    shortDescEn: "A historic Palestinian city in the northern Jordan Valley, known for its landmarks.",
    description: "بيسان من أقدم المدن الفلسطينية، تقع في غور الأردن وتشتهر بآثارها الرومانية.",
    descriptionEn:
      "Bisan is one of the oldest Palestinian cities, located in the Jordan Valley and famous for its Roman ruins.",
    geography: "تقع في الأغوار الشمالية لفلسطين.",
    geographyEn: "Located in the northern Jordan Valley of Palestine.",
    history: "مدينة كنعانية قديمة عمرها أكثر من 6000 سنة، هُجّرت عام 1948.",
    historyEn: "An ancient Canaanite city more than 6,000 years old, depopulated in 1948.",
    natives: "كان سكانها من الفلسطينيين قبل النكبة.",
    nativesEn: "Its inhabitants were Palestinians before the Nakba.",
    highlights: ["المدرج الروماني.", "آثار بيسان التاريخية."],
    highlightsEn: ["The Roman amphitheater.", "Historic ruins of Bisan."],
    naming: "من الاسم الكنعاني \"بيت شان\".",
    namingEn: "From the Canaanite name \"Beth Shan\".",
    zionistName: "تُسمّى عبريًا \"بيت شيان / ‎בית שאן\".",
    zionistNameEn: "Called \"Beit She'an / ‎בית שאן\" in Hebrew.",
    brief: "بيسان مدينة الأغوار المهجّرة وأحد أقدم مدن الأرض.",
    briefEn: "Bisan, the depopulated city of the Jordan Valley and one of the oldest cities on earth.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Bet_Shean_Roman_theater.jpg/1280px-Bet_Shean_Roman_theater.jpg",
    date: DATE_AR,
    dateEn: DATE_EN,
  },
];

const DREAM_BODY = [
  {
    heading: "هل ترى ما أرى؟",
    paragraph:
      "دخان كثيف، عربات إسعاف، أشلاء تحت الأنقاض، ثلاجة آيس كريم تحولت إلى ثلاجة لحفظ الموتى بسبب انقطاع الكهرباء المستمر عن سكان قطاع غزة.",
  },
  {
    heading: "نعم!",
    paragraph:
      "لا يوجد سوى المستشفيات. تذهب الأمهات بأطفالها لتحتمي داخل تلك المستشفيات، لربما تكون سفينة النجاة في بحر الدماء.",
  },
  {
    paragraph:
      "في منتصف الليل تبدأ أجساد الأطفال المرتعدة من هول ما حدث في أحضان أمهاتها، بينما هناك طفل في آخر الرواق يحتضن الخواء فلم يتبق أحد من عائلته.",
  },
  {
    heading: "نحكي لكم عن \"حبيبة\"",
    paragraph:
      "إحدى أطفال المخيمات التي اضطرت عائلتها إلى اللجوء إليها بعد تهجيرهم من ديارهم الأصلية. كانت المخيمات عالم حبيبة الصغير الذي رسمت فيه أول لوحاتها الزاهية \"أنا أحب فلسطين\".",
  },
];

const DREAM_BODY_EN = [
  {
    heading: "Do you see what I see?",
    paragraph:
      "Thick smoke, ambulances, body parts under the rubble, an ice-cream freezer turned into a morgue because of the constant blackouts in the Gaza Strip.",
  },
  {
    heading: "Yes!",
    paragraph:
      "Nothing remains but the hospitals. Mothers carry their children inside, hoping the wards will be a lifeboat in a sea of blood.",
  },
  {
    paragraph:
      "At midnight, children's bodies tremble from the horror in their mothers' arms — while at the end of the corridor a child holds nothing but emptiness; not one member of his family remains.",
  },
  {
    heading: "Let us tell you about \"Habiba\"",
    paragraph:
      "A girl from one of the camps her family fled to after being displaced. The camps were Habiba's small world — there she painted her first bright canvas: \"I love Palestine\".",
  },
];

const AQSA_BODY = [
  {
    paragraph:
      "في السابع من أكتوبر 2023، انطلقت معركة طوفان الأقصى لتشكّل نقطة تحوّل في الصراع الفلسطيني-الإسرائيلي وفي وعي الأمة كافة.",
  },
  {
    heading: "الأقصى يُنادي",
    paragraph:
      "المسجد الأقصى المبارك أولى القبلتين وثالث الحرمين الشريفين، رمزٌ يحمل في طياته قرونًا من القداسة والإيمان.",
  },
  {
    paragraph:
      "تواجه فلسطين بعد الطوفان حملة عسكرية غير مسبوقة في قسوتها وامتدادها الزمني، استشهد فيها عشرات الآلاف من المدنيين.",
  },
  {
    heading: "صمود الناس",
    paragraph: "رغم كل ما جرى ويجري، تبقى إرادة الشعب الفلسطيني عصيّة على الكسر.",
  },
];

const AQSA_BODY_EN = [
  {
    paragraph:
      "On October 7, 2023, the Al-Aqsa Flood operation began — a turning point in the Palestinian–Israeli conflict and in the consciousness of the whole region.",
  },
  {
    heading: "Al-Aqsa calls",
    paragraph:
      "The blessed Al-Aqsa Mosque, first of the two qiblas and third of the holy sanctuaries, is a symbol carrying centuries of sanctity and faith.",
  },
  {
    paragraph:
      "After the Flood, Palestine faces an unprecedented military campaign in its cruelty and duration, in which tens of thousands of civilians have been killed.",
  },
  {
    heading: "The people's steadfastness",
    paragraph:
      "Despite everything that has happened and is still happening, the Palestinian people's will remains unbreakable.",
  },
];

export const ARTICLES: Article[] = [
  {
    id: "ard-almoqawama",
    title: "لوحة فنية بعنوان \"أرض المقاومة\"",
    titleEn: "An artwork titled \"Land of Resistance\"",
    excerpt:
      "حكاية حبيبة، الطفلة التي رسمت أحلامها على قماش المخيم بألوان الأمل والصمود.",
    excerptEn:
      "The story of Habiba, the child who painted her dreams on the camp's canvas in colors of hope and steadfastness.",
    date: DATE_AR,
    dateEn: DATE_EN,
    author: "هيئة التحرير",
    authorEn: "Editorial team",
    readingTime: 6,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Children_of_Gaza_painting.jpg/1280px-Children_of_Gaza_painting.jpg",
    category: "dreams",
    body: DREAM_BODY,
    bodyEn: DREAM_BODY_EN,
  },
  {
    id: "salam-mafqoud",
    title: "قصة: من حملة السلم الفارغ للمفقودة",
    titleEn: "A Story: from the empty-ladder campaign to the missing",
    excerpt:
      "رحلة بحث طويلة لعائلة فلسطينية تبحث عن أبنائها المفقودين في زحام الحرب.",
    excerptEn:
      "A long journey for a Palestinian family searching for their children lost in the chaos of war.",
    date: DATE_AR,
    dateEn: DATE_EN,
    author: "هيئة التحرير",
    authorEn: "Editorial team",
    readingTime: 8,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Palestinian_refugees.jpg/1280px-Palestinian_refugees.jpg",
    category: "dreams",
    body: DREAM_BODY,
    bodyEn: DREAM_BODY_EN,
  },
  {
    id: "tifl-aouni",
    title: "قصة الطفل عوني الدوس",
    titleEn: "The story of the child Aouni al-Dous",
    excerpt:
      "حكاية طفل فلسطيني تحوّل حلمه إلى نهج مقاومة بعد أن فقد عائلته في غارة على غزة.",
    excerptEn:
      "A Palestinian child whose dream turned into a path of resistance after losing his family in a strike on Gaza.",
    date: DATE_AR,
    dateEn: DATE_EN,
    author: "هيئة التحرير",
    authorEn: "Editorial team",
    readingTime: 7,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Gaza_destruction_2014.jpg/1280px-Gaza_destruction_2014.jpg",
    category: "dreams",
    body: DREAM_BODY,
    bodyEn: DREAM_BODY_EN,
  },
  {
    id: "ahlam-1",
    title: "أحلام لن تتحقق",
    titleEn: "Dreams that won't come true",
    excerpt: "حكايات أطفال غزة التي بقيت معلّقة في فضاء الحرب.",
    excerptEn: "Stories of Gaza's children, left suspended in the space of war.",
    date: DATE_AR,
    dateEn: DATE_EN,
    readingTime: 5,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Gaza_City_at_night.jpg/1280px-Gaza_City_at_night.jpg",
    category: "dreams",
    body: DREAM_BODY,
    bodyEn: DREAM_BODY_EN,
  },
  {
    id: "ahlam-2",
    title: "ما لا تعرفه عن فلسطين",
    titleEn: "What you don't know about Palestine",
    excerpt: "فلسطين هي المنطقة الواقعة جنوب غرب آسيا، في الجزء الجنوبي من بلاد الشام.",
    excerptEn:
      "Palestine is the region located in southwest Asia, in the southern part of the Levant.",
    date: DATE_AR,
    dateEn: DATE_EN,
    readingTime: 4,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Palestine_landscape.jpg/1280px-Palestine_landscape.jpg",
    category: "dreams",
    body: DREAM_BODY,
    bodyEn: DREAM_BODY_EN,
  },
  {
    id: "ahlam-3",
    title: "قصة الطفل عوني الدوس - تتمة",
    titleEn: "The story of Aouni al-Dous — continued",
    excerpt: "تتمة لحكاية الطفل عوني ومسيرته بين الركام.",
    excerptEn: "A continuation of Aouni's story and his journey through the rubble.",
    date: DATE_AR,
    dateEn: DATE_EN,
    readingTime: 6,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Gaza_children.jpg/1280px-Gaza_children.jpg",
    category: "dreams",
    body: DREAM_BODY,
    bodyEn: DREAM_BODY_EN,
  },
  {
    id: "aqsa-1",
    title: "كيف يصل الاحتلال للصوت الزائف للشفاء؟",
    titleEn: "How does the occupation reach the false narrative of Al-Shifa?",
    excerpt: "تحقيق حول استهداف مستشفى الشفاء في غزة وتداعياته الإنسانية.",
    excerptEn:
      "An investigation into the targeting of Al-Shifa hospital in Gaza and its humanitarian consequences.",
    date: DATE_AR,
    dateEn: DATE_EN,
    readingTime: 9,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Al-Shifa_hospital.jpg/1280px-Al-Shifa_hospital.jpg",
    category: "alaqsa",
    body: AQSA_BODY,
    bodyEn: AQSA_BODY_EN,
  },
  {
    id: "aqsa-2",
    title: "فلسطين عبر الزمان",
    titleEn: "Palestine through time",
    excerpt: "رحلة في تاريخ فلسطين من الكنعانيين حتى اليوم.",
    excerptEn: "A journey through Palestine's history from the Canaanites to today.",
    date: DATE_AR,
    dateEn: DATE_EN,
    readingTime: 10,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Palestine_history.jpg/1280px-Palestine_history.jpg",
    category: "alaqsa",
    body: AQSA_BODY,
    bodyEn: AQSA_BODY_EN,
  },
  {
    id: "aqsa-3",
    title: "تغطية مستشفى المعمداني",
    titleEn: "Coverage of the Baptist Hospital",
    excerpt: "تفاصيل حول مجزرة المستشفى المعمداني في غزة.",
    excerptEn: "Details of the Baptist Hospital massacre in Gaza.",
    date: DATE_AR,
    dateEn: DATE_EN,
    readingTime: 7,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Baptist_Hospital_Gaza.jpg/1280px-Baptist_Hospital_Gaza.jpg",
    category: "alaqsa",
    body: AQSA_BODY,
    bodyEn: AQSA_BODY_EN,
  },
  {
    id: "aqsa-4",
    title: "مجزرة مدرسة الفاخورة",
    titleEn: "The Al-Fakhoura school massacre",
    excerpt: "وثائق وشهادات عن استهداف مدرسة الفاخورة في جباليا.",
    excerptEn:
      "Documents and testimonies on the targeting of Al-Fakhoura school in Jabalia.",
    date: DATE_AR,
    dateEn: DATE_EN,
    readingTime: 8,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/UNRWA_school.jpg/1280px-UNRWA_school.jpg",
    category: "alaqsa",
    body: AQSA_BODY,
    bodyEn: AQSA_BODY_EN,
  },
  {
    id: "aqsa-5",
    title: "اتفاق الهدنة بغزة 2023",
    titleEn: "The Gaza truce agreement, 2023",
    excerpt: "تحليل لبنود الهدنة المؤقتة في نوفمبر 2023.",
    excerptEn: "An analysis of the November 2023 temporary truce terms.",
    date: DATE_AR,
    dateEn: DATE_EN,
    readingTime: 6,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Gaza_ceasefire.jpg/1280px-Gaza_ceasefire.jpg",
    category: "alaqsa",
    body: AQSA_BODY,
    bodyEn: AQSA_BODY_EN,
  },
  {
    id: "aqsa-6",
    title: "مجزرة الشفاء",
    titleEn: "The Al-Shifa massacre",
    excerpt: "ما جرى في مستشفى الشفاء من تدمير ممنهج.",
    excerptEn: "The systematic destruction that took place at Al-Shifa hospital.",
    date: DATE_AR,
    dateEn: DATE_EN,
    readingTime: 7,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Gaza_Strip_destruction.jpg/1280px-Gaza_Strip_destruction.jpg",
    category: "alaqsa",
    body: AQSA_BODY,
    bodyEn: AQSA_BODY_EN,
  },
];

export const FIGURES: Figure[] = [
  {
    id: "yasser-arafat",
    name: "ياسر عرفات",
    nameEn: "Yasser Arafat",
    birthYear: 1929,
    deathYear: 2004,
    birthCity: "al-quds",
    field: "politics",
    bio:
      "أبو عمار، رئيس منظمة التحرير الفلسطينية وأول رئيس للسلطة الوطنية الفلسطينية. قاد النضال الفلسطيني لعقود وحاز جائزة نوبل للسلام عام 1994.",
    bioEn:
      "Abu Ammar, chairman of the PLO and first president of the Palestinian Authority. He led the Palestinian struggle for decades and was awarded the Nobel Peace Prize in 1994.",
    portrait:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Yasser_Arafat_in_DC.jpg/640px-Yasser_Arafat_in_DC.jpg",
  },
  {
    id: "mahmoud-darwish",
    name: "محمود درويش",
    nameEn: "Mahmoud Darwish",
    birthYear: 1941,
    deathYear: 2008,
    birthCity: "haifa",
    field: "literature",
    bio:
      "شاعر فلسطين الأكبر، صاحب \"سجل أنا عربي\" و\"على هذه الأرض ما يستحق الحياة\". صوت الذاكرة الفلسطينية والهوية في الشعر العربي الحديث.",
    bioEn:
      "Palestine's greatest poet, author of \"Record! I am an Arab\" and \"On this earth, that which is worthy of life\" — the voice of Palestinian memory and identity in modern Arabic poetry.",
    portrait:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Mahmoud_Darwish.jpg/640px-Mahmoud_Darwish.jpg",
  },
  {
    id: "ghassan-kanafani",
    name: "غسان كنفاني",
    nameEn: "Ghassan Kanafani",
    birthYear: 1936,
    deathYear: 1972,
    birthCity: "yaffa",
    field: "literature",
    bio:
      "روائي وصحفي فلسطيني، صاحب \"رجال في الشمس\" و\"عائد إلى حيفا\". اغتاله الموساد في بيروت عام 1972.",
    bioEn:
      "A Palestinian novelist and journalist, author of \"Men in the Sun\" and \"Returning to Haifa\". Assassinated by the Mossad in Beirut in 1972.",
    portrait:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Ghassan_Kanafani.jpg/640px-Ghassan_Kanafani.jpg",
  },
  {
    id: "edward-said",
    name: "إدوارد سعيد",
    nameEn: "Edward Said",
    birthYear: 1935,
    deathYear: 2003,
    birthCity: "al-quds",
    field: "science",
    bio:
      "مفكر ومنظّر فلسطيني-أمريكي، صاحب كتاب \"الاستشراق\" الذي غيّر دراسات ما بعد الكولونيالية.",
    bioEn:
      "A Palestinian–American intellectual and theorist, author of \"Orientalism\", a book that transformed post-colonial studies.",
    portrait:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Edward_Said_-_2.jpg/640px-Edward_Said_-_2.jpg",
  },
  {
    id: "naji-alali",
    name: "ناجي العلي",
    nameEn: "Naji al-Ali",
    birthYear: 1938,
    deathYear: 1987,
    field: "arts",
    bio:
      "رسام الكاريكاتير الفلسطيني الأشهر، خالق شخصية \"حنظلة\" التي صارت رمزًا للقضية. اغتيل في لندن عام 1987.",
    bioEn:
      "Palestine's most famous cartoonist, creator of the character \"Handala\" who became a symbol of the cause. Assassinated in London in 1987.",
    portrait:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Handala.svg/640px-Handala.svg.png",
  },
  {
    id: "fadwa-touqan",
    name: "فدوى طوقان",
    nameEn: "Fadwa Tuqan",
    birthYear: 1917,
    deathYear: 2003,
    birthCity: "nablus",
    field: "literature",
    bio: "شاعرة فلسطين الأم، رائدة الشعر العربي الحديث وصوت الأرض المحتلة.",
    bioEn:
      "Palestine's mother poet, a pioneer of modern Arabic poetry and the voice of the occupied land.",
    portrait:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Fadwa_Tuqan.jpg/640px-Fadwa_Tuqan.jpg",
  },
  {
    id: "izz-aldin-alqassam",
    name: "عز الدين القسّام",
    nameEn: "Izz ad-Din al-Qassam",
    birthYear: 1882,
    deathYear: 1935,
    field: "resistance",
    bio:
      "شيخ ومقاوم فلسطيني سوري الأصل، قاد المقاومة المسلحة ضد الانتداب البريطاني واستشهد عام 1935.",
    bioEn:
      "A Palestinian-Syrian sheikh and resistance fighter who led armed resistance against the British Mandate and was martyred in 1935.",
    portrait:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Sheikh_Izz_ad-Din_al-Qassam.jpg/640px-Sheikh_Izz_ad-Din_al-Qassam.jpg",
  },
  {
    id: "leila-khaled",
    name: "ليلى خالد",
    nameEn: "Leila Khaled",
    birthYear: 1944,
    birthCity: "haifa",
    field: "resistance",
    bio:
      "مناضلة فلسطينية ورمز نضالي للمرأة الفلسطينية، عضوة في الجبهة الشعبية لتحرير فلسطين.",
    bioEn:
      "A Palestinian fighter and an icon of Palestinian women's struggle, a member of the Popular Front for the Liberation of Palestine.",
    portrait:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Leila_Khaled_2009.jpg/640px-Leila_Khaled_2009.jpg",
  },
];

export const HISTORY_EVENTS: HistoryEvent[] = [
  {
    id: "balfour-1917",
    title: "وعد بلفور",
    titleEn: "The Balfour Declaration",
    eventDate: "2 نوفمبر 1917",
    eventDateEn: "November 2, 1917",
    isoDate: "1917-11-02",
    eventType: "milestone",
    description:
      "تصريح وزير الخارجية البريطاني آرثر بلفور بمنح اليهود \"وطنًا قوميًا\" في فلسطين، وهو أول وثيقة دولية فتحت الطريق لمشروع الاستيطان الصهيوني.",
    descriptionEn:
      "The British Foreign Secretary Arthur Balfour's declaration granting Jews a \"national home\" in Palestine — the first international document to pave the way for the Zionist settlement project.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Balfour_declaration_unmarked.jpg/1280px-Balfour_declaration_unmarked.jpg",
    sources: ["الأرشيف البريطاني الوطني"],
    sourcesEn: ["The British National Archives"],
  },
  {
    id: "nakba-1948",
    title: "النكبة الفلسطينية",
    titleEn: "The Palestinian Nakba",
    eventDate: "15 مايو 1948",
    eventDateEn: "May 15, 1948",
    isoDate: "1948-05-15",
    eventType: "nakba",
    description:
      "تهجير أكثر من 750 ألف فلسطيني من ديارهم وتدمير أكثر من 530 قرية ومدينة، وإعلان قيام الكيان الصهيوني على الأرض الفلسطينية.",
    descriptionEn:
      "The displacement of more than 750,000 Palestinians from their homes and the destruction of over 530 villages and cities, and the declaration of the Zionist entity on Palestinian land.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Palestinian_refugees.jpg/1280px-Palestinian_refugees.jpg",
    relatedCity: "yaffa",
  },
  {
    id: "naksa-1967",
    title: "النكسة وحرب 1967",
    titleEn: "The Naksa and the 1967 War",
    eventDate: "5 يونيو 1967",
    eventDateEn: "June 5, 1967",
    isoDate: "1967-06-05",
    eventType: "war",
    description:
      "احتلال إسرائيل للضفة الغربية وقطاع غزة والقدس الشرقية والجولان وسيناء في حرب الأيام الستة.",
    descriptionEn:
      "Israel's occupation of the West Bank, Gaza Strip, East Jerusalem, the Golan, and Sinai in the Six-Day War.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Six_Day_War_Territories.svg/1280px-Six_Day_War_Territories.svg.png",
  },
  {
    id: "intifada-1987",
    title: "الانتفاضة الفلسطينية الأولى",
    titleEn: "The First Palestinian Intifada",
    eventDate: "8 ديسمبر 1987",
    eventDateEn: "December 8, 1987",
    isoDate: "1987-12-08",
    eventType: "uprising",
    description:
      "انتفاضة شعبية شاملة في الضفة الغربية وقطاع غزة، عُرفت بانتفاضة الحجارة، وأعادت القضية الفلسطينية إلى الواجهة الدولية.",
    descriptionEn:
      "A comprehensive popular uprising in the West Bank and Gaza known as the Stone Intifada, which brought the Palestinian cause back to international attention.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/First_intifada.jpg/1280px-First_intifada.jpg",
  },
  {
    id: "oslo-1993",
    title: "اتفاق أوسلو",
    titleEn: "The Oslo Accords",
    eventDate: "13 سبتمبر 1993",
    eventDateEn: "September 13, 1993",
    isoDate: "1993-09-13",
    eventType: "milestone",
    description:
      "توقيع اتفاق إعلان المبادئ بين منظمة التحرير الفلسطينية وإسرائيل في البيت الأبيض.",
    descriptionEn:
      "Signing of the Declaration of Principles between the PLO and Israel at the White House.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Bill_Clinton%2C_Yitzhak_Rabin%2C_Yasser_Arafat_at_the_White_House_1993-09-13.jpg/1280px-Bill_Clinton%2C_Yitzhak_Rabin%2C_Yasser_Arafat_at_the_White_House_1993-09-13.jpg",
  },
  {
    id: "aqsa-intifada-2000",
    title: "انتفاضة الأقصى",
    titleEn: "The Al-Aqsa Intifada",
    eventDate: "28 سبتمبر 2000",
    eventDateEn: "September 28, 2000",
    isoDate: "2000-09-28",
    eventType: "uprising",
    description:
      "انطلقت بعد اقتحام أرييل شارون للمسجد الأقصى، واستمرت خمس سنوات سقط فيها آلاف الشهداء.",
    descriptionEn:
      "Triggered by Ariel Sharon's storming of the Al-Aqsa Mosque, it lasted five years and saw thousands killed.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Al-Aqsa_Mosque_view.jpg/1280px-Al-Aqsa_Mosque_view.jpg",
    relatedCity: "al-quds",
  },
  {
    id: "tufan-alaqsa-2023",
    title: "طوفان الأقصى",
    titleEn: "Al-Aqsa Flood",
    eventDate: "7 أكتوبر 2023",
    eventDateEn: "October 7, 2023",
    isoDate: "2023-10-07",
    eventType: "war",
    description:
      "عملية كبرى أطلقتها المقاومة الفلسطينية من غزة، تبعها عدوان إسرائيلي واسع على القطاع.",
    descriptionEn:
      "A major operation launched by the Palestinian resistance from Gaza, followed by a wide-scale Israeli assault on the Strip.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Gaza_Strip_destruction.jpg/1280px-Gaza_Strip_destruction.jpg",
    relatedCity: "ghazza",
  },
];

export const HOME_HERO = {
  title: "فلسطين هي خارطتنا وبلدنا وستبقى حرة ووجهتنا الأولى والأخيرة.",
  titleEn:
    "Palestine is our map, our homeland, and will remain free — our first and final destination.",
  description:
    "تمتاز فلسطين بعراقتها وتاريخها وعادات الضيافة المميزة فيها. تقع في قلب العالم بين أفريقيا وأوروبا وآسيا. تتميز فلسطين بتعدد اللغات المستخدمة فيها وتعدد الثقافات والمعتقدات.",
  descriptionEn:
    "Palestine is distinguished by its heritage, history, and traditions of hospitality. It lies at the heart of the world between Africa, Europe, and Asia, with a rich diversity of languages, cultures, and beliefs.",
};

export const INTRO_BLOCK = {
  title: "ما لا تعرفه عن فلسطين",
  titleEn: "What you don't know about Palestine",
  paragraph:
    "فلسطين هي المنطقة الواقعة جنوب غرب آسيا، في الجزء الجنوبي من بلاد الشام. وتمتد أراضيها على طول الساحل الشرقي للبحر الأبيض المتوسط. تُعد فلسطين من أقدم المناطق المأهولة بالسكان، وقد شهدت تعاقب العديد من الحضارات والشعوب عبر العصور، كما أنها مهد الديانات السماوية الثلاث.",
  paragraphEn:
    "Palestine is the region located in southwest Asia, in the southern part of the Levant, extending along the eastern Mediterranean coast. It is among the oldest inhabited regions on earth, having witnessed the succession of many civilizations and peoples, and is the cradle of the three Abrahamic religions.",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Dome_of_the_Rock_Temple_Mount.jpg/640px-Dome_of_the_Rock_Temple_Mount.jpg",
};

// ---------- Search helpers ----------

export type SearchResult =
  | { kind: "city"; item: City }
  | { kind: "article"; item: Article }
  | { kind: "figure"; item: Figure }
  | { kind: "history"; item: HistoryEvent };

export function searchAll(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: SearchResult[] = [];
  for (const c of CITIES) {
    if (
      c.name.toLowerCase().includes(q) ||
      c.nameEn?.toLowerCase().includes(q) ||
      c.shortDesc.toLowerCase().includes(q) ||
      c.shortDescEn?.toLowerCase().includes(q)
    )
      results.push({ kind: "city", item: c });
  }
  for (const a of ARTICLES) {
    if (
      a.title.toLowerCase().includes(q) ||
      a.titleEn?.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.excerptEn?.toLowerCase().includes(q)
    )
      results.push({ kind: "article", item: a });
  }
  for (const f of FIGURES) {
    if (
      f.name.toLowerCase().includes(q) ||
      f.nameEn?.toLowerCase().includes(q) ||
      f.bio.toLowerCase().includes(q) ||
      f.bioEn?.toLowerCase().includes(q)
    )
      results.push({ kind: "figure", item: f });
  }
  for (const h of HISTORY_EVENTS) {
    if (
      h.title.toLowerCase().includes(q) ||
      h.titleEn?.toLowerCase().includes(q) ||
      h.description.toLowerCase().includes(q) ||
      h.descriptionEn?.toLowerCase().includes(q)
    )
      results.push({ kind: "history", item: h });
  }
  return results;
}
