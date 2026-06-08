import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { repo } from "@/lib/repo";
import {
  type City,
  type CityRegion,
  type CityStatus,
  type PublishStatus,
  REGION_LABEL,
  REGION_LABEL_EN,
  STATUS_LABEL,
  STATUS_LABEL_EN,
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

export const Route = createFileRoute("/admin/cities/$id")({
  component: CityEditor,
});

const empty: City = {
  id: "",
  name: "",
  region: "west_bank",
  status: "existing",
  shortDesc: "",
  description: "",
  geography: "",
  history: "",
  natives: "",
  highlights: [],
  naming: "",
  zionistName: "",
  brief: "",
  image: "",
  date: "",
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

function CityEditor() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const { lang } = useLanguage();
  const tt = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const navigate = useNavigate();
  const [c, setC] = useState<City>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) {
      const pre = consumePrefill("city");
      if (pre) setC((p) => ({ ...p, ...pre }));
      return;
    }
    repo.cities
      .get(id)
      .then((found) => found && setC(found))
      .catch((e) => setError(String(e.message ?? e)))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const set = <K extends keyof City>(k: K, v: City[K]) => setC((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setError(null);
    const finalId = isNew ? c.id.trim() || slugify(c.nameEn || c.name) : c.id;
    if (!finalId) {
      setError(tt("المعرّف (id) مطلوب.", "An id is required."));
      return;
    }
    if (!c.name.trim()) {
      setError(tt("الاسم بالعربية مطلوب.", "Arabic name is required."));
      return;
    }
    setSaving(true);
    try {
      await repo.cities.upsert({ ...c, id: finalId });
      navigate({ to: "/admin/cities" });
    } catch (e) {
      setError(String((e as Error).message ?? e));
      setSaving(false);
    }
  };

  const del = async () => {
    if (!confirm(tt("تأكيد حذف هذه المدينة؟", "Delete this city?"))) return;
    try {
      await repo.cities.remove(c.id);
      navigate({ to: "/admin/cities" });
    } catch (e) {
      setError(String((e as Error).message ?? e));
    }
  };

  if (loading) return <p className="text-text-secondary text-sm">{tt("جارٍ التحميل...", "Loading...")}</p>;

  const regionOpts = (Object.keys(REGION_LABEL) as CityRegion[]).map((v) => ({
    value: v,
    label: lang === "ar" ? REGION_LABEL[v] : REGION_LABEL_EN[v],
  }));
  const statusOpts = (Object.keys(STATUS_LABEL) as CityStatus[]).map((v) => ({
    value: v,
    label: lang === "ar" ? STATUS_LABEL[v] : STATUS_LABEL_EN[v],
  }));
  const publishStatusOpts = PUBLISH_STATUS_OPTS.map((o) => ({ value: o.value, label: tt(o.ar, o.en) }));

  return (
    <FormShell
      dir={dir}
      tt={tt}
      saving={saving}
      onSubmit={save}
      onDelete={isNew ? undefined : del}
      title={isNew ? tt("مدينة جديدة", "New city") : tt("تعديل مدينة", "Edit city")}
      backTo={
        <Link to="/admin/cities" className="text-sm text-text-secondary hover:text-text-primary">
          {tt("← المدن", "← Cities")}
        </Link>
      }
    >
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-[10px] px-4 py-3">{error}</p>}

      {isNew && (
        <TextInput
          label={tt("المعرّف (id) — بالإنجليزية بدون مسافات", "Slug id — lowercase, no spaces")}
          value={c.id}
          onChange={(v) => set("id", v)}
          hint={tt("يُترك فارغاً ليُولّد تلقائياً من الاسم.", "Leave empty to auto-generate from the name.")}
        />
      )}

      <BiField
        ar={<TextInput label={tt("الاسم (عربي)", "Name (AR)")} value={c.name} onChange={(v) => set("name", v)} />}
        en={<TextInput label={tt("الاسم (إنجليزي)", "Name (EN)")} value={c.nameEn ?? ""} onChange={(v) => set("nameEn", v)} />}
      />

      <div className="grid md:grid-cols-3 gap-4">
        <SelectInput label={tt("المنطقة", "Region")} value={c.region} onChange={(v) => set("region", v)} options={regionOpts} />
        <SelectInput label={tt("الحالة التاريخية", "Historical status")} value={c.status} onChange={(v) => set("status", v)} options={statusOpts} />
        <SelectInput label={tt("حالة النشر", "Publish status")} value={c.publishStatus ?? "published"} onChange={(v) => set("publishStatus", v)} options={publishStatusOpts} />
      </div>

      <BiField
        ar={<TextInput label={tt("سنة التأسيس (عربي)", "Founded (AR)")} value={c.foundedYear ?? ""} onChange={(v) => set("foundedYear", v)} />}
        en={<TextInput label={tt("سنة التأسيس (إنجليزي)", "Founded (EN)")} value={c.foundedYearEn ?? ""} onChange={(v) => set("foundedYearEn", v)} />}
      />

      <TextInput label={tt("عدد السكان قبل 1948", "Population before 1948")} value={c.populationBefore1948 ?? ""} onChange={(v) => set("populationBefore1948", v)} />

      <BiField
        ar={<TextArea label={tt("وصف مختصر (عربي)", "Short desc (AR)")} value={c.shortDesc} onChange={(v) => set("shortDesc", v)} rows={2} />}
        en={<TextArea label={tt("وصف مختصر (إنجليزي)", "Short desc (EN)")} value={c.shortDescEn ?? ""} onChange={(v) => set("shortDescEn", v)} rows={2} />}
      />
      <BiField
        ar={<TextArea label={tt("الوصف (عربي)", "Description (AR)")} value={c.description} onChange={(v) => set("description", v)} />}
        en={<TextArea label={tt("الوصف (إنجليزي)", "Description (EN)")} value={c.descriptionEn ?? ""} onChange={(v) => set("descriptionEn", v)} />}
      />
      <BiField
        ar={<TextArea label={tt("الجغرافيا (عربي)", "Geography (AR)")} value={c.geography} onChange={(v) => set("geography", v)} />}
        en={<TextArea label={tt("الجغرافيا (إنجليزي)", "Geography (EN)")} value={c.geographyEn ?? ""} onChange={(v) => set("geographyEn", v)} />}
      />
      <BiField
        ar={<TextArea label={tt("التاريخ (عربي)", "History (AR)")} value={c.history} onChange={(v) => set("history", v)} />}
        en={<TextArea label={tt("التاريخ (إنجليزي)", "History (EN)")} value={c.historyEn ?? ""} onChange={(v) => set("historyEn", v)} />}
      />
      <BiField
        ar={<TextArea label={tt("السكان الأصليون (عربي)", "Natives (AR)")} value={c.natives} onChange={(v) => set("natives", v)} />}
        en={<TextArea label={tt("السكان الأصليون (إنجليزي)", "Natives (EN)")} value={c.nativesEn ?? ""} onChange={(v) => set("nativesEn", v)} />}
      />
      <BiField
        ar={<LinesArea label={tt("المزايا (عربي)", "Highlights (AR)")} value={c.highlights} onChange={(v) => set("highlights", v)} />}
        en={<LinesArea label={tt("المزايا (إنجليزي)", "Highlights (EN)")} value={c.highlightsEn ?? []} onChange={(v) => set("highlightsEn", v)} />}
      />
      <BiField
        ar={<TextArea label={tt("سبب التسمية (عربي)", "Naming (AR)")} value={c.naming} onChange={(v) => set("naming", v)} rows={2} />}
        en={<TextArea label={tt("سبب التسمية (إنجليزي)", "Naming (EN)")} value={c.namingEn ?? ""} onChange={(v) => set("namingEn", v)} rows={2} />}
      />
      <BiField
        ar={<TextArea label={tt("التسمية الصهيونية (عربي)", "Zionist name (AR)")} value={c.zionistName} onChange={(v) => set("zionistName", v)} rows={2} />}
        en={<TextArea label={tt("التسمية الصهيونية (إنجليزي)", "Zionist name (EN)")} value={c.zionistNameEn ?? ""} onChange={(v) => set("zionistNameEn", v)} rows={2} />}
      />
      <BiField
        ar={<TextArea label={tt("نبذة (عربي)", "Brief (AR)")} value={c.brief} onChange={(v) => set("brief", v)} rows={2} />}
        en={<TextArea label={tt("نبذة (إنجليزي)", "Brief (EN)")} value={c.briefEn ?? ""} onChange={(v) => set("briefEn", v)} rows={2} />}
      />

      <ImageField
        label={tt("الصورة الرئيسية", "Main image")}
        value={c.image}
        onChange={(v) => set("image", v)}
        genContext={{
          title: c.nameEn || c.name || "",
          description: c.shortDescEn || c.shortDesc || "",
          kind: "city",
        }}
        tt={tt}
      />
      <LinesArea label={tt("معرض الصور (روابط)", "Gallery image URLs")} value={c.gallery ?? []} onChange={(v) => set("gallery", v)} />

      <BiField
        ar={<TextInput label={tt("التاريخ المعروض (عربي)", "Display date (AR)")} value={c.date} onChange={(v) => set("date", v)} />}
        en={<TextInput label={tt("التاريخ المعروض (إنجليزي)", "Display date (EN)")} value={c.dateEn ?? ""} onChange={(v) => set("dateEn", v)} />}
      />
    </FormShell>
  );
}
