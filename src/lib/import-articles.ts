import * as XLSX from "xlsx";
import type { Article } from "@/data/content";

// Bulk-import helper: reads an .xlsx / .xls / .csv file and maps each row to an Article.
// Column headers are matched case-insensitively and accept Arabic or English names.

export const CATEGORY_VALUES: Article["category"][] = [
  "dreams",
  "alaqsa",
  "investigation",
  "report",
];

// Maps a header cell -> canonical Article field. Accepts Arabic + English aliases.
const HEADER_ALIASES: Record<string, string> = {
  id: "id",
  slug: "id",
  "المعرف": "id",

  title: "title",
  "العنوان": "title",
  "العنوان (عربي)": "title",
  title_en: "titleEn",
  titleen: "titleEn",
  "العنوان (انجليزي)": "titleEn",
  "العنوان (إنجليزي)": "titleEn",

  excerpt: "excerpt",
  "المقتطف": "excerpt",
  "مقتطف": "excerpt",
  excerpt_en: "excerptEn",
  excerpten: "excerptEn",

  category: "category",
  "القسم": "category",
  "التصنيف": "category",

  author: "author",
  "الكاتب": "author",
  author_en: "authorEn",
  authoren: "authorEn",

  date: "date",
  "التاريخ": "date",
  date_en: "dateEn",
  dateen: "dateEn",

  image: "image",
  "الصورة": "image",
  "رابط الصورة": "image",

  reading_time: "readingTime",
  readingtime: "readingTime",
  "مدة القراءة": "readingTime",

  body: "body",
  "المحتوى": "body",
  "النص": "body",
  body_en: "bodyEn",
  bodyen: "bodyEn",
  "المحتوى (انجليزي)": "bodyEn",
  "المحتوى (إنجليزي)": "bodyEn",
};

// Arabic category labels -> canonical value.
const CATEGORY_ALIASES: Record<string, Article["category"]> = {
  dreams: "dreams",
  "أحلام": "dreams",
  "أحلام لن تتحقق": "dreams",
  alaqsa: "alaqsa",
  "الأقصى": "alaqsa",
  "طوفان الأقصى": "alaqsa",
  investigation: "investigation",
  "تحقيق": "investigation",
  "تحقيقات": "investigation",
  report: "report",
  "تقرير": "report",
  "تقارير": "report",
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9؀-ۿ]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// "## heading\nparagraph" blocks separated by blank lines -> {heading?, paragraph}[].
function parseBody(raw: string): { heading?: string; paragraph: string }[] {
  if (!raw.trim()) return [];
  return raw
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n");
      if (lines[0].startsWith("#")) {
        const heading = lines[0].replace(/^#+\s*/, "").trim();
        const paragraph = lines.slice(1).join("\n").trim();
        return paragraph ? { heading, paragraph } : { paragraph: heading };
      }
      return { paragraph: block };
    });
}

export interface ParseResult {
  articles: Article[];
  errors: string[];
}

function mapRow(raw: Record<string, unknown>, index: number, errors: string[]): Article | null {
  const o: Record<string, string> = {};
  for (const [key, val] of Object.entries(raw)) {
    const canonical = HEADER_ALIASES[key.trim().toLowerCase()];
    if (canonical) o[canonical] = val == null ? "" : String(val).trim();
  }

  const rowNo = index + 2; // +1 header row, +1 for 1-based display
  if (!o.title) {
    errors.push(`صف ${rowNo}: العنوان مفقود — تم تجاهله.`);
    return null;
  }

  let category: Article["category"] = "report";
  if (o.category) {
    const c = CATEGORY_ALIASES[o.category.toLowerCase()] ?? CATEGORY_ALIASES[o.category];
    if (c) category = c;
    else errors.push(`صف ${rowNo}: قسم غير معروف "${o.category}" — تم استخدام "تقرير".`);
  }

  const readingTime = o.readingTime ? Number(o.readingTime) : undefined;

  return {
    id: o.id || slugify(o.titleEn || o.title),
    title: o.title,
    titleEn: o.titleEn || undefined,
    excerpt: o.excerpt || "",
    excerptEn: o.excerptEn || undefined,
    date: o.date || "",
    dateEn: o.dateEn || undefined,
    image: o.image || "",
    category,
    author: o.author || undefined,
    authorEn: o.authorEn || undefined,
    readingTime: Number.isFinite(readingTime) ? readingTime : undefined,
    body: parseBody(o.body || ""),
    bodyEn: o.bodyEn ? parseBody(o.bodyEn) : undefined,
  };
}

export async function parseArticlesFile(file: File): Promise<ParseResult> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

  const errors: string[] = [];
  const articles: Article[] = [];
  rows.forEach((r, i) => {
    const a = mapRow(r, i, errors);
    if (a) articles.push(a);
  });

  // Flag duplicate ids within the same file.
  const seen = new Map<string, number>();
  articles.forEach((a, i) => {
    if (seen.has(a.id)) errors.push(`صف ${i + 2}: معرّف مكرر "${a.id}".`);
    seen.set(a.id, i);
  });

  return { articles, errors };
}
