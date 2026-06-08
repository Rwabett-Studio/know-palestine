import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { repo } from "@/lib/repo";
import type { Article } from "@/data/content";
import { parseArticlesFile } from "@/lib/import-articles";
import { isWordFile, parseWordFile } from "@/lib/import-word";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/admin/articles/import")({
  component: ImportArticles,
});

const TEMPLATE_HEADERS = [
  "id",
  "title",
  "title_en",
  "excerpt",
  "excerpt_en",
  "category",
  "author",
  "date",
  "image",
  "reading_time",
  "body",
  "body_en",
];

function downloadTemplate() {
  const sample = [
    "",
    "عنوان المقال",
    "Article title",
    "مقتطف قصير",
    "Short excerpt",
    "report",
    "اسم الكاتب",
    "2 يونيو 2026",
    "https://example.com/image.jpg",
    "5",
    "## مقدمة\nالفقرة الأولى من المقال.\n\nالفقرة الثانية.",
    "## Intro\nFirst paragraph.\n\nSecond paragraph.",
  ];
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const csv = [TEMPLATE_HEADERS.map(esc).join(","), sample.map(esc).join(",")].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "articles-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function ImportArticles() {
  const { lang, pick } = useLanguage();
  const tt = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const navigate = useNavigate();

  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState<Article[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState<number | null>(null);
  const [fatal, setFatal] = useState<string | null>(null);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    setParsing(true);
    setFatal(null);
    setDone(null);
    setParsed([]);
    setErrors([]);
    try {
      if (isWordFile(file.name)) {
        const { article, errors } = await parseWordFile(file);
        setParsed(article ? [article] : []);
        setErrors(errors);
      } else {
        const { articles, errors } = await parseArticlesFile(file);
        setParsed(articles);
        setErrors(errors);
      }
    } catch (e) {
      setFatal(tt("تعذّر قراءة الملف. تأكد أنه Excel أو CSV أو Word صالح.", "Could not read the file. Make sure it is a valid Excel, CSV or Word file."));
      console.error(e);
    } finally {
      setParsing(false);
    }
  };

  const runImport = async () => {
    if (parsed.length === 0) return;
    setImporting(true);
    setFatal(null);
    try {
      await repo.articles.upsertMany(parsed);
      setDone(parsed.length);
    } catch (e) {
      setFatal(String((e as Error).message ?? e));
    } finally {
      setImporting(false);
    }
  };

  return (
    <div dir={dir} className="max-w-3xl">
      <div className="mb-6">
        <Link to="/admin/articles" className="text-sm text-text-secondary hover:text-text-primary">
          {tt("← المقالات", "← Articles")}
        </Link>
        <h1 className="text-2xl font-bold text-text-primary mt-1">
          {tt("استيراد مقالات", "Import articles")}
        </h1>
        <p className="mt-2 text-sm text-text-secondary leading-7">
          {tt(
            "ارفع ملف Excel (.xlsx) أو CSV (كل صف = مقال)، أو ملف Word (.docx / .doc) فيتحوّل المستند كاملاً إلى مقال واحد (أول عنوان = العنوان، والفقرات = المحتوى). الأعمدة المدعومة في Excel/CSV: العنوان (مطلوب)، القسم، المقتطف، الكاتب، التاريخ، الصورة، مدة القراءة، المحتوى — بالعربية والإنجليزية.",
            "Upload an Excel (.xlsx) or CSV file (each row = one article), or a Word file (.docx / .doc) — the whole document becomes a single article (first heading = title, paragraphs = body). Supported Excel/CSV columns: title (required), category, excerpt, author, date, image, reading_time, body — in Arabic and English.",
          )}
        </p>
        <button
          type="button"
          onClick={downloadTemplate}
          className="mt-3 h-9 px-3 rounded-[10px] text-sm bg-surface hover:bg-accent-warm"
        >
          {tt("⬇ تنزيل قالب CSV", "⬇ Download CSV template")}
        </button>
      </div>

      <label className="block rounded-[16px] border-2 border-dashed border-border p-8 text-center cursor-pointer hover:bg-surface/40">
        <input
          type="file"
          accept=".xlsx,.xls,.csv,.docx,.doc"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <span className="text-sm text-text-secondary">
          {fileName
            ? tt(`الملف: ${fileName}`, `File: ${fileName}`)
            : tt("اضغط لاختيار ملف Excel أو CSV أو Word", "Click to choose an Excel, CSV or Word file")}
        </span>
      </label>

      {parsing && <p className="mt-4 text-sm text-text-secondary">{tt("جارٍ القراءة...", "Reading...")}</p>}
      {fatal && <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-[10px] px-4 py-3">{fatal}</p>}

      {errors.length > 0 && (
        <div className="mt-4 text-sm text-amber-700 bg-amber-50 rounded-[10px] px-4 py-3 space-y-1">
          {errors.map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </div>
      )}

      {done !== null && (
        <div className="mt-4 text-sm text-green-700 bg-green-50 rounded-[10px] px-4 py-3 flex items-center justify-between">
          <span>{tt(`تم استيراد ${done} مقالاً بنجاح.`, `Imported ${done} articles successfully.`)}</span>
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/articles" })}
            className="h-8 px-3 rounded-[8px] bg-text-primary text-background text-xs"
          >
            {tt("عرض المقالات", "View articles")}
          </button>
        </div>
      )}

      {parsed.length > 0 && done === null && (
        <>
          <div className="mt-6 flex items-center justify-between">
            <h2 className="font-medium text-text-primary">
              {tt(`معاينة (${parsed.length} مقال)`, `Preview (${parsed.length} articles)`)}
            </h2>
            <button
              type="button"
              onClick={runImport}
              disabled={importing}
              className="h-10 px-5 rounded-[10px] bg-text-primary text-background text-sm font-medium hover:opacity-90 disabled:opacity-60"
            >
              {importing
                ? tt("جارٍ الاستيراد...", "Importing...")
                : tt(`استيراد ${parsed.length} مقال`, `Import ${parsed.length} articles`)}
            </button>
          </div>
          <ul className="mt-3 divide-y divide-border rounded-[16px] border border-border overflow-hidden">
            {parsed.map((a, i) => (
              <li key={i} className="flex items-center gap-4 p-3">
                {a.image ? (
                  <img src={a.image} alt="" className="w-12 h-12 rounded-[10px] object-cover bg-placeholder shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-[10px] bg-placeholder shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary truncate">{pick(a, "title")}</p>
                  <p className="text-xs text-text-secondary truncate">
                    {a.id} · {a.category} · {a.body.length} {tt("فقرة", "blocks")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
