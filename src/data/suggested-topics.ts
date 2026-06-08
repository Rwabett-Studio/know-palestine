// Curated list of 53 suggested content topics, grouped by historical era.
// Powers the admin "Suggested Topics" page: each row can pre-fill the matching
// editor (city / figure / history / article) or be auto-generated with AI.

export type SuggestedType = "حدث" | "شخصية" | "معاهدة" | "مجتمع" | "مدينة";

export type SuggestedEra =
  | "ottoman"
  | "ww1"
  | "mandate"
  | "nakba"
  | "modern"
  | "2023"
  | "cities";

// Which editor a topic routes to when "Fill" / "Generate" is clicked.
export type EditorKind = "city" | "figure" | "history" | "article";

export interface SuggestedTopic {
  era: SuggestedEra;
  eraLabel: string;
  type: SuggestedType;
  color: string;
  title: string;
  desc: string;
  date: string;
  cat: string;
}

export function editorKindFor(type: SuggestedType): EditorKind {
  switch (type) {
    case "مدينة":
      return "city";
    case "شخصية":
      return "figure";
    case "حدث":
    case "معاهدة":
      return "history";
    default:
      return "article"; // مجتمع + anything else
  }
}

export const SUGGESTED_TOPICS: SuggestedTopic[] = [
  // ── عثماني ──
  { era: "ottoman", eraLabel: "الحقبة العثمانية", type: "حدث", color: "#7F77DD", title: "فلسطين تحت الحكم العثماني", desc: "البنية الإدارية والاجتماعية قبل الحرب", date: "١٥١٧–١٩١٤", cat: "سياسة" },
  { era: "ottoman", eraLabel: "الحقبة العثمانية", type: "مجتمع", color: "#7F77DD", title: "الحياة اليومية في فلسطين العثمانية", desc: "المدن والقرى والأسواق والعادات", date: "١٨٠٠–١٩١٤", cat: "مجتمع" },
  { era: "ottoman", eraLabel: "الحقبة العثمانية", type: "حدث", color: "#7F77DD", title: "الهجرة اليهودية الأولى والثانية", desc: "الموجتان الأوليتان وردود الفعل المحلية", date: "١٨٨٢–١٩١٤", cat: "سياسة" },
  { era: "ottoman", eraLabel: "الحقبة العثمانية", type: "معاهدة", color: "#7F77DD", title: "وعد بلفور ١٩١٧", desc: "النص الكامل والخلفية والتداعيات الفورية", date: "نوفمبر ١٩١٧", cat: "معاهدات" },
  { era: "ottoman", eraLabel: "الحقبة العثمانية", type: "شخصية", color: "#7F77DD", title: "أحمد جمال باشا وفلسطين", desc: "حاكم سوريا وسياساته تجاه العرب", date: "١٩١٤–١٩١٨", cat: "شخصيات" },

  // ── الحرب العالمية الأولى ──
  { era: "ww1", eraLabel: "الحرب العالمية الأولى", type: "حدث", color: "#D85A30", title: "الجيش البريطاني يدخل القدس ١٩١٧", desc: "سقوط القدس وخطاب ألنبي الشهير", date: "ديسمبر ١٩١٧", cat: "عسكري" },
  { era: "ww1", eraLabel: "الحرب العالمية الأولى", type: "حدث", color: "#D85A30", title: "معارك غزة الثلاث", desc: "ثلاث معارك متتالية حسمت مصير فلسطين", date: "١٩١٧", cat: "عسكري" },
  { era: "ww1", eraLabel: "الحرب العالمية الأولى", type: "شخصية", color: "#D85A30", title: "لورانس العرب — الرجل والأسطورة", desc: "دوره الحقيقي في الثورة العربية", date: "١٩١٦–١٩١٨", cat: "شخصيات" },
  { era: "ww1", eraLabel: "الحرب العالمية الأولى", type: "معاهدة", color: "#D85A30", title: "مراسلات الحسين-مكماهون", desc: "الوعود البريطانية وما تحقق منها", date: "١٩١٥–١٩١٦", cat: "معاهدات" },

  // ── الانتداب ──
  { era: "mandate", eraLabel: "فترة الانتداب", type: "حدث", color: "#1D9E75", title: "أحداث نيسان ١٩٢٠", desc: "أولى الصدامات في مطلع الانتداب", date: "أبريل ١٩٢٠", cat: "عسكري" },
  { era: "mandate", eraLabel: "فترة الانتداب", type: "حدث", color: "#1D9E75", title: "ثورة البراق ١٩٢٩", desc: "الأسباب والمجريات والنتائج", date: "أغسطس ١٩٢٩", cat: "عسكري" },
  { era: "mandate", eraLabel: "فترة الانتداب", type: "حدث", color: "#1D9E75", title: "الإضراب العام ١٩٣٦", desc: "أطول إضراب في تاريخ فلسطين", date: "١٩٣٦–١٩٣٩", cat: "سياسة" },
  { era: "mandate", eraLabel: "فترة الانتداب", type: "معاهدة", color: "#1D9E75", title: "الكتاب الأبيض ١٩٣٩", desc: "بريطانيا تتراجع عن وعد بلفور", date: "مايو ١٩٣٩", cat: "معاهدات" },
  { era: "mandate", eraLabel: "فترة الانتداب", type: "شخصية", color: "#1D9E75", title: "الحاج أمين الحسيني", desc: "المفتي وقيادة الحركة الوطنية", date: "١٩٢١–١٩٤٨", cat: "شخصيات" },
  { era: "mandate", eraLabel: "فترة الانتداب", type: "شخصية", color: "#1D9E75", title: "عبد القادر الحسيني", desc: "المقاتل الذي سقط في القسطل", date: "١٩٠٨–١٩٤٨", cat: "شخصيات" },
  { era: "mandate", eraLabel: "فترة الانتداب", type: "مجتمع", color: "#1D9E75", title: "الصحافة الفلسطينية ١٩٢٠–١٩٤٨", desc: "الصحف والمجلات وصوت الشعب", date: "١٩٢٠–١٩٤٨", cat: "مجتمع" },
  { era: "mandate", eraLabel: "فترة الانتداب", type: "حدث", color: "#1D9E75", title: "قرار التقسيم ١٨١ — ١٩٤٧", desc: "كيف قرر العالم تقسيم فلسطين", date: "نوفمبر ١٩٤٧", cat: "سياسة" },
  { era: "mandate", eraLabel: "فترة الانتداب", type: "حدث", color: "#1D9E75", title: "فلسطين ١٩٣٨–١٩٤٠", desc: "تصعيد الثورة وسياسة العصا البريطانية", date: "١٩٣٨–١٩٤٠", cat: "عسكري" },
  { era: "mandate", eraLabel: "فترة الانتداب", type: "حدث", color: "#1D9E75", title: "فلسطين ١٩٤١–١٩٤٧", desc: "الحرب العالمية الثانية وتأثيرها على فلسطين", date: "١٩٤١–١٩٤٧", cat: "سياسة" },

  // ── النكبة ──
  { era: "nakba", eraLabel: "النكبة وما بعدها", type: "حدث", color: "#E24B4A", title: "النكبة ١٩٤٨ — السرد الكامل", desc: "خارطة التهجير والمذابح والقرى المُهجَّرة", date: "١٩٤٨", cat: "عسكري" },
  { era: "nakba", eraLabel: "النكبة وما بعدها", type: "حدث", color: "#E24B4A", title: "مذبحة دير ياسين", desc: "تفاصيل المجزرة وتأثيرها على التهجير الجماعي", date: "أبريل ١٩٤٨", cat: "عسكري" },
  { era: "nakba", eraLabel: "النكبة وما بعدها", type: "حدث", color: "#E24B4A", title: "حرب ١٩٤٨ — المعارك والجبهات", desc: "خط القتال والقوى المتصارعة والنتائج العسكرية", date: "١٩٤٨", cat: "عسكري" },
  { era: "nakba", eraLabel: "النكبة وما بعدها", type: "معاهدة", color: "#E24B4A", title: "اتفاقيات الهدنة ١٩٤٩", desc: "هدنة رودس وتثبيت الخطوط الخضراء", date: "١٩٤٩", cat: "معاهدات" },
  { era: "nakba", eraLabel: "النكبة وما بعدها", type: "مجتمع", color: "#E24B4A", title: "اللاجئون والمخيمات — البدايات", desc: "كيف نشأت المخيمات وأين وكيف عاش الناس", date: "١٩٤٨–١٩٥٠", cat: "مجتمع" },
  { era: "nakba", eraLabel: "النكبة وما بعدها", type: "حدث", color: "#E24B4A", title: "حرب ١٩٦٧ — النكسة", desc: "احتلال الضفة وغزة والجولان وسيناء", date: "يونيو ١٩٦٧", cat: "عسكري" },
  { era: "nakba", eraLabel: "النكبة وما بعدها", type: "مجتمع", color: "#E24B4A", title: "فلسطينيو الشتات", desc: "كيف تشكّلت هوية اللاجئين عبر الأجيال", date: "١٩٤٨–الآن", cat: "مجتمع" },

  // ── حديث ──
  { era: "modern", eraLabel: "العصر الحديث", type: "حدث", color: "#378ADD", title: "تأسيس منظمة التحرير ١٩٦٤", desc: "نشأة الكيان السياسي الفلسطيني", date: "١٩٦٤", cat: "سياسة" },
  { era: "modern", eraLabel: "العصر الحديث", type: "حدث", color: "#378ADD", title: "الانتفاضة الأولى ١٩٨٧", desc: "كيف اشتعل الشارع الفلسطيني فجأة", date: "١٩٨٧–١٩٩٣", cat: "عسكري" },
  { era: "modern", eraLabel: "العصر الحديث", type: "معاهدة", color: "#378ADD", title: "اتفاقيات أوسلو ١٩٩٣", desc: "ما وُعد به وما تحقق وما سقط", date: "سبتمبر ١٩٩٣", cat: "معاهدات" },
  { era: "modern", eraLabel: "العصر الحديث", type: "حدث", color: "#378ADD", title: "الانتفاضة الثانية ٢٠٠٠", desc: "أسبابها ومساراتها وتداعياتها", date: "٢٠٠٠–٢٠٠٥", cat: "عسكري" },
  { era: "modern", eraLabel: "العصر الحديث", type: "حدث", color: "#378ADD", title: "الحصار على غزة ٢٠٠٧", desc: "كيف فُرض الحصار ومآلاته على الحياة", date: "٢٠٠٧–الآن", cat: "سياسة" },
  { era: "modern", eraLabel: "العصر الحديث", type: "شخصية", color: "#378ADD", title: "ياسر عرفات — مسيرة رجل", desc: "من الكفاح المسلح إلى أوسلو واغتياله السياسي", date: "١٩٢٩–٢٠٠٤", cat: "شخصيات" },
  { era: "modern", eraLabel: "العصر الحديث", type: "شخصية", color: "#378ADD", title: "الشيخ أحمد ياسين", desc: "مؤسس حماس واغتياله بصاروخ إسرائيلي", date: "١٩٣٦–٢٠٠٤", cat: "شخصيات" },
  { era: "modern", eraLabel: "العصر الحديث", type: "مجتمع", color: "#378ADD", title: "عرب ٤٨ — داخل الخط الأخضر", desc: "هوية وواقع وصراع المواطنة المنقوصة", date: "١٩٤٨–الآن", cat: "مجتمع" },
  { era: "modern", eraLabel: "العصر الحديث", type: "حدث", color: "#378ADD", title: "حروب غزة ٢٠٠٨ و٢٠١٢ و٢٠١٤", desc: "ثلاث جولات قتالية وتصاعد الحصار", date: "٢٠٠٨–٢٠١٤", cat: "عسكري" },

  // ── طوفان الأقصى ──
  { era: "2023", eraLabel: "طوفان الأقصى", type: "حدث", color: "#BA7517", title: "٧ أكتوبر — السرد الكامل", desc: "تفاصيل عملية طوفان الأقصى من البداية", date: "٧ أكتوبر ٢٠٢٣", cat: "عسكري" },
  { era: "2023", eraLabel: "طوفان الأقصى", type: "حدث", color: "#BA7517", title: "الحصار البري الشامل على غزة", desc: "التداعيات الإنسانية والعسكرية اليومية", date: "أكتوبر ٢٠٢٣", cat: "عسكري" },
  { era: "2023", eraLabel: "طوفان الأقصى", type: "حدث", color: "#BA7517", title: "العملية العسكرية في رفح", desc: "الاجتياح البري لأقصى جنوب غزة", date: "مايو ٢٠٢٤", cat: "عسكري" },
  { era: "2023", eraLabel: "طوفان الأقصى", type: "حدث", color: "#BA7517", title: "مجلس الأمن والفيتوات المتكررة", desc: "مواقف الدول الكبرى وقرارات وقف إطلاق النار", date: "٢٠٢٣–٢٠٢٤", cat: "سياسة" },
  { era: "2023", eraLabel: "طوفان الأقصى", type: "مجتمع", color: "#BA7517", title: "الصحفيون في غزة — شهادة واستشهاد", desc: "أعلى معدل استشهاد للصحفيين في التاريخ المعاصر", date: "٢٠٢٣–٢٠٢٤", cat: "مجتمع" },
  { era: "2023", eraLabel: "طوفان الأقصى", type: "حدث", color: "#BA7517", title: "معركة شمال غزة وجباليا", desc: "سردية الهجوم البري في الشمال", date: "أكتوبر–ديسمبر ٢٠٢٣", cat: "عسكري" },

  // ── مدن ──
  { era: "cities", eraLabel: "المدن الفلسطينية", type: "مدينة", color: "#D4537E", title: "القدس — أم المدن", desc: "من الكنعانيين حتى اليوم", date: "منذ الأزل", cat: "مجتمع" },
  { era: "cities", eraLabel: "المدن الفلسطينية", type: "مدينة", color: "#D4537E", title: "يافا — عروس البحر", desc: "ميناء فلسطين وروحها الكوزموبوليتانية", date: "منذ الأزل", cat: "مجتمع" },
  { era: "cities", eraLabel: "المدن الفلسطينية", type: "مدينة", color: "#D4537E", title: "حيفا — الكرمل والخليج", desc: "الميناء والجبل وتاريخ الصراع", date: "منذ الأزل", cat: "مجتمع" },
  { era: "cities", eraLabel: "المدن الفلسطينية", type: "مدينة", color: "#D4537E", title: "غزة — المدينة الأبدية", desc: "من الفلستيين حتى طوفان الأقصى", date: "منذ الأزل", cat: "مجتمع" },
  { era: "cities", eraLabel: "المدن الفلسطينية", type: "مدينة", color: "#D4537E", title: "نابلس — جبل النار", desc: "عاصمة الجبال وتاريخ المقاومة", date: "منذ الأزل", cat: "مجتمع" },
  { era: "cities", eraLabel: "المدن الفلسطينية", type: "مدينة", color: "#D4537E", title: "الخليل — مدينة الأجداد", desc: "المسجد الإبراهيمي والتقسيم القسري", date: "منذ الأزل", cat: "مجتمع" },
  { era: "cities", eraLabel: "المدن الفلسطينية", type: "مدينة", color: "#D4537E", title: "بيت لحم — مهد المسيح", desc: "التاريخ الديني والحصار الحديث", date: "منذ الأزل", cat: "مجتمع" },
  { era: "cities", eraLabel: "المدن الفلسطينية", type: "مدينة", color: "#D4537E", title: "الرملة واللد — المدينتان المنسيتان", desc: "التهجير وما تبقى من الهوية", date: "منذ الأزل", cat: "مجتمع" },
  { era: "cities", eraLabel: "المدن الفلسطينية", type: "مدينة", color: "#D4537E", title: "بئر السبع — بوابة النقب", desc: "البدو والصحراء والتهجير", date: "منذ الأزل", cat: "مجتمع" },
  { era: "cities", eraLabel: "المدن الفلسطينية", type: "مدينة", color: "#D4537E", title: "عكا — قلعة الصامدين", desc: "من الصليبيين إلى نابليون إلى اليوم", date: "منذ الأزل", cat: "مجتمع" },
  { era: "cities", eraLabel: "المدن الفلسطينية", type: "مدينة", color: "#D4537E", title: "صفد — مدينة الصوفية", desc: "التاريخ الروحي ومجزرة ١٩٤٨", date: "منذ الأزل", cat: "مجتمع" },
  { era: "cities", eraLabel: "المدن الفلسطينية", type: "مدينة", color: "#D4537E", title: "طبريا — على ضفاف البحيرة", desc: "الجليل والبحيرة وصيادو السمك", date: "منذ الأزل", cat: "مجتمع" },
];
