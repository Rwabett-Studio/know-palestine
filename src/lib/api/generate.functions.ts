import { createServerFn } from "@tanstack/react-start";
import process from "node:process";
import { z } from "zod";

// AI content generation for the admin "Suggested Topics" page.
// Runs server-only: the API key is read from process.env inside the handler
// and NEVER reaches the browser. On Cloudflare Workers set ANTHROPIC_API_KEY
// as a Worker secret; locally add it to .env (no VITE_ prefix).

const InputSchema = z.object({
  title: z.string().min(1),
  desc: z.string().default(""),
  date: z.string().default(""),
  era: z.string().default(""),
  // Which editor the generated content targets.
  kind: z.enum(["city", "figure", "history", "article"]),
});

export type GenerateInput = z.infer<typeof InputSchema>;

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

// Per-kind JSON contract handed to the model. Enum values must match
// src/data/content.ts so the editors accept them directly.
const SCHEMA_BY_KIND: Record<GenerateInput["kind"], string> = {
  article: `{
  "titleEn": "English title",
  "excerpt": "مقتطف عربي من جملة أو جملتين",
  "excerptEn": "One-to-two sentence English excerpt",
  "category": one of "dreams" | "alaqsa" | "investigation" | "report",
  "readingTime": estimated minutes as a number,
  "body": [{ "heading": "عنوان فرعي (اختياري)", "paragraph": "فقرة عربية" }, ...],
  "bodyEn": [{ "heading": "optional subheading", "paragraph": "English paragraph" }, ...]
}`,
  city: `{
  "nameEn": "English city name",
  "region": one of "west_bank" | "gaza" | "48_territories" | "jerusalem",
  "status": one of "existing" | "destroyed" | "partially_destroyed" | "occupied",
  "brief": "نبذة عربية قصيرة",
  "briefEn": "Short English brief",
  "shortDesc": "وصف عربي مختصر",
  "shortDescEn": "Short English description",
  "description": "وصف عربي مفصّل (عدة فقرات)",
  "descriptionEn": "Detailed English description",
  "geography": "الجغرافيا بالعربية",
  "geographyEn": "Geography in English",
  "history": "التاريخ بالعربية",
  "historyEn": "History in English",
  "highlights": ["معلم 1", "معلم 2"],
  "highlightsEn": ["highlight 1", "highlight 2"]
}`,
  figure: `{
  "nameEn": "English name",
  "field": one of "politics" | "literature" | "arts" | "science" | "resistance" | "religion" | "sports",
  "birthYear": number or null,
  "deathYear": number or null,
  "birthCity": "مدينة الميلاد بالعربية",
  "bio": "سيرة عربية مفصّلة (عدة فقرات)",
  "bioEn": "Detailed English biography"
}`,
  history: `{
  "titleEn": "English title",
  "eventType": one of "nakba" | "war" | "uprising" | "milestone",
  "isoDate": "YYYY-MM-DD (best estimate, used for ordering)",
  "eventDateEn": "Human-readable English date",
  "description": "وصف عربي مفصّل",
  "descriptionEn": "Detailed English description",
  "sources": ["مصدر عربي 1"],
  "sourcesEn": ["English source 1"]
}`,
};

function extractJson(text: string): unknown {
  // Models sometimes wrap JSON in ```json fences or prose — pull the object out.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in model output.");
  return JSON.parse(candidate.slice(start, end + 1));
}

export const generateContent = createServerFn({ method: "POST" })
  .inputValidator(InputSchema)
  .handler(async ({ data }) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "مفتاح الذكاء الاصطناعي غير مُعدّ. أضف ANTHROPIC_API_KEY إلى متغيّرات البيئة (أو أسرار Cloudflare Worker) لتفعيل التوليد التلقائي.",
      );
    }

    const schema = SCHEMA_BY_KIND[data.kind];
    const prompt = `أنت محرّر محتوى تاريخي متخصص في القضية الفلسطينية، تكتب بالعربية الفصحى وبالإنجليزية بدقة وحياد توثيقي.

الموضوع: "${data.title}"
الوصف المختصر: ${data.desc || "—"}
التاريخ/الحقبة: ${data.date || "—"}${data.era ? ` (${data.era})` : ""}

اكتب محتوى موثّقاً ودقيقاً تاريخياً لهذا الموضوع. أعد النتيجة ككائن JSON صالح فقط — بدون أي نص قبله أو بعده — بهذا الشكل بالضبط:

${schema}

قواعد:
- المحتوى العربي أساسي، والإنجليزي ترجمة وفية له.
- استخدم القيم المسموح بها فقط في الحقول التي تحتوي خيارات.
- لا تضع روابط صور.
- أعد JSON صالحاً فقط.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`تعذّر الاتصال بخدمة الذكاء الاصطناعي (${res.status}). ${detail.slice(0, 200)}`);
    }

    const payload = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = payload.content?.map((b) => b.text ?? "").join("") ?? "";
    const parsed = extractJson(text) as Record<string, Json>;

    return { kind: data.kind, data: parsed };
  });
