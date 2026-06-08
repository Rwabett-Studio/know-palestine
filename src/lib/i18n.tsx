import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "ar" | "en";

const STORAGE_KEY = "lang";

// ------------------- UI strings -------------------
export const UI_STRINGS = {
  ar: {
    // Navbar
    nav_home: "الرئيسية",
    nav_cities: "المدن",
    nav_articles: "المقالات",
    nav_figures: "شخصيات",
    nav_history: "تاريخ",
    nav_about: "من نحن",
    search_placeholder: "ابحث...",
    subscribe: "اشتراك",
    menu: "القائمة",
    switch_lang: "EN",

    // Footer
    footer_rights: "جميع الحقوق محفوظة.",
    footer_sections: "الأقسام",
    footer_newsletter: "النشرة البريدية",
    footer_newsletter_desc: "اشترك لتصلك أبرز المقالات والمواد التوثيقية أسبوعياً.",
    footer_email_placeholder: "بريدك الإلكتروني",
    site_name: "إعرف فلسطين",
    site_tagline:
      "منصة رقمية متخصصة في توثيق فلسطين — مدنها، تاريخها، شخصياتها، وأحداثها — بأسلوب صحفي رصين.",
    footer_twitter: "تويتر",
    footer_facebook: "فيسبوك",
    footer_instagram: "إنستغرام",
    footer_youtube: "يوتيوب",

    // Sections
    section_more: "المزيد",
    section_read_more: "(قراءة المزيد) ...",
    section_share: "مشاركة",
    section_min_read: "دقائق قراءة",
    section_related_topics: "مواضيع ذات صلة",
    section_related_articles: "مقالات ذات صلة",
    section_related_figures: "شخصيات ذات صلة",
    section_related_events: "أحداث ذات صلة",
    section_special: "ملف خاص",
    section_investigation: "تحقيق",
    section_pagination_page: "صفحة",

    // Home
    home_latest: "أحدث المقالات",
    home_cities: "استكشف مدن فلسطين",
    home_cities_sub: "تعرّف على أبرز المدن الفلسطينية وتاريخها.",
    home_figures: "شخصيات وأعلام",
    home_history: "تاريخ وذاكرة",

    // Pages titles
    page_articles: "المقالات",
    page_cities: "المدن",
    page_figures: "شخصيات وأعلام",
    page_figures_sub:
      "أعلامٌ فلسطينيون تركوا بصمةً في السياسة والأدب والفنون والعلوم والمقاومة.",
    page_history: "تاريخ وذاكرة",
    page_history_sub: "محطات تاريخية مفصلية شكّلت وجدان الشعب الفلسطيني.",
    page_about: "من نحن",
    cities_section_title: "تعرف على مدن فلسطين",
    cities_section_sub:
      "تعرف على أبرز المدن الفلسطينية وما كانت تمثله من قبل الصهاينة.",

    // Filters
    filter_all: "الكل",

    // Categories
    cat_dreams: "أحلام لن تتحقق",
    cat_alaqsa: "طوفان الأقصى",
    cat_investigation: "تحقيقات",
    cat_report: "تقارير",

    // City detail
    city_description: "الوصف",
    city_geography: "الموقع الجغرافي",
    city_history: "تاريخ المدينة",
    city_natives_prefix: "السكان الأصليون لـ",
    city_highlights_prefix: "مزايا مدينة",
    city_naming: "سبب تسميتها بهذا الاسم",
    city_zionist: "ماذا يطلق عليها الصهاينة ؟",
    city_brief: "نبذة مختصرة",
    city_prefix: "مدينة",

    // Figure detail
    figure_birth: "الميلاد",
    figure_death: "الوفاة",
    figure_city: "المدينة",

    // History detail
    history_related_city: "مدينة مرتبطة",
    history_sources: "المصادر",

    // Search
    search_title: "نتائج البحث",
    search_for: "عن:",
    search_count: "نتيجة",
    search_empty: "اكتب كلمة بحث من شريط البحث في الأعلى.",
    search_no_results: "لا توجد نتائج مطابقة.",
    kind_city: "مدينة",
    kind_article: "مقال",
    kind_figure: "شخصية",
    kind_history: "حدث",

    // About
    about_intro_html: "منصة رقمية مستقلة لتوثيق فلسطين بأسلوب صحفي رصين.",
    about_mission: "رسالتنا",
    about_mission_body:
      "أن نُبقي الذاكرة الفلسطينية حيّةً ومتاحة، وأن نُقدّم محتوى موثّقاً ومحرَّراً بعناية يخدم الباحثين وأبناء الشتات والقرّاء على حدٍّ سواء، بعيداً عن الضجيج وقريباً من الحقيقة.",
    about_pillar_1_t: "توثيق رصين",
    about_pillar_1_b:
      "نعمل وفق منهجية صحفية رصينة تجمع بين عمق التحقيق وموثوقية الأرشيف.",
    about_pillar_2_t: "هوية بصرية مميزة",
    about_pillar_2_b:
      "تصميم نظيف وتجربة قراءة مريحة باللغتين العربية والإنجليزية.",
    about_pillar_3_t: "ذاكرة جامعة",
    about_pillar_3_b: "نوثّق المدن والشخصيات والأحداث في فضاء واحد قابل للبحث.",

    // State
    loading: "جارٍ التحميل...",

    // Errors
    not_found_city: "المدينة غير موجودة",
    not_found_article: "المقال غير موجود",
    not_found_figure: "الشخصية غير موجودة",
    not_found_history: "الحدث غير موجود",
    not_found_title: "الصفحة غير موجودة",
    not_found_body: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
    go_home: "العودة للرئيسية",
    error_title: "تعذّر تحميل هذه الصفحة",
    error_body: "حدث خطأ ما من جانبنا. يمكنك المحاولة بتحديث الصفحة أو العودة إلى الرئيسية.",
    try_again: "حاول مجدداً",
  },
  en: {
    nav_home: "Home",
    nav_cities: "Cities",
    nav_articles: "Articles",
    nav_figures: "Figures",
    nav_history: "History",
    nav_about: "About",
    search_placeholder: "Search...",
    subscribe: "Subscribe",
    menu: "Menu",
    switch_lang: "AR",

    footer_rights: "All rights reserved.",
    footer_sections: "Sections",
    footer_newsletter: "Newsletter",
    footer_newsletter_desc:
      "Subscribe to receive our top articles and documentary materials weekly.",
    footer_email_placeholder: "Your email",
    site_name: "Know Palestine",
    site_tagline:
      "A digital platform dedicated to documenting Palestine — its cities, history, figures, and events — with rigorous journalistic standards.",
    footer_twitter: "Twitter",
    footer_facebook: "Facebook",
    footer_instagram: "Instagram",
    footer_youtube: "YouTube",

    section_more: "More",
    section_read_more: "(Read more) ...",
    section_share: "Share",
    section_min_read: "min read",
    section_related_topics: "Related topics",
    section_related_articles: "Related articles",
    section_related_figures: "Related figures",
    section_related_events: "Related events",
    section_special: "Special",
    section_investigation: "Investigation",
    section_pagination_page: "Page",

    home_latest: "Latest articles",
    home_cities: "Explore Palestinian cities",
    home_cities_sub:
      "Discover the most prominent Palestinian cities and their history.",
    home_figures: "Figures & icons",
    home_history: "History & memory",

    page_articles: "Articles",
    page_cities: "Cities",
    page_figures: "Figures & icons",
    page_figures_sub:
      "Palestinian figures who left their mark in politics, literature, arts, sciences, and resistance.",
    page_history: "History & memory",
    page_history_sub:
      "Defining historical milestones that shaped the Palestinian conscience.",
    page_about: "About us",
    cities_section_title: "Discover Palestinian cities",
    cities_section_sub:
      "Learn about the most important Palestinian cities and what they meant before occupation.",

    filter_all: "All",

    cat_dreams: "Dreams that won't come true",
    cat_alaqsa: "Al-Aqsa Flood",
    cat_investigation: "Investigations",
    cat_report: "Reports",

    city_description: "Description",
    city_geography: "Geography",
    city_history: "History",
    city_natives_prefix: "Indigenous people of ",
    city_highlights_prefix: "Highlights of ",
    city_naming: "Origin of the name",
    city_zionist: "What do the Zionists call it?",
    city_brief: "Brief summary",
    city_prefix: "City of",

    figure_birth: "Born",
    figure_death: "Died",
    figure_city: "City",

    history_related_city: "Related city",
    history_sources: "Sources",

    search_title: "Search results",
    search_for: "For:",
    search_count: "results",
    search_empty: "Type a search term in the search bar above.",
    search_no_results: "No matching results.",
    kind_city: "City",
    kind_article: "Article",
    kind_figure: "Figure",
    kind_history: "Event",

    about_intro_html:
      "An independent digital platform documenting Palestine with rigorous journalistic standards.",
    about_mission: "Our Mission",
    about_mission_body:
      "To keep the Palestinian memory alive and accessible, and to provide carefully edited, documented content that serves researchers, the diaspora, and readers alike — far from noise and close to the truth.",
    about_pillar_1_t: "Rigorous documentation",
    about_pillar_1_b:
      "We work with a journalistic methodology combining the depth of investigation with archival reliability.",
    about_pillar_2_t: "Distinctive visual identity",
    about_pillar_2_b:
      "Clean design and a comfortable reading experience in both Arabic and English.",
    about_pillar_3_t: "Unified memory",
    about_pillar_3_b:
      "We document cities, figures, and events in one searchable space.",

    loading: "Loading...",

    not_found_city: "City not found",
    not_found_article: "Article not found",
    not_found_figure: "Figure not found",
    not_found_history: "Event not found",
    not_found_title: "Page not found",
    not_found_body: "The page you're looking for doesn't exist or has been moved.",
    go_home: "Go home",
    error_title: "This page didn't load",
    error_body: "Something went wrong on our end. You can try refreshing or head back home.",
    try_again: "Try again",
  },
} as const;

export type UIKey = keyof typeof UI_STRINGS["ar"];

// ------------------- Context -------------------
interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: UIKey) => string;
  /** Pick `${field}En` when lang is "en" (with fallback), otherwise `field`. */
  pick: (obj: unknown, field: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  // Language resolution priority (client-side only):
  // 1. URL prefix (/en/*) — strongest signal, override everything
  // 2. localStorage — user's previous preference
  // 3. Default "ar"
  useEffect(() => {
    try {
      const urlLang: Lang | null =
        window.location.pathname === "/en" ||
        window.location.pathname.startsWith("/en/")
          ? "en"
          : null;
      if (urlLang) {
        setLangState(urlLang);
        return;
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "ar") setLangState(stored as Lang);
    } catch {
      // ignore (SSR / private browsing)
    }
  }, []);

  // Sync <html lang dir> on language change
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  };

  const t = (key: UIKey) => UI_STRINGS[lang][key] ?? UI_STRINGS.ar[key] ?? key;

  const pick = (obj: Record<string, unknown> | unknown, field: string): string => {
    const o = obj as Record<string, unknown>;
    if (lang === "en") {
      const v = o[`${field}En`];
      if (typeof v === "string" && v.length > 0) return v;
    }
    const v = o[field];
    return typeof v === "string" ? v : "";
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, pick }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

// Helpers for arrays / labels
export function pickArray(obj: unknown, field: string, lang: Lang): string[] {
  const o = obj as Record<string, unknown>;
  if (lang === "en") {
    const v = o[`${field}En`];
    if (Array.isArray(v) && v.length > 0) return v as string[];
  }
  const v = o[field];
  return Array.isArray(v) ? (v as string[]) : [];
}

