import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  SUGGESTED_TOPICS,
  editorKindFor,
  type EditorKind,
  type SuggestedEra,
  type SuggestedTopic,
  type SuggestedType,
} from "@/data/suggested-topics";
import { setPrefill } from "@/lib/prefill";
import { generateContent } from "@/lib/api/generate.functions";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/admin/suggested")({
  component: SuggestedTopicsPage,
});

const TYPE_COLORS: Record<SuggestedType, { bg: string; c: string }> = {
  حدث: { bg: "rgba(234,243,222,.8)", c: "#27500A" },
  شخصية: { bg: "rgba(230,241,251,.8)", c: "#0C447C" },
  معاهدة: { bg: "rgba(250,238,218,.8)", c: "#633806" },
  مجتمع: { bg: "rgba(225,245,238,.8)", c: "#085041" },
  مدينة: { bg: "rgba(251,234,240,.8)", c: "#72243E" },
};

const EDITOR_ROUTE: Record<EditorKind, string> = {
  city: "/admin/cities/$id",
  figure: "/admin/figures/$id",
  history: "/admin/history/$id",
  article: "/admin/articles/$id",
};

// Arabic display name with the "— subtitle" suffix stripped (for city/figure names).
const baseName = (title: string) => title.split(/[—–-]/)[0].trim();

function eventTypeFor(t: SuggestedTopic): "nakba" | "war" | "uprising" | "milestone" {
  if (t.era === "nakba" && t.cat === "عسكري") return "nakba";
  if (t.cat === "عسكري") return "war";
  return "milestone";
}

// Metadata-only payload (no AI) for the "Fill" button.
function metadataPrefill(t: SuggestedTopic, kind: EditorKind): Record<string, unknown> {
  switch (kind) {
    case "city":
      return { name: baseName(t.title), brief: t.desc, date: t.date };
    case "figure":
      return { name: baseName(t.title), bio: t.desc };
    case "history":
      return { title: t.title, eventDate: t.date, description: t.desc, eventType: eventTypeFor(t) };
    default:
      return { title: t.title, excerpt: t.desc, date: t.date };
  }
}

// Base Arabic fields merged under AI output (the model returns *En + structured fields).
function aiBaseFields(t: SuggestedTopic, kind: EditorKind): Record<string, unknown> {
  switch (kind) {
    case "city":
      return { name: baseName(t.title), date: t.date };
    case "figure":
      return { name: baseName(t.title) };
    case "history":
      return { title: t.title, eventDate: t.date };
    default:
      return { title: t.title, date: t.date };
  }
}

function SuggestedTopicsPage() {
  const { lang } = useLanguage();
  const tt = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const navigate = useNavigate();

  const [activeEra, setActiveEra] = useState<SuggestedEra | "all">("all");
  const [done, setDone] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const eras = useMemo(() => {
    const seen: { era: SuggestedEra; label: string; color: string }[] = [];
    for (const t of SUGGESTED_TOPICS) {
      if (!seen.some((e) => e.era === t.era)) seen.push({ era: t.era, label: t.eraLabel, color: t.color });
    }
    return seen;
  }, []);

  const groups = useMemo(() => {
    const list = activeEra === "all" ? SUGGESTED_TOPICS : SUGGESTED_TOPICS.filter((t) => t.era === activeEra);
    const map = new Map<SuggestedEra, { label: string; color: string; items: SuggestedTopic[] }>();
    for (const t of list) {
      if (!map.has(t.era)) map.set(t.era, { label: t.eraLabel, color: t.color, items: [] });
      map.get(t.era)!.items.push(t);
    }
    return [...map.values()];
  }, [activeEra]);

  const goToEditor = (kind: EditorKind) =>
    navigate({ to: EDITOR_ROUTE[kind], params: { id: "new" } });

  const onFill = (t: SuggestedTopic) => {
    const kind = editorKindFor(t.type);
    setPrefill(kind, metadataPrefill(t, kind) as never);
    goToEditor(kind);
  };

  const onGenerate = async (t: SuggestedTopic) => {
    const kind = editorKindFor(t.type);
    setError(null);
    setGenerating(t.title);
    try {
      const result = await generateContent({
        data: { title: t.title, desc: t.desc, date: t.date, era: t.era, kind },
      });
      setPrefill(kind, { ...aiBaseFields(t, kind), ...(result.data as object) } as never);
      setDone((prev) => new Set(prev).add(t.title));
      goToEditor(kind);
    } catch (e) {
      setError(String((e as Error).message ?? e));
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div dir={dir}>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">{tt("مواضيع مقترحة", "Suggested topics")}</h1>
        <p className="mt-2 text-sm text-text-secondary leading-7 max-w-2xl">
          {tt(
            "اختر موضوعاً جاهزاً. «ملء» يفتح المحرّر المناسب مع تعبئة العنوان والوصف، و«⚡ توليد بالذكاء الاصطناعي» يكتب المحتوى كاملاً بالعربية والإنجليزية ثم يفتح المحرّر للمراجعة قبل الحفظ.",
            "Pick a ready-made topic. \"Fill\" opens the matching editor pre-filled with the title and description; \"⚡ Generate with AI\" writes the full bilingual content, then opens the editor for review before saving.",
          )}
        </p>
      </header>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 rounded-[10px] px-4 py-3">{error}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveEra("all")}
          className={`h-8 px-3 rounded-full text-xs font-medium border transition-colors ${
            activeEra === "all"
              ? "bg-text-primary text-background border-text-primary"
              : "bg-surface text-text-secondary border-border hover:bg-accent-warm"
          }`}
        >
          {tt("الكل", "All")}
        </button>
        {eras.map((e) => (
          <button
            key={e.era}
            type="button"
            onClick={() => setActiveEra(e.era)}
            className={`h-8 px-3 rounded-full text-xs font-medium border transition-colors ${
              activeEra === e.era
                ? "text-background border-transparent"
                : "bg-surface text-text-secondary border-border hover:bg-accent-warm"
            }`}
            style={activeEra === e.era ? { background: e.color } : undefined}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {groups.map((g) => (
          <section key={g.label}>
            <h2 className="text-sm font-bold mb-3" style={{ color: g.color }}>
              {g.label}
            </h2>
            <ul className="divide-y divide-border rounded-[16px] border border-border overflow-hidden">
              {g.items.map((t) => {
                const tc = TYPE_COLORS[t.type];
                const isDone = done.has(t.title);
                const isGen = generating === t.title;
                return (
                  <li key={t.title} className="flex items-center gap-3 p-3 bg-background">
                    <span
                      className="shrink-0 text-xs font-medium px-2.5 h-7 leading-7 rounded-full"
                      style={{ background: tc.bg, color: tc.c }}
                    >
                      {t.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-primary truncate">{t.title}</p>
                      <p className="text-xs text-text-secondary truncate">
                        {t.desc} — {t.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onFill(t)}
                        className="h-9 px-3 rounded-[8px] text-sm bg-surface hover:bg-accent-warm"
                        title={tt("فتح المحرّر مع تعبئة العنوان والوصف", "Open editor pre-filled")}
                      >
                        {tt("ملء", "Fill")}
                      </button>
                      <button
                        type="button"
                        onClick={() => onGenerate(t)}
                        disabled={isGen || generating !== null}
                        className="h-9 px-3 rounded-[8px] text-sm bg-text-primary text-background hover:opacity-90 disabled:opacity-50"
                      >
                        {isGen
                          ? tt("جارٍ التوليد...", "Generating...")
                          : isDone
                            ? tt("⚡ أعد التوليد", "⚡ Regenerate")
                            : tt("⚡ توليد", "⚡ Generate")}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
