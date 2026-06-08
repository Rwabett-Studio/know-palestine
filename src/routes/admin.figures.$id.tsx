import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { repo } from "@/lib/repo";
import {
  type Figure,
  type FigureField,
  type PublishStatus,
  FIELD_LABEL,
  FIELD_LABEL_EN,
} from "@/data/content";
import { consumePrefill } from "@/lib/prefill";
import { useLanguage } from "@/lib/i18n";
import {
  BiField,
  FormShell,
  ImageField,
  NumberInput,
  SelectInput,
  TextArea,
  TextInput,
} from "@/components/admin/fields";

export const Route = createFileRoute("/admin/figures/$id")({
  component: FigureEditor,
});

const empty: Figure = {
  id: "",
  name: "",
  field: "politics",
  bio: "",
  portrait: "",
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

function FigureEditor() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const { lang } = useLanguage();
  const tt = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const navigate = useNavigate();
  const [f, setF] = useState<Figure>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) {
      const pre = consumePrefill("figure");
      if (pre) setF((p) => ({ ...p, ...pre }));
      return;
    }
    repo.figures
      .get(id)
      .then((found) => found && setF(found))
      .catch((e) => setError(String(e.message ?? e)))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const set = <K extends keyof Figure>(k: K, v: Figure[K]) => setF((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setError(null);
    const finalId = isNew ? f.id.trim() || slugify(f.nameEn || f.name) : f.id;
    if (!finalId) {
      setError(tt("المعرّف (id) مطلوب.", "An id is required."));
      return;
    }
    if (!f.name.trim()) {
      setError(tt("الاسم بالعربية مطلوب.", "Arabic name is required."));
      return;
    }
    setSaving(true);
    try {
      await repo.figures.upsert({ ...f, id: finalId });
      navigate({ to: "/admin/figures" });
    } catch (e) {
      setError(String((e as Error).message ?? e));
      setSaving(false);
    }
  };

  const del = async () => {
    if (!confirm(tt("تأكيد حذف هذه الشخصية؟", "Delete this figure?"))) return;
    try {
      await repo.figures.remove(f.id);
      navigate({ to: "/admin/figures" });
    } catch (e) {
      setError(String((e as Error).message ?? e));
    }
  };

  if (loading) return <p className="text-text-secondary text-sm">{tt("جارٍ التحميل...", "Loading...")}</p>;

  const fieldOpts = (Object.keys(FIELD_LABEL) as FigureField[]).map((v) => ({
    value: v,
    label: lang === "ar" ? FIELD_LABEL[v] : FIELD_LABEL_EN[v],
  }));
  const publishStatusOpts = PUBLISH_STATUS_OPTS.map((o) => ({ value: o.value, label: tt(o.ar, o.en) }));

  return (
    <FormShell
      dir={dir}
      tt={tt}
      saving={saving}
      onSubmit={save}
      onDelete={isNew ? undefined : del}
      title={isNew ? tt("شخصية جديدة", "New figure") : tt("تعديل شخصية", "Edit figure")}
      backTo={
        <Link to="/admin/figures" className="text-sm text-text-secondary hover:text-text-primary">
          {tt("← الشخصيات", "← Figures")}
        </Link>
      }
    >
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-[10px] px-4 py-3">{error}</p>}

      {isNew && (
        <TextInput
          label={tt("المعرّف (id) — بالإنجليزية بدون مسافات", "Slug id — lowercase, no spaces")}
          value={f.id}
          onChange={(v) => set("id", v)}
          hint={tt("يُترك فارغاً ليُولّد تلقائياً من الاسم.", "Leave empty to auto-generate from the name.")}
        />
      )}

      <BiField
        ar={<TextInput label={tt("الاسم (عربي)", "Name (AR)")} value={f.name} onChange={(v) => set("name", v)} />}
        en={<TextInput label={tt("الاسم (إنجليزي)", "Name (EN)")} value={f.nameEn ?? ""} onChange={(v) => set("nameEn", v)} />}
      />

      <div className="grid md:grid-cols-2 gap-4">
        <NumberInput label={tt("سنة الميلاد", "Birth year")} value={f.birthYear} onChange={(v) => set("birthYear", v)} />
        <NumberInput label={tt("سنة الوفاة", "Death year")} value={f.deathYear} onChange={(v) => set("deathYear", v)} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <SelectInput label={tt("المجال", "Field")} value={f.field} onChange={(v) => set("field", v)} options={fieldOpts} />
        <TextInput label={tt("مدينة الميلاد", "Birth city")} value={f.birthCity ?? ""} onChange={(v) => set("birthCity", v)} />
        <SelectInput label={tt("حالة النشر", "Publish status")} value={f.publishStatus ?? "published"} onChange={(v) => set("publishStatus", v)} options={publishStatusOpts} />
      </div>

      <BiField
        ar={<TextArea label={tt("السيرة (عربي)", "Bio (AR)")} value={f.bio} onChange={(v) => set("bio", v)} />}
        en={<TextArea label={tt("السيرة (إنجليزي)", "Bio (EN)")} value={f.bioEn ?? ""} onChange={(v) => set("bioEn", v)} />}
      />

      <ImageField
        label={tt("صورة الشخصية", "Portrait")}
        value={f.portrait}
        onChange={(v) => set("portrait", v)}
        genContext={{
          title: f.nameEn || f.name || "",
          description: f.bioEn?.slice(0, 200) || f.bio?.slice(0, 200) || "",
          kind: "figure",
        }}
        tt={tt}
      />
    </FormShell>
  );
}
