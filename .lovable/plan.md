## الهدف
دعم اللغة الإنجليزية بالكامل (واجهة + محتوى) مع زر تبديل EN/ع في الـNavbar.

## الخطوات

### 1. نظام اللغة (Language Context)
- إنشاء `src/lib/i18n.tsx` يحتوي:
  - `LanguageProvider` يحفظ اللغة في `localStorage` ويحدّث `<html lang dir>` تلقائياً.
  - `useLanguage()` يعيد `{ lang, setLang, t, pick }`.
  - قاموس `UI_STRINGS` لكل نصوص الواجهة (Navbar, أزرار، عناوين الأقسام، Footer، Pagination…).
- تطبيق الـProvider في `__root.tsx`، وجعل `<html>` يستخدم القيم من الـContext.

### 2. توسيع نموذج البيانات
في `src/data/content.ts` أضيف حقول `_en` موازية لكل الحقول النصية في:
- `City` (name, shortDesc, description, geography, history, natives, highlights, naming, zionistName, brief)
- `Article` (title, excerpt, body[].heading/paragraph)
- `Figure` (name, bio)
- `HistoryEvent` (title, description, eventDate)
- `REGION_LABEL_EN`, `STATUS_LABEL_EN`, `FIELD_LABEL_EN`, `EVENT_LABEL_EN`، `CATEGORY_LABEL_EN`.

Helper: `pick(item, field)` يختار `field_en` عند `lang === "en"` ويسقط على العربي.

### 3. تحديث كل المكوّنات والصفحات
استبدال النصوص الثابتة والقراءة من البيانات باستخدام `t()` و`pick()` في:
- `Navbar`, `PreFooter`, `FooterBar`, `Pagination`, `SectionHeader`
- `ArticleCard`, `CityCard`, `FigureCard`, `HistoryCard`
- صفحات: `index`, `about`, `search`, `articles.index`, `articles.$id`, `cities.index`, `cities.$id`, `figures.index`, `figures.$id`, `history.index`, `history.$id`
- تواريخ المقالات/المدن تُترجم عبر `Intl.DateTimeFormat` حسب اللغة.

### 4. زر التبديل في الـNavbar
ربط زر `EN / ع` الموجود باستدعاء `setLang(lang === "ar" ? "en" : "ar")` وعرض التسمية المعاكسة.

### 5. الاتجاه والمحاذاة
- العربية: `dir="rtl"` + محاذاة يمين.
- الإنجليزية: `dir="ltr"` + محاذاة يسار (إزالة `text-right` المُجبَر واستخدام `text-start`/`text-end` بدلاً منها في الصفحات الرئيسية).

### 6. الـSEO
تحديث `head()` في كل route ليولّد title/description بحسب اللغة الافتراضية (العربية) — تبديل اللغة يتم client-side ولن يغيّر الـmeta الأولية (مقبول لـSPA toggle).

## ملاحظات تقنية
- لا حاجة لمكتبة i18n خارجية — قاموس JSON بسيط يكفي.
- ترجمة محتوى المدن/المقالات/الشخصيات/التاريخ ستضاعف حجم `content.ts` تقريباً.
- المسارات تبقى كما هي (`/articles/$id`)، بدون `/en` و`/ar`.

## النتيجة
ضغطة واحدة على زر `EN/ع` تقلب كامل الموقع — نصوص، عناوين، محتوى، اتجاه — مع حفظ الاختيار بين الجلسات.
