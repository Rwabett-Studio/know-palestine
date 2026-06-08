import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { repo } from "@/lib/repo";
import {
  type EventType,
  type HistoryEvent,
  type PublishStatus,
  EVENT_TYPE_LABEL,
  EVENT_TYPE_LABEL_EN,
} from "@/data/content";
import { consumePrefill } from "@/lib/prefill";
import { useLanguage } from "@/lib/i18n";
import {
  BiField,
  FormShell,
  ImageField,
  LinesArea,
  SelectInput,
  TextArea,
  TextInput,
} from "@/components/admin/fields";

export const Route = createFileRoute("/admin/history/$id")({
  component: HistoryEditor,
});

const empty: HistoryEvent = {
  id: "",
  title: "",
  eventDate: "",
  isoDate: "",
  eventType: "milestone",
  description: "",
  image: "",
  publishStatus: "published",
};

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

function HistoryEditor() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const { lang } = useLanguage();
  const tt = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const navigate = useNavigate();
  const [h, setH] = useState<HistoryEvent>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) {
      const pre = consumePrefill("history");
      if (pre) setH((p) => ({ ...p, ...pre }));
      return;
    }
    repo.history
      .get(id)
      .then((found) => found && setH(found))
      .catch((e) => setError(String(e.message ?? e)))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const set = <K extends keyof HistoryEvent>(k: K, v: HistoryEvent[K]) =>
    setH((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setError(null);
    const finalId = isNew ? h.id.trim() || slugify(h.titleEn || h.title) : h.id;
    if (!finalId) {
      setError(tt("المعرّف (id) مطلوب.", "An id is required."));
      return;
    }
    if (!h.title.trim()) {
      setError(tt("العنوان بالعربية مطلوب.", "Arabic title is required."));
      return;
    }
    setSaving(true);
    try {
      await repo.history.upsert({ ...h, id: finalId });
      navigate({ to: "/admin/history" });
    } catch (e) {
      setError(String((e as Error).message ?? e));
      setSaving(false);
    }
  };

  const del = async () => {
    if (!confirm(tt("تأكيد حذف هذا الحدث؟", "Delete this event?"))) return;
    try {
      await repo.history.remove(h.id);
      navigate({ to: "/admin/history" });
    } catch (e) {
      setError(String((e as Error).message ?? e));
    }
  };

  if (loading) return <p className="text-text-secondary text-sm">{tt("جارٍ التحميل...", "Loading...")}</p>;

  const typeOpts = (Object.keys(EVENT_TYPE_LABEL) as EventType[]).map((v) => ({
    value: v,
    label: lang === "ar" ? EVENT_TYPE_LABEL[v] : EVENT_TYPE_LABEL_EN[v],
  }));
  const publishStatusOpts = PUBLISH_STATUS_OPTS.map((o) => ({ value: o.value, label: tt(o.ar, o.en) }));

  return (
    <FormShell
      dir={dir}
      tt={tt}
      saving={saving}
      onSubmit={save}
      onDelete={isNew ? undefined : del}
      title={isNew ? tt("حدث جديد", "New event") : tt("تعديل حدث", "Edit event")}
      backTo={
        <Link to="/admin/history" className="text-sm text-text-secondary hover:text-text-primary">
          {tt("← الأحداث", "← History")}
        </Link>
      }
    >
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-[10px] px-4 py-3">{error}</p>}

      {isNew && (
        <TextInput
          label={tt("المعرّف (id) — بالإنجليزية بدون مسافات", "Slug id — lowercase, no spaces")}
          value={h.id}
          onChange={(v) => set("id", v)}
          hint={tt("يُترك فارغاً ليُولّد تلقائياً من العنوان.", "Leave empty to auto-generate from the title.")}
        />
      )}

      <BiField
        ar={<TextInput label={tt("العنوان (عربي)", "Title (AR)")} value={h.title} onChange={(v) => set("title", v)} />}
        en={<TextInput label={tt("العنوان (إنجليزي)", "Title (EN)")} value={h.titleEn ?? ""} onChange={(v) => set("titleEn", v)} />}
      />

      <div className="grid md:grid-cols-3 gap-4">
        <SelectInput label={tt("نوع الحدث", "Event type")} value={h.eventType} onChange={(v) => set("eventType", v)} options={typeOpts} />
        <TextInput
          label={tt("التاريخ ISO (YYYY-MM-DD)", "ISO date (YYYY-MM-DD)")}
          value={h.isoDate}
          onChange={(v) => set("isoDate", v)}
          hint={tt("يُستخدم للترتيب الزمني.", "Used for chronological ordering.")}
        />
        <SelectInput label={tt("حالة النشر", "Publish status")} value={h.publishStatus ?? "published"} onChange={(v) => set("publishStatus", v)} options={publishStatusOpts} />
      </div>

      <BiField
        ar={<TextInput label={tt("التاريخ المعروض (عربي)", "Display date (AR)")} value={h.eventDate} onChange={(v) => set("eventDate", v)} />}
        en={<TextInput label={tt("التاريخ المعروض (إنجليزي)", "Display date (EN)")} value={h.eventDateEn ?? ""} onChange={(v) => set("eventDateEn", v)} />}
      />

      <BiField
        ar={<TextArea label={tt("الوصف (عربي)", "Description (AR)")} value={h.description} onChange={(v) => set("description", v)} />}
        en={<TextArea label={tt("الوصف (إنجليزي)", "Description (EN)")} value={h.descriptionEn ?? ""} onChange={(v) => set("descriptionEn", v)} />}
      />

      <ImageField
        label={tt("الصورة", "Image")}
        value={h.image}
        onChange={(v) => set("image", v)}
        genContext={{
          title: h.titleEn || h.title || "",
          description: h.descriptionEn?.slice(0, 200) || h.description?.slice(0, 200) || "",
          kind: "history",
        }}
        tt={tt}
      />
      <TextInput label={tt("المدينة المرتبطة (id)", "Related city (id)")} value={h.relatedCity ?? ""} onChange={(v) => set("relatedCity", v)} />

      <BiField
        ar={<LinesArea label={tt("المصادر (عربي)", "Sources (AR)")} value={h.sources ?? []} onChange={(v) => set("sources", v)} />}
        en={<LinesArea label={tt("المصادر (إنجليزي)", "Sources (EN)")} value={h.sourcesEn ?? []} onChange={(v) => set("sourcesEn", v)} />}
      />
    </FormShell>
  );
}
