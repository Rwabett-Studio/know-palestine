import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { repo } from "@/lib/repo";
import type { Article, PublishStatus } from "@/data/content";
import { consumePrefill } from "@/lib/prefill";
import { useLanguage } from "@/lib/i18n";
import {
  BiField,
  BlockEditor,
  FormShell,
  ImageField,
  NumberInput,
  SelectInput,
  TextArea,
  TextInput,
} from "@/components/admin/fields";

export const Route = createFileRoute("/admin/articles/$id")({
  component: ArticleEditor,
});

const empty: Article = {
  id: "",
  title: "",
  excerpt: "",
  date: "",
  image: "",
  category: "report",
  body: [],
  publishStatus: "published",
};

const CATEGORY_OPTS: { value: Article["category"]; ar: string; en: string }[] = [
  { value: "dreams", ar: "أحلام", en: "Dreams" },
  { value: "alaqsa", ar: "الأقصى", en: "Al-Aqsa" },
  { value: "investigation", ar: "تحقيق", en: "Investigation" },
  { value: "report", ar: "تقرير", en: "Report" },
];

const PUBLISH_STATUS_OPTS: { value: PublishStatus; ar: string; en: string }[] = [
  { value: "published", ar: "منشور", en: "Published" },
  { value: "draft",     ar: "مسودة",  en: "Draft" },
  { value: "archived",  ar: "مؤرشف", en: "Archived" },
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9؀-ۿ]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ArticleEditor() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const { lang } = useLanguage();
  const tt = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const navigate = useNavigate();
  const [a, setA] = useState<Article>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) {
      const pre = consumePrefill("article");
      if (pre) setA((p) => ({ ...p, ...pre }));
      return;
    }
    repo.articles
      .get(id)
      .then((found) => found && setA(found))
      .catch((e) => setError(String(e.message ?? e)))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const set = <K extends keyof Article>(k: K, v: Article[K]) => setA((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setError(null);
    const finalId = isNew ? a.id.trim() || slugify(a.titleEn || a.title) : a.id;
    if (!finalId) {
      setError(tt("المعرّف (id) مطلوب.", "An id is required."));
      return;
    }
    if (!a.title.trim()) {
      setError(tt("العنوان بالعربية مطلوب.", "Arabic title is required."));
      return;
    }
    setSaving(true);
    try {
      await repo.articles.upsert({ ...a, id: finalId });
      navigate({ to: "/admin/articles" });
    } catch (e) {
      setError(String((e as Error).message ?? e));
      setSaving(false);
    }
  };

  const del = async () => {
    if (!confirm(tt("تأكيد حذف هذا المقال؟", "Delete this article?"))) return;
    try {
      await repo.articles.remove(a.id);
      navigate({ to: "/admin/articles" });
    } catch (e) {
      setError(String((e as Error).message ?? e));
    }
  };

  if (loading) return <p className="text-text-secondary text-sm">{tt("جارٍ التحميل...", "Loading...")}</p>;

  const categoryOpts = CATEGORY_OPTS.map((o) => ({ value: o.value, label: tt(o.ar, o.en) }));
  const publishStatusOpts = PUBLISH_STATUS_OPTS.map((o) => ({ value: o.value, label: tt(o.ar, o.en) }));

  return (
    <FormShell
      dir={dir}
      tt={tt}
      saving={saving}
      onSubmit={save}
      onDelete={isNew ? undefined : del}
      title={isNew ? tt("مقال جديد", "New article") : tt("تعديل مقال", "Edit article")}
      backTo={
        <Link to="/admin/articles" className="text-sm text-text-secondary hover:text-text-primary">
          {tt("← المقالات", "← Articles")}
        </Link>
      }
    >
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-[10px] px-4 py-3">{error}</p>}

      {isNew && (
        <TextInput
          label={tt("المعرّف (id) — بالإنجليزية بدون مسافات", "Slug id — lowercase, no spaces")}
          value={a.id}
          onChange={(v) => set("id", v)}
          hint={tt("يُترك فارغاً ليُولّد تلقائياً من العنوان.", "Leave empty to auto-generate from the title.")}
        />
      )}

      <BiField
        ar={<TextInput label={tt("العنوان (عربي)", "Title (AR)")} value={a.title} onChange={(v) => set("title", v)} />}
        en={<TextInput label={tt("العنوان (إنجليزي)", "Title (EN)")} value={a.titleEn ?? ""} onChange={(v) => set("titleEn", v)} />}
      />

      <div className="grid md:grid-cols-3 gap-4">
        <SelectInput label={tt("القسم", "Category")} value={a.category} onChange={(v) => set("category", v)} options={categoryOpts} />
        <NumberInput label={tt("مدة القراءة (دقائق)", "Reading time (min)")} value={a.readingTime} onChange={(v) => set("readingTime", v)} />
        <SelectInput label={tt("حالة النشر", "Publish status")} value={a.publishStatus ?? "published"} onChange={(v) => set("publishStatus", v)} options={publishStatusOpts} />
      </div>

      <BiField
        ar={<TextInput label={tt("الكاتب (عربي)", "Author (AR)")} value={a.author ?? ""} onChange={(v) => set("author", v)} />}
        en={<TextInput label={tt("الكاتب (إنجليزي)", "Author (EN)")} value={a.authorEn ?? ""} onChange={(v) => set("authorEn", v)} />}
      />

      <BiField
        ar={<TextArea label={tt("مقتطف (عربي)", "Excerpt (AR)")} value={a.excerpt} onChange={(v) => set("excerpt", v)} rows={2} />}
        en={<TextArea label={tt("مقتطف (إنجليزي)", "Excerpt (EN)")} value={a.excerptEn ?? ""} onChange={(v) => set("excerptEn", v)} rows={2} />}
      />

      <ImageField
        label={tt("الصورة", "Image")}
        value={a.image}
        onChange={(v) => set("image", v)}
        genContext={{
          title: a.titleEn || a.title || "",
          description: a.excerptEn || a.excerpt || "",
          kind: "article",
        }}
        tt={tt}
      />

      <BiField
        ar={<TextInput label={tt("التاريخ المعروض (عربي)", "Display date (AR)")} value={a.date} onChange={(v) => set("date", v)} />}
        en={<TextInput label={tt("التاريخ المعروض (إنجليزي)", "Display date (EN)")} value={a.dateEn ?? ""} onChange={(v) => set("dateEn", v)} />}
      />

      <BlockEditor label={tt("المحتوى (عربي)", "Body (AR)")} value={a.body} onChange={(v) => set("body", v)} tt={tt} />
      <BlockEditor label={tt("المحتوى (إنجليزي)", "Body (EN)")} value={a.bodyEn ?? []} onChange={(v) => set("bodyEn", v)} tt={tt} />
    </FormShell>
  );
}
