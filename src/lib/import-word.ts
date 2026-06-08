import mammoth from "mammoth";
import type { Article } from "@/data/content";

// Word-document import: one file → one Article.
// .docx is read accurately with mammoth (headings + paragraphs preserved).
// Legacy binary .doc is extracted best-effort (results may be imperfect).

export interface WordParseResult {
  article: Article | null;
  errors: string[];
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9؀-ۿ]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Block = { heading?: string; paragraph: string };

// Short plain-text excerpt from the first real paragraph (~180 chars, word-safe).
function makeExcerpt(body: Block[]): string {
  const first = body.find((b) => b.paragraph.trim())?.paragraph.trim() ?? "";
  if (first.length <= 180) return first;
  const cut = first.slice(0, 180);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut) + "…";
}

function buildArticle(title: string, body: Block[], fileName: string): Article {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const safeTitle = title.trim() || baseName;
  return {
    id: slugify(safeTitle) || slugify(baseName) || `doc-${Date.now()}`,
    title: safeTitle,
    excerpt: makeExcerpt(body),
    date: "",
    image: "",
    category: "report",
    body,
  };
}

// Convert mammoth HTML output into a title + body blocks.
function htmlToArticle(html: string, fileName: string): WordParseResult {
  const errors: string[] = [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const nodes = Array.from(doc.body.children);

  let title = "";
  const body: Block[] = [];
  let pendingHeading: string | undefined;

  for (const el of nodes) {
    const tag = el.tagName.toLowerCase();
    const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();

    if (tag === "ul" || tag === "ol") {
      const items = Array.from(el.querySelectorAll("li"))
        .map((li) => (li.textContent ?? "").replace(/\s+/g, " ").trim())
        .filter(Boolean);
      for (const it of items) {
        body.push({ heading: pendingHeading, paragraph: `• ${it}` });
        pendingHeading = undefined;
      }
      continue;
    }

    if (!text) continue;

    if (/^h[1-6]$/.test(tag)) {
      if (!title) {
        title = text; // first heading becomes the article title
        continue;
      }
      pendingHeading = text;
      continue;
    }

    // paragraphs and everything else
    if (!title) {
      title = text; // fallback: first non-empty line is the title
      continue;
    }
    body.push({ heading: pendingHeading, paragraph: text });
    pendingHeading = undefined;
  }

  if (pendingHeading) body.push({ heading: pendingHeading, paragraph: "" });

  if (!title && body.length === 0) {
    errors.push("الملف لا يحتوي على نص قابل للقراءة.");
    return { article: null, errors };
  }

  return { article: buildArticle(title, body, fileName), errors };
}

// Best-effort text extraction from a legacy binary .doc file.
// Word 97–2003 stores body text as UTF-16LE inside a compound stream; we decode
// then keep only Arabic/Latin/digit runs and drop binary noise.
function extractLegacyText(buf: ArrayBuffer): string {
  const raw = new TextDecoder("utf-16le", { fatal: false }).decode(new Uint8Array(buf));
  return raw
    .replace(/\r\n?/g, "\n")
    .replace(/[^؀-ۿݐ-ݿ -~\n\t]+/g, " ")
    .split("\n")
    .map((l) => l.replace(/[ \t]{2,}/g, " ").trim())
    .filter((l) => l.length > 1)
    .join("\n")
    .trim();
}

function textToArticle(text: string, fileName: string): WordParseResult {
  const errors: string[] = [];
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) {
    errors.push("تعذّر استخراج نص من ملف .doc. جرّب حفظه بصيغة .docx.");
    return { article: null, errors };
  }
  const title = lines[0];
  const body: Block[] = lines.slice(1).map((p) => ({ paragraph: p }));
  return { article: buildArticle(title, body, fileName), errors };
}

export async function parseWordFile(file: File): Promise<WordParseResult> {
  const lower = file.name.toLowerCase();
  const buf = await file.arrayBuffer();

  if (lower.endsWith(".docx")) {
    const { value } = await mammoth.convertToHtml({ arrayBuffer: buf });
    return htmlToArticle(value, file.name);
  }

  // Legacy .doc — extract best-effort and warn.
  const result = textToArticle(extractLegacyText(buf), file.name);
  return {
    article: result.article,
    errors: [
      "ملفات .doc القديمة تُقرأ بشكل تقريبي وقد يحتاج النص لمراجعة. للحصول على أفضل نتيجة احفظ الملف بصيغة .docx.",
      ...result.errors,
    ],
  };
}

// True for files this module can handle.
export function isWordFile(name: string): boolean {
  const n = name.toLowerCase();
  return n.endsWith(".docx") || n.endsWith(".doc");
}
